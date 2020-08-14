import {SharedModule} from '@sunbird/shared';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {configureTestSuite} from '@sunbird/test-util';
import {ManageService} from './manage.service';
import {of} from 'rxjs';
import {LearnerService} from '@sunbird/core';

describe('ManageService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageService, HttpClient, LearnerService],
      imports: [HttpClientTestingModule, SharedModule.forRoot()]
    });
  });

  it('should be created', () => {
    const service: ManageService = TestBed.get(ManageService);
    expect(service).toBeTruthy();
  });

  describe('getData method ', () => {
    it('should call the api', () => {
      const http = TestBed.get(HttpClient, HttpHeaders);
      const manageService = TestBed.get(ManageService);
      spyOn(http, 'get').and.returnValue(of({test: 'ok'}));
      manageService.getData('sunbird', 'a.txt');
      expect(http.get).toHaveBeenCalled();
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith('/admin-reports/sunbird/a.txt', {headers: new HttpHeaders()});
    });

    it('should return data  if response do contain result key', () => {
      const http = TestBed.get(HttpClient);
      const manageService = TestBed.get(ManageService);
      spyOn(http, 'get').and.returnValue(of({result: '123'}));
      const result = manageService.getData('sunbird', 'a.txt');
      expect(http.get).toHaveBeenCalled();
      result.subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toEqual({
          responseCode: 'OK',
          result: '123'
        });
      });
    });

    it('should return data as it is if response do not contain result key', () => {
      const http = TestBed.get(HttpClient);
      const manageService = TestBed.get(ManageService);
      spyOn(http, 'get').and.returnValue(of({data: '123'}));
      const result = manageService.getData('sunbird', 'a.txt');
      expect(http.get).toHaveBeenCalled();
      result.subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toEqual({
          responseCode: 'OK',
          result: {data: '123'}
        });
      });
    });


    it('should allow to bulk org upload', () => {
      const learnerService = TestBed.get(LearnerService);
      const manageService = TestBed.get(ManageService);
      spyOn(learnerService, 'post').and.returnValue(of({data: '123'}));
      const result = manageService.bulkOrgUpload({});
      expect(learnerService.post).toHaveBeenCalled();
      result.subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toEqual({data: '123'});
      });
    });

    it('should allow to bulk user upload', () => {
      const learnerService = TestBed.get(LearnerService);
      const manageService = TestBed.get(ManageService);
      spyOn(learnerService, 'post').and.returnValue(of({data: '123'}));
      const result = manageService.bulkUserUpload({});
      expect(learnerService.post).toHaveBeenCalled();
      result.subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toEqual({data: '123'});
      });
    });


    it('should allow to bulk  upload status', () => {
      const learnerService = TestBed.get(LearnerService);
      const manageService = TestBed.get(ManageService);
      spyOn(learnerService, 'get').and.returnValue(of({data: '123'}));
      const result = manageService.getBulkUploadStatus('processid');
      expect(learnerService.get).toHaveBeenCalled();
      result.subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toEqual({data: '123'});
      });
    });


  });


});
