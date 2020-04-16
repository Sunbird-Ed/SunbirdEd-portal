import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, CoreModule, PermissionService, BaseReportService } from '@sunbird/core';
import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { UsageService } from '../usage/usage.service';
import { SharedModule } from '@sunbird/shared';
import { of } from 'rxjs';
import * as mockData from './reports.service.spec.data';

describe('ReportService', () => {
  let userService: UserService;
  let reportService: ReportService;
  let usageService: UsageService;
  let baseReportService: BaseReportService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ReportService, UsageService, UserService, PermissionService, BaseReportService],
    imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule]
  }));

  beforeEach(() => {
    reportService = TestBed.get(ReportService);
  });

  it('should be created', () => {
    const service: ReportService = TestBed.get(ReportService);
    expect(service).toBeTruthy();
  });

  it('should fetchDataSource', (done) => {
    usageService = TestBed.get(UsageService);
    const filePath = '/reports/sunbird/sunbird.csv';
    spyOn(usageService, 'getData').and.returnValue(of({ result: {} }));
    reportService.fetchDataSource(filePath).subscribe(res => {
      expect(usageService.getData).toHaveBeenCalled();
      expect(usageService.getData).toHaveBeenCalledWith(filePath);
      expect(res).toEqual({});
      done();
    });
  });

  it('should fetchReportById', (done) => {
    baseReportService = TestBed.get(BaseReportService);
    const reportId = '1234-5678';
    spyOn(baseReportService, 'get').and.returnValue(of({ result: {} }));
    reportService.fetchReportById(reportId).subscribe(res => {
      expect(res).toBeDefined();
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/get/${reportId}` });
      expect(res).toEqual({});
      done();
    });
  });


  it('should list all reports', (done) => {
    baseReportService = TestBed.get(BaseReportService);
    const filters = {
      slug: ['tn']
    };
    spyOn(baseReportService, 'post').and.returnValue(of({ result: {} }));
    reportService.listAllReports(filters).subscribe(res => {
      expect(res).toBeDefined();
      expect(baseReportService.post).toHaveBeenCalled();
      expect(baseReportService.post).toHaveBeenCalledWith({
        url: `/list`,
        data: {
          request: {
            filters
          }
        }
      });
      expect(res).toEqual({});
      done();
    });
  });

  it('should return chart data', () => {
    const chartsArray = mockData.chartsArray;
    const data: any = mockData.chartMetaData;
    const downloadUrl = '/reports/sunbird/sunbird.csv';
    const result = reportService.prepareChartData(chartsArray, data, downloadUrl);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      chartConfig: mockData.chartsArray[0],
      downloadUrl: downloadUrl,
      chartData: data.data,
      lastUpdatedOn: data.metadata.lastUpdatedOn
    });
  });


  it('it should download report', (done) => {
    const signedUrl = 'test.com';
    spyOn(reportService, 'fetchDataSource').and.returnValue(of({ signedUrl }));
    const filePath = '/report/sunbird/sunbird.csv';
    reportService.downloadReport(filePath).subscribe(res => {
      expect(res).toBeDefined();
      expect(res).toEqual(signedUrl);
      done();
    });
  });

  describe('isUserReportAdmin function', () => {

    beforeEach(() => {
      userService = TestBed.get(UserService);
    });

    it('should return false if user is not REPORT_ADMIN', () => {
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ roles: [] });
      const result = reportService.isUserReportAdmin();
      expect(result).toBeFalsy();
    });

    it('should return true if user is REPORT_ADMIN', () => {
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ roles: ['REPORT_ADMIN'] });
      const result = reportService.isUserReportAdmin();
      expect(result).toBeFalsy();
    });
  });


  describe('isAuthenticated function', () => {
    let permissionService: PermissionService;

    it('return true if authenticated ', () => {
      permissionService = TestBed.get(PermissionService);
      spyOn(permissionService, 'checkRolesPermissions').and.returnValue(true);
      permissionService.permissionAvailable$.next('success');
      reportService.isAuthenticated('reportViewerRole').subscribe(res => {
        expect(res).toBeTruthy();
        expect(res).toBeDefined();
      });
    });

    it('return false if not authenticated ', () => {
      permissionService = TestBed.get(PermissionService);
      permissionService.permissionAvailable$.next('failed');
      reportService.isAuthenticated('reportViewerRole').subscribe(res => {
        expect(res).toBeFalsy();
        expect(res).toBeDefined();
      });
    });
  });

});
