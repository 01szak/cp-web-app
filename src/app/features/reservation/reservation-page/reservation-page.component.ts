import { Component, computed, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { TranslationService } from '../../../core/services/translation.service';
import { ReservationForm } from '../components/reservation-form/reservation-form';
import { GuestFormComponent } from '../components/guest-form.component/guest-form.component';
import { ReservationSummaryComponent } from '../components/reservation-summary/reservation-summary';
import { GuestDTO, ReservationDTO } from '../models/reservation.models';
import { ParceoService } from '../services/parceo.service';
import { formatRange, pluralize } from '../utils/format';
import { nightsBetween } from '../utils/date';

type View = 'START' | 'FORM' | 'VERIFY';
type Step = 'STAY' | 'GUEST' | 'SENT';

const RESEND_DELAY_SECONDS = 60;
const STEPS: Step[] = ['STAY', 'GUEST', 'SENT'];

@Component({
  selector: 'app-reservation-page',
  imports: [
    FooterComponent,
    NavbarComponent,
    ReservationForm,
    GuestFormComponent,
    ReservationSummaryComponent,
    MatProgressSpinner,
  ],
  template: `
    @let t = ts.t.reservation;

    <app-navbar></app-navbar>
    <main class="page-bg">
      <div class="rv-page">
        @switch (view()) {
          @case ('START') {
            <div class="start">
              <section class="start-intro">
                <p class="rv-eyebrow">{{ t.eyebrow }}</p>
                <h1 class="rv-title start-title">{{ t.pageTitle }}</h1>
                <p class="rv-text start-desc">{{ t.startDesc }}</p>
                <div>
                  <button
                    type="button"
                    class="rv-btn rv-btn--primary start-cta"
                    (click)="startForm()"
                  >
                    {{ t.startBtn }}
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>
                </div>

                @if (pitchTypesResource.value(); as pitchTypes) {
                  <div class="types">
                    <h2 class="types-title">{{ t.pitchTypesTitle }}</h2>
                    <ul class="types-list">
                      @for (type of pitchTypes; track type.typeName) {
                        <li class="type-row">
                          <span>
                            <strong>{{ type.typeName }}</strong>
                            <span class="rv-hint type-numbers"
                              >{{ type.typeName }}</span
                            >
                          </span>
                          <span class="type-price">
                            {{ t.fromPrice }} <strong>{{ type.price }} {{ t.currency }}</strong>
                            {{ t.perNight }}
                          </span>
                        </li>
                      }
                    </ul>
                  </div>
                }
              </section>

              <figure class="rv-card map-card">
                <div class="map-head">
                  <figcaption class="map-title">{{ t.mapTitle }}</figcaption>
                  <button
                    type="button"
                    class="rv-btn rv-btn--outline map-zoom"
                    (click)="isMapOpen.set(true)"
                  >
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                    </svg>
                    {{ t.mapZoom }}
                  </button>
                </div>
                <button
                  type="button"
                  class="map-image-btn"
                  [attr.aria-label]="t.mapZoom"
                  (click)="isMapOpen.set(true)"
                >
                  <img class="map-image" src="/camperpark-map.jpg" [alt]="t.mapAlt" />
                </button>
                <p class="rv-hint">{{ t.mapHint }}</p>
              </figure>
            </div>
          }
          @case ('FORM') {
            <div class="form-head">
              <div>
                <p class="rv-eyebrow rv-desktop-only">{{ t.eyebrow }}</p>
                <h1 class="rv-title rv-desktop-only">{{ t.pageTitle }}</h1>
              </div>

              <ol class="stepper rv-desktop-only" [attr.aria-label]="t.pageTitle">
                @for (s of steps(); track s.key; let last = $last) {
                  <li
                    class="stepper-item"
                    [class.stepper-item--current]="s.state === 'current'"
                    [class.stepper-item--done]="s.state === 'done'"
                    [attr.aria-current]="s.state === 'current' ? 'step' : null"
                  >
                    <span class="stepper-dot">
                      @if (s.state === 'done') {
                        <svg
                          aria-hidden="true"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      } @else {
                        {{ s.number }}
                      }
                    </span>
                    {{ s.label }}
                  </li>
                  @if (!last) {
                    <li
                      class="stepper-line"
                      [class.stepper-line--done]="s.state === 'done'"
                      aria-hidden="true"
                    ></li>
                  }
                }
              </ol>

              <div class="progress rv-mobile-only">
                <div class="progress-text">
                  <strong
                    >{{ t.stepLabel }} {{ stepNumber() }} {{ t.stepOf }} 3 ·
                    {{ currentStepLabel() }}</strong
                  >
                  @if (nextStepLabel(); as next) {
                    <span>{{ t.nextLabel }} {{ next }}</span>
                  }
                </div>
                <div class="progress-bar" aria-hidden="true">
                  <span [style.width.%]="(stepNumber() / 3) * 100"></span>
                </div>
              </div>
            </div>

            @if (step() === 'SENT') {
              <section class="rv-card sent-card" aria-live="polite">
                @if (createReservationResource.isLoading()) {
                  <mat-spinner diameter="48"></mat-spinner>
                  <p class="rv-text">{{ t.sending }}</p>
                } @else if (createReservationResource.error()) {
                  <span class="status-icon status-icon--error" aria-hidden="true">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"
                      ></path>
                    </svg>
                  </span>
                  <h2 class="sent-title">{{ ts.t.error.reservationError1 }}</h2>
                  <p class="rv-text sent-text">{{ ts.t.error.reservationError2 }}</p>
                  <div class="sent-actions">
                    <button
                      type="button"
                      class="rv-btn rv-btn--primary"
                      (click)="createReservationResource.reload()"
                    >
                      {{ t.retryBtn }}
                    </button>
                    <button type="button" class="rv-btn rv-btn--ghost" (click)="backToGuest()">
                      {{ t.backBtn }}
                    </button>
                  </div>
                } @else {
                  <span class="status-icon" aria-hidden="true">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                      <path d="m3 7 9 6 9-6"></path>
                    </svg>
                  </span>
                  <h2 class="sent-title">{{ t.sentTitle }}</h2>
                  <p class="rv-text sent-text">
                    {{ t.sentPrefix }} <strong>{{ guest().email }}</strong
                    >. {{ t.sentSuffix }}
                  </p>
                  <dl class="sent-summary">
                    <div>
                      <dt>{{ t.pitch }}</dt>
                      <dd>
                        {{ reservation().camperPlace?.index }} ·
                        {{ reservation().camperPlace?.camperPlaceType?.typeName }}
                      </dd>
                    </div>
                    <div>
                      <dt>{{ t.term }}</dt>
                      <dd>{{ stayText() }}</dd>
                    </div>
                    @if (price(); as p) {
                      <div>
                        <dt>{{ t.estimatedPrice }}</dt>
                        <dd>
                          <strong>{{ p }} {{ t.currency }}</strong>
                        </dd>
                      </div>
                    }
                  </dl>
                  <div class="sent-actions">
                    <p class="rv-hint">{{ t.sentSpam }}</p>
                    <button
                      type="button"
                      class="rv-btn rv-btn--outline"
                      [disabled]="resendSeconds() > 0"
                      (click)="sendReservation()"
                    >
                      {{ resendSeconds() > 0 ? t.resendIn + ' ' + resendCountdown() : t.resendBtn }}
                    </button>
                    <button type="button" class="rv-link" (click)="backToGuest()">
                      {{ t.fixEmail }}
                    </button>
                  </div>
                }
              </section>
            }

            <div class="rv-layout" [hidden]="step() === 'SENT'">
              <div class="rv-layout-main">
                <div [hidden]="step() !== 'STAY'">
                  <app-reservation-form
                    (formValid)="isReservationFormValid.set($event)"
                    (formValue)="reservation.set($event)"
                    (price)="price.set($event)"
                    (openMap)="isMapOpen.set(true)"
                  />
                </div>

                <section class="rv-card" [hidden]="step() !== 'GUEST'">
                  <app-guest-form
                    (formValid)="isGuestFormValid.set($event)"
                    (formValue)="guest.set($event)"
                  />
                  <p class="consent">
                    {{ t.consentPrefix }}
                    <button type="button" class="rv-link" (click)="isRulesOpen.set(true)">
                      {{ t.consentPrivacy }}
                    </button>
                    .
                  </p>
                </section>

                <div class="rv-actions">
                  @if (step() === 'STAY') {
                    <button
                      type="button"
                      class="rv-btn rv-btn--ghost rv-desktop-only"
                      (click)="view.set('START')"
                    >
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      >
                        <path d="m15 18-6-6 6-6"></path>
                      </svg>
                      {{ t.backBtn }}
                    </button>
                    <div class="rv-actions-price rv-mobile-only">
                      @if (reservation().camperPlace && price()) {
                        <small
                          >{{ t.pitchLabel }} {{ reservation().camperPlace?.index }} ·
                          {{ nightsText() }}</small
                        >
                        <strong>{{ price() }} {{ t.currency }}</strong>
                      } @else {
                        <small>{{ t.selectPitchHint }}</small>
                      }
                    </div>
                    <div class="next-wrap">
                      @if (!isReservationFormValid() && reservation().checkout) {
                        <span class="rv-hint rv-desktop-only">{{ t.selectPitchHint }}</span>
                      }
                      <button
                        type="button"
                        class="rv-btn rv-btn--primary"
                        [disabled]="!isReservationFormValid()"
                        (click)="goTo('GUEST')"
                      >
                        <span class="rv-desktop-only">{{ t.nextToGuest }}</span>
                        <span class="rv-mobile-only">{{ t.nextBtn }}</span>
                        <svg
                          aria-hidden="true"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        >
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </button>
                    </div>
                  } @else {
                    <button type="button" class="rv-btn rv-btn--ghost" (click)="goTo('STAY')">
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      >
                        <path d="m15 18-6-6 6-6"></path>
                      </svg>
                      {{ t.backBtn }}
                    </button>
                    <button
                      type="button"
                      class="rv-btn rv-btn--primary"
                      [disabled]="!isGuestFormValid()"
                      (click)="sendReservation()"
                    >
                      {{ t.sendBtn }}
                    </button>
                  }
                </div>
              </div>

              <aside class="rv-layout-aside rv-desktop-only">
                <app-reservation-summary
                  [reservation]="reservation()"
                  [price]="price()"
                  [editable]="step() === 'GUEST'"
                  (edit)="goTo('STAY')"
                />
              </aside>
            </div>
          }
          @case ('VERIFY') {
            <section class="rv-card sent-card verify-card" aria-live="polite">
              @if (verifyTargetIdResource.isLoading()) {
                <mat-spinner diameter="48"></mat-spinner>
                <p class="rv-text">{{ t.verifyLoading }}</p>
              } @else if (verifyTargetIdResource.error()) {
                <span class="status-icon status-icon--error" aria-hidden="true">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"
                    ></path>
                  </svg>
                </span>
                <h1 class="sent-title">{{ ts.t.error.serverError }}</h1>
                <p class="rv-text sent-text">{{ ts.t.error.reservationError2 }}</p>
              } @else {
                <span class="status-icon" aria-hidden="true">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </span>
                <h1 class="sent-title">{{ t.verifySuccessTitle }}</h1>
                <p class="rv-text sent-text">{{ t.verifySuccessDesc }}</p>
              }
            </section>
          }
        }
      </div>
    </main>
    <app-footer></app-footer>

    @if (isMapOpen()) {
      <div class="rv-overlay" (click)="isMapOpen.set(false)">
        <div
          class="map-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="t.mapTitle"
          (click)="$event.stopPropagation()"
        >
          <div class="map-dialog-head">
            <h2 class="map-title">{{ t.mapTitle }}</h2>
            <button
              type="button"
              class="rv-icon-btn"
              [attr.aria-label]="t.close"
              (click)="isMapOpen.set(false)"
            >
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <img class="map-dialog-image" src="/camperpark-map.jpg" [alt]="t.mapAlt" />
        </div>
      </div>
    }

    @if (isRulesOpen()) {
      <div class="rv-overlay" (click)="isRulesOpen.set(false)">
        <div
          class="rv-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rules-title"
          (click)="$event.stopPropagation()"
        >
          <h2 id="rules-title">{{ t.rulesPopup.title }}</h2>
          <p class="rv-text">{{ t.rulesPopup.body }}</p>
          <button
            type="button"
            class="rv-btn rv-btn--primary rules-close"
            (click)="isRulesOpen.set(false)"
          >
            {{ t.rulesPopup.close }}
          </button>
        </div>
      </div>
    }
  `,
  styles: `
    /* Room for the fixed navbar. */
    .page-bg {
      padding-top: 88px;
      background: var(--color-bg-light);

      @media (max-width: 767px) {
        padding-top: 64px;
      }
    }

    [hidden] {
      display: none !important;
    }

    /* Start */
    .start {
      display: flex;
      flex-wrap: wrap;
      gap: 48px;
      align-items: flex-start;

      @media (max-width: 767px) {
        gap: 32px;
      }
    }

    .start-intro {
      flex: 1 1 380px;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .start-title {
      font-size: 48px;
      line-height: 1.1;

      @media (max-width: 767px) {
        font-size: 32px;
      }
    }

    .start-desc {
      font-size: 17px;
    }

    .start-cta {
      min-height: 52px;
      font-size: 16px;
    }

    .types-title,
    .map-title {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
    }

    .types-list {
      margin-top: 4px;
    }

    .type-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 14px 0;
      border-bottom: 1px solid var(--color-border-soft);

      > span:first-child {
        display: flex;
        flex-direction: column;
      }
    }

    .type-numbers {
      font-size: 14px;
    }

    .type-price {
      white-space: nowrap;
      font-size: 14px;
      color: var(--color-text-secondary);

      strong {
        color: var(--color-text-dark);
      }
    }

    .map-card {
      flex: 1 1 520px;
      min-width: 0;
      margin: 0;
      padding: 20px;
      gap: 14px;
    }

    .map-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .map-zoom {
      min-height: 44px;
      padding: 0 18px;
      font-size: 14px;
    }

    .map-image-btn {
      padding: 0;
      border: 0;
      border-radius: 10px;
      background: #fff;
      cursor: zoom-in;
      overflow: hidden;
    }

    .map-image {
      width: 100%;
      max-height: 620px;
      object-fit: cover;
      object-position: top;
    }

    .map-dialog {
      width: 100%;
      max-width: 1000px;
      max-height: 100%;
      overflow: auto;
      box-sizing: border-box;
      padding: 16px 16px 20px;
      border-radius: 16px;
      background: var(--color-bg-light-soft);
    }

    .map-dialog-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 8px;
      margin-bottom: 8px;
    }

    .map-dialog-image {
      width: 100%;
      border-radius: 10px;
      background: #fff;
    }

    /* Form header */
    .form-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 32px;

      @media (max-width: 767px) {
        display: block;
        margin-bottom: 16px;
      }
    }

    .stepper {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--color-text-secondary);
    }

    .stepper-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stepper-dot {
      width: 28px;
      height: 28px;
      box-sizing: border-box;
      border: 1px solid var(--color-border-control);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }

    .stepper-item--current {
      font-weight: 600;
      color: var(--color-text-dark);

      .stepper-dot {
        border: 0;
        background: var(--color-bg-section-dark);
        color: var(--color-bg-light-soft);
      }
    }

    .stepper-item--done {
      color: var(--color-bg-section-dark);

      .stepper-dot {
        border: 0;
        background: #c9cfb3;
      }
    }

    .stepper-line {
      width: 32px;
      height: 1px;
      background: var(--color-border-control);
    }

    .stepper-line--done {
      background: var(--color-bg-section-dark);
    }

    .progress {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-text {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 13px;
      color: var(--color-text-secondary);

      strong {
        color: var(--color-bg-section-dark);
      }
    }

    .progress-bar {
      height: 4px;
      border-radius: 2px;
      background: var(--color-border-soft);

      span {
        display: block;
        height: 100%;
        border-radius: 2px;
        background: var(--color-bg-section-dark);
        transition: width 0.3s ease;
      }
    }

    /* Steps */
    .consent {
      margin: 0;
      font-size: 13px;
      line-height: 1.6;
      color: var(--color-text-body);
    }

    .next-wrap {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: auto;
    }

    .sent-card {
      max-width: 620px;
      margin: 0 auto;
      padding: 48px 40px;
      align-items: center;
      text-align: center;
      gap: 16px;

      @media (max-width: 767px) {
        padding: 32px 20px;
      }
    }

    .verify-card {
      margin-top: 24px;
    }

    .status-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-section-dark);
      color: var(--color-range);
    }

    .status-icon--error {
      background: rgb(154 74 30 / 0.12);
      color: var(--color-error);
    }

    .sent-title {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      line-height: 1.2;

      @media (max-width: 767px) {
        font-size: 26px;
      }
    }

    .sent-text {
      max-width: 46ch;
      font-size: 16px;

      strong {
        color: var(--color-text-dark);
        overflow-wrap: anywhere;
      }
    }

    .sent-summary {
      width: 100%;
      margin: 8px 0 0;
      padding: 4px 20px;
      box-sizing: border-box;
      border: 1px solid var(--color-divider);
      border-radius: 12px;
      background: var(--color-bg-field);
      text-align: left;

      div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid var(--color-divider);
        font-size: 14px;

        &:last-child {
          border-bottom: 0;
        }
      }

      dt {
        color: var(--color-text-secondary);
      }

      dd {
        margin: 0;
        white-space: nowrap;
      }
    }

    .sent-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-top: 8px;
    }

    .rules-close {
      align-self: center;
    }
  `,
})
export class ReservationPageComponent implements OnInit, OnDestroy {
  protected readonly ts = inject(TranslationService);
  private readonly parceo = inject(ParceoService);
  private readonly route = inject(ActivatedRoute);

  protected readonly view = signal<View>('START');
  protected readonly step = signal<Step>('STAY');
  protected readonly isReservationFormValid = signal(false);
  protected readonly isGuestFormValid = signal(false);
  protected readonly reservation = signal<ReservationDTO>({
    camperPlace: null,
    checkin: null,
    checkout: null,
    guest: null,
    paid: false,
  });
  protected readonly guest = signal<GuestDTO>({} as GuestDTO);
  protected readonly price = signal<string | null>(null);
  protected readonly resendSeconds = signal(0);
  protected readonly isRulesOpen = signal(false);
  protected readonly isMapOpen = signal(false);

  private readonly reservationRequest = signal<ReservationDTO | null>(null);
  private resendIntervalId: ReturnType<typeof setInterval> | null = null;
  private verifyTargetId: string | null = null;

  // protected readonly camperPlacesResource = this.parceo.camperPlaces();
  protected readonly pitchTypesResource = this.parceo.camperPlaceTypes();
  protected readonly createReservationResource = this.parceo.createReservation(() =>
    ( {reservation: this.reservationRequest(), locale: this.ts.currentLang()} )
  );
  protected readonly verifyTargetIdResource = this.parceo.verifyReservation(
    () => this.verifyTargetId,
  );

  protected readonly stepNumber = computed(() => STEPS.indexOf(this.step()) + 1);

  protected readonly steps = computed(() => {
    const labels = this.ts.t.reservation.steps;
    const current = STEPS.indexOf(this.step());
    return STEPS.map((key, i) => ({
      key,
      number: i + 1,
      label: [labels.stay, labels.guest, labels.confirm][i],
      state: i < current ? 'done' : i === current ? 'current' : 'upcoming',
    }));
  });

  protected readonly currentStepLabel = computed(
    () => this.steps()[STEPS.indexOf(this.step())].label,
  );
  protected readonly nextStepLabel = computed(
    () => this.steps()[STEPS.indexOf(this.step()) + 1]?.label ?? null,
  );

  protected readonly nightsText = computed(() => {
    const { checkin, checkout } = this.reservation();
    if (!checkin || !checkout) return '';
    const nights = nightsBetween(checkin, checkout);
    return `${nights} ${pluralize(nights, this.ts.t.reservation.nights, this.ts.currentLang())}`;
  });

  protected readonly stayText = computed(() => {
    const { checkin, checkout } = this.reservation();
    return checkin && checkout ? `${formatRange(checkin, checkout)} · ${this.nightsText()}` : '';
  });

  protected readonly resendCountdown = computed(() => {
    const seconds = this.resendSeconds();
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  });

  ngOnInit() {
    this.verifyTargetId = this.route.snapshot.paramMap.get('targetId');
    if (this.verifyTargetId) {
      this.verifyTargetIdResource.reload();
      this.view.set('VERIFY');
    }
  }

  ngOnDestroy() {
    this.stopResendCounter();
  }

  @HostListener('document:keydown.escape')
  protected closeDialogs() {
    this.isMapOpen.set(false);
    this.isRulesOpen.set(false);
  }

  protected startForm() {
    this.step.set('STAY');
    this.view.set('FORM');
  }

  protected goTo(step: Step) {
    this.step.set(step);
    this.scrollToTop();
  }

  protected sendReservation() {
    if (!this.isReservationFormValid() || !this.isGuestFormValid()) return;

    this.reservationRequest.set({ ...this.reservation(), guest: this.guest() });
    this.goTo('SENT');
    this.startResendCounter();
  }

  protected backToGuest() {
    this.reservationRequest.set(null);
    this.stopResendCounter();
    this.goTo('GUEST');
  }

  private startResendCounter() {
    this.stopResendCounter();
    this.resendSeconds.set(RESEND_DELAY_SECONDS);

    this.resendIntervalId = setInterval(() => {
      this.resendSeconds.update((seconds) => seconds - 1);
      if (this.resendSeconds() <= 0) this.stopResendCounter();
    }, 1000);
  }

  private stopResendCounter() {
    if (this.resendIntervalId) {
      clearInterval(this.resendIntervalId);
      this.resendIntervalId = null;
    }
  }

  private scrollToTop() {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
