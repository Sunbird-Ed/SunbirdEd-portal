import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TelemetryModule} from '@sunbird/telemetry';
import {UserLocationComponent} from './user-location.component';
import {
  ResourceService,
  ToasterService,
  ConfigService,
  BrowserCacheTtlService,
  NavigationHelperService
} from '@sunbird/shared';
import {ProfileService} from '@sunbird/profile';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CacheService} from 'ng2-cache-service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {RouterTestingModule} from '@angular/router/testing';
import {userLocationMockData} from './user-location.component.spec.data';
import {of as observableOf, throwError as observableThrowError} from 'rxjs';
import {TenantService, UserService} from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';


describe('UserLocationComponent', () => {
  let component: UserLocationComponent;
  let fixture: ComponentFixture<UserLocationComponent>;
  let configService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, TelemetryModule.forRoot(), RouterTestingModule],
      declarations: [UserLocationComponent],
      providers: [
        {provide: ResourceService, useValue: userLocationMockData.resourceBundle},
        ToasterService, ProfileService, ConfigService, CacheService, BrowserCacheTtlService,
        NavigationHelperService, DeviceDetectorService, TelemetryService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configService = TestBed.get(ConfigService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call set state and district is state and district when empty object', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({state: {}, district: {}});
    expect(component.setState).toHaveBeenCalled();
    expect(component.setDistrict).toHaveBeenCalled();
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call set state and district is state and district when state empty', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({
      state: userLocationMockData.stateList[0],
      district: userLocationMockData.districtList[0]
    });
    expect(component.setState).toHaveBeenCalled();
    expect(component.setDistrict).toHaveBeenCalled();
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call onStateChange when state and district null', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({state: null, district: null});
    expect(component.setState).toHaveBeenCalledTimes(0);
    expect(component.setDistrict).toHaveBeenCalledTimes(0);
    expect(component.onStateChange).toHaveBeenCalled();
  });

  it('should call set state when district undefined', () => {
    spyOn(component, 'setState');
    spyOn(component, 'setDistrict');
    spyOn(component, 'onStateChange');
    component.setStateDistrict({state: undefined, district: undefined});
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

  it('should get telemetry data when nothing state and district not changed', () => {
    const data = component.getTelemetryData('');
    expect(data).toEqual(userLocationMockData.telemetryData);
  });

  it('should get telemetry data when state changed', () => {
    const data = component.getTelemetryData('state-changed');
    expect(data).toEqual(userLocationMockData.stateChanged);
  });

  it('should get telemetry data when dist changed', () => {
    const data = component.getTelemetryData('dist-changed');
    expect(data).toEqual(userLocationMockData.districtChanged);
  });

  it('should get telemetry data when both changed', () => {
    const data = component.getTelemetryData('state-dist-changed');
    expect(data).toEqual(userLocationMockData.bothChanged);
  });

  it('should close location modal by emitting event', () => {
    spyOn(component.close, 'emit');
    spyOn(component.userLocationModal, 'deny');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });


  it('should call to update user location and device location', () => {
    component.allStates = userLocationMockData.stateList;
    component.allDistricts = userLocationMockData.districtList;
    component.setStateDistrict(userLocationMockData.suggestedLocation);
    spyOn(component, 'updateLocation');
    component.updateUserLocation();
    expect(component.updateLocation).toHaveBeenCalledWith({locationCodes: ['2', '2907']},
      userLocationMockData.suggestedLocation);
  });


  it('should not get state data and close modal', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(component, 'closeModal');
    spyOn(toasterService, 'error');
    spyOn(profileService, 'getUserLocation').and.callFake(() =>
      observableThrowError(userLocationMockData.serverError));
    component.getState();
    expect(component.closeModal).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(userLocationMockData.resourceBundle.messages.emsg.m0016);
  });


  it('should get state data and call get selection strategy', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'getSelectionStrategy');
    spyOn(component, 'closeModal');
    spyOn(profileService, 'getUserLocation').and.callFake(() =>
      observableOf(userLocationMockData.stateResponse));
    component.getState();
    expect(component.getSelectionStrategy).toHaveBeenCalled();
    expect(component.allStates).toEqual(userLocationMockData.stateResponse.result.response);
  });


  it('should get district data', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.callFake(() =>
      observableOf(userLocationMockData.districtResponse));
    component.getDistrict('stateId').subscribe((res) => {
      expect(component.showDistrictDivLoader).toEqual(false);
      expect(component.allDistricts).toEqual(userLocationMockData.districtResponse.result.response);
    });
  });


  it('should set state input', () => {
    const eventObj = {...userLocationMockData.eventObject};
    component.clearInput(eventObj, 'state');
    expect(eventObj.target.value).toEqual('');
  });

  it('should set district input', () => {
    const eventObj = {...userLocationMockData.eventObject};
    component.clearInput(userLocationMockData.eventObject, 'district');
    expect(eventObj.target.value).toEqual('');
  });

  // user not logged in and userdeclared location not present
  it('should set populate from ip location', () => {
    component.deviceProfile = {
      ipLocation: userLocationMockData.mockLocation
    };
    component.allStates = userLocationMockData.stateList;
    const userService = TestBed.get(UserService);
    const profileService = TestBed.get(ProfileService);
    spyOnProperty(userService, 'loggedIn').and.returnValue(false);
    spyOn(profileService, 'getUserLocation').and.callFake(() =>
      observableOf(userLocationMockData.districtResponse));
    component.getSelectionStrategy();
    expect(component.suggestionType).toEqual('ipLocation');
    expect(component.isUserProfileUpdateAllowed).toEqual(false);
    expect(component.isDeviceProfileUpdateAllowed).toEqual(true);
    expect(component.selectedState).toEqual(userLocationMockData.stateList[0]);
    expect(component.selectedDistrict).toEqual(userLocationMockData.districtList[0]);
  });

  // user logged in and user declared device location present user profile location not present
  it('should set populate from userDeclared location', () => {
    component.deviceProfile = {
      ipLocation: userLocationMockData.mockLocation,
      userDeclaredLocation: userLocationMockData.mockLocation
    };
    component.allStates = userLocationMockData.stateList;
    const userService = TestBed.get(UserService);
    const profileService = TestBed.get(ProfileService);
    spyOnProperty(userService, 'loggedIn').and.returnValue(true);
    spyOnProperty(userService, 'userProfile').and.returnValue({userLocations: []});
    spyOn(profileService, 'getUserLocation').and.callFake(() =>
      observableOf(userLocationMockData.districtResponse));
    component.getSelectionStrategy();
    expect(component.suggestionType).toEqual('userDeclared');
    expect(component.isUserProfileUpdateAllowed).toEqual(true);
    expect(component.isDeviceProfileUpdateAllowed).toEqual(false);
    expect(component.selectedState).toEqual(userLocationMockData.stateList[0]);
    expect(component.selectedDistrict).toEqual(userLocationMockData.districtList[0]);
  });
  // user logged in and user declared device location not present user profile location is present
  it('should set populate from userLocation location', () => {
    component.deviceProfile = {
      ipLocation: userLocationMockData.mockLocation
    };
    component.allStates = userLocationMockData.stateList;
    const userService = TestBed.get(UserService);
    const profileService = TestBed.get(ProfileService);
    spyOnProperty(userService, 'loggedIn').and.returnValue(true);
    spyOnProperty(userService, 'userProfile').and.returnValue({
      userLocations: [userLocationMockData.districtList[0], userLocationMockData.stateList[0]]
    });
    spyOn(profileService, 'getUserLocation').and.callFake(() =>
      observableOf(userLocationMockData.districtResponse));
    component.getSelectionStrategy();
    expect(component.suggestionType).toEqual('userLocation');
    expect(component.isUserProfileUpdateAllowed).toEqual(false);
    expect(component.isDeviceProfileUpdateAllowed).toEqual(true);
    expect(component.selectedState).toEqual(userLocationMockData.stateList[0]);
    expect(component.selectedDistrict).toEqual(userLocationMockData.districtList[0]);
  });

  // user logged in and user declared device location not present user profile location not is present
  it('should set populate from ipLocation location', () => {
    component.deviceProfile = {
      ipLocation: userLocationMockData.mockLocation
    };
    component.allStates = userLocationMockData.stateList;
    const userService = TestBed.get(UserService);
    const profileService = TestBed.get(ProfileService);
    spyOnProperty(userService, 'loggedIn').and.returnValue(true);
    spyOnProperty(userService, 'userProfile').and.returnValue({
      userLocations: []
    });
    spyOn(profileService, 'getUserLocation').and.callFake(() =>
      observableOf(userLocationMockData.districtResponse));
    component.getSelectionStrategy();
    expect(component.suggestionType).toEqual('ipLocation');
    expect(component.isUserProfileUpdateAllowed).toEqual(true);
    expect(component.isDeviceProfileUpdateAllowed).toEqual(true);
    expect(component.selectedState).toEqual(userLocationMockData.stateList[0]);
    expect(component.selectedDistrict).toEqual(userLocationMockData.districtList[0]);
  });

  it('should call to update user location and device location when state district changed', () => {
    const telemetryService = TestBed.get(TelemetryService);
    component.allStates = userLocationMockData.stateList;
    component.allDistricts = userLocationMockData.districtList;
    component.setStateDistrict(userLocationMockData.suggestedLocation);
    component.userDetailsForm.value.state = '22';
    component.userDetailsForm.value.district = '33';
    spyOn(component, 'updateLocation');
    spyOn(telemetryService, 'interact');
    component.updateUserLocation();
    expect(component.updateLocation).toHaveBeenCalledWith({locationCodes: ['22', '33']},
      userLocationMockData.suggestedLocation1);
  });

});
