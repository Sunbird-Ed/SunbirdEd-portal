import { TestBed, inject } from '@angular/core/testing';

import { UsageService } from './usage.service';

describe('UsageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsageService]
    });
  });

  xit('should be created', inject([UsageService], (service: UsageService) => {
    expect(service).toBeTruthy();
  }));
});
