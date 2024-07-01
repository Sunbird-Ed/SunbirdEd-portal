import { Component, OnInit, EventEmitter, OnDestroy, AfterViewInit, ViewChild, Output, Input } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl, AbstractControl } from '@angular/forms';
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
  selector: 'app-signup-email-password',
  templateUrl: './signup-email-password.component.html',
  styleUrls: ['./signup-email-password.component.scss' , '../signup/signup_form.component.scss']
})

export class SignupEmailPasswordComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  public unsubscribe = new Subject<void>();
  signUpForm: UntypedFormGroup;
  sbFormBuilder: UntypedFormBuilder;
  showContact = 'phone';
  disableSubmitBtn = true;
  disableForm = false;
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
  isIOSDevice = false;
  @Output() subformInitialized: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() triggerNext: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() startingForm: object;
  updateSignUpForm: UntypedFormGroup;
  showUpdateSignUpForm: boolean = false;

  constructor(formBuilder: UntypedFormBuilder, public resourceService: ResourceService,
    public signupService: SignupService, public toasterService: ToasterService,
    public tenantService: TenantService, public deviceDetectorService: DeviceDetectorService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public navigationhelperService: NavigationHelperService, public utilService: UtilService,
    public configService: ConfigService,  public recaptchaService: RecaptchaService,
    public tncService: TncService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    // console.log('Global Object data => ', this.startingForm); // TODO: log!
    this.isMinor = _.get(this.startingForm, 'basicInfo.isMinor') ? _.get(this.startingForm, 'basicInfo.isMinor') : false;
    this.isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
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
    if (_.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      this.showUpdateSignUpForm = true;
      this.initializeUpdateForm();
    } else {
      this.initializeFormFields();
    }
    this.setInteractEventData();
    // Telemetry Start
    this.signUpTelemetryStart();
    this.isP1CaptchaEnabled = (<HTMLInputElement>document.getElementById('p1reCaptchaEnabled'))
      ? (<HTMLInputElement>document.getElementById('p1reCaptchaEnabled')).value : 'true';
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
      password: new UntypedFormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new UntypedFormControl(null, [Validators.required, Validators.minLength(8)]),
      phone: new UntypedFormControl(null, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      email: new UntypedFormControl(null, [Validators.email]),
      contactType: new UntypedFormControl('phone'),
      uniqueContact: new UntypedFormControl(null, [Validators.required]),
    }, {
      validator: (formControl) => {
        const passCtrl = formControl.controls.password;
        const conPassCtrl = formControl.controls.confirmPassword;
        this.onPasswordChange(passCtrl);
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

  onPasswordChange(passCtrl: UntypedFormControl): void {
    let emailVal;
    if (this.showContact === 'email') {
      emailVal = this.signUpForm.get('email').value;
    }
    const val = _.get(passCtrl, 'value');
    const specRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~.,)(}{\\[!"#$%&\'()*+,-./:;<=>?@[^_`{|}~\\]])(?=\\S+$).{8,}');
    if (!specRegex.test(val)) {
      this.passwordError = _.get(this.resourceService, 'frmelmnts.lbl.passwd');
      passCtrl.setErrors({ passwordError: this.passwordError });
    } else if (emailVal === val) {
      this.passwordError = _.get(this.resourceService, 'frmelmnts.lbl.passwderr');
      passCtrl.setErrors({ passwordError: this.passwordError });
    } else {
      this.passwordError = _.get(this.resourceService, 'frmelmnts.lbl.passwd');
      passCtrl.setErrors(null);
    }
  }

  onContactTypeValueChanges(): void {
    let _form = this.signUpForm;
    if (_.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      _form = this.updateSignUpForm;
    }
    const emailControl = _form.get('email');
    const phoneControl = _form.get('phone');
    _form.get('contactType').valueChanges.subscribe(
      (mode: string) => {
        this.setInteractEventData();
        _form.controls['uniqueContact'].setValue('');
        if (mode === 'email') {
          _form.controls['phone'].setValue('');
          emailControl.setValidators([Validators.required, Validators.email]);
          phoneControl.clearValidators();
        } else if (mode === 'phone') {
          _form.controls['email'].setValue('');
          emailControl.clearValidators();
          phoneControl.setValidators([Validators.required, Validators.pattern('^\\d{10}$')]);
        }
        emailControl.updateValueAndValidity();
        phoneControl.updateValueAndValidity();
      });
  }

  enableSignUpSubmitButton() {
    let _form = this.signUpForm;
    if (_.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      _form = this.updateSignUpForm;
    }
    _form.valueChanges.subscribe(val => {
      if (_form.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = true;
      }
    });
  }

  vaidateUserContact(captchaResponse?) {
    const value = this.signUpForm.controls.contactType.value === 'phone' ?
      this.signUpForm?.controls?.phone?.value.toString() : this.signUpForm?.controls?.email?.value;
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
    let _form = this.signUpForm;
    if (_.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      _form = this.updateSignUpForm;
    }
    if (this.isP1CaptchaEnabled === 'true') {
      this.resetGoogleCaptcha();
      this.formInputType = inputType;
      const emailControl =_form.get('email');
      const phoneControl =_form.get('phone');
      if (inputType === 'email' && emailControl.status === 'VALID' && emailControl.value !== '') {
        _form.controls['uniqueContact'].setValue('');
        this.captchaRef.execute();
      } else if (inputType === 'phone' && phoneControl.status === 'VALID' && phoneControl.value !== '') {
        _form.controls['uniqueContact'].setValue('');
        this.captchaRef.execute();
      }
    } else if (_.get(this.startingForm, 'routeParams.loginMode') !== 'gmail') {
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
      if (this.formInputType && _.get(this.startingForm, 'routeParams.loginMode') !== 'gmail') {
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
    let _form = this.signUpForm;
    if (_.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      _form = this.updateSignUpForm;
    }
    const request = {
      'request': {
        'key': _form.controls.contactType.value === 'phone' ?
          _form.controls.phone.value.toString() : _form.controls.email.value,
        'type': _form.controls.contactType.value.toString()
      }
    };
    if (this.isMinor) {
      request.request['templateId'] = this.configService.constants.TEMPLATES.VERIFY_OTP_MINOR;
    }
    this.signupService.generateOTPforAnonymousUser(request, captchaResponse).subscribe(
      (data: ServerResponse) => {
        this.showSignUpForm = false;
        this.disableSubmitBtn = false;
        request.request['password'] = _form?.controls?.password?.value?.toString();
        this.subformInitialized.emit(request.request);
        this.triggerNext.emit();
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
    let _form = this.signUpForm;
    if (_.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
      _form = this.updateSignUpForm;
    }
    this.submitInteractEdata = {
      id: 'submit-signup',
      type: 'click',
      pageid: 'signup',
      extra: {
        'contactType': _form.controls.contactType.value.toString()
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

  initializeUpdateForm() {
    this.updateSignUpForm = this.sbFormBuilder.group({
      phone: new UntypedFormControl(null, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      email: new UntypedFormControl(null, [Validators.email]),
      contactType: new UntypedFormControl('phone'),
      uniqueContact: new UntypedFormControl(null),
    });
    this.onContactTypeValueChanges();
    this.enableSignUpSubmitButton();
  }

  resetInput() {
    this.updateSignUpForm.controls.phone.reset();
    this.updateSignUpForm.controls.email.reset();
  }
}
