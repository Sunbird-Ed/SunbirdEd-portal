import { TestBed } from '@angular/core/testing';
import { truncate } from 'fs';

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

  it ('should set isActivityAdded', () => {
    const service = TestBed.get(ActivityDashboardService);
    service._isActivityAdded = true;
    expect(service['_isActivityAdded']).toEqual(true);
  });
  
});
