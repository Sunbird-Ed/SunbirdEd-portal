import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAsideComponent } from './course-aside.component';

describe('CourseAsideComponent', () => {
  let component: CourseAsideComponent;
  let fixture: ComponentFixture<CourseAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseAsideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
