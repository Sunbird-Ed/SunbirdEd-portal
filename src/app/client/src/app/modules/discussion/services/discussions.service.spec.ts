import { TestBed } from '@angular/core/testing';

import { DiscussionsService } from './discussions.service';

describe('DiscussionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscussionsService = TestBed.get(DiscussionsService);
    expect(service).toBeTruthy();
  });
});
