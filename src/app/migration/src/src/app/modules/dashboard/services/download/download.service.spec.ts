import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DownloadService, DashboardUtilsService } from './../';
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import * as mockData from './download.service.spec.data';
const testData = mockData.mockRes;

describe('DownloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientModule, DownloadService, LearnerService, DashboardUtilsService, ConfigService]
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
      spyOn(learnerService, 'get').and.callFake(() => Observable.of(testData.downloadSuccess));
      spyOn(service, 'getReport').and.callThrough();
      spyOn(dashboardUtilsService, 'constructDownloadReportApiUrl').and.returnValue(url);
      // Assertions
      expect(service).toBeTruthy();
      expect(dashboardUtilsService).toBeTruthy();
      expect(learnerService).toBeTruthy();
      const response = service.getReport(reqData);
      expect(service.getReport).toHaveBeenCalled();
      expect(dashboardUtilsService.constructDownloadReportApiUrl).toHaveBeenCalled();
      expect(learnerService.get).toHaveBeenCalled();
      expect(learnerService.get).toHaveBeenCalledWith({url: url});
    }));
});
