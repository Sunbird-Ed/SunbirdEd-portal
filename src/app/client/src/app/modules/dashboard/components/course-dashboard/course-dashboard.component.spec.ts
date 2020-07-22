import { mockUserData } from './../course-progress/course-progress.component.spec.data';
import { TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDashboardComponent } from './course-dashboard.component';
import { configureTestSuite } from '@sunbird/test-util';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';
import { CourseProgressService } from '../../services';

describe('CourseDashboardComponent', () => {
  let component: CourseDashboardComponent;
  let fixture: ComponentFixture<CourseDashboardComponent>;
  let courseProgressService: CourseProgressService;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDashboardComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule],
      providers: [CourseProgressService, TelemetryService,
        {provide: APP_BASE_HREF, value: '/'},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDashboardComponent);
    component = fixture.componentInstance;
    courseProgressService = TestBed.get(CourseProgressService);
    fixture.detectChanges();
  });

  it('should call getBatchList', () => {
    spyOn(component, 'getBatchList');
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.getBatchList).toHaveBeenCalled();
  });

  it('should create', () => {
    const searchParamsCreator = {
      courseId: '123',
      status: ['0', '1', '2']
    };
    spyOn(component['courseProgressService'], 'getBatches').and.returnValue(of (mockUserData.getBatchRes));
    component.getBatchList();
    courseProgressService.getBatches(searchParamsCreator).subscribe(data => {
      expect(data).toEqual(mockUserData.getBatchRes);
    });
    expect(component['courseProgressService'].getBatches).toHaveBeenCalledWith(searchParamsCreator);
  });

  it('should create', () => {
    const searchParamsCreator = {
      courseId: '123',
      status: ['0', '1', '2']
    };
    spyOn(component['courseProgressService'], 'getBatches').and.returnValue(throwError ([]));
    component.getBatchList();
    courseProgressService.getBatches(searchParamsCreator).subscribe(data => {
    }, err => {
      expect(err).toEqual([]);
      expect(component.batchList).toEqual([]);
    });
    expect(component['courseProgressService'].getBatches).toHaveBeenCalledWith(searchParamsCreator);
  });

  it('should assign enrollment and completed count', () => {
    component.batchList = [{id: 1, completedCount: 1, participantCount: 5}];
    component.getEnrollmentAndCompletedCount();
  });

  it('should assign enrollment and completed count', () => {
    component.batchList = [{id: 1, completedCount: 1, participantCount: 5}];
    component.getEnrollmentAndCompletedCount();
  });

  it('should assign enrollment and completed count', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });


});
