import { TestBed } from '@angular/core/testing';
import { ActivityDashbordDirective } from './activity-dashbord.directive';

describe('ActivityDashbordDirective', () => {
  let directive: ActivityDashbordDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ],
      providers: [ ]
    });
    directive = TestBed.get(ActivityDashbordDirective);
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
