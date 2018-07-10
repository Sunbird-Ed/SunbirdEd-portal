
import {of as observableOf,  Observable } from 'rxjs';
// Import NG core testing module
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
// Import service(s)
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { DashboardUtilsService } from './../dashboard-utils/dashboard-utils.service';
import { CourseConsumptionService } from './course-consumption.service';
// Test data
import * as mockData from './course-consumption.service.spec.data';
const testData = <any>mockData.mockRes;

describe('CourseConsumptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CourseConsumptionService, DashboardUtilsService, LearnerService, ConfigService]
    });
  });

  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));

  it('should make api call', inject([CourseConsumptionService, DashboardUtilsService, LearnerService], (service: CourseConsumptionService,
    DashboardUtil: DashboardUtilsService, learnerService: LearnerService) => {
    const params = { data: { identifier: 'do_2123250076616048641482', timePeriod: '7d' } };
    spyOn(learnerService, 'get').and.callFake(() => observableOf(testData.successData));
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
