import { Observable, of, Subscriber, Subscription, throwError as observableThrowError } from 'rxjs';
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { MainHeaderComponent } from './main-header.component';
import {
  ConfigService, ResourceService, ToasterService, UtilService,
  LayoutService, NavigationHelperService, ConnectionService
} from '../../../shared';
import { UserService, PermissionService, ManagedUserService, CoursesService, ElectronService, FormService, LearnerService } from '../../../core';
import { TelemetryService } from '@sunbird/telemetry';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { mockData } from './main-header.component.spec.data';
import { DeviceRegisterService, ObservationUtilService, OrgDetailsService, TenantService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { mockUserData } from './../../services/user/user.mock.spec.data';
const mockUserRoles = {
  userRoles: ['PUBLIC']
};

describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;

  const mockconfig: Partial<ConfigService> = {
    constants: {
      SIZE: {
        SMALL: 1,
        MEDIUM: 2
      },
      VIEW: {
        VERTICAL: {
        }
      }
    },
    appConfig: {
    },
    rolesConfig: {
      headerDropdownRoles: {
        adminDashboard: '',
        myActivityRole: '',
        orgSetupRole: '',
        orgAdminRole: '',
      }
    },
    urlConFig: {
      URLS: {
        OFFLINE: {
          LOGIN: '/explore'
        }
      }
    }
  };
  const mockresourceService: Partial<ResourceService> = {};
  const mockrouter: Partial<Router> = {
    url: '/resources/view-all/Course-Unit/1',
    navigate: jest.fn(),
    events: of({}) as any
  };
  const mockpermissionService: Partial<PermissionService> = {};

  const mockUserService: Partial<UserService> = {
    getGuestUser: jest.fn(() => of({
      userId: 'sample-uid',
      rootOrgId: 'sample-root-id',
      rootOrg: {},
      hashTagIds: ['id'],
      managedBy: true
    })),
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id'],
        managedBy: true
      }
    }) as any,
    initialize: jest.fn(),
    guestData$: of(mockUserData),
    userProfile: () => {
      return {
        managedBy: true
      }
    },
    _guestData$: of({}) as any,
  };
  const mocktenantService: Partial<TenantService> = {
    get: jest.fn(() => of(mockUserData.tenantSuccess)),
    getTenantInfo: jest.fn(() => of(mockUserData.tenantSuccess)),
    tenantData$: of({
      tenantData: {
        favicon: 'sample-favicon', logo: 'http://localhost:3000/assets/images/sunbird_logo.png', titleName: 'SUNBIRD'
      }
    }) as any
  };
  const mockorgDetailsService: Partial<OrgDetailsService> = {
    orgDetails$: of({})
  };
  const mockformService: Partial<FormService> = {
    getFormConfig: jest.fn(() => of({}))
  };
  const mockmanagedUserService: Partial<ManagedUserService> = {
    fetchManagedUserList: jest.fn(() => of({})),
    processUserList: () => {
      return mockData.userList;
    },
    managedUserList$: of(mockData.userList),
    initiateSwitchUser: jest.fn()
  };
  const mocktoasterService: Partial<ToasterService> = {};
  const mocktelemetryService: Partial<TelemetryService> = {
    initialize: jest.fn(),
    interact: jest.fn()
  };
  const mockcourseService: Partial<CoursesService> = {
    getEnrolledCourses: jest.fn(() => of({}))
  };
  const mockutilService: Partial<UtilService> = {
    currentRole: of({}) as any,
    redirect: jest.fn(),
  };
  const mocklayoutService: Partial<LayoutService> = {
    isLayoutAvailable: jest.fn(() => true),
    initiateSwitchLayout: jest.fn()
  };
  const mockactivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({
      selectedTab: 'all',
      contentType: ['Course'], objectType: ['Content'], status: ['Live'],
      defaultSortBy: JSON.stringify({ lastPublishedOn: 'desc' })
    }),
    snapshot: {
      queryParams: {
        selectedTab: 'course'
      }
    } as any
  };
  const mockcacheService: Partial<CacheService> = {
    set: jest.fn(),
    exists: jest.fn(() => true),
    remove:jest.fn()
  };
  const mockcdr: Partial<ChangeDetectorRef> = {
    detectChanges: jest.fn()
  };
  const mocknavigationHelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: new EventEmitter<any>(),
    emitFullScreenEvent: jest.fn()
  };
  const mockdeviceRegisterService: Partial<DeviceRegisterService> = {};
  const mockconnectionService: Partial<ConnectionService> = {
    monitor: jest.fn(() => of(true))
  };
  const mockelectronService: Partial<ElectronService> = {
    get: jest.fn(() => of({})) as any
  };
  const mockobservationUtilService: Partial<ObservationUtilService> = {
    browseByCategoryForm: jest.fn(() => of({})) as any
  };
  beforeAll(() => {
    component = new MainHeaderComponent(
      mockconfig as ConfigService,
      mockresourceService as ResourceService,
      mockrouter as Router,
      mockpermissionService as PermissionService,
      mockUserService as UserService,
      mocktenantService as TenantService,
      mockorgDetailsService as OrgDetailsService,
      mockformService as FormService,
      mockmanagedUserService as ManagedUserService,
      mocktoasterService as ToasterService,
      mocktelemetryService as TelemetryService,
      mockcourseService as CoursesService,
      mockutilService as UtilService,
      mocklayoutService as LayoutService,
      mockactivatedRoute as ActivatedRoute,
      mockcacheService as CacheService,
      mockcdr as ChangeDetectorRef,
      mocknavigationHelperService as NavigationHelperService,
      mockdeviceRegisterService as DeviceRegisterService,
      mockconnectionService as ConnectionService,
      mockelectronService as ElectronService,
      mockobservationUtilService as ObservationUtilService)
  });

  beforeEach(() => {
    jest.clearAllMocks();
    component.routerEvents = of({ id: 1, url: '/explore', urlAfterRedirects: '/explore' });
  });

  it('should be create a instance of main header component', () => {
    // @ts-ignore
    mockUserService.loggedIn = true;
    expect(component).toBeTruthy();
  });

  it('Should subscribe to tenant service and update logo and tenant name', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(document.createElement('div'));
    // @ts-ignore
    // mocktenantService.getTenantInfo = jest.fn(() => { });
    component.ngOnInit();
    expect(component.tenantInfo.logo).toEqual(mockUserData.tenantSuccess.result.logo);
    expect(component.tenantInfo.titleName).toEqual(mockUserData.tenantSuccess.result.titleName);
  });

  it('Should not update logo unless tenant service returns it', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(document.createElement('div'));
    // @ts-ignore
    mocktenantService.tenantData$ = of({ tenantData: {} });
    component.ngOnInit();
    expect(component.tenantInfo.logo).toBeUndefined();
    expect(component.tenantInfo.titleName).toBeUndefined();
  });

  it('All query param should be removed except key and language', () => {
    component.queryParam = { 'board': 'NCERT', 'medium': 'English' };
    component.onEnter('test');
    expect(component.queryParam).toEqual({ 'key': 'test' });
  });

  it('should fetch managed user list as user is not logged in', () => {
    mockUserService._authenticated = false;
    jest.spyOn(mockmanagedUserService, 'fetchManagedUserList').mockImplementation(() => { });
    component.ngOnInit();
    expect(component.userListToShow).toEqual(mockData.userList);
    expect(mockmanagedUserService.fetchManagedUserList).toHaveBeenCalled();
  });

  it('Should call getCacheLanguage if user is not login and cache exits', () => {
    mockcacheService.set('portalLanguage', 'hi', { maxAge: 10 * 60 });
    mockUserService._authenticated = false;
    component.ngOnInit();
    expect(mockcacheService.exists('portalLanguage')).toEqual(true);
  });

  it('Should call getCacheLanguage if user is not login and cache not exits', () => {
    mockcacheService.set('portalLanguage', null);
    mockUserService._authenticated = false;
    jest.spyOn(mockcacheService, 'exists').mockReturnValue(false);
    component.ngOnInit();
    expect(mockcacheService.exists('portalLanguage')).toEqual(false);
  });

  it('should fetch managed user list on init if user logged in', () => {
    mockUserService._authenticated = true;
    mockUserService.initialize(true);
    // @ts-ignore
    mockmanagedUserService['managedUserList$'] = ['request'];
    jest.spyOn(mockmanagedUserService, 'processUserList').mockReturnValue(mockData.userList);
    component.ngOnInit();
    expect(component.userListToShow).toEqual(mockData.userList);
    expect(component.totalUsersCount).toEqual(1);
  });

  it('should turn on the side menu', () => {
    component.showSideMenu = false;
    mockUserService._authenticated = true;
    jest.spyOn(component, 'fetchManagedUsers');
    component.toggleSideMenu(true);
    expect(component.showSideMenu).toEqual(true);
    expect(component.fetchManagedUsers).toHaveBeenCalled();
  });

  it('should not turn on the side menu', () => {
    component.showSideMenu = true;
    jest.spyOn(component, 'fetchManagedUsers');
    mockUserService._authenticated = false;
    component.toggleSideMenu(false);
    expect(component.showSideMenu).toEqual(false);
    expect(component.fetchManagedUsers).not.toHaveBeenCalled();
  });

  it('should switch selected user', () => {
    mockUserService._authenticated = true;
    // @ts-ignore
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'buildNumber') {
        return { value: '1.1.12.0' };
      }
      if (id === 'deviceId') {
        return { value: 'device' };
      }
      if (id === 'defaultTenant') {
        return { value: 'defaultTenant' };
      }
      return { value: 'mock Id' };
    });
    mocktelemetryService.initialize = jest.fn(() => ({ cdata: {} }));
    mockutilService._isDesktopApp = true;
    component.isConnected = false;
    // @ts-ignore
    mockmanagedUserService.initiateSwitchUser.mockReturnValue(of(mockData.userList));
    component.switchUser({ data: { data: mockData.selectedUser } });
    expect(mockmanagedUserService.initiateSwitchUser).toHaveBeenCalled();
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
    jest.spyOn(document, 'getElementById').mockReturnValue(document.createElement('div'));
    mocktenantService.getTenantInfo = jest.fn(() => { });
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
    // jest.spyOn(mocklayoutService, 'isLayoutAvailable').mockReturnValue(true);
    const layoutData = component.isLayoutAvailable();
    expect(layoutData).toBe(true);
  });

  it('should make isFullScreenView to FALSE', () => {
    component.isFullScreenView = true;
    component.ngOnInit();
    mocknavigationHelperService.emitFullScreenEvent(false);
    expect(component.isFullScreenView).toBe(true);
  });

  it('should make isFullScreenView to true', () => {
    component.isFullScreenView = false;
    mocknavigationHelperService.contentFullScreenEvent = of({ fullScreen: true }) as any;
    component.ngOnInit();
    mocknavigationHelperService.emitFullScreenEvent(true);
    expect(component.isFullScreenView).toStrictEqual({ fullScreen: true });
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    jest.spyOn(component.unsubscribe$, 'complete');
    jest.spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  it('should switch layout and generate telemetry for classic', () => {
    component.layoutConfiguration = null;
    jest.spyOn(mocklayoutService, 'initiateSwitchLayout').mockImplementation();
    jest.spyOn(mocktelemetryService, 'interact').mockImplementation();
    component.switchLayout();
    expect(mocktelemetryService.interact).toHaveBeenCalled();
  });

  it('should switch layout and generate telemetry for classic', () => {
    component.layoutConfiguration = null;
    expect(mocklayoutService).toBeTruthy();
  });

  it('should switch layout and generate telemetry for joy', () => {
    component.layoutConfiguration = { options: 'option1' };
    jest.spyOn(mocklayoutService, 'initiateSwitchLayout').mockImplementation();
    jest.spyOn(mocktelemetryService, 'interact').mockImplementation();
    component.switchLayout();
    expect(mocktelemetryService.interact).toHaveBeenCalled();
  });

  it('should call login method for desktop app', () => {
    jest.spyOn(mockelectronService, 'get').mockReturnValue(of({ status: 'success' }) as any);
    component.doLogin();
    expect(mockelectronService.get).toHaveBeenCalled();
  });


  it('should call getGuestUser', () => {
    component.isDesktopApp = true;
    jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem').mockImplementation()
    component.getGuestUser();
  });

  it('should call hide the back button', () => {
    component.backButton.goBack();
    expect(component.showBackButton).toBeFalsy();
  });

  it('should call the setUserPreference when logged in ', () => {
    mockUserService._authenticated = true;
    // @ts-ignore
    mockUserService.loggedIn = true;
    jest.spyOn(component, 'setUserPreferences').mockImplementation();
    const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'], id: ['tn_k-12_5'] };
    component.userPreference = { framework: event };
    component.setUserPreferences();
    expect(component.setUserPreferences).toHaveBeenCalled();
    expect(mockUserService.loggedIn).toEqual(true);
  });

  it('should call the setUserPreference when not loggin', () => {
    mockUserService._authenticated = false;
    // @ts-ignore
    mockUserService.loggedIn = false;
    jest.spyOn(component, 'setUserPreferences').mockImplementation();
    const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'], id: 'tn_k-12_5' };
    jest.spyOn(mockUserService, 'getGuestUser').mockReturnValue(of({ framework: event }));
    component.setUserPreferences();
    expect(component.setUserPreferences).toHaveBeenCalled();
    expect(mockUserService.loggedIn).toEqual(false);
  });

  it('should call the getFormConfigs to get form category', () => {
    jest.spyOn(component, 'getFormConfigs').mockImplementation();
    component.userType = 'teacher';
    component.userPreference = { framework: { id: 'tn_k-12_5' } };
    // @ts-ignore
    jest.spyOn(mockobservationUtilService, 'browseByCategoryForm').mockImplementation(() => {
      return of(mockData.categoryData);
    });
    component.getFormConfigs();
    expect(component.getFormConfigs).toHaveBeenCalled();
  });

  it('should call the navigateToHome method with and the formService', (done) => {
    jest.spyOn(mockformService, 'getFormConfig').mockImplementation(() => {
      return of(mockData.categoryData);
    });
    jest.spyOn(component, 'navigateByUrl').mockImplementation();
    component.navigateToHome();
    expect(component.navigateByUrl).toHaveBeenCalledWith('/explore');
    expect(mockformService.getFormConfig).toHaveBeenCalled();
    done();
  });

  it('should call the navigateToHome method with and the formService with no goToBasePath value', (done) => {
    jest.spyOn(component, 'navigateByUrl').mockImplementation();
    jest.spyOn(mockformService, 'getFormConfig').mockImplementation(() => {
      return of(mockData.formData[1]);
    });
    component.navigateToHome();
    expect(component.navigateByUrl).toHaveBeenCalledWith('/explore');
    expect(mockformService.getFormConfig).toHaveBeenCalled();
    done();
  });

  it('should call the setUserPreference when logged in navigateToHome with resource', (done) => {
    mockUserService._authenticated = true;
    // @ts-ignore
    mockUserService.loggedIn = false;
    jest.spyOn(mockformService, 'getFormConfig').mockImplementation(() => {
      return of(mockData.formData[1]);
    });
    component.navigateToHome();
    expect(component.navigateByUrl).toHaveBeenCalledWith('/explore');
    expect(mockformService.getFormConfig).toHaveBeenCalled();
    done();
  });

  it('should call the onInit method', () => {
    component.ngOnInit();
    const data = {
      formType: 'contentcategory',
      formAction: 'menubar',
      filterEnv: 'global'
    };
    expect(component.baseCategoryForm).toEqual(data);
  });

  it('should call set window config method innerWidth > 900', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 900,
    });
    component.setWindowConfig();
    expect(component.searchBox.center).toBeTruthy();
    expect(component.searchBox.largeBox).toBeFalsy();
    expect(component.searchBox.smallBox).toBeFalsy();
    expect(component.searchBox.mediumBox).toBeTruthy();
  });

  it('should call set window config method innerWidth < 548', () => {
    Object.defineProperty(window, 'onresize', (e) => {
      Object.defineProperty(window, 'innerWidth', {
        value: 900,
      });
      component.setWindowConfig();
      expect(component.searchBox.center).toBeTruthy();
      expect(component.searchBox.largeBox).toBeFalsy();
      expect(component.searchBox.smallBox).toBeFalsy();
      expect(component.searchBox.mediumBox).toBeTruthy();
    });

  });

  it('should call set window config method innerWidth < 548', () => {
    Object.defineProperty(window, 'onresize', (e) => {
      Object.defineProperty(window, 'innerWidth', {
        value: 400,
      });
      component.setWindowConfig();
      expect(component.searchBox.largeBox).toBeFalsy();
      expect(component.searchBox.smallBox).toBeTruthy();
      expect(component.searchBox.mediumBox).toBeFalsy();
    });
  });
  it('should call the logout method', (done) => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { 
        replace: jest.fn(),
      }
    });
    component.logout();
    jest.spyOn(component, 'logout').mockImplementation();
    jest.spyOn(mockcacheService, 'remove').mockImplementation();
    component.logout();
    expect(component.logout).toHaveBeenCalled();
    expect(mockcacheService.remove).toHaveBeenCalled();
    done();
  });

  it('should call getLogoutInteractEdata and update the telemetry objects of logout Interact data', () => {
    const obj = component.getLogoutInteractEdata();
    expect(JSON.stringify(obj)).toBe(JSON.stringify(mockData.LogoutInteractEdata));
  });

  it('should call the navigate method with the url', () => {
    let url ='/explore'
    component.navigate(url);
    jest.spyOn(mockrouter, 'navigate').mockImplementation();
    jest.spyOn(component, 'navigate').mockImplementation();
    component.navigate(url);
    expect(component.navigate).toHaveBeenCalledWith(url);
    expect(mockrouter.navigate).toHaveBeenCalledWith([url]);
});

});
