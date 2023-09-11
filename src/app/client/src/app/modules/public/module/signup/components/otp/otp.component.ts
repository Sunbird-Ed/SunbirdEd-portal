import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SignupService } from './../../services';
import { ResourceService, ServerResponse, UtilService, ConfigService, ToasterService } from '@sunbird/shared';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IEndEventInput, IInteractEventEdata, TelemetryService } from '@sunbird/telemetry';
import { TncService } from '@sunbird/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ProfileService } from '@sunbird/profile';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss', '../signup/signup_form.component.scss']
})
export class OtpComponent implements OnInit {
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  @Input() signUpdata: any;
  @Output() redirectToParent = new EventEmitter();
  otpForm: UntypedFormGroup;
  disableSubmitBtn = true;
  mode: string;
  errorMessage: string;
  infoMessage: string;
  unabletoVerifyErrorMessage: string;
  disableResendButton = false;
  showSignUpLink = false;

  telemetryEnd: IEndEventInput;
  submitOtpInteractEdata: IInteractEventEdata;
  submitResendOtpInteractEdata: IInteractEventEdata;
  generateOTPErrorInteractEdata: any;
  generateVerifyOtpErrorInteractEdata: any;
  createUserErrorInteractEdata: any;
  telemetryCdata: Array<{}>;
  instance: string;
  emailAddress: any;
  phoneNumber: any;
  remainingAttempt: 'string';
  resendOTPbtn;
  counter;
  resendOtpCounter = 1;
  maxResendTry = 4;
  googleCaptchaSiteKey: string;
  isP2CaptchaEnabled: any;
  redirecterrorMessage = false;
  termsAndConditionLink: string;
  tncLatestVersion: string;
  showTncPopup = false;
  @Output() subformInitialized: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() triggerNext: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() startingForm: any;

  constructor(public resourceService: ResourceService, public signupService: SignupService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public deviceDetectorService: DeviceDetectorService, public router: Router,
    public utilService: UtilService, public configService: ConfigService,
    public tncService: TncService, private toasterService: ToasterService,
    private profileService: ProfileService) {
  }

