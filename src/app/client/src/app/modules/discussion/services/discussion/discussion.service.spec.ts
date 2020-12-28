import { TestBed } from '@angular/core/testing';

import { DiscussionService } from './discussion.service';

describe('DiscussionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscussionService = TestBed.get(DiscussionService);
    expect(service).toBeTruthy();
  });
});
