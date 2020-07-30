import { CoreModule } from '@sunbird/core';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSidebarComponent } from './dashboard-sidebar.component';
import { configureTestSuite } from '@sunbird/test-util';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';

describe('DashboardSidebarComponent', () => {
  let component: DashboardSidebarComponent;
  let fixture: ComponentFixture<DashboardSidebarComponent>;
  let debugElement: DebugElement;
  configureTestSuite();

  const fakeActivatedRoute = {
    snapshot: {
      params: of ({courseId: 'do_112470675618004992181' }),
      data: {
        telemetry: {
          env: 'course', pageid: 'course-stats', type: 'view', object: { type: 'course', ver: '1.0' }
        }
      }
    }
  };

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        dashBoardTitle: 'dashboard',
        batches: 'batches',
        certificates: 'certificates'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSidebarComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule, CoreModule, RouterTestingModule.withRoutes([])],
      providers: [ TelemetryService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSidebarComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create',  () => {
    expect(component).toBeTruthy();
    spyOn(component, 'setTelemetryData');
    component.ngOnInit();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it ('should intialize telemetrydata', () => {
    component.setTelemetryData();
    expect(component.courseStatsEdata.id).toEqual('course-dashboard');
    expect(component.courseBatchesEdata.id).toEqual('course-batches');
    expect(component.courseCertificatesEdata.id).toEqual('course-reissue-cert');
  });
});
