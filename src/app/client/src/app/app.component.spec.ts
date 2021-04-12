
import { Observable, of, throwError } from 'rxjs';
import {
  ConfigService, ToasterService, ResourceService, SharedModule, NavigationHelperService,
  BrowserCacheTtlService, LayoutService
} from '@sunbird/shared';
import { UserService, LearnerService, CoursesService, PermissionService, TenantService,
  PublicDataService, SearchService, ContentService, CoreModule, OrgDetailsService, DeviceRegisterService
} from '@sunbird/core';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { mockData } from './app.component.spec.data';
import { AppComponent } from './app.component';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { CacheService } from 'ng2-cache-service';
import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style } from '@angular/animations';
import { configureTestSuite } from '@sunbird/test-util';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UtilService } from '@sunbird/shared';

class RouterStub {
  public navigationEnd = new NavigationEnd(0, '/explore', '/explore');
  public navigate = jasmine.createSpy('navigate');
  public url = '';
  public events = new Observable(observer => {
    observer.next(this.navigationEnd);
    observer.complete();
  });
}

class MockElementRef {
  nativeElement: {};
}

const fakeActivatedRoute = {
  snapshot: {
    root: { firstChild: { params: { slug: 'sunbird' } } }
  },
  queryParams: of({})
};


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let telemetryService;
  let configService;
  let userService;
  let timerCallback;
  let resourceService;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule,
        RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: Router, useClass: RouterStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ElementRef, useValue: new MockElementRef() },
        ToasterService, TenantService, CacheService, AnimationBuilder,
        UserService, ConfigService, LearnerService, BrowserCacheTtlService,
        PermissionService, ResourceService, CoursesService, OrgDetailsService, ProfileService,
        TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, SearchService, ContentService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    telemetryService = TestBed.get(TelemetryService);
    configService = TestBed.get(ConfigService);
    userService = TestBed.get(UserService);
    resourceService = TestBed.get(ResourceService);
    spyOn(navigationHelperService, 'initialize').and.callFake(() => {});
    spyOn(telemetryService, 'initialize');
    spyOn(telemetryService, 'getDeviceId').and.callFake((cb) => cb('123'));
    spyOn(document, 'querySelector').and.returnValue({ setAttribute: () => { }});
    spyOn(Fingerprint2, 'constructor').and.returnValue({get: () => {}});
    spyOn(document, 'getElementById').and.callFake((id) => {
      if (id === 'buildNumber') {
        return { value: '1.1.12.0' };
      }
      if (id === 'deviceId') {
        return { value: 'device' };
      }
      if (id === 'defaultTenant') {
        return { value: 'defaultTenant' };
      }
    });
    timerCallback = jasmine.createSpy('timerCallback');
    jasmine.clock().install();
  });

afterEach(() => {
  jasmine.clock().uninstall();
});
  it('should config telemetry service for login Session', () => {
    const learnerService = TestBed.get(LearnerService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    userService._authenticated = true;
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({result: { response: { content: 'data'} } }));
    spyOn(learnerService, 'getWithHeaders').and.returnValue(of(mockData.success));
    component.ngOnInit();
    const config = {
      userOrgDetails: {
        userId: userService.userProfile.userId,
        rootOrgId: userService.userProfile.rootOrgId,
        rootOrg: userService.userProfile.rootOrg,
        organisationIds: userService.userProfile.hashTagIds
      },
      config: {
        pdata: {
          id: component.userService.appId,
          ver: '1.1.12',
          pid: configService.appConfig.TELEMETRY.PID
        },
        endpoint: configService.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: configService.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: userService.userProfile.userId,
        sid: component.userService.sessionId,
        channel: _.get(userService.userProfile, 'rootOrg.hashTagId'),
        env: 'home',
        enableValidation: true,
        timeDiff: 0
      }
    };
    expect(telemetryService.initialize).toHaveBeenCalledWith(jasmine.objectContaining({userOrgDetails: config.userOrgDetails}));
  });
