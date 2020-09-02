import { ProfileService } from '@sunbird/profile';
import { TelemetryModule } from '@sunbird/telemetry';
import { CourseProgressService } from './../course-progress/course-progress.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, CoreModule, PermissionService, BaseReportService, SearchService, FrameworkService } from '@sunbird/core';
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
    providers: [ReportService, UsageService, UserService, PermissionService, BaseReportService, CourseProgressService, ProfileService],
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

  it('should fetchReportById and hashed parameter', (done) => {
    baseReportService = TestBed.get(BaseReportService);
    const reportId = '1234-5678';
    const hash = 'sunbird';
    spyOn(baseReportService, 'get').and.returnValue(of({ result: {} }));
    reportService.fetchReportById(reportId, hash).subscribe(res => {
      expect(res).toBeDefined();
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/get/${reportId}/${hash}` });
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
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ userRoles: [] });
      const result = reportService.isUserReportAdmin();
      expect(result).toBeFalsy();
    });

    it('should return true if user is REPORT_ADMIN', () => {
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ userRoles: ['REPORT_ADMIN'] });
      const result = reportService.isUserReportAdmin();
      expect(result).toBeTruthy();
    });

    it('should return true if user is super report admin', () => {
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ userRoles: ['REPORT_ADMIN'], rootOrg: { slug: 'sunbird' } });
      const result = reportService.isUserSuperAdmin();
      expect(result).toBeTruthy();
    });

    it('should return false if the user is not super report admin even if he is report admin', () => {
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ userRoles: ['REPORT_ADMIN'], rootOrg: { slug: 'rj' } });
      const result = reportService.isUserSuperAdmin();
      expect(result).toBeFalsy();
    });

    it('should return false if the user is not super report admin', () => {
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ userRoles: ['REPORT_VIEWER'], rootOrg: { slug: 'sunbird' } });
      const result = reportService.isUserSuperAdmin();
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

  it('should convert a string into base64 hash', () => {
    const input = 'sunbird';
    const hash = 'c3VuYmlyZA==';
    const result = reportService.convertToBase64(input);
    expect(result).toBe(hash);
    expect(result).toBeDefined();
  });

  it('get string from base 64 string', () => {
    const parameter = 'sunbird';
    const hash = 'c3VuYmlyZA==';
    const result = reportService['getParameterFromHash'](hash);
    expect(result).toEqual([parameter]);
    expect(result.length).toBe(1);
    expect(result).toBeDefined();
  });

  it('should check if report is parameterised or not', () => {
    const reportInput = {
      isParameterized: true
    };
    expect(reportService.isReportParameterized(reportInput)).toBeFalsy();
    reportInput['parameters'] = [];
    expect(reportService.isReportParameterized(reportInput)).toBeFalsy();
    reportInput['parameters'] = ['$slug'];
    expect(reportService.isReportParameterized(reportInput)).toBeTruthy();
  });

  it('should publish a non parameterized report', done => {
    baseReportService = TestBed.get(BaseReportService);
    const reportId = '1234-5678';
    spyOn(baseReportService, 'get').and.returnValue(of({ result: {} }));
    reportService.publishReport(reportId).subscribe(res => {
      expect(res).toBeDefined();
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/publish/${reportId}` });
      expect(res).toBeDefined();
      done();
    });
  });

  it('should publish a parameterized report', done => {
    baseReportService = TestBed.get(BaseReportService);
    const reportId = '1234-5678';
    const hash = 'sunbird';
    spyOn(baseReportService, 'get').and.returnValue(of({ result: {} }));
    reportService.publishReport(reportId, hash).subscribe(res => {
      expect(res).toBeDefined();
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/publish/${reportId}/${hash}` });
      expect(res).toBeDefined();
      done();
    });
  });

  it('should retire a non parameterized report', done => {
    baseReportService = TestBed.get(BaseReportService);
    const reportId = '1234-5678';
    spyOn(baseReportService, 'get').and.returnValue(of({ result: {} }));
    reportService.retireReport(reportId).subscribe(res => {
      expect(res).toBeDefined();
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/retire/${reportId}` });
      expect(res).toBeDefined();
      done();
    });
  });

  it('should retire a parameterized report', done => {
    baseReportService = TestBed.get(BaseReportService);
    const reportId = '1234-5678';
    const hash = 'sunbird';
    spyOn(baseReportService, 'get').and.returnValue(of({ result: {} }));
    reportService.retireReport(reportId, hash).subscribe(res => {
      expect(res).toBeDefined();
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/retire/${reportId}/${hash}` });
      expect(res).toBeDefined();
      done();
    });
  });

  it('should get latest report summary for non parameterized report', done => {
    baseReportService = TestBed.get(BaseReportService);
    spyOn(baseReportService, 'get').and.returnValue(of({ result: { summaries: [] } }));
    const input = {
      reportId: 'test-report'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}` });
      done();
    });
  });


  it('should get latest chart summary for non parameterized report', done => {
    baseReportService = TestBed.get(BaseReportService);
    spyOn(baseReportService, 'get').and.returnValue(of({ result: { summaries: [] } }));
    const input = {
      reportId: 'test-report',
      chartId: 'chartid'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}/${input.chartId}` });
      done();
    });
  });


  it('should get latest report summary for  parameterized report', done => {
    baseReportService = TestBed.get(BaseReportService);
    spyOn(baseReportService, 'get').and.returnValue(of({ result: { summaries: [] } }));
    const input = {
      reportId: 'test-report',
      hash: 'hash'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}?hash=${input.hash}` });
      done();
    });
  });


  it('should get latest chart summary for  parameterized report', done => {
    baseReportService = TestBed.get(BaseReportService);
    spyOn(baseReportService, 'get').and.returnValue(of({ result: { summaries: [] } }));
    const input = {
      reportId: 'test-report',
      chartId: 'chartid',
      hash: 'hash'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}/${input.chartId}?hash=${input.hash}` });
      done();
    });
  });

  it('should handle error if get latest summary api fails or throw error', done => {
    baseReportService = TestBed.get(BaseReportService);
    spyOn(baseReportService, 'get').and.returnValue(throwError(''));
    const input = {
      reportId: 'test-report'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(baseReportService.get).toHaveBeenCalled();
      expect(baseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}` });
      expect(res).toEqual([]);
      done();
    });
  });

  it('should return hash based on parameters hash', () => {
    userService = TestBed.get(UserService);
    const input = {
      parameters: ['$slug']
    };
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ rootOrg: { slug: 'sunbird' }, framework: { board: ['CBSE'] } });
    const result = reportService.getParametersHash(input);
    expect(result).toBeDefined();
    expect(result).toBe('c3VuYmlyZA==');
  });

  it('should return resolved parameterized path if the report data source path is parameterized', () => {
    userService = TestBed.get(UserService);
    const path = '/reports/fetch/$slug/file.json';
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ rootOrg: { slug: 'sunbird' }, framework: { board: ['CBSE'] } });
    const result = reportService.resolveParameterizedPath(path);
    expect(result).toBeDefined();
    expect(result).toEqual('/reports/fetch/sunbird/file.json');
  });

  it('should resolved report data source path as per parameters when hash is not passed', () => {
    userService = TestBed.get(UserService);
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ rootOrg: { slug: 'sunbird' }, framework: { board: ['CBSE'] } });
    const dataSources = [
      {
        id: 'usage',
        path: '/reports/fetch/$slug/file.json'
      }
    ];

    const result = reportService.getUpdatedParameterizedPath(dataSources);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result).toEqual([{
      id: 'usage',
      path: '/reports/fetch/sunbird/file.json'
    }]);
  });

  it('should resolved report data source path as with hash value when hashed parameter is passed explicitly', () => {
    userService = TestBed.get(UserService);
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ rootOrg: { slug: 'sunbird' }, framework: { board: ['CBSE'] } });
    const dataSources = [
      {
        id: 'usage',
        path: '/reports/fetch/$slug/file.json'
      }
    ];
    const hash = 'cmo='; // equals to rj when converted back to string
    const result = reportService.getUpdatedParameterizedPath(dataSources, hash);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result).toEqual([{
      id: 'usage',
      path: '/reports/fetch/rj/file.json'
    }]);
  });

  it('should flatten Reports when report have children', () => {
    const input = [{ isParameterized: true, children: [{ status: 'one', id: 'one' }] }];
    const res = reportService['getFlattenedReports'](input);
    expect(res).toBeDefined();
    expect(res).toEqual([{ isParameterized: true, status: 'one' }]);
    expect(res.length).toBe(1);
  });

  it('should flatten Reports when report do not have children', () => {
    const input = [{ isParameterized: true, children: [] }];
    const res = reportService['getFlattenedReports'](input);
    expect(res).toBeDefined();
    expect(res).toEqual(input);
    expect(res.length).toBe(1);
  });

  it('should get materializedChildRows for known parameters', () => {
    const input = [{ isParameterized: true, children: [], parameters: ['$board'], reportid: '123' }];
    spyOn(reportService, 'getParameterValues').and.returnValue({ masterData: () => of(['CBSE']) });
    spyOn(reportService, 'getParameterFromHash').and.returnValue('NCERT');
    reportService['getMaterializedChildRows'](input).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.length).toBe(1);
      expect(reportService.getParameterValues).toHaveBeenCalled();
      expect(res).toEqual([{
        isParameterized: true, parameters: ['$board'], reportid: '123', children: [{
          label: 'CBSE', hashed_val: 'Q0JTRQ==', status: 'draft', reportid: '123', materialize: true
        }]
      }]);
    });
  });

  it('should return the same report for unknow parameters', () => {
    const input = [{ isParameterized: true, children: [], parameters: ['$board'], reportid: '123' }];
    spyOn(reportService, 'getParameterValues').and.returnValue(null);
    reportService['getMaterializedChildRows'](input).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.length).toBe(1);
      expect(res).toEqual(input);
    });
  });

  it('should return the same report if the api to get masterData fails', () => {
    const input = [{ isParameterized: true, children: [], parameters: ['$board'], reportid: '123' }];
    spyOn(reportService, 'getParameterValues').and.returnValue({ masterData: () => throwError('') });
    reportService['getMaterializedChildRows'](input).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.length).toBe(1);
      expect(res).toEqual(input);
    });
  });

  describe('getParameterValues method', () => {

    beforeEach(() => {
      userService = TestBed.get(UserService);
    });
    it('check for slug parameter', done => {
      const searchService = TestBed.get(SearchService);
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ rootOrg: { slug: 'sunbird' }, framework: { board: ['CBSE'] } });
      spyOn(searchService, 'orgSearch').and.returnValue(of({ result: { response: { content: [{ slug: 'sunbird' }, { slug: 'rj' }] } } }));
      const { value, masterData } = reportService.getParameterValues('$slug');
      expect(value).toBe('sunbird');
      masterData().subscribe(res => {
        expect(res).toBeDefined();
        done();
      });
    });

    it('should check for board parameter', done => {
      const frameworkService = TestBed.get(FrameworkService);
      spyOn(frameworkService, 'getChannel').and.returnValue(of({ result: { channel: { defaultFramework: ['NCF'] } } }));
      spyOn(frameworkService, 'getFrameworkCategories').and.returnValue(of({
        result: {
          framework: {
            categories: [
              { code: 'board', terms: [{ name: 'CBSE' }] }]
          }
        }
      }));
      spyOnProperty(userService, 'hashTagId', 'get').and.returnValue('1234');
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ rootOrg: { slug: 'sunbird' }, framework: { board: ['CBSE'] } });
      const { value, masterData } = reportService.getParameterValues('$board');
      expect(value).toBe('CBSE');
      masterData().subscribe(res => {
        expect(res).toBeDefined();
        done();
      });
    });

    it('should check for state parameter', done => {
      const profileService = TestBed.get(ProfileService);
      spyOn(profileService, 'getUserLocation').and.returnValue(of({
        result: {
          response: [{ name: 'Goa' }, { name: 'Sikkim' }]
        }
      }));
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({
        rootOrg: { slug: 'sunbird' },
        framework: { board: ['CBSE'] }, userLocations: [{ type: 'state', name: 'Goa' }]
      });
      const { value, masterData } = reportService.getParameterValues('$state');
      expect(value).toBe('Goa');
      masterData().subscribe(res => {
        expect(res).toBeDefined();
        expect(res.length).toBe(2);
        expect(profileService.getUserLocation).toHaveBeenCalled();
        expect(profileService.getUserLocation).toHaveBeenCalledWith({ 'filters': { 'type': 'state' } });

        done();
      });
    });

    it('check for channel parameter', done => {
      const searchService = TestBed.get(SearchService);
      spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ rootOrg: { slug: 'sunbird', hashTagId: '123' }, framework: { board: ['CBSE'] } });
      spyOn(searchService, 'orgSearch').and.returnValue(of({ result: { response: { content: [{ id: 'sunbird' }, { id: 'rj' }] } } }));
      const { value, masterData } = reportService.getParameterValues('$channel');
      expect(value).toBe('123');
      masterData().subscribe(res => {
        expect(res).toBeDefined();
        done();
      });
    });

  });

  it('should get table data', () => {
    const data = [{ id: 'sample', result: 2 }, { id: 'sample2', result: 22 }];
    const result = reportService['getTableData'](data, 'sample');
    expect(result).toEqual(data[0].result);
  });

  it('should get paramterized files', () => {
    spyOnProperty(userService, 'userProfile', 'get').and.returnValue({ rootOrg: { slug: 'sunbird', hashTagId: '123' }, framework: { board: ['CBSE'] } });
    const files = [{ downloadUrl: '/report/$slug/abc.json' }, { downloadUrl: '/report/HE/abc.json' }];
    const hash = 'c3VuYmlyZA==';
    const result = reportService.getParameterizedFiles(files, hash);
    expect(result).toEqual([
      { downloadUrl: '/report/sunbird/abc.json' },
      { downloadUrl: '/report/HE/abc.json' }
    ]);
  });

  it('should prepare table data', () => {
    const input = {
      tablesArray: [
        {
          'id': 'board_wise_devices_12',
          'columnsExpr': 'keys',
          'valuesExpr': 'tableData'
        }],
      data: [
        {
          id: 'board_wise_devices_12',
          result: {
            keys: [],
            tableData: []
          }
        }]
    };
    const result = reportService.prepareTableData(input.tablesArray, input.data, '');
    expect(result).toEqual([{
      id: input.tablesArray[0].id,
      name: 'Table',
      header: [],
      data: [],
      downloadUrl: ''
    }]);
  });

});
