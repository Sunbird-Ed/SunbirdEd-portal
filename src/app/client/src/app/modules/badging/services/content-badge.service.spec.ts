import { TestBed, inject } from '@angular/core/testing';
import { ContentBadgeService } from './content-badge.service';
import { LearnerService, CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockResponse } from './content-badge.service.spec.data';

describe('ContentBadgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), SharedModule.forRoot(), HttpClientTestingModule],
      providers: [ContentBadgeService]
    });
  });

  it('should be created', () => {
    const service = TestBed.get(ContentBadgeService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'post').and.callFake(() => Observable.of(mockResponse.successResponse));
    service.addBadge().subscribe((apiResponse) => {
      expect(apiResponse.responseCode).toBe('OK');
    });
    expect(service).toBeTruthy();
  });
});
