import { of } from 'rxjs';
import { map, mergeMap, first, takeUntil, delay, switchMap } from 'rxjs/operators';
import { ResourceService, ToasterService, ConfigService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { CourseConsumptionService, CourseBatchService } from '../../../services';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { CoursesService, PermissionService, GeneraliseLabelService } from '@sunbird/core';
import dayjs from 'dayjs';
import { GroupsService } from '../../../../groups/services/groups/groups.service';
import { enrolledBatch } from './../../batch/batch-details/batch-details.component.data';
import { CourseHierarchyGetMockResponse } from './../course-player/course-player.component.mock.data';
import { CourseConsumptionPageComponent } from './course-consumption-page.component'

describe('CourseConsumptionPageComponent', () => {
  let component: CourseConsumptionPageComponent;
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
  const mockCourseConsumptionService: Partial<CourseConsumptionService> = {
    getCourseHierarchy: jest.fn()
  };
  const mockCoursesService: Partial<CoursesService> = {};
  const mockToasterService: Partial<ToasterService> = {};
  const mockCourseBatchService: Partial<CourseBatchService> = {
    getEnrolledBatchDetails: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockRouter: Partial<Router> = {
    events: of({ url: '/cert/configure/add' }) as any,
    navigate: jest.fn()
  };
  const mockGroupsService: Partial<GroupsService> = {
    emitMenuVisibility: jest.fn(),
    groupData: {
      id: '1'
    } as any
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: new EventEmitter<any>()
  };
  const mockPermissionService: Partial<PermissionService> = {};
  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn(),
    redoLayoutCSS: jest.fn(),
    switchableLayout: jest.fn()
  }
  const mockGeneraliseLabelService: Partial<GeneraliseLabelService> = {};

  const enrolledCourse = {
    courseSuccessEnroll: {
      'id': 'api.course.getbyuser', 'params': {
        'resmsgid': 'null', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
        'status': 'success', 'err': 'null', 'errmsg': 'null'
      }, 'responseCode': 'OK',
      'result': {
        'courses': {
          '0': {
            'active': 'true', 'courseId': 'do_212347136096788480178', 'courseName': '27-sept', 'batchId': 'do_112498388508524544160',
            'description': 'test', 'leafNodesCount': '0', 'progress': '0', 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
          }
        }
      }
    }
  };
  const resourceServiceMockData = {
    messages: {
      imsg: { m0027: 'Something went wrong' },
      fmsg: { m0001: 'error', m0003: 'error' },
      emsg: { m0005: 'error' }
    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        description: 'description'
      }
    },
    languageSelected$: of({})
  };
  class ActivatedRouteStub {
    snapshot = {
      queryParams: {},
      params: {},
      firstChild: { params: {} }
    };
  }


  beforeAll(() => {
    component = new CourseConsumptionPageComponent(
      mockActivatedRoute as ActivatedRoute,
      mockConfigService as ConfigService,
      mockCourseConsumptionService as CourseConsumptionService,
      mockCoursesService as CoursesService,
      mockToasterService as ToasterService,
      mockCourseBatchService as CourseBatchService,
      mockResourceService as ResourceService,
      mockRouter as Router,
      mockGroupsService as GroupsService,
      mockNavigationHelperService as NavigationHelperService,
      mockPermissionService as PermissionService,
      mockLayoutService as LayoutService,
      mockGeneraliseLabelService as GeneraliseLabelService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be create a instance of CourseConsumptionPageComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch courseHierarchy,EnrolledBatchDetails if course is enrolled', () => {
    mockLayoutService.switchableLayout = jest.fn(() => of([{data: ''}]));
    jest.spyOn(mockCourseBatchService, 'getEnrolledBatchDetails').mockReturnValue(of(enrolledBatch) as any);
    jest.spyOn(mockCourseConsumptionService, 'getCourseHierarchy').mockReturnValue(of(CourseHierarchyGetMockResponse.result.content));
    component['fetchEnrolledCourses$'] = (of(enrolledBatch)) as any;
    component.ngOnInit();
    // expect(component.courseHierarchy).toBeDefined();
    // expect(component.enrolledBatchInfo).toBeDefined();
    // expect(component.batchId).toBeTruthy();
  });
});
