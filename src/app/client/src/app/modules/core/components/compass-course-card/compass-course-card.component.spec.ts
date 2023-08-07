import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassCourseCardComponent } from './compass-course-card.component';

describe('CompassCourseCardComponent', () => {
  let component: CompassCourseCardComponent;
  let fixture: ComponentFixture<CompassCourseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompassCourseCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompassCourseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
