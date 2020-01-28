import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { UsageService } from './usage.service';
import { HttpClient } from '@angular/common/http';

describe('UsageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsageService, HttpClient],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([UsageService], (service: UsageService) => {
    expect(service).toBeTruthy();
  }));


  describe('getData method ', () => {
    it('should call the api', () => {
      const http = TestBed.get(HttpClient);
      const usageService = TestBed.get(UsageService);
      spyOn(http, 'get').and.returnValue(of({ test: 'ok' }));
      usageService.getData('https://dev.sunbirded.org/explore');
      expect(http.get).toHaveBeenCalled();
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith('https://dev.sunbirded.org/explore', { 'responseType': 'json' });
    });

    it('should return data  if response do contain result key', () => {
      const http = TestBed.get(HttpClient);
      const usageService = TestBed.get(UsageService);
      spyOn(http, 'get').and.returnValue(of({ result: '123' }));
      const result = usageService.getData('https://dev.sunbirded.org/explore');
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
      const usageService = TestBed.get(UsageService);
      spyOn(http, 'get').and.returnValue(of({ data: '123' }));
      const result = usageService.getData('https://dev.sunbirded.org/explore');
      expect(http.get).toHaveBeenCalled();
      result.subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toEqual({
          responseCode: 'OK',
          result: { data: '123' }
        });
      });
    });
  });

});
