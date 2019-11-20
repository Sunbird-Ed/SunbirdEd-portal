import { UserService } from '@sunbird/core';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ProfileService } from './../../services';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-account-recovery-info',
  templateUrl: './account-recovery-info.component.html',
  styleUrls: ['./account-recovery-info.component.scss']
})
export class AccountRecoveryInfoComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<any>();
  @ViewChild('accountRecoveryModal') accountRecoveryModal;

  /** to take the mode of operaion (edit or add of recovery id) from profile page */
  @Input() mode: string;
  accountRecoveryForm: FormGroup;
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

  constructor(
    public resourceService: ResourceService,
    public profileService: ProfileService,
    public userService: UserService,
    public toasterService: ToasterService) { }

  ngOnInit() {
    this.contactType = 'emailId';
    this.initializeFormFields();
  }

  /** to initialize form fields */
  initializeFormFields() {
    if (this.contactType === 'emailId') {
      this.accountRecoveryForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      });
    } else if (this.contactType === 'phoneNo') {
      this.accountRecoveryForm = new FormGroup({
        phone: new FormControl('', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      });
    }
    this.handleSubmitButton();
    this.setTelemetryData();
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
    this.accountRecoveryModal.deny();
  }

  /** to initialize form fields each time when radio button will be selected/changed */
  onItemChange() {
    this.duplicateRecoveryId = false;
    this.initializeFormFields();
  }

  closeModal() {
    this.accountRecoveryModal.deny();
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
}
