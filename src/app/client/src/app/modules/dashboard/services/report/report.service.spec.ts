import { ProfileService } from '@sunbird/profile';
import { CourseProgressService } from './../course-progress/course-progress.service';
import { UserService, PermissionService, BaseReportService, SearchService, FrameworkService } from '../../../core';
import { ReportService } from './report.service';
import { UsageService } from '../usage/usage.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import * as mockData from './reports.service.spec.data';
import { ConfigService } from '../../../shared';
import { CslFrameworkService } from '../../../../../app/modules/public/services/csl-framework/csl-framework.service';

describe('ReportService', () => {
  let reportService: ReportService;
  const mockDomSanitizer: Partial<DomSanitizer> = {};
  const mockUsageService: Partial<UsageService> = {
    getData: jest.fn(() => of({
      'id': 'api.report',
      'ver': '1.0',
      'ts': '2019-12-15 18:04:10:044+0530',
      'params': {
        'resmsgid': '3162ead0-1f37-11ea-b579-797b959e71b5',
        'msgid': null,
        'status': 'success',
        'err': null,
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'signedUrl': 'https://ntpstaging.blob.core.windows.net/reports/course-progress-reports/report-0129399366092881925.csv'
      }
    }))
  };
  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue("tn") as any,
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: jest.fn(() => {
          get: jest.fn()
        }) as any,
      } as any
    }) as any,
    setIsCustodianUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
    userProfile: jest.fn()
  };
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        REPORT: {
          READ: '/get',
          SUMMARY: {
            PREFIX: '/summary',
          },
          PUBLISH: '/publish',
        }
      }
    }
  };
  const mockBaseReportService: Partial<BaseReportService> = {
    get: jest.fn(() => {
      return of({ result: {} })
    }
    ) as any,
    post: jest.fn(() => {
      return of({ result: {} })
    }
    ) as any
  };
  const mockPermissionService: Partial<PermissionService> = {
    permissionAvailable$: of('failed') as any,
    checkRolesPermissions: jest.fn(() => {
      return true;
    }) as any
  };
  const mockCourseProgressService: Partial<CourseProgressService> = {
    getBatches: jest.fn(() => of()),
    downloadDashboardData: jest.fn(() => of()),
    getReportsMetaData: jest.fn(() => of({ result: mockData.reportMetaDataApiResponse })) as any,
  };
  const mockSearchService: Partial<SearchService> = {
    orgSearch: jest.fn(() => of(
      {
        result: {
          response: { content: [{ id: 'sunbird' }, { id: 'rj' }] }
        }
      }
    )) as any,
  };
  const mockFrameworkService: Partial<FrameworkService> = {
    frameworkData$: of({
      defaultFramework: {
        code: 'CODE'
      }
    }) as any,
    getChannel: jest.fn(),
    getFrameworkCategories: jest.fn()
  };
  const mockProfileService: Partial<ProfileService> = {
    getUserLocation: of({
      result: {
        response: [{ name: 'Goa' }, { name: 'Sikkim' }]
      }
    }) as any
  };
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getFrameworkCategories: jest.fn(),
  };

  beforeAll(() => {
    reportService = new ReportService(
      mockDomSanitizer as DomSanitizer,
      mockUsageService as UsageService,
      mockUserService as UserService,
      mockConfigService as ConfigService,
      mockBaseReportService as BaseReportService,
      mockPermissionService as PermissionService,
      mockCourseProgressService as CourseProgressService,
      mockSearchService as SearchService,
      mockFrameworkService as FrameworkService,
      mockProfileService as ProfileService,
      mockCslFrameworkService as CslFrameworkService
    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(reportService).toBeTruthy();
  });

  it('should fetchDataSource', (done) => {
    const filePath = '/reports/sunbird/sunbird.csv';
    reportService.fetchDataSource(filePath).subscribe(res => {
      expect(mockUsageService.getData).toHaveBeenCalled();
      expect(mockUsageService.getData).toHaveBeenCalledWith(filePath);
      expect(res).toBeDefined();
      done();
    });
  });

  it('should fetchReportById', (done) => {
    const reportId = '1234-5678';
    reportService.fetchReportById(reportId).subscribe(res => {
      expect(res).toBeDefined();
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/get/${reportId}` });
      expect(res).toBeDefined();
      done();
    });
  });

  it('should fetchReportById and hashed parameter', (done) => {
    const reportId = '1234-5678';
    const hash = 'sunbird';
    reportService.fetchReportById(reportId, hash).subscribe(res => {
      expect(res).toBeDefined();
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/get/${reportId}/${hash}` });
      expect(res).toBeDefined();
      done();
    });
  });

  it('should list all reports', (done) => {
    const filters = {
      slug: ['tn']
    };
    reportService.listAllReports(filters).subscribe(res => {
      expect(res).toBeDefined();
      expect(mockBaseReportService.post).toHaveBeenCalled();
      expect(res).toBeDefined();
      done();
    });
  });

  it('it should download report', (done) => {
    const signedUrl = 'test.com';
    jest.spyOn(reportService, 'fetchDataSource').mockReturnValue(of({ result: { signedUrl } }));
    const filePath = '/report/sunbird/sunbird.csv';
    reportService.downloadReport(filePath).subscribe(res => {
      expect(res).toBeDefined();
      expect(res).toEqual(signedUrl);
      done();
    });
  });

  describe('isUserReportAdmin function', () => {

    it('should return false if user is not REPORT_ADMIN', () => {
      const result = reportService.isUserReportAdmin();
      expect(result).toBeFalsy();
    });

    it('should return true if user is REPORT_ADMIN', () => {
      const result = reportService.isUserReportAdmin();
      expect(result).toBeFalsy();
    });

    it('should return true if user is super report admin', () => {
      const result = reportService.isUserSuperAdmin();
      expect(result).toBeFalsy();
    });

    it('should return false if the user is not super report admin even if he is report admin', () => {
      const result = reportService.isUserSuperAdmin();
      expect(result).toBeFalsy();
    });

    it('should return false if the user is not super report admin', () => {
      const result = reportService.isUserSuperAdmin();
      expect(result).toBeFalsy();
    });

  });


  describe('isAuthenticated function', () => {

    it('return true if authenticated ', () => {
      mockPermissionService.permissionAvailable$ = new BehaviorSubject('success');
      reportService.isAuthenticated('reportViewerRole').subscribe(res => {
        expect(res).toBeTruthy();
        expect(res).toBeDefined();
      });
    });

    it('return false if not authenticated ', () => {
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
    const input = mockData.getFileMetaDataInput;
    reportService.getFileMetaData(input).subscribe(res => {
      expect(res).toBeDefined();
      expect(mockCourseProgressService.getReportsMetaData).toHaveBeenCalled();
      expect(mockCourseProgressService.getReportsMetaData).toHaveBeenCalledTimes(1);
      expect(mockCourseProgressService.getReportsMetaData).toHaveBeenCalledWith({
        'params': {
          'fileNames': '{"first":"hawk-eye/daily_plays_by_mode.json","second":"hawk-eye/daily_quiz_play_by_lang.json"}'
        }
      });
      expect(res).toEqual(mockData.reportMetaDataApiResponse);
    });
  });

  it('should return empty object when getReport metadata api fails', () => {
    const input = mockData.getFileMetaDataInput;
    reportService.getFileMetaData(input).subscribe(res => {
      expect(res).toBeDefined();
      expect(mockCourseProgressService.getReportsMetaData).toHaveBeenCalled();
      expect(mockCourseProgressService.getReportsMetaData).toHaveBeenCalledTimes(1);
      expect(mockCourseProgressService.getReportsMetaData).toHaveBeenCalledWith({
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

  it('should retire a non parameterized report', done => {
    const reportId = '1234-5678';
    reportService.retireReport(reportId).subscribe(res => {
      expect(res).toBeDefined();
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/retire/${reportId}` });
      expect(res).toBeDefined();
    });
    done();
  });

  it('should retire a parameterized report', done => {
    const reportId = '1234-5678';
    const hash = 'sunbird';
    reportService.retireReport(reportId, hash).subscribe(res => {
      expect(res).toBeDefined();
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/retire/${reportId}/${hash}` });
      expect(res).toBeDefined();
    });
    done();
  });

  it('should get latest report summary for non parameterized report', done => {
    jest.spyOn(mockBaseReportService, 'get').mockReturnValue(of({ result: { summaries: [] } } as any)) as any;
    const input = {
      reportId: 'test-report'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}` });
      done();
    });
  });


  it('should get latest chart summary for non parameterized report', done => {
    jest.spyOn(mockBaseReportService, 'get').mockReturnValue(of({ result: { summaries: [] } } as any)) as any;
    const input = {
      reportId: 'test-report',
      chartId: 'chartid'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}/${input.chartId}` });
      done();
    });
  });


  it('should get latest report summary for  parameterized report', done => {
    jest.spyOn(mockBaseReportService, 'get').mockReturnValue(of({ result: { summaries: [] } } as any)) as any;
    const input = {
      reportId: 'test-report',
      hash: 'hash'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}?hash=${input.hash}` });
      done();
    });
  });


  it('should get latest chart summary for  parameterized report', done => {
    jest.spyOn(mockBaseReportService, 'get').mockReturnValue(of({ result: { summaries: [] } } as any)) as any;
    const input = {
      reportId: 'test-report',
      chartId: 'chartid',
      hash: 'hash'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}/${input.chartId}?hash=${input.hash}` });
      done();
    });
  });

  it('should handle error if get latest summary api fails or throw error', done => {
    jest.spyOn(mockBaseReportService, 'get').mockReturnValue(of({ result: { summaries: [] } } as any)) as any;
    const input = {
      reportId: 'test-report'
    };
    reportService.getLatestSummary(input).subscribe(res => {
      expect(mockBaseReportService.get).toHaveBeenCalled();
      expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: `/summary/${input.reportId}` });
      expect(res).toEqual([]);
      done();
    });
  });

  it('should return hash based on parameters hash', () => {
    const input = {
      parameters: ['$slug']
    };
    const result = reportService.getParametersHash(input);
    expect(result).toBeDefined();
    expect(result).toBe('dW5kZWZpbmVk');
  });

  it('should return resolved parameterized path if the report data source path is parameterized', () => {
    const path = '/reports/fetch/$slug/file.json';
    const result = reportService.resolveParameterizedPath(path);
    expect(result).toBeDefined();
    expect(result).toEqual('/reports/fetch/undefined/file.json');
  });

  it('should resolved report data source path as per parameters when hash is not passed', () => {
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
      path: '/reports/fetch/undefined/file.json'
    }]);
  });

  it('should resolved report data source path as with hash value when hashed parameter is passed explicitly', () => {
    const dataSources = [
      {
        id: 'usage',
        path: '/reports/fetch/$slug/file.json'
      }
    ];
    const hash = 'cmo=';
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
    jest.spyOn(reportService, 'getParameterValues').mockReturnValue({ masterData: () => of(['CBSE']) } as any);
    jest.spyOn(reportService, 'getParameterFromHash').mockReturnValue('NCERT');
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
    jest.spyOn(reportService, 'getParameterValues').mockReturnValue(null);
    reportService['getMaterializedChildRows'](input).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.length).toBe(1);
      expect(res).toEqual(input);
    });
  });

  it('should return the same report if the api to get masterData fails', () => {
    const input = [{ isParameterized: true, children: [], parameters: ['$board'], reportid: '123' }];
    jest.spyOn(reportService, 'getParameterValues').mockReturnValue({ masterData: () => throwError('') } as any);
    reportService['getMaterializedChildRows'](input).subscribe(res => {
      expect(res).toBeDefined();
      expect(res.length).toBe(1);
      expect(res).toEqual(input);
    });
  });

  describe('getParameterValues method', () => {


    it('check for slug parameter', done => {
      const { value, masterData } = reportService.getParameterValues('$slug');
      masterData().subscribe(res => {
        expect(res).toBeDefined();
      });
      done();
    });

    it('should check for board parameter', done => {
      jest.spyOn(mockFrameworkService, 'getChannel').mockReturnValue(of({ result: { channel: { defaultFramework: ['NCF'] } } }) as any);
      jest.spyOn(mockFrameworkService, 'getFrameworkCategories').mockReturnValue(of({
        result: {
          framework: {
            categories: [
              { code: 'board', terms: [{ name: 'CBSE' }] }]
          }
        }
      }) as any);
      const { value, masterData } = reportService.getParameterValues('$board');
      masterData().subscribe(res => {
        expect(res).toBeDefined();
      });
      done();
    });

    it('should check for state parameter', (done) => {
      jest.spyOn(mockUserService, 'userProfile',).mockReturnValue({
        rootOrg: { slug: 'sunbird' },
        framework: { board: ['CBSE'] }, userLocations: [{ type: 'state', name: 'Goa' }]
      });
      const { value, masterData } = reportService.getParameterValues('$state');
      masterData().subscribe(res => {
        expect(res).toBeDefined();
        expect(res.length).toBe(2);
        expect(mockProfileService.getUserLocation).toHaveBeenCalled();
        expect(mockProfileService.getUserLocation).toHaveBeenCalledWith({ 'filters': { 'type': 'state' } });
      });
      done();
    });

    it('check for channel parameter', done => {
      const { value, masterData } = reportService.getParameterValues('$channel');
      expect(value).toBeUndefined();
      masterData().subscribe(res => {
        expect(res).toBeDefined();
      });
      done();
    });

  });

  it('should get table data', () => {
    const data = [{ id: 'sample', result: 2 }, { id: 'sample2', result: 22 }];
    const result = reportService['getTableData'](data, 'sample');
    expect(result).toEqual(data[0].result);
  });

  it('should get paramterized files', () => {
    const files = [{ downloadUrl: '/report/$slug/abc.json' }, { downloadUrl: '/report/HE/abc.json' }];
    const hash = 'c3VuYmlyZA==';
    const result = reportService.getParameterizedFiles(files, hash);
    expect(result).toEqual([
      { downloadUrl: '/report/NCERT/abc.json' },
      { downloadUrl: '/report/HE/abc.json' }
    ]);
  });

  it('should prepare table data', () => {
    const input = {
      tablesArray: [
        {
          'id': 'board_wise_devices_12',
          'columnsExpr': 'keys',
          'valuesExpr': 'tableData',
          'config': false
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
      downloadUrl: '',
      config: false
    }]);
  });

  it('should call getChartData', () => {
    const data = [
      { result: ['sample result'], id: 'sample' },
      { result: ['sample result 2'], id: 'sample2' }
    ];
    const chart = {
      dataSource: {
        ids: ['sample', 'sample2']
      }
    }
    jest.spyOn(reportService, 'getChartData').mockReturnValue(of(data) as any);
    reportService['getChartData'](data, chart);
    expect(reportService.getChartData).toHaveBeenCalled();
  });

  it('should call publishReport', () => {
    reportService.publishReport('sample', '123');
    expect(mockBaseReportService.get).toHaveBeenCalledWith({ url: '/publish/sample/123' });
  });

});
