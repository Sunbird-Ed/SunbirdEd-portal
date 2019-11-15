import { TestBed } from '@angular/core/testing';

import { UserLocationUpdatesService } from './user-location-updates.service';

xdescribe('UserLocationUpdatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLocationUpdatesService = TestBed.get(UserLocationUpdatesService);
    expect(service).toBeTruthy();
  });
});
