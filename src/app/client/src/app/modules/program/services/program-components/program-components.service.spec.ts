import { TestBed } from '@angular/core/testing';

import { ProgramComponentsService } from './program-components.service';

describe('ProgramComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: ProgramComponentsService = TestBed.get(ProgramComponentsService);
    expect(service).toBeTruthy();
  });
});
