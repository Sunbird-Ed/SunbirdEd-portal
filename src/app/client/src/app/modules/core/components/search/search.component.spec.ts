import { jest } from '@jest/globals';
import { SearchComponent } from './search.component';
import {
  ConfigService, ResourceService, UtilService,
  LayoutService, ConnectionService
} from '../../../shared';
import { of } from 'rxjs';
import { UserService } from '../../../core';
import { mockUserData } from './../../services/user/user.mock.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { mockResponse } from './search.component.spec.data';

describe('SearchComponent', () => {
  let component: SearchComponent;
  const mockRouter: Partial<Router> = {
    url: '/resources/view-all/Course-Unit/1?&selectedTab=course&board=CBSE%2FNCERT&medium=English&publisher=NCERT&',
    navigate: jest.fn() as any,
    events: of({}) as any
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
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
        managedBy: true,
        rootOrgAdmin: true
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
  const mockResourceService: Partial<ResourceService> = {
    languageSelected$: of({ language: 'en' }) as any
  };
  const mockConfig: Partial<ConfigService> = {
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
    },
    dropDownConfig: {
      FILTER: {
        SEARCH: {
          search: {
            'All': '/search/All',
            'home': '/search/All',
            'learn': '/search/Courses',
            'Courses': '/search/Courses',
            'resources': '/search/Library',
            'mydownloads': '/search/Library',
            'Library': '/search/Library',
            'Users': '/search/Users',
            'profile': '/search/Users'
          },
          searchUrl: {
            'home': 'All',
            'learn': 'Courses',
            'resources': 'Library',
            'profile': 'Users',
            'mydownloads': 'mydownloads'
          },
          searchEnabled: [
            'home',
            'learn',
            'resources',
          ]
        }
      }
    }
  };
  const mockUtilService: Partial<UtilService> = {
    currentRole: of({}) as any,
    redirect: jest.fn(),
    isDesktopApp: true,
  };
  const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
    detectChanges: jest.fn()
  };
  const mockLayoutService: Partial<LayoutService> = {
    isLayoutAvailable: jest.fn(() => true),
    initiateSwitchLayout: jest.fn()
  };
  const mockConnectionService: Partial<ConnectionService> = {
    monitor: jest.fn(() => of(true))
  };
  beforeAll(() => {
    component = new SearchComponent(
      mockRouter as Router,
      mockActivatedRoute as ActivatedRoute,
      mockUserService as UserService,
      mockResourceService as ResourceService,
      mockConfig as ConfigService,
      mockUtilService as UtilService,
      mockChangeDetectionRef as ChangeDetectorRef,
      mockLayoutService as LayoutService,
      mockConnectionService as ConnectionService
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

  it('should call ngOnInit method ', () => {
    mockActivatedRoute.queryParams = of({
      id: 'sample-id',
      utm_campaign: 'utm_campaign',
      utm_medium: 'utm_medium',
      clientId: 'android',
      context: JSON.stringify({ data: 'sample-data' })
    });
    component.ngOnInit();
    expect(component.isDesktopApp).toBeTruthy();
    expect(component.showSuiSelectDropdown).toBeTruthy();
    expect(component.showInput).toBeTruthy();
  });

  it('should call ngOnDestroy', () => {
    //arrange
    component.resourceDataSubscription = of().subscribe();
    // act
    component.ngOnDestroy();
    // assert
    expect(component.resourceDataSubscription).toBeDefined()
  });

  it('should call onChange', () => {
    //arrange
    component.selectedOption = 'selectedOption';
    component.search = {
      selectedOption: 'abcd'
    }
    jest.spyOn(component['route'], 'navigate')
    // act
    component.onChange();
    // assert
    expect(component['route'].navigate).toBeCalled();
  });

  it('should call setSearchPlaceHolderValue', () => {
    //arrange
    component.selectedOption = 'selectedOption';
    component.searchDisplayValueMappers = {
      selectedOption: 'abcd'
    }
    // act
    component.setSearchPlaceHolderValue();
    // assert
    expect(component.searchPlaceHolderValue).toBe('selectedOption');
  });

  it('should call onEnter', () => {
    //arrange
    const key = [{
      value: 'A'
    }]
    // act
    component.onEnter(key);
    // assert
    expect(component.searchPlaceHolderValue).toBe('selectedOption');
  });

  it('should call onEnter with empty key', () => {
    //arrange
    const key = []
    // act
    component.onEnter(key);
    // assert
    expect(component.searchPlaceHolderValue).toBe('selectedOption');
  });

  it('should call onEnter with empty key and selectedOption as false', () => {
    //arrange
    const key = []
    component.selectedOption = null;
    // act
    component.onEnter(key);
    // assert
    expect(component.searchPlaceHolderValue).toBe('selectedOption');
  });

  it('should call onEnter with empty key and selectedOption as false and isConnected as true', () => {
    //arrange
    component.isDesktopApp = true;
    component.isConnected = false;
    const key = []
    component.selectedOption = null;
    // act
    component.onEnter(key);
    // assert
    expect(component.searchPlaceHolderValue).toBe('selectedOption');
  });

  it('should call setFilters with config', () => {
    //arrange
    const obj = {
      All: '/search/All',
      home: '/search/All',
      learn: '/search/Courses',
      Courses: '/search/Courses',
      resources: '/search/Library',
      mydownloads: '/search/Library',
      Library: '/search/Library',
      Users: '/search/Users',
      profile: '/search/Users'
    }
    // act
    component.setFilters();
    // assert
    expect(JSON.stringify(component.search)).toBe(JSON.stringify(obj));
  });

  it('should call setFilters with config with searchEnabled updated', () => {
    //arrange
    component.config.dropDownConfig.FILTER.SEARCH.searchEnabled = ['profile', 'search', 'mydownloads'];
    // act
    component.setFilters();
    // assert
    expect(JSON.stringify(component.value)).toBe(JSON.stringify(['', 'resources', 'view-all']));
  });

  it('should call setDropdownSelectedOption with input as value', () => {
    //arrange
    jest.spyOn(component['cdr'], 'detectChanges')
    const value = 'Users';
    component.setDropdownSelectedOption(value);
    // assert
    expect(JSON.stringify(component.selectedOption)).toBe(JSON.stringify('Users'));
    expect(component.showSuiSelectDropdown).toBeTruthy();
    expect(component['cdr'].detectChanges).toBeCalled();
  });

  it('should call setDropdownSelectedOption with input as value and usertype admin', () => {
    //arrange
    const value = 'Users';
    component.setDropdownSelectedOption(value);
    // assert
    expect(JSON.stringify(component.selectedOption)).toBe(JSON.stringify('Users'));
  });

  it('should call getInteractEdata with input as key', () => {
    //arrange
    const key = 'Users';
    const obj = component.getInteractEdata(key);
    // assert
    expect(JSON.stringify(obj)).toBe(JSON.stringify(mockResponse.searchInteractEdata));
  });

  it('should call isLayoutAvailable method and return layout config', () => {
    const obj = component.isLayoutAvailable();
    expect(obj).toBeTruthy();
  });
});
