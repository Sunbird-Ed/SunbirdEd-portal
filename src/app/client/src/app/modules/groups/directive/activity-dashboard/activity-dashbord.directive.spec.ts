import { TestBed } from '@angular/core/testing';
import { ActivityDashboardService } from '@sunbird/shared';
import { ActivityDashbordDirective } from './activity-dashbord.directive';

describe('ActivityDashbordDirective', () => {
  let directive: ActivityDashbordDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ActivityDashbordDirective, ActivityDashboardService]
    });
    directive = TestBed.get(ActivityDashbordDirective);
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
