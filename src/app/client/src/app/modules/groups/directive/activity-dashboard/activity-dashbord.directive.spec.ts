import { TestBed } from '@angular/core/testing';
import { ActivityDashboardService } from '../../../shared/services';
import { ActivityDashboardDirective } from './activity-dashbord.directive';

describe('ActivityDashboardDirective', () => {
  let directive: ActivityDashboardDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ActivityDashboardDirective, ActivityDashboardService]
    });
    directive = TestBed.get(ActivityDashboardDirective);
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
