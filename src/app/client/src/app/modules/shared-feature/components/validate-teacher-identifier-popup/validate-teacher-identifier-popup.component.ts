import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { UserService } from '@sunbird/core';
import { environment } from '@sunbird/environment';
import { ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-validate-teacher-identifier-popup',
  templateUrl: './validate-teacher-identifier-popup.component.html',
  styleUrls: ['./validate-teacher-identifier-popup.component.scss']
})
export class ValidateTeacherIdentifierPopupComponent implements OnInit {
  @Input() userFeedData: {};
  @Output() close = new EventEmitter<any>();
  @ViewChild('createValidateModal') createValidateModal;
  userDetailsForm: FormGroup;
  formBuilder: FormBuilder;
  processValidation = false;
  enableSubmitButton: boolean;
  showError: boolean;
  extIdVerified: boolean;
  extIdFailed: boolean;
  isOffline = environment.isOffline;
  userId: string;
  channelData: [];
  showStateDropdown: boolean;
  telemetryCdata: Array<{}> = [];
  telemetryInteractObject: IInteractEventObject;
  constructor(
    public userService: UserService,
    public resourceService: ResourceService,
    public toasterService: ToasterService) { }

  ngOnInit() {
    this.userId = this.userService.userid;
    this.processUserFeedData();
    this.initializeFormField();
  }

  initializeFormField() {
    if (this.showStateDropdown) {
      this.userDetailsForm = new FormGroup({
        state: new FormControl('', Validators.required),
        extId: new FormControl('', Validators.required)
      });
    } else {
      this.userDetailsForm = new FormGroup({
        extId: new FormControl('', Validators.required)
      });

    }
    this.handleSubmitButton();
    this.setTelemetryData();
  }

  handleSubmitButton() {
    this.enableSubmitButton = false;
    this.userDetailsForm.valueChanges.subscribe(val => {
      this.enableSubmitButton = (this.userDetailsForm.status === 'VALID');
    });
  }

  verifyExtId(action: string) {
    let request = {};
    if (action === 'accept') {
      const channelValue = _.get(this.userFeedData, 'data.prospectChannels').length > 1 ?
        this.userDetailsForm.get('state').value : _.get(this.userFeedData, 'data.prospectChannels[0]');
      request = {
        request: {
          'userId': this.userId,
          'userExtId': this.userDetailsForm.get('extId').value,
          'channel': channelValue,
          'action': 'accept',
          'feedId': _.get(this.userFeedData, 'id')
        }
      };
    } else {
      request = {
        request: {
          'userId': this.userId,
          'action': 'reject',
          'feedId': _.get(this.userFeedData, 'id')
        }
      };
    }
    this.userService.userMigrate(request).subscribe((data) => {
      if (data && _.get(data, 'responseCode') === 'invalidUserExternalId' && _.get(data, 'result.error') === true &&
        _.get(data, 'result.remainingAttempt') > 0) {
        this.showError = true;
      } else if (_.get(data, 'result.remainingAttempt') === 0) {
        this.extIdFailed = true;
      }

      if (_.get(data, 'responseCode') === 'OK' && _.get(data, 'result.response') === 'SUCCESS') {
        this.extIdVerified = true;
      }

    }, (error) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
      this.closeModal();
    });
  }

  processUserFeedData() {
    this.channelData = _.get(this.userFeedData, 'data.prospectChannels');
    this.showStateDropdown = this.channelData.length > 1 ? true : false;
  }

  closeModal() {
    this.createValidateModal.deny();
    this.close.emit();
  }

  navigateToValidateId() {
    this.processValidation = true;
  }

  setTelemetryData() {
    this.telemetryCdata = [
      {
        id: 'user:state:teacherId',
        type: 'Feature'
      },
      {
        id: 'SC-1349',
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
