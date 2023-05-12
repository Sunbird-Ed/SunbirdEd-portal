import { of, throwError } from 'rxjs';
import { CourseProgressComponent } from './course-progress.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, FormService } from '../../../core';
import { ResourceService, ConfigService, PaginationService, ToasterService, IUserProfile, NavigationHelperService } from '../../../shared';
import { CourseProgressService, UsageService } from './../../services';
import * as testData from './course-progress.component.spec.data';
import { TelemetryService } from '@sunbird/telemetry';
import { OnDemandReportService } from './../../../shared/services/on-demand-report/on-demand-report.service';

describe('CourseProgressComponent', () => {
  let component: CourseProgressComponent;
  const resourceBundle = {
    'messages': {
      'emsg': {
        'm0005': 'Something went wrong, please try in some time....'
      },
      'imsg': {
        'm0022': 'Stats for last 7 days',
        'm0044': 'Download failed!',
        'm0043': 'Your profile does not have a valid email ID.Please update your email ID',
        'm0045': 'No data available to download'
      },
      'stmsg': {
        'm0132': 'We have received your download request. The file will be sent to your registered email ID shortly.',
        'm0141': 'Data unavailable to generate Score Report'
      },
      'fmsg': {
        'm0004': 'Could not fetch data, try again later'
      }
    },
    'frmelmnts': {
      'instn': {
        't0056': 'Please try again..'
      }
    }
  };

  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id'],
        profileUserType: {
          type: 'student'
        }
      } as any
    }) as any,
    slug: jest.fn() as any
  };
  const mockRouter: Partial<Router> = {
    navigate: jest.fn(),
    url: '/home'
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      queryParams: {
        selectedTab: 'course'
      },
      data: {
        sendUtmParams: true
      }
    } as any,
    queryParams: of({ batchIdentifier: '0124963192947507200', timePeriod: '7d' }),
  };
  const mockResourceService: Partial<ResourceService> = {
    messages: {
      emsg: {
        'm0005': 'Something went wrong, please try in some time....'
      },
      imsg: {
        'm0022': 'Stats for last 7 days',
        'm0044': 'Download failed!',
        'm0043': 'Your profile does not have a valid email ID.Please update your email ID',
        'm0045': 'No data available to download'
      },
      stmsg: {
        'm0132': 'We have received your download request. The file will be sent to your registered email ID shortly.',
        'm0141': 'Data unavailable to generate Score Report'
      },
      fmsg: {
        'm0004': 'Could not fetch data, try again later'
      }
    },
    frmelmnts: {
      'instn': {
        't0056': 'Please try again..'
      }
    }
  };
  const mockToasterService: Partial<ToasterService> = {
    warning: jest.fn(),
    error: jest.fn()
  };
  const mockTelemetryService: Partial<TelemetryService> = {
    interact: jest.fn()
  };
  const mockCourseProgressService: Partial<CourseProgressService> = {
    getBatches: jest.fn(() => of(testData.mockUserData.getBatchRes)),
    downloadDashboardData: jest.fn(() => of(testData.mockUserData.populateCourseDashboardDataRes)),
  };
  const mockPaginationService: Partial<PaginationService> = {};
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: "joy",
      TELEMETRY: {
        PID: 'sample-page-id'
      },
      UrlLinks: {
        downloadsunbirdApp: 'https://play.google.com/store/apps/details?'
      },
      DASHBOARD: {
        PAGE_LIMIT: 10,
      }
    },
    urlConFig: {
      URLS: {
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    },
    rolesConfig: {
      ROLES: {
        announcement: ["ANNOUNCEMENT_SENDER"],
      }
    }
  };
  const mockOnDemandReportService: Partial<OnDemandReportService> = {};
  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn()
  };
  const mockNavigationhelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: {
      pipe: jest.fn(() => {
        return of(true)
      })
    } as any,
    emitFullScreenEvent: jest.fn()
  };
  const mockUsageService: Partial<UsageService> = {
    getData: jest.fn(() => of(testData.mockUserData.courseProgressReportMock)),
  };

  beforeAll(() => {
    component = new CourseProgressComponent(
      mockUserService as UserService,
      mockRouter as Router,
      mockActivatedRoute as ActivatedRoute,
      mockResourceService as ResourceService,
      mockToasterService as ToasterService,
      mockTelemetryService as TelemetryService,
      mockCourseProgressService as CourseProgressService,
      mockPaginationService as PaginationService,
      mockConfigService as ConfigService,
      mockOnDemandReportService as OnDemandReportService,
      mockFormService as FormService,
      mockNavigationhelperService as NavigationHelperService,
      mockUsageService as UsageService
    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call user service, call populateBatchData()', () => {
    component.populateBatchData();
    expect(component.batchlist).toBeDefined();
    expect(component.batchlist.length).toEqual(2);
  });

  it('should call user service, call populateBatchData() with zero count', () => {
    jest.spyOn(mockCourseProgressService, 'getBatches').mockReturnValue(of(testData.mockUserData.getBatchResZero));
    component.populateBatchData();
    expect(component.batchlist).toBeDefined();
    expect(component.batchlist.length).toEqual(0);
  });

  it('should call user service, call populateBatchData() with count One', () => {
    jest.spyOn(mockCourseProgressService, 'getBatches').mockReturnValue(of(testData.mockUserData.getBatchResOne));
    component.populateBatchData();
    expect(component.batchlist).toBeDefined();
    expect(component.batchlist.length).toEqual(1);
  });

  it('on selection of timeperiod call setTimePeriod()', () => {
    component.queryParams = { batchIdentifier: '0124963192947507200', timePeriod: '7d' };
    component.setTimePeriod('7d');
    expect(component.queryParams.timePeriod).toEqual('7d');
  });

  it('spy on downloadDashboardData()', () => {
    window.open = jest.fn();
    component.downloadReport(true);
    expect(component.showDownloadModal).toEqual(false);
  });

  it('should unsubscribe to userData observable', () => {
    component.queryParams = {};
    component.ngOnInit();
    jest.spyOn(component.userDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.userDataSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.queryParams = { batchIdentifier: '0124963192947507200' };
    component.ngOnInit();
    jest.spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });

  it('should call set page method and set proper page number', () => {
    component.queryParams = { batchIdentifier: '0124963192947507200' };
    component.pager = testData.mockUserData.pager;
    component.pager.totalPages = 8;
    component.populateBatchData();
    component.navigateToPage(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith([], { queryParams: component.queryParams });
  });

  it('should set completedCount and participantCount as 0 to the currentBatch if it is empty in the currentBatch', () => {
    component.currentBatch = testData.mockUserData.currentBatchDataBefore;
    component.setCounts(component.currentBatch);
    expect(component.currentBatch['completedCount']).toEqual(0);
    expect(component.currentBatch['participantCount']).toEqual(0);
  });

  it(`should set completedCount and participantCount to the currentBatch with the existing values if it is not empty in the currentBatch`, () => {
    component.currentBatch = testData.mockUserData.currentBatchDataWithCount;
    component.setCounts(component.currentBatch);
    expect(component.currentBatch['completedCount']).toEqual(testData.mockUserData.currentBatchDataWithCount.completedCount);
    expect(component.currentBatch['participantCount']).toEqual(testData.mockUserData.currentBatchDataWithCount.participantCount);
  });

  it('should set filterText', () => {
    mockActivatedRoute.queryParams.subscribe(data => {
      component.queryParams = data;
    });
    component.setFilterDescription();
    expect(component.filterText).toEqual('Stats for last 7 days');
  });

  it('should call getFormData as a COURSE_CREATOR', () => {
    component.userRoles = ['CONTENT_CREATOR'];
    component.selectedTab = 2;
    jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(of(testData.mockUserData.reportTypes));
    component.getFormData();
    expect(component.reportTypes).toEqual(testData.mockUserData.reportTypes);
  });
  it('should call getFormData as a COURSE_MENTOR', () => {
    component.userRoles = ['COURSE_MENTOR'];
    jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(of(testData.mockUserData.reportTypes));
    component.getFormData();
    expect(component.reportTypes).toEqual(testData.mockUserData.reportTypesMentor);
  });
  it('should call getFormData error case ', () => {
    component.userRoles = ['COURSE_MENTOR'];
    jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(throwError('error'));
    component.getFormData();
    expect(mockToasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
  });
});
