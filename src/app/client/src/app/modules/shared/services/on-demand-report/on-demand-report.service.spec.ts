import {TestBed, inject} from '@angular/core/testing';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {configureTestSuite} from '@sunbird/test-util';
import {ConfigService} from '../config/config.service';
import {OnDemandReportService} from './on-demand-report.service';

describe('OnDemandReportService', () => {
const  reportStatus = {
    'submitted': 'SUBMITTED',
    'processing': 'PROCESSING',
    'failed': 'FAILED',
    'success': 'SUCCESS',
  };
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    providers: [OnDemandReportService, HttpClient, ConfigService],
    imports: [HttpClientTestingModule]
  }));
  it('should be created', () => {
    const service: OnDemandReportService = TestBed.get(OnDemandReportService);
    expect(service).toBeTruthy();
  });
  it('should get report list', () => {
    const mockData = {test: 'ok'};
    const headers = {headers: {'Content-Type': 'application/json'}};
    const http = TestBed.get(HttpClient, HttpHeaders);
    spyOn(http, 'get').and.returnValue(of(mockData));
    const service: OnDemandReportService = TestBed.get(OnDemandReportService);
    service.getReportList('tag').subscribe((data) => {
      expect(http.get).toHaveBeenCalled();
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith('/report/request/list/tag', headers);
      expect(data).toEqual(mockData);
    });
  });
  it('should get report read', () => {
    const mockData = {test: 'ok'};
    const headers = {headers: {'Content-Type': 'application/json'}};
    const http = TestBed.get(HttpClient, HttpHeaders);
    spyOn(http, 'get').and.returnValue(of(mockData));
    const service: OnDemandReportService = TestBed.get(OnDemandReportService);
    service.getReport('tag', 'requestId').subscribe((data) => {
      expect(http.get).toHaveBeenCalled();
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith('/report/request/read/tag?requestId=requestId', headers);
      expect(data).toEqual(mockData);
    });
  });
  it('should submit report', () => {
    const mockData = {test: 'ok'};
    const http = TestBed.get(HttpClient, HttpHeaders);
    spyOn(http, 'post').and.returnValue(of(mockData));
    const service: OnDemandReportService = TestBed.get(OnDemandReportService);
    service.submitRequest({}).subscribe((data) => {
      expect(http.post).toHaveBeenCalled();
      expect(http.post).toHaveBeenCalledTimes(1);
      expect(data).toEqual(mockData);
    });
  });

  it('should get summary reports', () => {
    const mockData = {test: 'ok'};
    const http = TestBed.get(HttpClient, HttpHeaders);
    spyOn(http, 'post').and.returnValue(of(mockData));
    const service: OnDemandReportService = TestBed.get(OnDemandReportService);
    service.submitRequest({}).subscribe((data) => {
      expect(http.post).toHaveBeenCalled();
      expect(http.post).toHaveBeenCalledTimes(1);
      expect(data).toEqual(mockData);
    });
  });

  it('should call canRequestReport and user can create a report, date submitted is less than the batch end date', inject([OnDemandReportService], (service: OnDemandReportService) => {
    const batchEndDate = 1603823400000;
    const dateSubmitted = 1599728944037;
    const result = service.canRequestReport(dateSubmitted, batchEndDate);
    expect(result).toBeTruthy();
  }));

  it('should call canRequestReport and user can not create report, date submitted is grater than the batch end date', inject([OnDemandReportService], (service: OnDemandReportService) => {
    const batchEndDate = 1603823400000;
    const dateSubmitted = 1604823400000;
    const result = service.canRequestReport(dateSubmitted, batchEndDate);
    expect(result).toBeFalsy();
  }));

  it('should call canRequestReport and user can create report because batch end date is empty', inject([OnDemandReportService], (service: OnDemandReportService) => {
    const batchEndDate = null;
    const dateSubmitted = 1604823400000;
    const result = service.canRequestReport(dateSubmitted, batchEndDate);
    expect(result).toBeTruthy();
  }));

  it('should call isInProgress with report status as SUBMITTED', inject([OnDemandReportService], (service: OnDemandReportService) => {
    const reportListData = {status: 'SUBMITTED'}
    const result = service.isInProgress(reportListData, reportStatus);
    expect(result).toBeTruthy();
  }));

  it('should call isInProgress with report status as PROCESSING', inject([OnDemandReportService], (service: OnDemandReportService) => {
    const reportListData = {status: 'PROCESSING'}
    const result = service.isInProgress(reportListData, reportStatus);
    expect(result).toBeTruthy();
  }));

  it('should call isInProgress with report status as SUCCESS', inject([OnDemandReportService], (service: OnDemandReportService) => {
    const reportListData = {status: 'SUCCESS'}
    const result = service.isInProgress(reportListData, reportStatus);
    expect(result).toBeFalsy();
  }));

  it('should call isInProgress with report status as FAILED', inject([OnDemandReportService], (service: OnDemandReportService) => {
    const reportListData = {status: 'FAILED'}
    const result = service.isInProgress(reportListData, reportStatus);
    expect(result).toBeFalsy();
  }));
});
