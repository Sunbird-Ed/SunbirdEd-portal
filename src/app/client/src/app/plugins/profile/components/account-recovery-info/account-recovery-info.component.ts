import { UserService } from '@sunbird/core';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ProfileService } from './../../services';
@Component({
  selector: 'app-account-recovery-info',
  templateUrl: './account-recovery-info.component.html',
  styleUrls: ['./account-recovery-info.component.scss']
})
export class AccountRecoveryInfoComponent implements OnInit {
  @Output() close = new EventEmitter<any>();
  @ViewChild('accountRecoveryModal') accountRecoveryModal;
  @Input() mode: string;
  accountRecoveryForm: FormGroup;
  enableSubmitButton = false;
  contactType: string;
  request: {};
  telemetryInteractObject: IInteractEventObject;
  submitInteractEdata: IInteractEventEdata;

  constructor(
    public resourceService: ResourceService,
    public profileService: ProfileService,
    public userService: UserService) { }
  ngOnInit() {
    this.contactType = 'emailId';
    this.initializeFormFields();
  }

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

  updateRecoveryId() {
    this.enableSubmitButton = false;
    if (this.contactType === 'emailId') {
      this.request = {
        request: {
          'recoveryEmail': this.accountRecoveryForm.get('email').value
        }
      };
    } else if (this.contactType === 'phoneNo') {
      this.request = {
        request: {
          'recoveryPhone': this.accountRecoveryForm.get('phone').value
        }
      };
    }
    this.profileService.updateProfile(this.request).subscribe((data) => {
      this.closeModal();
    }, (error) => {
      this.accountRecoveryForm.reset();
    });


  }

  handleSubmitButton() {
    this.enableSubmitButton = false;
    this.accountRecoveryForm.valueChanges.subscribe(val => {
      this.enableSubmitButton = (this.accountRecoveryForm.status === 'VALID');
    });
  }

  ngOnDestroy() {
    this.accountRecoveryModal.deny();
  }

  onItemChange() {
    this.initializeFormFields();
  }

  closeModal() {
    this.accountRecoveryModal.deny();
    this.close.emit();
  }

  setTelemetryData() {
    const id = this.contactType === 'phoneNo' ?
      'submit-phone-recovery' : 'submit-emailId-recovery';
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
}
