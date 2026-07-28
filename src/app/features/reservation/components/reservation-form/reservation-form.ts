import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { TranslationService } from '../../../../core/services/translation.service';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MatCard } from '@angular/material/card';
import {
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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import { ReservationDTO } from '../../reservation-page/reservation-page.component';

export interface CamperPlaceTypeDTO {
  id: number;
  typeName: string;
  price: number;
}

export interface CamperPlaceDTO {
  id: number;
  index: string;
  type: CamperPlaceTypeDTO;
  price: number;
}

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
    <form class="form-layout gap">
      <mat-form-field appearance="outline">
        <mat-label>{{ ts.t.reservation.selectPitch }}</mat-label>
        <mat-select
          aria-label="camper place select"
          [formField]="reservationForm.camperPlace"
          (selectionChange)="camperPlaceOccupancyResource.reload()"
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
        <mat-form-field class="datepicker" appearance="outline" (click)="dp.open()">
          <mat-label>
            {{
              isCamperPlaceSelected()
                ? ts.t.reservation.selectDates
                : ts.t.reservation.selectPitchFirst
            }}
          </mat-label>
          <mat-hint>{{ ts.t.reservation.disabledDatesHint }}</mat-hint>

          <mat-date-range-input
            [dateFilter]="occupiedDateFilter"
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
          <mat-date-range-picker #dp [disabled]="!isCamperPlaceSelected()"></mat-date-range-picker>

          @if (camperPlaceOccupancyResource.error()) {
            <mat-error>{{ ts.t.error.serverError }}</mat-error>
          }
          @else if (
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

    ::ng-deep .mat-mdc-form-field.mat-form-field-disabled {
      opacity: 1 !important;

      cursor: default;

      --mdc-outlined-text-field-disabled-border-color: var(--mdc-outlined-text-field-outline-color);

      --mdc-outlined-text-field-disabled-label-text-color: var(
        --mdc-outlined-text-field-label-text-color
      );

      --mdc-outlined-text-field-disabled-input-text-color: var(
        --mdc-outlined-text-field-input-text-color
      );

      --mdc-outlined-text-field-disabled-leading-icon-color: var(
        --mdc-outlined-text-field-leading-icon-color
      );

      --mdc-outlined-text-field-disabled-trailing-icon-color: var(
        --mdc-outlined-text-field-trailing-icon-color
      );

      --mat-form-field-state-disabled-outline-color: var(--mat-form-field-state-outline-color);

      --mat-form-field-state-disabled-label-color: var(--mat-form-field-state-label-color);

      --mat-form-field-state-disabled-input-color: var(--mat-form-field-state-input-color);

      .mat-mdc-input-element:disabled,
      .mat-date-range-input-inner:disabled {
        color: var(
          --mdc-outlined-text-field-input-text-color,
          var(--mat-form-field-state-input-color, rgba(0, 0, 0, 0.87))
        ) !important;

        -webkit-text-fill-color: var(
          --mdc-outlined-text-field-input-text-color,
          var(--mat-form-field-state-input-color, rgba(0, 0, 0, 0.87))
        ) !important;

        cursor: default;
      }

      .mat-date-range-input-separator {
        color: var(
          --mdc-outlined-text-field-input-text-color,
          var(--mat-form-field-state-input-color, rgba(0, 0, 0, 0.87))
        ) !important;
      }

      .mdc-notched-outline__leading,
      .mdc-notched-outline__notch,
      .mdc-notched-outline__trailing {
        border-color: var(
          --mdc-outlined-text-field-outline-color,
          var(--mat-form-field-state-outline-color, rgba(0, 0, 0, 0.38))
        ) !important;
      }

      .mat-mdc-floating-label {
        color: var(
          --mdc-outlined-text-field-label-text-color,
          var(--mat-form-field-state-label-color, rgba(0, 0, 0, 0.6))
        ) !important;
      }
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
  private readonly httpClient = inject(HttpClient);

  protected formValid = output<boolean>();
  protected formValue = output<ReservationDTO>();

  private camperPlaceOccupancy: null | Date[] = null;

  constructor() {
    effect(() => {
      this.formValid.emit(this.areAllFieldsValid());
      this.formValue.emit(this.reservationModel());
    });
  }

  public ngOnInit() {
    this.faIconLibrary.addIcons(faCircleQuestion);
  }

  protected camperPlacesResource = rxResource({
    stream: () =>
      this.httpClient.get<CamperPlaceDTO[]>('/api/camperPlace', {
        headers: new HttpHeaders().set('Accept', 'application/json'),
      }),
  });

  protected selectedCamperPlaceId = computed(() => {
    return this.reservationModel().camperPlace?.id ?? null;
  });

  protected camperPlaceOccupancyResource = rxResource({
    params: () => this.selectedCamperPlaceId,
    stream: ({ params }) => {
      if (!params()) return of([]);

      return this.httpClient.get<string[]>(`/api/camperPlace/occupancy/${params()}`, {
        headers: new HttpHeaders().set('Accept', 'application/json'),
      });
    },
  });

  protected calculatedPriceResource = rxResource({
    params: () => ({
      cpId: this.reservationModel().camperPlace?.id,
      checkin: this.reservationModel().checkin,
      checkout: this.reservationModel().checkout,
    }),
    stream: ({ params }) => {
      if (!params.cpId || !params.checkin || !params.checkout) return of('');
      return this.httpClient.get<string>(
        `/api/camperPlace/calcPrice/${params.cpId}/${params.checkin}/${params.checkout}`,
        {
          headers: new HttpHeaders().set('Accept', 'application/json'),
        },
      );
    },
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

  equalDatesError = computed(() => {
    const errors = this.reservationForm().errors();
    if (!Array.isArray(errors)) return null;

    return errors.find((err: any) => err.kind === 'equalDatesProhibited') || null;
  });

  private selectedStartDate: Date | null = null;
  private selectedEndDate: Date | null = null;

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

  protected occupiedDateFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    const dateStr = this.getLocalDate(date);

    const occupiedDates = this.camperPlaceOccupancyResource.value() || [];

    return (
      date.getTime() >=
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() &&
      !occupiedDates!.includes(dateStr)
    );
  };

  private getLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // TODO inform the user about date shift
  protected onStartDateChange(value: Date) {
    this.selectedStartDate = value;
    this.reservationModel.update((model) => ({
      ...model,
      checkin: this.getLocalDate(value),
    }));
    this.validateDateRange();
  }

  protected onEndDateChange(value: Date) {
    this.selectedEndDate = value;
    this.reservationModel.update((model) => ({
      ...model,
      checkout: this.getLocalDate(value),
    }));
    this.validateDateRange();
  }

  protected validateDateRange() {
    if (!this.selectedEndDate || !this.selectedStartDate) return;

    const msInDay = 1000 * 60 * 60 * 24;
    const daysBetween = Math.round(
      (this.selectedEndDate.getTime() - this.selectedStartDate.getTime()) / msInDay,
    );

    for (let i = 0; i <= daysBetween; i++) {
      const checkingDate = new Date(this.selectedStartDate);
      checkingDate.setDate(checkingDate.getDate() + i);

      if (!this.occupiedDateFilter(checkingDate)) {
        const maxValidDate = new Date(checkingDate);
        maxValidDate.setDate(checkingDate.getDate() - 1);

        this.reservationModel.update((r) => ({
          ...r,
          checkout: this.getLocalDate(maxValidDate),
        }));
        this.selectedEndDate = maxValidDate;

        return;
      }
    }
  }
}
