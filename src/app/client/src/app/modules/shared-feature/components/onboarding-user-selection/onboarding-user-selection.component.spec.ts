import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingUserSelectionComponent } from './onboarding-user-selection.component';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';
import { mockData } from './onboarding-user-selection.component.spec.data';
import { ProfileService } from '@sunbird/profile';
import { from, of } from 'rxjs';
import { UserService } from '@sunbird/core';

describe('OnboardingUserSelectionComponent', () => {
  let component: OnboardingUserSelectionComponent;
  let fixture: ComponentFixture<OnboardingUserSelectionComponent>;

  const resourceMockData = {
    frmelmnts: {
      lbl: {
        teacher: 'Teacher',
        student: 'Student',
        other: 'Other'
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingUserSelectionComponent],
      imports: [
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ResourceService, useValue: resourceMockData }, {provide: APP_BASE_HREF, useValue: 'test'}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingUserSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'setPopupInteractEdata');
    component.ngOnInit();
    expect(component.setPopupInteractEdata).toHaveBeenCalled();
    expect(component.selectedUserType).toEqual(undefined);
  });

  it('should call selectUserType', () => {
    component.guestList = component['prepareGuestList'](mockData.formData);
    component.selectUserType(component.guestList[0]);
    expect(component.selectedUserType).toBe(component.guestList[0]);
    expect(component.guestList[0].isActive).toBeTruthy();
    expect(component.guestList[1].isActive).toBeFalsy();
  });

  it('should call submit', () => {
    component.guestList = component['prepareGuestList'](mockData.formData);
    component.selectedUserType = component.guestList[1];
    spyOn(localStorage, 'setItem');
    spyOn(component.userSelect, 'emit');
    component.submit();
    expect(localStorage.setItem).toHaveBeenCalledWith('userType', 'student');
    expect(component.userSelect.emit).toHaveBeenCalledWith(true);
  });

  it('should update the userType selection in the user profile if user is logged in ', done => {
    const userService = TestBed.get(UserService);
    const profileService = TestBed.get(ProfileService);
    component.guestList = component['prepareGuestList'](mockData.formData);
    component.selectedUserType = component.guestList[1];
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    spyOnProperty(userService, 'userid', 'get').and.returnValue('123');
    const userSelectSpy = spyOn(component.userSelect, 'emit');
    const spy = spyOn(profileService, 'updateProfile').and.callFake(() => {
      setTimeout(() => {
        userService['_userData$'].next({});
      });
      return of({});
    });
    component['updateUserSelection']().subscribe(res => {
      expect(spy).toHaveBeenCalledWith({
        userId: '123',
        profileUserType: { type: 'student' }
      });
      expect(userSelectSpy).toHaveBeenCalled();
      done();
    }, err => {
      done();
    });

    component.submit();
  });

});
