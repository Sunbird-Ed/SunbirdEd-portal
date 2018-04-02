import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLessonPlanComponent } from './create-lesson-plan.component';

describe('CreateLessonPlanComponent', () => {
  let component: CreateLessonPlanComponent;
  let fixture: ComponentFixture<CreateLessonPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLessonPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLessonPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
