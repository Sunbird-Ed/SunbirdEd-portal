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
  it('should get getUserDate', () => {
    spyOn(component.userService, 'getUser').and.returnValue(of(user_profile_Data.locationData));
    component.ngOnInit();
    expect(component.userData).toBeDefined();
  });

  it('should handle openModal while calling LOCATION component', () => {
    spyOn(component, 'openModal').and.returnValue(of('LOCATION'));
    component.selectedComponent = 'LOCATION';
    component.openModal(component.selectedComponent);
    expect(component.selectedComponent).toBeDefined();
  });

  it('should handle openModal while calling CONTENTPREFERENCE component', () => {
    spyOn(component, 'openModal').and.returnValue(of('CONTENTPREFERENCE'));
    component.selectedComponent = 'CONTENTPREFERENCE';
    component.openModal(component.selectedComponent);
    expect(component.openModal).toHaveBeenCalled();
    expect(component.selectedComponent).toBeDefined();
  });

  it('should handle success DismissEvent', () => {
    spyOn(component, 'handleDismissEvent').and.returnValue(of('SUCCESS'));
    component.selectedComponent = '';
    component.handleDismissEvent(component.selectedComponent);
    expect(component.selectedComponent).toBeDefined();
    spyOn(component, 'getUserData');

  });
  it('should handle error DismissEvent', () => {
    spyOn(component, 'handleDismissEvent').and.returnValue(of(''));
    component.selectedComponent = '';
    component.handleDismissEvent(component.selectedComponent);
    expect(component.selectedComponent).toBeDefined();

  });

  it('should open your location modal when you click edit(edit location)', () => {
    spyOn(component, 'openModal').and.returnValue(of('LOCATION'));
    const openModal: DebugElement = fixture.debugElement;
    const buttonQuerySelector = openModal.query(By.css('button.location_button'));
    const button: HTMLElement = buttonQuerySelector.nativeElement;
    button.click();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      component.selectedComponent = 'LOCATION';
      component.openModal(component.selectedComponent);
      expect(component.selectedComponent).toBeDefined();
    });
  });
  it('should open your location modal when you click edit(edit content preferences)', () => {
    spyOn(component, 'openModal').and.returnValue(of('CONTENTPREFERENCE'));
    const openModal: DebugElement = fixture.debugElement;
    const buttonQuerySelector = openModal.query(By.css('button.button_content_preferences'));
    const button: HTMLElement = buttonQuerySelector.nativeElement;
    button.click();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      component.selectedComponent = 'CONTENTPREFERENCE';
      component.openModal(component.selectedComponent);
      expect(component.selectedComponent).toBeDefined();
    });
  });
});
