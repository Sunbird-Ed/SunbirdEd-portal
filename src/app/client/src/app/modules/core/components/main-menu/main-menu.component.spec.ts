import { MainMenuComponent } from './main-menu.component';
import {
  ConfigService, ResourceService, ToasterService, UtilService,
  LayoutService, NavigationHelperService, ConnectionService
} from '../../../shared';
import { Observable, of, Subscriber, Subscription, throwError as observableThrowError } from 'rxjs';
import { UserService, PermissionService, ManagedUserService, CoursesService, ElectronService, FormService, LearnerService } from '../../../core';
import { mockUserData } from './../../services/user/user.mock.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { TelemetryService } from '@sunbird/telemetry';
import { mockData } from './main-menu.component.spec.data';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  const mockconfig: Partial<ConfigService> = {
    constants: {
      SIZE: {
        SMALL: 1
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
  const mockutilService: Partial<UtilService> = {
    currentRole: of({}) as any,
    redirect: jest.fn(),
    isDesktopApp: true,
  };
  const mockresourceService: Partial<ResourceService> = {};
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
  const mockrouter: Partial<Router> = {
    url: '/resources/view-all/Course-Unit/1',
    navigate: jest.fn(),
    events: of({}) as any
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
    removeAll: jest.fn(() => true)
  };
  const mocktelemetryService: Partial<TelemetryService> = {
    initialize: jest.fn(),
    interact: jest.fn()
  };
  const mocklayoutService: Partial<LayoutService> = {
    isLayoutAvailable: jest.fn(() => true),
    initiateSwitchLayout: jest.fn()
  };
  const mockpermissionService: Partial<PermissionService> = {
    getWorkspaceAuthRoles: jest.fn(() => of({ url: 'test@123/123' }))
  };
  beforeAll(() => {
    component = new MainMenuComponent(
      mockresourceService as ResourceService,
      mockUserService as UserService,
      mockrouter as Router,
      mockactivatedRoute as ActivatedRoute,
      mockpermissionService as PermissionService,
      mockconfig as ConfigService,
      mockcacheService as CacheService,
      mockutilService as UtilService,
      mocklayoutService as LayoutService,
      mocktelemetryService as TelemetryService
    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be create a instance of main menu component', () => {
    // @ts-ignore
    mockUserService.loggedIn = true;
    expect(component).toBeTruthy();
  });
  it('should call updateHrefPath with url and convert explore-course into learn', () => {
    const url = 'https://localhost:3000/explore-course?board=CBSE';
    component.updateHrefPath(url);
    expect(component.hrefPath).toBe('https://localhost:3000/learn?board=CBSE');
  });
  it('should call updateHrefPath with url and convert explore into resources', () => {
    const url = 'https://localhost:3000/explore?board=CBSE';
    component.updateHrefPath(url);
    expect(component.hrefPath).toBe('https://localhost:3000/resources?board=CBSE');
  });
  it('should call updateHrefPath with url and convert play into resources', () => {
    const url = '/play/content/do_2134696122632519681670?contentType=eTextBook';
    component.updateHrefPath(url);
    expect(component.hrefPath).toBe('/resources/play/content/do_2134696122632519681670?contentType=eTextBook');
  });
  it('should call updateHrefPath with url and convert any other path into resources', () => {
    const url = 'https://localhost:3000/get/dial/123asd';
    component.updateHrefPath(url);
    expect(component.hrefPath).toBe('/resources');
  });

  it('should call setInteractData and update the telemetry objects', () => {
    component.setInteractData();
    expect(JSON.stringify(component.homeMenuIntractEdata)).toBe(JSON.stringify(mockData.homeMenuIntractEdata));
    expect(JSON.stringify(component.libraryMenuIntractEdata)).toBe(JSON.stringify(mockData.libraryMenuIntractEdata));
    expect(JSON.stringify(component.myLibraryMenuInteractEdata)).toBe(JSON.stringify(mockData.myLibraryMenuInteractEdata));
    expect(JSON.stringify(component.browseEdata)).toBe(JSON.stringify(mockData.browseEdata));
    expect(JSON.stringify(component.helpCenterEdata)).toBe(JSON.stringify(mockData.helpCenterEdata));
    expect(JSON.stringify(component.learnMenuIntractEdata)).toBe(JSON.stringify(mockData.learnMenuIntractEdata));
    expect(JSON.stringify(component.groupsMenuIntractEdata)).toBe(JSON.stringify(mockData.groupsMenuIntractEdata));
    expect(JSON.stringify(component.workspaceMenuIntractEdata)).toBe(JSON.stringify(mockData.workspaceMenuIntractEdata));
    expect(JSON.stringify(component.helpMenuIntractEdata)).toBe(JSON.stringify(mockData.helpMenuIntractEdata));
    expect(JSON.stringify(component.contributeMenuEdata)).toBe(JSON.stringify(mockData.contributeMenuEdata));
    expect(JSON.stringify(component.signInIntractEdata)).toBe(JSON.stringify(mockData.signInIntractEdata));
  });
  it('should call getLogoutInteractEdata and update the telemetry objects of logout Interact data', () => {
    const obj = component.getLogoutInteractEdata();
    expect(JSON.stringify(obj)).toBe(JSON.stringify(mockData.LogoutInteractEdata));
  });

  it('should call logout method and logout', () => {
    Object.defineProperty(window, "location", {
      value: {
        replace: jest.fn()
      }
    });
    component.logout();
    expect(component['cacheService'].removeAll).toBeCalled();
  });

  it('should call navigateToWorkspace method and navigate to workspace', () => {
    jest.spyOn(component.permissionService, 'getWorkspaceAuthRoles').mockReturnValue(of({
      id: 'id',
      url: 'test@123/abc',
      params: {
        resmsgid: '',
        status: 'staus'
      },
      responseCode: 'OK',
      result: {},
      ts: '',
      ver: ''
    }));
    const obj = component.navigateToWorkspace();
    expect(component.permissionService.getWorkspaceAuthRoles).toBeCalled();
  });

  it('should call getFeatureId method with featureId and taskID', () => {
    const featureId = 'Feature1'
    const taskId = 'Task1'
    const obj = component.getFeatureId(featureId, taskId);
    expect(JSON.stringify(obj)).toBe(JSON.stringify(mockData.featuresObj));
  });

  it('should call navigateToGroups method and return path of MY_GROUPS', () => {
    const obj = component.navigateToGroups();
    expect(obj).toBe('my-groups');
  });

  it('should call isLayoutAvailable method and return layout config', () => {
    const obj = component.isLayoutAvailable();
    expect(obj).toBeTruthy();
  });

  it('should call switchLayout method ', () => {
    jest.spyOn(component.layoutService, 'initiateSwitchLayout');
    jest.spyOn(component, 'generateInteractTelemetry');
    component.switchLayout();
    expect(component.layoutService.initiateSwitchLayout).toBeCalled();
    expect(component.generateInteractTelemetry).toBeCalled();
  });

  it('should call ngOnInit method with out helpLinkVisibility', () => {
    jest.spyOn(component, 'setInteractData')
    component.ngOnInit();
    expect(component.isDesktopApp).toBeTruthy();
    expect(component.setInteractData).toBeCalled();
  });

  it('should call ngOnInit method ', () => {
    jest.spyOn(document, 'getElementById').mockImplementation((data) => {
      switch (data) {
        case 'helpLinkVisibility':
          return { value: 'True' } as any;
      }
    });
    jest.spyOn(component, 'setInteractData')
    component.ngOnInit();
    expect(component.isDesktopApp).toBeTruthy();
    expect(component.setInteractData).toBeCalled();
  });

});