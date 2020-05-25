import { TestBed } from '@angular/core/testing';

import { ManagedUserService } from './managed-user.service';

describe('ManagedUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagedUserService = TestBed.get(ManagedUserService);
    expect(service).toBeTruthy();
  });
});
