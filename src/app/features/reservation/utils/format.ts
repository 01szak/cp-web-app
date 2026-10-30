import { PluralForms } from '../../../core/translations/translations';
import { Language } from '../../../core/services/translation.service';
import { fromIsoDate } from './date';

export function localeOf(lang: Language): string {
  return lang === 'pl' ? 'pl-PL' : 'en-GB';
}

/** "1 noc", "3 noce", "5 nocy" in Polish; "1 night", "3 nights" in English. */
export function pluralize(count: number, forms: PluralForms, lang: Language): string {
  if (count === 1) return forms.one;
  if (lang !== 'pl') return forms.many;

  const lastDigit = count % 10;
  const lastTwo = count % 100;
  return lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? forms.few : forms.many;
}

/** "pon. 19.10.2026" */
export function formatDayLong(isoDate: string, lang: Language): string {
  const date = fromIsoDate(isoDate);
  const weekday = new Intl.DateTimeFormat(localeOf(lang), { weekday: 'short' }).format(date);
  return `${weekday} ${formatDate(isoDate)}`;
}

/** "19.10.2026" */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}

/** "19.10 – 22.10.2026", or with both years when the stay crosses a new year. */
export function formatRange(checkin: string, checkout: string): string {
  const [inYear, inMonth, inDay] = checkin.split('-');
  const start = checkin.slice(0, 4) === checkout.slice(0, 4) ? `${inDay}.${inMonth}` : `${inDay}.${inMonth}.${inYear}`;
  return `${start} – ${formatDate(checkout)}`;
}

/** "Październik 2026" */
export function formatMonth(date: Date, lang: Language): string {
  const label = new Intl.DateTimeFormat(localeOf(lang), { month: 'long', year: 'numeric' }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Pitch numbers as compact ranges: ["1","2","3","5"] → "1–3, 5". Non-numeric numbers are listed as they are. */
export function formatIndexes(indexes: string[]): string {
  const numbers = indexes.filter((i) => /^\d+$/.test(i)).map(Number).sort((a, b) => a - b);
  const others = indexes.filter((i) => !/^\d+$/.test(i));
  const parts: string[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const start = numbers[i];
    while (i + 1 < numbers.length && numbers[i + 1] === numbers[i] + 1) i++;
    parts.push(start === numbers[i] ? `${start}` : `${start}–${numbers[i]}`);
  }

  return [...parts, ...others].join(', ');
}
