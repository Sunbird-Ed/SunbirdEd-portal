import { TestBed, inject } from '@angular/core/testing';

import { OrgTypeService } from './org-type.service';

describe('OrgTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgTypeService]
    });
  });

  it('should be created', inject([OrgTypeService], (service: OrgTypeService) => {
    expect(service).toBeTruthy();
  }));
});
