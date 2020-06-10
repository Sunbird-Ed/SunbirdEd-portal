import { TestBed, async, inject } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { LandingpageGuard } from './landingpage.guard';

describe('LandingpageGuard', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingpageGuard]
    });
  });

  it('should ...', inject([LandingpageGuard], (guard: LandingpageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
