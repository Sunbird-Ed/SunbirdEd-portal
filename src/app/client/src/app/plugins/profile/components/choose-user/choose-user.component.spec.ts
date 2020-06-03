import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoreModule, UserService, ManagedUserService, LearnerService, CoursesService} from '@sunbird/core';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import {
  ResourceService, SharedModule, ConfigService,
  ToasterService, NavigationHelperService
} from '@sunbird/shared';
import {ChooseUserComponent} from './choose-user.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {of as observableOf, of, throwError as observableThrowError} from 'rxjs';
import {mockData} from './choose-user.component.spec.data';
import {CommonConsumptionModule} from '@project-sunbird/common-consumption';

describe('ChooseUserComponent', () => {
  let component: ChooseUserComponent;
  let fixture: ComponentFixture<ChooseUserComponent>;
  const resourceBundle = {
    messages: {
      imsg: {
        m0095: 'Now using {instance} as {userName} You can update your preferences from the page'
      },
      emsg: {
        m0005: 'Something went wrong, try later'
      },
      smsg: {
        'm0046': 'Profile updated successfully'
      }
    },
    frmelmnts: {
      lbl: {
        useInstanceAs: 'user {instance}',
        addUser: 'Add user',
        switchUser: 'switchUser',
        cancel: 'cancel'
      }
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: {
          env: 'env', pageid: 'choose-managed-user', type: 'view', subtype: 'paginate',
          uri: '/profile/choose-managed-user',
        }
      }
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, TelemetryModule, HttpClientTestingModule, SharedModule.forRoot(),
        CommonConsumptionModule],
      declarations: [ChooseUserComponent],
      providers: [{
        provide: ResourceService,
        useValue: resourceBundle
      }, UserService, ManagedUserService, LearnerService, TelemetryService, NavigationHelperService,
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub},
        ToasterService, ConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch managed user list on init', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockData.userReadApiResponse));
    userService.initialize(true);
    const managedUserService = TestBed.get(ManagedUserService);
    spyOn(managedUserService, 'fetchManagedUserList').and.returnValue(observableOf(mockData.managedUserList));
    spyOn(managedUserService, 'getUserId').and.returnValue('id');
    spyOn(managedUserService, 'processUserList').and.returnValue(mockData.userList);
    component.ngOnInit();
    expect(component.userList).toEqual(mockData.userList);
  });

  it('should not fetch managed user list on init', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockData.userReadApiResponse));
    userService.initialize(true);
    const managedUserService = TestBed.get(ManagedUserService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(managedUserService, 'fetchManagedUserList').and.returnValue(observableThrowError(mockData.apiErrorResponse));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });

  it('should select user', () => {
    component.userList = [mockData.selectUserData.data.data];
    component.selectUser(mockData.selectUserData);
    expect(component.userList).toEqual(mockData.selectedUserList);
  });

  it('should switch selected user', () => {
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(document, 'getElementById').and.callFake((id) => {
      if (id === 'buildNumber') {
        return {value: '1.1.12.0'};
      }
      if (id === 'deviceId') {
        return {value: 'device'};
      }
      if (id === 'defaultTenant') {
        return {value: 'defaultTenant'};
      }
      return {value: 'mock Id'};
    });
    const coursesService = TestBed.get(CoursesService);
    spyOn(coursesService, 'getEnrolledCourses').and.returnValue(observableOf({}));
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockData.userProfile));
    const managedUserService = TestBed.get(ManagedUserService);
    spyOn(telemetryService, 'initialize');
    spyOn(userService, 'initialize');
    spyOn(managedUserService, 'initiateSwitchUser').and.returnValue(observableOf(mockData.managedUserList));
    component.selectedUser = mockData.selectedUser;
    component.switchUser();
    expect(userService.initialize).toHaveBeenCalled();
  });

  it('should navigate', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'navigateToPreviousUrl').and.callThrough();
    component.closeSwitchUser();
    expect(navigationHelperService.navigateToPreviousUrl).toHaveBeenCalledWith('/profile');
  });

});
