import { Component, inject, OnInit, signal } from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import {MatOption, MatSelect, MatSuffix } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel} from '@angular/material/form-field';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import {ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReservationForm } from '../components/reservation-form/reservation-form';
import { GuestFormComponent } from '../components/guest-form.component/guest-form.component';

@Component({
  selector: 'app-reservation-page',
  imports: [
    FooterComponent,
    NavbarComponent,
    SectionComponent,
    MatCard,
    ReactiveFormsModule,
    MatInputModule,
    ReservationForm,
    GuestFormComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-section [variant]="'light'">
        <div>
          @if (!isFormEnabled) {
            <div>
              <h3>Tu możesz dokonać rezerwacji swojego pobytu</h3>
              <p>Poniżej znajduje się mapę naszego obiektu.</p>
              <p>
                Kliknij przycisk
                <strong>'Przejdź do rezerwacji'</strong> aby wypełnić formularz
              </p>
            </div>

            <mat-card>
              <img class="map-image" src="/camperpark-map.jpg" alt="camper-park-map" />
            </mat-card>

            <button class="btn-primary" (click)="enableForm()">Przejdź do rezerwacji</button>
          } @else {
            <mat-card class="form-container ">
              <div class="form-content">
                @if (!isSecondForm) {
                  <app-reservation-form />
                } @else {
                  <app-guest-form />
                }
              </div>
            </mat-card>

            <section class="form-btn-section">
              <button class="btn-outline" (click)="isSecondForm ? switchForms() : enableForm()">
                Cofnij
              </button>

              <button
                class="btn-primary"
                (click)="isSecondForm ? createReservation() : switchForms()"
              >
                {{ isSecondForm ? 'Wyślij' : 'Kontynuuj' }}
              </button>
            </section>
          }
        </div>
      </app-section>
    </main>
    <app-footer></app-footer>
  `,
  styles: `
    .form-content {
      height: 100%;
      padding: 20px 10px 10px 10px;
    }

    .form-container {
      width: 100%;
      height: 100%;
      background-color: var(--color-bg-light-soft);
      padding: 10px 15px 10px 15px;
      max-width: 800px;
      min-height: 500px;
      place-self: center;
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
  `,
})
export class ReservationPageComponent {
  protected isSecondForm: boolean = false;

  protected isFormEnabled: boolean = false;

  protected switchForms() {
    this.isSecondForm = !this.isSecondForm;
  }

  protected routeToHomePage() {}

  protected createReservation() {}

  protected enableForm() {
    this.isFormEnabled = !this.isFormEnabled;
  }
}
