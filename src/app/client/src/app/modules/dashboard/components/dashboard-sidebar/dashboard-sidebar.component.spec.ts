import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSidebarComponent } from './dashboard-sidebar.component';
import { configureTestSuite } from '@sunbird/test-util';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardSidebarComponent', () => {
  let component: DashboardSidebarComponent;
  let fixture: ComponentFixture<DashboardSidebarComponent>;
  configureTestSuite();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSidebarComponent ],
      imports: [RouterTestingModule, SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule],
      providers: [ TelemetryService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.courseStatsEdata.id).toEqual('course-dashboard');
    expect(component.courseBatchesEdata.id).toEqual('course-batches');
    expect(component.courseCertificatesEdata.id).toEqual('course-reissue-cert');
  });
});
