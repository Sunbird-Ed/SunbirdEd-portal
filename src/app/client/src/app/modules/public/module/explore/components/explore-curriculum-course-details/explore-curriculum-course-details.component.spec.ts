import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreCurriculumCourseDetailsComponent } from './explore-curriculum-course-details.component';

describe('ExploreCurriculumCourseDetailsComponent', () => {
  let component: ExploreCurriculumCourseDetailsComponent;
  let fixture: ComponentFixture<ExploreCurriculumCourseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreCurriculumCourseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreCurriculumCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
