import { TestBed } from '@angular/core/testing';

import { DialCodeService } from './dial-code.service';

describe('DialCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialCodeService = TestBed.get(DialCodeService);
    expect(service).toBeTruthy();
  });
});
