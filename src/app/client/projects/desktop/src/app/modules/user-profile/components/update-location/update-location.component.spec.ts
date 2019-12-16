import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLocationComponent } from './update-location.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SuiModalModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { OnboardingService } from '../../../offline/services';
import { location_Data } from './update-location.component.spec.data';
describe('UpdateLocationComponent', () => {
  let component: UpdateLocationComponent;
  let fixture: ComponentFixture<UpdateLocationComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'profile',
          pageid: 'profile'
        }
      }
    };
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModalModule, HttpClientTestingModule, TelemetryModule.forRoot(), SharedModule.forRoot()],
      declarations: [UpdateLocationComponent],
      providers: [{ provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        OnboardingService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllStates', () => {
    spyOn(component, 'getAllStates');
    component.ngOnInit();
    spyOn(component, 'onStateChanges');
  });

  it('should call searchLocation (to get states) in onboarding service', () => {
    const userService = TestBed.get(OnboardingService);
    spyOn(component, 'getAllStates');
    spyOn(userService, 'searchLocation').and.returnValue(of(location_Data.success_state_details));
    userService.searchLocation(location_Data.get_state_details_api_body).subscribe(data => {
      expect(data).toBe(location_Data.success_state_details);
      expect(component.selectedState).toBeDefined();
      expect(component.stateList).toBeDefined();
    }, error => {

    });

  });

  it('should call searchLocation (to get districts) in onboarding service', () => {
    spyOn(component, 'onStateChanges');
    const userService = TestBed.get(OnboardingService);
    spyOn(userService, 'searchLocation').and.returnValue(of(location_Data.success_districts_details));
    userService.searchLocation(location_Data.get_district_details_api_body).subscribe(data => {
      expect(data).toBe(location_Data.success_districts_details);
      expect(component.selectedDistrict).toBeDefined();
      expect(component.districtList).toBeDefined();
    }, error => {

    });
  });

  it('should call close modal', () => {
    spyOn(component, 'closeModal');
    spyOn(component.dismissed, 'emit');
  });



  it('should call saveLocation (successful) in onboarding service', () => {
    spyOn(component, 'updateUserLocation');
    const userService = TestBed.get(OnboardingService);
    spyOn(userService, 'saveLocation').and.returnValue(of(location_Data.success_update_location));
    userService.saveLocation(location_Data.update_location_api_body).subscribe(data => {
      expect(data).toBe(location_Data.success_update_location);
      spyOn(component.toasterService, 'success').and.returnValue(of(location_Data.resourceBundle.messages.smsg.m0060));
      spyOn(component.dismissed, 'emit').and.returnValue(of('SUCCESS'));
      component.closeModal('SUCCESS');
      expect(component.toasterService.success(location_Data.resourceBundle.messages.smsg.m0060));
    }, error => {

    });
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should call saveLocation (error) in onboarding service', () => {
    spyOn(component, 'updateUserLocation');
    const userService = TestBed.get(OnboardingService);
    spyOn(userService, 'saveLocation').and.returnValue(of(location_Data.error_save_location));
    userService.saveLocation(location_Data.update_location_api_body).subscribe(data => {

    }, error => {
      expect(error).toBe(location_Data.error_save_location);
      spyOn(component.toasterService, 'error').and.returnValue(of(location_Data.resourceBundle.messages.emsg.m0024));
      spyOn(component.dismissed, 'emit').and.returnValue(of('ERROR'));
      component.closeModal('ERROR');
      expect(component.toasterService.error(location_Data.resourceBundle.messages.emsg.m0024));
    });

    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

});
