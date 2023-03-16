import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { UserService, OtpService } from '@sunbird/core';
import { ResourceService, ServerResponse, ToasterService, ConfigService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { ProfileService } from './../../services';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-update-contact-details',
  templateUrl: './update-contact-details.component.html',
  styleUrls: ['./update-contact-details.component.scss']
})
export class UpdateContactDetailsComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  @Input() contactType: string;
  @Input() userProfile: any;
  @Output() close = new EventEmitter<any>();
  @Input() dialogProps;
  contactTypeForm: UntypedFormGroup;
  enableSubmitBtn = false;
  showUniqueError = '';
  showForm = false;
  // @ViewChild('contactTypeModal', {static: true}) contactTypeModal;
  otpData: any;
  submitInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  verifiedUser = false;
  templateId: any = 'otpContactUpdateTemplate';

  constructor(public resourceService: ResourceService, public userService: UserService,
    public otpService: OtpService, public toasterService: ToasterService,
    public profileService: ProfileService, private matDialog: MatDialog,
    public configService: ConfigService) { }

  ngOnInit() {
    this.validateAndEditContact();
  }

  initializeFormFields() {
    if (this.contactType === 'phone') {
      this.contactTypeForm = new UntypedFormGroup({
        phone: new UntypedFormControl('', [Validators.required , Validators.pattern(/^[6-9]\d{9}$/)]),
        uniqueContact: new UntypedFormControl(null, [Validators.required])
      });
      this.onContactValueChange();
    } else if (this.contactType === 'email') {
      this.contactTypeForm = new UntypedFormGroup({
        email: new UntypedFormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
        uniqueContact: new UntypedFormControl(null, [Validators.required])
      });
      this.onContactValueChange();
    }
    this.enableSubmitButton();
    this.setInteractEventData();
  }

  private async validateAndEditContact() {
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
      const otpData = {
          'type': request.type,
          'value': request.key,
          'instructions': this.resourceService.frmelmnts.lbl.otpcontactinfo,
          'retryMessage': request.type === 'phone' ?
            this.resourceService.frmelmnts.lbl.unableToUpdateMobile : this.resourceService.frmelmnts.lbl.unableToUpdateEmail,
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

  enableSubmitButton() {
    this.contactTypeForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.contactTypeForm.status === 'VALID');
    });
  }

  showParentForm(event) {
    if (event === 'true') {
      this.initializeFormFields();
      this.showForm = true;
    }
  }

  prepareOtpData(otpData?) {
    this.otpData = otpData || {
      'type': this.contactType.toString(),
      'value': this.contactType === 'phone' ?
        this.contactTypeForm.controls.phone.value.toString() : this.contactTypeForm.controls.email.value,
      'instructions': this.contactType === 'phone' ?
        this.resourceService.frmelmnts.instn.t0083 : this.resourceService.frmelmnts.instn.t0084,
      'retryMessage': this.contactType === 'phone' ?
        this.resourceService.frmelmnts.lbl.unableToUpdateMobile : this.resourceService.frmelmnts.lbl.unableToUpdateEmail,
      'wrongOtpMessage': this.contactType === 'phone' ? this.resourceService.frmelmnts.lbl.wrongPhoneOTP :
        this.resourceService.frmelmnts.lbl.wrongEmailOTP
    };
  }

  vaidateUserContact() {
    const value = this.contactType === 'phone' ?
      this.contactTypeForm.controls.phone.value.toString() : this.contactTypeForm.controls.email.value;
    const uri = this.contactType + '/' + value;
    this.userService.getIsUserExistsUserByKey(uri).subscribe(
      (data: ServerResponse) => {
        if (this.userService.userid === data.result.response.id) {
          this.showUniqueError = this.contactType === 'phone' ?
            this.resourceService.frmelmnts.lbl.samePhoneNo : this.resourceService.frmelmnts.lbl.sameEmailId;
        } else {
          this.showUniqueError = this.contactType === 'phone' ?
            this.resourceService.frmelmnts.lbl.uniqueMobile : this.resourceService.frmelmnts.lbl.uniqueEmailId;
        }
      },
      (err) => {
        if (_.get(err, 'error.params.status') && err.error.params.status === 'USER_ACCOUNT_BLOCKED') {
          this.showUniqueError = this.resourceService.frmelmnts.lbl.blockedUserError;
        } else {
          this.contactTypeForm.controls['uniqueContact'].setValue(true);
          this.showUniqueError = '';
        }
      }
    );
  }

  onContactValueChange() {
    const contactTypeControl = this.contactType === 'phone' ?
      this.contactTypeForm.get('phone') : this.contactTypeForm.get('email');
    let contactValue = '';
    contactTypeControl.valueChanges.subscribe(
      (data: string) => {
        if (contactTypeControl.status === 'VALID' && contactValue !== contactTypeControl.value) {
          this.contactTypeForm.controls['uniqueContact'].setValue('');
          this.vaidateUserContact();
          contactValue = contactTypeControl.value;
        }
      });
  }

  onSubmitForm() {
    this.enableSubmitBtn = false;
    if (this.contactTypeForm.valid) {
      this.generateOTP();
    }
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

    this.otpService.generateOTP(request).subscribe(
      (data: ServerResponse) => {
        this.prepareOtpData(otpData);
        this.showForm = false;
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

  updateProfile(data) {
    if (this.verifiedUser) {
        this.profileService.updateProfile(data).subscribe(res => {
          this.closeModal();
          const sMessage = this.contactType === 'phone' ?
            this.resourceService.messages.smsg.m0047 : this.resourceService.messages.smsg.m0048;
          this.toasterService.success(sMessage);
        }, err => {
          this.closeModal();
          const fMessage = this.contactType === 'phone' ?
            this.resourceService.messages.emsg.m0014 : this.resourceService.messages.emsg.m0015;
          this.toasterService.error(fMessage);
        });
    } else {
        this.initializeFormFields();
        this.verifiedUser = true;
        this.showForm = true;
    }
  }

  setInteractEventData() {
    const id = this.contactType === 'phone' ?
    'submit-mobile' : 'submit-emailId';
    this.submitInteractEdata = {
      id: id,
      type: 'click',
      pageid: 'profile-read'
    };

    this.telemetryInteractObject = {
      id: this.userService.userid,
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
