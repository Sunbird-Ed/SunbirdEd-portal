import {of as observableOf, throwError as observableThrowError} from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { mockUserData } from './../../services/user/user.mock.spec.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MainHeaderComponent } from './main-header.component';
import { ConfigService, ResourceService, ToasterService, SharedModule, BrowserCacheTtlService } from '@sunbird/shared';
import {
  UserService,
  LearnerService,
  PermissionService,
  TenantService,
  CoreModule,
  ManagedUserService
} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {AnimationBuilder} from '@angular/animations';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import {CacheService} from 'ng2-cache-service';
import {mockData} from './main-header.component.spec.data';
import {CommonConsumptionModule} from '@project-sunbird/common-consumption';

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
        cancel: 'cancel'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule,
        TelemetryModule.forRoot(), RouterTestingModule, CommonConsumptionModule],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ToasterService, TenantService, CacheService, BrowserCacheTtlService,
        PermissionService, ManagedUserService,
        {provide: ResourceService, useValue: resourceBundle},
        UserService, ConfigService, AnimationBuilder,
        LearnerService]
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
    spyOn(managedUserService, 'fetchManagedUserList').and.returnValue(observableOf(mockData.managedUserList));
    spyOn(managedUserService, 'processUserList').and.returnValue(mockData.userList);
    component.ngOnInit();
    expect(component.userListToShow).toEqual(mockData.userList);
    expect(component.totalUsersCount).toEqual(-1);
  });

  it('should not fetch managed user list as user is not logged in', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    userService._authenticated = false;
    spyOn(learnerService, 'getWithHeaders')
    const managedUserService = TestBed.get(ManagedUserService);
    spyOn(managedUserService, 'fetchManagedUserList');
    component.ngOnInit();
    expect(component.userListToShow).toEqual([]);
    expect(managedUserService.fetchManagedUserList).not.toHaveBeenCalled();
  });

  it('should not fetch managed user list on init as api errored', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    userService._authenticated = true;
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockData.userReadApiResponse));
    userService.initialize(true);
    const managedUserService = TestBed.get(ManagedUserService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(managedUserService, 'fetchManagedUserList').and.returnValue(observableThrowError(mockData.apiErrorResponse));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });

  it('should switch selected user', () => {
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
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockData.userReadApiResponse));
    const managedUserService = TestBed.get(ManagedUserService);
    spyOn(telemetryService, 'initialize');
    spyOn(userService, 'initialize');
    spyOn(managedUserService, 'initiateSwitchUser').and.returnValue(observableOf(mockData.managedUserList));
    component.switchUser({data: {data: mockData.selectedUser}});
    expect(userService.initialize).toHaveBeenCalled();
  });

  it('should turn on the side menu', () => {
    component.toggleSideMenu(true);
    expect(component.showSideMenu).toEqual(true);
  });

  it('should not turn on the side menu', () => {
    component.toggleSideMenu(false);
    expect(component.showSideMenu).toEqual(false);
  });

  it('Should subscribe manageduser event when new managed user is created', () => {
    const userService = TestBed.get(UserService);
    userService._authenticated = true;
    userService._userData$.next({ err: null, userProfile: mockData.userProfile });
    spyOn(component, 'fetchManagedUsers')
    spyOn(userService, 'createManagedUser').and.returnValue(observableOf('1234'));
    component.ngOnInit();
    expect(component.fetchManagedUsers).toHaveBeenCalled();
  });



});
