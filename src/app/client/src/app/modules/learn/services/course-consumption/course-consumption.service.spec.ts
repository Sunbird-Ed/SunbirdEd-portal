import { Observable, of as observableOf } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, inject } from '@angular/core/testing';
import { SharedModule, ResourceService, NavigationHelperService } from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CourseConsumptionService } from './course-consumption.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseProgressService } from '../courseProgress/course-progress.service';
import { PlayerService } from '@sunbird/core';
import { courseConsumptionServiceMockData } from './course-consumption.service.data.spec';
import { configureTestSuite } from '@sunbird/test-util';

const fakeActivatedRoute = {
  'params': observableOf({ contentId: 'd0_33567325' }),
  'root': {
    children: [{snapshot: {
      queryParams: {}
    }}]
  }
};

const courseHierarchyGetMockResponse = {
  'id': 'ekstep.learning.content.hierarchy',
  'ver': '2.0',
  'ts': '2018-05-07T07:20:27ZZ',
  'params': {
      'resmsgid': '0ea98baa-5a9e-49fd-a568-7967bc1e0ab8',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
  },
  'result': {
    'content': {
      'identifier': 'do_212347136096788480178'
    }
  }
};

const resourceBundle = {
  messages: {
    emsg: {
      m0003: `The Course doesn't have any open batches`
    }
  }
};

describe('CourseConsumptionService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      providers: [CourseConsumptionService, CourseProgressService, PlayerService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: ResourceService, useValue: resourceBundle}, NavigationHelperService
      ]
    });
  });
  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));

  it('should not call api to get course hierarchy if data exists', () => {
    const service = TestBed.get(CourseConsumptionService);
    const playerService = TestBed.get(PlayerService);
    service.courseHierarchy = courseHierarchyGetMockResponse.result.content;
    spyOn(service, 'getCourseHierarchy').and.callThrough();
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue(observableOf(courseHierarchyGetMockResponse));
    service.getCourseHierarchy('do_212347136096788480178');
    expect(playerService.getCollectionHierarchy).not.toHaveBeenCalled();
  });

  it('should call api to get course hierarchy if data not exists', () => {
    const service = TestBed.get(CourseConsumptionService);
    const playerService = TestBed.get(PlayerService);
    spyOn(service, 'getCourseHierarchy').and.callThrough();
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue(observableOf(courseHierarchyGetMockResponse));
    service.getCourseHierarchy('do_212347136096788480178');
    expect(playerService.getCollectionHierarchy).toHaveBeenCalled();
  });

  it('should call flattenDeep', () => {
    const service = TestBed.get(CourseConsumptionService);
    const response = service.flattenDeep(courseConsumptionServiceMockData.contents);
    expect(response.length).toBe(2);
  });

  it('should call parseChildren', () => {
    const service = TestBed.get(CourseConsumptionService);
    const response = service.parseChildren(courseConsumptionServiceMockData.courseHierarchy);
    expect(response).toEqual(courseConsumptionServiceMockData.parseChildrenResult);
  });
  it(`Show throw error with msg The course doesn't have any open batches and emit enableCourseEntrollment as false event`, () => {
    const service = TestBed.get(CourseConsumptionService);
    spyOn(service['toasterService'], 'error');
    spyOn(service['enableCourseEntrollment'], 'emit');
    service.getAllOpenBatches({content: [], count: 0});
    expect(service['enableCourseEntrollment'].emit).toHaveBeenCalledWith(false);
    expect(service['toasterService'].error).toHaveBeenCalledWith(service['resourceService'].messages.emsg.m0003);
  });

  it(`Show emit enableCourseEntrollment as true event`, () => {
    const service = TestBed.get(CourseConsumptionService);
    spyOn(service['enableCourseEntrollment'], 'emit');
    service.getAllOpenBatches({ content: [{ enrollmentType: 'open' }], count: 1 });
    expect(service['enableCourseEntrollment'].emit).toHaveBeenCalledWith(true);
  });

  it('should call setPreviousAndNextModule and check only next module is defined', () => {
    const service = TestBed.get(CourseConsumptionService);
    const parentCourse = courseConsumptionServiceMockData.courseHierarchy;
    const collectionId = 'do_1130272760359813121209';
    const returnVal = service.setPreviousAndNextModule(parentCourse, collectionId);
    expect(returnVal.next).toBeDefined();
    expect(returnVal.prev).toBeUndefined();
  });

  it('should call setPreviousAndNextModule and check both prev/next module is defined', () => {
    const service = TestBed.get(CourseConsumptionService);
    const parentCourse = courseConsumptionServiceMockData.courseHierarchy;
    const collectionId = 'do_1130272760359567361201';
    const returnVal = service.setPreviousAndNextModule(parentCourse, collectionId);
    expect(returnVal.next).toBeDefined();
    expect(returnVal.prev).toBeDefined();
  });

  it('should call setPreviousAndNextModule and check only prev module is defined', () => {
    const service = TestBed.get(CourseConsumptionService);
    const parentCourse = courseConsumptionServiceMockData.courseHierarchy;
    const collectionId = 'do_1130272760359567361207';
    const returnVal = service.setPreviousAndNextModule(parentCourse, collectionId);
    expect(returnVal.next).toBeUndefined();
    expect(returnVal.prev).toBeDefined();
  });

  it('should set course page previous url', () => {
    const service = TestBed.get(CourseConsumptionService);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue({ url: '/learn' });
    service.setCoursePagePreviousUrl();
    expect(service.coursePagePreviousUrl).toEqual({ url: '/learn' });
  });

  it('should return course page previous url', () => {
    const service = TestBed.get(CourseConsumptionService);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue({ url: '/learn' });
    service.setCoursePagePreviousUrl();
    const previousPageUrl = service.getCoursePagePreviousUrl;
    expect(service.coursePagePreviousUrl).toEqual(previousPageUrl);
  });
});
