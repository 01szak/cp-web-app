import { Component, signal } from '@angular/core';
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
    MatHint,
    MatDatepickerToggle,
    ReactiveFormsModule,
    FormField,
    MatDateRangeInput,
    MatDateRangePicker,
    MatStartDate,
    MatEndDate,
    MatSuffix,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-section>
        <mat-card>
          <img class="map-image" src="/camperpark-map.jpg" alt="camper-park-map" />
        </mat-card>
        <form>
          <mat-form-field>
            <mat-select aria-label="camper place select" [formField]="reservationForm.camperPlace">
              @for (cp of camperPlaces; track cp) {
                <mat-option value="cp">{{ cp }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Wybierz date pobytu</mat-label>
            <mat-date-range-input [dateFilter]="occupiedDateFilter" [rangePicker]="dp">
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
            <mat-hint>DD.MM.YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
            <mat-date-range-picker #dp></mat-date-range-picker>
          </mat-form-field>
        </form>
      </app-section>
    </main>
    <app-footer></app-footer>
  `,
  styles: `
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
  `,
})
export class ReservationPageComponent {
  //TODO get the data from the backend
  protected camperPlaces: string[] = ['1', '2', '3'];
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
