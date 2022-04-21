import { ChangeDetectorRef, EventEmitter, NgZone, Renderer2 } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CacheService } from "ng2-cache-service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { AppComponent } from "./app.component"
import { CoursesService, DeviceRegisterService, FormService, GeneraliseLabelService, LearnerService, OrgDetailsService, PermissionService, PublicDataService, SessionExpiryInterceptor, TenantService, UserService } from "./modules/core";
import { BrowserCacheTtlService, ConfigService, ConnectionService, IUserData, IUserProfile, LayoutService, NavigationHelperService, ResourceService, ToasterService, UtilService } from "./modules/shared";
import { TelemetryService } from "./modules/telemetry";
import { ProfileService } from "./plugins/profile";
import { mockData } from './app.component.spec.data';

describe("App Component", () => {
  let appComponent: AppComponent;

  const mockCacheService: Partial<CacheService> = {
    set: jest.fn()
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
  const mockUserService: Partial<UserService> = {
    slug: jest.fn().mockReturnValue("tn") as any,
    _userData$: new BehaviorSubject<Partial<IUserData>>(undefined),
    setIsCustodianUser: jest.fn()
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: new EventEmitter<any>()
  };
  const mockPermissionService: Partial<PermissionService> = {};
  const mockResourceService: Partial<ResourceService> = {};
  const mockDeviceRegisterService: Partial<DeviceRegisterService> = {};
  const mockCoursesService: Partial<CoursesService> = {};
  const mockTenantService: Partial<TenantService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockRouter: Partial<Router> = {
    navigate: jest.fn()
  };
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: "joy"
    }
  };
  const mockOrgDetailsService: Partial<OrgDetailsService> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockProfileService: Partial<ProfileService> = {};
  const mockToasterService: Partial<ToasterService> = {};
  const mockUtilService: Partial<UtilService> = {};
  const mockFormService: Partial<FormService> = {};
  const mockSessionExpiryInterceptor: Partial<SessionExpiryInterceptor> = {};
  const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
  };
  const mockLayoutService: Partial<LayoutService> = {};
  const mockGeneraliseLabelService: Partial<GeneraliseLabelService> = {};
  const mockRenderer2: Partial<Renderer2> = {};
  const mockNgZone: Partial<NgZone> = {};
  const mockConnectionService: Partial<ConnectionService> = {};
  const mockPublicDataService: Partial<PublicDataService> = {};
  const mockLearnerService: Partial<LearnerService> = {};
  const mockDocument: Partial<Document> = {};

  const mockUserRoles = {
    userRoles: ['PUBLIC'],
    userOrgDetails: 'testing123'
  };

  beforeAll(() => {
    appComponent = new AppComponent(
      mockCacheService as CacheService,
      mockBrowserCacheTtlService as BrowserCacheTtlService,
      mockUserService as UserService,
      mockNavigationHelperService as NavigationHelperService,
      mockPermissionService as PermissionService,
      mockResourceService as ResourceService,
      mockDeviceRegisterService as DeviceRegisterService,
      mockCoursesService as CoursesService,
      mockTenantService as TenantService,
      mockTelemetryService as TelemetryService,
      mockRouter as Router,
      mockConfigService as ConfigService,
      mockOrgDetailsService as OrgDetailsService,
      mockActivatedRoute as ActivatedRoute,
      mockProfileService as ProfileService,
      mockToasterService as ToasterService,
      mockUtilService as UtilService,
      mockFormService as FormService,
      mockDocument as Document,
      mockSessionExpiryInterceptor as SessionExpiryInterceptor,
      mockChangeDetectionRef as ChangeDetectorRef,
      mockLayoutService as LayoutService,
      mockGeneraliseLabelService as GeneraliseLabelService,
      mockRenderer2 as Renderer2,
      mockNgZone as NgZone,
      mockConnectionService as ConnectionService
    );
  });

  beforeEach(() => {
      jest.clearAllMocks();
  });

  it('should be create a instance of appComponent', () => {
      expect(appComponent).toBeTruthy();
  });

  it('should handle login', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { 
        replace: jest.fn(),
      }
    });
    mockCacheService.removeAll = jest.fn();
    appComponent.handleLogin();
    expect(mockCacheService.removeAll).toHaveBeenCalled();
  })

  describe('ngOnInit', () => {
    // it('ngOnInit', () => {
  //   jest.spyOn(appComponent, 'checkFullScreenView').mockImplementation();
  //   jest.spyOn(appComponent, 'handleHeaderNFooter').mockImplementation();
  //   jest.spyOn(appComponent, 'changeLanguageAttribute').mockImplementation();
  //   jest.spyOn(appComponent, 'setDeviceId').mockImplementation();
  //   mockLayoutService.switchableLayout = () => of({});
  //   mockResourceService.initialize = jest.fn();
  //   mockGeneraliseLabelService.getGeneraliseResourceBundle = jest.fn();
  //   appComponent.ngOnInit();
  // })
  })


  describe('getOrgDetails', () => {
    it('should get ord details and set in cache', () => {
      mockOrgDetailsService.getOrgDetails = jest.fn().mockReturnValue(of({})) as any;
      appComponent.getOrgDetails(true).subscribe((data) => {
        expect(mockOrgDetailsService.getOrgDetails).toHaveBeenCalled();
      });
    })
  })

  describe('checkForCustodianUser', () => {
    it('should set user as custodian if it is', (done) => {
      const custodianOrg = {
        result: {response: {value: 'ROOT_ORG'}}
      }
      mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(custodianOrg)) as any;
      const mockUserProfile = {
        rootOrg: {rootOrgId: 'ROOT_ORG'}
      }
      Object.defineProperty(mockUserService, 'userProfile', {
        get: jest.fn(() => mockUserProfile)
      });
      appComponent.checkForCustodianUser();
      setTimeout(() => {
        expect(mockUserService.setIsCustodianUser).toHaveBeenCalledWith(true);
        done();
      });
    });

    it('should set user as non custodian user', (done) => {
      const custodianOrg = {
        result: {response: {value: ''}}
      }
      mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(custodianOrg)) as any;
      appComponent.checkForCustodianUser();
      setTimeout(() => {
        expect(mockUserService.setIsCustodianUser).toHaveBeenCalledWith(false);
        done();
      });
    });
  })

  describe('onAcceptTnc', () => {
    it('should show framework selection popup for non logged in user', () => {
      Object.defineProperty(mockUserService, 'loggedIn', {
        get: jest.fn(() => false)
      });
      jest.spyOn(appComponent, 'checkFrameworkSelected').mockImplementation();
      appComponent.onAcceptTnc();
      expect(appComponent.checkFrameworkSelected).toHaveBeenCalled();
    });

    it('should show global consent popup for non custodian user', (done) => {
      Object.defineProperty(mockUserService, 'userProfile', {
        get: jest.fn(() => {rootOrgId: 'ROOT_ORG'})
      });
      Object.defineProperty(mockUserService, 'loggedIn', {
        get: jest.fn(() => true)
      });
      const nonCustodianOrg = { result: {response: {value: ''}}}
      mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
      appComponent.onAcceptTnc();
      setTimeout(() => {
        expect(appComponent.showGlobalConsentPopUpSection).toBeTruthy();
        done();
      });  
    });

    it('should check framework selected or not for logged in and custodian user', (done) => {
      const mockUserProfile = {
        rootOrg: {rootOrgId: 'ROOT_ORG'}
      }
      Object.defineProperty(mockUserService, 'userProfile', {
        get: jest.fn(() => mockUserProfile)
      });
      Object.defineProperty(mockUserService, 'loggedIn', {
        get: jest.fn(() => true)
      });
      const nonCustodianOrg = { result: {response: {value: 'ROOT_ORG'}}}
      mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
      jest.spyOn(appComponent, 'checkFrameworkSelected').mockImplementation();
      appComponent.onAcceptTnc();
      setTimeout(() => {
        expect(appComponent.checkFrameworkSelected).toHaveBeenCalled();
        done();
      });  
    });
  })


  describe("closeConsentPopUp", () => {
    it("should close consent popup", () => {
      jest.spyOn(appComponent, 'checkFrameworkSelected').mockImplementation();
      appComponent.closeConsentPopUp();
      expect(appComponent.showGlobalConsentPopUpSection).toBeFalsy();
      expect(appComponent.isglobalConsent).toBeFalsy();
      expect(appComponent.checkFrameworkSelected).toHaveBeenCalled();
    })
  })

  describe("setDeviceId", () => {
    it("should close consent popup", (done) => {
      // mockTelemetryService.getDeviceId = jest.fn().mockReturnValue(of({deviceId: "123", components:"A", version: "1"}));
      mockDeviceRegisterService.setDeviceId = jest.fn();
      appComponent.setDeviceId().subscribe((data) => {
        mockTelemetryService.getDeviceId
        expect(appComponent.deviceId).toBeDefined();
      })
    })
  })




  



})