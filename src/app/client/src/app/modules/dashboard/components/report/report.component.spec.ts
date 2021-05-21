import { DashboardModule } from '@sunbird/dashboard';
import { UserService, CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, NavigationHelperService, ToasterService, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ReportComponent } from './report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReportService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ISummaryObject } from '../../interfaces';
import { mockLatestReportSummary, mockReportObj,chartData,filters } from './report.component.spec.data';
import { mockParameterizedReports } from '../list-all-reports/list-all-reports.component.spec.data';
describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  const fakeActivatedRoute = {
    params: of({ reportId: 'daily_metrics', hash: '123#' }),
    queryParams: of({}),
    snapshot: {
      params: { reportId: 'daily_metrics', hash: '123#' },
      queryParams: { materialize: false },
      data:
        { telemetry: { pageid: 'org-admin-dashboard', env: 'dashboard', type: 'view' } }
    }
  };
  const routerStub = { url: '/dashBoard/reports/daily_metrics', navigate: () => Promise.resolve(true) };
  let reportService: ReportService;
  const resourceServiceMockData = {
    messages: {
      imsg: {
        reportSummaryAdded: 'Summary Added Successfully',
        reportPublished: 'Report Published Successfully',
        reportRetired: 'Report Retired Successfully',
        confirmReportPublish: 'Are you sure you want to publish the report ?',
        confirmRetirePublish: 'Are you sure you want to retire the report ?'
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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), TelemetryModule.forRoot(), CoreModule, DashboardModule],
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
      title: 'Update Report Summary',
      type: 'report'
    });
  });

  it('should hide the summary modal', () => {
    component.closeSummaryModal();
    expect(component.showSummaryModal).toBeFalsy();
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
      expect(reportService.getLatestSummary).toHaveBeenCalledWith({ reportId: '123', hash: undefined });
      expect(res).toBeDefined();
      expect(res).toEqual([{
        label: 'Update Report Summary',
        text: [mockLatestReportSummary[0].summary],
        createdOn: mockLatestReportSummary[0].createdon
      }]);
      done();
    });
  });


  describe('should handle confirmation modal events', () => {

    beforeEach(() => {
      spyOn<any>(component, 'closeConfirmationModal');
      component.confirmationPopupInput = {
        title: 'Confirm',
        body: 'Are you sure you want to publish the report?',
        event: 'publish'
      };
    });

    it('should handle publish event', () => {
      spyOn(component, 'onPublish');
      component.confirmationPopupInput['event'] = 'publish';
      component.handleConfirmationEvent(true);
      expect(component.onPublish).toHaveBeenCalled();
      expect(component['closeConfirmationModal']).toHaveBeenCalled();
    });

    it('should handle retire event', () => {
      spyOn(component, 'onRetire');
      component.confirmationPopupInput.event = 'retire';
      component.handleConfirmationEvent(true);
      expect(component.onRetire).toHaveBeenCalled();
      expect(component['closeConfirmationModal']).toHaveBeenCalled();
    });

    it('should handle false event', () => {
      component.handleConfirmationEvent(false);
      expect(component['closeConfirmationModal']).toHaveBeenCalled();
    });

  });

  it('should publish the non parameterized report when clicked on Yes in confirmation modal', done => {
    component.report = {};
    spyOn<any>(component, 'handlePublishBtnStream').and.callThrough();
    spyOn<any>(component, 'refreshComponent');
    spyOn(reportService, 'publishReport').and.returnValue(of({}));
    spyOn(component['publishBtnStream$'], 'next').and.callThrough();

    component['publishBtnStream$'].subscribe(res => {
      expect(component['publishBtnStream$'].next).toHaveBeenCalled();
      expect(component['publishBtnStream$'].next).toHaveBeenCalledWith(true);
      expect(reportService.publishReport).toHaveBeenCalled();
      expect(reportService.publishReport).toHaveBeenCalledWith('daily_metrics', undefined);
      expect(component['refreshComponent']).toHaveBeenCalled();
      expect(component.report.status).toBe('live');
      done();
    });
    component.onPublish(true);
  });


  it('should retire the non parameterized report when clicked on Yes in confirmation modal', done => {
    component.report = {};
    component['mergeClickEventStreams']();
    spyOn<any>(component, 'handleRetireBtnStream').and.callThrough();
    spyOn<any>(component, 'refreshComponent');
    spyOn(reportService, 'retireReport').and.returnValue(of({}));
    spyOn(component['retireBtnStream$'], 'next').and.callThrough();
    component['retireBtnStream$'].subscribe(res => {
      expect(component['retireBtnStream$'].next).toHaveBeenCalled();
      expect(component['retireBtnStream$'].next).toHaveBeenCalledWith(true);
      expect(reportService.retireReport).toHaveBeenCalled();
      expect(reportService.retireReport).toHaveBeenCalledWith('daily_metrics', undefined);
      expect(component['refreshComponent']).toHaveBeenCalled();
      expect(component.report.status).toBe('retired');
      done();
    });

    component.onRetire(true);
  });

  it('should open confirmation modal when clicked on publish button', () => {
    component.openConfirmationModal('publish');
    expect(component.confirmationPopupInput).toEqual({
      title: 'Confirm',
      body: resourceServiceMockData.messages.imsg.confirmReportPublish,
      event: 'publish'
    });
    expect(component.showConfirmationModal).toBeTruthy();
  });

  it('should open confirmation modal when clicked on retire button', () => {
    component.openConfirmationModal('retire');
    expect(component.confirmationPopupInput).toEqual({
      title: 'Confirm',
      body: resourceServiceMockData.messages.imsg.confirmRetirePublish,
      event: 'retire'
    });
    expect(component.showConfirmationModal).toBeTruthy();
  });

  it('should close confirmation modal', () => {
    component['closeConfirmationModal']();
    expect(component.showConfirmationModal).toBeFalsy();
  });

  it('should add summary', () => {
    spyOn(component['addSummaryBtnClickStream$'], 'next');
    component.onAddSummary({ title: 'Add Report Summary', type: 'report' } as ISummaryObject);
    expect(component['addSummaryBtnClickStream$'].next).toHaveBeenCalled();
  });

  it('should set the parameters hash', () => {
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(true);
    spyOn(reportService, 'isReportParameterized').and.returnValue(false);
    component['setParametersHash'] = mockReportObj;
    expect(component['hash']).toBe('123#');
  });

  it('should set the parameters hash for super admin', () => {
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(true);
    spyOn(reportService, 'isReportParameterized').and.returnValue(false);
    component['setParametersHash'] = mockReportObj;
    expect(component['hash']).toBe('123#');
  });

  it('should set the parameters hash for non super admin', () => {
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(false);
    spyOn(reportService, 'isReportParameterized').and.returnValue(true);
    component['setParametersHash'] = mockReportObj;
    expect(component['hash']).toBe('123');
  });

  it('should set the parameters hash for non super admin and if hashed_val is not present in the reports', () => {
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(false);
    spyOn(reportService, 'isReportParameterized').and.returnValue(true);
    spyOn(reportService, 'getParametersHash').and.returnValue('123');
    delete mockReportObj.hashed_val;
    component['setParametersHash'] = mockReportObj;
    expect(component['hash']).toBe('123');
    expect(reportService.getParametersHash).toHaveBeenCalled();
  });

  it('should navigate to the list page', () => {
    spyOn(component['router'], 'navigate');
    component.gotoListPage();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/dashBoard/reports']);
  });

  it('should navigate with updated parameters hash and reload the component', () => {
    spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    const input = {
      hashed_val: '123',
      materialize: true
    };
    component.handleParameterChange(input);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/dashBoard/reports', 'daily_metrics', '123'],
      { queryParams: { materialize: true } });
  });

  it('should parameters value for dropdown for super admin', done => {
    spyOn(reportService, 'fetchReportById').and.returnValue(of(mockParameterizedReports));
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(true);
    spyOn(reportService, 'getMaterializedChildRows').and.returnValue(of(mockParameterizedReports.reports));
    component.getParametersValueForDropDown().subscribe(res => {
      expect(res).toBeDefined();
      expect(reportService.getMaterializedChildRows).toHaveBeenCalled();
      expect(reportService.isUserSuperAdmin).toHaveBeenCalled();
      expect(Array.isArray(res)).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res).toBe(mockParameterizedReports.reports[0].children);
      done();
    });
  });

  it('should parameters value for dropdown for report admin', done => {
    spyOn(reportService, 'fetchReportById').and.returnValue(of(mockParameterizedReports));
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(false);
    spyOn(reportService, 'getMaterializedChildRows').and.returnValue(of(mockParameterizedReports.reports));
    component.getParametersValueForDropDown().subscribe(res => {
      expect(res).toBeDefined();
      expect(reportService.getMaterializedChildRows).not.toHaveBeenCalled();
      expect(reportService.isUserSuperAdmin).toHaveBeenCalled();
      expect(Array.isArray(res)).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res.every(childReport => 'label' in childReport)).toBeTruthy();
      done();
    });
  });

  it('should handle handleAddSummaryStreams subscription', done => {
    component['hash'] = 'hash';
    spyOn(component, 'closeSummaryModal');
    spyOn(reportService, 'getParameterValues').and.returnValue({ value: 'tn' });
    spyOn(reportService, 'addReportSummary').and.returnValue(of({}));
    component['handleAddSummaryStreams']().subscribe(res => {
      expect(component.closeSummaryModal).toHaveBeenCalled();
      expect(reportService.addReportSummary).toHaveBeenCalled();
      done();
    });
    component['addSummaryBtnClickStream$'].next({ title: 'Add report Summary', type: 'report' });
  });

  it('should get all report data', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);

    component.reportData = {
      charts:[{
        chartData:chartData
      }
    ]
    }
    const data = component.getAllChartData();
    expect(data).toEqual(chartData);
  }));

  it('should get chart data', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.chartsReportData = {
      charts:[{
          chartConfig : {
            id: 123
          }
      }]
    }
    const data = component.getChartData({
        chartConfig : {
          id: 123
        }
    });
    expect(data).toEqual({
      chartConfig : {
        id: 123
      }
    });
  }));




  it('should change the filter', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    const data = component.filterChanged({
      chartData:chartData,
      filters:filters
    });
    expect(component.globalFilterChange).toEqual({
      chartData:chartData,
      filters:filters
    });

  }));

  it('should get reset filters', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.reportData = {
      charts:[{
        chartData:chartData
      }
    ]
    }
    component.resetFilter();
    expect(component.resetFilters).toEqual({ data:chartData,reset:true });

  }));

  

  it('should handle markdown update stream', done => {
    const spy = spyOn(reportService, 'updateReport').and.returnValue(of({}));
    component['reportConfig'] = {};
    const input = {
      data: '# Hello',
      type: 'examples'
    };
    component.markdownUpdated$.subscribe(res => {
      expect(res).toBeDefined();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('daily_metrics', {
        reportconfig: {
          dataset: {
            'examples': 'IyBIZWxsbw=='
          }
        }
      });
      done();
    });
    component.markdownUpdated$.next(input);
  });

});
