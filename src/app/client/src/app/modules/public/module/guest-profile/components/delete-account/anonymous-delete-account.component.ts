import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import * as _ from 'lodash-es';
import { OtpService } from '@sunbird/core';
import { ResourceService, ServerResponse, ToasterService, ConfigService, CacheService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-anonymous-delete-account',
  templateUrl: './anonymous-delete-account.component.html',
  styleUrls: ['./anonymous-delete-account.component.scss']
})
export class AnonymousDeleteAccountComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  @Input() contactType: string;
  @Input() userId: string;
  @Input() contactValue: string;
  @Output() close = new EventEmitter<any>();
  @Input() dialogProps;
  @Input() deepLink: string = ''
  contactTypeForm: UntypedFormGroup;
  enableSubmitBtn = false;
  showUniqueError = '';

  otpData: any;
  submitInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  verifiedUser = false;
  templateId: any = 'otpaccontDeleteTemplate';

  constructor(public resourceService: ResourceService,
    public otpService: OtpService, public toasterService: ToasterService,
    private matDialog: MatDialog,
    public configService: ConfigService, private cacheService: CacheService,
    public deviceDetectorService: DeviceDetectorService) { }

  ngOnInit() {
    this.validateAndEditContact();
  }

  private async validateAndEditContact() {
    if (this.contactType) {
      const request: any = {
        key: this.contactType,
        userId: this.userId,
        templateId: this.configService.appConfig.OTPTemplate.userDeleteTemplate,
        type: ''
      };
      if ((this.contactType === 'email') || this.contactType === 'recoveryEmail') {
        request.type = 'email';
      } else if (this.contactType === 'phone' || this.contactType === 'recoveryPhone') {
        request.type = 'phone';
      }
      const otpData = {
        'type': this.contactType,
        'value': this.contactValue,
        'userId': this.userId,
        'instructions': request.type === 'phone' ? this.resourceService.frmelmnts.lbl.phoneOtpDeleteInfo : this.resourceService.frmelmnts.lbl.emailOtpDeleteInfo,
        'retryMessage': this.resourceService.frmelmnts.lbl.unableToDeleteAccount,
        'wrongOtpMessage': request.type === 'phone' ? this.resourceService.frmelmnts.lbl.wrongPhoneOTP :
          this.resourceService.frmelmnts.lbl.wrongEmailOTP
      };
      this.verifiedUser = false;
      this.generateOTP({ request }, otpData);
    }
  }

  closeModal() {
    this.closeMatDialog();
    this.close.emit();
  }

  prepareOtpData(otpData?) {
    this.otpData = otpData || {
      'type': this.contactType.toString(),
      'value': this.contactType === 'phone' ?
        this.contactTypeForm.controls.phone.value.toString() : this.contactTypeForm.controls.email.value,
      'userId': this.userId,
      'instructions': this.contactType === 'phone' ?
        this.resourceService.frmelmnts.instn.t0083 : this.resourceService.frmelmnts.instn.t0084,
      'retryMessage': this.contactType === 'phone' ?
        this.resourceService.frmelmnts.lbl.unableToUpdateMobile : this.resourceService.frmelmnts.lbl.unableToUpdateEmail,
      'wrongOtpMessage': this.contactType === 'phone' ? this.resourceService.frmelmnts.lbl.wrongPhoneOTP :
        this.resourceService.frmelmnts.lbl.wrongEmailOTP
    };
  }

  generateOTP(request?, otpData?) {
    if (!request) {
      request = {
        'request': {
          'key': this.contactType === 'phone' ?
            this.contactTypeForm.controls.phone.value.toString() : this.contactTypeForm.controls.email.value,
          'type': this.contactType.toString()
        }
      };
    }
    this.prepareOtpData(otpData);

    this.otpService.generateAnonymousOTP(request).subscribe(
      (data: ServerResponse) => {
        this.prepareOtpData(otpData);
      },
      (err) => {
        const failedgenerateOTPMessage = (err.error.params.status === 'PHONE_ALREADY_IN_USE') ||
          (err.error.params.status === 'EMAIL_IN_USE') ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0051;
        this.toasterService.error(failedgenerateOTPMessage);
        this.enableSubmitBtn = true;
        if (!this.verifiedUser) {
          this.closeModal();
        }
      }
    );
  }

  verificationSuccess(data) {
    if (this.deviceDetectorService.isMobile() && this.deepLink !== '') {
      const url = this.deepLink + '?userId=' + this.userId;
      window.open(url, '_blank');
    }
  }

  setInteractEventData() {
    const id = 'delete-anonymous-account';
    this.submitInteractEdata = {
      id: id,
      type: 'click',
      pageid: 'delete-anonymous-account'
    };
    this.telemetryInteractObject = {
      id: this.userId,
      type: 'User',
      ver: '1.0'
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.closeMatDialog();
  }

  closeMatDialog() {
    const dialogRef = this.dialogProps && this.dialogProps.id && this.matDialog.getDialogById(this.dialogProps.id);
    dialogRef && dialogRef.close();
  }
}
