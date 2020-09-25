import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {configureTestSuite} from '@sunbird/test-util';
import {ConfigService} from '../config/config.service';
import {OnDemandReportService} from './on-demand-report.service';
describe('OnDemandReportService', () => {
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
      expect(http.get).toHaveBeenCalledWith('/report/request/read/tag/requestId', headers);
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
});
