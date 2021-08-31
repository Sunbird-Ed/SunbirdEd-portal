import { TestBed } from '@angular/core/testing';

import { ActivityDashboardService } from './activity-dashboard.service';

describe('ActivityDashboardService', () => {
  let service: ActivityDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
