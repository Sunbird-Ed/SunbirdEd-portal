import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePlayerComponent } from './course-player.component';

describe('CoursePlayerComponent', () => {
  let component: CoursePlayerComponent;
  let fixture: ComponentFixture<CoursePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
