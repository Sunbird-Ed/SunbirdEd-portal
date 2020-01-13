import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { UserLocationComponent } from './user-location.component';
import {
  ResourceService,
  ToasterService,
  ConfigService,
  BrowserCacheTtlService,
  NavigationHelperService
} from '@sunbird/shared';
import { ProfileService } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RouterTestingModule } from '@angular/router/testing';
import { userLocationMockData } from './user-location.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '@sunbird/shared';


describe('UserLocationComponent', () => {
  let component: UserLocationComponent;
  let fixture: ComponentFixture<UserLocationComponent>;
  let configService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SuiModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TelemetryModule.forRoot(),
        RouterTestingModule,
        SharedModule.forRoot()],
      declarations: [UserLocationComponent],
      providers: [ResourceService, ToasterService, ProfileService, ConfigService, CacheService, BrowserCacheTtlService,
        NavigationHelperService, DeviceDetectorService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configService = TestBed.get(ConfigService);
  });

  it('should create user-location component', () => {
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
    component.setStateDistrict({ state: null, district: null });
    expect(component.setState).toHaveBeenCalledTimes(0);
    expect(component.setDistrict).toHaveBeenCalledTimes(0);
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


});
