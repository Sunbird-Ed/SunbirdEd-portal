import { TestBed } from '@angular/core/testing';

import { ContentSearchService } from './content-search.service';

describe('ContentSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentSearchService = TestBed.get(ContentSearchService);
    expect(service).toBeTruthy();
  });
});
