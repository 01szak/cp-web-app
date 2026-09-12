import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import { MatCard } from '@angular/material/card';
import { CamperPlaceDTO, ReservationForm } from '../components/reservation-form/reservation-form';
import { GuestFormComponent } from '../components/guest-form.component/guest-form.component';
import { TranslationService } from '../../../core/services/translation.service';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ParceoService } from '../services/parceo.service';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';

@Component({
  selector: 'app-reservation-page',
  imports: [
    FooterComponent,
    NavbarComponent,
    SectionComponent,
    MatCard,
    ReservationForm,
    GuestFormComponent,
    MatProgressSpinner,
    FaIconComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-section [variant]="'light'">
        <div>
          @switch (currentView) {
            @case ('START') {
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
            }
            @case ('FORM') {
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
                      @if (createReservationResource.isLoading()) {
                        <div class="slide-pane verification-pane">
                          <div class="mat-spinner-wrapper">
                            <mat-spinner diameter="60"></mat-spinner>
                          </div>
                          <p class="status-text">{{ ts.t.error.loading }}</p>
                        </div>
                      } @else if (createReservationResource.error()) {
                        <div class="slide-pane verification-pane">
                          <div class="status-message status-message--error">
                            <fa-icon [icon]="['fas', 'triangle-exclamation']" class="status-icon" />
                            <p class="status-title">{{ ts.t.error.reservationError1 }}</p>
                            <p class="status-text">{{ ts.t.error.reservationError2 }}</p>
                          </div>
                          <div class="confirmation-buttons">
                            <button class="btn-primary" (click)="createReservationResource.reload()">
                              {{ ts.t.reservation.retryBtn }}
                            </button>
                            <button class="btn-outline" (click)="returnToForm()">
                              {{ ts.t.reservation.backBtn }}
                            </button>
                          </div>
                        </div>
                      } @else {
                        <div class="slide-pane verification-pane">
                          <div class="status-message status-message--success">
                            <fa-icon [icon]="['fas', 'circle-check']" class="status-icon" />
                            <p class="status-title">{{ ts.t.reservation.verificationTitle }}</p>
                            <p class="status-text">{{ ts.t.reservation.verificationDesc }}</p>
                          </div>
                          <div class="confirmation-buttons">
                            <p class="resend-text">
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
                      }
                    </div>
                  </div>
                </div>
                @if (!isAuthoriseMessage) {
                  <section class="form-btn-section">
                    <button
                      class="btn-outline"
                      (click)="isGuestForm ? switchForms() : (currentView = 'START')"
                    >
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
              </mat-card>
            }
            @case ('VERIFY_MESSAGE') {
              <mat-card class="form-container verification-pane">
                @if (verifyTargetIdResource.isLoading()) {
                  <div class="mat-spinner-wrapper">
                    <mat-spinner></mat-spinner>
                  </div>
                } @else if (verifyTargetIdResource.error()) {
                  <div class="status-message status-message--error">
                    <fa-icon [icon]="['fas', 'triangle-exclamation']" class="status-icon" />
                    <p class="status-title">{{ ts.t.error.serverError }}</p>
                    <p class="status-text">{{ ts.t.error.reservationError2 }}</p>
                  </div>
                } @else {
                  <div class="status-message status-message--success">
                    <fa-icon [icon]="['fas', 'circle-check']" class="status-icon" />
                    <p class="status-title">{{ ts.t.reservation.verifySuccessTitle }}</p>
                    <p class="status-text">{{ ts.t.reservation.verifySuccessDesc }}</p>
                  </div>
                }
              </mat-card>
            }
          }
          @if (isGuestForm) {
            <div class="warning-info">
              <p>
                {{ ts.t.reservation.warningInfo.prefix }}
                <button type="button" (click)="openRulesPopup()" class="warning-info-link">
                  {{ ts.t.reservation.warningInfo.linkText }}
                </button>
                {{ ts.t.reservation.warningInfo.suffix }}
              </p>
            </div>
          }
        </div>
      </app-section>
    </main>
    <app-footer></app-footer>

    @if (isRulesPopupOpen()) {
      <div class="rules-popup-overlay" (click)="closeRulesPopup()">
        <div class="rules-popup" (click)="$event.stopPropagation()">
          <h2>{{ ts.t.reservation.warningInfo.popup.title }}</h2>
          <p>{{ ts.t.reservation.warningInfo.popup.body }}</p>
          <button class="btn-primary" (click)="closeRulesPopup()">
            {{ ts.t.reservation.warningInfo.popup.close }}
          </button>
        </div>
      </div>
    }
  `,
  styles: `
    .warning-info-link {
      padding: 0;
      border: none;
      background: none;
      font: inherit;
      color: blue;
      &:hover {
        cursor: pointer;
      }
    }

    .warning-info {
      text-align: center;
    }

    .confirmation-buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
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
      justify-content: center;
      align-items: center;
      gap: 20px;
      height: 100%;
    }

    .status-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.6rem;
      padding: var(--spacing-xs);
    }

    .status-icon {
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      font-size: 1.4rem;
    }

    .status-message--success .status-icon {
      background: var(--color-accent-gold-disabled);
      color: var(--color-accent-gold);
    }

    .status-message--error .status-icon {
      background: rgb(180 95 44 / 0.12);
      color: var(--color-accent-warm);
    }

    .status-title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--color-text-dark);
    }

    .status-text {
      margin: 0;
      font-size: 0.9rem;
      color: var(--color-text-dark);
      opacity: 0.7;
      max-width: 34ch;
    }

    .resend-text {
      text-align: center;
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

    .rules-popup-overlay {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgb(0 0 0 / 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--spacing-sm);
      box-sizing: border-box;
    }

    .rules-popup {
      background-color: var(--color-bg-light-soft);
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      max-height: 100%;
      overflow-y: auto;
      padding: var(--spacing-md);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .rules-popup button {
      align-self: center;
    }
  `,
})
export class ReservationPageComponent implements OnDestroy {
  protected readonly ts = inject(TranslationService);
  private readonly parceo = inject(ParceoService);
  private readonly route = inject(ActivatedRoute);
  private readonly faIconLibrary = inject(FaIconLibrary);

  protected isGuestForm: boolean = false;
  protected isFormEnabled: boolean = false;
  protected isAuthoriseMessage: boolean = false;
  protected isReservationFormValid = signal<boolean>(false);
  protected isGuestFormValid = signal<boolean>(false);
  protected reservationForm = signal<ReservationDTO>({} as ReservationDTO);
  protected guestForm = signal<GuestDTO>({} as GuestDTO);
  protected resendEmailRemainingSeconds = signal<number>(60);
  protected reservationRequest = signal<ReservationDTO | null>(null);
  protected isRulesPopupOpen = signal<boolean>(false);
  protected wipOutput = '';
  protected currentView: 'START' | 'FORM' | 'AUTH_MESSAGE' | 'VERIFY_MESSAGE' = 'START';

  private resendIntervalId: any = null;
  private verifyTargetId: string | null = null;

  protected switchForms() {
    this.isGuestForm = !this.isGuestForm;
  }

  protected createReservation() {
    if (!this.isReservationFormValid() || !this.isGuestFormValid()) return;

    const payload = this.buildReservationDTO(this.guestForm(), this.reservationForm());
    this.reservationRequest.set(payload);
    this.wipOutput = JSON.stringify(payload);
    this.isAuthoriseMessage = true;
    this.startResendCounter();
  }

  protected returnToForm() {
    this.isAuthoriseMessage = false;
    this.reservationRequest.set(null);
    if (this.resendIntervalId) {
      clearInterval(this.resendIntervalId);
      this.resendIntervalId = null;
    }
  }

  protected enableForm() {
    this.currentView = 'FORM';
  }

  ngOnInit() {
    this.faIconLibrary.addIcons(faCircleCheck, faTriangleExclamation);
    this.verifyTargetId = this.route.snapshot.paramMap.get('targetId');
    if (this.verifyTargetId) {
      this.verifyTargetIdResource.reload();
      this.currentView = 'VERIFY_MESSAGE';
    }
  }

  ngOnDestroy() {
    if (this.resendIntervalId) {
      clearInterval(this.resendIntervalId);
    }
  }

  protected verifyTargetIdResource = this.parceo.verifyReservation(() => this.verifyTargetId);

  protected createReservationResource = this.parceo.createReservation(() =>
    this.reservationRequest(),
  );

  private buildReservationDTO(guest: GuestDTO, reservation: ReservationDTO) {
    return { ...reservation, guest: guest } as ReservationDTO;
  }

  private startResendCounter() {
    if (this.resendIntervalId) {
      clearInterval(this.resendIntervalId);
    }
    this.resendEmailRemainingSeconds.set(60);

    this.resendIntervalId = setInterval(() => {
      this.resendEmailRemainingSeconds.update((v) => v - 1);

      if (this.resendEmailRemainingSeconds() <= 0) {
        clearInterval(this.resendIntervalId);
        this.resendIntervalId = null;
      }
    }, 1000);
  }

  protected openRulesPopup() {
    this.isRulesPopupOpen.set(true);
  }

  protected closeRulesPopup() {
    this.isRulesPopupOpen.set(false);
  }
}

export interface GuestDTO {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phoneNumber: string | null;
  carRegistration: string | null;
  country: string | null
}

export interface ReservationDTO {
  checkin: string | null;
  checkout: string | null;
  camperPlace: CamperPlaceDTO | null;
  guest: GuestDTO | null;
  paid: false | null;
}
