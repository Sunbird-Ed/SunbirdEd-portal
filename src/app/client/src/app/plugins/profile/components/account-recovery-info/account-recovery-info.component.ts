import { UserService, OtpService } from '@sunbird/core';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService, ServerResponse, ConfigService } from '@sunbird/shared';
import { ProfileService } from './../../services';
import * as _ from 'lodash-es';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-account-recovery-info',
  templateUrl: './account-recovery-info.component.html',
  styleUrls: ['./account-recovery-info.component.scss']
})
export class AccountRecoveryInfoComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<any>();
  @Input() dialogProps;

  /** to take the mode of operaion (edit or add of recovery id) from profile page */
  @Input() mode: string;
  @Input() userProfile: any;
  accountRecoveryForm: UntypedFormGroup;
  enableSubmitButton = false;

  /** to store the type of contact (email or phone) */
  contactType: string;

  /** to store the request */
  request: {};

  /** telemetry */
  telemetryInteractObject: IInteractEventObject;
  submitInteractEdata: IInteractEventEdata;
  telemetryCdata: Array<{}> = [];
  duplicateRecoveryId: boolean;
  showOTPForm: boolean;
  otpData: any;

  constructor(
    public resourceService: ResourceService,
    public profileService: ProfileService,
    public userService: UserService,
    private matDialog: MatDialog,
    public toasterService: ToasterService,
    public otpService: OtpService,
    private configService: ConfigService) { }

  ngOnInit() {
    this.contactType = 'emailId';
    this.validateAndEditContact();
  }

  /** to initialize form fields */
  initializeFormFields() {
    if (this.contactType === 'emailId') {
      this.accountRecoveryForm = new UntypedFormGroup({
        email: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      });
    } else if (this.contactType === 'phoneNo') {
      this.accountRecoveryForm = new UntypedFormGroup({
        phone: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      });
    }
    this.handleSubmitButton();
    this.setTelemetryData();
  }

  validateAndEditContact() {
    if (this.userProfile) {
        const request: any = {
            key: this.userProfile.email || this.userProfile.phone || this.userProfile.recoveryEmail,
            userId: this.userProfile.userId,
            templateId: this.configService.appConfig.OTPTemplate.updateContactTemplate,
            type: ''
        };
        if ((this.userProfile.email && !this.userProfile.phone) ||
        (!this.userProfile.email && !this.userProfile.phone && this.userProfile.recoveryEmail)) {
            request.type = 'email';
        } else if (this.userProfile.phone || this.userProfile.recoveryPhone) {
            request.type = 'phone';
        }
        this.otpData = {
            'type': request.type,
            'value': request.key,
            'instructions': this.resourceService.frmelmnts.lbl.otpcontactinfo,
            'retryMessage': request.type === 'phone' ?
              this.resourceService.frmelmnts.lbl.unableToUpdateMobile : this.resourceService.frmelmnts.lbl.unableToUpdateEmail,
            'wrongOtpMessage': request.type === 'phone' ? this.resourceService.frmelmnts.lbl.wrongPhoneOTP :
              this.resourceService.frmelmnts.lbl.wrongEmailOTP
        };
        this.showOTPForm = true;
        this.generateOTP({ request });
    }
  }

  generateOTP(request) {
    console.log('Request', request);
    this.otpService.generateOTP(request).subscribe(
      (data: ServerResponse) => {
      },
      (err) => {
        const failedgenerateOTPMessage = (err.error.params.status === 'PHONE_ALREADY_IN_USE') ||
          (err.error.params.status === 'EMAIL_IN_USE') ? err.error.params.errmsg : this.resourceService.messages.fmsg.m0051;
        this.toasterService.error(failedgenerateOTPMessage);
        this.closeModal();
      }
    );
  }

  userVerificationSuccess() {
    this.initializeFormFields();
    this.showOTPForm = false;
  }

  /** to add/update the recovery id */
  updateRecoveryId() {
    this.enableSubmitButton = false;
    if (this.contactType === 'emailId') {
      this.request = {
        'recoveryEmail': this.accountRecoveryForm.get('email').value,
        'recoveryPhone': ''
      };
    } else if (this.contactType === 'phoneNo') {
      this.request = {
        'recoveryPhone': this.accountRecoveryForm.get('phone').value,
        'recoveryEmail': ''
      };
    }
    this.profileService.updateProfile(this.request).subscribe((data) => {
      this.closeModal();
    }, (error) => {
      if (_.get(error, 'error.params.err') === 'RECOVERY_PARAM_MATCH_EXCEPTION') {
        this.duplicateRecoveryId = true;
        this.accountRecoveryForm.reset();
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        this.closeModal();
      }
    });
  }

  /** to handle enable/disable functionality of submit button */
  handleSubmitButton() {
    this.enableSubmitButton = false;
    this.accountRecoveryForm.valueChanges.subscribe(val => {
      this.enableSubmitButton = (this.accountRecoveryForm.status === 'VALID');
    });
  }

  ngOnDestroy() {
    this.closeMatDialog();
  }

  /** to initialize form fields each time when radio button will be selected/changed */
  onItemChange() {
    this.duplicateRecoveryId = false;
    this.initializeFormFields();
  }

  closeModal() {
    this.closeMatDialog();
    this.close.emit();
  }

  /** To prepare telemetry data */
  setTelemetryData() {
    const id = this.contactType === 'phoneNo' ?
      'submit-phone-recovery' : 'submit-emailId-recovery';
    this.submitInteractEdata = {
      id: id,
      type: 'click',
      pageid: 'profile-read'
    };

    this.telemetryCdata = [
      {
        id: 'user:account:recovery',
        type: 'Feature'
      },
      {
        id: 'SC-1288',
        type: 'Task'
      }
    ];

    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
    };
  }
  closeMatDialog() {
    const dialogRef = this.dialogProps && this.dialogProps.id && this.matDialog.getDialogById(this.dialogProps.id);
    dialogRef && dialogRef.close();
  }
}
