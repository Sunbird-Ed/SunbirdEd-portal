import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingLocationSelectionComponent } from './onboarding-location-selection.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { onboardingLocationMockData } from './onboarding-location-selection.component.spec.data';
import { UserService, DeviceRegisterService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { ProfileService } from '@sunbird/profile';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { of, throwError } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';

describe('OnboardingLocationSelectionComponent', () => {
  let component: OnboardingLocationSelectionComponent;
  let fixture: ComponentFixture<OnboardingLocationSelectionComponent>;

  const resourceMockData = {
    messages: {
      emsg: { m0017: 'Fetching districts failed. Try again later', m0016: 'Fetching states failed. Try again later' }

    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingLocationSelectionComponent],
      imports: [
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        SuiModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule
      ],
      providers: [
        UserService,
        DeviceRegisterService,
        NavigationHelperService,
        TelemetryService,
        PopupControlService,
        ProfileService,
        { provide: ResourceService, useValue: resourceMockData },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingLocationSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call set state and district is state and district when empty object', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({ state: {}, district: {} });
    expect(component.setState).toHaveBeenCalled();
    expect(component.setDistrict).toHaveBeenCalled();
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call set state and district is state and district when state empty', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({
      state: onboardingLocationMockData.stateList[0],
      district: onboardingLocationMockData.districtList[0]
    });
    expect(component.setState).toHaveBeenCalled();
    expect(component.setDistrict).toHaveBeenCalled();
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call set state when district undefined', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({ state: undefined, district: undefined });
    expect(component.setState).toHaveBeenCalledTimes(0);
    expect(component.setDistrict).toHaveBeenCalledTimes(0);
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call set state change when location null', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict(null);
    expect(component.setState).toHaveBeenCalledTimes(0);
    expect(component.setDistrict).toHaveBeenCalledTimes(0);
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call set state change when location undefined', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict(undefined);
    expect(component.setState).toHaveBeenCalledTimes(0);
    expect(component.setDistrict).toHaveBeenCalledTimes(0);
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call only set state change when location empty object', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({});
    expect(component.setState).toHaveBeenCalledTimes(0);
    expect(component.setDistrict).toHaveBeenCalledTimes(0);
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call enableSubmitButton', () => {
    component.userDetailsForm.setValue({ district: 'Nancy', state: 'Drew' });
    spyOn(component.userDetailsForm, 'valueChanges').and.returnValue(of({}));
    component.enableSubmitButton();
    expect(component.enableSubmitBtn).toBe(true);
  });

  it('should call processStateLocation', () => {
    component.allStates = onboardingLocationMockData.stateList;
    const locationExist = component.processStateLocation('Maharashtra');
    expect(locationExist).toBe(onboardingLocationMockData.stateList[0]);
  });

  it('should call processDistrictLocation on success', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.returnValue(of(onboardingLocationMockData.districtLocation.getUserLocationResponse));
    const response = component.processDistrictLocation(onboardingLocationMockData.districtLocation.district,
      onboardingLocationMockData.districtLocation.state);
    expect(profileService.getUserLocation).toHaveBeenCalledWith(onboardingLocationMockData.districtLocation.requestData);
    response.subscribe((res) => {
      expect(res).toBeTruthy();
    });
  });

  it('should call processDistrictLocation on error', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.returnValue(throwError({}));
    const response = component.processDistrictLocation(onboardingLocationMockData.districtLocation.district,
      onboardingLocationMockData.districtLocation.state);
    expect(profileService.getUserLocation).toHaveBeenCalledWith(onboardingLocationMockData.districtLocation.requestData);
    response.subscribe((res) => { }, error => {
      expect(error).toEqual({});
    });
  });

  it('should call setState on match found', () => {
    component.allStates = onboardingLocationMockData.stateList;
    component.setState(onboardingLocationMockData.stateList[0]);
    expect(component.userDetailsForm.value.state).toBe('1');
  });

  it('should call setState on no match found', () => {
    component.allStates = onboardingLocationMockData.stateList;
    component.setState({
      code: '3',
      name: 'karnataka',
      id: '3789e5e3-a31f-43fa-9cb3-c1b26460ffd5',
      type: 'state'
    });
    expect(component.userDetailsForm.value.state).toBe(null);
  });

  it('should call setDistrict on match found', () => {
    component.allDistricts = onboardingLocationMockData.districtList;
    component.setDistrict(onboardingLocationMockData.districtList[0]);
    expect(component.userDetailsForm.value.district).toBe('2725');
  });

  it('should call setDistrict on no match found', () => {
    component.allDistricts = onboardingLocationMockData.districtList;
    component.setDistrict({
      'code': '2700',
      'name': 'Ahmednagar',
      'id': '34b8ac6b-d6c9-4ab1-9fd0-cfb0ec1a2a81',
      'type': 'district',
      'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
    });
    expect(component.userDetailsForm.value.district).toBe(null);
  });

  it('should call setData', () => {
    const location = { state: { id: '1243' } };
    spyOn(component, 'getDistrict').and.returnValue(of({}));
    spyOn(component, 'setStateDistrict');
    component.setData(location);
    expect(component.getDistrict).toHaveBeenCalledWith('1243');
    expect(component.setStateDistrict).toHaveBeenCalledWith(location);
  });

  it('should call getLocationCodes', () => {
    const location = { state: 'Maharashtra' };
    spyOn(component, 'processStateLocation');
    spyOn(component, 'processDistrictLocation');
    component.getLocationCodes(location);
    expect(component.processStateLocation).toHaveBeenCalledWith('Maharashtra');
    expect(component.processDistrictLocation).toHaveBeenCalled();
  });

  it('should call closeModal', () => {
    const popupControlService = TestBed.get(PopupControlService);
    spyOn(popupControlService, 'changePopupStatus');
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(popupControlService.changePopupStatus).toHaveBeenCalledWith(true);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should call getTelemetryData', () => {
    const response = component.getTelemetryData('state-dist-changed');
    expect(response).toEqual(onboardingLocationMockData.getTelemetryData);
  });

  it('should call getTelemetryData on unchanged location', () => {
    const response = component.getTelemetryData('');
    expect(response).toEqual(onboardingLocationMockData.getTelemetryData1);
  });

  it('should call getState on success', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.returnValue(of(onboardingLocationMockData.districtLocation.getUserLocationResponse));
    spyOn(component, 'getSelectionStrategy');
    component.getState();
    expect(profileService.getUserLocation).toHaveBeenCalledWith({ 'filters': { 'type': 'state' } });
    expect(component.allStates).toEqual(onboardingLocationMockData.districtLocation.getUserLocationResponse.result.response);
    expect(component.getSelectionStrategy).toHaveBeenCalled();
  });

  it('should call getState on error', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(component, 'closeModal');
    spyOn(toasterService, 'error');
    spyOn(profileService, 'getUserLocation').and.returnValue(throwError({}));
    component.getState();
    expect(profileService.getUserLocation).toHaveBeenCalledWith({ 'filters': { 'type': 'state' } });
    expect(component.closeModal).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call updateUserProfileData', () => {
    component.isUserProfileUpdateAllowed = false;
    component.isCustodianOrgUser = false;
    const resp = component.updateUserProfileData({});
    resp.subscribe(res => {
      expect(res).toEqual({});
    });
  });

  it('should call updateUserProfileData on update', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.returnValue(of('profile updated successfully'));
    component.isUserProfileUpdateAllowed = true;
    component.isCustodianOrgUser = true;
    const resp = component.updateUserProfileData({});
    expect(profileService.updateProfile).toHaveBeenCalledWith({});
    resp.subscribe(res => {
      expect(res).toEqual('profile updated successfully');
    });
  });

  it('should call updateDeviceProfileData', () => {
    component.isDeviceProfileUpdateAllowed = false;
    const resp = component.updateDeviceProfileData('', {});
    resp.subscribe(res => {
      expect(res).toEqual({});
    });
  });

  it('should call updateDeviceProfileData on update', () => {
    const deviceRegisterService = TestBed.get(DeviceRegisterService);
    const locationDetails = {
      state: { name: 'Maharashtra' },
      district: { name: 'Kolhapur' }
    };
    spyOn(deviceRegisterService, 'updateDeviceProfile');
    component.isDeviceProfileUpdateAllowed = true;
    component.updateDeviceProfileData({}, locationDetails);
    expect(deviceRegisterService.updateDeviceProfile).toHaveBeenCalledWith({ state: 'Maharashtra', district: 'Kolhapur' });
  });

  it('should call telemetryLogEvents', () => {
    const event = {
      context: {
        env: 'portal'
      },
      edata: {
        type: 'update-location',
        level: 'ERROR',
        message: 'Updation of state failed'
      }
    };
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    component.telemetryLogEvents('state', false);
    expect(telemetryService.log).toHaveBeenCalledWith(event);
  });

  it('should call telemetryLogEvents', () => {
    const event = {
      context: {
        env: 'portal'
      },
      edata: {
        type: 'update-location',
        level: 'SUCCESS',
        message: 'Updation of state success'
      }
    };
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    component.telemetryLogEvents('state', true);
    expect(telemetryService.log).toHaveBeenCalledWith(event);
  });

  it('should call getSelectionStrategy', () => {
    component.deviceProfile = {
      ipLocation: { state: 'Maharashtra', district: 'Pune' }
    };
    const userService = TestBed.get(UserService);
    userService._authenticated = true;
    component.getSelectionStrategy();
  });

  it('should call getDistrict', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.returnValue(of(onboardingLocationMockData.districtLocation.getUserLocationResponse));
    const resp = component.getDistrict('1');
    resp.subscribe((data) => {
      expect(component.showDistrictDivLoader).toBe(false);
      expect(component.allDistricts).toEqual(onboardingLocationMockData.districtLocation.getUserLocationResponse.result.response);
      expect(data).toEqual(onboardingLocationMockData.districtLocation.getUserLocationResponse.result.response);
    });
  });

  it('should call setSelectedLocation', () => {
    const location = {
      'state': 'Maharashtra',
      'district': 'Pune'
    };
    const mappedStateDetails = {
      'code': '27',
      'name': 'Maharashtra',
      'id': '37809706-8f0e-4009-bf67-87bf04f220fa',
      'type': 'state'
    };
    const mappedDistrictDetails = {
      'code': '2725',
      'name': 'Pune',
      'id': '34b8ac6b-d6c9-4ab1-9fd0-cfb0ec1a2a81',
      'type': 'district',
      'parentId': '37809706-8f0e-4009-bf67-87bf04f220fa'
    };
    spyOn(component, 'processStateLocation').and.returnValue(mappedStateDetails);
    spyOn(component, 'getLocationCodes').and.returnValue(of(mappedDistrictDetails));
    spyOn(component, 'setStateDistrict');
    component.setSelectedLocation(location, false, true);
    expect(component.processStateLocation).toHaveBeenCalledWith('Maharashtra');
    expect(component.getLocationCodes).toHaveBeenCalledWith(location);
    expect(component.processedDeviceLocation).toEqual({ district: mappedDistrictDetails, state: mappedStateDetails });
    expect(component.setStateDistrict).toHaveBeenCalledWith({ district: mappedDistrictDetails, state: mappedStateDetails });
  });
});
