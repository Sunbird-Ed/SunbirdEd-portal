import { TestBed, inject } from '@angular/core/testing';

import { UserSearchService } from './user-search.service';

describe('UserSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSearchService]
    });
  });

  it('should be created', inject([UserSearchService], (service: UserSearchService) => {
    expect(service).toBeTruthy();
  }));
});
