import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/core';
import { DashboardUtilsService } from './dashboard-utils.service';

describe('DashboardUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardUtilsService, ConfigService]
    });
  });

  it('should be created', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return zero second', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    const numericRes = { 'value': 12 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    const response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('12 Second');
  }));

  it('should return value in a min', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    const numericRes = { 'value': 120 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    const response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('2 minutes');
  }));

  it('should return value in a hour', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    const numericRes = { 'value': 3601 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    const response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('1 Hour');
  }));

  it('should return value in a hour', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    const numericRes = {};
    spyOn(service, 'secondToMinConversion').and.callThrough();
    const response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response).toEqual(numericRes);
  }));

  it('should construct valid download report url', inject([DashboardUtilsService, ConfigService],
    (service: DashboardUtilsService, configService) => {
    const req = { 'identifier': 'do_123', 'timePeriod': '5w' };
    const progressurl = configService.urlConFig.URLS.DASHBOARD.COURSE_CONSUMPTION;
    const apiUrl = progressurl + '/' + req.identifier + '?period=' + req.timePeriod;
    spyOn(service, 'constructDashboardApiUrl').and.callThrough();
    const response = service.constructDashboardApiUrl(req, 'COURSE_CONSUMPTION');
    expect(service).toBeTruthy();
    expect(service.constructDashboardApiUrl).toBeDefined();
    expect(response).toEqual(apiUrl);
  }));

  it('should construct valid download report url', inject([DashboardUtilsService, ConfigService],
    (service: DashboardUtilsService, configService) => {
    const req = { 'identifier': 'do_123', 'timePeriod': '5w' };
    const progressurl = configService.urlConFig.URLS.DASHBOARD.COURSE_CONSUMPTION;
    const apiUrl = progressurl + '/' + req.identifier + '/export?period=' + req.timePeriod + '&format=csv';
    spyOn(service, 'constructDownloadReportApiUrl').and.callThrough();
    const response = service.constructDownloadReportApiUrl(req, 'COURSE_CONSUMPTION');
    expect(service).toBeTruthy();
    expect(service.constructDownloadReportApiUrl).toBeDefined();
    expect(response).toEqual(apiUrl);
  }));

});
