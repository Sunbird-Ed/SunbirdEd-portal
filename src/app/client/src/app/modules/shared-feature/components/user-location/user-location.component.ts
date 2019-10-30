import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpOptions, ResourceService, ToasterService} from '@sunbird/shared';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import {DeviceRegisterService, UserService} from '@sunbird/core';
import {ProfileService} from '@sunbird/profile';
import * as _ from 'lodash-es';
import {IInteractEventEdata, IInteractEventObject} from '@sunbird/telemetry';
import {map} from 'rxjs/operators';
import {of, forkJoin} from 'rxjs';

@Component({
  selector: 'app-user-location',
  templateUrl: './user-location.component.html',
  styleUrls: ['./user-location.component.scss']
})
export class UserLocationComponent implements OnInit {

  @Output() close = new EventEmitter<any>();
  @Input() userLocationDetails: any;
  @Input() deviceProfile: any;
  @Input() userProfile: any;
  @ViewChild('userLocationModal') userLocationModal;
  userDetailsForm: FormGroup;
  public processedDeviceLocation: any = {};
  selectedState;
  selectedDistrict;
  allStates: any;
  allDistricts: any;
  showDistrictDivLoader = false;
  sbFormBuilder: FormBuilder;
  enableSubmitBtn = false;
  isDeviceProfileUpdateAllowed = false;
  isUserProfileUpdateAllowed = false;



  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
              formBuilder: FormBuilder, public profileService: ProfileService,
              public userService: UserService, public deviceRegisterService: DeviceRegisterService) {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit() {
    this.initializeFormFields();
    this.getState();
  }

  initializeFormFields() {
    this.userDetailsForm = this.sbFormBuilder.group({
      state: new FormControl(null, [Validators.required]),
      district: new FormControl(null, [Validators.required])
    });
    this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    this.onStateChange();
    this.enableSubmitButton();
    // this.setInteractEventData();
  }

  enableSubmitButton() {
    this.userDetailsForm.valueChanges.subscribe(val => {
      this.enableSubmitBtn = (this.userDetailsForm.status === 'VALID');
    });
  }

  processStateLocation(state) {
    let locationExist: any = {};
    if (state) {
      locationExist = _.find(this.allStates, (locations) => {
        return locations.name.toLowerCase() === state.toLowerCase() && locations.type === 'state';
      });
    }
    return locationExist;
  }

  processDistrictLocation(district, stateData) {
    const requestData = {'filters': {'type': 'district', parentId: stateData.id}};
    return this.profileService.getUserLocation(requestData).pipe(map(res => {
      const districts = res.result.response;
      let locationExist: any = {};
      if (district) {
        locationExist = _.find(districts, (locations) => {
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
    if (state) {
      locationExist = _.find(this.allStates, (locations) => {
        return locations.code === state.code && locations.type === 'state';
      });
    }
    this.selectedState = locationExist;
    locationExist ? this.userDetailsForm.controls['state'].setValue(locationExist.code) :
      this.userDetailsForm.controls['state'].setValue('');
  }

  setDistrict(district) {
    let locationExist: any;
    if (district) {
      locationExist = _.find(this.allDistricts, (locations) => {
        return locations.code === district.code && locations.type === 'district';
      });
    }
    this.selectedDistrict = locationExist;
    locationExist ? this.userDetailsForm.controls['district'].setValue(locationExist.code) :
      this.userDetailsForm.controls['district'].setValue('');
  }

  getSelectionStrategy() {
    if (this.userService.loggedIn) {
      const userProfileData = this.userService.userProfile;
      const isUserLocationConfirmed = userProfileData && userProfileData.userLocations &&
        Array.isArray(userProfileData.userLocations) && userProfileData.userLocations.length >= 1;

      if (!isUserLocationConfirmed && this.deviceProfile.userDeclaredLocation) {
        // render using userDeclaredLocation
        // update user profile only
        this.setSelectedLocation(this.deviceProfile.userDeclaredLocation, true, false);
      }
      if (!this.deviceProfile.userDeclaredLocation) {
        if (isUserLocationConfirmed) {
          const userLocation = {
            district: _.find(userProfileData.userLocations, (location) => {
              return location.type === 'district';
            }),
            state: _.find(userProfileData.userLocations, (location) => {
              return location.type === 'state';
            })
          };
          this.setSelectedLocation(userLocation, false, true);
          // render using user location
          // update only device profile

        } else if (!isUserLocationConfirmed) {
          // this.setData(this.deviceProfile.ipLocation);
          this.setSelectedLocation(this.deviceProfile.ipLocation, true, true);
          // render using ip
          // update device location and user location
        }
      }
    } else {
      if (!this.deviceProfile.userDeclaredLocation) {
        this.setSelectedLocation(this.deviceProfile.ipLocation, false, true);
        // render using ip
        // update device profile only
      }
    }
  }

  setSelectedLocation(location, updateUserProFile, updateDeviceProfile) {
    const mappedStateDetails = this.processStateLocation(location.state);
    this.getLocationCodes(location).subscribe((mappedDistrictDetails) => {
      this.processedDeviceLocation = {
        district: mappedDistrictDetails,
        state: mappedStateDetails
      };
      this.setData(this.processedDeviceLocation);
      this.isUserProfileUpdateAllowed = updateUserProFile;
      this.isDeviceProfileUpdateAllowed = updateDeviceProfile;
    });
  }

  setData(location) {
    this.setState(location.state);
    this.allDistricts = null;
    this.getDistrict(location.state.id).subscribe((districts) => {
      this.setDistrict(location.district);
    });
  }

  getLocationCodes(locationToProcess) {
    const mappedStateDetails = this.processStateLocation(locationToProcess.state);
    return this.processDistrictLocation(locationToProcess.district, mappedStateDetails);
  }

  getState() {
    const requestData = {'filters': {'type': 'state'}};
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
        if (stateControl.status === 'VALID' && stateValue !== stateControl.value) {
          this.allDistricts = null;
          const state = _.find(this.allStates, (states) => {
            return states.code === stateControl.value;
          });
          this.getDistrict(state.id).subscribe((districts) => {
            this.allDistricts = districts;
            stateValue = stateControl.value;
          });
        }
      });
  }

  getDistrict(stateId) {
    const requestData = {'filters': {'type': 'district', parentId: stateId}};
    if (this.allDistricts) {
      return of(this.allDistricts);
    }
    return this.profileService.getUserLocation(requestData).pipe(map(res => {
      this.showDistrictDivLoader = false;
      this.allDistricts = res.result.response;
      return this.allDistricts;
    }));
  }

  clearInput(event, formControlName) {
    let value = '';
    if (event.target.value) {
      switch (formControlName) {
        case 'state': {
          value = this.selectedState ? this.selectedState.name : '';
          break;
        }
        case 'district': {
          value = this.selectedDistrict ? this.selectedDistrict.name : '';
          break;
        }
      }
    }
    event.target.value = value;
  }

  closeModal() {
    this.userLocationModal.deny();
    this.close.emit();
  }

  updateUserLocation() {
    const locationCodes = [];
    const locationDetails: any = {};
    if (this.userDetailsForm.value.state) {
      locationCodes.push(this.userDetailsForm.value.state);
      locationDetails.stateCode = this.userDetailsForm.value.state;
    }
    if (this.userDetailsForm.value.district) {
      locationCodes.push(this.userDetailsForm.value.district);
      locationDetails.districtCode = this.userDetailsForm.value.district;
    }
    const data = {locationCodes: locationCodes};
    this.updateLocation(data, locationDetails);
  }

  updateLocation(data, locationDetails) {
    this.enableSubmitBtn = false;
    let response1: any;
    response1 = this.updateDeviceProfileData(data, locationDetails);
    const response2 = this.updateUserProfileData(data);
    forkJoin([response1, response2]).subscribe((res) => {
      this.closeModal();
      this.toasterService.success(this.resourceService.messages.smsg.m0046);
    }, () => {
      this.closeModal();
      this.toasterService.error(this.resourceService.messages.emsg.m0018);
    });
  }

  updateDeviceProfileData(data, locationDetails) {
    if (!this.isDeviceProfileUpdateAllowed) {
      return of({});
    }
    let districtData, stateData;
    if (locationDetails.stateCode) {
      stateData = _.find(this.allStates, (states) => {
        return states.code === locationDetails.stateCode;
      });
    }
    if (locationDetails.districtCode) {
      districtData = _.find(this.allDistricts, (districts) => {
        return districts.code === locationDetails.districtCode;
      });
    }
    return this.deviceRegisterService.updateDeviceProfile({
      state: stateData.name,
      district: districtData.name
    });
  }

  updateUserProfileData(data) {
    if (!this.isUserProfileUpdateAllowed) {
      return of({});
    }
    return this.profileService.updateProfile(data);
  }
}
