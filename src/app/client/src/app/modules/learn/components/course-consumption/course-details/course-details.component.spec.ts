import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseDetailsComponent } from './course-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceService } from '@sunbird/shared';

describe('CourseDetailsComponent', () => {
  let component: CourseDetailsComponent;
  let fixture: ComponentFixture<CourseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDetailsComponent ],
      imports:[TranslateModule],
      providers: [
        { provide: ResourceService, useValue: {} }
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
