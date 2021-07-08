import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SignupService } from './../../services';
import { ResourceService, ServerResponse, UtilService, ConfigService } from '@sunbird/shared';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IEndEventInput, IInteractEventEdata, TelemetryService } from '@sunbird/telemetry';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  @ViewChild('captchaRef', {static: false}) captchaRef: RecaptchaComponent;
  @Input() signUpdata: any;
  @Input() isMinor: boolean;
  @Input() tncLatestVersion: any;
  @Input() yearOfBirth: string;
  @Output() redirectToParent = new EventEmitter();
  otpForm: FormGroup;
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
  constructor(public resourceService: ResourceService, public signupService: SignupService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public deviceDetectorService: DeviceDetectorService, public router: Router,
    public utilService: UtilService, public configService: ConfigService) {
  }

  ngOnInit() {
    this.emailAddress = this.signUpdata.value.email;
    this.phoneNumber = this.signUpdata.value.phone;
    this.mode = this.signUpdata.controls.contactType.value;
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required])
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
        'key': this.mode === 'phone' ? this.signUpdata.controls.phone.value.toString() :
          this.signUpdata.controls.email.value,
        'type': this.mode,
        'otp': _.trim(this.otpForm.controls.otp.value)
      }
    };
    this.signupService.verifyOTP(request).subscribe(
      (data: ServerResponse) => {
        this.infoMessage = '';
        this.errorMessage = '';
        this.createUser(data);
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
        'firstName': _.trim(this.signUpdata.controls.name.value),
        'password': _.trim(this.signUpdata.controls.password.value),
        'dob': this.yearOfBirth,
      }
    };
    if (this.mode === 'phone') {
      createRequest.request['phone'] = this.signUpdata.controls.phone.value.toString();
      createRequest.request['phoneVerified'] = true;
      identifier = this.signUpdata.controls.phone.value.toString();
    } else {
      createRequest.request['email'] = this.signUpdata.controls.email.value;
      createRequest.request['emailVerified'] = true;
      identifier = this.signUpdata.controls.email.value;
    }
    createRequest.request['reqData'] = _.get(data, 'reqData');
    if (this.signUpdata.controls.tncAccepted.value && this.signUpdata.controls.tncAccepted.status === 'VALID') {
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
    this.resendOtpCounter = this.resendOtpCounter + 1 ;
    if (this.resendOtpCounter >= this.maxResendTry) {
      this.disableResendButton = false;
      this.infoMessage = '';
      this.errorMessage = this.resourceService.frmelmnts.lbl.OTPresendMaxretry;
      return false;
    }
    const request = {
      'request': {
        'key': this.signUpdata.controls.contactType.value === 'phone' ?
          this.signUpdata.controls.phone.value.toString() : this.signUpdata.controls.email.value,
        'type': this.mode
      }
    };
    if (this.isMinor) {
      request.request['templateId'] = this.configService.constants.TEMPLATES.VERIFY_OTP_MINOR;
    }
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
}
