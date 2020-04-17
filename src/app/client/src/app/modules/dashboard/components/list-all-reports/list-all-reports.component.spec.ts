import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllReportsComponent } from './list-all-reports.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReportService } from '../../services';
import { of, Observable } from 'rxjs';
import {
  mockListApiResponse, mockTableStructureForReportViewer,
  mockTableStructureForReportAdmin
} from './list-all-reports.component.spec.data';

describe('ListAllReportsComponent', () => {
  let component: ListAllReportsComponent;
  let fixture: ComponentFixture<ListAllReportsComponent>;
  const routerStub = { navigate: () => Promise.resolve(true) };
  let reportService: ReportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListAllReportsComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule.forRoot()],
      providers: [ReportService, { provide: Router, useValue: routerStub }, {
        provide: ActivatedRoute, useValue: {
          snapshot: {
            data: {
              roles: 'reportAdminRoles',
              telemetry: { env: 'dashboard', pageid: 'list-all-reports', type: 'view' }
            }
          },

        }
      }],
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

  it('should fetch reports list if user is authenticated but not report admin', done => {
    spyOn(reportService, 'isAuthenticated').and.returnValue(of(true));
    spyOn<any>(component, 'getReportsList').and.callThrough();
    spyOn(reportService, 'listAllReports').and.returnValue(of(mockListApiResponse));
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(false);
    spyOn<any>(component, 'getColumnsDefs').and.returnValue([]);
    component.ngOnInit();
    component.reportsList$.subscribe(res => {
      expect(reportService.isAuthenticated).toHaveBeenCalled();
      expect(reportService.isAuthenticated).toHaveBeenCalledWith('reportAdminRoles');
      expect(component['getReportsList']).toHaveBeenCalled();
      expect(component['getReportsList']).toHaveBeenCalledWith(false);
      expect(res).toEqual(mockTableStructureForReportViewer);
      done();
    });
  });

  it('should fetch reports list if user is authenticated & report admin', done => {
    spyOn(reportService, 'isAuthenticated').and.returnValue(of(true));
    spyOn<any>(component, 'getReportsList').and.callThrough();
    spyOn(reportService, 'listAllReports').and.returnValue(of(mockListApiResponse));
    spyOn(reportService, 'isUserReportAdmin').and.returnValue(true);
    spyOn<any>(component, 'getColumnsDefs').and.returnValue([]);
    component.ngOnInit();
    component.reportsList$.subscribe(res => {
      expect(reportService.isAuthenticated).toHaveBeenCalled();
      expect(reportService.isAuthenticated).toHaveBeenCalledWith('reportAdminRoles');
      expect(component['getReportsList']).toHaveBeenCalled();
      expect(component['getReportsList']).toHaveBeenCalledWith(true);
      expect(res).toEqual(mockTableStructureForReportAdmin);
      done();
    });
  });

  it('should route to report details page', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.rowClickEventHandler(['report_id']);
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashBoard/reports', 'report_id']);
  });
});
