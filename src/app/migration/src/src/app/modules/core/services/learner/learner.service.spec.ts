import { TestBed, inject } from '@angular/core/testing';

import { LearnerService } from './learner.service';

describe('LearnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LearnerService]
    });
  });

  it('should be created', inject([LearnerService], (service: LearnerService) => {
    expect(service).toBeTruthy();
  }));
});
