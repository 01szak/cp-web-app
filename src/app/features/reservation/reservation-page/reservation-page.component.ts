import { Component, inject, OnInit, signal, SimpleChanges } from '@angular/core';
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
          } @else if (isAuthoriseMessage) {
            <div class="final-info">
              <h3>Na podany adres został wysłany mail weryfikacyjny</h3>
              <p>
                Nie dostałeś maila? Odczekaj {{ resendEmailRemainingSeconds() }} sekund i spróbuj
                ponownie
              </p>
              <button
                class="btn-outline"
                (click)="createReservation()"
                [disabled]="resendEmailRemainingSeconds() !== 0"
              >
                Wyślij ponownie
              </button>
            </div>
          } @else {
            <mat-card class="form-container ">
              <div class="form-content">
                @if (!isGuestForm) {
                  <app-reservation-form
                    (formValid)="isReservationFormValid.set($event)"
                    (formValue)="reservationForm.set($event)"
                  />
                } @else {
                  <app-guest-form
                    (formValid)="isGuestFormValid.set($event)"
                    (formValue)="guestForm.set($event)"
                  />
                }
              </div>
            </mat-card>

            <section class="form-btn-section">
              <button class="btn-outline" (click)="isGuestForm ? switchForms() : enableForm()">
                Cofnij
              </button>

              <button
                class="btn-primary"
                (click)="isGuestForm ? createReservation() : switchForms()"
                [disabled]="isGuestForm ? !isGuestFormValid() : !isReservationFormValid()"
              >
                {{ isGuestForm ? 'Wyślij' : 'Kontynuuj' }}
              </button>
            </section>
          }
        </div>
        @if (wipOutput !== '') {
          {{ wipOutput }}
        }
      </app-section>
    </main>
    <app-footer></app-footer>
  `,
  styles: `
    .final-info {
      width: 100%;
      height: 100%;
      padding: 10px;
      border: solid 1px black;
    }

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
  protected isGuestForm: boolean = false;
  protected isFormEnabled: boolean = false;
  protected isAuthoriseMessage: boolean = false;
  protected isReservationFormValid = signal<boolean>(false);
  protected isGuestFormValid = signal<boolean>(false);
  protected reservationForm = signal<any>(null);
  protected guestForm = signal<any>(null);
  protected resendEmailRemainingSeconds = signal<number>(60);

  protected wipOutput = '';

  protected switchForms() {
    this.isGuestForm = !this.isGuestForm;
  }

  protected createReservation() {
    const payload = {
      ...this.reservationForm(),
      ...this.guestForm(),
    };
    this.wipOutput = JSON.stringify(payload);
    this.isAuthoriseMessage = true;
    this.startResendCounter();
  }

  protected enableForm() {
    this.isFormEnabled = !this.isFormEnabled;
  }

  private startResendCounter() {
    this.resendEmailRemainingSeconds.set(60);

    const intervalId = setInterval(() => {
      this.resendEmailRemainingSeconds.update(v => v - 1);
      console.log(this.resendEmailRemainingSeconds);

      if (this.resendEmailRemainingSeconds() <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);
  }
}
