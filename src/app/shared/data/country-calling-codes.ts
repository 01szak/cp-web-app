import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { CountryCallingCode } from '../models/country-calling-code.model';

export function buildCountryCallingCodes(locale: string): CountryCallingCode[] {
  const displayNames = new Intl.DisplayNames([locale], { type: 'region' });

  return getCountries()
    .map((iso2) => ({
      iso2,
      dialCode: getCountryCallingCode(iso2),
      name: displayNames.of(iso2) ?? iso2,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
