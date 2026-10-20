import {
  afterNextRender,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { map } from 'rxjs';
import { TranslationService } from '../../../../core/services/translation.service';
import { CamperPlaceDTO, ReservationDTO } from '../../models/reservation.models';
import { ParceoService } from '../../services/parceo.service';
import { addMonths, fromIsoDate, nightsBetween, startOfMonth, startOfToday, toIsoDate } from '../../utils/date';
import { formatDayLong, formatRange, localeOf, pluralize } from '../../utils/format';
import { CalendarMonthHeader } from './calendar-month-header';

const VISIBLE_PITCHES = 6;

/** Step 1: the guest picks the dates first, then one of the pitches free for the whole stay. */
@Component({
  selector: 'app-reservation-form',
  imports: [MatCalendar, MatProgressSpinner],
  template: `
    @let t = ts.t.reservation;

    <section class="rv-card" aria-labelledby="dates-title">
      <div class="card-head">
        <h2 id="dates-title" class="rv-card-title"><span class="rv-step-badge rv-desktop-only" aria-hidden="true">a</span>{{ t.datesTitle }}</h2>
        @if (rangeText(); as range) {
          <span class="range-text rv-desktop-only">{{ range }}</span>
        }
      </div>

      <button type="button" class="dates-field rv-mobile-only" (click)="isSheetOpen.set(true)">
        <span class="dates-field-text">
          <span class="dates-field-label">{{ t.datesField }}</span>
          @if (stay(); as s) {
            <strong>{{ s.range }}</strong>
            <span class="rv-hint">{{ s.nights }}</span>
          } @else {
            <strong>{{ t.datesPlaceholder }}</strong>
          }
        </span>
        <span class="dates-field-action">{{ t.change }}</span>
      </button>

      @if (isSheetOpen()) {
        <div class="sheet-backdrop rv-mobile-only" (click)="isSheetOpen.set(false)"></div>
      }

      <div
        class="calendar-panel"
        [class.calendar-panel--open]="isSheetOpen()"
        [attr.role]="isMobile() ? 'dialog' : null"
        [attr.aria-modal]="isMobile() && isSheetOpen() ? 'true' : null"
        [attr.aria-label]="isMobile() ? t.datesTitle : null"
      >
        <div class="sheet-head rv-mobile-only">
          <span class="sheet-handle" aria-hidden="true"></span>
          <div class="sheet-title-row">
            <h2 class="rv-card-title">{{ t.datesTitle }}</h2>
            <button type="button" class="rv-icon-btn" [attr.aria-label]="t.close" (click)="isSheetOpen.set(false)">
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>
            </button>
          </div>
          <div class="sheet-dates">
            <div class="sheet-date" [class.sheet-date--active]="!checkin()">
              <small>{{ t.checkin }}</small>
              <strong>{{ checkinText() ?? '—' }}</strong>
            </div>
            <div class="sheet-date" [class.sheet-date--active]="!!checkin() && !checkout()">
              <small>{{ t.checkout }}</small>
              <strong>{{ checkoutText() ?? '—' }}</strong>
            </div>
          </div>
        </div>

        <div class="calendar-box">
            <div class="calendar-nav">
              <button type="button" class="rv-icon-btn" [attr.aria-label]="t.prevMonth" [disabled]="!canGoBack()" (click)="shiftMonth(-1)">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m15 18-6-6 6-6"></path></svg>
              </button>
              <span class="rv-hint" aria-live="polite">{{ checkin() && !checkout() ? t.datesHintEnd : t.datesHintStart }}</span>
              <button type="button" class="rv-icon-btn" [attr.aria-label]="t.nextMonth" (click)="shiftMonth(1)">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6"></path></svg>
              </button>
            </div>
            <div class="calendar-months">
              @for (month of months(); track month.key; let second = $odd) {
                <mat-calendar
                  class="rv-calendar"
                  [class.calendar-second]="second"
                  [startAt]="month.date"
                  [minDate]="today"
                  [selected]="selectedRange()"
                  [dateFilter]="dateFilter"
                  [headerComponent]="monthHeader"
                  (selectedChange)="onDayPicked($event)"
                />
              }
            </div>
            <ul class="legend">
              <li><span class="legend-swatch legend-swatch--stay" aria-hidden="true"></span>{{ t.legendStay }}</li>
            </ul>
          </div>

        <div class="sheet-foot rv-mobile-only">
          <button type="button" class="rv-btn rv-btn--primary sheet-confirm" [disabled]="!stay()" (click)="isSheetOpen.set(false)">
            {{ t.showFreePitches }}@if (stay()) { · {{ freePlacesList().length }} }
          </button>
        </div>
      </div>
    </section>

    @if (stay()) {
      <section class="rv-card" aria-labelledby="pitches-title">
        <div class="card-head card-head--end">
          <div>
            <h2 id="pitches-title" class="rv-card-title">
              <span class="rv-step-badge rv-desktop-only" aria-hidden="true">b</span>
              <span class="rv-desktop-only">{{ t.pitchesTitle }}</span>
              <span class="rv-mobile-only">{{ t.pitchesTitleShort }} · {{ freePlacesList().length }}</span>
            </h2>
          </div>
          <button type="button" class="rv-link map-link" (click)="openMap.emit()">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"></path></svg>
            <span class="rv-desktop-only">{{ t.seeOnMap }}</span>
            <span class="rv-mobile-only">{{ t.mapShort }}</span>
          </button>
        </div>

        @if (availabilityResource.error()) {
          <p class="rv-text" role="alert">{{ t.noFreeDays }} {{ ts.t.error.serverError }}</p>
        } @else if (availabilityResource.isLoading()) {
          <div class="calendar-loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else if (freePlacesList().length === 0) {
          <p class="rv-text" role="status">{{ t.noFreePitches }}</p>
        } @else {
          @if (pitchTypes().length > 1) {
            <div class="chips rv-desktop-only" role="group" [attr.aria-label]="t.filterLabel">
              <button type="button" class="chip" [class.chip--on]="typeFilter() === null" [attr.aria-pressed]="typeFilter() === null" (click)="setTypeFilter(null)">
                {{ t.filterAll }} · {{ freePlacesList().length }}
              </button>
              @for (type of pitchTypes(); track type.name) {
                <button type="button" class="chip" [class.chip--on]="typeFilter() === type.name" [attr.aria-pressed]="typeFilter() === type.name" (click)="setTypeFilter(type.name)">
                  {{ type.name }} · {{ type.count }}
                </button>
              }
            </div>
          }

          <div class="pitch-grid" role="radiogroup" aria-labelledby="pitches-title">
            @for (cp of visiblePlaces(); track cp.id) {
              <button
                type="button"
                role="radio"
                class="pitch-card"
                [class.pitch-card--selected]="cp.id === selectedPlaceId()"
                [attr.aria-checked]="cp.id === selectedPlaceId()"
                (click)="selectPlace(cp)"
              >
                <span class="pitch-card-top">
                  <span class="pitch-name">{{ t.pitchLabel }} {{ cp.index }}</span>
                  <span class="pitch-tag">{{ cp.camperPlaceType.typeName }}</span>
                </span>
                <span class="pitch-price"><strong>{{ cp.price }} {{ t.currency }}</strong> {{ t.perNight }}</span>
                @if (cp.id === selectedPlaceId()) {
                  <svg class="pitch-check" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                }
              </button>
            }
          </div>

          <div class="pitches-foot">
            @if (hiddenCount() > 0) {
              <button type="button" class="rv-btn rv-btn--ghost show-all" (click)="showAll.set(true)">
                {{ t.showAllPitches }} ({{ filteredPlaces().length }})
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"></path></svg>
              </button>
            }
          </div>
        }
      </section>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 24px;

      @media (max-width: 767px) {
        gap: 16px;
      }
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .card-head--end {
      align-items: flex-end;
    }

    .range-text {
      font-size: 14px;
      font-weight: 600;
    }

    .pitches-count {
      margin-top: 4px;
      font-size: 14px;
    }

    .map-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 44px;
      font-size: 14px;
    }

    /* Phone: field that opens the calendar sheet */
    .dates-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      min-height: 64px;
      padding: 10px 14px;
      border: 1px solid var(--color-border-control);
      border-radius: 8px;
      background: var(--color-bg-field);
      font: inherit;
      color: inherit;
      text-align: left;
      cursor: pointer;
    }

    .dates-field-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .dates-field-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-bg-section-dark);
    }

    .dates-field-action {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-accent-gold-ink);
    }

    /* Calendar: inline on desktop, bottom sheet on a phone */
    .calendar-panel {
      display: flex;
      flex-direction: column;
    }

    .sheet-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgb(31 31 31 / 0.5);
    }

    @media (max-width: 767px) {
      .calendar-panel {
        display: none;
      }

      .calendar-panel--open {
        display: flex;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 48px;
        z-index: 1001;
        overflow-y: auto;
        border-radius: 20px 20px 0 0;
        background: var(--color-bg-light-soft);
      }

    }

    .sheet-head {
      padding: 10px 8px 0 20px;
    }

    .sheet-handle {
      display: block;
      width: 40px;
      height: 4px;
      margin: 0 auto 8px;
      border-radius: 2px;
      background: var(--color-border-control);
    }

    .sheet-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sheet-dates {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      padding: 12px 12px 12px 0;
    }

    .sheet-date {
      display: flex;
      flex-direction: column;
      padding: 8px 12px;
      border: 1px solid var(--color-border-soft);
      border-radius: 10px;
      background: var(--color-bg-field);

      small {
        font-size: 12px;
        color: var(--color-text-secondary);
      }
    }

    .sheet-date--active {
      border: 2px solid var(--color-bg-section-dark);
      padding: 7px 11px;
    }

    .sheet-foot {
      position: sticky;
      bottom: 0;
      margin-top: auto;
      padding: 14px 20px 24px;
      border-top: 1px solid var(--color-border-soft);
      background: var(--color-bg-light-soft);
    }

    .sheet-confirm {
      width: 100%;
    }

    .calendar-loading {
      display: flex;
      justify-content: center;
      padding: 48px 0;
    }

    .calendar-box {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px 20px 20px;
      border: 1px solid var(--color-border-soft);
      border-radius: 12px;
      background: var(--color-bg-field);

      @media (max-width: 767px) {
        border: 0;
        background: transparent;
        padding: 0 8px;
      }
    }

    .calendar-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      text-align: center;
    }

    .calendar-months {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 32px;

      @media (max-width: 767px) {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media (max-width: 767px) {
      .calendar-second {
        display: none;
      }
    }

    .legend {
      list-style: none;
      margin: 0;
      padding: 12px 0 0;
      border-top: 1px solid var(--color-divider);
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      font-size: 13px;
      color: var(--color-text-body);

      li {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .legend-swatch {
      width: 18px;
      height: 18px;
      border-radius: 5px;
    }

    .legend-swatch--stay {
      background: var(--color-bg-section-dark);
    }

    .legend-swatch--full {
      background: var(--color-occupied);
    }

    /* Pitches */
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      min-height: 36px;
      padding: 0 14px;
      border: 1px solid var(--color-border-control);
      border-radius: 18px;
      background: transparent;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-dark);
      cursor: pointer;
    }

    .chip--on {
      border-color: var(--color-bg-section-dark);
      background: var(--color-bg-section-dark);
      color: var(--color-bg-light-soft);
    }

    .pitch-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;

      @media (max-width: 1100px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @media (max-width: 767px) {
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
      }
    }

    .pitch-card {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      min-height: 104px;
      padding: 16px;
      border: 1px solid var(--color-border-soft);
      border-radius: 12px;
      background: var(--color-bg-field);
      font: inherit;
      color: var(--color-text-dark);
      text-align: left;
      cursor: pointer;

      &:hover {
        border-color: var(--color-border-control);
      }

      &:focus-visible {
        outline: 2px solid var(--color-bg-section-dark);
        outline-offset: 2px;
      }

      @media (max-width: 767px) {
        flex-direction: row;
        align-items: center;
        min-height: 64px;
        padding: 12px 14px;
      }
    }

    .pitch-card--selected {
      border: 2px solid var(--color-bg-section-dark);
      padding: 15px;
      box-shadow: 0 0 0 3px rgb(62 74 39 / 0.15);

      @media (max-width: 767px) {
        padding: 11px 13px;
      }
    }

    .pitch-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding-right: 24px;

      @media (max-width: 767px) {
        justify-content: flex-start;
        padding-right: 0;
      }
    }

    .pitch-name {
      font-size: 16px;
      font-weight: 600;
    }

    .pitch-tag {
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--color-occupied);
      color: var(--color-bg-section-dark);
      font-size: 12px;
      font-weight: 600;
    }

    .pitch-price {
      font-size: 13px;
      color: var(--color-text-secondary);

      strong {
        font-size: 16px;
        color: var(--color-bg-section-dark);
      }

      @media (max-width: 767px) {
        padding-right: 28px;
        white-space: nowrap;
      }
    }

    .pitch-check {
      position: absolute;
      top: 14px;
      right: 14px;
      color: var(--color-bg-section-dark);

      @media (max-width: 767px) {
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .pitches-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .show-all {
      padding: 0;
    }
  `,
})
export class ReservationForm {
  protected readonly ts = inject(TranslationService);
  private readonly parceo = inject(ParceoService);
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);

  readonly formValid = output<boolean>();
  readonly formValue = output<ReservationDTO>();
  readonly price = output<string | null>();
  readonly openMap = output<void>();

  protected readonly monthHeader = CalendarMonthHeader;
  protected readonly today = startOfToday();

  protected readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 767px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  protected readonly isSheetOpen = signal(false);
  protected readonly viewMonth = signal(startOfMonth(this.today));
  protected readonly typeFilter = signal<string | null>(null);
  protected readonly showAll = signal(false);

  protected readonly reservationModel = signal<ReservationDTO>({
    camperPlace: null,
    checkin: null,
    checkout: null,
    guest: null,
    paid: false,
  });

  protected readonly checkin = computed(() => this.reservationModel().checkin);
  protected readonly checkout = computed(() => this.reservationModel().checkout);
  protected readonly selectedPlaceId = computed(() => this.reservationModel().camperPlace?.id ?? null);

  /** The chosen stay, once both dates are picked. */
  protected readonly stay = computed(() => {
    const checkin = this.checkin();
    const checkout = this.checkout();
    if (!checkin || !checkout) return null;

    const lang = this.ts.currentLang();
    const nights = nightsBetween(checkin, checkout);
    return {
      checkin,
      checkout,
      range: formatRange(checkin, checkout),
      nights: `${nights} ${pluralize(nights, this.ts.t.reservation.nights, lang)}`,
    };
  });

  /** Pitches free for the whole chosen stay; loaded once both dates are picked. */
  protected readonly availabilityResource = this.parceo.campAvailability(() => this.stay() ?? undefined);

  protected readonly checkinText = computed(() =>
    this.checkin() ? formatDayLong(this.checkin()!, this.ts.currentLang()) : null,
  );
  protected readonly checkoutText = computed(() =>
    this.checkout() ? formatDayLong(this.checkout()!, this.ts.currentLang()) : null,
  );
  protected readonly rangeText = computed(() => {
    const stay = this.stay();
    return stay ? `${this.checkinText()} → ${this.checkoutText()} · ${stay.nights}` : null;
  });

  protected readonly freePlacesList = computed(() => {
    // Keep the previous list while the new dates load, otherwise a selected pitch would be dropped.
    if (!this.stay() || this.availabilityResource.status() === 'error') return [];
    return this.sortPlaces(this.availabilityResource.value() ?? []);
  });

  protected readonly pitchTypes = computed(() => {
    const counts = new Map<string, number>();
    for (const place of this.freePlacesList()) {
      counts.set(place.camperPlaceType.typeName, (counts.get(place.camperPlaceType.typeName) ?? 0) + 1);
    }
    return [...counts].map(([name, count]) => ({ name, count }));
  });

  // Phones always see one plain list, without type filters.
  protected readonly filteredPlaces = computed(() => {
    const filter = this.isMobile() ? null : this.typeFilter();
    const places = this.freePlacesList();
    return filter ? places.filter((place) => place.camperPlaceType.typeName === filter) : places;
  });

  protected readonly visiblePlaces = computed(() => {
    const places = this.filteredPlaces();
    if (this.showAll() || places.length <= VISIBLE_PITCHES) return places;

    // Keep the selected pitch visible even when it is beyond the first cards.
    const visible = places.slice(0, VISIBLE_PITCHES);
    const selected = places.find((place) => place.id === this.selectedPlaceId());
    return selected && !visible.includes(selected) ? [...visible.slice(0, -1), selected] : visible;
  });

  protected readonly hiddenCount = computed(() => this.filteredPlaces().length - this.visiblePlaces().length);

  protected readonly months = computed(() => {
    const first = this.viewMonth();
    return [first, addMonths(first, 1)].map((date) => ({ date, key: toIsoDate(date) }));
  });

  protected readonly canGoBack = computed(() => this.viewMonth() > startOfMonth(this.today));

  protected readonly selectedRange = computed(() => {
    const checkin = this.checkin();
    const checkout = this.checkout();
    return new DateRange<Date>(checkin ? fromIsoDate(checkin) : null, checkout ? fromIsoDate(checkout) : null);
  });

  // Every day from today on can be picked; free pitches are looked up once the stay is chosen.
  protected readonly dateFilter = (date: Date | null): boolean => !!date;

  private readonly calculatedPriceResource = this.parceo.calculatedPrice(() => {
    const { camperPlace, checkin, checkout } = this.reservationModel();
    return { cpId: camperPlace?.id, checkin, checkout };
  });

  protected readonly isValid = computed(() => {
    const { camperPlace } = this.reservationModel();
    return !!this.stay() && !!camperPlace && this.freePlacesList().some((place) => place.id === camperPlace.id);
  });

  constructor() {
    effect(() => {
      this.formValid.emit(this.isValid());
      this.formValue.emit(this.reservationModel());
    });

    effect(() => {
      const value = this.calculatedPriceResource.value();
      this.price.emit(this.calculatedPriceResource.isLoading() || !value ? null : String(value));
    });

    // Keep the calendar's month and weekday names in the page language.
    effect(() => this.dateAdapter.setLocale(localeOf(this.ts.currentLang())));

    // Drop a pitch that is no longer free after the dates changed.
    effect(() => {
      const free = this.freePlacesList();
      untracked(() => {
        const selected = this.reservationModel().camperPlace;
        if (selected && !free.some((place) => place.id === selected.id)) {
          this.reservationModel.update((model) => ({ ...model, camperPlace: null }));
        }
      });
    });

    // On a phone the step starts with the calendar open.
    afterNextRender(() => {
      if (this.isMobile() && !this.checkin()) this.isSheetOpen.set(true);
    });
  }

  protected onDayPicked(date: Date | null) {
    if (!date) return;

    const day = toIsoDate(date);
    const { checkin, checkout } = this.reservationModel();
    const isEnd = !!checkin && !checkout && day > checkin;

    this.reservationModel.update((model) =>
      isEnd ? { ...model, checkout: day } : { ...model, checkin: day, checkout: null },
    );
    this.showAll.set(false);
  }

  protected shiftMonth(step: number) {
    this.viewMonth.update((month) => addMonths(month, step));
  }

  protected setTypeFilter(type: string | null) {
    this.typeFilter.set(type);
    this.showAll.set(false);
  }

  protected selectPlace(place: CamperPlaceDTO) {
    this.reservationModel.update((model) => ({ ...model, camperPlace: place }));
  }

  private sortPlaces(places: CamperPlaceDTO[]): CamperPlaceDTO[] {
    return [...places].sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
  }
}
