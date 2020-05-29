import { TestBed } from '@angular/core/testing';

import { LazzyLoadScriptService } from './lazzy-load-script.service';

describe('LazzyLoadScriptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LazzyLoadScriptService = TestBed.get(LazzyLoadScriptService);
    expect(service).toBeTruthy();
  });
});