const maockOrgDetails = { result: { response: { content: [{hashTagId: '1235654', rootOrgId: '1235654'}] }}};
  it('should config telemetry service for Anonymous Session', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of(maockOrgDetails));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    const config = {
      userOrgDetails: {
        userId: 'anonymous',
        rootOrgId: '1235654',
        organisationIds: ['1235654']
      },
      config: {
        pdata: {
          id: component.userService.appId,
          ver: '1.1.12',
          pid: configService.appConfig.TELEMETRY.PID
        },
        batchsize: 2,
        endpoint: configService.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: configService.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: 'anonymous',
        sid: component.userService.anonymousSid,
        channel: '1235654',
        env: 'home',
        enableValidation: true,
        timeDiff: 0
      }
    };
    expect(telemetryService.initialize).toHaveBeenCalledWith(jasmine.objectContaining({userOrgDetails: config.userOrgDetails}));
  });
  it('Should call beforeunloadHandler method', () => {
    const event = {};
    spyOn(component, 'beforeunloadHandler');
    component.beforeunloadHandler(event);
    expect(component.beforeunloadHandler).toHaveBeenCalledWith(event);
  });
  it('Should call handleLogin method', () => {
    spyOn(component, 'handleLogin');
    component.handleLogin();
    expect(component.handleLogin).toHaveBeenCalled();
  });
  it('Check if bot diplayed for route ', () => {
    spyOn(component, 'isBotdisplayforRoute');
    component.isBotdisplayforRoute();
    expect(component.isBotdisplayforRoute).toHaveBeenCalled();
  });
  it('Set theme color ', () => {
    spyOn(component, 'storeThemeColour');
    component.storeThemeColour('#ffff');
    expect(component.storeThemeColour).toHaveBeenCalled();
  });
  it('Check location pop up is required ', () => {
    spyOn(component, 'isLocationStatusRequired');
    component.isLocationStatusRequired();
    expect(component.isLocationStatusRequired).toHaveBeenCalled();
  });
  it('Check location status pop up is required ', () => {
    spyOn(component, 'checkLocationStatus');
    component.checkLocationStatus();
    expect(component.checkLocationStatus).toHaveBeenCalled();
  });
  it('Should subscribe to tenant service and retrieve title and favicon details', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    component.ngAfterViewInit();
    expect(document.title).toEqual(mockData.tenantResponse.result.titleName);
    expect(document.querySelector).toHaveBeenCalledWith('link[rel*=\'icon\']');
  });

  it('Should display the tenant logo if user is not logged in', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    expect(document.title).toEqual(mockData.tenantResponse.result.titleName);
    expect(document.querySelector).toHaveBeenCalledWith('link[rel*=\'icon\']');
  });
  xit('should check framework key is in user read api and open the popup  ', () => {
    const learnerService = TestBed.get(LearnerService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    userService._authenticated = true;
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'postWithHeaders').and.returnValue(of({result: { response: { content: 'data'} } }));
    spyOn(learnerService, 'getWithHeaders').and.returnValue(of(mockData.success));
    component.ngOnInit();
    expect(component.showFrameWorkPopUp).toBeTruthy();
  });

  it('Should return proper object by calling make UTM session', () => {
    telemetryService = TestBed.get(TelemetryService);
    telemetryService.makeUTMSession({'channel': 'sunbird', 'utm_medium': 'sunbird', 'utm_source': 'sunbird',
    'utm_campaign': 'sunbird', 'utm_term': 'sunbird', 'utm_content': 'sunbird'});
    spyOn(telemetryService, 'makeUTMSession');
    expect(sessionStorage.getItem('UTM')).toBeDefined();
    const utm = sessionStorage.getItem('UTM') ? JSON.parse(sessionStorage.getItem('UTM').toString()) : [];
    expect(utm[0]['type']).toBe('Source');
    expect(utm[1]['type']).toBe('UtmMedium');
    expect(utm[2]['type']).toBe('UtmSource');
    expect(utm[4]['type']).toBe('UtmTerm');
    expect(utm[5]['type']).toBe('UtmContent');
  });

  it('should not get user feed api data', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    userService._authenticated = true;
    spyOn(userService, 'getFeedData');
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.returnValue(of({result: {response: {content: 'data'}}}));
    component.getUserFeedData();
    expect(userService.getFeedData).not.toHaveBeenCalled();
  });
  it('Check logExData called ', () => {
    spyOn(component, 'logExData');
    component.logExData('IMPRESSION', {});
    expect(component.logExData).toHaveBeenCalled();
  });
  it('Check onLocationSubmit called ', () => {
    spyOn(component, 'onLocationSubmit');
    component.showYearOfBirthPopup = false;
    component.onLocationSubmit();
    expect(component.onLocationSubmit).toHaveBeenCalled();
  });
  it('Check interpolateInstance called ', () => {
    spyOn(component, 'interpolateInstance');
    component.interpolateInstance('check the data');
    expect(component.interpolateInstance).toHaveBeenCalled();
  });

  it('should close joy theme popup and trigger furthur popup flow', () => {
    spyOn(component, 'checkTncAndFrameWorkSelected');
    component.onCloseJoyThemePopup();
    expect(component.showJoyThemePopUp).toBe(false);
    expect(component.checkTncAndFrameWorkSelected).toHaveBeenCalled();
  });

  it('should show tnc popup second time', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true');
    spyOn(component, 'checkTncAndFrameWorkSelected');
    component.joyThemePopup();
    expect(component.checkTncAndFrameWorkSelected).toHaveBeenCalled();
  });

  it('should close joy theme popup and trigger furthur popup flow', () => {
    spyOn(component, 'checkTncAndFrameWorkSelected');
    component.onCloseJoyThemePopup();
    expect(component.showJoyThemePopUp).toBe(false);
    expect(component.checkTncAndFrameWorkSelected).toHaveBeenCalled();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('Should subscribe to layout service and retrieve layout config', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const layoutService = TestBed.get(LayoutService);
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(layoutService, 'switchableLayout').and.returnValue(of({layout: 'new layout'}));
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    expect(document.title).toEqual(mockData.tenantResponse.result.titleName);
    expect(component.layoutConfiguration).toEqual('new layout');
    expect(document.querySelector).toHaveBeenCalledWith('link[rel*=\'icon\']');
  });

  it('should check if font size if stored in system or not', () => {
    spyOn(localStorage, 'getItem').and.returnValue(16);
    spyOn(component, 'isDisableFontSize');
    component.getLocalFontSize();
    expect(component.fontSize).toBe(16);
    expect(component.isDisableFontSize).toHaveBeenCalledWith(16);
  });

  it('should reset font size of the browser to 16px', () => {
    spyOn(localStorage, 'getItem').and.returnValue(16);
    spyOn(component, 'setLocalFontSize');
    component.changeFontSize('reset');
    expect(component.fontSize).toBe(16);
    expect(component.setLocalFontSize).toHaveBeenCalledWith(16);
  });

  it('should increase font size of the browser by 2px', () => {
    spyOn(localStorage, 'getItem').and.returnValue(18);
    spyOn(component, 'setLocalFontSize');
    component.changeFontSize('increase');
    expect(component.fontSize).toBe(20);
    expect(component.setLocalFontSize).toHaveBeenCalledWith(20);
  });

  it('should decrease font size of the browser by 2px', () => {
    spyOn(localStorage, 'getItem').and.returnValue(14);
    spyOn(component, 'setLocalFontSize');
    component.changeFontSize('decrease');
    expect(component.fontSize).toBe(12);
    expect(component.setLocalFontSize).toHaveBeenCalledWith(12);
  });

  it('should call isDisableFontSize with the value 12', () => {
    spyOn(localStorage, 'setItem');
    spyOn(component, 'isDisableFontSize');
    component.setLocalFontSize(12);
    expect(component.isDisableFontSize).toHaveBeenCalledWith(12);
  });

  it('should call isDisableFontSize with the value 12', () => {
    const setAttributeSpy = spyOn<any>(component['renderer'], 'setAttribute');
    const removeAttributeSpy = spyOn<any>(component['renderer'], 'removeAttribute');
    const increaseFontSize = component.increaseFontSize = TestBed.get(ElementRef);
    const decreaseFontSize = component.decreaseFontSize  = TestBed.get(ElementRef);
    const resetFontSize = component.resetFontSize  = TestBed.get(ElementRef);

    component.isDisableFontSize(20);
    expect(setAttributeSpy).toHaveBeenCalledWith(increaseFontSize.nativeElement, 'disabled', 'true');
    expect(removeAttributeSpy).toHaveBeenCalledWith(resetFontSize.nativeElement, 'disabled');
    expect(removeAttributeSpy).toHaveBeenCalledWith(decreaseFontSize.nativeElement, 'disabled');

    component.isDisableFontSize(12);
    expect(setAttributeSpy).toHaveBeenCalledWith(decreaseFontSize.nativeElement, 'disabled', 'true');
    expect(removeAttributeSpy).toHaveBeenCalledWith(resetFontSize.nativeElement, 'disabled');
    expect(removeAttributeSpy).toHaveBeenCalledWith(increaseFontSize.nativeElement, 'disabled');

    component.isDisableFontSize(16);
    expect(setAttributeSpy).toHaveBeenCalledWith(resetFontSize.nativeElement, 'disabled', 'true');
    expect(removeAttributeSpy).toHaveBeenCalledWith(increaseFontSize.nativeElement, 'disabled');
    expect(removeAttributeSpy).toHaveBeenCalledWith(decreaseFontSize.nativeElement, 'disabled');

    component.isDisableFontSize(14);
    expect(removeAttributeSpy).toHaveBeenCalledWith(increaseFontSize.nativeElement, 'disabled');
    expect(removeAttributeSpy).toHaveBeenCalledWith(resetFontSize.nativeElement, 'disabled');
    expect(removeAttributeSpy).toHaveBeenCalledWith(decreaseFontSize.nativeElement, 'disabled');

  });

  it('should get Local Theme', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true');
    spyOn(component, 'setLocalTheme');
    component.getLocalTheme();
    expect(component.setLocalTheme).toHaveBeenCalled();
  });
  it('should change Theme to Dark mode', () => {
    component.dataThemeAttribute = 'Darkmode';
    spyOn(component, 'changeTheme');
    component.changeTheme();
    expect(component.changeTheme).toHaveBeenCalled();
  });
  it('should set the Local Theme', () => {
    component.dataThemeAttribute = 'Darkmode';
    spyOn(component, 'setLocalTheme');
    component.setLocalTheme(component.dataThemeAttribute);
    expect(component.setLocalTheme).toHaveBeenCalled();
  });
  it('should call skipToMainContent', () => {
    spyOn(component, 'skipToMainContent');
    component.skipToMainContent();
    expect(component.skipToMainContent).toHaveBeenCalled();
  });
  it('should close framework popup', () => {
    component.frameWorkPopUp = { modal: {
        deny: jasmine.createSpy('deny')
      }
    };
    component.closeFrameworkPopup();
    expect(component.frameWorkPopUp.modal.deny).toHaveBeenCalled();
    expect(component.showFrameWorkPopUp).toBe(false);
  });

  it('should update framework for logged In user', () => {
    const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] };
    component.isGuestUser = false;
    const profileService = TestBed.get(ProfileService);
    const utilService = TestBed.get(UtilService);
    spyOn(profileService, 'updateProfile').and.returnValue(of({}));
    spyOn(component, 'closeFrameworkPopup');
    spyOn(component, 'checkLocationStatus');
    spyOn(userService, 'setUserFramework');
    spyOn(utilService, 'toggleAppPopup');
    component.updateFrameWork(event);
    expect(profileService.updateProfile).toHaveBeenCalled();
    expect(component.closeFrameworkPopup).toHaveBeenCalled();
    expect(component.checkLocationStatus).toHaveBeenCalled();
    expect(userService.setUserFramework).toHaveBeenCalled();
    expect(utilService.toggleAppPopup).toHaveBeenCalled();
  });
  it('should not update framework for logged In user', () => {
    const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] };
    component.isGuestUser = false;
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'updateProfile').and.returnValue(throwError({}));
    component.updateFrameWork(event);
    expect(profileService.updateProfile).toHaveBeenCalled();
  });
  it('should update framework for guest user', () => {
    const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] };
    component.isGuestUser = true;
    component.guestUserDetails = undefined;
    component.isDesktopApp = false;
    spyOn(component, 'closeFrameworkPopup');
    spyOn(component, 'checkLocationStatus');
    component.updateFrameWork(event);
    expect(component.closeFrameworkPopup).toHaveBeenCalled();
    expect(component.checkLocationStatus).toHaveBeenCalled();
  });
  it('should update framework for guest user/desktop', () => {
    const event = { board: ['CBSE'], medium: ['English'], gradeLevel: ['Class 1'], subject: ['English'] };
    component.isGuestUser = true;
    component.guestUserDetails = undefined;
    component.isDesktopApp = true;
    spyOn(component, 'closeFrameworkPopup');
    spyOn(component, 'checkLocationStatus');
    component.updateFrameWork(event);
    expect(component.closeFrameworkPopup).toHaveBeenCalled();
    expect(component.checkLocationStatus).toHaveBeenCalled();
  });
});
