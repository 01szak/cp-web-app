import { Component, inject } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { TranslationService } from '../../../../core/services/translation.service';
import { formatMonth } from '../../utils/format';

/** Calendar header showing only the month name; month navigation lives in the reservation form. */
@Component({
  selector: 'app-calendar-month-header',
  template: `<div class="month-label">{{ label }}</div>`,
  styles: `
    .month-label {
      padding: 4px 0 8px;
      text-align: center;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 17px;
      font-weight: 600;
    }
  `,
})
export class CalendarMonthHeader {
  private readonly calendar = inject<MatCalendar<Date>>(MatCalendar);
  private readonly ts = inject(TranslationService);

  protected get label(): string {
    return formatMonth(this.calendar.activeDate, this.ts.currentLang());
  }
}
