import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePageComponent } from './profile-page.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SuiModalModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import {  ReactiveFormsModule } from '@angular/forms';
import { OnboardingService } from '../../../offline/services';
import {user_profile_Data} from './profile-page.component.spec.data';
import { By } from '@angular/platform-browser';
describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
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
      imports: [SuiModalModule, HttpClientTestingModule, TelemetryModule.forRoot(), ReactiveFormsModule, SharedModule.forRoot()],
      declarations: [ ProfilePageComponent],
      providers: [ { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        OnboardingService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get getUserData', () => {
    spyOn(component.userService, 'getUser').and.returnValue(of(user_profile_Data.locationData));
    component.ngOnInit();
    const service: OnboardingService = TestBed.get(OnboardingService);
    service.getUser().subscribe(data => {
      expect(data).toBe(user_profile_Data.locationData);
      expect(component.userData).toHaveBeenCalledWith(user_profile_Data.locationData);
    });
  });
  it('should handle openModal method while calling LOCATION component', () => {
    spyOn(component, 'setLocationTelemetryData');
    component.selectedComponent = user_profile_Data.LOCATION;
    expect(component.openModal).toHaveBeenCalledWith();
    component.openModal(user_profile_Data.LOCATION);
    expect(component.selectedComponent).toEqual(user_profile_Data.LOCATION);
    expect(component.selectedComponent).toBeDefined();
    component.setLocationTelemetryData();
  });
  it('should handle openModal method while calling CONTENTPREFERENCE component', () => {
    component.selectedComponent = user_profile_Data.CONTENTPREFERENCE;
    expect(component.openModal).toHaveBeenCalled();
    component.openModal(user_profile_Data.CONTENTPREFERENCE);
    expect(component.selectedComponent).toEqual(user_profile_Data.CONTENTPREFERENCE);
    expect(component.selectedComponent).toBeDefined();
    spyOn(component, 'setContentTelemetryData').and.callThrough();
    component.setContentTelemetryData();
  });
  it('should handle success DismissEvent', () => {
    component.handleDismissEvent(user_profile_Data.SUCCESS);
    expect(component.selectedComponent).toEqual('');
    expect(component.userData).toEqual(user_profile_Data.SUCCESS);
  });
  it('should handle error DismissEvent', () => {
    component.handleDismissEvent('');
    expect(component.selectedComponent).toEqual('');
    expect(component.selectedComponent).toBeDefined();
  });
  it('should open your location modal when you click edit(edit location)', () => {
    const openModal: DebugElement = fixture.debugElement;
    const buttonQuerySelector = openModal.query(By.css('button.location_button'));
    const button: HTMLElement = buttonQuerySelector.nativeElement;
    button.click();
    spyOn(component, 'setLocationTelemetryData').and.callThrough();
    component.setLocationTelemetryData();
    fixture.whenStable().then(() => {
      component.selectedComponent = user_profile_Data.LOCATION;
      component.openModal(user_profile_Data.LOCATION);
      expect(component.selectedComponent).toEqual(user_profile_Data.LOCATION);
      expect(component.selectedComponent).toBeDefined();
    });
  });
  it('should open your content update modal when you click edit(edit content preferences)', () => {
    const openModal: DebugElement = fixture.debugElement;
    const buttonQuerySelector = openModal.query(By.css('button.button_content_preferences'));
    const button: HTMLElement = buttonQuerySelector.nativeElement;
    button.click();
    spyOn(component, 'setContentTelemetryData').and.callThrough();
    component.setContentTelemetryData();
    fixture.whenStable().then(() => {
    component.selectedComponent = user_profile_Data.CONTENTPREFERENCE;
      component.openModal(user_profile_Data.CONTENTPREFERENCE);
      expect(component.selectedComponent).toEqual(user_profile_Data.CONTENTPREFERENCE);
      expect(component.selectedComponent).toBeDefined();
    });
  });
});
