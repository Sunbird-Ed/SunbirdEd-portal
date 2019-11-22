import { DeviceRegisterService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnboardingService } from './../../services';
import { IImpressionEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-onboarding-location',
  templateUrl: './onboarding-location.component.html',
  styleUrls: ['./onboarding-location.component.scss']
})
export class OnboardingLocationComponent implements OnInit {
  @Input() selectState;
  @Input() selectDistrict;
  allStates = [];
  allDistricts = [];
  @Output() selectedLocation = new EventEmitter();
  disableContinueBtn = true;
  telemetryImpressionData: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  continueLabel = _.upperCase(this.resourceService.frmelmnts.lbl.continue);
  @Input() userLocationData;
  @Input() deviceId;
  @Output() locationSaved = new EventEmitter();

  constructor(public onboardingService: OnboardingService, public activatedRoute: ActivatedRoute, private router: Router,
    public resourceService: ResourceService, public deviceRegister: DeviceRegisterService, public toasterService: ToasterService) {
  }

  ngOnInit() {
    this.getAllStates();
  }

  onOptionChanges(option) {
    this.disableContinueBtn = !this.disableContinueBtn;
    this.selectedLocation.emit({enable: this.disableContinueBtn});
    if (option.type === 'state') {
      this.getAllDistricts(option.id);
    }
    this.enableContinueButton();
  }

  getAllStates() {
    const requestData = { request: { filters: { type: 'state' } } };
    this.onboardingService.getUserLocation(requestData).subscribe(data => {
      this.allStates = _.get(data, 'result.response');
    });
  }

  getAllDistricts(parentId) {
    const requestData = { request: { filters: { type: 'district', parentId: parentId } } };
    this.onboardingService.getUserLocation(requestData).subscribe(data => {
      this.allDistricts = _.get(data, 'result.response');
    });
  }

  enableContinueButton() {
    setTimeout(() => {
      this.disableContinueBtn = this.allDistricts.length <= 0 ? false : _.isEmpty(this.selectDistrict);
      const locationData = {
        type: 'location',
        data: {
          state: this.selectState,
          city: this.selectDistrict || {}
        },
        enable: this.disableContinueBtn
      };
      if (!this.disableContinueBtn) {
        this.selectedLocation.emit(locationData);
      }
    }, 500);
  }

  saveLocation(request) {
    const requestParams = {request: request};
      this.onboardingService.saveUserLocation(requestParams).subscribe(() => {
      this.disableContinueBtn = false;
      this.locationSaved.emit(this.disableContinueBtn);
      this.toasterService.success(this.resourceService.messages.smsg.m0057);
      }, error => {
      this.disableContinueBtn = true;
      this.locationSaved.emit(this.disableContinueBtn);
      this.toasterService.error(this.resourceService.messages.emsg.m0021);

      });
  }

}
