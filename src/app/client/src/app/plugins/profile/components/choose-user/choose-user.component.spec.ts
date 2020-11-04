import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoreModule, UserService, ManagedUserService, LearnerService, CoursesService} from '@sunbird/core';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import {
  ResourceService, SharedModule, ConfigService,
  ToasterService, NavigationHelperService, UtilService
} from '@sunbird/shared';
import {ChooseUserComponent} from './choose-user.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {of as observableOf, of, throwError as observableThrowError} from 'rxjs';
import {mockData} from './choose-user.component.spec.data';
import {CommonConsumptionModule} from '@project-sunbird/common-consumption';
import { configureTestSuite } from '@sunbird/test-util';

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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, TelemetryModule, HttpClientTestingModule, SharedModule.forRoot(),
        CommonConsumptionModule],
      declarations: [ChooseUserComponent],
      providers: [{
        provide: ResourceService,
        useValue: resourceBundle
      }, UserService, ManagedUserService, LearnerService, TelemetryService, NavigationHelperService,
        {provide: Router, useClass: RouterStub}, UtilService,
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
    const managedUserService = TestBed.get(ManagedUserService);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'setNavigationUrl');
    const userData = mockData.userReadApiResponse;
    userService._authenticated = true;
    userData.result.response['managedBy'] = 'mock managed by id';
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(userData));
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData.managedUserList));
    spyOn(managedUserService, 'getUserId').and.returnValue('id');
    spyOn(managedUserService, 'processUserList').and.returnValue(mockData.userList);
    userService.initialize(true);
    managedUserService.fetchManagedUserList();
    component.ngOnInit();
    expect(component.userList).toEqual(mockData.userList);
    expect(navigationHelperService.setNavigationUrl).toHaveBeenCalled();
  });

  it('should not fetch managed user list on init', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const managedUserService = TestBed.get(ManagedUserService);
    const toasterService = TestBed.get(ToasterService);
    const userData = mockData.userReadApiResponse;
    userService._authenticated = true;
    userData.result.response['managedBy'] = 'mock managed by id';
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(userData));
    userService.initialize(true);
    managedUserService.fetchManagedUserList();
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData.userList));
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(managedUserService, 'getParentProfile').and.returnValue(observableThrowError({}));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });

  it('should select user', () => {
    component.userList = [mockData.selectUserData.data.data];
    component.selectUser(mockData.selectUserData);
    expect(component.selectedUser).toEqual(mockData.selectUserData.data.data);
    expect(component.userList).toEqual(mockData.selectedUserList);
  });

  it('should de select user if already selected', () => {
    component.userList = [mockData.selectUserData.data.data];
    const mockEventData = mockData.selectUserData;
    mockEventData.data.data.selected = true;
    component.selectUser(mockEventData);
    expect(component.selectedUser).toEqual(null);
    expect(component.userList).toEqual(mockData.notSelectedUserList);
  });

  it('should navigate', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'navigateToLastUrl');
    component.closeSwitchUser();
    expect(navigationHelperService.navigateToLastUrl).toHaveBeenCalled();
  });

  it('should switch selected user', () => {
    component.selectedUser = mockData.selectedUser;
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
    const utilService = TestBed.get(UtilService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf({
        result: {response: mockData.userProfile}
      }
    ));
    const managedUserService = TestBed.get(ManagedUserService);
    spyOn(telemetryService, 'initialize');
    spyOn(utilService, 'redirect').and.callFake(() => {
    });
    spyOn(managedUserService, 'initiateSwitchUser').and.returnValue(observableOf(mockData.managedUserList));
    const switchUserRequest = {
      userId: mockData.selectedUser.identifier,
      isManagedUser: mockData.selectedUser.managedBy ? true : false
    };
    component.switchUser();
    expect(managedUserService.initiateSwitchUser).toHaveBeenCalledWith(switchUserRequest);
  });

  it('should route to create-managed user', () => {
    component.navigateToCreateUser();
    expect(component.router.navigate).toHaveBeenCalledWith(['/profile/create-managed-user']);
  });

  it('should unsubscribe', () => {
    spyOn(component['userDataSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['userDataSubscription'].unsubscribe).toHaveBeenCalled();
  });

});
