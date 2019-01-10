
import {of as observableOf } from 'rxjs';
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

  it('should call learner service', inject([DownloadService, LearnerService, DashboardUtilsService],
    (service: DownloadService, learnerService, dashboardUtilsService) => {
      spyOn(learnerService, 'get').and.callFake(() => observableOf(testData.downloadSuccess));
      spyOn(service, 'getReport').and.callThrough();
      expect(service).toBeTruthy();
      expect(dashboardUtilsService).toBeTruthy();
      expect(learnerService).toBeTruthy();
      expect(service.getReport).toHaveBeenCalled();
      // expect(dashboardUtilsService.constructDownloadReportApiUrl).toHaveBeenCalled();
      expect(learnerService.get).toHaveBeenCalled();
      // expect(learnerService.get).toHaveBeenCalledWith({url: url});
    }));
});
