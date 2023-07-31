import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalOrientedHrCardComponent } from './goal-oriented-hr-card.component';

describe('GoalOrientedHrCardComponent', () => {
  let component: GoalOrientedHrCardComponent;
  let fixture: ComponentFixture<GoalOrientedHrCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalOrientedHrCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalOrientedHrCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
