import { RouterTestingModule } from '@angular/router/testing';
import { mockUserData } from './../course-progress/course-progress.component.spec.data';
import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDashboardComponent } from './course-dashboard.component';
import { configureTestSuite } from '@sunbird/test-util';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';
import { CourseProgressService } from '../../services';
import { ActivatedRoute } from '@angular/router';

describe('CourseDashboardComponent', () => {
  let component: CourseDashboardComponent;
  let fixture: ComponentFixture<CourseDashboardComponent>;
  let courseProgressService: CourseProgressService;
  const fakeActivatedRoute = {
    'params': of ({courseId: '123'}),
    snapshot: {
        data: {
            telemetry: {
                env: 'dashboard', pageid: 'course-dashboard', type: 'view', subtype: 'paginate'
            }
        }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDashboardComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule, RouterTestingModule],
      providers: [CourseProgressService, TelemetryService,
        {provide: APP_BASE_HREF, value: '/'},
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
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
      status: ['0', '1', '2'],
    };
    spyOn(component['courseProgressService'], 'getBatches').and.returnValue(throwError ([]));
    component.getBatchList();
    courseProgressService.getBatches(searchParamsCreator).subscribe(data => {
    }, err => {
      expect(err).toEqual([]);
    });
    expect(component['courseProgressService'].getBatches).toHaveBeenCalledWith(searchParamsCreator);
  });

  it('should assign enrollment and completed count', () => {
    component.getEnrollmentAndCompletedCount({content: [mockUserData.currentBatchDataWithCount], count: 1});
    expect(component.dashBoardSmallCards.totalBatches.count).toEqual(1);
    expect(component.dashBoardSmallCards.totalEnrollment.count).toEqual(2);
    expect(component.dashBoardLargeCards.totalCompleted.count).toEqual(4);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });


});
