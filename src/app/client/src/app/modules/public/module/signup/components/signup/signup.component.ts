import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import {
  ResourceService,
  ConfigService,
  ServerResponse,
  ToasterService,
  NavigationHelperService,
  UtilService,
  RecaptchaService
} from '@sunbird/shared';
import { SignupService } from './../../services';
import { TenantService, TncService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('captchaRef', {static: false}) captchaRef: RecaptchaComponent;
  public unsubscribe = new Subject<void>();
  signUpForm: FormGroup;
  sbFormBuilder: FormBuilder;
  showContact = 'phone';
  disableSubmitBtn = true;
  disableForm = true;
  showPassword = false;
  captchaResponse = '';
  googleCaptchaSiteKey: string;
  showSignUpForm = true;
  showUniqueError = '';
  tenantDataSubscription: Subscription;
  logo: string;
  tenantName: string;
  resourceDataSubscription: any;
  telemetryStart: IStartEventInput;
  telemetryImpression: IImpressionEventInput;
  submitInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}>;
  instance: string;
  tncLatestVersion: string;
  termsAndConditionLink: string;
  passwordError: string;
  showTncPopup = false;
  birthYearOptions: Array<number> = [];
  isMinor: Boolean = false;
  formInputType: string;
  isP1CaptchaEnabled: any;
  yearOfBirth: string;

  constructor(formBuilder: FormBuilder, public resourceService: ResourceService,
    public signupService: SignupService, public toasterService: ToasterService,
    public tenantService: TenantService, public deviceDetectorService: DeviceDetectorService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public navigationhelperService: NavigationHelperService, public utilService: UtilService,
    public configService: ConfigService,  public recaptchaService: RecaptchaService,
    public tncService: TncService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.tncService.getTncConfig().subscribe((data: ServerResponse) => {
      this.telemetryLogEvents('fetch-terms-condition', true);
        const response = _.get(data, 'result.response.value');
        if (response) {
          try {
            const tncConfig = this.utilService.parseJson(response);
            this.tncLatestVersion = _.get(tncConfig, 'latestVersion') || {};
            this.termsAndConditionLink = tncConfig[this.tncLatestVersion].url;
          } catch (e) {
            this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
          }
        }
      }, (err) => {
      this.telemetryLogEvents('fetch-terms-condition', false);
        this.toasterService.error(_.get(this.resourceService, 'messages.fmsg.m0004'));
      }
    );
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
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
    this.initializeFormFields();
    this.setInteractEventData();

    // Telemetry Start
    this.signUpTelemetryStart();

    this.initiateYearSelecter();
    // disabling the form as age should be selected
    this.signUpForm.disable();
    this.isP1CaptchaEnabled = (<HTMLInputElement>document.getElementById('p1reCaptchaEnabled'))
      ? (<HTMLInputElement>document.getElementById('p1reCaptchaEnabled')).value : 'true';
  }


  changeBirthYear(selectedBirthYear) {
    this.signUpForm.enable();
    this.disableForm = false;
    const currentYear = new Date().getFullYear();
    this.yearOfBirth = `${selectedBirthYear}`;
    const userAge = currentYear - selectedBirthYear;
    this.isMinor = userAge < this.configService.constants.SIGN_UP.MINIMUN_AGE;
  }

  initiateYearSelecter() {
    const endYear = new Date().getFullYear();
    const startYear = endYear - this.configService.constants.SIGN_UP.MAX_YEARS;
    for (let year = endYear; year > startYear; year--) {
      this.birthYearOptions.push(year);
    }
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
      uniqueContact: new FormControl(null, [Validators.required]),
      tncAccepted: new FormControl(false, [Validators.requiredTrue])
    }, {
      validator: (formControl) => {
        const passCtrl = formControl.controls.password;
        const conPassCtrl = formControl.controls.confirmPassword;
        const nameCtrl = formControl.controls.name;
        this.onPasswordChange(passCtrl);
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
  }

  onPasswordChange(passCtrl: FormControl): void {
    let emailVal;
    if (this.showContact === 'email') {
      emailVal = this.signUpForm.get('email').value;
    }
    const val = _.get(passCtrl, 'value');
    const specRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~.,)(}{\\[!"#$%&\'()*+,-./:;<=>?@[^_`{|}~\\]])(?=\\S+$).{8,}');
    if (!specRegex.test(val)) {
      this.passwordError = _.get(this.resourceService, 'frmelmnts.lbl.passwd');
      passCtrl.setErrors({ passwordError: this.passwordError });
    } else if (emailVal === val || this.signUpForm.controls.name.value === val) {
      this.passwordError = _.get(this.resourceService, 'frmelmnts.lbl.passwderr');
      passCtrl.setErrors({ passwordError: this.passwordError });
    } else {
      this.passwordError = _.get(this.resourceService, 'frmelmnts.lbl.passwd');
      passCtrl.setErrors(null);
    }
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
          emailControl.setValidators([Validators.required, Validators.email]);
          phoneControl.clearValidators();
        } else if (mode === 'phone') {
          this.signUpForm.controls['email'].setValue('');
          emailControl.clearValidators();
          phoneControl.setValidators([Validators.required, Validators.pattern('^\\d{10}$')]);
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

  vaidateUserContact(captchaResponse?) {
    const value = this.signUpForm.controls.contactType.value === 'phone' ?
      this.signUpForm.controls.phone.value.toString() : this.signUpForm.controls.email.value;
    const uri = this.signUpForm.controls.contactType.value.toString() + '/' + value + '?captchaResponse=' + captchaResponse;
    this.signupService.checkUserExists(uri).subscribe(
      (data: ServerResponse) => {
        if (_.get(data, 'result.exists')) {
          this.signUpForm.controls['uniqueContact'].setValue('');
          this.showUniqueError = this.signUpForm.controls.contactType.value === 'phone' ?
            this.resourceService.frmelmnts.lbl.uniquePhone : this.resourceService.frmelmnts.lbl.uniqueEmail;
        } else {
          this.signUpForm.controls['uniqueContact'].setValue(true);
          this.showUniqueError = '';
        }
      },
      (err) => {
        if (_.get(err, 'error.params.status') && err.error.params.status === 'USER_ACCOUNT_BLOCKED') {
          this.showUniqueError = this.resourceService.frmelmnts.lbl.blockedUserError;
        } else if (err.status === 418) {
          this.signUpForm.controls['uniqueContact'].setValue(true);
          this.showUniqueError = this.resourceService.frmelmnts.lbl.captchaValidationFailed;
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
  /**
   * @param  {string} inputType : User input type `email` or `phone`
   * @description : Function to trigger reCaptcha for onBlur event of user input
   * @since - release-3.0.1
   */
  getReCaptchaToken(inputType: string) {
    if (this.isP1CaptchaEnabled === 'true') {
      this.resetGoogleCaptcha();
      this.formInputType = inputType;
      const emailControl = this.signUpForm.get('email');
      const phoneControl = this.signUpForm.get('phone');
      if (inputType === 'email' && emailControl.status === 'VALID' && emailControl.value !== '') {
         this.signUpForm.controls['uniqueContact'].setValue('');
        this.captchaRef.execute();
      } else if (inputType === 'phone' && phoneControl.status === 'VALID' && phoneControl.value !== '') {
         this.signUpForm.controls['uniqueContact'].setValue('');
        this.captchaRef.execute();
      }
    } else {
      this.vaidateUserContact();
    }
  }

  /**
   * @description - Intermediate function to get captcha token and submit sign up form
   * @since - release-3.0.3
   */
  submitSignupForm() {
    if (this.isP1CaptchaEnabled === 'true') {
      this.resetGoogleCaptcha();
      this.captchaRef.execute();
    } else {
      this.onSubmitSignUpForm();
    }
  }

  resolved(captchaResponse: string) {
    if (captchaResponse) {
      if (this.formInputType) {
        this.vaidateUserContact(captchaResponse);
        this.formInputType = undefined;
      } else {
        this.onSubmitSignUpForm(captchaResponse);
      }
    }
  }

  onSubmitSignUpForm(captchaResponse?) {
    this.disableSubmitBtn = true;
    this.generateOTP(captchaResponse);
  }

  generateOTP(captchaResponse?) {
    const request = {
      'request': {
        'key': this.signUpForm.controls.contactType.value === 'phone' ?
          this.signUpForm.controls.phone.value.toString() : this.signUpForm.controls.email.value,
        'type': this.signUpForm.controls.contactType.value.toString()
      }
    };
    if (this.isMinor) {
      request.request['templateId'] = this.configService.constants.TEMPLATES.VERIFY_OTP_MINOR;
    }
    this.signupService.generateOTPforAnonymousUser(request, captchaResponse).subscribe(
      (data: ServerResponse) => {
        this.showSignUpForm = false;
        this.disableSubmitBtn = false;
      },
      (err) => {
        const failedgenerateOTPMessage = (_.get(err, 'error.params.status') && err.error.params.status === 'PHONE_ALREADY_IN_USE') ||
          (_.get(err, 'error.params.status') &&
            err.error.params.status === 'EMAIL_IN_USE') ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0085;
        this.toasterService.error(failedgenerateOTPMessage);
        if (this.isP1CaptchaEnabled === 'true') { this.resetGoogleCaptcha(); }
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

  generateTelemetry(e) {
    const selectedType = e.target.checked ? 'selected' : 'unselected';
    const interactData = {
      context: {
        env: 'self-signup',
        cdata: [
          {id: 'user:tnc:accept', type: 'Feature'},
          {id: 'SB-16663', type: 'Task'}
        ]
      },
      edata: {
        id: 'user:tnc:accept',
        type: 'click',
        subtype: selectedType,
        pageid: 'self-signup'
      }
    };
    this.telemetryService.interact(interactData);
  }

  telemetryLogEvents(api: any, status: boolean) {
    let level = 'ERROR';
    let msg = api + ' failed';
    if (status) {
      level = 'SUCCESS';
      msg = api + ' success';
    }
    const event = {
      context: {
        env: 'self-signup'
      },
      edata: {
        type: api,
        level: level,
        message: msg
      }
    };
    this.telemetryService.log(event);
  }

  showAndHidePopup(mode: boolean) {
    this.showTncPopup = mode;
  }
}
