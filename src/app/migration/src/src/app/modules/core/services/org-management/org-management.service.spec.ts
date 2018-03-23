import { TestBed, inject } from '@angular/core/testing';

import { OrgManagementService } from './org-management.service';

describe('OrgManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgManagementService]
    });
  });

  it('should be created', inject([OrgManagementService], (service: OrgManagementService) => {
    expect(service).toBeTruthy();
  }));
});
