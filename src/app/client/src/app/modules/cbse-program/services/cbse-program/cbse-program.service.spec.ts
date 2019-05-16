import { TestBed } from '@angular/core/testing';

import { CbseProgramService } from './cbse-program.service';

describe('CbseProgramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CbseProgramService = TestBed.get(CbseProgramService);
    expect(service).toBeTruthy();
  });
});
