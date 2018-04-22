import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { BatchService } from './batch.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, LearnerService, ContentService } from '@sunbird/core';
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
});
