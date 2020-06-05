import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, UserService } from '@sunbird/core';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { AssessmentPlayerComponent } from './assessment-player.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileService } from '@sunbird/profile';
import { assessmentPlayerMockData } from './assessment-player.component.data.spec';
import { CourseConsumptionService } from '../../../services/course-consumption/course-consumption.service';
import { of, throwError } from 'rxjs';
import { AssessmentScoreService } from '../../../services/assessment/assessment-score.service';
import { ActivatedRoute } from '@angular/router';
import { CsCourseProgressCalculator } from '@project-sunbird/client-services/services/course/utilities/course-progress-calculator';
import { configureTestSuite } from '@sunbird/test-util';

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
    queryParams: of({ batchId: '12312433' })
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
    component.ngOnInit();
  });

  it('should call goBack', () => {
    component.goBack();
  });

  it('should call subscribeToQueryParam', () => {
    component.batchId = '0130272832104038409';
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({ courseHierarchy: {}, enrolledBatchDetails: {} }));
    component['subscribeToQueryParam']();
  });

  it('should call subscribeToQueryParam, on error', () => {
    component.batchId = '0130272832104038409';
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(throwError({}));
    component['subscribeToQueryParam']();
  });

  it('should call subscribeToQueryParam, when no bachID present', () => {
    spyOn<any>(component, 'getCollectionInfo').and.returnValue(of({ courseHierarchy: {}, enrolledBatchDetails: {} }));
    component['subscribeToQueryParam']();
  });


  it('should call getCollectionInfo', () => {
    component['getCollectionInfo']('do_1212');
  });

  it('should call setActiveContent', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    spyOn<any>(component, 'getContentState');
    component.setActiveContent('do_43223232121');
    expect(component['getContentState']).toHaveBeenCalled();
  });

  it('should call firstNonCollectionContent', () => {
    component['firstNonCollectionContent']([]);
  });

  it('should call initPlayer success', () => {
    component.collectionId = 'do_11287204084174028818';
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of({}));
    component['initPlayer']('do_3232431');
  });

  it('should call initPlayer on error', () => {
    component.collectionId = 'do_11287204084174028818';
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(throwError({}));
    component['initPlayer']('do_3232431');
  });

  it('should call onTocCardClick', () => {
    component.onTocCardClick({ data: {} });
  });

  it('should call getContentState', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    const courseConsumptionService = TestBed.get(CourseConsumptionService);
    spyOn(courseConsumptionService, 'getContentState').and.returnValue(of({ content: {} }));
    component['getContentState']();
  });

  it('should call contentProgressEvent', () => {
    component.contentProgressEvent({});
  });

  xit('should call parseChildContent', () => {
    component['parseChildContent']();
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
    component.onQuestionScoreSubmitEvents({});
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
    expect(component['validEndEvent'](assessmentPlayerMockData.playerEndData)).toBeFalsy();
  });

  it('should call calculateProgress', () => {
    component.courseHierarchy = assessmentPlayerMockData.courseHierarchy;
    component.contentStatus = assessmentPlayerMockData.contentStatus;
    component.calculateProgress();
  });

  it('should call subscribeToContentProgressEvents', () => {
    component['contentProgressEvents$'].next({});
    component['subscribeToContentProgressEvents']();
  });

  it('should call ngOnDestroy', () => {
    spyOn(component['unsubscribe'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe'].complete).toHaveBeenCalled();
  });
});
