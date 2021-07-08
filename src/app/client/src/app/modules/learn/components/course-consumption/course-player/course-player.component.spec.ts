import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreModule, PermissionService, UserService, GeneraliseLabelService } from '@sunbird/core';
import { AssessmentScoreService, CourseBatchService, CourseConsumptionService, CourseProgressService } from '@sunbird/learn';
import { ContentUtilsServiceService, ResourceService, SharedModule, ToasterService, WindowScrollService } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { BehaviorSubject, of } from 'rxjs';
import { NotificationServiceImpl } from '../../../../notification/services/notification/notification-service-impl';
import { assessmentPlayerMockData } from '../assessment-player/assessment-player.component.data.spec';
import { CoursesService } from './../../../../core/services/course/course.service';
import { enrolledBatch } from './../../batch/batch-details/batch-details.component.data';
import { enrolledBatchWithCertificate } from './../../batch/batch-details/batch-details.component.data';
import { CoursePlayerComponent } from './course-player.component';
import { CourseHierarchyGetMockResponse, CourseHierarchyGetMockResponseFlagged, telemetryInteractMockData, enrolledCourseMockData } from './course-player.component.mock.data';

describe('CoursePlayerComponent', () => {
  let component: CoursePlayerComponent;
  let fixture: ComponentFixture<CoursePlayerComponent>;
  let contentUtilsServiceService;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const batchs = [
    {
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: null,
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2045-12-25',
      status: 1
    },
    {
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: null,
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2045-08-25',
      status: 1
    },
    {
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: '2020-02-10',
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2045-01-25',
      status: 1
    }
  ]
  const featureBatch = [
    {
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: null,
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2045-10-25',
      status: 1
    },
    {
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: '2020-02-10',
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2045-01-25',
      status: 1
    }
  ]
  const ongoingBatch = [
    {
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: null,
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2020-08-25',
      status: 1
    },
    {
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: '2020-02-10',
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2020-01-25',
      status: 1
    }
  ]
  const resourceServiceMockData = {
    messages: {
      imsg: { m0027: 'Something went wrong' },
      stmsg: { m0009: 'error' },
      emsg: {
         m0005: 'error',
         m0003: `The Course doesn't have any open batches`,
         m009: `The course's batch is available from {startDate}`,
         m008 : `The batch's enrollment date {endDate} is crossed`
         }
    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        description: 'description',
        joinTrainingToAcessContent : 'You must join the course to get complete access to content'
      }
    }
  };
  const MockCSService = {
    getUserFeed() { return of({}); },
    updateUserFeedEntry() { return of({}); },
    deleteUserFeedEntry() { return of({}); },
    getContentState() { return of({}); }
  };

  class ActivatedRouteStub {
    paramsMock = new BehaviorSubject<any>({ courseId: 'do_212347136096788480178', batchId: 'do_112498388508524544160' });
    snapshot = {
      data: {
        telemetry: { env: 'course', pageid: 'course-read', type: 'workflow', object: { ver: '1.0', type: 'course' } }
      },
      queryParams: { 
        showCourseCompleteMessage: 'true'
      },
      params: {
        courseId: 'do_112270494168555520130'
      }
    };
    queryParamsMock = { contentId: 'do_112270494168555520130' };
    queryParams = of(this.queryParamsMock);
    get params() {
      return this.paramsMock.asObservable();
    }
    public changeParams(params) {
      this.paramsMock.next(params);
    }
    public changeQueryParams(params) {
      this.queryParamsMock = params;
    }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoursePlayerComponent],
      providers: [CourseConsumptionService, CourseProgressService, CourseBatchService, CoursesService, AssessmentScoreService,
        ContentUtilsServiceService, TelemetryService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        NotificationServiceImpl,
        { provide: 'CS_USER_SERVICE', useValue: MockCSService },
        { provide: 'CS_COURSE_SERVICE', useValue: MockCSService },
      ],
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, TelemetryModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePlayerComponent);
    component = fixture.componentInstance;
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    contentUtilsServiceService = TestBed.get(ContentUtilsServiceService);
    const generaliseLabelService = TestBed.get(GeneraliseLabelService);
    generaliseLabelService.frmelmnts = resourceServiceMockData.frmelmnts;
    component.showLastAttemptsModal = false;
  });

  afterEach(() => {
    fixture.destroy();
  });


  it('should fetch certificate description', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const windowScrollService = TestBed.get(WindowScrollService);
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatchWithCertificate.result.response));
    spyOn(windowScrollService, 'smoothScroll');
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.certificateDescription['description']).toBe('This course certificate is only for Rajasthan users scoring 80% or above');
  });

  it('should fetch courseHierarchy from courseConsumptionService', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const windowScrollService = TestBed.get(WindowScrollService);
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
    spyOn(windowScrollService, 'smoothScroll');
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.courseHierarchy).toBeDefined();
    expect(component.certificateDescription['description']).toBe('');
  });

  it('should set enrolledCourse to true if batchId is provided by activatedRoute', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    const courseBatchService = TestBed.get(CourseBatchService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeTruthy();
  });

  it('should get content state if course is enrolled', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(component, 'getDataSetting').and.returnValue(false);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeTruthy();
    expect(component.contentStatus).toBeDefined();
  });

  it('should not play the content obtained from url if enrolled course and course is flagged', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').
      and.returnValue(of(CourseHierarchyGetMockResponseFlagged.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponseFlagged.result));
    spyOn(component, 'getDataSetting').and.returnValue(false);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeTruthy();
    expect(component.contentId).toBeUndefined();
    expect(component.flaggedCourse).toBeTruthy();
    expect(component.playerConfig).toBeUndefined();
    expect(component.contentTitle).toBeUndefined();
  });
  it('should play the content obtained from url if enrolled course and should set prev and next playable content', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(false);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeTruthy();
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
    expect(component.contentTitle).toBeUndefined();
  });

  it('should play content if course status is unlisted', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178', courseStatus: 'Unlisted' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(false);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
  });

  it('should not play content if course is not enrolled', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(false);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
  });

  it('should play content for course creator', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const userService = TestBed.get(UserService);
    userService._userid = 'testUser';
    activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
  });
  it('should not play content if his not course creator', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const userService = TestBed.get(UserService);
    userService._userid = 'testUser2';
    activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
  });
  it('should play content for course mentor', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const userService = TestBed.get(UserService);
    const permissionService = TestBed.get(PermissionService);
    activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue(true);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.permissionService.checkRolesPermissions)
      .toHaveBeenCalledWith(['COURSE_MENTOR', 'CONTENT_REVIEWER', 'CONTENT_CREATOR', 'CONTENT_CREATION']);
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
  });
  it('should not play content if not course mentor', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const userService = TestBed.get(UserService);
    const permissionService = TestBed.get(PermissionService);
    activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue(false);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeFalsy();
    expect(component.permissionService.checkRolesPermissions)
      .toHaveBeenCalledWith(['COURSE_MENTOR', 'CONTENT_REVIEWER', 'CONTENT_CREATOR', 'CONTENT_CREATION']);
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
  });
  it('should not play the content enrolled batch status is 0', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    const courseBatchService = TestBed.get(CourseBatchService);
    enrolledBatch.result.response.status = 0;
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeTruthy();
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
    expect(component.contentTitle).toBeUndefined();
    enrolledBatch.result.response.status = 1;
  });
  it('should not display error message if content id is not available in queryparams', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const toasterService = TestBed.get(ToasterService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    activatedRouteStub.queryParams = of({});
    activatedRouteStub.changeParams({ courseStatus: 'Unlisted' });
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(toasterService.error).not.toHaveBeenCalled();
    expect(component.courseStatus).toEqual('Unlisted');
  });

  it('should not make update contentState api call if the content is youTube and progress is greater than 20%', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const contentData = { model: { mimeType: 'video/x-youtube' } };
    const telemetryEvent = {
      detail: {
        telemetryData: {
          eid: 'END',
          edata: { summary: [{ progress: 19 }] }
        }
      }
    };
    spyOn(component, 'findContentById').and.returnValue(contentData);
    spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
    component.batchId = '123';
    component.enrolledBatchInfo = { status: 1 };
    expect(courseConsumptionService.updateContentsState).not.toHaveBeenCalled();
  });
  it('should not make update contentState api call if the content is video/mp4 and progress is greater than 20%', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const contentData = { model: { mimeType: 'video/mp4' } };
    const telemetryEvent = {
      detail: {
        telemetryData: {
          eid: 'END',
          edata: { summary: [{ progress: 19 }] }
        }
      }
    };
    spyOn(component, 'findContentById').and.returnValue(contentData);
    spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
    component.batchId = '123';
    component.enrolledBatchInfo = { status: 1 };
    expect(courseConsumptionService.updateContentsState).not.toHaveBeenCalled();
  });
  it('should not make update contentState api call if the the content is not(html,h5p,video/youtub) and progress is equal to 100',
    () => {
      const courseConsumptionService = TestBed.get(CourseConsumptionService);
      const contentData = { model: { mimeType: 'application/vnd.ekstep.eclm-archive' } };
      const playerDestroyData = { contentId: '123' };
      const telemetryEvent = {
        detail: {
          telemetryData: {
            eid: 'END',
            edata: { summary: [{ progress: 20 }] }
          }
        }
      };
      spyOn(component, 'findContentById').and.returnValue(contentData);
      spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
      component.courseProgressData = { content: [{ contentId: '123', status: 1 }] };
      component.enrolledBatchInfo = { status: 1 };
      expect(courseConsumptionService.updateContentsState).not.toHaveBeenCalled();
    });
  it('should show join training popup if course is unenrolled and try to play content', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const userService = TestBed.get(UserService);
    userService._userid = 'testUser2';
    component['courseId'] = 'do_212347136096788480178';
    activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(courseConsumptionService.updateContentConsumedStatus, 'subscribe').and.callThrough();
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeFalsy();
    component.navigateToContent({ title: component.contentTitle, id: component.contentIds[1] });
    expect(component.showJoinTrainingModal).toBeFalsy();
    courseConsumptionService.updateContentConsumedStatus.emit({ courseHierarchy: {} });
    expect(courseConsumptionService.updateContentConsumedStatus.subscribe).toHaveBeenCalled();
  });
  xit('should log telemetry on click of close icon on join training popup ', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const resourceService = TestBed.get(ResourceService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    userService._userid = 'testUser2';
    activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
    spyOn(component, 'getDataSetting').and.returnValue(true);
    component.ngOnInit();
    expect(component.enrolledCourse).toBeFalsy();
    component.navigateToContent({ title: component.contentTitle, id: component.contentIds[1] });
    expect(telemetryService.interact).toHaveBeenCalledWith(telemetryInteractMockData);
  });


  it('should call calculateProgress', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.calculateProgress();
  });
  it('should call calculateProgress, if single content', () => {
    component.courseHierarchy = {
      children: [{ name: 'acd' }, { name: 'sd' }]
    };
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.calculateProgress();
  });

  it('should call getContentState', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    spyOn(courseProgressService, 'getContentState').and.returnValue(of({}));
    component['getContentState']();
  });

  it('should call parseChildContent', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    fixture.detectChanges();
    component['parseChildContent']();
    expect(component.contentIds.length).toBeGreaterThan(0);
  });

  it('should subscribe to updateContentConsumedStatus', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService.updateContentConsumedStatus, 'subscribe');
    component.ngOnInit();
    courseConsumptionService.updateContentConsumedStatus.emit({ courseHierarchy: {} });
    expect(courseConsumptionService.updateContentConsumedStatus.subscribe).toHaveBeenCalled();
  });

  xit('should call navigateToContent', () => {
    spyOn(component, 'logTelemetry');
    spyOn<any>(component, 'navigateToPlayerPage');
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.showLastAttemptsModal = false;
    component.navigateToContent({ event: { type: 'click' }, data: { identifier: '12343536' } }, 'test');
    expect(component.navigateToPlayerPage).toHaveBeenCalled();
  });

  it('should navigate to the player page with selected content', () => {
    component.batchId = '023214178121';
    component.enrolledCourse = true;
    component['courseId'] = 'do_343432283682323';
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.navigateToPlayerPage(assessmentPlayerMockData.activeContent, { event: { type: 'click' }, data: { identifier: 'do_323243834364386' } });
    expect(component['router'].navigate).toHaveBeenCalled();
  });

  it('should navigate to the player page with, first non-consumed content', () => {
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.batchId = '023214178121';
    component.enrolledCourse = true;
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue(['do_11287204084174028818']);
    component.navigateToPlayerPage(assessmentPlayerMockData.courseHierarchy);
  });

  it('should show join course popup if the course is not enrolled or the user has preview permission', () => {
    component.hasPreviewPermission = false;
    component.contentStatus = [];
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.navigateToPlayerPage(assessmentPlayerMockData.courseHierarchy);
    expect(component.showJoinTrainingModal).toBe(true);
  });

  it(`Show throw error with msg The course doesn't have any open batches`, () => {
    spyOn(component['courseConsumptionService'], 'getAllOpenBatches');
    component.getAllBatchDetails({ content: [], count: 0 });
    expect(component['courseConsumptionService'].getAllOpenBatches).toHaveBeenCalledWith({ content: [], count: 0 });
  });

  it('should call shareUnitLink', () => {
    const contentUtilServiceService = TestBed.get(ContentUtilsServiceService);
    spyOn(contentUtilServiceService, 'getCoursePublicShareUrl').and.returnValue('http://localhost:3000/explore-course/course/do_1130314965721088001129');
    spyOn(component, 'setTelemetryShareData');
    component.shareUnitLink({ identifier: 'do_23823253221' });
    expect(component.shareLink).toEqual('http://localhost:3000/explore-course/course/do_1130314965721088001129?moduleId=do_23823253221');
    expect(component.setTelemetryShareData).toHaveBeenCalled();
  });

  it('should call setTelemetryShareData', () => {
    const param = {
      identifier: 'do_1130314965721088001129',
      contentType: 'Course',
      pkgVersion: 2
    };
    component.setTelemetryShareData(param);
    expect(component.telemetryShareData).toBeDefined();
    expect(component.telemetryShareData).toEqual([{ id: param.identifier, type: param.contentType, ver: param.pkgVersion.toString() }]);
  });

  it('should close the popup and generate telemetry', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.telemetryCdata = [{ id: '22321244', type: 'CourseBatch' }];
    component['courseId'] = assessmentPlayerMockData.courseHierarchy.identifier;
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.closeSharePopup('close-share-link-popup');
    expect(component.shareLinkModal).toBe(false);
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('should close the join training popup on browser back button click', () => {
    component.hasPreviewPermission = false;
    component.contentStatus = [];
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.navigateToPlayerPage(assessmentPlayerMockData.courseHierarchy);
    expect(component.showJoinTrainingModal).toBe(true);
    component.ngOnDestroy();
    expect(component.joinTrainingModal).toBeUndefined();
  });

  it('should call collapsedChange', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    fixture.detectChanges();
    component.collapsedChange(false, 0);
    expect(component.courseHierarchy.children[0].collapsed).toBeFalsy();
  });

  it('should show course last updated on warning message', () => {
    const courseService = TestBed.get(CoursesService);
    spyOn(courseService, 'getEnrolledCourses').and.returnValue(of(enrolledCourseMockData));
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    component['courseId'] = 'do_212347136096788480178';
    component.courseHierarchy.lastUpdatedOn = new Date();
    component.isCourseModifiedAfterEnrolment();
    expect(component.isEnrolledCourseUpdated).toBeTruthy();
  });

  it('should not show course last updated on warning message if course is not enrolled', () => {
    const courseService = TestBed.get(CoursesService);
    spyOn(courseService, 'getEnrolledCourses').and.returnValue(of(enrolledCourseMockData));
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    component['courseId'] = 'do_212347136096788480178';
    component.courseHierarchy.lastUpdatedOn = '2019-05-04 09:57:34:907+0000';
    component.isCourseModifiedAfterEnrolment();
    expect(component.isEnrolledCourseUpdated).toBeFalsy();
  });

  it('should show course completion message when course progress is 100', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    activatedRouteStub.snapshot.queryParams = { showCourseCompleteMessage: 'true' };
    component.ngOnInit();
    courseProgressService.courseProgressData.emit({progress: 100});
    expect(component.showCourseCompleteMessage).toBeTruthy();
  });

  it('should not show course completion message when course progress is less than 100', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    const activatedRouteStub = TestBed.get(ActivatedRoute);
    activatedRouteStub.snapshot.queryParams = { showCourseCompleteMessage: 'true' };
    component.ngOnInit();
    courseProgressService.courseProgressData.emit({progress: 90});
    expect(component.showCourseCompleteMessage).toBeFalsy();
  });

  it('should navigate to cert-configuration page if the event.mode is add-certificates', () => {
    spyOn(component, 'navigateToConfigureCertificate').and.stub();
    spyOn(component, 'logTelemetry').and.stub();
    const eventData = {
      mode: 'add-certificates',
      batchId: '123456'
    };
    component.onPopupClose(eventData);
    expect(component.navigateToConfigureCertificate).toHaveBeenCalledWith('add', '123456');
    expect(component.logTelemetry).toHaveBeenCalledWith('choose-to-add-certificate');
    expect(component.showConfirmationPopup).toBeFalsy();
  });

  it('should only log telemetry if the event.mode is other than add-certificates', () => {
    spyOn(component, 'navigateToConfigureCertificate').and.stub();
    spyOn(component, 'logTelemetry').and.stub();
    const eventData = {
      mode: 'OTHER_EVENT_MODE',
      batchId: '123456'
    };
    component.onPopupClose(eventData);
    expect(component.logTelemetry).toHaveBeenCalledWith('deny-add-certificate');
    expect(component.showConfirmationPopup).toBeFalsy();
  });

  it('should only close the popup if the event does not contain any mode', () => {
    spyOn(component, 'logTelemetry').and.stub();
    const eventData = {
    };
    component.onPopupClose(eventData);
    expect(component.showConfirmationPopup).toBeFalsy();
  });

  it('should navigate to cert-configuration page', () => {
    component['courseId'] = 'do_123456';
    const router = TestBed.get(Router);
    component.navigateToConfigureCertificate('add', '123456');
    expect(router.navigate).toHaveBeenCalledWith(['/certs/configure/certificate'], {
      queryParams: {
        type: 'add',
        courseId: 'do_123456',
        batchId: '123456'
      }
    });
  });
  it('shold call navigateToPlayerPage case 1', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    spyOn(component, 'validateBatchDate').and.stub();
    component.enrolledCourse = false;
    component.hasPreviewPermission = false;
    component.courseHierarchy.batches = [batchs[0]];
    component.navigateToPlayerPage({});
     expect(component.validateBatchDate).toHaveBeenCalledWith([batchs[0]]);
  })

  it('shold call navigateToPlayerPage case 2', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    component.courseHierarchy = CourseHierarchyGetMockResponse.result.content;
    spyOn(component, 'validateBatchDate').and.stub();
    component.enrolledCourse = false;
    component.hasPreviewPermission = false;
    component.courseHierarchy.batches = featureBatch;
    component.navigateToPlayerPage({});
    expect(component.validateBatchDate).toHaveBeenCalledWith([featureBatch[0]]);
  });

  it('shold call validateBatchDate with future batch', () => {
    const batch = [{
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: null,
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2045-12-25',
      status: 1
    }];
    const message = (resourceServiceMockData.messages.emsg.m009).replace('{startDate}', batch[0]['startDate']);
    expect(component.validateBatchDate(batch)).toBe(message);
  });

  it('shold call validateBatchDate with expired batch', () => {
    const batch = [{
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: '2020-02-02',
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2020-01-25',
      status: 1
    }];
    const message = (resourceServiceMockData.messages.emsg.m008).replace('{endDate}', batch[0]['enrollmentEndDate']);
    expect( component.validateBatchDate(batch)).toBe(message);
  });

  it('shold call validateBatchDate with ongoing batch', () => {
    const batch = [{
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: null,
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2020-08-25',
      status: 1
    }];
    const message = resourceServiceMockData.frmelmnts.lbl.joinTrainingToAcessContent;
    expect(component.validateBatchDate(batch)).toBe(message);
  });

  it('should navigate to the player page with, first non-consumed content', () => {
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.batchId = '023214178121';
    component.enrolledCourse = true;
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue(['do_112832506508320768123']);
    component.navigateToPlayerPage(assessmentPlayerMockData.courseHierarchy);
  });

  it('should navigate to the player page with, first non-consumed content', () => {
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.batchId = '023214178121';
    component.enrolledCourse = true;
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue(['do_1128325065083207681123']);
    component.navigateToPlayerPage(assessmentPlayerMockData.courseHierarchy);
  });
  it('should call navigateToContent with nogroupData', () => {
    spyOn(component, 'logTelemetry');
    spyOn<any>(component, 'navigateToPlayerPage');
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.addToGroup = true;
    component.navigateToContent({  data: { identifier: '12343536' } }, 'test');
  });
  it('should call navigateToContent with groupData', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.addToGroup = false;
    component.navigateToContent({  data: { identifier: '12343536' } }, 'test');
  });

  it('should show consent PII section', () => {
    const userService = TestBed.get(UserService);
    userService._userid = 'testUser1';
    userService._userProfile = {isMinor: false};
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.courseHierarchy['userConsent'] = 'Yes';
    component.enrolledCourse = true;
    spyOn(component['courseConsumptionService'], 'canViewDashboard').and.returnValue(false);
    const response = component.getDataSetting();
    expect(response).toBeTruthy();
  });

  it('should now show consent PII section', () => {
    const userService = TestBed.get(UserService);
    userService._userid = 'testUser1';
    userService._userProfile = {isMinor: true};
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.courseHierarchy['userConsent'] = 'No';
    spyOn(component['courseConsumptionService'], 'canViewDashboard').and.returnValue(false);
    const response = component.getDataSetting();
    expect(response).toBeFalsy();
  });

  it('shold call validateBatchDate with expired batch', () => {
    const batch = [{
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: '2020-02-02',
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2020-01-25',
      status: 1
    }];
    const message = (resourceServiceMockData.messages.emsg.m008).replace('{endDate}', batch[0]['enrollmentEndDate']);
    expect( component.validateBatchDate(batch)).toBe(message);
  });

  it('shold call validateBatchDate with ongoing batch', () => {
    const batch = [{
      batchId: '0130936282663157765',
      createdFor: ['0124784842112040965'],
      endDate: null,
      enrollmentEndDate: null,
      enrollmentType: 'open',
      name: 'SHS cert course 1 - 0825',
      startDate: '2020-08-25',
      status: 1
    }];
    const message = resourceServiceMockData.frmelmnts.lbl.joinTrainingToAcessContent;
    expect(component.validateBatchDate(batch)).toBe(message);
  });

  it('should navigate to the player page with, first non-consumed content', () => {
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.batchId = '023214178121';
    component.enrolledCourse = true;
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue(['do_112832506508320768123']);
    component.navigateToPlayerPage(assessmentPlayerMockData.courseHierarchy);
  });

  it('should navigate to the player page with, first non-consumed content', () => {
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.batchId = '023214178121';
    component.enrolledCourse = true;
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue(['do_1128325065083207681123']);
    component.navigateToPlayerPage(assessmentPlayerMockData.courseHierarchy);
  });
  it('should call navigateToContent with nogroupData', () => {
    spyOn(component, 'logTelemetry');
    spyOn<any>(component, 'navigateToPlayerPage');
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.addToGroup = true;
    component.navigateToContent({  data: { identifier: '12343536' } }, 'test');
  });
  it('should call navigateToContent with groupData', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.addToGroup = false;
    component.navigateToContent({  data: { identifier: '12343536' } }, 'test');
  });
});
