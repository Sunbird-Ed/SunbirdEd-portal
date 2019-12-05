import { ConnectionService } from './../../services';
import { mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DeviceRegisterService, TenantService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  currentLocation;
  isConnected = navigator.onLine;

  continueLabel = _.upperCase(this.resourceService.frmelmnts.lbl.continue);

  constructor(public onboardingService: OnboardingService,
    public resourceService: ResourceService, public toasterService: ToasterService, private router: Router,
    public tenantService: TenantService, public deviceRegisterService: DeviceRegisterService,
    private connectionService: ConnectionService) {
  }

  ngOnInit() {
    this.tenantService.tenantData$.subscribe(({ tenantData }) => {
      this.checkConnection();
      this.tenantInfo.logo = tenantData ? tenantData.logo : undefined;
      this.tenantInfo.titleName = (tenantData && tenantData.titleName) ? tenantData.titleName.toUpperCase() : undefined;
      this.getAllStates();
      this.setTelemetryData();
      this.isLocationSaved();
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
       if (this.isConnected) {
        this.getUserCurrentLocation();
       }
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
    }, error => {
      this.disableContinueBtn = false;
      this.locationSaved.emit('ERROR');
      this.toasterService.error(this.resourceService.messages.emsg.m0021);
    });
  }

  setTelemetryData () {
    this.telemetryImpression = {
      context: { env: 'offline' },
      edata: {
        type: 'view',
        pageid: 'onboarding_location',
        uri: this.router.url
      }
    };

    this.telemetryInteractEdata = {
      id: 'onboarding_location',
      type: 'click',
      pageid: 'onboarding_location'
    };
  }
  getUserCurrentLocation() {
     this.deviceRegisterService.fetchDeviceProfile().pipe(mergeMap((deviceProfile) => {
      this.currentLocation = _.get(deviceProfile, 'result.ipLocation');
      this.selectedState = _.find(this.stateList, {name: this.currentLocation.state});
      if (!_.isEmpty(this.selectedState)) {
        return this.onboardingService.searchLocation({ type: 'district', parentId: this.selectedState.id });
      } else {return []; }
     })).subscribe(location => {
      this.districtList = _.get(location, 'result.response');
      this.selectedDistrict = _.find(this.districtList, {name: this.currentLocation.district});
      this.disableContinueBtn = _.isEmpty(this.selectedDistrict);
    });
  }

  checkConnection() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }
  isLocationSaved() {
    this.onboardingService.getLocation().subscribe(data => {
      this.locationSaved.emit('SUCCESS');
    }, err => {
      this.locationSaved.emit('ERROR');
    });
  }

}
