import { Component, inject, OnInit, signal } from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import {MatOption, MatSelect, MatSuffix } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel, MatHint} from '@angular/material/form-field';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import {ReactiveFormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { MatIcon } from '@angular/material/icon';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-reservation-page',
  imports: [
    FooterComponent,
    NavbarComponent,
    SectionComponent,
    MatSelect,
    MatOption,
    MatCard,
    MatFormField,
    MatLabel,
    MatDatepickerToggle,
    ReactiveFormsModule,
    FormField,
    MatDateRangeInput,
    MatDateRangePicker,
    MatStartDate,
    MatEndDate,
    MatSuffix,
    FaIconComponent,
    MatTooltip,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-section>
        <mat-card>
          <img class="map-image" src="/camperpark-map.jpg" alt="camper-park-map" />
        </mat-card>
        <form>
          <mat-form-field appearance="outline">
            <mat-label>Wybierz parcele</mat-label>
            <mat-select aria-label="camper place select" [formField]="reservationForm.camperPlace">
              @for (cp of camperPlaces; track cp) {
                <mat-option value="cp" [value]="cp.name">
                  <p>parcela: {{ cp.name }}</p>
                  <p>
                    (cena za dobe: <strong> {{ cp.price }} zł</strong>)
                  </p>
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field class="datepicker" appearance="outline">
            <mat-label>Kliknij ikonę aby wybrać czas pobytu</mat-label>
            <mat-date-range-input
              [dateFilter]="occupiedDateFilter"
              [rangePicker]="dp"
              [disabled]="true"
            >
              <input
                matStartDate
                (dateChange)="onStartDateChange($event.value)"
                [formField]="reservationForm.checkinDate"
              />
              <input
                matEndDate
                (dateChange)="onEndDateChange($event.value)"
                [formField]="reservationForm.checkoutDate"
              />
            </mat-date-range-input>
            <mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
            <mat-date-range-picker #dp [disabled]="false"></mat-date-range-picker>
          </mat-form-field>
        </form>
        <div class="final-price-wrapper">
          <div class="final-price-text-wrapper">
            <fa-icon [icon]="['fas', 'circle-question']" matTooltip="Przedstawiona cena jest tylko ceną poglądową, na poziomie rezerwacji online nie uiszczasz żadnych opłat, zostaną one pobrane dopiero na miejscu przy kasie"></fa-icon>
            <p class="final-price-text">Sugerowana cena:</p>
          </div>
          <mat-card class="final-price-number">
            <p class="final-price-text">
              <strong>{{ calculatedPrice }} zł</strong>
            </p>
          </mat-card>
        </div>
        <button></button>
      </app-section>
    </main>
    <app-footer></app-footer>
  `,
  styles: `
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
      max-width: 70px;
      max-height: 70px;
      padding: 10px;
    }
    .final-price-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
    }

    form {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      gap: 10px;
    }

    .background {
      width: 100%;
      height: 100%;
      max-height: 700px;
      max-width: 400px;
      background: white;
      padding: 3px;
      border-radius: 12px;
    }

    .map-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      clip-path: inset(2%);
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
  `,
})
export class ReservationPageComponent implements OnInit {
  private readonly faIconLibrary = inject(FaIconLibrary);

  public ngOnInit() {
    this.faIconLibrary.addIcons(faCircleQuestion);
  }

  //TODO get the data from the backend
  protected camperPlaces: { name: string; price: number }[] = [
    { name: '1', price: 100 },
    { name: '2', price: 134 },
    { name: '3', price: 115 },
  ];
  protected reservationModel = signal<{
    camperPlace: string;
    checkinDate: Date | null;
    checkoutDate: Date | null;
  }>({
    camperPlace: '',
    checkinDate: null,
    checkoutDate: null,
  });
  protected reservationForm = form(this.reservationModel, (schema) => {
    required(schema);
  });

  private selectedStartDate: Date | null = null;
  private selectedEndDate: Date | null = null;

  protected occupiedDateFilter = (d: Date | null): boolean => {
    //TODO get the data from the backend
    const date = d || new Date();
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
  protected calculatedPrice: number = 12;

  protected onStartDateChange(value: Date | null) {
    this.selectedStartDate = value;
    this.validateDateRange();
  }

  protected onEndDateChange(value: Date | null) {
    this.selectedEndDate = value;
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
        this.reservationModel.update((r) => ({ ...r, checkoutDate: maxValidDate }));
        //TODO add alert warning about changed date
        return;
      }
    }
    return;
  }
}
