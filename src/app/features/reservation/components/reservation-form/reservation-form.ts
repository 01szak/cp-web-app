import { Component, computed, effect, inject, output, signal, untracked } from '@angular/core';
import { TranslationService } from '../../../../core/services/translation.service';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MatCard } from '@angular/material/card';
import {
  MatCalendarCellClassFunction,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ReservationDTO } from '../../models/reservation.models';
import { ParceoService } from '../../services/parceo.service';
import {
  buildAvailability,
  clampCheckout,
  isDateSelectable,
} from '../../utils/availability';
import { fromIsoDate, toIsoDate } from '../../utils/date';

@Component({
  selector: 'app-reservation-form',
  imports: [
    FaIconComponent,
    MatCard,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatFormField,
    MatHint,
    MatLabel,
    MatOption,
    MatSelect,
    MatStartDate,
    MatSuffix,
    MatTooltip,
    FormField,
    MatError,
    MatProgressSpinner,
  ],
  template: `
    <h3>{{ ts.t.reservation.step1Title }}</h3>
    <form class="form-layout">
      <mat-form-field appearance="outline">
        <mat-label>{{ ts.t.reservation.selectPitch }}</mat-label>
        <mat-select
          aria-label="camper place select"
          [formField]="reservationForm.camperPlace"
          (selectionChange)="onCamperPlaceChange()"
        >
          @if (camperPlacesResource.error()) {
            <mat-option
              ><p>{{ ts.t.error.serverError }}</p></mat-option
            >
          } @else if (camperPlacesResource.isLoading()) {
            <mat-option
              ><p>{{ ts.t.error.loading }}</p></mat-option
            >
          } @else if (camperPlacesResource.value(); as camperPlaces) {
            @for (cp of camperPlaces; track cp.id) {
              <mat-option [value]="cp">
                <p>{{ cp.type.typeName }} {{ cp.index }}</p>
                <p>
                  ({{ ts.t.reservation.pitchPriceLabel }}
                  <strong> {{ cp.price }} {{ ts.t.reservation.currency }}</strong
                  >)
                </p>
              </mat-option>
            }
          }
        </mat-select>

        @if (reservationForm.camperPlace().touched() && isCamperPlaceInvalid()) {
          @for (error of reservationForm.camperPlace().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>
      @if (camperPlaceOccupancyResource.isLoading()) {
        <div class="mat-spinner-wrapper">
          <mat-spinner diameter="60"></mat-spinner>
        </div>
      } @else {
        <mat-form-field class="datepicker" appearance="outline" subscriptSizing="dynamic" (click)="dp.open()">
          <mat-label>
            {{
              isCamperPlaceSelected()
                ? ts.t.reservation.selectDates
                : ts.t.reservation.selectPitchFirst
            }}
          </mat-label>
          <mat-hint>{{ ts.t.reservation.disabledDatesHint }}</mat-hint>

          <mat-date-range-input
            [dateFilter]="occupiedDateFilter()"
            [rangePicker]="dp"
            [disabled]="true"
          >
            <input
              matStartDate
              (dateChange)="onStartDateChange($event.value)"
              [formField]="reservationForm.checkin"
            />
            <input
              matEndDate
              (dateChange)="onEndDateChange($event.value)"
              [formField]="reservationForm.checkout"
            />
          </mat-date-range-input>
          <mat-datepicker-toggle #toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
          <mat-date-range-picker
            [dateClass]="dateClass"
            #dp
            [disabled]="!isCamperPlaceSelected()"
            touchUi
          ></mat-date-range-picker>

          @if (camperPlaceOccupancyResource.error()) {
            <mat-error>{{ ts.t.error.serverError }}</mat-error>
          } @else if (
            (reservationForm.checkin().touched() || reservationForm.checkout().touched()) &&
            (isCheckinInvalid() || isCheckoutInvalid())
          ) {
            <mat-error>{{ ts.t.reservation.invalidDateRange }}</mat-error>
          }
        </mat-form-field>
      }

      <div class="final-price-wrapper">
        <div class="final-price-text-wrapper">
          <fa-icon
            [icon]="['fas', 'circle-question']"
            [matTooltip]="ts.t.reservation.priceTooltip"
          ></fa-icon>
          <p class="final-price-text">{{ ts.t.reservation.suggestedPrice }}</p>
        </div>
        <mat-card class="final-price-number">
          @if (calculatedPriceResource.isLoading()) {
            <div class="mat-spinner-wrapper">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          }
          @if (calculatedPriceResource.value(); as calcPrice) {
            <p class="final-price-text">
              <strong>{{ calcPrice }} {{ ts.t.reservation.currency }}</strong>
            </p>
          }
        </mat-card>
        @if (calculatedPriceResource.error()) {
          <p>{{ ts.t.error.serverError }}</p>
        }
      </div>
    </form>
  `,
  styles: `
    .gap {
      gap: 20px;
    }

    .final-price-text-wrapper {
      display: flex;
      flex-direction: row;
      gap: 5px;
    }
    fa-icon:hover {
      cursor: pointer;
    }
    .final-price-text {
      margin: 0;
      text-align: center;
    }
    .final-price-number {
      width: 100%;
      height: 100%;
      width: 70px;
      height: 70px;
      padding: 10px;
      display: grid;
      align-items: center;
    }

    .final-price-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
    }
  `,
})
export class ReservationForm {
  protected readonly ts = inject(TranslationService);
  private readonly faIconLibrary = inject(FaIconLibrary);
  private readonly parceo = inject(ParceoService);

