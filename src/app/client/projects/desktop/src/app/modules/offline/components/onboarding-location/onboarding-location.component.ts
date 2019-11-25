import { Router } from '@angular/router';
import { DeviceRegisterService, TenantService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnboardingService } from './../../services';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
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
  telemetryInteractEdata: IInteractEventEdata;
  public telemetryImpression: IImpressionEventInput;
  tenantInfo: any = {};

  continueLabel = _.upperCase(this.resourceService.frmelmnts.lbl.continue);

  constructor(public onboardingService: OnboardingService,
    public resourceService: ResourceService, public toasterService: ToasterService, private router: Router,
    public tenantService: TenantService) {
  }

  ngOnInit() {
    this.tenantService.tenantData$.subscribe(({ tenantData }) => {
      this.tenantInfo.logo = tenantData ? tenantData.logo : undefined;
      this.tenantInfo.titleName = (tenantData && tenantData.titleName) ? tenantData.titleName.toUpperCase() : undefined;
      this.getAllStates();
      this.setTelemetryData();
    });
  }

  onOptionChanges(option) {
    this.disableContinueBtn = true;
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
      this.disableContinueBtn = false;
      this.locationSaved.emit('SUCCESS');
      this.toasterService.success(_.get(this.resourceService, 'messages.smsg.m0057') || 'SUCCESS');
    }, error => {
      this.disableContinueBtn = true;
      this.locationSaved.emit('ERROR');
      this.toasterService.error(this.resourceService.messages.emsg.m0021);
    });
  }

  setTelemetryData () {
    this.telemetryImpression = {
      context: { env: 'offline' },
      edata: {
        type: 'view',
        pageid: 'onboarding_location_setting',
        uri: this.router.url
      }
    };

    this.telemetryInteractEdata = {
      id: 'onboarding_location',
      type: 'click',
      pageid: 'onboarding_location_setting'
    };
  }


}
