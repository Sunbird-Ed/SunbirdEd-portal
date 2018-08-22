
import { of as observableOf } from 'rxjs';
import { ConfigService, ToasterService, ResourceService, SharedModule } from '@sunbird/shared';
import {
  UserService, LearnerService, CoursesService, PermissionService, TenantService, PublicDataService,
  ConceptPickerService, SearchService, ContentService, CoreModule, OrgDetailsService
} from '@sunbird/core';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { mockData } from './app.component.spec.data';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash';

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
      providers: [ToasterService, TenantService,
        UserService, ConfigService, LearnerService,
        PermissionService, ResourceService, CoursesService,
        TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, ConceptPickerService, SearchService, ContentService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    // fixture = TestBed.createComponent(AppComponent);
    // component = fixture.componentInstance;
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should config telemetry service for Anonymous Session', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(observableOf({}));
    spyOn(component.telemetryService, 'initialize').and.returnValue(observableOf({}));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.initializeAnonymousSession('sunbird');
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

  it('should config telemetry service for login Session', () => {
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData.success));
    spyOn(component.telemetryService, 'initialize').and.returnValue(observableOf({}));
    component.initializeLogedInsession();
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

  xit('Should subscribe to tenant service and retrieve title and favicon details', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData.success));
    // userService.initialize(true);
    const tenantService = TestBed.get(TenantService);
    spyOn(tenantService, 'get').and.returnValue(observableOf(mockData.tenantSuccess));
    spyOn(document, 'querySelector').and.returnValue({
      setAttribute: () => { }
    });
    fixture.detectChanges();
    expect(document.title).toBe(mockData.tenantSuccess.result.titleName);
    expect(document.querySelector).toHaveBeenCalled();
  });
  it('should set the version number', async(() => {
    spyOn(document, 'getElementById').and.callFake(() => {
      return {
        value: '1.9.0.1'
      };
    });
    component.ngOnInit();
    expect(component.version).toEqual('1.9.0');
  }));
});