  protected formValid = output<boolean>();
  protected formValue = output<ReservationDTO>();

  private availability = computed(() =>
    buildAvailability(this.camperPlaceOccupancyResource.value() ?? []),
  );

  constructor() {
    effect(() => {
      this.formValid.emit(this.areAllFieldsValid());
      this.formValue.emit(this.reservationModel());
    });

    // Re-check the selected range against the freshly loaded occupancy data
    // (e.g. after switching camper place). No-op while no dates are selected.
    effect(() => {
      this.availability();
      untracked(() => this.validateDateRange());
    });
  }

  public ngOnInit() {
    this.faIconLibrary.addIcons(faCircleQuestion);
  }

  protected camperPlacesResource = this.parceo.camperPlaces();

  protected selectedCamperPlaceId = computed(() => {
    return this.reservationModel().camperPlace?.id ?? null;
  });

  protected camperPlaceOccupancyResource = this.parceo.camperPlaceOccupancy(() =>
    this.selectedCamperPlaceId(),
  );

  // Invalid range (e.g. checkin === checkout) is sent as empty dates so no price request is made.
  protected calculatedPriceResource = this.parceo.calculatedPrice(() => {
    const { camperPlace, checkin, checkout } = this.reservationModel();
    const isRangeValid = !this.isCheckinInvalid() && !this.isCheckoutInvalid();

    return {
      cpId: camperPlace?.id,
      checkin: isRangeValid ? checkin : null,
      checkout: isRangeValid ? checkout : null,
    };
  });

  protected reservationModel = signal<ReservationDTO>({
    camperPlace: null,
    checkin: null,
    checkout: null,
    guest: null,
    paid: false,
  } as ReservationDTO);

  protected reservationForm = form(this.reservationModel, (schema) => {
    required(schema.camperPlace, { message: this.ts.t.reservation.validation.pitchRequired });
    required(schema.checkin, { message: this.ts.t.reservation.validation.checkinRequired });
    required(schema.checkout, { message: this.ts.t.reservation.validation.checkoutRequired });
    validate(schema.checkout, ({ value, valueOf }) => {
      if (value() === valueOf(schema.checkin)) {
        return {
          kind: 'equalDatesProhibited',
        };
      }
      return null;
    });
  });

  protected isCamperPlaceInvalid = computed(() => this.reservationForm.camperPlace().invalid());
  protected isCheckinInvalid = computed(() => this.reservationForm.checkin().invalid());
  protected isCheckoutInvalid = computed(() => this.reservationForm.checkout().invalid());

  protected areAllFieldsValid = computed(() => {
    return (
      this.reservationForm.camperPlace().valid() &&
      this.reservationForm.checkin().valid() &&
      this.reservationForm.checkout().valid()
    );
  });

  protected isCamperPlaceSelected() {
    return this.reservationModel().camperPlace !== null;
  }

  // New function reference on every selection change: the calendar only rebuilds its cells
  // when the filter reference changes, and arrival edges become enabled once a start is picked.
  protected occupiedDateFilter = computed(() => {
    const availability = this.availability();
    const { checkin, checkout } = this.reservationModel();

    return (date: Date | null) =>
      isDateSelectable(date ?? new Date(), availability, checkin, checkout);
  });

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view !== 'month') return '';

    return this.availability().edges.has(toIsoDate(cellDate)) ? 'edge-calendar-date' : '';
  };

  protected onCamperPlaceChange() {
    // Drop the previous place's range so it can't be retained or submitted.
    this.reservationModel.update((model) => ({
      ...model,
      checkin: null,
      checkout: null,
    }));

    // Reload occupancy; the constructor effect revalidates the (now empty)
    // range once the refreshed data for the new place is available.
    this.camperPlaceOccupancyResource.reload();
  }

  // TODO inform the user about date shift
  protected onStartDateChange(value: Date | null) {
    this.reservationModel.update((model) => ({
      ...model,
      checkin: value ? toIsoDate(value) : null,
    }));
    this.validateDateRange();
  }

  // Picking a new start clears the end (null), which keeps the picker in its "pending start" state.
  protected onEndDateChange(value: Date | null) {
    this.reservationModel.update((model) => ({
      ...model,
      checkout: value ? toIsoDate(value) : null,
    }));
    this.validateDateRange();
  }

  protected validateDateRange() {
    const { checkin, checkout } = this.reservationModel();
    if (!checkin || !checkout) return;

    const clampedCheckout = toIsoDate(
      clampCheckout(fromIsoDate(checkin), fromIsoDate(checkout), this.availability()),
    );
    if (clampedCheckout === checkout) return;

    this.reservationModel.update((model) => ({ ...model, checkout: clampedCheckout }));
  }
}
