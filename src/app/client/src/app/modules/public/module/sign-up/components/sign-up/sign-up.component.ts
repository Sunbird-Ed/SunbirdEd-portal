import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Subscription, Observable, Subject } from 'rxjs';
import { ResourceService, ServerResponse, ToasterService } from '@sunbird/shared';
import { SignUpService } from './../../services';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public unsubscribe = new Subject<void>();
  signUpForm: FormGroup;
  sbFormBuilder: FormBuilder;
  showContact = 'phone';
  disableSubmitBtn = true;
  showPassword = false;
  captchaResponse = '';
  googleCaptchaSiteKey: string;
  showSignUpForm = true;
  showUniqueError = '';

  constructor(formBuilder: FormBuilder, public resourceService: ResourceService,
    public signUpService: SignUpService, public toasterService: ToasterService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    try {
      this.googleCaptchaSiteKey = (<HTMLInputElement>document.getElementById('googleCaptchaSiteKey')).value;
    } catch (error) { this.googleCaptchaSiteKey = ''; }
    this.initializeFormFields();
  }

  initializeFormFields() {
    this.signUpForm = this.sbFormBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[^(?! )][0-9]*[A-Za-z\\s]*(?!> )$')]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern('^\\d{10}$')]),
      email: new FormControl(null, [Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      contactType: new FormControl('phone'),
      uniqueContact: new FormControl(null, [Validators.required])
    }, {
        validator: (formControl) => {
          const passCtrl = formControl.controls.password;
          const conPassCtrl = formControl.controls.confirmPassword;
          if (passCtrl.value !== conPassCtrl.value) {
            conPassCtrl.setErrors({ validatePasswordConfirmation: true });
          } else { conPassCtrl.setErrors(null); }
          return null;
        }
      });
    this.onContactTypeValueChanges();
    this.enableSignUpSubmitButton();
    this.onPhoneChange();
  }

  onContactTypeValueChanges(): void {
    const emailControl = this.signUpForm.get('email');
    const phoneControl = this.signUpForm.get('phone');
    this.signUpForm.get('contactType').valueChanges.subscribe(
      (mode: string) => {
        this.signUpForm.controls['uniqueContact'].setValue('');
        if (mode === 'email') {
          this.signUpForm.controls['phone'].setValue('');
          emailControl.setValidators([Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]);
          phoneControl.clearValidators();
          this.onEmailChange();
        } else if (mode === 'phone') {
          this.signUpForm.controls['email'].setValue('');
          emailControl.clearValidators();
          phoneControl.setValidators([Validators.required, Validators.pattern('^\\d{10}$')]);
          this.onPhoneChange();
        }
        emailControl.updateValueAndValidity();
        phoneControl.updateValueAndValidity();
      });
  }

  enableSignUpSubmitButton() {
    this.signUpForm.valueChanges.subscribe(val => {
      if (this.signUpForm.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = true;
      }
    });
  }

  onPhoneChange() {
    const phoneControl = this.signUpForm.get('phone');
    let phoneValue = '';
    phoneControl.valueChanges.subscribe(
      (data: string) => {
        if (phoneControl.status === 'VALID' && phoneValue !== phoneControl.value) {
          this.signUpForm.controls['uniqueContact'].setValue('');
          this.vaidateUserContact();
          phoneValue = phoneControl.value;
        }
      });
  }

  onEmailChange() {
    const emailControl = this.signUpForm.get('email');
    let emailValue = '';
    emailControl.valueChanges.subscribe(
      (data: string) => {
        if (emailControl.status === 'VALID' && emailValue !== emailControl.value) {
          this.signUpForm.controls['uniqueContact'].setValue('');
          this.vaidateUserContact();
          emailValue = emailControl.value;
        }
      });
  }

  vaidateUserContact() {
    const request = {
      'request': {
        'key': this.signUpForm.controls.contactType.value.toString(),
        'value': this.signUpForm.controls.contactType.value === 'phone' ?
          this.signUpForm.controls.phone.value.toString() : this.signUpForm.controls.email.value
      }
    };
    this.signUpService.getUserByKey(request).subscribe(
      (data: ServerResponse) => {
        this.showUniqueError = this.signUpForm.controls.contactType.value === 'phone' ?
          this.resourceService.frmelmnts.lbl.uniquePhone : this.resourceService.frmelmnts.lbl.uniqueEmail;
      },
      (err: ServerResponse) => {
        this.signUpForm.controls['uniqueContact'].setValue(true);
        this.showUniqueError = '';
      }
    );
  }

  displayPassword() {
    if (this.showPassword) {
      this.showPassword = false;
    } else {
      this.showPassword = true;
    }
  }

  resolved(captchaResponse: string) {
    if (captchaResponse) {
      this.onSubmitSignUpForm();
    }
    const newResponse = captchaResponse
      ? `${captchaResponse.substr(0, 7)}...${captchaResponse.substr(-7)}`
      : captchaResponse;
    this.captchaResponse += `${JSON.stringify(newResponse)}\n`;
  }

  onSubmitSignUpForm() {
    this.generateOTP();
  }

  generateOTP() {
    const request = {
      'request': {
        'key': this.signUpForm.controls.contactType.value === 'phone' ?
          this.signUpForm.controls.phone.value.toString() : this.signUpForm.controls.email.value,
        'type': this.signUpForm.controls.contactType.value.toString()
      }
    };
    this.signUpService.generateOTP(request).subscribe(
      (data: ServerResponse) => {
        this.showSignUpForm = false;
        this.disableSubmitBtn = false;
      },
      (err) => {
        const failedgenerateOTPMessage = (err.error.params.status === 'PHONE_ALREADY_IN_USE') ||
          (err.error.params.status === 'EMAIL_IN_USE') ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0085;
        this.toasterService.error(failedgenerateOTPMessage);
        this.resetGoogleCaptcha();
        this.disableSubmitBtn = false;
      }
    );
  }

  resetGoogleCaptcha() {
    const element: HTMLElement = document.getElementById('resetGoogleCaptcha') as HTMLElement;
    element.click();
  }

  showParentForm(event) {
    if (event === 'true') {
      this.initializeFormFields();
      this.showSignUpForm = true;
    }
  }
}
