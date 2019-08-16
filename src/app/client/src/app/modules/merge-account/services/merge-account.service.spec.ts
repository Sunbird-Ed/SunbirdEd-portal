import { TestBed } from '@angular/core/testing';

import { MergeAccountService } from './merge-account.service';

describe('MergeAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MergeAccountService = TestBed.get(MergeAccountService);
    expect(service).toBeTruthy();
  });
});
