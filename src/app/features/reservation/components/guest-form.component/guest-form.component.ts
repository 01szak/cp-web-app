import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { TranslationService } from '../../../../core/services/translation.service';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { email, form, FormField, required, validate } from '@angular/forms/signals';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { isValidPhoneNumber, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
import { buildCountryCallingCodes } from '../../../../shared/data/country-calling-codes';
import { CountryCallingCode } from '../../../../shared/models/country-calling-code.model';
import { GuestDTO } from '../../models/reservation.models';

const DEFAULT_COUNTRY = 'PL';

@Component({
  selector: 'app-guest-form',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    FormField,
    MatError,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
  ],
  template: `
    @let t = ts.t.reservation;

    <div class="guest-head">
      <h2 class="rv-card-title">{{ t.guestTitle }}</h2>
      <p class="rv-hint guest-desc">{{ t.guestDesc }}</p>
    </div>

    <form class="guest-form" (submit)="$event.preventDefault()">
      <div class="name-row">
        <mat-form-field appearance="outline">
          <mat-label>{{ t.firstname }}</mat-label>
          <input matInput type="text" autocomplete="given-name" [formField]="guestForm.firstname" />
          @if (firstnameError(); as error) {
            <mat-error>{{ error }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ t.lastname }}</mat-label>
          <input matInput type="text" autocomplete="family-name" [formField]="guestForm.lastname" />
          @if (lastnameError(); as error) {
            <mat-error>{{ error }}</mat-error>
          }
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>{{ t.email }}</mat-label>
        <input matInput type="email" autocomplete="email" [formField]="guestForm.email" />
        @if (emailError(); as error) {
          <mat-error>{{ error }}</mat-error>
        }
      </mat-form-field>

      <div class="phone-row">
        <mat-form-field appearance="outline" class="area-code-field">
          <mat-label>{{ t.areaCode }}</mat-label>
          @if (guestModel().areaCode; as code) {
            <span matTextPrefix class="fi fi-{{ code.iso2.toLowerCase() }} prefix-flag" aria-hidden="true"></span>
          }
          <input
            matInput
            type="text"
            autocomplete="off"
            [matAutocomplete]="areaCodeAuto"
            (input)="onAreaCodeQueryChange($event)"
            [formField]="guestForm.areaCode"
          />
          <mat-autocomplete #areaCodeAuto="matAutocomplete" [displayWith]="displayAreaCode" panelWidth="280px">
            @for (country of filteredCountryCallingCodes(); track country.iso2) {
              <mat-option [value]="country">
                <span class="fi fi-{{ country.iso2.toLowerCase() }} option-flag" aria-hidden="true"></span>
                +{{ country.dialCode }} {{ country.name }}
              </mat-option>
            }
          </mat-autocomplete>
          @if (areaCodeError(); as error) {
            <mat-error>{{ error }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="phone-field">
          <mat-label>{{ t.phone }}</mat-label>
          <input matInput type="tel" autocomplete="tel-national" [formField]="guestForm.phoneNumber" />
          @if (phoneNumberError(); as error) {
            <mat-error>{{ error }}</mat-error>
          }
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>{{ t.registration }}</mat-label>
        <input
          matInput
          type="text"
          class="registration-input"
          autocomplete="off"
          [placeholder]="t.registrationPlaceholder"
          [formField]="guestForm.carRegistration"
        />
        @if (carRegistrationError(); as error) {
          <mat-error>{{ error }}</mat-error>
        }
      </mat-form-field>
    </form>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .guest-desc {
      margin-top: 6px;
      font-size: 14px;
    }

    .guest-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    mat-form-field {
      width: 100%;
    }

    .name-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;

      @media (max-width: 767px) {
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
      }
    }

    .phone-row {
      display: flex;
      gap: 8px;
    }

    .area-code-field {
      flex: 0 0 132px;

      @media (max-width: 767px) {
        flex-basis: 112px;
      }
    }

    .phone-field {
      flex: 1;
      min-width: 0;
    }

    .prefix-flag {
      margin-right: 6px;
    }

    .option-flag {
      margin-right: 6px;
      vertical-align: middle;
    }

    .registration-input {
      text-transform: uppercase;

      &::placeholder {
        text-transform: none;
      }
    }
  `,
})
export class GuestFormComponent {
  protected readonly ts = inject(TranslationService);

