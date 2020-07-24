import { RouterTestingModule } from '@angular/router/testing';
import { mockUserData } from './../course-progress/course-progress.component.spec.data';
import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDashboardComponent } from './course-dashboard.component';
import { configureTestSuite } from '@sunbird/test-util';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';
import { CourseProgressService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

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
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        totalBatches: 'Total Batches',
        totalEnrollments: 'Total Enrollments',
        totalCompletions: 'Total Completions',
      }
    },
    messages: {
      emsg: {
        m0005: 'Something went wrong',
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
        {provide: ResourceService, useValue: resourceBundle},
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
    spyOn(component, 'initializeFields');
    spyOn(component, 'setImpressionEvent');
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.getBatchList).toHaveBeenCalled();
    expect(component.initializeFields).toHaveBeenCalled();
    expect(component.dashBoardItems.totalCompleted.title).toEqual(resourceBundle.frmelmnts.lbl.totalCompletions);
    expect(component.dashBoard.totalBatches.title).toEqual(resourceBundle.frmelmnts.lbl.totalBatches);
    expect(component.dashBoard.totalEnrollment.title).toEqual(resourceBundle.frmelmnts.lbl.totalEnrollments);
    expect(component.setImpressionEvent).toHaveBeenCalled();
  });

  it('should create', () => {
    const searchParamsCreator = {
      courseId: '123',
      status: ['0', '1', '2']
    };
    spyOn(component, 'getEnrollmentAndCompletedCount');
    spyOn(component['courseProgressService'], 'getBatches').and.returnValue(of (mockUserData.getBatchRes));
    component.getBatchList();
    courseProgressService.getBatches(searchParamsCreator).subscribe(data => {
      expect(data).toEqual(mockUserData.getBatchRes);
      expect(component.getEnrollmentAndCompletedCount).toHaveBeenCalledWith(_.get(data, 'result.response'));
    });
    expect(component['courseProgressService'].getBatches).toHaveBeenCalledWith(searchParamsCreator);
  });

  it('should create', () => {
    component.courseId = '123';
    component['userService'].setUserId('12');
    const searchParamsCreator = {
      courseId: '123',
      status: ['0', '1', '2'],
    };
    spyOn(component['courseProgressService'], 'getBatches').and.returnValue(throwError ([]));
    spyOn(component, 'getEnrollmentAndCompletedCount');
    spyOn(component['toasterService'], 'error');
    component.getBatchList();
    courseProgressService.getBatches(searchParamsCreator).subscribe(data => {
    }, (err) => {
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
    });
    expect(component['courseProgressService'].getBatches).toHaveBeenCalledWith(searchParamsCreator);
  });

  it('should assign enrollment and completed count', () => {
    component.getEnrollmentAndCompletedCount({content: [mockUserData.currentBatchDataWithCount], count: 1});
    expect(component.dashBoard.totalBatches.count).toEqual(1);
    expect(component.dashBoard.totalEnrollment.count).toEqual(2);
    expect(component.dashBoardItems.totalCompleted.count).toEqual(4);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });


});
