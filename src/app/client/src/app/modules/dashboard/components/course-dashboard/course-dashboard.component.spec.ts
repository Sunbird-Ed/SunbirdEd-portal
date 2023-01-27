import { of, throwError } from 'rxjs';
import { CourseDashboardComponent } from './course-dashboard.component';
import { UserService } from '../../../core';
import { CourseProgressService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationHelperService, ResourceService, ToasterService } from '@sunbird/shared';
import { mockUserData } from './../course-progress/course-progress.component.spec.data';
import * as _ from 'lodash-es';

describe('CourseDashboardComponent', () => {
  let courseDashboardComponent: CourseDashboardComponent;

  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue("tn") as any,
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id']
      } as any
    }) as any,
    setIsCustodianUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
  };

  const mockCourseProgressService: Partial<CourseProgressService> = {
    getBatches: jest.fn().mockReturnValue(of(mockUserData.getBatchRes))
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    parent: { params: of({ courseId: '123' }), queryParams: {} as any } as any,
    snapshot: {
      data: {
        telemetry: {
          env: 'dashboard', pageid: 'course-dashboard', type: 'view', subtype: 'paginate', object: { type: 'course', ver: '1.0' }
        }
      }
    } as any
  };
  const mockRouter: Partial<Router> = {};
  const mockNavigationHelperService: Partial<NavigationHelperService> = {};
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
    success: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      lbl: {
        totalBatches: 'Total Batches',
        totalEnrollments: 'Total Enrollments',
        totalCompletions: 'Total Completions',
      }
    },
    messages: {
      emsg: {
        m0005: 'Something went wrong',
      }
    },
    languageSelected$: of({})
  };

  beforeAll(() => {
    courseDashboardComponent = new CourseDashboardComponent(
      mockCourseProgressService as CourseProgressService,
      mockActivatedRoute as ActivatedRoute,
      mockUserService as UserService,
      mockRouter as Router,
      mockNavigationHelperService as NavigationHelperService,
      mockResourceService as ResourceService,
      mockToasterService as ToasterService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of OtpService', () => {
    expect(courseDashboardComponent).toBeTruthy();
  });

  it('should call getBatchList', () => {
    jest.spyOn(courseDashboardComponent, 'getBatchList').mockImplementation();
    jest.spyOn(courseDashboardComponent, 'setImpressionEvent').mockImplementation();
    jest.spyOn(courseDashboardComponent['activatedRoute'].parent.params, 'pipe').mockReturnValue(of({ data: false }));;
    expect(courseDashboardComponent).toBeTruthy();
    courseDashboardComponent.ngOnInit();
    expect(courseDashboardComponent.getBatchList).toHaveBeenCalled();
    expect(courseDashboardComponent.setImpressionEvent).toHaveBeenCalled();
  });

  it('should return data', () => {
    const searchParamsCreator = {
      courseId: '123',
      status: ['0', '1', '2']
    };
    jest.spyOn(courseDashboardComponent, 'getDashboardData').mockImplementation();
    jest.spyOn(mockCourseProgressService, 'getBatches').mockReturnValue(of(mockUserData.getBatchRes));
    courseDashboardComponent.getBatchList();
    mockCourseProgressService.getBatches(searchParamsCreator).subscribe(data => {
      expect(data).toEqual(mockUserData.getBatchRes);
      expect(courseDashboardComponent.getDashboardData).toHaveBeenCalledWith(_.get(data, 'result.response'));
    });
    expect(mockCourseProgressService.getBatches).toHaveBeenCalledWith(searchParamsCreator);
  });

  it('should throw error', () => {
    courseDashboardComponent.courseId = '123';
    mockUserService.setUserId = jest.fn();
    const searchParamsCreator = {
      courseId: '123',
      status: ['0', '1', '2'],
    };
    jest.spyOn(courseDashboardComponent['courseProgressService'], 'getBatches').mockReturnValue(throwError([]));
    jest.spyOn(courseDashboardComponent, 'getDashboardData').mockImplementation();
    jest.spyOn(mockCourseProgressService, 'getBatches').mockReturnValue(of(mockUserData.getBatchRes));
    courseDashboardComponent.getBatchList();
    mockCourseProgressService.getBatches(searchParamsCreator).subscribe(data => {
    }, (err) => {
      expect(courseDashboardComponent['toasterService'].error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005);
    });
  });
});
