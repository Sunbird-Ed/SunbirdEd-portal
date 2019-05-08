
import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { BatchService } from './batch.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { Response } from './batch.service.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@sunbird/shared';

describe('BatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [BatchService, ConfigService]
    });
  });

  it('should be created', inject([BatchService], (service: BatchService) => {
    expect(service).toBeTruthy();
  }));

  it('should call setBatchData method to set the batch data  ', inject([BatchService],
    (batchService: BatchService) => {
    batchService.setBatchData(Response.batchlistSucessData);
    expect(batchService.batchDetails).toBeDefined();
    expect(batchService).toBeTruthy();
  }));

});
