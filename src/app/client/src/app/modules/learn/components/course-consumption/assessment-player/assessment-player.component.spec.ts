import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CsCourseProgressCalculator } from '@project-sunbird/client-services/services/course/utilities/course-progress-calculator';
import { CoreModule, PlayerService, UserService } from '@sunbird/core';
import { CourseBatchService } from '@sunbird/learn';
import { NavigationHelperService, ResourceService, SharedModule, ToasterService,
  ContentUtilsServiceService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { SuiModule } from 'ng2-semantic-ui';
import { of, throwError } from 'rxjs';
import { AssessmentScoreService } from '../../../services/assessment/assessment-score.service';
import { CourseConsumptionService } from '../../../services/course-consumption/course-consumption.service';
import { AssessmentPlayerComponent } from './assessment-player.component';
import { assessmentPlayerMockData } from './assessment-player.component.data.spec';

describe('AssessmentPlayerComponent', () => {
  let component: AssessmentPlayerComponent;
  let fixture: ComponentFixture<AssessmentPlayerComponent>;

  const resourceMockData = {
    messages: {
      fmsg: { m0051: 'Fetching districts failed. Try again later' },
      stmsg: { m0009: 'Cannot un-enrol now. Try again later', m0005: 'Something went wrong' }
    }
  };

  const fakeActivatedRoute = {
    'params': of({ collectionId: 'Test_Textbook2_8907797' }),
    queryParams: of({ batchId: '12312433', selectedContent: assessmentPlayerMockData.activeContent.identifier }),
    snapshot: { data: { telemetry: { env: 'course', type: '', pageid: 'course-read' } } }
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
        UserService, CsCourseProgressCalculator,
        { provide: ResourceService, useValue: resourceMockData },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        ContentUtilsServiceService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn<any>(component, 'subscribeToQueryParam');
    component.ngOnInit();
    expect(component['subscribeToQueryParam']).toHaveBeenCalled();
  });

  it('should go to courseDetails page', () => {
    const navigationService = TestBed.get(NavigationHelperService);
    spyOn(component['router'], 'navigate');
    navigationService['_history'] = ['http://localhost:3000/learn/course/do_2130362003064668161511/batch/01303620862525440010'];
    component.goBack();
    expect(component['router'].navigate).toHaveBeenCalled();
  });

  it('should navigate to previous page', () => {
    const navigationService = TestBed.get(NavigationHelperService);
    spyOn(component['router'], 'navigate');
    spyOn(component['location'], 'back');
    navigationService['_history'] = ['http://localhost:3000/learn/course/do_2130362003064668161511/batch/01303620862525440010', 'http://localhost:3000/learn'];
    component.goBack();
    expect(component['location'].back).toHaveBeenCalled();
  });
  it('should call subscribeToQueryParam', () => {
    spyOn<any>(component, 'setTelemetryCourseImpression');
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({ courseHierarchy: {}, enrolledBatchDetails: {} }));
    component['subscribeToQueryParam']();
    expect(component['setTelemetryCourseImpression']).toHaveBeenCalled();
  });

  it('should call subscribeToQueryParam, on error', () => {
    component.batchId = '0130272832104038409';
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(component, 'goBack');
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(throwError({}));
    component['subscribeToQueryParam']();
    expect(toasterService.error).toHaveBeenCalled();
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should call subscribeToQueryParam, and get collection', () => {
    component.isParentCourse = false;
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue({ result: { content: assessmentPlayerMockData.activeContent } });
    spyOn<any>(component, 'setTelemetryCourseImpression');
    spyOn(component, 'setActiveContent');
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({
      courseHierarchy: assessmentPlayerMockData.courseHierarchy,
      enrolledBatchDetails: {}
    }));
    component['subscribeToQueryParam']();
    expect(component['setTelemetryCourseImpression']).toHaveBeenCalled();
    expect(component.setActiveContent).toHaveBeenCalled();
  });
  it('should call subscribeToQueryParam, when no bachID present', () => {
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue({
      result: {
        content: assessmentPlayerMockData.courseHierarchy
      }
    });
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({ courseHierarchy: {}, enrolledBatchDetails: {} }));
    component['subscribeToQueryParam']();
    expect(component['getCollectionInfo']).toHaveBeenCalled();
  });

  it('should call getCollectionInfo', () => {
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of({}));
    spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of({}));
    component['getCollectionInfo']('do_1212');
    expect(courseConsumptionService.getCourseHierarchy).toHaveBeenCalled();
    expect(courseBatchService.getEnrolledBatchDetails).toHaveBeenCalled();
  });

  it('should call setActiveContent', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'flattenDeep').and.returnValue([assessmentPlayerMockData.activeContent]);
    spyOn<any>(component, 'getContentState');
    spyOn<any>(component, 'initPlayer');
    component.setActiveContent(assessmentPlayerMockData.activeContent.identifier);
    expect(component['getContentState']).toHaveBeenCalled();
    expect(component.isContentPresent).toBe(true);
    expect(component['initPlayer']).toHaveBeenCalledWith(assessmentPlayerMockData.activeContent.identifier);
  });

  it('should setActiveContent when its single content', () => {
    component.courseHierarchy = assessmentPlayerMockData.activeContent;
    spyOn<any>(component, 'getContentState');
    spyOn<any>(component, 'initPlayer');
    component.setActiveContent(assessmentPlayerMockData.activeContent.identifier, true);
    expect(component.activeContent).toEqual(assessmentPlayerMockData.activeContent);
    expect(component['initPlayer']).toHaveBeenCalledWith(assessmentPlayerMockData.activeContent.identifier);
    expect(component['getContentState']).toHaveBeenCalled();
  });

  it('should call firstNonCollectionContent', () => {
    const resp = component['firstNonCollectionContent']([]);
    expect(resp).toEqual(undefined);
  });

  it('should call initPlayer success', () => {
    component.collectionId = 'do_11287204084174028818';
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of({}));
    spyOn<any>(component, 'setTelemetryContentImpression');
    component['initPlayer']('do_3232431');
    expect(component.showLoader).toBe(false);
    expect(component['setTelemetryContentImpression']).toHaveBeenCalled();
    expect(component.playerConfig).toEqual({});
  });

  it('should call initPlayer on error', () => {
    component.collectionId = 'do_11287204084174028818';
    const toasterService = TestBed.get(ToasterService);
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(throwError({}));
    spyOn(toasterService, 'error');
    component['initPlayer']('do_3232431');
    expect(courseConsumptionService.getConfigByContent).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('Cannot un-enrol now. Try again later');
  });

  it('should call onTocCardClick', () => {
    spyOn<any>(component, 'initPlayer');
    component.onTocCardClick({ data: { identifier: 'do_2334343' } });
    expect(component.activeContent).toEqual({ identifier: 'do_2334343' });
    expect(component['initPlayer']).toHaveBeenCalledWith('do_2334343');
  });

  it('should call getContentState', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'parseChildren').and.returnValue(['do_123232']);
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of({ content: [] }));
    spyOn(component, 'calculateProgress');
    component['getContentState']();
    expect(component.calculateProgress).toHaveBeenCalled();
    expect(component.contentStatus).toEqual([]);
    expect(courseConsumptionService.parseChildren).toHaveBeenCalled();
  });

  it('should call contentProgressEvent', () => {
    component.batchId = '121787782323';
    component.enrolledBatchInfo = { status: 1 };
    spyOn<any>(component, 'validEndEvent').and.returnValue(false);
    const event = { detail: { telemetryData: { eid: 'END' } } };
    const resp = component.contentProgressEvent(event);
    expect(resp).toBe(undefined);
  });

  it('should call contentProgressEvent', () => {
    component.batchId = '121787782323';
    component.enrolledBatchInfo = { status: 1 };
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn<any>(component, 'validEndEvent').and.returnValue(true);
    spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({ content: {} }));
    const event = { detail: { telemetryData: { eid: 'END' } } };
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
    component.contentProgressEvent(event);
    expect(courseConsumptionService.updateContentsState).toHaveBeenCalled();

  });

  it('should not update content state if, batch id is not present', () => {
    component.batchId = undefined;
    const resp = component['contentProgressEvent']({});
    expect(resp).toBe(undefined);
  });

  it('should not proceed further if batchId not found inside contentProgressEvent()', () => {
    component.batchId = undefined;
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
    component.contentProgressEvent(assessmentPlayerMockData.playerEndData);
    expect(component.contentProgressEvent(assessmentPlayerMockData.playerEndData)).toBeFalsy();
  });

  it('should call onAssessmentEvents', () => {
    component.batchId = '0130272832104038409';
    component.enrolledBatchInfo = { status: 2 };
    const assessmentScoreService = TestBed.get(AssessmentScoreService);
    spyOn(assessmentScoreService, 'receiveTelemetryEvents').and.stub();
    spyOn(component, 'calculateProgress').and.stub();
    component.onAssessmentEvents({});
  });

  it('should call onAssessmentEvents', () => {
    component.batchId = '0130272832104038409';
    component.enrolledBatchInfo = { status: 1 };
    const assessmentScoreService = TestBed.get(AssessmentScoreService);
    spyOn(assessmentScoreService, 'receiveTelemetryEvents');
    spyOn(component, 'calculateProgress');
    component.onAssessmentEvents({});
    expect(assessmentScoreService.receiveTelemetryEvents).toHaveBeenCalled();
    expect(component.calculateProgress).toHaveBeenCalled();
  });

  it('should call onQuestionScoreSubmitEvents', () => {
    const assessmentScoreService = TestBed.get(AssessmentScoreService);
    spyOn(assessmentScoreService, 'handleSubmitButtonClickEvent');
    spyOn(component, 'contentProgressEvent');
    component.onQuestionScoreSubmitEvents({});
    expect(assessmentScoreService.handleSubmitButtonClickEvent).toHaveBeenCalledWith(true);
    expect(component.contentProgressEvent).toHaveBeenCalled();
  });

  it('should call calculate method to get the courseProgress', () => {
    const playerSummury = assessmentPlayerMockData.playerSummuryData;
    const mimeType = 'application/vnd.ekstep.ecml-archive';
    spyOn<any>(CsCourseProgressCalculator, 'calculate').and.returnValue(100);
    component.activeContent = assessmentPlayerMockData.activeContent;
    component['validEndEvent'](assessmentPlayerMockData.playerEndData);
    expect(CsCourseProgressCalculator.calculate).toHaveBeenCalledWith(playerSummury, mimeType);
    expect(component.courseProgress).toEqual(100);
  });

  it('should not call calculate method if the contentType is selfAssess', () => {
    component.activeContent = assessmentPlayerMockData.activeContent;
    component.activeContent.contentType = 'SelfAssess';
    spyOn<any>(CsCourseProgressCalculator, 'calculate').and.returnValue(100);
    component['validEndEvent'](assessmentPlayerMockData.playerEndData);
    expect(component['validEndEvent'](assessmentPlayerMockData.playerEndData)).toBeTruthy();
  });

  it('should call calculateProgress', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.calculateProgress();
    expect(component.courseHierarchy).toBeDefined();
  });

  it('should call subscribeToContentProgressEvents', () => {
    component['contentProgressEvents$'].next({ progress: 100 });
    const resp = component['subscribeToContentProgressEvents']();
    resp.subscribe((data: any) => {
      expect(data.contentProgressEvent.progress).toEqual(100);
    });
  });

  it('should return rollup for the given courseHierarchy', () => {
    const resp = component.getRollup(assessmentPlayerMockData.courseHierarchy, assessmentPlayerMockData.activeContent.identifier);
    console.log('resp', resp);
    expect(resp).toBeDefined();
    expect(resp).toEqual(['do_1130272760359485441199', 'do_1130272760359813121209', 'do_11287204084174028818']);
  });

  it('should set individual content play telemetry Impression', () => {
    component.activeContent = assessmentPlayerMockData.activeContent;
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    spyOn(component, 'getRollup').and.returnValue(['do_1130272760359485441199', 'do_1130272760359813121209', 'do_11287204084174028818']);
    component['setTelemetryContentImpression']();
    expect(component.getRollup).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    spyOn(component['unsubscribe'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe'].complete).toHaveBeenCalled();
  });

  it('should call onShareLink', () => {
    spyOn(component, 'setTelemetryShareData');
    component.courseId = 'do_2130355309225574401298';
    component.collectionId = 'do_2130355309234831361304';
    component.onShareLink();
    expect(component.shareLink).toContain('/explore-course/course/do_2130355309225574401298?moduleId=do_2130355309234831361304');
    expect(component.setTelemetryShareData).toHaveBeenCalled();
  });
});
