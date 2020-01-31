
import { Observable, of , throwError} from 'rxjs';
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
import { OnboardingService , ConnectionService} from './modules/offline';

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
        PermissionService,  CoursesService, OrgDetailsService, ProfileService,
        TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, SearchService, ConnectionService,
         ContentService, OnboardingService],
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
        return { value: '1.0.2' };
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

const maockOrgDetails = { result: { response: { content: [{hashTagId: '1235654', rootOrgId: '1235654'}] }}};
  it('should config telemetry service for Anonymous Session', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const onboardingService = TestBed.get(OnboardingService);
    spyOn(onboardingService, 'getUser').and.returnValue(of(undefined));
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
    expect(onboardingService.getUser).toHaveBeenCalled();
    expect(telemetryService.initialize).toHaveBeenCalledWith(jasmine.objectContaining({userOrgDetails: config.userOrgDetails}));
  });

  it('Should subscribe to tenant service and retrieve title and favicon details', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const onboardingService = TestBed.get(OnboardingService);
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    spyOn(onboardingService, 'getUser').and.returnValue(of(undefined));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    expect(document.title).toEqual(mockData.tenantResponse.result.titleName);
    expect(document.querySelector).toHaveBeenCalledWith('link[rel*=\'icon\']');
    expect(onboardingService.getUser).toHaveBeenCalled();
  });

  it('Should display the tenant logo if user is not logged in', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const onboardingService = TestBed.get(OnboardingService);
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    spyOn(onboardingService, 'getUser').and.returnValue(of(undefined));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    expect(document.title).toEqual(mockData.tenantResponse.result.titleName);
    expect(document.querySelector).toHaveBeenCalledWith('link[rel*=\'icon\']');
  });

  it('should initialize ShepherdData', () => {
    resourceService.messages = mockData.resourceBundle.messages;
    resourceService.frmelmnts = mockData.resourceBundle.frmelmnts;
    spyOn(component, 'interpolateInstance');
    component.initializeShepherdData();
    expect(component.interpolateInstance).toHaveBeenCalledTimes(7);
  });

  it('ShepherdData should match with resourcedata', () => {
    resourceService.messages = mockData.resourceBundle.messages;
    resourceService.frmelmnts = mockData.resourceBundle.frmelmnts;
    component.initializeShepherdData();
    expect(component.shepherdData[0].id).toBe(resourceService.frmelmnts.instn.t0086);
    expect(component.shepherdData[1].options.title).toBe(resourceService.frmelmnts.instn.t0087);
    expect(component.shepherdData[0].options.text[0]).toContain([resourceService.frmelmnts.instn.t0090.replace('{instance}',
                                                                                              component.instance.toUpperCase())]);
    expect(component.shepherdData[0].options.text[0]).toContain(component.instance.toUpperCase());
  });

  it('ShepherdData should match with given instance', () => {
    resourceService.messages = mockData.resourceBundle.messages;
    resourceService.frmelmnts = mockData.resourceBundle.frmelmnts;
    component.instance = 'preprod';
    component.initializeShepherdData();
    expect(component.shepherdData[0].options.text[0]).toContain(component.instance.toUpperCase());
  });

  it('should check the build Number', () => {
    const buildNumber = document.getElementById('buildNumber');
    expect(document.getElementById).toHaveBeenCalled();
    expect(buildNumber['value']).toEqual('1.0.2');
  });

it('should show toaster message when connected to internet  ', () => {
  resourceService.messages = mockData.resourceBundle.messages;
    const connectionService = TestBed.get(ConnectionService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    spyOn(toasterService, 'success').and.returnValue(of(mockData.resourceBundle.messages.stmsg.desktop.onlineStatus));
    component.handleOnlineStatus();
    expect(component.isConnected).toBeTruthy();
    expect(toasterService.success).toHaveBeenCalled();
  });

  it('should show toaster message when you are not connected to internet  ', () => {
    resourceService.messages = mockData.resourceBundle.messages;
      const connectionService = TestBed.get(ConnectionService);
      const toasterService = TestBed.get(ToasterService);
      spyOn(connectionService, 'monitor').and.returnValue(of(false));
      spyOn(toasterService, 'error').and.returnValue(throwError(mockData.resourceBundle.messages.emsg.desktop.offlineStatus));
      component.handleOnlineStatus();
      expect(component.isConnected).toBeFalsy();
      expect(toasterService.error).toHaveBeenCalled();
    });
});
