import { CoreModule } from '@sunbird/core';
import { CourseProgressService } from '@sunbird/learn';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { AssessmentScoreService } from './assessment-score.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { of } from 'rxjs';

describe('AssessmentScoreService', () => {

  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule],
    providers: [CourseProgressService, AssessmentScoreService]
  }));

  it('should be created', () => {
    const service: AssessmentScoreService = TestBed.get(AssessmentScoreService);
    expect(service).toBeTruthy();
  });

  it('should call init', () => {
    const service: AssessmentScoreService = TestBed.get(AssessmentScoreService);
    const params = {
      batchDetails: 'batchDetails',
      courseDetails: 'courseDetails',
      contentDetails: 'contentDetails'
    };
    spyOn<any>(service, 'checkContentForAssessment').and.callThrough();
    service.init(params);
    expect(service['_batchDetails']).toEqual(params.batchDetails);
    expect(service['_courseDetails']).toEqual(params.courseDetails);
    expect(service['_contentDetails']).toEqual(params.contentDetails);
    expect(service['checkContentForAssessment']).toHaveBeenCalled();
  });

  it('should call receiveTelemetryEvents', () => {
    const service: AssessmentScoreService = TestBed.get(AssessmentScoreService);
    const params = {
      detail: {
        telemetryData: {
          eid: 'START',
          ets: 1,
          actor: {
            id: 1
          }
        }
      }
    };
    service['initialized'] = true;
    spyOn<any>(service, 'processTelemetryEvents').and.callThrough();
    service.receiveTelemetryEvents(params);
    expect(service['processTelemetryEvents']).toHaveBeenCalled();
  });

  it('should call updateAssessmentScore', () => {
    const service: AssessmentScoreService = TestBed.get(AssessmentScoreService);
    const params = {};
    spyOn<any>(service, 'updateAssessmentScore').and.callThrough();
    spyOn(service['courseProgressService'], 'sendAssessment').and.callThrough();
    service['updateAssessmentScore'](params);
    expect(service['updateAssessmentScore']).toHaveBeenCalledWith(params);
  });

  it('should call handleSubmitButtonClickEvent', () => {
    const service: AssessmentScoreService = TestBed.get(AssessmentScoreService);
    service['initialized'] = true;
    service['_startEvent'] = 'START';
    spyOn<any>(service, 'processAssessEvents').and.callThrough();
    spyOn<any>(service, 'handleSubmitButtonClickEvent').and.callThrough();
    service.handleSubmitButtonClickEvent(true);
    expect(service.handleSubmitButtonClickEvent).toHaveBeenCalled();
  });
});
