import { By } from '@angular/platform-browser';
import { of as observableOf, throwError } from 'rxjs';
import { onboarding_location_test } from './onboarding-location.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OnboardingLocationComponent } from './onboarding-location.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService } from '@sunbird/shared';


describe('OnboardingLocationComponent', () => {
  let component: OnboardingLocationComponent;
  let fixture: ComponentFixture<OnboardingLocationComponent>;
  class ActivatedRouteStub {
  }

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingLocationComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot(), SuiModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: ResourceService, useValue: onboarding_location_test.resourceBundle },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllStates', () => {
    spyOn(component.tenantService, 'tenantData$').and.returnValue(observableOf(onboarding_location_test.tenantInfo));
    spyOn(component, 'getAllStates');
    component.ngOnInit();
    expect(component.tenantInfo).toBeDefined();
  });

  it('should call allDistrict', () => {
    spyOn(component, 'getAllDistricts');
    component.onOptionChanges('state');
    expect(component.getAllDistricts).toHaveBeenCalled();
  });

  it('should not call allDistrict', () => {
    spyOn(component, 'getAllDistricts');
    component.onOptionChanges('district');
    expect(component.getAllDistricts).not.toHaveBeenCalled();
    expect(component.disableContinueBtn).toBeFalsy();
  });

  it('should call searchLocation (to get states) in onboarding service', () => {
    spyOn(component.onboardingService, 'searchLocation').and.returnValue(observableOf(onboarding_location_test.statesList));
    spyOn(component, 'getUserCurrentLocation');
    component.isConnected = true;
    component.getAllStates();
    expect(component.onboardingService.searchLocation).toHaveBeenCalled();
    expect(component.getUserCurrentLocation).toHaveBeenCalled();
  });

  it('should call searchLocation (to get districts) in onboarding service', () => {
    spyOn(component.onboardingService, 'searchLocation').and.returnValue(observableOf(onboarding_location_test.districtList));
    const parentId = onboarding_location_test.statesList.result.response[1]['id'];
    component.getAllDistricts(parentId);
    expect(component.onboardingService.searchLocation).toHaveBeenCalled();
    expect(parentId).toEqual('4a6d77a1-6653-4e30-9be8-93371b6b53b5');
  });

  it('should call saveLocation (successful) in onboarding service', () => {
    spyOn(component.onboardingService, 'saveLocation').and.returnValue(observableOf(onboarding_location_test.saveLocation));
    spyOn(component.locationSaved, 'emit').and.returnValue(observableOf('SUCCESS'));
    component.handleSubmitButton();
    expect(component.onboardingService.saveLocation).toHaveBeenCalled();
    expect(component.disableContinueBtn).toBeFalsy();
    expect(component.locationSaved.emit).toHaveBeenCalled();
  });

  it('should call saveLocation (error) in onboarding service', () => {
    spyOn(component.onboardingService, 'saveLocation').and.returnValue(throwError(onboarding_location_test.error));
    spyOn(component.locationSaved, 'emit').and.returnValue(observableOf('ERROR'));
    spyOn(component.toasterService, 'error').and.returnValue(throwError(onboarding_location_test.resourceBundle.messages.emsg.m0021));
    component.handleSubmitButton();
    expect(component.onboardingService.saveLocation).toHaveBeenCalled();
    expect(component.disableContinueBtn).toBeFalsy();
    expect(component.locationSaved.emit).toHaveBeenCalled();
    expect(component.toasterService.error).toHaveBeenCalled();
  });

  it('should show location label obtained from resourceService', () => {
    const value = fixture.debugElement.query(By.css('.swiper-slide__title.p-0.m-0.sb-color-primary')).nativeElement.innerText;
    expect(value).toEqual(onboarding_location_test.resourceBundle.messages.imsg.m0075);
  });

  it('should show location message label obtained from resourceService', () => {
    const value = fixture.debugElement.query(By.css('.swiper-slide__para.pt-8')).nativeElement.innerText;
    expect(value).toEqual(onboarding_location_test.resourceBundle.messages.imsg.m0074);
  });

  it('should call deviceProfile', () => {
    spyOn(component.deviceRegisterService, 'fetchDeviceProfile').and.returnValue(observableOf(onboarding_location_test.deviceLocation));
    spyOn(component.onboardingService, 'searchLocation').and.returnValue(observableOf(onboarding_location_test.districtList));
    component.stateList = onboarding_location_test.statesList.result.response;
    component.getUserCurrentLocation();
    component.deviceRegisterService.fetchDeviceProfile().subscribe(location => {
      expect(component.disableContinueBtn).toBeFalsy();
      expect(location).toEqual(onboarding_location_test.deviceLocation);
      expect(component.onboardingService.searchLocation).toHaveBeenCalled();
    });
  });

  it('should call getLocation  in onboarding service', () => {
    spyOn(component.onboardingService, 'getLocation').and.returnValue(observableOf(onboarding_location_test.location_read_success));
    spyOn(component.locationSaved, 'emit').and.returnValue(observableOf('SUCCESS'));
    component.isLocationSaved();
    expect(component.onboardingService.getLocation).toHaveBeenCalled();
    expect(component.locationSaved.emit).toHaveBeenCalled();
  });

  it('should call getLocation (error) in onboarding service', () => {
    spyOn(component.onboardingService, 'getLocation').and.returnValue(observableOf(onboarding_location_test.location_read_success));
    spyOn(component.locationSaved, 'emit').and.returnValue(observableOf('ERROR'));
    component.isLocationSaved();
    expect(component.onboardingService.getLocation).toHaveBeenCalled();
    expect(component.locationSaved.emit).toHaveBeenCalled();
  });

});
