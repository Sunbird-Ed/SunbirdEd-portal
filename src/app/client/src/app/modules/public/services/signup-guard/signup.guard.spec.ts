import { TestBed, async, inject } from '@angular/core/testing';

import { SignupGuard } from './signup.guard';

describe('SignupGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignupGuard]
    });
  });

  it('should ...', inject([SignupGuard], (guard: SignupGuard) => {
    expect(guard).toBeTruthy();
  }));
});
