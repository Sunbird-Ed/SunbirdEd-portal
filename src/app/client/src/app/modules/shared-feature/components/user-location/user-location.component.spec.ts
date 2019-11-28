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


describe('UserLocationComponent', () => {
  let component: UserLocationComponent;
  let fixture: ComponentFixture<UserLocationComponent>;
  let configService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, TelemetryModule.forRoot(), RouterTestingModule],
      declarations: [UserLocationComponent],
      providers: [ResourceService, ToasterService, ProfileService, ConfigService, CacheService, BrowserCacheTtlService,
        NavigationHelperService, DeviceDetectorService]
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

  it('should not set state as state and district not found', () => {
    component.allDistricts = null;
    component.allStates = null;
    component.setStateDistrict({state: {}, district: {}});
    expect(component.selectedDistrict).toEqual(undefined);
    expect(component.selectedState).toEqual(undefined);
  });

  it('should set state and not set district as district list not found', () => {
    component.allStates = userLocationMockData.stateList;
    component.setStateDistrict({state: userLocationMockData.stateList[0], district: {}});
    expect(component.selectedDistrict).toEqual(undefined);
    expect(component.selectedState).toEqual(userLocationMockData.stateList[0]);
  });

  it('should set state and district', () => {
    component.allStates = userLocationMockData.stateList;
    component.allDistricts = userLocationMockData.districtList;
    component.setStateDistrict({
      state: userLocationMockData.stateList[0],
      district: userLocationMockData.districtList[0]
    });
    expect(component.selectedDistrict).toEqual(userLocationMockData.districtList[0]);
    expect(component.selectedState).toEqual(userLocationMockData.stateList[0]);
  });

});
