import { TestBed } from '@angular/core/testing';

import { MemoryService } from './memory.service';

describe('MemoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemoryService = TestBed.get(MemoryService);
    expect(service).toBeTruthy();
  });
});
