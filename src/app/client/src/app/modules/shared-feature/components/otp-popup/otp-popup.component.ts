import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ResourceService, ServerResponse, UtilService, ConfigService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
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
  @Input() redirectToLogin: boolean;
  @Input() delete=false
  @Output() redirectToParent = new EventEmitter();
  @Output() verificationSuccess = new EventEmitter();
  @Output() closeContactForm = new EventEmitter();
  public unsubscribe = new Subject<void>();
  otpForm: UntypedFormGroup;
  enableSubmitBtn = false;
  errorMessage: string;
  infoMessage: string;
  disableResendButton = false;
  enableResendButton = false;
  tenantDataSubscription: Subscription;
  resendOTPbtn;
  counter;
  resendOtpCounter = 0;
  maxResendTry = 4;
  logo: string;
  tenantName: string;
  submitInteractEdata: IInteractEventEdata;
  resendOtpInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  cancelInteractEdata: IInteractEventEdata;
  submitUserDeleteInteractEdata:IInteractEventEdata;
  remainingAttempt: 'string';
  constructor(public resourceService: ResourceService, public tenantService: TenantService,
              public deviceDetectorService: DeviceDetectorService, public otpService: OtpService, public userService: UserService,
              public utilService: UtilService, public configService: ConfigService,
              public toasterService: ToasterService,public navigationhelperService: NavigationHelperService) {
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

    this.otpForm = new UntypedFormGroup({
      otp: new UntypedFormControl('', [Validators.required])
    });
    this.resendOtpEnablePostTimer();
    this.enableSubmitButton();
    this.setInteractEventData();
  }

  resendOtpEnablePostTimer() {
    this.counter = 20;
    this.disableResendButton = false;
    this.enableResendButton = false;
    setTimeout(() => {
      this.enableResendButton = true;
    }, 22000);
    const interval = setInterval(() => {
      this.resendOTPbtn = this.delete ? this.resourceService.frmelmnts.lbl.resendOTP + ' in ' + this.counter + ' seconds' : this.resourceService.frmelmnts.lbl.resendOTP + ' (' + this.counter + ')';
      this.counter--;
      if (this.counter < 0) {
        this.resendOTPbtn = this.resourceService.frmelmnts.lbl.resendOTP;
        clearInterval(interval);
      }
    }, 1000);
  }


  verifyOTP() {
    const wrongOTPMessage = this.otpData.type === 'phone' ? this.resourceService.frmelmnts.lbl.wrongPhoneOTP :
      this.resourceService.frmelmnts.lbl.wrongEmailOTP;
    this.enableSubmitBtn = false;
    const request = {
      'request': {
        'key': this.otpData.value,
        'type': this.otpData.type,
        'otp': this.otpForm.controls.otp.value,
        ...(this.otpData.value && this.otpData.value.match(/(([a-z]|[A-Z])+[*]{1,}([a-z]*[A-Z]*[0-9]*)*@)|([*]{1,})+/g) &&
          { 'userId': this.otpData.userId || this.userService.userid })
      }
    };
    this.otpService.verifyOTP(request).subscribe(
      (data: ServerResponse) => {
        this.infoMessage = '';
        this.errorMessage = '';
        let emitData = {};
        if (this.otpData.type === 'phone') {
          emitData = { 'phone': this.otpData.value, 'phoneVerified': true };
        } else if (this.otpData.type === 'email') {
          emitData = { 'email': this.otpData.value, 'emailVerified': true };
        }
        this.verificationSuccess.emit(emitData);
      },
      (err) => {
        if (_.get(err, 'error.result.remainingAttempt') === 0) {
          if (this.redirectToLogin) {
            this.utilService.redirectToLogin(this.resourceService.messages.emsg.m0050);
          } else {
            this.toasterService.error(this.resourceService.messages.emsg.m0050);
            this.closeContactForm.emit('true');
          }
        } else {
          this.otpForm.controls['otp'].setValue('');
          this.enableSubmitBtn = true;
          this.infoMessage = '';
          this.remainingAttempt = _.get(err, 'error.result.remainingAttempt') || 1;
          this.errorMessage =
            _.get(err, 'error.params.status') === this.configService.constants.HTTP_STATUS_CODES.OTP_VERIFICATION_FAILED ?
              _.get(this.resourceService, 'messages.imsg.m0086') : wrongOTPMessage;
        }
      }
    );
  }

  resendOTP() {
    this.disableResendButton = false;
    this.enableResendButton = false;
    this.resendOtpCounter = this.resendOtpCounter + 1;
    if (this.resendOtpCounter >= this.maxResendTry) {
      this.disableResendButton = false;
      this.infoMessage = '';
      this.errorMessage = this.resourceService.frmelmnts.lbl.OTPresendMaxretryreached;
      return false;
    }
    this.otpForm.controls['otp'].setValue('');
    const request = {
      'request': {
        'key': this.otpData.value,
        'type': this.otpData.type,
        ...(this.otpData.value && this.otpData.value.match(/(([a-z]|[A-Z])+[*]{1,}([a-z]*[A-Z]*[0-9]*)*@)|([*]{1,})+/g) &&
          { userId: this.userService.userid, templateId: this.configService.appConfig.OTPTemplate.updateContactTemplate })
      }
    };
    this.otpService.generateOTP(request).subscribe(
      (data: ServerResponse) => {
        this.resendOtpEnablePostTimer();
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
    this.cancelInteractEdata = {
      id: 'cancel-otp-delete-user',
      type: 'click',
      pageid: 'user-delete-otp-popup'
    };
    this.submitUserDeleteInteractEdata = {
      id: 'submit-otp-delete-user',
      type: 'click',
      pageid: 'user-delete-otp-popup'
    };

    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
    };
  }

  onCancel() {
    this.navigationhelperService.navigateToLastUrl();
  }
}
