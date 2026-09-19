import { addDays, fromIsoDate, startOfToday, toIsoDate } from './date';

export interface Availability {
  /** Every occupied day (yyyy-mm-dd). */
  occupied: ReadonlySet<string>;
  /** First/last day of a stay that is not directly adjacent to another stay. */
  edges: ReadonlySet<string>;
  /** First day of another guest's stay whose previous day is free: it can only close a range. */
  arrivalEdges: ReadonlySet<string>;
}

/** `groups` holds one list of days per existing reservation. */
export function buildAvailability(groups: string[][]): Availability {
  const occupied = new Set(groups.flat());
  const isDayAroundFree = (isoDate: string, offset: number) => !occupied.has(toIsoDate(addDays(fromIsoDate(isoDate), offset)));

  const edges = new Set<string>();
  const arrivalEdges = new Set<string>();

  for (const days of groups) {
    const first = days[0];
    const last = days[days.length - 1];

    if (isDayAroundFree(first, -1)) {
      edges.add(first);
      arrivalEdges.add(first);
    }
    if (isDayAroundFree(last, 1)) edges.add(last);
  }

  return { occupied, edges, arrivalEdges };
}

export function isFreeFutureDay(date: Date, availability: Availability): boolean {
  return date.getTime() >= startOfToday().getTime() && !availability.occupied.has(toIsoDate(date));
}

/**
 * Free days are always selectable. An arrival edge is selectable only as the end of a range:
 * while the start is picked and no other occupied day lies between, or as the current checkout.
 */
export function isDateSelectable(date: Date, availability: Availability, checkin: string | null, checkout: string | null): boolean {
  if (isFreeFutureDay(date, availability)) return true;

  const day = toIsoDate(date);
  if (!checkin || !availability.arrivalEdges.has(day)) return false;
  if (checkout) return day === checkout;

  return day > checkin && ![...availability.occupied].some((o) => o > checkin && o < day);
}

/** Returns the latest valid checkout not later than `end`; an arrival edge may only close the range. */
export function clampCheckout(start: Date, end: Date, availability: Availability): Date {
  const endDay = toIsoDate(end);

  for (let i = 0; ; i++) {
    const date = addDays(start, i);
    const day = toIsoDate(date);

    if (day > endDay) return end;
    if (isFreeFutureDay(date, availability)) continue;
    if (i > 0 && availability.arrivalEdges.has(day)) return date;

    return addDays(date, -1);
  }
}
