
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import {
  UserService, LearnerService, CoursesService, PermissionService, TenantService,
  TelemetryService, TELEMETRY_PROVIDER, ConceptPickerService, SearchService, ContentService
} from '@sunbird/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { mockData } from './app.component.spec.data';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule],
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

  it('should create the app', async(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('Should subscribe to tenant service and retrieve title and favicon details', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockData.success));
    userService.initialize();
    const tenantService = TestBed.get(TenantService);
    spyOn(tenantService, 'get').and.returnValue(Observable.of(mockData.tenantSuccess));
    spyOn(document, 'querySelector').and.returnValue({
      setAttribute: () => { }
    });
    component.ngOnInit();
    expect(document.title).toBe(mockData.tenantSuccess.result.titleName);
    expect(document.querySelector).toHaveBeenCalled();
  });
});