  ngOnInit() {
    // console.log('Global Object data => ', this.startingForm); // TODO: log!
    this.emailAddress = _.get(this.startingForm, 'emailPassInfo.type') === 'email' ? _.get(this.startingForm, 'emailPassInfo.key') : '';
    this.phoneNumber = _.get(this.startingForm, 'emailPassInfo.type') === 'phone' ? _.get(this.startingForm, 'emailPassInfo.key') : '';
    this.mode = _.get(this.startingForm, 'emailPassInfo.type');
    this.otpForm = new UntypedFormGroup({
      otp: new UntypedFormControl('', [Validators.required]),
      tncAccepted: new UntypedFormControl(false, [Validators.requiredTrue])
    });
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
    });
    this.enableSignUpSubmitButton();
    this.unabletoVerifyErrorMessage = this.mode === 'phone' ? this.resourceService.frmelmnts.lbl.unableToVerifyPhone :
      this.resourceService.frmelmnts.lbl.unableToVerifyEmail;
    this.setInteractEvent();
    this.instance = _.upperCase(this.resourceService.instance);
    this.resendOtpEnablePostTimer();
    try {
      this.googleCaptchaSiteKey = (<HTMLInputElement>document.getElementById('googleCaptchaSiteKey')).value;
    } catch (error) {
      this.googleCaptchaSiteKey = '';
    }
    this.isP2CaptchaEnabled = (<HTMLInputElement>document.getElementById('p2reCaptchaEnabled'))
      ? (<HTMLInputElement>document.getElementById('p2reCaptchaEnabled')).value : 'true';
  }
  resendOtpEnablePostTimer() {
    this.counter = 20;
    this.disableResendButton = false;
    setTimeout(() => {
      this.disableResendButton = true;
    }, 22000);
    const interval = setInterval(() => {
      this.resendOTPbtn = this.resourceService.frmelmnts.lbl.resendOTP + ' (' + this.counter + ')';
      this.counter--;
      if (this.counter < 0) {
        this.resendOTPbtn = this.resourceService.frmelmnts.lbl.resendOTP;
        clearInterval(interval);
      }
    }, 1000);
  }
  verifyOTP() {
    const wrongOTPMessage = this.mode === 'phone' ? this.resourceService.frmelmnts.lbl.wrongPhoneOTP :
      this.resourceService.frmelmnts.lbl.wrongEmailOTP;
    this.disableSubmitBtn = true;
    const request = {
      'request': {
        'key': _.get(this.startingForm, 'emailPassInfo.key'),
        'type': this.mode,
        'otp': _.trim(this.otpForm.controls.otp.value)
      }
    };
    this.signupService.verifyOTP(request).subscribe(
      (data: ServerResponse) => {
        this.infoMessage = '';
        this.errorMessage = '';
        if (_.get(this.startingForm, 'routeParams.loginMode') === 'gmail') {
          this.updateUserBasicInfo();
        } else {
          this.createUser(data);
        }
      },
      (err) => {
        this.logVerifyOtpError(err.error.params.errmsg);
        this.telemetryService.interact(this.generateVerifyOtpErrorInteractEdata);
        if (_.get(err, 'error.result.remainingAttempt') === 0) {
          this.utilService.redirectToLogin(this.resourceService.messages.emsg.m0050);
        } else {
          this.infoMessage = '';
          this.otpForm.controls.otp.setValue('');
          this.remainingAttempt = _.get(err, 'error.result.remainingAttempt');
          this.errorMessage =
            _.get(err, 'error.params.status') === this.configService.constants.HTTP_STATUS_CODES.OTP_VERIFICATION_FAILED ?
              _.get(this.resourceService, 'messages.imsg.m0086') : wrongOTPMessage;
          if (this.disableResendButton) {
            this.showSignUpLink = true;
            this.telemetryService.end(this.telemetryEnd);
          }
          this.disableSubmitBtn = false;
        }
      }
    );
  }

  logVerifyOtpError(error) {
    this.generateVerifyOtpErrorInteractEdata = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        id: 'invalid-otp-error',
        type: 'click',
        pageid: 'otp',
        extra: {
          'isError': 'true'
        }
      }
    };
  }

  createUser(data?: any) {
    let identifier = '';
    const createRequest = {
      params: {
        source: _.get(this.activatedRoute, 'snapshot.queryParams.client_id'),
        signupType: 'self'
      },
      'request': {
        'firstName': _.trim(_.get(this.startingForm, 'basicInfo.name')),
        'password': _.trim(_.get(this.startingForm, 'emailPassInfo.password')),
        'dob': _.get(this.startingForm, 'basicInfo.yearOfBirth').toString(),
      }
    };
    if (this.mode === 'phone') {
      createRequest.request['phone'] = _.get(this.startingForm, 'emailPassInfo.key').toString();
      createRequest.request['phoneVerified'] = true;
      identifier = _.get(this.startingForm, 'emailPassInfo.key').toString();
    } else {
      createRequest.request['email'] = _.get(this.startingForm, 'emailPassInfo.key');
      createRequest.request['emailVerified'] = true;
      identifier = _.get(this.startingForm, 'emailPassInfo.key');
    }
    createRequest.request['reqData'] = _.get(data, 'reqData');
    if (this.otpForm.controls.tncAccepted.value && this.otpForm.controls.tncAccepted.status === 'VALID') {
      this.signupService.createUserV3(createRequest).subscribe((resp: ServerResponse) => {
        this.telemetryLogEvents('sign-up', true);
        const tncAcceptRequestBody = {
          request: {
            version: this.tncLatestVersion,
            identifier: identifier
          }
        };
        this.signupService.acceptTermsAndConditions(tncAcceptRequestBody).subscribe(res => {
          this.telemetryLogEvents('accept-tnc', true);
          this.redirectToSignPage();
        }, (err) => {
          this.telemetryLogEvents('accept-tnc', false);
          this.redirectToSignPage();
        });
      },
        (err) => {
          this.telemetryLogEvents('sign-up', false);
          this.infoMessage = '';
          this.errorMessage = this.resourceService.messages.fmsg.m0085;
          this.disableSubmitBtn = false;
          this.logCreateUserError(err.error.params.errmsg);
          this.telemetryService.interact(this.createUserErrorInteractEdata);
          if (err.status === 301) {
            this.redirecterrorMessage = true;
          } else {
            this.redirecterrorMessage = false;
          }
        }
      );
    }
  }

  /**
   * Redirects to sign in Page with success message
   */
  redirectToSignPage() {
    const reqQuery = this.activatedRoute.snapshot.queryParams;
    const queryObj = _.pick(reqQuery,
      ['client_id', 'redirect_uri', 'scope', 'state', 'response_type', 'version']);
    queryObj['success_message'] = this.mode === 'phone' ? this.resourceService.frmelmnts.lbl.createUserSuccessWithPhone :
      this.resourceService.frmelmnts.lbl.createUserSuccessWithEmail;
    const query = Object.keys(queryObj).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(queryObj[key]);
    }).join('&');
    const redirect_uri = reqQuery.error_callback + '?' + query;
    this.telemetryService.end(this.telemetryEnd);
    window.location.href = redirect_uri;
  }

  logCreateUserError(error) {
    this.createUserErrorInteractEdata = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        id: 'create-user-error',
        type: 'click',
        pageid: 'otp',
        extra: {
          'isError': 'true'
        }
      }
    };
  }

  resendOTP(captchaResponse?) {
    this.resendOtpCounter = this.resendOtpCounter + 1;
    if (this.resendOtpCounter >= this.maxResendTry) {
      this.disableResendButton = false;
      this.infoMessage = '';
      this.errorMessage = this.resourceService.frmelmnts.lbl.OTPresendMaxretry;
      return false;
    }
    const request = {
      'request': {
        'key': _.trim(_.get(this.startingForm, 'emailPassInfo.key').toString()),
        'type': this.mode
      }
    };
    this.signupService.generateOTPforAnonymousUser(request, captchaResponse).subscribe(
      (data: ServerResponse) => {
        this.resendOtpEnablePostTimer();
        this.errorMessage = '';
        this.infoMessage = this.resourceService.frmelmnts.lbl.resentOTP;
      },
      (err) => {
        this.infoMessage = '';
        this.errorMessage = this.resourceService.messages.fmsg.m0085;
        this.logGenerateOtpError(err.error.params.errmsg);
        this.telemetryService.interact(this.generateOTPErrorInteractEdata);
      }
    );
  }

  resolved(captchaResponse: string) {
    if (captchaResponse) {
      this.resendOTP(captchaResponse);
    }
  }

  resetGoogleCaptcha() {
    const element: HTMLElement = document.getElementById('resetGoogleCaptcha') as HTMLElement;
    element.click();
  }

  generateResendOTP() {
    if (this.isP2CaptchaEnabled === 'true') {
      this.resetGoogleCaptcha();
      this.captchaRef.execute();
    } else {
      this.resendOTP();
    }
  }

  logGenerateOtpError(error) {
    this.generateOTPErrorInteractEdata = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        id: 'resend-otp-error',
        type: 'click',
        pageid: 'otp',
        extra: {
          'isError': 'true'
        }
      }
    };
  }

  enableSignUpSubmitButton() {
    this.otpForm.valueChanges.subscribe(val => {
      if (this.otpForm.status === 'VALID') {
        this.disableSubmitBtn = false;
      } else {
        this.disableSubmitBtn = true;
      }
    });
  }

  redirectToSignUp() {
    this.redirectToParent.emit('true');
  }

  setInteractEvent() {
    this.telemetryCdata = [{ 'type': 'otp', 'id': this.activatedRoute.snapshot.data.telemetry.uuid }];

    this.submitOtpInteractEdata = {
      id: 'submit-otp',
      type: 'click',
      pageid: 'otp',
      extra: {
        'values': '/sign-up'
      }
    };

    this.submitResendOtpInteractEdata = {
      id: 'resend-otp',
      type: 'click',
      pageid: 'otp'
    };

    this.telemetryEnd = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        type: 'signup',
        pageid: 'signup',
        mode: 'self'
      }
    };
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

  generateTelemetry(e) {
    const selectedType = e.target.checked ? 'selected' : 'unselected';
    const interactData = {
      context: {
        env: 'self-signup',
        cdata: [
          { id: 'user:tnc:accept', type: 'Feature' },
          { id: 'SB-16663', type: 'Task' }
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

  updateUserBasicInfo() {
    const req = {
      'firstName': _.trim(_.get(this.startingForm, 'basicInfo.name')),
      'dob': _.get(this.startingForm, 'basicInfo.yearOfBirth').toString(),
    };
    this.profileService.updateProfile(req).subscribe(res => {
      if(_.get(res, 'result.response') === 'SUCCESS') {
        let _msg =  _.get(this.startingForm, 'emailPassInfo.type') === 'phone' ? this.resourceService.frmelmnts.lbl.createUserSuccessWithPhone :
        this.resourceService.frmelmnts.lbl.createUserSuccessWithEmail;
        this.toasterService.success(_msg);
        setTimeout(() => {
          this.router.navigate(['/resources']);
        }, 1000);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0085);
      }
    }, err => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0085);
    });
  }
}
