import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumCourseDetailsComponent } from './curriculum-course-details.component';

describe('CurriculumCourseDetailsComponent', () => {
  let component: CurriculumCourseDetailsComponent;
  let fixture: ComponentFixture<CurriculumCourseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurriculumCourseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
