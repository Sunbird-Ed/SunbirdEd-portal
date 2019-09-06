import { TestBed } from '@angular/core/testing';

import { AssessmentScoreService } from './assessment-score.service';

describe('AssessmentScoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssessmentScoreService = TestBed.get(AssessmentScoreService);
    expect(service).toBeTruthy();
  });
});
