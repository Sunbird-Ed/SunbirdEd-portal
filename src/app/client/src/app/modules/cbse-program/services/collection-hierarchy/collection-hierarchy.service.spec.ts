import { TestBed } from '@angular/core/testing';
import { CollectionHierarchyService } from './collection-hierarchy.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('CollectionHierarchyService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: CollectionHierarchyService = TestBed.get(CollectionHierarchyService);
    expect(service).toBeTruthy();
  });
});
