import { TelemetryModule } from '@sunbird/telemetry';
import { CourseProgressService } from './../course-progress/course-progress.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, CoreModule, PermissionService, BaseReportService } from '@sunbird/core';
import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { UsageService } from '../usage/usage.service';
import { SharedModule } from '@sunbird/shared';
import { of, throwError } from 'rxjs';
import * as mockData from './reports.service.spec.data';
import { configureTestSuite } from '@sunbird/test-util';

describe('ReportService', () => {
  let userService: UserService;
  let reportService: ReportService;
  let usageService: UsageService;
  let baseReportService: BaseReportService;
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ReportService, UsageService, UserService, PermissionService, BaseReportService, CourseProgressService],
    imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot()]
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
      expect(res).toBeDefined();
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
      expect(res).toBeDefined();
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
      expect(res).toBeDefined();
      done();
    });
  });

  it('it should download report', (done) => {
    const signedUrl = 'test.com';
    spyOn(reportService, 'fetchDataSource').and.returnValue(of({ result: { signedUrl } }));
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

  it('should return formatted date', () => {
    const result = reportService.getFormattedDate(1588902188000);
    expect(result).toBeDefined();
    expect(result).toBe('08-May-2020');
  });

  it('should get file metadata (last modified date) from the blob', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    spyOn(courseProgressService, 'getReportsMetaData').and.returnValue(of({ result: mockData.reportMetaDataApiResponse }));
    const input = mockData.getFileMetaDataInput;
    reportService.getFileMetaData(input).subscribe(res => {
      expect(res).toBeDefined();
      expect(courseProgressService.getReportsMetaData).toHaveBeenCalled();
      expect(courseProgressService.getReportsMetaData).toHaveBeenCalledTimes(1);
      expect(courseProgressService.getReportsMetaData).toHaveBeenCalledWith({
        'params': {
          'fileNames': '{"first":"hawk-eye/daily_plays_by_mode.json","second":"hawk-eye/daily_quiz_play_by_lang.json"}'
        }
      });
      expect(res).toEqual(mockData.reportMetaDataApiResponse);
    });
  });

  it('should return empty object when getReport metadata api fails', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    spyOn(courseProgressService, 'getReportsMetaData').and.returnValue(throwError({}));
    const input = mockData.getFileMetaDataInput;
    reportService.getFileMetaData(input).subscribe(res => {
      expect(res).toBeDefined();
      expect(courseProgressService.getReportsMetaData).toHaveBeenCalled();
      expect(courseProgressService.getReportsMetaData).toHaveBeenCalledTimes(1);
      expect(courseProgressService.getReportsMetaData).toHaveBeenCalledWith({
        'params': {
          'fileNames': '{"first":"hawk-eye/daily_plays_by_mode.json","second":"hawk-eye/daily_quiz_play_by_lang.json"}'
        }
      });
      expect(res).toEqual({});
    });
  });

  it('should take the latest last modified date for a chart or report', () => {
    const result = reportService.getLatestLastModifiedOnDate(mockData.getLatestLastModifiedOnDateFn, { ids: ['first'] });
    expect(result).toBeDefined();
    expect(result).toBe(1588902180000);
  });
});
