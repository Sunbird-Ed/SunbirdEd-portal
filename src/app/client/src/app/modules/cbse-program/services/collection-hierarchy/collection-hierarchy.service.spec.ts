import { TestBed } from '@angular/core/testing';

import { CollectionHierarchyService } from './collection-hierarchy.service';

describe('CollectionHierarchyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollectionHierarchyService = TestBed.get(CollectionHierarchyService);
    expect(service).toBeTruthy();
  });
});
