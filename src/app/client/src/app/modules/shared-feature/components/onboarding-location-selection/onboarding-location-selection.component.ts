import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeviceRegisterService, UserService } from '@sunbird/core';
import { Router } from '@angular/router';
import { ProfileService } from '@sunbird/profile';
import * as _ from 'lodash-es';
import { IImpressionEventInput, IInteractEventInput, TelemetryService } from '@sunbird/telemetry';
import { map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { PopupControlService } from '../../../../service/popup-control.service';
import { IDeviceProfile } from '../../interfaces';
import { ITenantData } from './../../../core/services/tenant/interfaces/tenant';

@Component({
  selector: 'app-onboarding-location-selection',
  templateUrl: './onboarding-location-selection.component.html',
  styleUrls: ['./onboarding-location-selection.component.scss']
})
export class OnboardingLocationSelectionComponent implements OnInit {

  @Input() deviceProfile: IDeviceProfile;
  @Input() isCustodianOrgUser: boolean;
  @Input() tenantInfo: ITenantData;
  @Output() close = new EventEmitter<void>();

  userDetailsForm: FormGroup;
  processedDeviceLocation: any = {};
  selectedState;
  selectedDistrict;
  allStates: any;
  allDistricts: any;
  showDistrictDivLoader = false;
  sbFormBuilder: FormBuilder;
  enableSubmitBtn = false;
  isDeviceProfileUpdateAllowed = false;
  isUserProfileUpdateAllowed = false;

  telemetryImpression: IImpressionEventInput;
  suggestionType: any;
  private suggestedLocation;

  constructor(
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public formBuilder: FormBuilder,
    public profileService: ProfileService,
    public router: Router,
    public userService: UserService,
    public deviceRegisterService: DeviceRegisterService,
    public navigationHelperService: NavigationHelperService,
    private telemetryService: TelemetryService,
    public popupControlService: PopupControlService
  ) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.popupControlService.changePopupStatus(false);
    this.initializeFormFields();
    this.getState();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: 'user-location',
          cdata: [{ id: 'user:state:districtConfirmation', type: 'Feature' },
          { id: 'SH-40', type: 'Task' }
          ]
        },
        edata: {
          type: 'view',
          pageid: 'location-popup',
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  initializeFormFields() {
    this.userDetailsForm = this.sbFormBuilder.group({
      state: new FormControl(null, [Validators.required]),
      district: new FormControl(null, [Validators.required])
    });
    this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    this.enableSubmitButton();
  }

  enableSubmitButton() {
    this.userDetailsForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    });
  }

  processStateLocation(state) {
    let locationExist: any = {};
    /* istanbul ignore else */
    if (state) {
      locationExist = _.find(this.allStates, (locations) => {
        return locations.name.toLowerCase() === state.toLowerCase() && locations.type === 'state';
      });
    } else {
      locationExist = this.allStates.length > 0 ? this.allStates[0] : {};
    }
    return locationExist;
  }

  processDistrictLocation(district, stateData) {
    const requestData = { 'filters': { 'type': 'district', parentId: stateData && stateData.id || '' } };
    return this.profileService.getUserLocation(requestData).pipe(map((res: any) => {
      this.allDistricts = res.result.response;
      let locationExist: any = {};
      /* istanbul ignore else */
      if (district) {
        locationExist = _.find(this.allDistricts, (locations) => {
          return locations.name.toLowerCase() === district.toLowerCase() && locations.type === 'district';
        });
      }
      return locationExist;
    }, err => {
      this.closeModal();
      this.toasterService.error(this.resourceService.messages.emsg.m0017);
    }));
  }

  setState(state) {
    let locationExist: any;
    /* istanbul ignore else */
    if (state) {
      locationExist = _.find(this.allStates, (locations) => {
        return locations.code === state.code && locations.type === 'state';
      });
    }
    this.selectedState = locationExist;
    locationExist ? this.userDetailsForm.controls['state'].setValue(locationExist.code) :
      this.userDetailsForm.controls['state'].setValue(null);
  }

  setDistrict(district) {
    let locationExist: any;
    /* istanbul ignore else */
    if (district) {
      locationExist = _.find(this.allDistricts, (locations) => {
        return locations.code === district.code && locations.type === 'district';
      });
    }
    this.selectedDistrict = locationExist;
    locationExist ? this.userDetailsForm.controls['district'].setValue(locationExist.code) :
      this.userDetailsForm.controls['district'].setValue(null);
  }

  getSelectionStrategy() {
    if (this.userService.loggedIn) {
      const userProfileData = this.userService.userProfile;
      const isUserLocationConfirmed = userProfileData && userProfileData.userLocations &&
        Array.isArray(userProfileData.userLocations) && userProfileData.userLocations.length >= 1;

      /* istanbul ignore else */
      if (!isUserLocationConfirmed && this.deviceProfile.userDeclaredLocation) {
        // render using userDeclaredLocation
        // update user profile only
        this.suggestionType = 'userDeclared';
        this.setSelectedLocation(this.deviceProfile.userDeclaredLocation, true, false);
      }
      /* istanbul ignore else */
      if (!(this.deviceProfile && this.deviceProfile.userDeclaredLocation)) {
        if (isUserLocationConfirmed) {
          const userLocation = {
            district: _.find(userProfileData.userLocations, (location) => {
              return location.type === 'district';
            }),
            state: _.find(userProfileData.userLocations, (location) => {
              return location.type === 'state';
            })
          };
          this.isUserProfileUpdateAllowed = false;
          this.isDeviceProfileUpdateAllowed = true;
          this.setData(userLocation);
          // render using user location
          // update only device profile
          this.suggestionType = 'userLocation';
        } else if (!isUserLocationConfirmed) {
          this.setSelectedLocation(this.deviceProfile.ipLocation, true, true);
          // render using ip
          // update device location and user location
          this.suggestionType = 'ipLocation';
        }
      }
    } else {
      if (!(this.deviceProfile && this.deviceProfile.userDeclaredLocation)) {
        this.setSelectedLocation(this.deviceProfile.ipLocation, false, true);
        // render using ip
        // update device profile only
        this.suggestionType = 'ipLocation';
      }
    }
  }

  setSelectedLocation(location, updateUserProFile, updateDeviceProfile) {
    location = location ? location : { 'state': '', 'district': '' };
    const mappedStateDetails = this.processStateLocation(location.state);
    this.getLocationCodes(location).subscribe((mappedDistrictDetails) => {
      this.processedDeviceLocation = {
        district: mappedDistrictDetails,
        state: mappedStateDetails
      };
      this.setStateDistrict(this.processedDeviceLocation);
      this.isUserProfileUpdateAllowed = updateUserProFile;
      this.isDeviceProfileUpdateAllowed = updateDeviceProfile;
    });
  }

  setData(location) {
    this.getDistrict(location.state.id).subscribe((districts) => {
      this.setStateDistrict(location);
    });
  }

  setStateDistrict(location) {
    /* istanbul ignore else */
    if (location) {
      this.suggestedLocation = location;
      /* istanbul ignore else */
      if (location.state) {
        this.setState(location.state);
      }
      /* istanbul ignore else */
      if (location.district) {
        this.setDistrict(location.district);
      }
    }
    this.onStateChange();
  }

  getLocationCodes(locationToProcess) {
    const mappedStateDetails = this.processStateLocation(locationToProcess.state);
    return this.processDistrictLocation(locationToProcess.district, mappedStateDetails);
  }

  getState() {
    const requestData = { 'filters': { 'type': 'state' } };
    this.profileService.getUserLocation(requestData).subscribe((res) => {
      this.allStates = res.result.response;
      this.getSelectionStrategy();
    }, err => {
      this.closeModal();
      this.toasterService.error(this.resourceService.messages.emsg.m0016);
    });
  }

  onStateChange() {
    const stateControl = this.userDetailsForm.get('state');
    let stateValue = '';
    stateControl.valueChanges.subscribe(
      (data: string) => {
        /* istanbul ignore else */
        if (stateControl.status === 'VALID' && stateValue !== stateControl.value) {
          this.allDistricts = null;
          this.userDetailsForm.controls['district'].setValue(null);
          const state = _.find(this.allStates, (states) => {
            return states.code === stateControl.value;
          });
          this.showDistrictDivLoader = true;
          this.getDistrict(state.id).subscribe((districts) => {
            stateValue = stateControl.value;
          });
        }
      });
  }

  getDistrict(stateId) {
    const requestData = { 'filters': { 'type': 'district', parentId: stateId } };
    return this.profileService.getUserLocation(requestData).pipe(map((res: any) => {
      this.showDistrictDivLoader = false;
      this.allDistricts = res.result.response;
      return res.result.response;
    }));
  }

  closeModal() {
    this.popupControlService.changePopupStatus(true);
    this.close.emit();
  }

  updateUserLocation() {
    const locationCodes = [];
    const locationDetails: any = {};
    /* istanbul ignore else */
    if (this.userDetailsForm.value.state) {
      locationCodes.push(this.userDetailsForm.value.state);
      locationDetails.stateCode = this.userDetailsForm.value.state;
    }
    /* istanbul ignore else */
    if (this.userDetailsForm.value.district) {
      locationCodes.push(this.userDetailsForm.value.district);
      locationDetails.districtCode = this.userDetailsForm.value.district;
    }
    const data = { locationCodes: locationCodes };
    let districtData, stateData, changeType = '';
    /* istanbul ignore else */
    if (locationDetails.stateCode) {
      stateData = _.find(this.allStates, (states) => {
        return states.code === locationDetails.stateCode;
      });
    }
    /* istanbul ignore else */
    if (locationDetails.districtCode) {
      districtData = _.find(this.allDistricts, (districts) => {
        return districts.code === locationDetails.districtCode;
      });
    }
    /* istanbul ignore else */
    if (stateData.name !== _.get(this.suggestedLocation, 'state.name')) {
      changeType = changeType + 'state-changed';
    }

    /* istanbul ignore else */
    if (districtData.name !== _.get(this.suggestedLocation, 'district.name')) {
      if (_.includes(changeType, 'state-changed')) {
        changeType = 'state-dist-changed';
      } else {
        changeType = changeType + 'dist-changed';
      }
    }
    const telemetryData = this.getTelemetryData(changeType);
    this.generateInteractEvent(telemetryData);
    this.updateLocation(data, { state: stateData, district: districtData });
  }

  getTelemetryData(changeType) {
    return {
      locationInteractEdata: {
        id: 'submit-clicked',
        type: changeType ? 'location-changed' : 'location-unchanged',
        subtype: changeType
      },
      telemetryCdata: [
        { id: 'user:state:districtConfirmation', type: 'Feature' },
        { id: 'SC-1373', type: 'Task' }
      ]
    };
  }

  private generateInteractEvent(telemetryData) {
    const interactEData = telemetryData.locationInteractEdata;
    const telemetryInteractCdata = telemetryData.telemetryCdata;
    /* istanbul ignore else */
    if (interactEData) {
      const appTelemetryInteractData: IInteractEventInput = {
        context: {
          env: 'user-location',
          cdata: [
            { id: 'user:state:districtConfirmation', type: 'Feature' },
            { id: 'SC-1373', type: 'Task' }
          ],
        },
        edata: interactEData
      };
      /* istanbul ignore else */
      if (telemetryInteractCdata) {
        appTelemetryInteractData.object = telemetryInteractCdata;
      }
      this.telemetryService.interact(appTelemetryInteractData);
    }
  }

  updateLocation(data, locationDetails) {
    this.enableSubmitBtn = false;
    let response1: any;
    response1 = this.updateDeviceProfileData(data, locationDetails);
    const response2 = this.updateUserProfileData(data);
    forkJoin([response1, response2]).subscribe((res) => {
      /* istanbul ignore else */
      if (!_.isEmpty(res[0])) {
        this.telemetryLogEvents('Device Profile', true);
      }
      /* istanbul ignore else */
      if (!_.isEmpty(res[1])) {
        this.telemetryLogEvents('User Profile', true);
      }
      this.closeModal();
    }, (err) => {
      /* istanbul ignore else */
      if (!_.isEmpty(err[0])) {
        this.telemetryLogEvents('Device Profile', false);
      }
      /* istanbul ignore else */
      if (!_.isEmpty(err[1])) {
        this.telemetryLogEvents('User Profile', false);
      }
      this.closeModal();
    });
  }

  updateDeviceProfileData(data, locationDetails) {
    /* istanbul ignore else */
    if (!this.isDeviceProfileUpdateAllowed) {
      return of({});
    }
    return this.deviceRegisterService.updateDeviceProfile({
      state: _.get(locationDetails, 'state.name'),
      district: _.get(locationDetails, 'district.name')
    });
  }

  updateUserProfileData(data) {
    /* istanbul ignore else */
    if (!this.isUserProfileUpdateAllowed || !this.isCustodianOrgUser) {
      return of({});
    }
    return this.profileService.updateProfile(data);
  }

  telemetryLogEvents(locationType: any, status: boolean) {
    let level = 'ERROR';
    let msg = 'Updation of ' + locationType + ' failed';
    /* istanbul ignore else */
    if (status) {
      level = 'SUCCESS';
      msg = 'Updation of ' + locationType + ' success';
    }
    const event = {
      context: {
        env: 'portal'
      },
      edata: {
        type: 'update-location',
        level: level,
        message: msg
      }
    };
    this.telemetryService.log(event);
  }

}
