import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@sunbird/core';
import { NavigationHelperService, ResourceService, SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { CurriculumCourseDetailsComponent } from './curriculum-course-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CurriculumCourseDetailsComponent', () => {
  let component: CurriculumCourseDetailsComponent;
  let fixture: ComponentFixture<CurriculumCourseDetailsComponent>;

  const fakeActivatedRoute = {
    params: of({ courseId: 'do_12121asa1212' }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurriculumCourseDetailsComponent],
      imports: [SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot(), RouterTestingModule],
      providers: [ResourceService, { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  it('should call goBack', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'goBack');
    component.goBack();
    expect(navigationHelperService.goBack).toHaveBeenCalled();
  });
});
