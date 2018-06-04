import { TestBed, inject } from '@angular/core/testing';
import { LearnerService, CoreModule } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { BadgesService } from './badges.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BadgesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      providers: [BadgesService, ConfigService, LearnerService]
    });
  });

  it('should be created', inject([BadgesService], (service: BadgesService) => {
    expect(service).toBeTruthy();
  }));
});
