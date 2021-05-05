import {of as observableOf, of, throwError as observableThrowError} from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { mockUserData } from './../../services/user/user.mock.spec.data';
import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MainHeaderComponent } from './main-header.component';
import {
  ConfigService,
  ResourceService,
  ToasterService,
  SharedModule,
  BrowserCacheTtlService,
  UtilService,
  LayoutService,
  NavigationHelperService
} from '@sunbird/shared';
import {
  UserService,
  LearnerService,
  PermissionService,
  TenantService,
  CoreModule,
  ManagedUserService, CoursesService, ElectronService
} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {AnimationBuilder} from '@angular/animations';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import {CacheService} from 'ng2-cache-service';
import {mockData} from './main-header.component.spec.data';
import {CommonConsumptionModule} from '@project-sunbird/common-consumption-v8';
import { configureTestSuite } from '@sunbird/test-util';

describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;
  let fixture: ComponentFixture<MainHeaderComponent>;
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
        cancel: 'cancel',
        notification: 'Notification',
        newNotification: 'New Notification'
      },
      btn: {
        clear: 'Clear',
        seeMore: 'See more',
        seeLess: 'See less'
      }
    }
  };
  configureTestSuite();
  const MockCSService = {
    getUserFeed() { return of({}); },
    updateUserFeedEntry() { return of({}); },
    deleteUserFeedEntry() { return of({}); }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule,
        TelemetryModule.forRoot(), RouterTestingModule, CommonConsumptionModule],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ToasterService, TenantService, CacheService, BrowserCacheTtlService,
        PermissionService, ManagedUserService, UtilService, LayoutService, NavigationHelperService,
        {provide: ResourceService, useValue: resourceBundle},
        UserService, ConfigService, AnimationBuilder, ElectronService,
        LearnerService, CoursesService, { provide: 'CS_USER_SERVICE', useValue: MockCSService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHeaderComponent);
    component = fixture.componentInstance;
    component.routerEvents  = observableOf({id: 1, url: '/explore', urlAfterRedirects: '/explore'});
  });

  it('should subscribe to user service', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    userService._authenticated = true;
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    fixture.detectChanges();
    expect(component.userProfile).toBeTruthy();
  });

  it('Should subscribe to tenant service and update logo and tenant name', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(observableOf(mockUserData.tenantSuccess));
    service.getTenantInfo('Sunbird');
    component.ngOnInit();
    expect(component.tenantInfo.logo).toEqual(mockUserData.tenantSuccess.result.logo);
    expect(component.tenantInfo.titleName).toEqual(mockUserData.tenantSuccess.result.titleName);
  });

  it('Should not update logo unless tenant service returns it', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    component.ngOnInit();
    expect(component.tenantInfo.logo).toBeUndefined();
    expect(component.tenantInfo.titleName).toBeUndefined();
  });

  it('Should update the logo on initialization', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(observableOf(mockUserData.tenantSuccess));
    service.getTenantInfo('Sunbird');
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img').src).toEqual(mockUserData.tenantSuccess.result.logo);
  });

  it('All query param should be removed except key and language', () => {
    component.queryParam = { 'board': 'NCERT', 'medium': 'English' };
    component.onEnter('test');
    expect(component.queryParam).toEqual({ 'key': 'test' });
  });

  it('should not fetch managed user list as user is not logged in', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    userService._authenticated = false;
    spyOn(learnerService, 'getWithHeaders');
    const managedUserService = TestBed.get(ManagedUserService);
    spyOn(managedUserService, 'fetchManagedUserList');
    component.ngOnInit();
    expect(component.userListToShow).toEqual([]);
    expect(managedUserService.fetchManagedUserList).not.toHaveBeenCalled();
  });

  it('Should call getCacheLanguage if user is not login and cache exits', () => {
    const userService = TestBed.get(UserService);
    const cacheService = TestBed.get(CacheService);
    cacheService.set('portalLanguage', 'hi', { maxAge: 10 * 60 });
    userService._authenticated = false;
    component.ngOnInit();
    expect(cacheService.exists('portalLanguage')).toEqual(true);
  });

  it('Should call getCacheLanguage if user is not login and cache not exits', () => {
    const userService = TestBed.get(UserService);
    const cacheService = TestBed.get(CacheService);
    cacheService.set('portalLanguage', null);
    userService._authenticated = false;
    component.ngOnInit();
    expect(cacheService.exists('portalLanguage')).toEqual(false);
  });

  it('should fetch managed user list on init if user logged in', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const managedUserService = TestBed.get(ManagedUserService);
    userService._authenticated = true;
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockData.userReadApiResponse));
    userService.initialize(true);
    managedUserService.fetchManagedUserList();
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData.userList));
    spyOn(managedUserService, 'processUserList').and.returnValue(mockData.userList);
    component.ngOnInit();
    expect(component.userListToShow).toEqual(mockData.userList);
    expect(component.totalUsersCount).toEqual(1);
  });

  it('should not fetch managed user list on init as api errored', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    userService._authenticated = true;
    const userData = mockData.userReadApiResponse;
    userData.result.response['managedBy'] = 'mock managed by id';
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(userData));
    userService.initialize(true);
    const managedUserService = TestBed.get(ManagedUserService);
    const toasterService = TestBed.get(ToasterService);
    managedUserService.fetchManagedUserList();
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData.userList));
    spyOn(managedUserService, 'getParentProfile').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });

  it('should turn on the side menu', () => {
    component.showSideMenu = false;
    const userService = TestBed.get(UserService);
    userService._authenticated = true;
    spyOn(component, 'fetchManagedUsers');
    component.toggleSideMenu(true);
    expect(component.showSideMenu).toEqual(true);
    expect(component.fetchManagedUsers).toHaveBeenCalled();
  });

  it('should not turn on the side menu', () => {
    component.showSideMenu = true;
    const userService = TestBed.get(UserService);
    spyOn(component, 'fetchManagedUsers');
    userService._authenticated = false;
    component.toggleSideMenu(false);
    expect(component.showSideMenu).toEqual(false);
    expect(component.fetchManagedUsers).not.toHaveBeenCalled();
  });

  xit('should switch selected user', () => {
    const userService = TestBed.get(UserService);
    userService._authenticated = true;
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
    const learnerService = TestBed.get(LearnerService);
    const utilsService = TestBed.get(UtilService);
    const coursesService = TestBed.get(CoursesService);
    spyOn(utilsService, 'redirect').and.callFake(() => {
    });
    spyOn(coursesService, 'getEnrolledCourses').and.returnValue(observableOf({}));
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockData.userReadApiResponse));
    const managedUserService = TestBed.get(ManagedUserService);
    spyOn(telemetryService, 'initialize');
    spyOn(managedUserService, 'initiateSwitchUser').and.returnValue(observableOf(mockData.managedUserList));
    component.switchUser({data: {data: mockData.selectedUser}});
    expect(telemetryService.initialize).toHaveBeenCalled();
  });

  it('should give login redirection path for explore course', () => {
    component.updateHrefPath('/explore-course');
    expect(component.hrefPath).toBe('/learn');
  });

  it('should give login redirection path for explore', () => {
    component.updateHrefPath('/explore');
    expect(component.hrefPath).toBe('/resources');
  });

  it('should give login redirection path for group course', () => {
    component.updateHrefPath('/explore-groups');
    expect(component.hrefPath).toBe('/my-groups');
  });

  it('should give login redirection path for play content', () => {
    component.updateHrefPath('/play');
    expect(component.hrefPath).toBe('/resources/play');
  });

  it('should give login redirection path for default cases', () => {
    component.updateHrefPath('/some_random_url');
    expect(component.hrefPath).toBe('/resources');
  });

  it('should set telemetry data on init', () => {
    spyOn(document, 'getElementById').and.returnValue('true');
    const service = TestBed.get(TenantService);
    spyOn(service, 'get').and.returnValue(observableOf(mockUserData.tenantSuccess));
    service.getTenantInfo('Sunbird');
    component.ngOnInit();
    expect(component.groupsMenuIntractEdata).toEqual({
      id: 'groups-tab', type: 'click', pageid: 'groups'
    });
    expect(component.workspaceMenuIntractEdata).toEqual({
      id: 'workspace-menu-button', type: 'click', pageid: 'workspace'
    });
    expect(component.helpMenuIntractEdata).toEqual({
      id: 'help-menu-tab', type: 'click', pageid: 'help'
    });
  });

  it('should tell is layout is available', () => {
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'isLayoutAvailable').and.returnValue(true);
    const layoutData = component.isLayoutAvailable();
    expect(layoutData).toBe(true);
  });

  it('should make isFullScreenView to FALSE', () => {
    component.isFullScreenView = true;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'contentFullScreenEvent').and.returnValue(observableOf({data: false}));
    component.ngOnInit();
    navigationHelperService.emitFullScreenEvent(false);
    expect(component.isFullScreenView).toBe(false);
  });

  it('should make isFullScreenView to true', () => {
    component.isFullScreenView = false;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'contentFullScreenEvent').and.returnValue(observableOf({data: true}));
    component.ngOnInit();
    navigationHelperService.emitFullScreenEvent(true);
    expect(component.isFullScreenView).toBe(true);
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  it('should switch layout and generate telemetry for classic', () => {
    const layoutService = TestBed.get(LayoutService);
    const telemetryService = TestBed.get(TelemetryService);
    component.layoutConfiguration = null;
    spyOn(layoutService, 'initiateSwitchLayout').and.callFake(() => {
    });
    spyOn(telemetryService, 'interact').and.callFake(() => {
    });
    component.switchLayout();
    expect(telemetryService.interact).toHaveBeenCalledWith(mockData.telemetryEventClassic);
  });

  it('should switch layout and generate telemetry for classic', () => {
    const layoutService = TestBed.get(LayoutService);
    component.layoutConfiguration = null;
    expect(layoutService).toBeTruthy();
  });

  it('should switch layout and generate telemetry for joy', () => {
    const layoutService = TestBed.get(LayoutService);
    const telemetryService = TestBed.get(TelemetryService);
    component.layoutConfiguration = {options: 'option1'};
    spyOn(layoutService, 'initiateSwitchLayout').and.callFake(() => {
    });
    spyOn(telemetryService, 'interact').and.callFake(() => {
    });
    component.switchLayout();
    expect(telemetryService.interact).toHaveBeenCalledWith(mockData.telemetryEventJoy);
  });

  it('should call login method for desktop app', () => {
    const electronService = TestBed.get(ElectronService);
    spyOn(electronService, 'get').and.returnValue(observableOf({status: 'success'}));
    component.doLogin();
    expect(electronService.get).toHaveBeenCalled();
  });

  it('should call getGuestUser for desktop app', () => {
    const userService = TestBed.get(UserService);
    userService._guestUserProfile = { name: 'test' };
    userService._guestData$.next({ userProfile: { name: 'test' } });
    component.getGuestUser();
    expect(component.guestUser).toBeDefined();
  });

  it('should call getGuestUser', () => {
    component.isDesktopApp = true;
    spyOn(Object.getPrototypeOf(localStorage), 'getItem').and.returnValue('{"name":"Guest"}');
    component.getGuestUser();
  });
});
