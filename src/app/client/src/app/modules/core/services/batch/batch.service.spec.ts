import { TestBed, inject } from '@angular/core/testing';

import { BatchService } from './batch.service';

import { CoreModule } from '@sunbird/core';

import { SharedModule } from '@sunbird/shared';

import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      providers: [BatchService]
    });
  });

  it('should be created', inject([BatchService], (service: BatchService) => {
    expect(service).toBeTruthy();
  }));
});
