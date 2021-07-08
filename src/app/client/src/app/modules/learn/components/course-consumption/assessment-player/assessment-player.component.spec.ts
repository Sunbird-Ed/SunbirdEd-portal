import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CsContentProgressCalculator } from '@project-sunbird/client-services/services/content/utilities/content-progress-calculator';
import { CoreModule, PlayerService, UserService } from '@sunbird/core';
import { CourseBatchService } from '@sunbird/learn';
import {
  NavigationHelperService, ResourceService, SharedModule, ToasterService,
  ContentUtilsServiceService
} from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { SuiModule } from 'ng2-semantic-ui';
import { of, throwError } from 'rxjs';
import { NotificationServiceImpl } from '../../../../notification/services/notification/notification-service-impl';
import { AssessmentScoreService } from '../../../services/assessment/assessment-score.service';
import { CourseConsumptionService } from '../../../services/course-consumption/course-consumption.service';
import { CourseProgressService } from '../../../services/courseProgress/course-progress.service';
import { AssessmentPlayerComponent } from './assessment-player.component';
import { assessmentPlayerMockData } from './assessment-player.component.data.spec';

describe('AssessmentPlayerComponent', () => {
  let component: AssessmentPlayerComponent;
  let fixture: ComponentFixture<AssessmentPlayerComponent>;

  const resourceMockData = {
    messages: {
      fmsg: { m0051: 'Fetching districts failed. Try again later' },
      stmsg: { m0009: 'Cannot un-enrol now. Try again later', m0005: 'Something went wrong', m0121: 'Content not added yet' }
    },
    frmelmnts: {
      lbl: { selfAssessLastAttempt: 'This is the last attempt remaining' }
    },
    languageSelected$: of({})
  };

  const fakeActivatedRoute = {
    'params': of({ collectionId: 'Test_Textbook2_8907797' }),
    queryParams: of({ batchId: '12312433', courseId: '12312433456', selectedContent: assessmentPlayerMockData.activeContent.identifier }),
    snapshot: { data: { telemetry: { env: 'course', type: '', pageid: 'course-read', object: { ver: '1.0', type: 'batch' } } } }
  };

  const MockCSService = {
    getUserFeed() { return of({}); },
    updateUserFeedEntry() { return of({}); },
    deleteUserFeedEntry() { return of({}); },
    getContentState() { return of({}); }
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentPlayerComponent],
      imports: [
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        SuiModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule],
      providers: [
        UserService, CsContentProgressCalculator, NavigationHelperService,
        { provide: ResourceService, useValue: resourceMockData },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        ContentUtilsServiceService,
        NotificationServiceImpl, CourseProgressService,
        { provide: 'CS_USER_SERVICE', useValue: MockCSService },
        { provide: 'CS_COURSE_SERVICE', useValue: MockCSService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentPlayerComponent);
    component = fixture.componentInstance;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component['activeContent'] = { contentType: 'SelfAssess', identifier: 'do_2334343', maxAttempts: 3 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn<any>(component, 'subscribeToQueryParam');
    spyOn(component, 'getLanguageChangeEvent');
    fixture.detectChanges();
    component.ngOnInit();
    expect(component['subscribeToQueryParam']).toHaveBeenCalled();
    expect(component.getLanguageChangeEvent).toHaveBeenCalled();
  });

  it('should go to courseDetails page', fakeAsync(() => {
    spyOn(component['router'], 'navigate');
    component.isCourseCompletionPopupShown = true;
    fixture.detectChanges();
    component.goBack();
    tick(500);
    fixture.detectChanges();
    expect(component['router'].navigate).toHaveBeenCalled();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/learn/course', '12312433456', 'batch', '12312433'], { queryParams: {} });
  }));

  it('should go back with showCourseCompleteMessage=true if course completion popup is not shown', fakeAsync(() => {
    spyOn(component['router'], 'navigate');
    fixture.detectChanges();
    component.goBack();
    tick(500);
    fixture.detectChanges();
    const paramas = { showCourseCompleteMessage: true };
    expect(component['router'].navigate).toHaveBeenCalledWith(['/learn/course', '12312433456', 'batch', '12312433'],
      { queryParams: paramas });
  }));

  it('should call subscribeToQueryParam', () => {
    spyOn<any>(component, 'setTelemetryCourseImpression');
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({ courseHierarchy: {}, enrolledBatchDetails: {} }));
    fixture.detectChanges();
    component['subscribeToQueryParam']();
    expect(component['setTelemetryCourseImpression']).toHaveBeenCalled();
  });

  xit('should call subscribeToQueryParam, on error', fakeAsync(() => {
    component.batchId = '0130272832104038409';
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(component, 'goBack');
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(throwError({}));
    component.activeContent = { identifier: 'do_2334343' };
    tick(500);
    fixture.detectChanges();
    component['subscribeToQueryParam']();
    expect(toasterService.error).toHaveBeenCalled();
    expect(component.goBack).toHaveBeenCalled();
  }));

  it('should call subscribeToQueryParam, and get collection', () => {
    component.isParentCourse = false;
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue({ result: { content: assessmentPlayerMockData.activeContent } });
    spyOn<any>(component, 'setTelemetryCourseImpression');
    spyOn(component, 'setActiveContent');
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({
      courseHierarchy: assessmentPlayerMockData.courseHierarchy,
      enrolledBatchDetails: { identifier: 'do_2334343' }
    }));
    fixture.detectChanges();
    component['subscribeToQueryParam']();
    expect(component['setTelemetryCourseImpression']).toHaveBeenCalled();
  });
  xit('should call subscribeToQueryParam, when no bachID present', () => {
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue({
      result: {
        content: assessmentPlayerMockData.courseHierarchy
      }
    });
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({
      courseHierarchy: assessmentPlayerMockData.courseHierarchy,
      enrolledBatchDetails: {}
    }));
    component['subscribeToQueryParam']();
    expect(component['getCollectionInfo']).toHaveBeenCalled();
  });

  xit('should setActiveContent when its single content', () => {
    component.courseHierarchy = assessmentPlayerMockData.activeContent;
    spyOn<any>(component, 'getContentState');
    spyOn<any>(component, 'initPlayer');
    fixture.detectChanges();
    component.setActiveContent(assessmentPlayerMockData.activeContent.identifier, true);
    expect(component.activeContent).toEqual(assessmentPlayerMockData.activeContent);
    expect(component['initPlayer']).toHaveBeenCalledWith(assessmentPlayerMockData.activeContent.identifier);
    expect(component['getContentState']).toHaveBeenCalled();
  });

  it('should call firstNonCollectionContent', () => {
    const resp = component['firstNonCollectionContent']([]);
    expect(resp).toEqual(undefined);
  });

  xit('should call initPlayer success', () => {
    component.collectionId = 'do_11287204084174028818';
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of({}));
    spyOn<any>(component, 'setTelemetryContentImpression');
    fixture.detectChanges();
    component['initPlayer']('do_3232431');
    expect(component.showLoader).toBe(true);
    expect(component.playerConfig).toEqual({});
  });

  it('should call getLanguageChangeEvent', () => {
    component.getLanguageChangeEvent();
    expect(component.noContentMessage).toEqual('Content not added yet');
  });

  it('should call initPlayer on error', () => {
    component.collectionId = 'do_11287204084174028818';
    const toasterService = TestBed.get(ToasterService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(throwError({}));
    spyOn(toasterService, 'error');
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component['initPlayer']('do_3232431');
    expect(courseConsumptionService.getConfigByContent).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('Cannot un-enrol now. Try again later');
    expect(component.contentStatus[4]['bestScore']).toBeDefined();
    expect(component.contentStatus[4]['score']).toBeDefined();
    expect(component.contentStatus[4]['score'].length).toEqual(1);
  });

  it('should call onTocCardClick', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    spyOn<any>(component, 'initPlayer');
    spyOn(component, 'highlightContent');
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component.navigationObj = { event: { data: { identifier: 'do_2334343' } }, id: 'test' };
    component.onTocCardClick();
    expect(component.activeContent).toEqual({ identifier: 'do_2334343' });
    expect(component['initPlayer']).toHaveBeenCalledWith('do_2334343');
    expect(component.highlightContent).toHaveBeenCalled();
    expect(component.contentStatus[4]['bestScore']).toBeDefined();
    expect(component.contentStatus[4]['score']).toBeDefined();
    expect(component.contentStatus[4]['score'].length).toEqual(1);
  });

  it('should call getContentState', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue(['do_123232']);
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of({ content: [] }));
    spyOn(component, 'calculateProgress');
    spyOn(component, 'highlightContent');
    fixture.detectChanges();
    component['getContentState']();
    expect(component.calculateProgress).toHaveBeenCalled();
    expect(component.contentStatus).toEqual([{ contentId: 'do_123232', status: 0, courseId: '12312433456', batchId: '12312433' }]);
    expect(courseConsumptionService.parseChildren).toHaveBeenCalled();
    expect(component.highlightContent);
  });

  it('should call contentProgressEvent', () => {
    component.batchId = '121787782323';
    component.enrolledBatchInfo = { status: 1 };
    component.isUnitCompleted = false;
    spyOn<any>(component, 'validEndEvent').and.returnValue(false);
    fixture.detectChanges();
    const event = { detail: { telemetryData: { eid: 'END' } } };
    const resp = component.contentProgressEvent(event);
    expect(resp).toBe(undefined);
  });

  it('should call contentProgressEvent', () => {
    component.batchId = '121787782323';
    component.enrolledBatchInfo = { status: 1 };
    component.activeContent = {
      contentType: 'Course'
    };
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn<any>(component, 'validEndEvent').and.returnValue(true);
    spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({ content: {} }));
    const event = { detail: { telemetryData: { eid: 'END' } } };
    component.isRouterExtrasAvailable = false;
    fixture.detectChanges();
    component.contentProgressEvent(event);
    expect(courseConsumptionService.updateContentsState).toHaveBeenCalled();
  });

  it('should call contentProgressEvent', () => {
    component.batchId = '121787782323';
    component.enrolledBatchInfo = { status: 1 };
    component.activeContent = {
      contentType: 'SelfAssess'
    };
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn<any>(component, 'validEndEvent').and.returnValue(true);
    spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(throwError({}));
    const event = {
      detail: { telemetryData: { eid: undefined } },
      data: 'renderer:question:submitscore'
    };
    component.isRouterExtrasAvailable = false;
    fixture.detectChanges();
    component.contentProgressEvent(event);
    expect(courseConsumptionService.updateContentsState).toHaveBeenCalled();

  });

  it('should not update content state if, batch id is not present', () => {
    component.batchId = undefined;
    fixture.detectChanges();
    const resp = component['contentProgressEvent']({});
    expect(resp).toBe(undefined);
  });

  it('should not proceed further if batchId not found inside contentProgressEvent()', () => {
    component.batchId = undefined;
    fixture.detectChanges();
    component.contentProgressEvent(assessmentPlayerMockData.playerEndData);
    expect(component.contentProgressEvent(assessmentPlayerMockData.playerEndData)).toBeFalsy();
  });

  it('should  proceed further if batch status is 1 inside contentProgressEvent()', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    component.batchId = '11259794895';
    component.enrolledBatchInfo = { status: 1 };
    spyOn<any>(component, 'validEndEvent').and.returnValues(100);
    spyOn<any>(courseConsumptionService, 'updateContentsState').and.returnValues(of({}));
    component.activeContent = assessmentPlayerMockData.activeContent;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component.contentProgressEvent(assessmentPlayerMockData.playerEndData);
    expect(component.contentProgressEvent(assessmentPlayerMockData.playerEndData)).toBeFalsy();
  });

  it('should call onAssessmentEvents', () => {
    component.batchId = '0130272832104038409';
    component.enrolledBatchInfo = { status: 2 };
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    const assessmentScoreService = TestBed.get(AssessmentScoreService);
    spyOn(assessmentScoreService, 'receiveTelemetryEvents').and.stub();
    spyOn(component, 'calculateProgress').and.stub();
    fixture.detectChanges();
    component.onAssessmentEvents({});
  });

  it('should call onAssessmentEvents', () => {
    component.batchId = '0130272832104038409';
    component.enrolledBatchInfo = { status: 1 };
    const assessmentScoreService = TestBed.get(AssessmentScoreService);
    spyOn(assessmentScoreService, 'receiveTelemetryEvents');
    spyOn(component, 'calculateProgress');
    fixture.detectChanges();
    component.onAssessmentEvents({});
    expect(assessmentScoreService.receiveTelemetryEvents).toHaveBeenCalled();
    expect(component.calculateProgress).toHaveBeenCalled();
  });

  it('should call onQuestionScoreSubmitEvents', () => {
    const assessmentScoreService = TestBed.get(AssessmentScoreService);
    spyOn(assessmentScoreService, 'handleSubmitButtonClickEvent');
    spyOn(component, 'contentProgressEvent');
    fixture.detectChanges();
    component.onQuestionScoreSubmitEvents({});
    expect(assessmentScoreService.handleSubmitButtonClickEvent).toHaveBeenCalledWith(true);
    expect(component.contentProgressEvent).toHaveBeenCalled();
  });

  it('should call calculate method to get the courseProgress', () => {
    const playerSummury = assessmentPlayerMockData.playerSummuryData;
    const mimeType = 'application/vnd.ekstep.ecml-archive';
    spyOn<any>(CsContentProgressCalculator, 'calculate').and.returnValue(100);
    component.activeContent = assessmentPlayerMockData.activeContent;
    fixture.detectChanges();
    component['validEndEvent'](assessmentPlayerMockData.playerEndData);
    expect(CsContentProgressCalculator.calculate).toHaveBeenCalledWith(playerSummury, mimeType);
    expect(component.courseProgress).toEqual(100);
  });

  it('should not call calculate method if the contentType is selfAssess', () => {
    component.activeContent = assessmentPlayerMockData.activeContent;
    component.activeContent.contentType = 'SelfAssess';
    spyOn<any>(CsContentProgressCalculator, 'calculate').and.returnValue(100);
    fixture.detectChanges();
    component['validEndEvent'](assessmentPlayerMockData.playerEndData);
    expect(component['validEndEvent'](assessmentPlayerMockData.playerEndData)).toBeTruthy();
  });

  it('should call calculateProgress', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component.calculateProgress(true);
    expect(component.courseHierarchy).toBeDefined();
  });
  it('should call calculateProgress to be called with no parameter', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component.calculateProgress();
    expect(component.courseHierarchy).toBeDefined();
  });

  it('should call subscribeToContentProgressEvents', () => {
    component['contentProgressEvents$'].next({ progress: 100 });
    fixture.detectChanges();
    const resp = component['subscribeToContentProgressEvents']();
    resp.subscribe((data: any) => {
      expect(data.contentProgressEvent.progress).toEqual(100);
    });
  });

  it('should call ngOnDestroy', () => {
    spyOn(component['unsubscribe'], 'complete');
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(component['unsubscribe'].complete).toHaveBeenCalled();
  });

  it('should call onShareLink', () => {
    spyOn(component, 'setTelemetryShareData');
    component.courseId = 'do_2130355309225574401298';
    component.collectionId = 'do_2130355309234831361304';
    fixture.detectChanges();
    component.onShareLink();
    expect(component.shareLink).toContain('/explore-course/course/do_2130355309225574401298?moduleId=do_2130355309234831361304');
    expect(component.setTelemetryShareData).toHaveBeenCalled();
  });

  it('should call logAuditEvent', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.activeContent = assessmentPlayerMockData.activeContent;
    const telemetryService = TestBed.get(TelemetryService);
    component.batchId = '121787782323';
    component['isUnit'] = true;
    component.courseId = assessmentPlayerMockData.courseHierarchy.identifier;
    spyOn(telemetryService, 'audit');
    fixture.detectChanges();
    component.logAuditEvent(true);
    expect(telemetryService.audit).toHaveBeenCalled();
  });

  it('should make isFullScreenView to FALSE', () => {
    component.isFullScreenView = true;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'contentFullScreenEvent').and.returnValue(of({ data: false }));
    fixture.detectChanges();
    component.ngOnInit();
    navigationHelperService.emitFullScreenEvent(false);
    expect(component.isFullScreenView).toBe(false);
  });

  it('should make isFullScreenView to TRUE', () => {
    component.isFullScreenView = false;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'contentFullScreenEvent').and.returnValue(of({ data: true }));
    fixture.detectChanges();
    component.ngOnInit();
    navigationHelperService.emitFullScreenEvent(true);
    expect(component.isFullScreenView).toBe(true);
  });

  it('should call subscribeToQueryParam, and set isSingleContent as true ', () => {
    component.isParentCourse = false;
    component.batchId = '0130928797865820162';
    spyOn(component, 'setActiveContent');
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({
      courseHierarchy: assessmentPlayerMockData.courseHierarchyWithDirectChild,
      enrolledBatchDetails: {}
    }));
    fixture.detectChanges();
    component['subscribeToQueryParam']();
    expect(component['setActiveContent']).toHaveBeenCalledWith('do_11287204084174028818', true);
  });

  xit('should call navigateToPlayerPage', () => {
    spyOn(component['router'], 'navigate');
    component.batchId = 'do_1130272760359813121209';
    component.courseId = 'do_1130272760359485441199';
    component.parentCourse = assessmentPlayerMockData.courseHierarchy;
    component._routerStateContentStatus = {};
    fixture.detectChanges();
    component.navigateToPlayerPage(assessmentPlayerMockData.courseHierarchy.children[0]);
    const navigationExtras = { 'queryParams': { 'batchId': 'do_1130272760359813121209', 'courseId': 'do_1130272760359485441199', 'courseName': 'U1' }, state: { contentStatus: {} } };
    expect(component['router'].navigate).toHaveBeenCalledWith(['/learn/course/play', 'do_1130272760359813121209'], navigationExtras);
  });

  xit('should call onCourseCompleteClose', () => {
    fixture.detectChanges();
    component.onCourseCompleteClose();
    expect(component.showCourseCompleteMessage).toBe(false);
  });

  xit('should call highlightContent', () => {
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.activeContent = {
      identifier: 'do_112832506508320768123'
    };
    fixture.detectChanges();
    component.highlightContent();
    expect(component.contentStatus).toBeDefined();
  });

  xit('should call calculateProgress for single content and isUnitCompleted=true', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchyNochildren;
    fixture.detectChanges();
    component.calculateProgress();
    expect(component.isUnitCompleted).toEqual(true);
  });

  xit('should call calculateProgress for single content', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchyNochildren;
    component.courseHierarchy.identifier = 'do_1130272760292638721197';
    fixture.detectChanges();
    component.calculateProgress();
    expect(component.isUnitCompleted).toEqual(false);
  });

  it('should call getCollectionInfo', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of({}));
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of({}));
    component['activeContent'] = { contentType: 'SelfAssess', identifier: 'do_2334343' };
    fixture.detectChanges();
    component['getCollectionInfo']('do_1212');
    expect(courseConsumptionService.getCourseHierarchy).toHaveBeenCalled();
    expect(courseBatchService.getEnrolledBatchDetails).toHaveBeenCalled();
  });

  it('should check for course completion', () => {
    spyOn(component, 'getCourseCompletionStatus');
    fixture.detectChanges();
    component.onRatingPopupClose();
    expect(component.getCourseCompletionStatus).toHaveBeenCalled();
  });

  it('should call setTelemetryShareData', () => {
    const param = {
      identifier: 'do_123232534312',
      contentType: 'Course',
      pkgVersion: 1.0
    };
    fixture.detectChanges();
    component.setTelemetryShareData(param);
    expect(component.telemetryShareData).toEqual([{
      id: "do_123232534312",
      type: "Course",
      ver: "1"
    }]);
  });

  it('should check for course Completion getCourseCompletionStatus', () => {
    component.isCourseCompleted = false;
    component.parentCourse = { name: 'Maths', identifier: 'do_233431212' };
    spyOn(component, 'getContentStateRequest').and.returnValue(of({
      userId: 'asas-saa12-asas-12',
      courseId: 'do_234212322',
      contentIds: [],
      batchId: '221243'
    }));

    const response = {
      content: [
        { identifier: 'do_2121', status: 2 }, { identifier: 'do_2334343', status: 2 }, { identifier: 'do_45454', status: 2 }
      ]
    };
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(response));
    const courseProgressService = TestBed.get(CourseProgressService);
    spyOn(courseProgressService, 'getContentProgressState').and.callFake(function ({ }, { }) {
      return assessmentPlayerMockData.contentProgressReqData;
    });
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component.getCourseCompletionStatus(true);
    expect(component.isCourseCompleted).toBe(true);
    expect(component.showCourseCompleteMessage).toBe(true);
    expect(component.contentStatus[4]['bestScore']).toBeDefined();
    expect(component.contentStatus[4]['score']).toBeDefined();
    expect(component.contentStatus[4]['score'].length).toEqual(1);
  });

  xit('should call setActiveContent', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'flattenDeep').and.returnValue([assessmentPlayerMockData.activeContent]);
    spyOn<any>(component, 'getContentState');
    spyOn<any>(component, 'initPlayer');
    fixture.detectChanges();
    component.setActiveContent(assessmentPlayerMockData.activeContent.identifier);
    expect(component['getContentState']).toHaveBeenCalled();
    expect(component.isContentPresent).toBe(true);
    expect(component['initPlayer']).toHaveBeenCalledWith(assessmentPlayerMockData.activeContent.identifier);
  });

  it('should call onSelfAssessLastAttempt last attempt', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    const event = { 
      'data': 'renderer:selfassess:lastattempt'
    };
    component.onSelfAssessLastAttempt(event);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call onSelfAssessLastAttempt max attempt exceeded', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    const event = { 
      'data': 'renderer:maxLimitExceeded'
    };
    component.onSelfAssessLastAttempt(event);
    expect(component.showMaxAttemptsModal).toBe(true);
  });

  it('should check for course Completion getCourseCompletionStatus on self assess course for max attempt', () => {
    component.isCourseCompleted = false;
    component.isRouterExtrasAvailable = true;
    component.parentCourse = { name: 'Maths', identifier: 'do_233431212' };
    spyOn(component, 'getContentStateRequest').and.returnValue(of({
      userId: 'asas-saa12-asas-12',
      courseId: 'do_234212322',
      contentIds: [],
      batchId: '221243'
    }));
    component.activeContent = assessmentPlayerMockData.maxAttemptContent;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component.getCourseCompletionStatus(true);
    expect(component.showMaxAttemptsModal).toBe(true);
  });

  it('should call getCourseCompletionStatus on self assess course for last attempt', () => {
    component.isCourseCompleted = false;
    component.isRouterExtrasAvailable = true;
    component.parentCourse = { name: 'Maths', identifier: 'do_233431212' };
    spyOn(component, 'getContentStateRequest').and.returnValue(of({
      userId: 'asas-saa12-asas-12',
      courseId: 'do_234212322',
      contentIds: [],
      batchId: '221243'
    }));
    component.activeContent = assessmentPlayerMockData.lastAttemptContent;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    fixture.detectChanges();
    component.getCourseCompletionStatus(true);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call getCourseCompletionStatus for self assess course', () => {
    component.isCourseCompleted = false;
    component.parentCourse = { name: 'Maths', identifier: 'do_233431212' };
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(component, 'getContentStateRequest').and.returnValue(of({
      userId: 'asas-saa12-asas-12',
      courseId: 'do_234212322',
      contentIds: [],
      batchId: '221243'
    }));

    const response = {
      content: [
        { identifier: 'do_2121', status: 2 }, { identifier: 'do_2334343', status: 2 }, { identifier: 'do_45454', status: 2 }
      ]
    };
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(response));
    const courseProgressService = TestBed.get(CourseProgressService);
    spyOn(courseProgressService, 'getContentProgressState').and.callFake(function ({ }, { }) {
      return assessmentPlayerMockData.contentProgressReqData;
    });
    component.activeContent = assessmentPlayerMockData.selfAssessContent1;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component.getCourseCompletionStatus(true);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call getCourseCompletionStatus for self assess course completed', () => {
    component.isCourseCompleted = true;
    component.parentCourse = { name: 'Maths', identifier: 'do_233431212' };
    spyOn(component, 'getContentStateRequest').and.returnValue(of({
      userId: 'asas-saa12-asas-12',
      courseId: 'do_234212322',
      contentIds: [],
      batchId: '221243'
    }));

    const response = {
      content: [
        { identifier: 'do_2121', status: 2 }, { identifier: 'do_2334343', status: 2 }, { identifier: 'do_45454', status: 2 }
      ]
    };
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(response));
    const courseProgressService = TestBed.get(CourseProgressService);
    spyOn(courseProgressService, 'getContentProgressState').and.callFake(function ({ }, { }) {
      return assessmentPlayerMockData.contentProgressReqData;
    });
    component.activeContent = assessmentPlayerMockData.selfAssessContent2;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    fixture.detectChanges();
    component.getCourseCompletionStatus(true);
    expect(component.showMaxAttemptsModal).toBe(false);
  });

});
