import { TestBed } from '@angular/core/testing';

import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupsService = TestBed.get(GroupsService);
    expect(service).toBeTruthy();
  });
});