  public formValid = output<boolean>();
  public formValue = output<GuestDTO>();

  constructor() {
    effect(() => {
      this.formValid.emit(this.areAllFieldsValid());
      this.formValue.emit(this.buildOutputValue());
    });
  }

  protected countryCallingCodes = computed(() => buildCountryCallingCodes(this.ts.currentLang()));

  protected areaCodeQuery = signal('');

  protected filteredCountryCallingCodes = computed(() => {
    const query = this.areaCodeQuery().replace('+', '').trim();
    if (!query) return this.countryCallingCodes();
    return this.countryCallingCodes().filter((country) => country.dialCode.startsWith(query));
  });

  guestModel = signal<{
    firstname: string;
    lastname: string;
    email: string;
    areaCode: CountryCallingCode | null;
    phoneNumber: string;
    carRegistration: string;
  }>({
    areaCode: this.countryCallingCodes().find((country) => country.iso2 === DEFAULT_COUNTRY) ?? null,
    carRegistration: '',
    email: '',
    firstname: '',
    lastname: '',
    phoneNumber: '',
  });

  protected guestForm = form(this.guestModel, (schema) => {
    required(schema.firstname, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.lastname, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.carRegistration, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.areaCode, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.phoneNumber, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.email, { message: this.ts.t.reservation.validation.requiredField });
    email(schema.email, { message: this.ts.t.reservation.validation.invalidEmail });
    validate(schema.phoneNumber, ({ value, valueOf }) => {
      const areaCode = valueOf(schema.areaCode);

      if (value() === '' || !areaCode) return null;

      if (!isValidPhoneNumber(value(), areaCode.iso2 as CountryCode)) {
        return {
          kind: 'phoneNumber',
          message: this.ts.t.reservation.validation.invalidPhoneNumber,
        };
      }

      return null;
    });
  });

  // One message per field; shown once the field was touched.
  protected firstnameError = computed(() => this.firstError(this.guestForm.firstname()));
  protected lastnameError = computed(() => this.firstError(this.guestForm.lastname()));
  protected emailError = computed(() => this.firstError(this.guestForm.email()));
  protected areaCodeError = computed(() => this.firstError(this.guestForm.areaCode()));
  protected phoneNumberError = computed(() => this.firstError(this.guestForm.phoneNumber()));
  protected carRegistrationError = computed(() => this.firstError(this.guestForm.carRegistration()));

  protected areAllFieldsValid = computed(() => this.guestForm().valid());

  protected displayAreaCode = (country: CountryCallingCode | null): string =>
    country ? `+${country.dialCode}` : '';

  protected onAreaCodeQueryChange(event: Event) {
    this.areaCodeQuery.set((event.target as HTMLInputElement).value);
    if (this.guestForm.areaCode().value()) {
      this.guestForm.areaCode().value.set(null);
    }
  }

  private firstError(field: { touched: () => boolean; errors: () => readonly { message?: string }[] }) {
    if (!field.touched()) return null;
    return field.errors()[0]?.message ?? null;
  }

  private buildOutputValue(): GuestDTO {
    const model = this.guestModel();
    return {
      firstname: model.firstname,
      lastname: model.lastname,
      email: model.email,
      phoneNumber: model.areaCode
        ? (parsePhoneNumberFromString(model.phoneNumber, model.areaCode.iso2 as CountryCode)?.number ??
          `+${model.areaCode.dialCode}${model.phoneNumber}`)
        : model.phoneNumber,
      carRegistration: model.carRegistration.toUpperCase(),
      country: model.areaCode?.iso2 || '',
    };
  }
}
