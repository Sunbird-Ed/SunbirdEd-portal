import { TestBed } from '@angular/core/testing';

import { RecoverAccountService } from './recover-account.service';

describe('RecoverAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecoverAccountService = TestBed.get(RecoverAccountService);
    expect(service).toBeTruthy();
  });
});
