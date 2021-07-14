
import {of as observableOf,  Observable } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, SharedModule } from '@sunbird/shared';
import { LearnerService, CoreModule } from '@sunbird/core';
import { TestBed, inject } from '@angular/core/testing';
import { CourseProgressService, UsageService } from './../../services';
import { TelemetryService } from '@sunbird/telemetry';
import * as testData from './course-progress.service.spec.data';
import { configureTestSuite } from '@sunbird/test-util';

describe('CourseProgressService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [CourseProgressService, UsageService, TelemetryService]
    });
  });

  it('should call batch API', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'post').and.returnValue(observableOf(testData.mockRes.getMyBatchesList));
    const params = {
      data: {
        'request': {
          'filters': {
            'courseId': 'do_112470675618004992181',
            'status': ['1', '2', '3'], 'createdBy': '123'
          }, 'sort_by': { 'createdDate': 'desc' }
        }
      }
    };
    courseProgressService.getBatches(params).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.result.response.count).toBe(2);
      }
    );
  });

  it('should call get Dashboard API', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'post').and.returnValue(observableOf(testData.mockRes.courseProgressData.getBatchDetails));
    const params = {
      data: {
        'limit': 200,
        'offset': 0
      },
      sortBy: 'name',
      sortOrder: '1',
      username: 'test'
    };
    courseProgressService.getDashboardData(params).subscribe(
      apiResponse => {
        expect(apiResponse.response).toBe('SUCCESS');
        expect(apiResponse.result.count).toBe(9);
        expect(apiResponse.result.completedCount).toBe(2);
      }
    );
  });

  it('should call Download API', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'post').and.returnValue(observableOf(testData.mockRes.downloadDashboardReport.getSuccessData));
    const params = {
      data: {
       'batchIdentifier': '01241050605165772817'
      }
    };
    courseProgressService.downloadDashboardData(params).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.result.requestId).toBe('01241050605165772817');
      }
    );
  });

  it('should call get report metadata API', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    const usageService = TestBed.get(UsageService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    spyOn(usageService, 'getData').and.returnValue(observableOf(testData.mockRes.reportsLastUpdatedDateMock));
    const params = {
      data: {
        'course-progress-reports': `course-progress-reports/report-01241050605165772817.csv`,
        'assessment-reports': `assessment-reports/report-01241050605165772817.csv`
      }
    };
    courseProgressService.downloadDashboardData(params).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(telemetryService.log).toHaveBeenCalled();
      }
    );
  });
  it('should call parseDasboardResponse method', () => {
    const courseProgressService = TestBed.get(CourseProgressService);
    const data = {
        series: [{}]
      };
    const tableData = courseProgressService.parseDasboardResponse(data);
    expect(tableData).toEqual([]);
  });
});
