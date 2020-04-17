import { UserService, CoreModule } from '@sunbird/core';
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
    snapshot: {
      params: { reportId: 'daily_metrics' },
      data:
        { telemetry: { pageid: 'org-admin-dashboard', env: 'dashboard', type: 'view' } }
    }
  };
  const routerStub = { url: '/dashBoard/reports/daily_metrics' };
  let reportService: ReportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), TelemetryModule.forRoot(), CoreModule],
      providers: [ToasterService, UserService, NavigationHelperService, ReportService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useValue: routerStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    reportService = TestBed.get(ReportService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should download csv file', () => {
    spyOn(reportService, 'downloadReport').and.returnValue(of('signedurl'));
    spyOn(window, 'open');
    const pathToCsv = '/reports/sunbird/file.csv';
    component.setDownloadUrl(pathToCsv);
    component.downloadCSV();
    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(reportService.downloadReport).toHaveBeenCalled();
    expect(reportService.downloadReport).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith('signedurl', '_blank');
    expect(reportService.downloadReport).toHaveBeenCalledWith(pathToCsv);
  });

  it('should set download url', () => {
    const pathToCsv = '/reports/sunbird/file.csv';
    component.setDownloadUrl(pathToCsv);
    expect(component['downloadUrl']).toBeDefined();
    expect(component['downloadUrl']).toBe(pathToCsv);
  });

});
