import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { TranslationService } from '../../../../core/services/translation.service';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { email, form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'app-guest-form',
  imports: [MatFormField, MatInput, MatLabel, FormField, MatError],
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
        <input matInput type="email" [formField]="guestForm.email" />
        @if (guestForm.email().touched() && isEmailInvalid()) {
          @for (error of guestForm.email().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>{{ ts.t.reservation.phone }}</mat-label>
        <input matInput type="text" [formField]="guestForm.phoneNumber" />
        @if (guestForm.phoneNumber().touched() && isPhoneNumberInvalid()) {
          @for (error of guestForm.phoneNumber().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>

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
  styles: ``,
})
export class GuestFormComponent {
  public formValid = output<boolean>();
  public formValue = output<{
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    carRegistration: string;
    country: string;
  }>();

  protected readonly ts = inject(TranslationService);

  constructor() {
    effect(() => {
      this.formValid.emit(this.areAllFieldsValid());
      this.formValue.emit(this.guestModel());
    });
  }

  guestModel = signal<{
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    carRegistration: string;
    country: string;
  }>({
    carRegistration: '',
    country: '',
    email: '',
    firstname: '',
    lastname: '',
    phoneNumber: '',
  });

  protected guestForm = form(this.guestModel, (schema) => {
    required(schema.firstname, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.lastname, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.carRegistration, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.phoneNumber, { message: this.ts.t.reservation.validation.requiredField });
    required(schema.email, { message: this.ts.t.reservation.validation.requiredField });
    email(schema.email, { message: this.ts.t.reservation.validation.invalidEmail });
  });

  protected isFirstnameInvalid = computed(() => this.guestForm.firstname().invalid());
  protected isLastnameInvalid = computed(() => this.guestForm.lastname().invalid());
  protected isEmailInvalid = computed(() => this.guestForm.email().invalid());
  protected isPhoneNumberInvalid = computed(() => this.guestForm.phoneNumber().invalid());
  protected isCarRegistrationInvalid = computed(() => this.guestForm.carRegistration().invalid());

  protected areAllFieldsValid = computed(() => {
    return (
      !this.isFirstnameInvalid() &&
      !this.isLastnameInvalid() &&
      !this.isEmailInvalid() &&
      !this.isPhoneNumberInvalid() &&
      !this.isCarRegistrationInvalid()
    );
  });
}
