import { UserService, CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, NavigationHelperService, ToasterService, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReportService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ISummaryObject } from '../../interfaces';
import { mockLatestReportSummary } from './report.component.spec.data';

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
  const resourceServiceMockData = {
    messages: {
      imsg: {
        reportSummaryAdded: 'Summary Added Successfully',
        reportPublished: 'Report Published Successfully'
      },
      emsg: {
        m0076: 'No data available to download ',
        m0005: 'Something went wrong, try later'
      },
      stmsg: {
        m0131: 'Could not find any reports',
        m0144: 'You do not have appropriate rights to access this page.'
      }
    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        reportSummary: 'Report Summary'
      }
    },
    languageSelected$: of({})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), TelemetryModule.forRoot(), CoreModule],
      providers: [ToasterService, UserService, NavigationHelperService, ReportService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useValue: routerStub },
        { provide: ResourceService, useValue: resourceServiceMockData }]
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

  it('should export the report as pdf', fakeAsync(() => {
    spyOn<any>(component, 'downloadReportAsPdf');
    component.downloadReport('pdf');
    tick(1500);
    expect(component['downloadReportAsPdf']).toHaveBeenCalled();
    expect(component['downloadReportAsPdf']).toHaveBeenCalledTimes(1);
    expect(component.hideElements).toBeTruthy();
  }));

  it('should export the report as image', fakeAsync(() => {
    spyOn<any>(component, 'downloadReportAsImage');
    component.downloadReport('img');
    tick(1500);
    expect(component['downloadReportAsImage']).toHaveBeenCalled();
    expect(component['downloadReportAsImage']).toHaveBeenCalledTimes(1);
    expect(component.hideElements).toBeTruthy();
  }));

  it('should open summary modal with parameters passed', () => {
    const params: ISummaryObject = {
      type: 'report', title: 'Add Report Summary', index: 2, chartId: 'chartid',
      summary: 'test summary'
    };
    component.openAddSummaryModal(params);
    expect(component.showSummaryModal).toBeTruthy();
    expect(component.inputForSummaryModal).toEqual(params);
  });

  it('should open report summary modal', () => {
    spyOn(component, 'openAddSummaryModal');
    component.openReportSummaryModal();
    expect(component.openAddSummaryModal).toHaveBeenCalled();
    expect(component.openAddSummaryModal).toHaveBeenCalledWith({
      title: 'Add Report Summary',
      type: 'report'
    });
  });

  it('should hide the summary modal', () => {
    component.closeSummaryModal();
    expect(component.showSummaryModal).toBeFalsy();
  });

  it('should toggle confirmation modal', () => {
    component.toggleConfirmationModal();
    expect(component.showConfirmationModal).toBeTruthy();
    component.toggleConfirmationModal();
    expect(component.showConfirmationModal).toBeFalsy();
  });

  it('should refresh the component', fakeAsync(() => {
    expect(component.showComponent).toBeTruthy();
    component['refreshComponent']();
    tick(10);
    expect(component.showComponent).toBeTruthy();
  }));

  it('should merge click streams', fakeAsync(() => {
    spyOn<any>(component, 'handleAddSummaryStreams').and.returnValue(of({}));
    spyOn<any>(component, 'handlePublishBtnStream').and.returnValue(of({}));
    spyOn<any>(component, 'refreshComponent');
    component['mergeClickEventStreams']();
    tick(10);
    expect(component['refreshComponent']).toHaveBeenCalled();
    expect(component['refreshComponent']).toHaveBeenCalledTimes(2);
  }));

  it('should get the latest summary for the report', done => {
    spyOn(reportService, 'getLatestSummary').and.returnValue(of(mockLatestReportSummary));
    component['getLatestSummary']('123').subscribe(res => {
      expect(reportService.getLatestSummary).toHaveBeenCalled();
      expect(reportService.getLatestSummary).toHaveBeenCalledWith({ reportId: '123' });
      expect(res).toBeDefined();
      expect(res).toEqual([{
        label: 'Report Summary',
        text: [mockLatestReportSummary[0].summary]
      }]);
      done();
    });
  });

  it('should not publish the report when clicked on No in confirmation modal', () => {
    component.showConfirmationModal = true;
    spyOn(component, 'toggleConfirmationModal').and.callThrough();
    spyOn(component['publishBtnStream$'], 'next');
    component.onPublish(false);
    expect(component.toggleConfirmationModal).toHaveBeenCalled();
    expect(component['publishBtnStream$'].next).not.toHaveBeenCalled();
    expect(component.showConfirmationModal).toBeFalsy();
  });

  it('should publish the report when clicked on Yes in confirmation modal', () => {
    component.showConfirmationModal = true;
    spyOn(component, 'toggleConfirmationModal').and.callThrough();
    spyOn(component['publishBtnStream$'], 'next');
    component.onPublish(true);
    expect(component.toggleConfirmationModal).toHaveBeenCalled();
    expect(component['publishBtnStream$'].next).toHaveBeenCalled();
    expect(component.showConfirmationModal).toBeFalsy();
  });

  it('should add summary', () => {
    spyOn(component['addSummaryBtnClickStream$'], 'next');
    component.onAddSummary({ title: 'Add Report Summary', type: 'report' } as ISummaryObject);
    expect(component['addSummaryBtnClickStream$'].next).toHaveBeenCalled();
  });
});
