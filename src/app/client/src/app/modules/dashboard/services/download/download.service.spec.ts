
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
// SB service(S)
import { DownloadService } from './download.service';
import { DashboardUtilsService } from './../dashboard-utils/dashboard-utils.service';
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import * as mockData from './download.service.spec.data';
const testData = mockData.mockRes;

describe('DownloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DownloadService, LearnerService, DashboardUtilsService, ConfigService]
    });
  });

  it('should be created', inject([DownloadService], (service: DownloadService) => {
    expect(service).toBeTruthy();
  }));

  it('should call learner service', inject([DownloadService, LearnerService, DashboardUtilsService],
    (service: DownloadService, learnerService, dashboardUtilsService) => {
      const url = 'dashboard/v1/consumption/org/do_123/export?period=7d&format=csv';
      const reqData = { data: { identifier: 'do_123', timePeriod: '7d' }, dataset: 'COURSE_CONSUMPTION' };
      // spyOn
      spyOn(learnerService, 'get').and.callFake(() => observableOf(testData.downloadSuccess));
      spyOn(service, 'getReport').and.callThrough();
      // spyOn(dashboardUtilsService, 'constructDownloadReportApiUrl').and.returnValue(url);
      // Assertions
      expect(service).toBeTruthy();
      expect(dashboardUtilsService).toBeTruthy();
      expect(learnerService).toBeTruthy();
      const response = service.getReport(reqData);
      expect(service.getReport).toHaveBeenCalled();
      // expect(dashboardUtilsService.constructDownloadReportApiUrl).toHaveBeenCalled();
      expect(learnerService.get).toHaveBeenCalled();
      // expect(learnerService.get).toHaveBeenCalledWith({url: url});
    }));
});
