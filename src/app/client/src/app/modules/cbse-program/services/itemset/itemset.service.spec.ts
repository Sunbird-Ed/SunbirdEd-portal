import { TestBed } from '@angular/core/testing';

import { ItemsetService } from './itemset.service';

describe('ItemsetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: ItemsetService = TestBed.get(ItemsetService);
    expect(service).toBeTruthy();
  });
});
