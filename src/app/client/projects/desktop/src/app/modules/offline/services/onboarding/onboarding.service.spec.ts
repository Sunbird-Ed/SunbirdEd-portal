import { TestBed } from '@angular/core/testing';

import { OnboardingService } from './onboarding.service';

xdescribe('OnboardingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnboardingService = TestBed.get(OnboardingService);
    expect(service).toBeTruthy();
  });
});
