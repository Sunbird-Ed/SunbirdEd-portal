import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseConsumptionHeaderComponent } from './course-consumption-header.component';

describe('CourseConsumptionHeaderComponent', () => {
  let component: CourseConsumptionHeaderComponent;
  let fixture: ComponentFixture<CourseConsumptionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseConsumptionHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
