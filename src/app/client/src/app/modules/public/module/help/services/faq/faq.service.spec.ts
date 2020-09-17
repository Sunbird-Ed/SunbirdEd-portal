import { TestBed, inject } from '@angular/core/testing';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { FaqService } from './faq.service';
import { ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';

describe('FaqService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FaqService, ConfigService, LearnerService]
    });
  });

  it('should fetch Faq JSON', inject([FaqService], (service: FaqService) => {
    const mockData = { success: 'success' };
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableOf(mockData));
    service.getFaqJSON().subscribe((data: any) => {
      expect(data).toBe(mockData);
    });
  }));

  it('should nfetch Faq JSON and throw error', inject([FaqService], (service: FaqService) => {
    const mockError = { 'error': 'error' };
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(observableThrowError(mockError));
    service.getFaqJSON().subscribe((data: any) => { }, err => {
      expect(err).toBe(mockError);
    });
  }));
});

