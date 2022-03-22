import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CourseDetailsComponent } from './course-details.component';
import { ResourceService } from '@sunbird/shared';
import { GeneraliseLabelService } from '@sunbird/core';

// Old One
xdescribe('CourseDetailsComponent', () => {
  let component: CourseDetailsComponent;
  let fixture: ComponentFixture<CourseDetailsComponent>;

  beforeEach(waitForAsync(() => {
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
