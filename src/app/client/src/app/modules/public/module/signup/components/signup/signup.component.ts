import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ResourceService, ServerResponse, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { SignupService } from './../../services';
import { TenantService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute } from '@angular/router';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy, AfterViewInit {
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
  tenantDataSubscription: Subscription;
  logo: string;
  tenantName: string;

  telemetryStart: IStartEventInput;
  telemetryImpression: IImpressionEventInput;
  submitInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}>;

  constructor(formBuilder: FormBuilder, public resourceService: ResourceService,
    public signupService: SignupService, public toasterService: ToasterService, private cacheService: CacheService,
    public tenantService: TenantService, public deviceDetectorService: DeviceDetectorService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public navigationhelperService: NavigationHelperService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          this.logo = data.tenantData.logo;
          this.tenantName = data.tenantData.titleName;
        }
      }
    );

    try {
      this.googleCaptchaSiteKey = (<HTMLInputElement>document.getElementById('googleCaptchaSiteKey')).value;
    } catch (error) {
      this.googleCaptchaSiteKey = '';
    }
    this.getCacheLanguage();
    this.initializeFormFields();
    this.setInteractEventData();

    // Telemetry Start
    this.signUpTelemetryStart();
  }

  getCacheLanguage() {
    this.resourceService.languageSelected$
      .subscribe(item => {
        this.resourceService.getResource(item.value);
      }
      );
  }

  signUpTelemetryStart() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.telemetryStart = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: this.activatedRoute.snapshot.data.telemetry.mode,
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };
  }

  signUpTelemetryImpression() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.activatedRoute.snapshot.data.telemetry.uri,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }

  initializeFormFields() {
    this.signUpForm = this.sbFormBuilder.group({
      name: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      email: new FormControl(null, [Validators.email]),
      contactType: new FormControl('phone'),
      uniqueContact: new FormControl(null, [Validators.required])
    }, {
        validator: (formControl) => {
          const passCtrl = formControl.controls.password;
          const conPassCtrl = formControl.controls.confirmPassword;
          const nameCtrl = formControl.controls.name;
          if (_.trim(nameCtrl.value) === '') { nameCtrl.setErrors({ required: true }); }
          if (_.trim(passCtrl.value) === '') { passCtrl.setErrors({ required: true }); }
          if (_.trim(conPassCtrl.value) === '') { conPassCtrl.setErrors({ required: true }); }
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
        this.setInteractEventData();
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
    const value = this.signUpForm.controls.contactType.value === 'phone' ?
      this.signUpForm.controls.phone.value.toString() : this.signUpForm.controls.email.value;
    const uri = this.signUpForm.controls.contactType.value.toString() + '/' + value;
    this.signupService.getUserByKey(uri).subscribe(
      (data: ServerResponse) => {
        this.showUniqueError = this.signUpForm.controls.contactType.value === 'phone' ?
          this.resourceService.frmelmnts.lbl.uniquePhone : this.resourceService.frmelmnts.lbl.uniqueEmail;
      },
      (err) => {
        if (_.get(err, 'error.params.status') && err.error.params.status === 'USER_ACCOUNT_BLOCKED') {
          this.showUniqueError = this.resourceService.frmelmnts.lbl.blockedUserError;
        } else {
          this.signUpForm.controls['uniqueContact'].setValue(true);
          this.showUniqueError = '';
        }
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
    const newResponse = captchaResponse
      ? `${captchaResponse.substr(0, 7)}...${captchaResponse.substr(-7)}`
      : captchaResponse;
    this.captchaResponse += `${JSON.stringify(newResponse)}\n`;
    if (this.captchaResponse) {
      this.onSubmitSignUpForm();
    }
  }

  onSubmitSignUpForm() {
    this.disableSubmitBtn = true;
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
    this.signupService.generateOTP(request).subscribe(
      (data: ServerResponse) => {
        this.showSignUpForm = false;
        this.disableSubmitBtn = false;
      },
      (err) => {
        const failedgenerateOTPMessage = (_.get(err, 'error.params.status') && err.error.params.status === 'PHONE_ALREADY_IN_USE') ||
          (_.get(err, 'error.params.status') &&
          err.error.params.status === 'EMAIL_IN_USE') ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0085;
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

  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryCdata = [{ 'type': 'signup', 'id': this.activatedRoute.snapshot.data.telemetry.uuid }];
      this.signUpTelemetryImpression();
    });
  }

  ngOnDestroy() {
    if (this.tenantDataSubscription) {
      this.tenantDataSubscription.unsubscribe();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setInteractEventData() {
    this.submitInteractEdata = {
      id: 'submit-signup',
      type: 'click',
      pageid: 'signup',
      extra: {
        'contactType': this.signUpForm.controls.contactType.value.toString()
      }
    };
  }
}
