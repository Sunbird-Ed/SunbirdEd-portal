
import {of as observableOf, throwError as observableThrowError,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { BatchService } from './batch.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, LearnerService, ContentService } from '@sunbird/core';
import { Response } from './batch.service.spec.data';
describe('BatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BatchService, UserService, ConfigService,
        ContentService, LearnerService]
    });
  });

  it('should be created', inject([BatchService], (service: BatchService) => {
    expect(service).toBeTruthy();
  }));

  it('should call setBatchData method to set the batch data  ', inject([BatchService, LearnerService],
    (batchService: BatchService, learnerService: LearnerService) => {
      batchService.setBatchData(Response.batchlistSucessData);
      expect(batchService.batchDetails).toBeDefined();
      expect(batchService).toBeTruthy();
  }));

});
