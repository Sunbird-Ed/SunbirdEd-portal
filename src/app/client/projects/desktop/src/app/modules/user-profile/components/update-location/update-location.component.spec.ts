import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLocationComponent } from './update-location.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SuiModalModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
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
  const resourceBundle = {
    messages: {
      smsg: {
        m0057: 'Location updated successfully'
      },
      emsg: {
        m0021: 'Unable to update location. Try again later'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModalModule, HttpClientTestingModule, TelemetryModule.forRoot(), SharedModule.forRoot()],
      declarations: [UpdateLocationComponent],
      providers: [{ provide: Router, useClass: RouterStub },
      { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      {provide: ResourceService, useValue: resourceBundle},
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
    expect(component.getAllStates).toHaveBeenCalled();
  });

  it('should call searchLocation (to get states) in onboarding service', () => {
    spyOn(component.userService, 'searchLocation').and.returnValue(of (location_Data.success_state_details));
    spyOn(component, 'onStateChanges');
    component.selectedState = {name: 'test_state_1'};
    component.getAllStates();
    expect(component.onStateChanges).toHaveBeenCalled();
    component.userService.searchLocation({ type: 'state' }).subscribe(data => {
      expect(data).toBe(location_Data.success_state_details);
      expect(component.stateList).toEqual(location_Data.success_state_details.result.response);
      expect(component.selectedState).toBeDefined();
    });

  });

  it('should call searchLocation (to get districts) in onboarding service', () => {
    const userService = TestBed.get(OnboardingService);
    spyOn(userService, 'searchLocation').and.returnValue(of(location_Data.success_districts_details));
    component.selectedDistrict = {name: 'test_district_3'};
    component.onStateChanges();
    userService.searchLocation(location_Data.get_district_details_api_body).subscribe(data => {
      expect(data).toBe(location_Data.success_districts_details);
      expect(component.districtList).toEqual(location_Data.success_districts_details.result.response);
      expect(component.selectedDistrict).toBeDefined();
    },
    );
  });

  it('should call close modal in success updating content', () => {
    spyOn(component.dismissed, 'emit').and.callThrough();
    component.closeModal(location_Data.user_details);
    expect(component.dismissed.emit).toHaveBeenCalledWith(location_Data.user_details);
  });

  it('should call close modal error while  updating content', () => {
    spyOn(component.dismissed, 'emit').and.returnValue('');
    component.closeModal('');
    expect(component.dismissed.emit).toHaveBeenCalledWith('');
  });

  it('should call saveLocation (successful) in onboarding service', () => {
    spyOn(component.userService, 'saveLocation').and.returnValue(of(location_Data.success_update_location));
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(component.toasterService, 'success').and.callThrough();
    component.userLocationData = {location: {state: {}, city: {}}};
    component.selectedState = location_Data.user_details.result.location.state;
    component.selectedDistrict = location_Data.user_details.result.location.city;
    component.updateUserLocation();
    component.userService.saveLocation(location_Data.update_location_api_body).subscribe(data => {
      expect(data).toBe(location_Data.success_update_location);
      expect(component.closeModal).toHaveBeenCalledWith({location: location_Data.user_details.result.location});
    });
  });

  it('should call saveLocation (error) in onboarding service', () => {
    const userService = TestBed.get(OnboardingService);
    spyOn(userService, 'saveLocation').and.returnValue(of(location_Data.error_save_location));
    spyOn(component.dismissed, 'emit');
    component.userLocationData = {location: {state: {}, city: {}}};
    component.selectedState = location_Data.user_details.result.location.state;
    component.selectedDistrict = location_Data.user_details.result.location.city;
    component.updateUserLocation();
    userService.saveLocation(location_Data.update_location_api_body).subscribe(data => {}, error => {
      expect(error).toBe(location_Data.error_save_location);
      expect(component.closeModal).toHaveBeenCalledWith('');
    });
  });

});
