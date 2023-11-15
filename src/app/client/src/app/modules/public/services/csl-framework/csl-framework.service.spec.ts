import { TestBed } from '@angular/core/testing';

import { CslFrameworkService } from './csl-framework.service';

describe('CslFrameworkService', () => {
  let service: CslFrameworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CslFrameworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
