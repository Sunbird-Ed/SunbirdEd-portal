import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ResourceService, ServerResponse } from '@sunbird/shared';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription, Subject } from 'rxjs';
import { TenantService, OtpService, UserService } from '@sunbird/core';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-otp-popup',
  templateUrl: './otp-popup.component.html',
  styleUrls: ['./otp-popup.component.scss']
})
export class OtpPopupComponent implements OnInit, OnDestroy {

  @Input() otpData: any;
  @Output() redirectToParent = new EventEmitter();
  @Output() verificationSuccess = new EventEmitter();
  public unsubscribe = new Subject<void>();
  otpForm: FormGroup;
  enableSubmitBtn = false;
  errorMessage: string;
  infoMessage: string;
  disableResendButton = false;
  tenantDataSubscription: Subscription;
  logo: string;
  tenantName: string;
  submitInteractEdata: IInteractEventEdata;
  resendOtpInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  constructor(public resourceService: ResourceService, public tenantService: TenantService,
    public deviceDetectorService: DeviceDetectorService, public otpService: OtpService , public userService: UserService) { }

  ngOnInit() {
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          this.logo = data.tenantData.logo;
          this.tenantName = data.tenantData.titleName;
        }
      }
    );

    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required])
    });
    this.enableSubmitButton();
    this.setInteractEventData();
  }

  verifyOTP() {
    const wrongOTPMessage = this.otpData.wrongOtpMessage;
    this.enableSubmitBtn = false;
    const request = {
      'request': {
        'key': this.otpData.value,
        'type': this.otpData.type,
        'otp': this.otpForm.controls.otp.value
      }
    };
    this.otpService.verifyOTP(request).subscribe(
      (data: ServerResponse) => {
        this.infoMessage = '';
        this.errorMessage = '';
        let emitData = {};
        if (this.otpData.type === 'phone') {
          emitData = {'phone': this.otpData.value, 'phoneVerified': true};
        } else if (this.otpData.type === 'email') {
          emitData = {'email': this.otpData.value, 'emailVerified': true};
        }
        this.verificationSuccess.emit(emitData);
      },
      (err) => {
        this.otpForm.controls['otp'].setValue('');
        this.enableSubmitBtn = true;
        this.infoMessage = '';
        this.errorMessage = _.get(err, 'error.params.status') === 'ERROR_INVALID_OTP' ?
          wrongOTPMessage : this.resourceService.messages.fmsg.m0051;
      }
    );
  }

  resendOTP() {
    this.otpForm.controls['otp'].setValue('');
    const request = {
      'request': {
        'key': this.otpData.value,
        'type': this.otpData.type
      }
    };
    this.otpService.generateOTP(request).subscribe(
      (data: ServerResponse) => {
        this.errorMessage = '';
        this.infoMessage = this.resourceService.frmelmnts.lbl.resentOTP;
      },
      (err) => {
        this.infoMessage = '';
        this.errorMessage = this.resourceService.messages.fmsg.m0051;
      }
    );
  }

  enableSubmitButton() {
    this.otpForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.otpForm.status === 'VALID');
    });
  }

  redirectToParentComponent() {
    this.redirectToParent.emit('true');
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
      id: 'submit-otp',
      type: 'click',
      pageid: 'profile-read'
    };

    this.resendOtpInteractEdata = {
      id: 'resend-otp',
      type: 'click',
      pageid: 'profile-read'
    };

    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
    };
  }
}
