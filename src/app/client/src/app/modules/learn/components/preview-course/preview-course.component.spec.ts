import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCourseComponent } from './preview-course.component';

describe('PreviewCourseComponent', () => {
  let component: PreviewCourseComponent;
  let fixture: ComponentFixture<PreviewCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
