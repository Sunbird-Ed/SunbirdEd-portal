import { TestBed } from '@angular/core/testing';

import { LandingPageContentService } from './landing-page-content.service';

describe('LandingPageContentService', () => {
  let service: LandingPageContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingPageContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
