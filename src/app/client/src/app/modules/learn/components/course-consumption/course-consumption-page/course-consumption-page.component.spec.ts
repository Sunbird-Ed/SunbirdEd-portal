import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseConsumptionPageComponent } from './course-consumption-page.component';

describe('CourseConsumptionPageComponent', () => {
  let component: CourseConsumptionPageComponent;
  let fixture: ComponentFixture<CourseConsumptionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseConsumptionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
