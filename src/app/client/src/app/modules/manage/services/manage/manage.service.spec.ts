import { TestBed } from '@angular/core/testing';

import { ManageService } from './manage.service';

describe('ManageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageService = TestBed.get(ManageService);
    expect(service).toBeTruthy();
  });
});
