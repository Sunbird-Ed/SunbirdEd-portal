import { TestBed } from '@angular/core/testing';

import { LearnPageContentService } from './learn-page-content.service';

describe('LearnPageContentService', () => {
  let service: LearnPageContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnPageContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
