import { TestBed } from '@angular/core/testing';

import { DatasetService } from './dataset.service';

describe('DatasetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetService = TestBed.get(DatasetService);
    expect(service).toBeTruthy();
  });
});
