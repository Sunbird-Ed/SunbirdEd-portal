import { TestBed } from '@angular/core/testing';

import { ActivityDashboardService } from './activity-dashboard.service';

// Old One
xdescribe('ActivityDashboardService', () => {
  let service: ActivityDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should set isActivityAdded', () => {
    const service = TestBed.inject(ActivityDashboardService);
    service._isActivityAdded = true;
    expect(service['_isActivityAdded']).toEqual(true);
  });

});
