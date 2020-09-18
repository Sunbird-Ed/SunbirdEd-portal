import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseDetailsComponent } from './course-details.component';
import { ResourceService } from '@sunbird/shared';
import { GeneraliseLabelService } from '@sunbird/core';

describe('CourseDetailsComponent', () => {
  let component: CourseDetailsComponent;
  let fixture: ComponentFixture<CourseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDetailsComponent ],
      providers: [
        { provide: ResourceService, useValue: {} },
        { provide: GeneraliseLabelService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
