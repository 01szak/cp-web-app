import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { TranslationService } from '../../../../core/services/translation.service';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { email, form, FormField, required, validate } from '@angular/forms/signals';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';
import { buildCountryCallingCodes } from '../../../../shared/data/country-calling-codes';
import { CountryCallingCode } from '../../../../shared/models/country-calling-code.model';

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
    <h3>{{ ts.t.reservation.step2Title }}</h3>
    <form class="form-layout">
      <mat-form-field appearance="outline">
        <mat-label>{{ ts.t.reservation.firstname }}</mat-label>
        <input matInput type="text" [formField]="guestForm.firstname" />
        @if (guestForm.firstname().touched() && isFirstnameInvalid()) {
          @for (error of guestForm.firstname().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>{{ ts.t.reservation.lastname }}</mat-label>
        <input matInput type="text" [formField]="guestForm.lastname" />
        @if (guestForm.lastname().touched() && isLastnameInvalid()) {
          @for (error of guestForm.lastname().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>{{ ts.t.reservation.email }}</mat-label>
        <input
          matInput
          type="email"
          [formField]="guestForm.email"
          [placeholder]="'xyz@example.com'"
        />
        @if (guestForm.email().touched() && isEmailInvalid()) {
          @for (error of guestForm.email().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>

      <div class="phone-number-fields">
        <mat-form-field appearance="outline" class="area-code-field">
          <mat-label>{{ ts.t.reservation.areaCode }}</mat-label>
          <input
            matInput
            type="text"
            [matAutocomplete]="areaCodeAuto"
            (input)="onAreaCodeQueryChange($event)"
            [formField]="guestForm.areaCode"
          />
          <mat-autocomplete #areaCodeAuto="matAutocomplete" [displayWith]="displayAreaCode">
            @for (country of filteredCountryCallingCodes(); track country.iso2) {
              <mat-option [value]="country">
                <span class="fi fi-{{ country.iso2.toLowerCase() }}"></span>
                +{{ country.dialCode }} {{ country.name }}
              </mat-option>
            }
          </mat-autocomplete>
          @if (guestForm.areaCode().touched() && isAreaCodeInvalid()) {
            @for (error of guestForm.areaCode().errors(); track error) {
              <mat-error>{{ error.message }}</mat-error>
            }
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="phone-number-field">
          <mat-label>{{ ts.t.reservation.phone }}</mat-label>
          <input matInput type="text" [formField]="guestForm.phoneNumber" />
          @if (guestForm.phoneNumber().touched() && isPhoneNumberInvalid()) {
            @for (error of guestForm.phoneNumber().errors(); track error) {
              <mat-error>{{ error.message }}</mat-error>
            }
          }
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>{{ ts.t.reservation.registration }}</mat-label>
        <input matInput type="text" [formField]="guestForm.carRegistration" />
        @if (guestForm.carRegistration().touched() && isCarRegistrationInvalid()) {
          @for (error of guestForm.carRegistration().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>
    </form>
  `,
  styles: `
    .phone-number-fields {
      display: flex;
      gap: 10px;
      width: 100%;
    }

    .area-code-field {
      flex: 1;
      width: 100%;
    }

    .phone-number-field {
      flex: 2;
      width: 100%;
    }

    .fi {
      margin-right: 6px;
      vertical-align: middle;
    }
  `,
})
export class GuestFormComponent {
  protected readonly ts = inject(TranslationService);

  public formValid = output<boolean>();
  public formValue = output<{
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    carRegistration: string;
    country: string
  }>();

  constructor() {
    effect(() => {
      this.formValid.emit(this.areAllFieldsValid());
      console.log(this.areAllFieldsValid.toString())
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
    country: string | null
  }>({
    country: null,
    areaCode: null,
    carRegistration: '',
    email: '',
    firstname: '',
    lastname: '',
    phoneNumber: ''
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

  protected isFirstnameInvalid = computed(() => this.guestForm.firstname().invalid());
  protected isLastnameInvalid = computed(() => this.guestForm.lastname().invalid());
  protected isEmailInvalid = computed(() => this.guestForm.email().invalid());
  protected isAreaCodeInvalid = computed(() => this.guestForm.areaCode().invalid());
  protected isPhoneNumberInvalid = computed(() => this.guestForm.phoneNumber().invalid());
  protected isCarRegistrationInvalid = computed(() => this.guestForm.carRegistration().invalid());

  protected areAllFieldsValid = computed(() => {
    console.log(this.isFirstnameInvalid().valueOf());
    console.log(this.isLastnameInvalid().valueOf());
    console.log(this.isEmailInvalid().valueOf());
    console.log(this.isAreaCodeInvalid().valueOf());
    console.log(this.isCarRegistrationInvalid().valueOf());
    return (
      !this.isFirstnameInvalid() &&
      !this.isLastnameInvalid() &&
      !this.isEmailInvalid() &&
      !this.isAreaCodeInvalid() &&
      !this.isPhoneNumberInvalid() &&
      !this.isCarRegistrationInvalid()
    );
  });

  protected displayAreaCode = (country: CountryCallingCode | null): string =>
    country ? `+${country.dialCode}` : '';

  protected onAreaCodeQueryChange(event: Event) {
    console.log((event.target as HTMLInputElement).value);
    this.areaCodeQuery.set((event.target as HTMLInputElement).value);
    if (this.guestForm.areaCode().value()) {
      this.guestForm.areaCode().value.set(null);
    }
  }

  private buildOutputValue() {
    const model = this.guestModel();
    return {
      firstname: model.firstname,
      lastname: model.lastname,
      email: model.email,
      phoneNumber: model.areaCode
        ? `+${model.areaCode.dialCode}${model.phoneNumber}`
        : model.phoneNumber,
      carRegistration: model.carRegistration,
      country: model.areaCode?.iso2 || ''
    }
  }

}
