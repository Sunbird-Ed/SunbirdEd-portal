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
  selectedState: any;
  selectedDistrict: any;
  stateList = [];
  districtList = [];
  @Output() locationSaved = new EventEmitter();
  disableContinueBtn = true;
  telemetryImpressionData: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  continueLabel = _.upperCase(this.resourceService.frmelmnts.lbl.continue);

  constructor(public onboardingService: OnboardingService, public activatedRoute: ActivatedRoute, private router: Router,
    public resourceService: ResourceService, public deviceRegister: DeviceRegisterService, public toasterService: ToasterService) {
  }

  ngOnInit() {
    this.getAllStates();
  }

  onOptionChanges(option) {
    console.log('selected', option);
    if (option.type === 'state') {
      this.selectedDistrict = {};
      this.districtList = [];
      this.getAllDistricts(option.id);
    } else {
      this.disableContinueBtn = false;
    }
  }

  getAllStates() {
    this.onboardingService.searchLocation({ type: 'state' })
    .subscribe(data => {
      this.stateList = _.get(data, 'result.response');
    });
  }

  getAllDistricts(parentId) {
    this.onboardingService.searchLocation({ type: 'district', parentId: parentId })
    .subscribe(data => {
      this.districtList = _.get(data, 'result.response');
    });
  }

  handleSubmitButton() {
    this.disableContinueBtn = true;
    const requestParams = {
      request: {
        state: this.selectedState,
        city: this.selectedDistrict
      }
    };
    this.onboardingService.saveLocation(requestParams).subscribe(() => {
      this.locationSaved.emit('SUCCUSS');
      this.toasterService.success(this.resourceService.messages.smsg.m0057);
    }, error => {
      this.disableContinueBtn = false;
      this.locationSaved.emit('ERROR');
      this.toasterService.error(this.resourceService.messages.emsg.m0021);
    });
  }

}
