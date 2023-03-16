import { IInteractEventObject, IImpressionEventInput } from '@sunbird/telemetry';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { UserService } from '@sunbird/core';
import { ToasterService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupControlService } from '../../../../service/popup-control.service';

@Component({
  selector: 'app-validate-teacher-identifier-popup',
  templateUrl: './validate-teacher-identifier-popup.component.html',
  styleUrls: ['./validate-teacher-identifier-popup.component.scss']
})
export class ValidateTeacherIdentifierPopupComponent implements OnInit, OnDestroy {
  @Input() userFeedData: {};
  @Input() labels: any;
  @Output() close = new EventEmitter<any>();
  @ViewChild('createValidateModal') createValidateModal;
  userDetailsForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  processValidation = false;
  enableSubmitButton: boolean;
  showError: boolean;
  extIdVerified: boolean;
  extIdFailed: boolean;
  userId: string;
  channelData: [];
  showStateDropdown: boolean;
  telemetryCdata: Array<{}> = [];
  telemetryInteractObject: IInteractEventObject;
  telemetryImpressionData: IImpressionEventInput;
  closeInteractEdata: any;
  pageId = 'user-verification-popup';
  constructor(
    public userService: UserService,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public router: Router, public popupControlService: PopupControlService) { }

  ngOnInit() {
    this.popupControlService.changePopupStatus(false);
    this.setTelemetryData();
    this.userId = this.userService.userid;
    this.processUserFeedData();
    this.initializeFormField();
  }

  initializeFormField() {
    this.userDetailsForm = new UntypedFormGroup({
      extId: new UntypedFormControl('', Validators.required)
    });
    if (this.showStateDropdown) {
      this.userDetailsForm.addControl('state', new UntypedFormControl('', Validators.required));
    }
    this.handleSubmitButton();
  }

  handleSubmitButton() {
    this.enableSubmitButton = false;
    this.userDetailsForm.valueChanges.subscribe(val => {
      this.showError = false;
      this.enableSubmitButton = (this.userDetailsForm.status === 'VALID');
    });
  }

  verifyExtId(action: string) {
    const req = {
      request: {
        'userId': this.userId,
        'action': action,
        'feedId': _.get(this.userFeedData, 'id')
      }
    };
    if (action === 'accept') {
      const channelValue = _.get(this.userFeedData, 'data.prospectChannels').length > 1 ?
        this.userDetailsForm.get('state').value : _.get(this.userFeedData, 'data.prospectChannels[0]');
      req.request['channel'] = channelValue;
      req.request['userExtId'] = this.userDetailsForm.get('extId').value;
    }

    this.userService.userMigrate(req).subscribe((data) => {
      if (_.get(data, 'responseCode') === 'OK' && _.get(data, 'result.response') === 'SUCCESS') {
        this.extIdVerified = true;
      }
    }, (error) => {
      if (_.get(error, 'responseCode') === 'invalidUserExternalId' && _.get(error, 'result.remainingAttempt') > 0) {
        this.userDetailsForm.reset();
        this.showError = true;
      } else if (_.get(error, 'error.params.err') === 'USER_MIGRATION_FAILED') {
        this.extIdFailed = true;
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.closeModal();
      }
    });
  }

  processUserFeedData() {
    this.channelData = _.get(this.userFeedData, 'data.prospectChannels');
    this.showStateDropdown = this.channelData.length > 1 ? true : false;
  }

  closeModal() {
    if (this.extIdVerified) {
      this.userService.getUserProfile();
    }
    this.createValidateModal.deny();
    this.close.emit();
    this.popupControlService.changePopupStatus(true);
  }

  navigateToValidateId() {
    this.processValidation = true;
  }

  setTelemetryData() {
    this.closeInteractEdata = {
      id: this.extIdVerified ? 'ext-user-verify-success' : 'ext-user-verify-fail',
      type: 'click',
      pageid: this.pageId

    };
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

    this.telemetryImpressionData = {
      context: {
        env: 'user-verification',
        cdata: this.telemetryCdata
      },
      edata: {
        type: 'view',
        pageid: this.pageId,
        uri: this.router.url
      }
    };
  }

  ngOnDestroy(): void {
    this.popupControlService.changePopupStatus(true);
  }

}
