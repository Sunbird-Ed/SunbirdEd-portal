
import { of as observableOf, Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService, ToasterService, ResourceService, SharedModule } from '@sunbird/shared';
import {
  UserService, LearnerService, CoursesService, PermissionService, TenantService,
  ConceptPickerService, SearchService, ContentService, CoreModule
} from '@sunbird/core';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { mockData } from './app.component.spec.data';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { RouterTestingModule } from '@angular/router/testing';

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
