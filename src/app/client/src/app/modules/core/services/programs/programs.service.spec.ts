import { TestBed } from '@angular/core/testing';

import { ProgramsService } from './programs.service';

describe('ProgramsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramsService = TestBed.get(ProgramsService);
    expect(service).toBeTruthy();
  });
});
