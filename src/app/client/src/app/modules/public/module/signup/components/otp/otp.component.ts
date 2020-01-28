import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SignupService } from './../../services';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import {
  IStartEventInput, IEndEventInput, IInteractEventInput,
  IInteractEventObject, IInteractEventEdata
} from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryService } from '@sunbird/telemetry';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  @Input() signUpdata: any;
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
  constructor(public resourceService: ResourceService, public signupService: SignupService,
    public activatedRoute: ActivatedRoute, public telemetryService: TelemetryService,
    public deviceDetectorService: DeviceDetectorService) { }

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
        'otp': this.otpForm.controls.otp.value
      }
    };
    this.signupService.verifyOTP(request).subscribe(
      (data: ServerResponse) => {
        this.infoMessage = '';
        this.errorMessage = '';
        this.createUser();
      },
      (err) => {
        this.logVerifyOtpError(err.error.params.errmsg);
        this.telemetryService.interact(this.generateVerifyOtpErrorInteractEdata);
        this.infoMessage = '';
        this.errorMessage = err.error.params.status === 'ERROR_INVALID_OTP' ?
          wrongOTPMessage : this.resourceService.messages.fmsg.m0085;
        if (this.disableResendButton) {
          this.showSignUpLink = true;
          this.telemetryService.end(this.telemetryEnd);
        }
        this.disableSubmitBtn = false;
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
        id: 'submit-otp',
        type: 'click',
        pageid: 'otp',
        extra: {
          'isError': 'true'
        }
      }
    };
  }

  createUser() {
    const createRequest = {
      params: {
        source: _.get(this.activatedRoute, 'snapshot.queryParams.client_id'),
        signupType: 'self'
      },
      'request': {
        'firstName': _.trim(this.signUpdata.controls.name.value),
        'password': _.trim(this.signUpdata.controls.password.value),
      }
    };
    if (this.mode === 'phone') {
      createRequest.request['phone'] = this.signUpdata.controls.phone.value.toString();
      createRequest.request['phoneVerified'] = true;
    } else {
      createRequest.request['email'] = this.signUpdata.controls.email.value;
      createRequest.request['emailVerified'] = true;
    }
    this.signupService.createUserV3(createRequest).subscribe(
      (resp: ServerResponse) => {
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
      },
      (err) => {
        this.infoMessage = '';
        this.errorMessage = this.resourceService.messages.fmsg.m0085;
        this.disableSubmitBtn = false;
        this.logCreateUserError(err.error.params.errmsg);
        this.telemetryService.interact(this.createUserErrorInteractEdata);
      }
    );
  }

  logCreateUserError(error) {
    this.createUserErrorInteractEdata = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        id: 'create-user',
        type: 'click',
        pageid: 'otp',
        extra: {
          'isError': 'true'
        }
      }
    };
  }

  resendOTP() {
    const request = {
      'request': {
        'key': this.signUpdata.controls.contactType.value === 'phone' ?
          this.signUpdata.controls.phone.value.toString() : this.signUpdata.controls.email.value,
        'type': this.mode
      }
    };
    this.signupService.generateOTP(request).subscribe(
      (data: ServerResponse) => {
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

  logGenerateOtpError(error) {
    this.generateOTPErrorInteractEdata = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryCdata,
      },
      edata: {
        id: 'resend-otp',
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
}
