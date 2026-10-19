import { Component, computed, inject, input, output } from '@angular/core';
import { TranslationService } from '../../../../core/services/translation.service';
import { ReservationDTO } from '../../models/reservation.models';
import { nightsBetween } from '../../utils/date';
import { formatDayLong, pluralize } from '../../utils/format';

/** "Your booking" card shown next to the form steps. */
@Component({
  selector: 'app-reservation-summary',
  template: `
    @let t = ts.t.reservation;

    <section class="rv-card summary" aria-labelledby="summary-title">
      <div class="summary-head">
        <h2 id="summary-title" class="summary-title">{{ t.summaryTitle }}</h2>
        @if (editable()) {
          <button type="button" class="rv-link" (click)="edit.emit()">{{ t.change }}</button>
        }
      </div>

      <dl class="rows">
        <div class="row"><dt>{{ t.checkin }}</dt><dd>{{ checkinText() }}</dd></div>
        <div class="row"><dt>{{ t.checkout }}</dt><dd>{{ checkoutText() }}</dd></div>
        <div class="row">
          <dt>{{ t.pitch }}</dt>
          <dd>
            @if (reservation().camperPlace; as cp) {
              {{ cp.index }} · {{ cp.camperPlaceType.typeName }}
            } @else {
              —
            }
          </dd>
        </div>
        <div class="row"><dt>{{ t.nightsLabel }}</dt><dd>{{ nightsText() }}</dd></div>
      </dl>

      <div class="total">
        <span>{{ t.estimatedPrice }}</span>
        @if (price(); as p) {
          <strong>{{ p }} {{ t.currency }}</strong>
        } @else {
          <span class="no-price">—</span>
        }
      </div>

      <p class="rv-info">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>
        {{ t.paymentInfo }}
      </p>
    </section>
  `,
  styles: `
    .summary {
      padding: 28px;
      gap: 12px;
    }

    .summary-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
    }

    .summary-title {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
    }

    .rows {
      margin: 0;
    }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--color-divider);
      font-size: 14px;

      dt {
        color: var(--color-text-secondary);
      }

      dd {
        margin: 0;
        text-align: right;
        white-space: nowrap;
      }
    }

    .total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      padding: 4px 0;
      font-weight: 600;

      strong {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 30px;
        color: var(--color-bg-section-dark);
      }
    }

    .no-price {
      color: var(--color-text-secondary);
    }

    .rv-info svg {
      color: var(--color-bg-section-dark);
    }
  `,
})
export class ReservationSummaryComponent {
  protected readonly ts = inject(TranslationService);

  readonly reservation = input.required<ReservationDTO>();
  readonly price = input<string | null>(null);
  readonly editable = input(false);
  readonly edit = output<void>();

  protected readonly checkinText = computed(() => {
    const checkin = this.reservation().checkin;
    return checkin ? formatDayLong(checkin, this.ts.currentLang()) : '—';
  });

  protected readonly checkoutText = computed(() => {
    const checkout = this.reservation().checkout;
    return checkout ? formatDayLong(checkout, this.ts.currentLang()) : '—';
  });

  protected readonly nightsText = computed(() => {
    const { checkin, checkout } = this.reservation();
    if (!checkin || !checkout) return '—';
    const nights = nightsBetween(checkin, checkout);
    return `${nights} ${pluralize(nights, this.ts.t.reservation.nights, this.ts.currentLang())}`;
  });
}
