
import { Observable, of } from 'rxjs';
import { ConfigService, ToasterService, ResourceService, SharedModule, NavigationHelperService,
  BrowserCacheTtlService } from '@sunbird/shared';
import { UserService, LearnerService, CoursesService, PermissionService, TenantService,
  PublicDataService, SearchService, ContentService, CoreModule, OrgDetailsService, DeviceRegisterService
} from '@sunbird/core';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { mockData } from './app.component.spec.data';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash-es';
import { ProfileService } from '@sunbird/profile';
import { CacheService } from 'ng2-cache-service';
import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style } from '@angular/animations';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

class RouterStub {
  public navigationEnd = new NavigationEnd(0, '/explore', '/explore');
  public navigate = jasmine.createSpy('navigate');
  public url = '';
  public events = new Observable(observer => {
    observer.next(this.navigationEnd);
    observer.complete();
  });
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule,
        RouterTestingModule],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: Router, useClass: RouterStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
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
  it('should not call register Device api for login Session', () => {
    const learnerService = TestBed.get(LearnerService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const deviceRegisterService = TestBed.get(DeviceRegisterService);
    userService._authenticated = true;
    spyOn(deviceRegisterService, 'initialize');
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({result: { response: { content: 'data'} } }));
    spyOn(learnerService, 'getWithHeaders').and.returnValue(of(mockData.success));
    component.ngOnInit();
    expect(deviceRegisterService.initialize).toHaveBeenCalledTimes(0);
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
  it('should not call register Device api for Anonymous Session', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const deviceRegisterService = TestBed.get(DeviceRegisterService);
    spyOn(deviceRegisterService, 'initialize');
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    expect(deviceRegisterService.initialize).toHaveBeenCalledTimes(0);
  });

  it('Should subscribe to tenant service and retrieve title and favicon details', () => {
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
});
