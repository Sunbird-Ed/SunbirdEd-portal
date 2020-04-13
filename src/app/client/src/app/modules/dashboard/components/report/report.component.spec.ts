import { UserService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReportService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  const fakeActivatedRoute = {
    params: of({ reportId: 'daily_metrics' }),
    snapshot: { data: { telemetry: { pageid: 'org-admin-dashboard', env: 'dashboard', type: 'view' } } }
  };
  const routerStub = { url: '/dashBoard/reports/daily_metrics' };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      providers: [ToasterService, UserService, NavigationHelperService, ReportService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useValue: routerStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
