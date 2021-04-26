import { TestBed, async, inject } from '@angular/core/testing';
import { LandingpageGuard } from './landingpage.guard';
import { configureTestSuite } from '@sunbird/test-util';
import { Router } from '@angular/router';

describe('LandingpageGuard', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingpageGuard, { provide: Router, useClass: RouterStub }]
    });
  });

  it('should ...', inject([LandingpageGuard], (guard: LandingpageGuard) => {
    const res = guard.canActivate(null, null);
    expect(guard).toBeTruthy();
    expect(res).toEqual(true);
  }));
});
