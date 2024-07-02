import { ChangeDetectorRef, EventEmitter, NgZone, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from './../app/modules/shared/services/cache-service/cache.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { AppComponent } from './app.component'
import { CoursesService, DeviceRegisterService, FormService, GeneraliseLabelService, LearnerService, OrgDetailsService, PermissionService, PublicDataService, SessionExpiryInterceptor, TenantService, UserService } from './modules/core';
import { BrowserCacheTtlService, ConfigService, ConnectionService, IUserData, IUserProfile, LayoutService, NavigationHelperService, ResourceService, ToasterService, UtilService, GenericResourceService } from './modules/shared';
import { TelemetryService } from './modules/telemetry';
import { ProfileService } from './plugins/profile';
import { mockData } from './app.component.spec.data';
import { mockRes } from './modules/workspace/components/upforreview-contentplayer/upforreview-content.component.spce.data';
import { CslFrameworkService } from '../app/modules/public/services/csl-framework/csl-framework.service';
import { PopupControlService } from './service/popup-control.service';

describe('App Component', () => {
  let appComponent: AppComponent;
  const mockCacheService: Partial<CacheService> = {
    set: jest.fn()
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};
  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue('tn') as any,
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id']
      } as any
    }) as any,
    setIsCustodianUser: jest.fn(),
    setGuestUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: new EventEmitter<any>()
  };
  const mockPermissionService: Partial<PermissionService> = {};
  const mockResourceService: Partial<ResourceService> = {};
  const mockGenericResourceService: Partial<GenericResourceService> = {
    initialize: jest.fn()
  };
  const mockDeviceRegisterService: Partial<DeviceRegisterService> = {};
  const mockCoursesService: Partial<CoursesService> = {};
  const mockTenantService: Partial<TenantService> = {
    tenantData$: of({ favicon: 'sample-favicon' }) as any
  };
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn()
  };
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
  const mockOrgDetailsService: Partial<OrgDetailsService> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockProfileService: Partial<ProfileService> = {};
  const mockToasterService: Partial<ToasterService> = {};
  const mockUtilService: Partial<UtilService> = {
    isDesktopApp: true,
    isIos: true
  };
  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn()
  };
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
  const mockPopupControlService: Partial<PopupControlService> = {
    setOnboardingData: jest.fn()
  };

  const mockUserRoles = {
    userRoles: ['PUBLIC'],
    userOrgDetails: 'testing123'
  };

  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getFrameworkCategories: jest.fn(),
    setDefaultFWforCsl: jest.fn()
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
      mockConnectionService as ConnectionService,
      mockGenericResourceService as GenericResourceService,
      mockPopupControlService as PopupControlService,
      mockCslFrameworkService as CslFrameworkService
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
  });

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
        result: { response: { value: 'ROOT_ORG' } }
      }
      mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(custodianOrg)) as any;
      const mockUserProfile = {
        rootOrg: { rootOrgId: 'ROOT_ORG' }
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
        result: { response: { value: '' } }
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
        get: jest.fn(() => { rootOrgId: 'ROOT_ORG' })
      });
      Object.defineProperty(mockUserService, 'loggedIn', {
        get: jest.fn(() => true)
      });
      const nonCustodianOrg = { result: { response: { value: '' } } }
      mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
      appComponent.onAcceptTnc();
      setTimeout(() => {
        expect(appComponent.showGlobalConsentPopUpSection).toBeTruthy();
        done();
      });
    });

    it('should check framework selected or not for logged in and custodian user', (done) => {
      const mockUserProfile = {
        rootOrg: { rootOrgId: 'ROOT_ORG' }
      }
      Object.defineProperty(mockUserService, 'userProfile', {
        get: jest.fn(() => mockUserProfile)
      });
      Object.defineProperty(mockUserService, 'loggedIn', {
        get: jest.fn(() => true)
      });
      const nonCustodianOrg = { result: { response: { value: 'ROOT_ORG' } } }
      mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(nonCustodianOrg)) as any;
      jest.spyOn(appComponent, 'checkFrameworkSelected').mockImplementation();
      appComponent.onAcceptTnc();
      setTimeout(() => {
        expect(appComponent.checkFrameworkSelected).toHaveBeenCalled();
        done();
      });
    });
  })


  describe('closeConsentPopUp', () => {
    it('should close consent popup', () => {
      jest.spyOn(appComponent, 'checkFrameworkSelected').mockImplementation();
      appComponent.closeConsentPopUp();
      expect(appComponent.showGlobalConsentPopUpSection).toBeFalsy();
      expect(appComponent.isglobalConsent).toBeFalsy();
      expect(appComponent.checkFrameworkSelected).toHaveBeenCalled();
    })
  })

  it('should invoked ngOnDestroy before unload', () => {
    // arrange
    mockTelemetryService.syncEvents = jest.fn(() => { });
    jest.spyOn(appComponent, 'ngOnDestroy').mockImplementation(() => {
      return;
    });
    // act
    appComponent.beforeunloadHandler({});
    // assert
    expect(mockTelemetryService.syncEvents).toHaveBeenCalledWith(false);
  });

  it('should handle header and footer data', () => {
    // arrange
    // act
    appComponent.handleHeaderNFooter();
    // assert
    expect(appComponent.router.events).toBeTruthy();
  });

  describe('setTagManager', () => {
    it('should set tag manager for loggedIn user', () => {
      // arrange
      Storage.prototype.getItem = jest.fn(() => '');
      // act
      appComponent.setTagManager();
      // assert
      expect(Storage.prototype.getItem).toHaveBeenCalled();
    });
  });

  it('should be set Selected Theme Colour', () => {
    jest.spyOn(document, 'getElementById').mockImplementation(() => {
      return { value: ['val-01', '12', '-', '.'], checked: false } as any;
    });
    appComponent.setSelectedThemeColour({});
    expect(document.getElementById).toHaveBeenCalled();
  });

  it('should be return theme', () => {
    // arrange
    Storage.prototype.getItem = jest.fn(() => 'sample-color');
    appComponent.darkModeToggle = {
      nativeElement: true
    };
    mockRenderer2.setAttribute = jest.fn();
    jest.spyOn(appComponent, 'setSelectedThemeColour').mockImplementation();
    mockLayoutService.setLayoutConfig = jest.fn(() => 'sample-layout');
    // act
    appComponent.setTheme();
    // assert
    expect(Storage.prototype.getItem).toHaveBeenCalled();
    expect(mockRenderer2.setAttribute).toHaveBeenCalled();
    expect(mockLayoutService.setLayoutConfig).toHaveBeenCalled();
  });

  describe('ngAfterViewInit', () => {
    it('should checked after child component initialized', () => {
      // arrange
      const mHeaderPos = { height: 50, checked: true };
      const mHeader = [{
        addEventListener: jest.fn((as, listener, sd) => ({}))
      }];
      jest.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
        switch (selector) {
          case 'input[name=selector]':
            return mHeader as any;
        }
      });
      jest.spyOn(appComponent, 'setTheme').mockImplementation();
      jest.spyOn(appComponent, 'getLocalFontSize').mockImplementation();
      jest.spyOn(appComponent, 'getLocalTheme').mockImplementation();
      jest.spyOn(appComponent, 'setTagManager').mockImplementation();
      // act
      appComponent.ngAfterViewInit();
      // assert
      expect(document.querySelectorAll).toHaveBeenCalled();
    });
  });

  it('should check FullScreen View', () => {
    mockNavigationHelperService.contentFullScreenEvent = of({ fullScreen: true }) as any;
    appComponent.checkFullScreenView();
    expect(appComponent.isFullScreenView).toStrictEqual({ fullScreen: true });
  });

  describe('checkTncAndFrameWorkSelected', () => {
    it('should show TermsAndCondPopUp', () => {
      const mockUserProfile = {
        promptTnC: true,
        tncLatestVersion: 'sample-version'
      };
      Object.defineProperty(mockUserService, 'userProfile', {
        get: jest.fn(() => mockUserProfile)
      });
      appComponent.checkTncAndFrameWorkSelected();
      expect(appComponent.showTermsAndCondPopUp).toBeTruthy();
    });

    it('should show GlobalConsentPopUpSection', () => {
      const mockUserProfile = {
        promptTnC: false,
        tncLatestVersion: 'sample-version'
      };
      Object.defineProperty(mockUserService, 'userProfile', {
        get: jest.fn(() => mockUserProfile)
      });
      appComponent.checkTncAndFrameWorkSelected();
    });
  });

  it('should return joyThemePopup', () => {
    Storage.prototype.getItem = jest.fn(() => 'sample-data');
    jest.spyOn(appComponent, 'checkTncAndFrameWorkSelected').mockImplementation();
    appComponent.joyThemePopup();
  });

  describe('ngOnInit', () => {
    it('should be return user details for web and Ios', () => {
      // arrange
      jest.spyOn(appComponent, 'notifyNetworkChange').mockImplementation();
      jest.spyOn(appComponent.formService, 'getFormConfig').mockReturnValue(of({ "response": true }));
      mockDocument.body = {
        classList: {
          add: jest.fn()
        }
      } as any;
      jest.spyOn(appComponent, 'checkFullScreenView').mockImplementation();
      mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
      mockActivatedRoute.queryParams = of({
        id: 'sample-id',
        utm_campaign: 'utm_campaign',
        utm_medium: 'utm_medium',
        clientId: 'android',
        context: JSON.stringify({ data: 'sample-data' })
      });
      Storage.prototype.getItem = jest.fn(() => 'sample-data');
      jest.spyOn(appComponent, 'handleHeaderNFooter').mockImplementation();
      mockResourceService.initialize = jest.fn(() => { });
      jest.spyOn(appComponent, 'setDeviceId').mockImplementation(() => {
        return of('sample-device-id');
      });
      jest.spyOn(appComponent, 'checkFormData').mockImplementation(() => {
        return of('formData');
      });
      jest.spyOn(appComponent, 'getOnboardingList').mockImplementation(() => {
        return of('onboardingFormData');
      });
      mockNavigationHelperService.initialize = jest.fn(() => { });
      mockUserService.initialize = jest.fn(() => ({ uid: 'sample-uid' }));
      jest.spyOn(appComponent, 'getOrgDetails').mockImplementation();
      mockPermissionService.initialize = jest.fn(() => { });
      mockCoursesService.initialize = jest.fn(() => { });
      mockTelemetryService.makeUTMSession = jest.fn();
      mockUserService.startSession = jest.fn(() => true);
      jest.spyOn(appComponent, 'checkForCustodianUser').mockImplementation(() => {
        return true;
      });
      jest.spyOn(appComponent, 'changeLanguageAttribute').mockImplementation();
      mockGeneraliseLabelService.getGeneraliseResourceBundle = jest.fn(() => { });
      mockTenantService.getTenantInfo = jest.fn(() => { });
      mockTenantService.initialize = jest.fn(() => { });
      mockTelemetryService.initialize = jest.fn(() => ({ cdata: {} }));
      jest.spyOn(document, 'getElementById').mockImplementation(() => {
        return { value: ['val-01', '12', '-', '.'] } as any;
      });
      appComponent.telemetryContextData = {
        did: 'sample-did',
        pdata: 'sample-pdata',
        channel: 'sample-channel',
        sid: 'sample-sid'
      };
      jest.spyOn(appComponent, 'logCdnStatus').mockImplementation();
      jest.spyOn(appComponent, 'setFingerPrintTelemetry').mockImplementation();
      Storage.prototype.setItem = jest.fn(() => true);
      jest.spyOn(appComponent, 'joyThemePopup').mockImplementation();
      mockChangeDetectionRef.detectChanges = jest.fn();
      jest.spyOn(appComponent, 'changeLanguageAttribute').mockImplementation();
      mockGeneraliseLabelService.getGeneraliseResourceBundle = jest.fn();
      jest.spyOn(appComponent, 'checkToShowPopups').mockImplementation();
      // act
      appComponent.ngOnInit();
      // assert
      expect(mockLayoutService.switchableLayout).toHaveBeenCalled();
      expect(mockTelemetryService.makeUTMSession).toHaveBeenCalled();
      expect(mockUserService.loggedIn).toBeTruthy();
      expect(mockActivatedRoute.queryParams).not.toBe(undefined);
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('fpDetails_v2');
      expect(mockResourceService.initialize).toHaveBeenCalled();
      expect(mockNavigationHelperService.initialize).toHaveBeenCalled();
      expect(mockUserService.initialize).toHaveBeenCalledTimes(1);
      expect(mockPermissionService.initialize).toHaveBeenCalled();
      expect(mockCoursesService.initialize).toHaveBeenCalled();
      expect(mockUserService.startSession).toHaveBeenCalled();
      expect(mockUserService.userData$).toBeTruthy();
      expect(mockGeneraliseLabelService.getGeneraliseResourceBundle).toHaveBeenCalled();
      expect(mockTenantService.getTenantInfo).toHaveBeenCalled();
      expect(mockTenantService.initialize).toHaveBeenCalled();
      expect(mockGeneraliseLabelService.getGeneraliseResourceBundle).toHaveBeenCalled();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should be return user details for guest user', async () => {
      // arrange
      jest.spyOn(appComponent, 'notifyNetworkChange').mockImplementation();
      jest.spyOn(appComponent.formService, 'getFormConfig').mockReturnValue(of({ "response": true }));
      mockDocument.body = {
        classList: {
          add: jest.fn()
        }
      } as any;
      jest.spyOn(appComponent, 'checkFullScreenView').mockImplementation();
      mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
      mockActivatedRoute.queryParams = of({
        id: 'sample-id',
        utm_campaign: 'utm_campaign',
        utm_medium: 'utm_medium',
        clientId: 'android',
        context: JSON.stringify({ data: 'sample-data' })
      });
      Storage.prototype.getItem = jest.fn(() => 'sample-data');
      jest.spyOn(appComponent, 'handleHeaderNFooter').mockImplementation();
      mockResourceService.initialize = jest.fn(() => { });
      jest.spyOn(appComponent, 'setDeviceId').mockImplementation(() => {
        return of('sample-device-id');
      });
      jest.spyOn(appComponent, 'checkFormData').mockImplementation(() => {
        return of('formData');
      });
      jest.spyOn(appComponent, 'getOnboardingList').mockImplementation(() => {
        return of('onboardingFormData');
      });
      mockNavigationHelperService.initialize = jest.fn(() => { });
      mockUserService.initialize = jest.fn(() => ({ uid: 'sample-uid' }));
      jest.spyOn(appComponent, 'getOrgDetails').mockImplementation();
      mockPermissionService.initialize = jest.fn(() => { });
      mockCoursesService.initialize = jest.fn(() => { });
      mockTelemetryService.makeUTMSession = jest.fn();
      mockUserService.startSession = jest.fn(() => true);
      jest.spyOn(appComponent, 'checkForCustodianUser').mockImplementation(() => {
        return true;
      });
      jest.spyOn(appComponent, 'changeLanguageAttribute').mockImplementation();
      mockGeneraliseLabelService.getGeneraliseResourceBundle = jest.fn(() => { });
      mockTenantService.getTenantInfo = jest.fn(() => { });
      mockTenantService.initialize = jest.fn(() => { });
      mockTelemetryService.initialize = jest.fn(() => ({ cdata: {} }));
      jest.spyOn(document, 'getElementById').mockImplementation(() => {
        return { value: ['val-01', '12', '-', '.'] } as any;
      });
      appComponent.telemetryContextData = {
        did: 'sample-did',
        pdata: 'sample-pdata',
        channel: 'sample-channel',
        sid: 'sample-sid'
      };
      jest.spyOn(appComponent, 'logCdnStatus').mockImplementation();
      jest.spyOn(appComponent, 'setFingerPrintTelemetry').mockImplementation();
      Storage.prototype.setItem = jest.fn(() => true);
      jest.spyOn(appComponent, 'joyThemePopup').mockImplementation();

      mockChangeDetectionRef.detectChanges = jest.fn();
      mockUserService.getGuestUser = jest.fn(() => of({ role: 'teacher' }));
      mockOrgDetailsService.getOrgDetails = jest.fn(() => of({
        hashTagId: 'sample-hasTag-id'
      })) as any;
      jest.spyOn(appComponent, 'checkToShowPopups').mockImplementation();
      // act
      appComponent.ngOnInit();
      // assert
      expect(mockLayoutService.switchableLayout).toHaveBeenCalled();
      expect(mockTelemetryService.makeUTMSession).toHaveBeenCalled();
      expect(mockActivatedRoute.queryParams).not.toBe(undefined);
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('fpDetails_v2');
      expect(mockResourceService.initialize).toHaveBeenCalled();
      expect(mockNavigationHelperService.initialize).toHaveBeenCalled();
      expect(mockUserService.initialize).toHaveBeenCalledTimes(1);
      expect(mockTenantService.getTenantInfo).toHaveBeenCalled();
      expect(mockTenantService.initialize).toHaveBeenCalled();
      expect(mockOrgDetailsService.getOrgDetails).toHaveBeenCalled();
    });

    it('should be return user details for guest user and error part', () => {
      // arrange
      jest.spyOn(appComponent, 'notifyNetworkChange').mockImplementation();
      jest.spyOn(appComponent.formService, 'getFormConfig').mockReturnValue(of({ "response": true }));
      mockDocument.body = {
        classList: {
          add: jest.fn()
        }
      } as any;
      jest.spyOn(appComponent, 'checkFullScreenView').mockImplementation();
      mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
      mockActivatedRoute.queryParams = of({
        id: 'sample-id',
        utm_campaign: 'utm_campaign',
        utm_medium: 'utm_medium',
        clientId: 'android',
        context: JSON.stringify({ data: 'sample-data' })
      });
      Storage.prototype.getItem = jest.fn(() => 'sample-data');
      jest.spyOn(appComponent, 'handleHeaderNFooter').mockImplementation();
      mockResourceService.initialize = jest.fn(() => { });
      jest.spyOn(appComponent, 'setDeviceId').mockImplementation(() => {
        return of('sample-device-id');
      });
      jest.spyOn(appComponent, 'checkFormData').mockImplementation(() => {
        return of('formData');
      });
      jest.spyOn(appComponent, 'getOnboardingList').mockImplementation(() => {
        return of('onboardingFormData');
      });
      mockNavigationHelperService.initialize = jest.fn(() => { });
      mockUserService.initialize = jest.fn(() => ({ uid: 'sample-uid' }));
      jest.spyOn(appComponent, 'getOrgDetails').mockImplementation();
      mockUserService.startSession = jest.fn(() => true);
      jest.spyOn(appComponent, 'checkForCustodianUser').mockImplementation(() => {
        return true;
      });
      jest.spyOn(appComponent, 'changeLanguageAttribute').mockImplementation();
      jest.spyOn(document, 'getElementById').mockImplementation(() => {
        return { value: ['val-01', '12', '-', '.'] } as any;
      });
      appComponent.telemetryContextData = {
        did: 'sample-did',
        pdata: 'sample-pdata',
        channel: 'sample-channel',
        sid: 'sample-sid'
      };
      jest.spyOn(appComponent, 'logCdnStatus').mockImplementation();
      jest.spyOn(appComponent, 'setFingerPrintTelemetry').mockImplementation();
      Storage.prototype.setItem = jest.fn(() => true);
      jest.spyOn(appComponent, 'joyThemePopup').mockImplementation();
      mockChangeDetectionRef.detectChanges = jest.fn();
      mockUserService.getGuestUser = jest.fn(() => throwError({ role: 'teacher' }));
      mockOrgDetailsService.getOrgDetails = jest.fn(() => throwError({
        hashTagId: 'sample-hasTag-id'
      })) as any;
      jest.spyOn(appComponent, 'checkToShowPopups').mockImplementation();
      // act
      appComponent.ngOnInit();
      // assert
      expect(mockLayoutService.switchableLayout).toHaveBeenCalled();
      expect(mockTelemetryService.makeUTMSession).toHaveBeenCalled();
      expect(mockActivatedRoute.queryParams).not.toBe(undefined);
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('fpDetails_v2');
      expect(mockResourceService.initialize).toHaveBeenCalled();
      expect(mockNavigationHelperService.initialize).toHaveBeenCalled();
      expect(mockUserService.initialize).toHaveBeenCalledTimes(1);
      expect(mockOrgDetailsService.getOrgDetails).toHaveBeenCalled();
    });
  });

  it('should be close JoyTheme Popup', () => {
    // arrange
    appComponent.showJoyThemePopUp = false;
    jest.spyOn(appComponent, 'checkTncAndFrameWorkSelected').mockImplementation(() => {
      return;
    });
    // act
    appComponent.onCloseJoyThemePopup();
    // assert
    expect(appComponent.showJoyThemePopUp).toBeFalsy();
  });

  it('should be checked is display for Route', () => {
    appComponent.isBotdisplayforRoute();
    expect(mockRouter.url).toEqual(undefined);
  });

  it('should be return Theme Colour', () => {
    Storage.prototype.setItem = jest.fn(() => true);
    appComponent.storeThemeColour({});
    expect(Storage.prototype.setItem).toHaveBeenCalled();
  });

  it('should be checked Location Status is Required', () => {
    appComponent.isLocationStatusRequired();
  });

  it('should initialize with usertype,framework and onboarding popup enabled when form config is available', () => {
    const formConfigResponse = {
      onboardingPopups: {
        isVisible: true,
        defaultFormatedName: "Guest"
      },
      userTypePopup: {
        isVisible: true,
        defaultUserType: "Teacher",
        defaultGuestUserType: "Teacher"
      },
      frameworkPopup: {
        isVisible: true,
        defaultFormatedName: "Guest"
      },
      locationPopup: {
        isVisible: true
      }
    };
    jest.spyOn(appComponent.formService, 'getFormConfig').mockReturnValue(of(formConfigResponse));
    appComponent.getOnboardingList();
    expect(appComponent.isOnboardingEnabled).toEqual(true);
    expect(appComponent.isFWSelectionEnabled).toEqual(true);
    expect(appComponent.isUserTypeEnabled).toEqual(true);
  });

  it('should call guestuser method of userservice when either isVisible of onboarding or framework popup is false', async () => {
    const formConfigResponse = {
      onboardingPopups: {
        isVisible: false,
        defaultFormatedName: "Guest"
      },
      userTypePopup: {
        isVisible: true,
        defaultUserType: "Teacher",
        defaultGuestUserType: "Teacher"
      },
      frameworkPopup: {
        isVisible: false,
        defaultFormatedName: "Guest"
      },
      locationPopup: {
        isVisible: true
      }
    };
    jest.spyOn(appComponent.formService, 'getFormConfig').mockReturnValue(of(formConfigResponse));
    jest.spyOn(appComponent, 'checkPopupVisiblity');
    const nextSpy = jest.spyOn(appComponent.onboardingDataSubject, 'next');
    await appComponent.getOnboardingSkipStatus();

    expect(appComponent.onboardingData).toEqual(formConfigResponse);
    expect(nextSpy).toHaveBeenCalledWith(formConfigResponse);
    expect(appComponent.popupControlService.setOnboardingData).toHaveBeenCalledWith(appComponent.onboardingData);
    expect(appComponent.checkPopupVisiblity).toHaveBeenCalledWith(appComponent.onboardingData);
  });

  describe('checkPopupVisiblity', () => {
    it('should set flags to true when popups are enabled', () => {
      const onboardingData = {
        onboardingPopups: { isVisible: true },
        frameworkPopup: { isVisible: true },
        userTypePopup: { isVisible: true },
      };

      appComponent.checkPopupVisiblity(onboardingData);

      expect(appComponent.isOnboardingEnabled).toBe(true);
      expect(appComponent.isFWSelectionEnabled).toBe(true);
      expect(appComponent.isUserTypeEnabled).toBe(true);
    });

    it('should set flags to false when onboarding popup is disabled', () => {
      const onboardingData = {
        onboardingPopups: { isVisible: false },
        frameworkPopup: { isVisible: false, defaultFormatedName: 'Guest' },
        userTypePopup: { isVisible: false },
      };

      appComponent.checkPopupVisiblity(onboardingData);

      expect(appComponent.isOnboardingEnabled).toBe(false);
      expect(appComponent.isFWSelectionEnabled).toBe(false);
      expect(appComponent.isUserTypeEnabled).toBe(false);
      expect(appComponent.userService.setGuestUser).toHaveBeenCalledWith(true, onboardingData.frameworkPopup.defaultFormatedName);
    });
  })

});
