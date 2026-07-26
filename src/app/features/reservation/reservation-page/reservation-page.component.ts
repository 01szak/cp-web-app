import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import { MatCard } from '@angular/material/card';
import {ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CamperPlaceDTO, ReservationForm } from '../components/reservation-form/reservation-form';
import { GuestFormComponent } from '../components/guest-form.component/guest-form.component';
import { TranslationService } from '../../../core/services/translation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

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
              <h2>{{ ts.t.reservation.introTitle }}</h2>
              <p>{{ ts.t.reservation.introDesc }}</p>
            </div>

            <mat-card>
              <img class="map-image" src="/camperpark-map.jpg" alt="camper-park-map" />
            </mat-card>

            <button class="btn-primary" (click)="enableForm()">
              {{ ts.t.reservation.startBtn }}
            </button>
          } @else {
            <mat-card class="form-container">
              <div class="form-content">
                <div class="form-slider-wrapper">
                  <div
                    class="form-slider"
                    [class.slide-step-1]="!isGuestForm && !isAuthoriseMessage"
                    [class.slide-step-2]="isGuestForm && !isAuthoriseMessage"
                    [class.slide-step-3]="isAuthoriseMessage"
                  >
                    <div class="slide-pane">
                      <app-reservation-form
                        (formValid)="isReservationFormValid.set($event)"
                        (formValue)="reservationForm.set($event)"
                      />
                    </div>
                    <div class="slide-pane">
                      <app-guest-form
                        (formValid)="isGuestFormValid.set($event)"
                        (formValue)="guestForm.set($event)"
                      />
                    </div>
                    <div class="slide-pane verification-pane">
                      <div>
                        <h2>{{ ts.t.reservation.verificationTitle }}</h2>
                        <h3>{{ ts.t.reservation.verificationDesc }}</h3>
                      </div>
                      <div class="confirmation-buttons">
                        <p>
                          {{ ts.t.reservation.noEmailPrefix }}
                          <strong>{{ resendEmailRemainingSeconds() }}</strong>
                          {{ ts.t.reservation.noEmailSuffix }}
                        </p>
                        <button
                          class="btn-outline"
                          (click)="createReservation()"
                          [disabled]="resendEmailRemainingSeconds() !== 0"
                        >
                          {{ ts.t.reservation.resendBtn }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card>

            @if (!isAuthoriseMessage) {
              <section class="form-btn-section">
                <button class="btn-outline" (click)="isGuestForm ? switchForms() : enableForm()">
                  {{ ts.t.reservation.backBtn }}
                </button>

                <button
                  class="btn-primary"
                  (click)="isGuestForm ? createReservation() : switchForms()"
                  [disabled]="isGuestForm ? !isGuestFormValid() : !isReservationFormValid()"
                >
                  {{ isGuestForm ? ts.t.reservation.sendBtn : ts.t.reservation.nextBtn }}
                </button>
              </section>
            }
          }
        </div>
        <!--        @if (wipOutput !== '') {-->
        <!--          {{ wipOutput }}-->
        <!--        }-->
      </app-section>
    </main>
    <app-footer></app-footer>
  `,
  styles: `
    .confirmation-buttons {
      width: 100%;
    }

    .confirmation-dialog {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .final-info {
      width: 100%;
      height: 100%;
      padding: 10px;
      border: solid 1px black;
      padding: 10px;
    }

    .form-content {
      height: 100%;
      padding: 0;
      overflow: hidden;
    }

    .form-container {
      width: 100%;
      height: 100%;
      background-color: var(--color-bg-light-soft);
      padding: 10px 15px 10px 15px;
      max-width: 800px;
      min-height: 500px;
      place-self: center;
      overflow: hidden;
    }

    .form-slider-wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .form-slider {
      display: flex;
      width: 300%;
      height: 100%;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }

    .slide-pane {
      width: 33.333%;
      height: 100%;
      flex-shrink: 0;
      box-sizing: border-box;
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.5s ease,
        visibility 0.5s ease;
      padding: 20px 10px 10px 10px;
    }

    .verification-pane {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 15px;
      height: 100%;
    }

    @media (min-width: 768px) {
      .verification-pane {
        flex-direction: row;
        gap: 10px;
      }
    }

    .form-slider.slide-step-1 {
      transform: translateX(0%);
    }

    .form-slider.slide-step-2 {
      transform: translateX(-33.333%);
    }

    .form-slider.slide-step-3 {
      transform: translateX(-66.666%);
    }

    .form-slider.slide-step-1 .slide-pane:nth-child(1),
    .form-slider.slide-step-2 .slide-pane:nth-child(2),
    .form-slider.slide-step-3 .slide-pane:nth-child(3) {
      opacity: 1;
      visibility: visible;
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
export class ReservationPageComponent implements OnDestroy {
  protected readonly ts = inject(TranslationService);
  private readonly httpClient = inject(HttpClient);

  protected isGuestForm: boolean = false;
  protected isFormEnabled: boolean = false;
  protected isAuthoriseMessage: boolean = false;
  protected isReservationFormValid = signal<boolean>(false);
  protected isGuestFormValid = signal<boolean>(false);
  protected reservationForm = signal<any>(null);
  protected guestForm = signal<any>(null);
  protected resendEmailRemainingSeconds = signal<number>(60);
  private resendIntervalId: any = null;
  protected wipOutput = '';

  protected switchForms() {
    this.isGuestForm = !this.isGuestForm;
  }

  protected createReservation() {
    const payload = {
      ...this.reservationForm(),
      ...this.guestForm(),
    };
    this.createReservationResource.reload();
    this.wipOutput = JSON.stringify(payload);
    this.isAuthoriseMessage = true;
    this.startResendCounter();
  }

  protected enableForm() {
    this.isFormEnabled = !this.isFormEnabled;
  }

  ngOnDestroy() {
    if (this.resendIntervalId) {
      clearInterval(this.resendIntervalId);
    }
  }

  private createReservationResource = rxResource({
    params: () => this.reservationForm() + this.guestForm(),
    stream: ({ params }) => {
      if (!this.isReservationFormValid() && !this.isGuestFormValid()) return of(null);
        console.log(params);
      return this.httpClient.post('/api/reservation', params, {
        headers: new HttpHeaders().set('Accept', 'application/json'),
      });
    },
  });

  private startResendCounter() {
    if (this.resendIntervalId) {
      clearInterval(this.resendIntervalId);
    }
    this.resendEmailRemainingSeconds.set(60);

    this.resendIntervalId = setInterval(() => {
      this.resendEmailRemainingSeconds.update((v) => v - 1);
      console.log(this.resendEmailRemainingSeconds);

      if (this.resendEmailRemainingSeconds() <= 0) {
        clearInterval(this.resendIntervalId);
        this.resendIntervalId = null;
      }
    }, 1000);
  }
}
