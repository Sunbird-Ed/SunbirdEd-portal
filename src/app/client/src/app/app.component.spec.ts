
import { Observable, of } from 'rxjs';
import { ConfigService, ToasterService, ResourceService, SharedModule, NavigationHelperService } from '@sunbird/shared';
import {
  UserService, LearnerService, CoursesService, PermissionService, TenantService, PublicDataService,
  ConceptPickerService, SearchService, ContentService, CoreModule, OrgDetailsService, DeviceRegisterService
} from '@sunbird/core';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { mockData } from './app.component.spec.data';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash';
import { ProfileService } from '@sunbird/profile';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

class RouterStub {
  public navigationEnd = new NavigationEnd(0, '/explore', '/explore');
  public navigate = jasmine.createSpy('navigate');
  public events = new Observable(observer => {
    observer.next(this.navigationEnd);
    observer.complete();
  });
}
const fakeActivatedRoute = {
  snapshot: {
    root: { firstChild: { params: { slug: 'sunbird' } } }
  }
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule.forRoot(), CoreModule.forRoot(),
        RouterTestingModule],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: Router, useClass: RouterStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        ToasterService, TenantService,
        UserService, ConfigService, LearnerService,
        PermissionService, ResourceService, CoursesService, OrgDetailsService, ProfileService,
        TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, ConceptPickerService, SearchService, ContentService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'initialize').and.callFake(() => {});
    spyOn(component.telemetryService, 'initialize');
    spyOn(component, 'setDeviceId').and.returnValue(of('device'));
    spyOn(document, 'querySelector').and.returnValue({ setAttribute: () => { }});
    spyOn(Fingerprint2, 'constructor').and.returnValue({get: () => {}});
    spyOn(document, 'getElementById').and.callFake((id) => {
      if (id === 'buildNumber') {
        return { value: '1.9.0.1' };
      }
      if (id === 'deviceId') {
        return { value: 'device' };
      }
      if (id === 'defaultTenant') {
        return { value: 'defaultTenant' };
      }
    });
  });

  it('should config telemetry service for login Session', () => {
    const learnerService = TestBed.get(LearnerService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const userService = TestBed.get(UserService);
    userService._authenticated = true;
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({result: { response: { content: 'data'} } }));
    spyOn(learnerService, 'get').and.returnValue(of(mockData.success));
    component.ngOnInit();
    const config = {
      userOrgDetails: {
        userId: component.userProfile.userId,
        rootOrgId: component.userProfile.rootOrgId,
        rootOrg: component.userProfile.rootOrg,
        organisationIds: component.userProfile.hashTagIds
      },
      config: {
        pdata: {
          id: component.userService.appId,
          ver: component.version,
          pid: component.config.appConfig.TELEMETRY.PID
        },
        endpoint: component.config.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: component.config.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: component.userProfile.userId,
        sid: component.userService.sessionId,
        channel: _.get(component.userProfile, 'rootOrg.hashTagId'),
        env: 'home',
        enableValidation: true
      }
    };
    expect(component.telemetryService.initialize).toHaveBeenCalledWith(config);
  });
  it('should call register Device api for login Session', () => {
    const learnerService = TestBed.get(LearnerService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const userService = TestBed.get(UserService);
    const deviceRegisterService = TestBed.get(DeviceRegisterService);
    userService._authenticated = true;
    spyOn(deviceRegisterService, 'registerDevice');
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({result: { response: { content: 'data'} } }));
    spyOn(learnerService, 'get').and.returnValue(of(mockData.success));
    component.ngOnInit();
    expect(deviceRegisterService.registerDevice).toHaveBeenCalledWith('b00bc992ef25f1a9a8d63291e20efc8d');
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
          ver: component.version,
          pid: component.config.appConfig.TELEMETRY.PID
        },
        endpoint: component.config.urlConFig.URLS.TELEMETRY.SYNC,
        apislug: component.config.urlConFig.URLS.CONTENT_PREFIX,
        host: '',
        uid: 'anonymous',
        sid: component.userService.anonymousSid,
        channel: '1235654',
        env: 'home',
        enableValidation: true
      }
    };
    expect(component.telemetryService.initialize).toHaveBeenCalledWith(config);
  });
  it('should call register Device api for Anonymous Session', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const deviceRegisterService = TestBed.get(DeviceRegisterService);
    spyOn(deviceRegisterService, 'registerDevice');
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    expect(deviceRegisterService.registerDevice).toHaveBeenCalledWith('1235654');
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
  it('should check framework key is in user read api and open the popup  ', async(() => {
    const learnerService = TestBed.get(LearnerService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const userService = TestBed.get(UserService);
    userService._authenticated = true;
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({result: { response: { content: 'data'} } }));
    spyOn(learnerService, 'get').and.returnValue(of(mockData.success));
    component.ngOnInit();
    expect(component.showFrameWorkPopUp).toBeTruthy();
  }));

});
