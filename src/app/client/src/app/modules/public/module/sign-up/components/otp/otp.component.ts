import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SignUpService } from './../../services';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

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

  constructor(public resourceService: ResourceService, public signUpService: SignUpService,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.mode = this.signUpdata.controls.contactType.value;
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required])
    });
    this.enableSignUpSubmitButton();
    this.unabletoVerifyErrorMessage = this.mode === 'phone' ? this.resourceService.frmelmnts.lbl.unableToVerifyPhone :
      this.resourceService.frmelmnts.lbl.unableToVerifyEmail;
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
    this.signUpService.verifyOTP(request).subscribe(
      (data: ServerResponse) => {
        this.infoMessage = '';
        this.errorMessage = '';
        this.createUser();
      },
      (err) => {
        this.infoMessage = '';
        this.errorMessage = err.error.params.status === 'ERROR_INVALID_OTP' ?
          wrongOTPMessage : this.resourceService.messages.fmsg.m0085;
          if (this.disableResendButton) {
            this.showSignUpLink = true;
          }
        this.disableSubmitBtn = false;
      }
    );
  }

  createUser() {
    const createRequest = {
      'request': {
        'firstName': this.signUpdata.controls.name.value,
        'password': this.signUpdata.controls.password.value,
      }
    };
    if (this.mode === 'phone') {
      createRequest.request['phone'] = this.signUpdata.controls.phone.value.toString();
      createRequest.request['phoneVerified'] = true;
    } else {
      createRequest.request['email'] = this.signUpdata.controls.email.value;
      createRequest.request['emailVerified'] = true;
    }

    this.signUpService.createUser(createRequest).subscribe(
      (resp: ServerResponse) => {
        const reqQuery = this.activatedRoute.snapshot.queryParams;
        const queryObj = _.pick(reqQuery,
          ['client_id', 'redirect_uri', 'scope', 'state', 'response_type']);
        queryObj['success_message'] = this.mode === 'phone' ? this.resourceService.frmelmnts.lbl.createUserSuccessWithPhone :
          this.resourceService.frmelmnts.lbl.createUserSuccessWithEmail;
        const query = Object.keys(queryObj).map(key => key + '=' + queryObj[key]).join('&');
        const redirect_uri = reqQuery.error_callback + '?' + query;
        window.location.href = redirect_uri;
      },
      (err) => {
        this.infoMessage = '';
        this.errorMessage = this.resourceService.messages.fmsg.m0085;
        this.disableSubmitBtn = false;
      }
    );
  }

  resendOTP() {
    const request = {
      'request': {
        'key': this.signUpdata.controls.contactType.value === 'phone' ?
          this.signUpdata.controls.phone.value.toString() : this.signUpdata.controls.email.value,
        'type': this.mode
      }
    };
    this.signUpService.generateOTP(request).subscribe(
      (data: ServerResponse) => {
        this.errorMessage = '';
        this.infoMessage = this.resourceService.frmelmnts.lbl.resentOTP;
      },
      (err: ServerResponse) => {
        this.infoMessage = '';
        this.errorMessage = this.resourceService.messages.fmsg.m0085;
      }
    );
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
}
