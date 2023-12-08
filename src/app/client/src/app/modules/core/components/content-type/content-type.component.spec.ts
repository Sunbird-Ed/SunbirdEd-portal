import { ActivatedRoute, Router } from '@angular/router';
import { FormService, UserService } from '../../../core';
import { LayoutService, NavigationHelperService, ResourceService, UtilService } from '../../../shared';
import { of } from 'rxjs';
import { ContentTypeComponent } from './content-type.component';
import { mockData } from './content-type.component.spec.data';
import { TelemetryService } from '../../../telemetry/services';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';


describe('ContentTypeComponent', () => {
  let component: ContentTypeComponent;

  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn().mockReturnValue(of(mockData.formData)) as any
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockRouter: Partial<Router> = {
    navigate: jest.fn()
  };
  const mockUserService: Partial<UserService> = {
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id'],
        profileUserType: {
          type: 'student'
        }
      } as any
    }) as any
  };
  const mockTelemetryService: Partial<TelemetryService> = {
    interact: jest.fn()
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      queryParams: {
        selectedTab: 'course'
      }
    } as any
  };
  const mockLayoutService: Partial<LayoutService> = {
    isLayoutAvailable: jest.fn(() => true),
    updateSelectedContentType: jest.fn(() => {
      return
    }) as any
  };
  const mockUtilService: Partial<UtilService> = {};
  const mockNavigationhelperService: Partial<NavigationHelperService> = {};

  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getFrameworkCategories: jest.fn(),
    setDefaultFWforCsl: jest.fn(),
    getAlternativeCodeForFilter: jest.fn(),
    getAllFwCatName: jest.fn()
  };

  beforeAll(() => {
    component = new ContentTypeComponent(
      mockFormService as FormService,
      mockResourceService as ResourceService,
      mockRouter as Router,
      mockUserService as UserService,
      mockTelemetryService as TelemetryService,
      mockActivatedRoute as ActivatedRoute,
      mockLayoutService as LayoutService,
      mockUtilService as UtilService,
      mockNavigationhelperService as NavigationHelperService,
      mockCslFrameworkService as CslFrameworkService
    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a instance of content type component', () => {
    expect(component).toBeTruthy();
    jest.spyOn(component, 'ngOnInit').mockImplementation(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should tell is layout is available', () => {
    const layoutData = component.isLayoutAvailable();
    expect(layoutData).toBe(true);
  });

  it('should fetch title for non logged in user', () => {
    // @ts-ignore
    mockUserService._authenticated = false;
    // @ts-ignore
    mockUserService.loggedIn = false;
    component.showContentType({
      anonumousUserRoute: { route: '/explore-course', queryParam: 'course' },
      contentType: 'course'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/explore-course'], { queryParams: { selectedTab: 'course' } });
  });

  it('should fetch title for logged in user', () => {
    // @ts-ignore
    mockUserService._authenticated = true;
    // @ts-ignore
    mockUserService.loggedIn = true;
    component.showContentType({
      loggedInUserRoute: { route: '/course', queryParam: 'course' },
      contentType: 'course'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/course'], { queryParams: { selectedTab: 'course' } });
  });

  it('should get Icon', () => {
    const icon = component.getIcon({
      theme: {
        className: 'textbook'
      }
    });
    expect(icon).toEqual('textbook');
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    jest.spyOn(component.unsubscribe$, 'complete');
    jest.spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  describe('should set selected content types', () => {
    it('should set selected content type for profile page', () => {
      component.setSelectedContentType('/profile', {}, {});
      expect(component.selectedContentType).toBe(null);
    });

    it('should set selected content type for explore-groups', () => {
      component.setSelectedContentType('/explore-groups', {}, {});
      expect(component.selectedContentType).toBe(null);
    });

    it('should set selected content type as url has selectedTab as query', () => {
      component.setSelectedContentType('/profile', { selectedTab: 'textbook' }, {});
      expect(component.selectedContentType).toBe('textbook');
    });

    it('should set selected content type for play url', () => {
      component.setSelectedContentType('/play', {}, {});
      expect(component.selectedContentType).toBe(null);
    });

    it('should set selected content type for play when content type is textbook', () => {
      component.setSelectedContentType('/play', { contentType: 'TextBook' }, {});
      expect(component.selectedContentType).toBe('textbook');
    });

    it('should set selected content type for explore-course', () => {
      component.setSelectedContentType('/explore-course', {}, {});
      expect(component.selectedContentType).toBe('course');
    });

    it('should set selected content type for learn', () => {
      component.setSelectedContentType('/learn', {}, {});
      expect(component.selectedContentType).toBe('course');
    });

    it('should set selected content type for explore page', () => {
      component.setSelectedContentType('/explore', {}, {});
      expect(component.selectedContentType).toBe('textbook');
    });

    it('should set selected content type for resources page', () => {
      component.setSelectedContentType('/resources', {}, {});
      expect(component.selectedContentType).toBe('textbook');
    });

    it('should set selected content type for resources page when selected tab is tv', () => {
      component.setSelectedContentType('/resources', { selectedTab: 'tv' }, {});
      expect(component.selectedContentType).toBe('tv');
    });
  });

  it('should set conent type as all when updateSelectedContentType trigger with unknown content type', () => {
    component.contentTypes = mockData.formData;
    jest.spyOn(component, 'updateSelectedContentType').mockImplementation(() => {
      return
    });
    component.ngOnInit();
    expect(component.selectedContentType).toEqual('tv');
  });

  it('should fetch title for logged in user', () => {
    mockUserService._authenticated = true;
    component.showContentType({
      loggedInUserRoute: { route: '/resource', queryParam: 'textbook' },
      contentType: 'textbook'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/resource'], { queryParams: { selectedTab: 'textbook' } });
  });

  it('should set selected conent type when updateSelectedContentType trigger', () => {
    component.contentTypes = mockData.formData;
    component.ngOnInit();
    expect(component.selectedContentType).toEqual('tv');
  });

  it('should set selected content type for explore page', () => {
    component.setSelectedContentType(`explore/1?se_boards=state%20(tamil%20nadu)
    &se_mediums=english&se_mediums=tamil&se_gradeLevels=class%207
    &se_gradeLevels=class%204&se_gradeLevels=class%201&se_gradeLevels=class%202
    &se_gradeLevels=class%203&se_gradeLevels=class%205&se_gradeLevels=class%209
    &se_gradeLevels=class%208&se_subjects=english&returnTo=home&selectedTab=all
    &showClose=true&isInside=english
    `, {
      se_subjects: 'english',
      selectedTab: 'all',
      showClose: 'true',
      isInside: 'english'
    }, {});
    expect(component.selectedContentType).toBe('all');
  });

  it('should set selected content type for mydownloads page', () => {
    component.setSelectedContentType('/mydownloads', {}, {});
    expect(component.selectedContentType).toBe('mydownloads');
  });

  it('should set selected content type for observation page', () => {
    component.setSelectedContentType('/observation', {}, {});
    expect(component.selectedContentType).toBe('observation');
  });

  it('should call update selected content type', () => {
    component.contentTypes = mockData.formData;
    jest.spyOn(component, 'updateSelectedContentType').mockImplementation();
    component.updateSelectedContentType('course');
    expect(component.updateSelectedContentType).toHaveBeenCalled();
    expect(component.selectedContentType).toEqual('observation');
  });

  it('should call process form data', () => {
    component.processFormData(mockData.formData);
    expect(component.selectedContentType).toEqual('course');
  });

  it('should call make form changes for user type administrator', () => {
    component.contentTypes = mockData.formData;
    component.userType = 'administrator';
    component.makeFormChange();
    expect(mockData.formData[2].isEnabled).toBeFalsy;
  });

  it('should call make form changes for user type non administrator', () => {
    component.contentTypes = mockData.formData;
    component.userType = 'student';
    component.makeFormChange();
    expect(mockData.formData[2].isEnabled).toBeTruthy;
  });

  it('should call update form method for logged in user', () => {
    component.userType = undefined;
    // @ts-ignore
    mockUserService.loggedIn = true;
    component.contentTypes = mockData.formData;
    component.updateForm();
    expect(component.userType).toEqual('student');
  });

  it('should call update form method for non logged in user', () => {
    component.userType = undefined;
    // @ts-ignore
    mockUserService.loggedIn = false;
    component.contentTypes = mockData.formData;
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
      return 'student';
    });
    component.updateForm();
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(component.userType).toEqual('student');
  });

});
