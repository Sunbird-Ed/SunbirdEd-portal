import { DashboardModule } from '@sunbird/dashboard';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { ListAllReportsComponent } from './list-all-reports.component';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { ReportService } from '../../services';
import { of, Observable, throwError } from 'rxjs';
import {
  mockListApiResponse, mockParameterizedReports
} from './list-all-reports.component.spec.data';

class MockElementRef {
  nativeElement: {}
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
        count: 0
      });
      expect(component.noResultFoundError).toEqual('messages.stmsg.m0144');
      done();
    });
  });

  it('should fetch reports list if user is authenticated & report admin', done => {
    spyOn(reportService, 'isAuthenticated').and.returnValue(of(true));
    spyOn<any>(component, 'getReportsList').and.callThrough();
    spyOn(reportService, 'listAllReports').and.returnValue(of(mockListApiResponse));
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    spyOn(reportService, 'isUserSuperAdmin').and.returnValue(false);
    component.ngOnInit();
    component.reportsList$.subscribe(res => {
      expect(res).toBeDefined();
      expect(reportService.isAuthenticated).toHaveBeenCalled();
      expect(reportService.isAuthenticated).toHaveBeenCalledWith('reportAdminRoles');
      expect(component['getReportsList']).toHaveBeenCalled();
      expect(component['getReportsList']).toHaveBeenCalledWith(true);
      expect(res).toEqual(mockListApiResponse)
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
      expect(res).toEqual(mockListApiResponse)
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
      expect(res).toEqual(mockListApiResponse)
      done();
    });
  });

  it('should config datatable whenever table is rendered into dom', () => {
    spyOn(component, 'prepareTable');
    component.inputTag = TestBed.get(ElementRef);
    expect(component.prepareTable).toHaveBeenCalled();
  });

  it('should flatten Reports when report have children', () => {
    component['getFlattenedReports'](mockParameterizedReports.reports).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.count).toBe(2);
    })
  })

  it('should get materializedChildRows for known parameters', () => {
    spyOn(reportService, 'getParameterValues').and.returnValue({ masterData: () => of(['CBSE', 'NCERT']) });
    component['getMaterializedChildRows'](mockParameterizedReports.reports).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.count).toBe(1);
    })
  });

  it('should return the same report for unknow parameters', () => {
    spyOn(reportService, 'getParameterValues').and.returnValue(null);
    component['getMaterializedChildRows'](mockParameterizedReports.reports).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.count).toBe(1);
    })
  });

  it('should return the same report if the api to get masterData fails', () => {
    spyOn(reportService, 'getParameterValues').and.returnValue({ masterData: () => throwError('') });
    component['getMaterializedChildRows'](mockParameterizedReports.reports).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.count).toBe(1);
    })
  });

  it('should route to report details page', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.rowClickEventHandler('report_id');
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashBoard/reports', 'report_id'], { queryParams: {} });
  });

  it('should prepare Data Table', () => {
    component.reports = mockParameterizedReports.reports;
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    const tableElement = document.createElement('table');
    component.prepareTable(tableElement);
  })

});
