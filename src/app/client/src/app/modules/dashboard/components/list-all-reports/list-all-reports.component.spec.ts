import { DashboardModule } from '@sunbird/dashboard';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ListAllReportsComponent } from './list-all-reports.component';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { ReportService } from '../../services';
import { of } from 'rxjs';
import * as $ from 'jquery';
import 'datatables.net';
import {
  mockListApiResponse, mockParameterizedReports, data
} from './list-all-reports.component.spec.data';

class MockElementRef {
  nativeElement: {};
}

describe('ListAllReportsComponent', () => {
  let component: ListAllReportsComponent;
  let fixture: ComponentFixture<ListAllReportsComponent>;
  const routerStub = { navigate: () => Promise.resolve(true) };
  let reportService: ReportService;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule.forRoot(), DashboardModule],
      providers: [ReportService, { provide: Router, useValue: routerStub }, {
        provide: ActivatedRoute, useValue: {
          snapshot: {
            data: {
              roles: 'reportAdminRoles',
              telemetry: { env: 'dashboard', pageid: 'list-all-reports', type: 'view' }
            }
          },

        }
      }, { provide: ElementRef, useValue: new MockElementRef() }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllReportsComponent);
    component = fixture.componentInstance;
    reportService = TestBed.get(ReportService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should not show list of reports and user should see error if unauthorized ( if not REPORT_VIEWER OR REPORT_ADMIN)
       to access the component`, done => {
    spyOn(reportService, 'isAuthenticated').and.returnValue(of(false));
    component.ngOnInit();
    component.reportsList$.subscribe(res => {
      expect(reportService.isAuthenticated).toHaveBeenCalled();
      expect(reportService.isAuthenticated).toHaveBeenCalledWith('reportAdminRoles');
      expect(res).toEqual({
        table: {},
        count: 0,
        reportsArr: [],
        datasetsArr: []
      });
      expect(component.noResultFoundError).toEqual('messages.stmsg.m0144');
      done();
    });
  });

  it('should fetch reports list if user is authenticated & report admin', done => {
    spyOn(reportService, 'isAuthenticated').and.returnValue(of(true));
    spyOn<any>(component, 'getReportsList').and.callThrough();
    spyOn(reportService, 'listAllReports').and.returnValue(of(data));
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(false);
    component.ngOnInit();
    component.reportsList$.subscribe(res => {
      expect(res).toBeDefined();
      expect(reportService.isAuthenticated).toHaveBeenCalled();
      expect(reportService.isAuthenticated).toHaveBeenCalledWith('reportAdminRoles');
      expect(component['getReportsList']).toHaveBeenCalled();
      expect(component['getReportsList']).toHaveBeenCalledWith(true);
      done();
    });
  });

  it('should fetch reports list if user is authenticated & super report admin', done => {
    spyOn(reportService, 'isAuthenticated').and.returnValue(of(true));
    spyOn<any>(component, 'getReportsList').and.callThrough();
    spyOn(reportService, 'listAllReports').and.returnValue(of(mockListApiResponse));
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(true);
    component.ngOnInit();
    component.reportsList$.subscribe(res => {
      expect(res).toBeDefined();
      expect(reportService.isAuthenticated).toHaveBeenCalled();
      expect(reportService.isAuthenticated).toHaveBeenCalledWith('reportAdminRoles');
      expect(component['getReportsList']).toHaveBeenCalled();
      expect(component['getReportsList']).toHaveBeenCalledWith(true);
      done();
    });
  });

  it('should fetch reports list if user is authenticated &  report viewer', done => {
    spyOn(reportService, 'isAuthenticated').and.returnValue(of(true));
    spyOn<any>(component, 'getReportsList').and.callThrough();
    spyOn(reportService, 'listAllReports').and.returnValue(of(mockListApiResponse));
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(false);
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(false);
    component.ngOnInit();
    component.reportsList$.subscribe(res => {
      expect(res).toBeDefined();
      expect(reportService.isAuthenticated).toHaveBeenCalled();
      expect(reportService.isAuthenticated).toHaveBeenCalledWith('reportAdminRoles');
      expect(component['getReportsList']).toHaveBeenCalled();
      expect(component['getReportsList']).toHaveBeenCalledWith(false);
      done();
    });
  });

  it('should config datatable whenever table is rendered into dom', () => {
    spyOn(component, 'prepareTable');
    component.reports = [[], []];
    component.inputTag = TestBed.get(ElementRef);
    expect(component.prepareTable).toHaveBeenCalled();
  });

  it('should route to report details page', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.rowClickEventHandler('report_id');
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashBoard/reports', 'report_id'], { queryParams: {} });
  });

  it('should prepare Data Table', fakeAsync(() => {
    component.reports = mockParameterizedReports.reports;
    spyOn(component, 'rowClickEventHandler');
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    const tableElement = document.createElement('table');
    const dataTableMethodSpy = spyOn($(tableElement), 'DataTable');
    tableElement.innerHTML = '<tbody> <tr> <td> 123 </td></tr> </tbody>';
    component.prepareTable(tableElement, mockParameterizedReports.reports);
    tableElement.querySelector('td').click();
  }));

  it('should render status of the report if report is not parameterized', () => {
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    const input = {
      data: 'live',
      row: {
        isParameterized: false,
        children: []
      }
    };

    let result;
    result = component['renderStatus'](input.data, null, input.row);
    expect(result).toBe(`<span class="sb-label sb-label-table sb-label-success-0">
    <span class="sb-live"></span> Live</span>`);

    input.data = 'draft';
    result = component['renderStatus'](input.data, null, input.row);
    expect(result).toBe(`<span class="sb-label sb-label-table sb-label-warning-0">
     Draft</span>`);

    input.data = 'retired';
    result = component['renderStatus'](input.data, null, input.row);
    expect(result).toBe(`<span class="sb-label sb-label-table sb-label-primary-100">
     Retired</span>`);
  });

  it('should render the status of paramterized report', () => {

    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    const input = {
      data: 'live',
      row: {
        isParameterized: true,
        children: [{
          status: 'live'
        }]
      }
    };

    let result;
    result = component['renderStatus'](input.data, null, input.row);
    expect(result).toBe(`<span class="sb-label sb-label-table sb-label-success-0">
    <span class="sb-live"></span> Live</span>`);

    input.row.children.push({ status: 'draft' });
    result = component['renderStatus'](input.data, null, input.row);
    expect(result).toBe(`<span class="sb-label sb-label-table sb-label-secondary-0">
     Partially Live</span>`);

    input.row.children = [{ status: 'draft' }];
    result = component['renderStatus'](input.data, null, input.row);
    expect(result).toBe(`<span class="sb-label sb-label-table sb-label-warning-0">
     Draft</span>`);
  });

  it('should render tags either input is string', () => {
    const input = 'live';
    const result = component['renderTags'](input);
    expect(result).toBe('Live');
  });

  it('should render tags either input is array of string', () => {
    const input = ['live'];
    const result = component['renderTags'](input);
    expect(result).toBe(`<div class="sb-filter-label"><div class="d-inline-flex m-0"><span class="sb-label-name sb-label-table sb-label-primary-100 mr-5 px-8 py-4">Live</span></div></div>`);
  });

  describe('it should handle datatable click handler', () => {

    let spy, tableElement;

    beforeEach(() => {
      spy = spyOn(component, 'rowClickEventHandler');
      tableElement = document.createElement('table');
      tableElement.innerHTML = '<tbody> <tr> <td> 123 </td></tr> </tbody>';
      spyOn($(tableElement), 'DataTable').and.returnValue({});
    });

    it('should handle click event from dataTable when row is parameterized and have child rows', fakeAsync(() => {
      const reports = [{
        isParameterized: true,
        children: [{
          status: 'draft'
        }]
      }];
      component.prepareTable(tableElement, reports);
      tableElement.querySelector('td').click();
      tick();
      expect(spy).not.toHaveBeenCalled();
    }));

    it('should handle click event from dataTable when row is non parameterized or do not have child rows', fakeAsync(() => {
      const reports = [{
        reportid: '123',
        hashed_val: 'hash',
        isParameterized: false,
        children: [{
          status: 'draft'
        }]
      }];
      component.prepareTable(tableElement, reports);
      tableElement.querySelector('td').click();
      tick();
      expect(spy).toHaveBeenCalledWith('123', 'hash', false);
    }));
  });

  it('should get the count of different status of reports', () => {
    const reports = [{ status: 'live' }, { status: 'live' }, { status: 'draft' }];
    let result = component['getReportsCount']({ reports, status: 'live' });
    expect(result).toBe(2);
    result = component['getReportsCount']({ reports, status: 'draft' });
    expect(result).toBe(1);
  });

  it('should config datasets tables', () => {
    spyOn(component, 'prepareTable');
    const reports = component.reports = [[{ type: 'report' }], [{ type: 'dataset', status: 'live' }, { type: 'dataset', status: 'draft' }]];
    const element = TestBed.get(ElementRef);
    component.datasetTable = element;
    expect(component.prepareTable).toHaveBeenCalledWith(element.nativeElement, reports[1]);
  });

  it('should config datasets tables if user is not super admin but a report admin', () => {
    spyOn(component, 'prepareTable');
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    const reports = component.reports = [[{ type: 'report' }], [{ type: 'dataset', status: 'live' }, { type: 'dataset', status: 'draft' }]];
    const element = TestBed.get(ElementRef);
    component.datasetTable = element;
    expect(component.prepareTable).toHaveBeenCalledWith(element.nativeElement, [{ type: 'dataset', status: 'live' }]);
  });

});
