// Import NG core testing module
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// Import rxjs packages
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
// Import service(s)
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { CourseConsumptionService, DashboardUtilsService } from './..';
// Test data
import * as mockData from './course-consumption.service.spec.data';
const testData = mockData.mockRes;

describe('CourseConsumptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseConsumptionService, DashboardUtilsService, LearnerService, HttpClientModule, ConfigService]
    });
  });

  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));

  it('should make api call', inject([CourseConsumptionService, DashboardUtilsService, LearnerService], (service: CourseConsumptionService,
    DashboardUtil: DashboardUtilsService, learnerService: LearnerService) => {
    const params = { data: { identifier: 'do_2123250076616048641482', timePeriod: '7d' } };
    spyOn(learnerService, 'get').and.callFake(() => Observable.of(testData.successData));
    const apiRes = service.getDashboardData(params);
    expect(service).toBeTruthy();
    expect(learnerService.get).toHaveBeenCalled();
  }));

  it('should parse course consumption API response', inject([CourseConsumptionService, DashboardUtilsService],
    (service: CourseConsumptionService,
    DashboardUtil: DashboardUtilsService) => {
    const response = service.parseApiResponse(testData.parsedSuccessData);
    expect(service).toBeTruthy();
    expect(response.numericData.length).toBeGreaterThan(1);
  }));
});
