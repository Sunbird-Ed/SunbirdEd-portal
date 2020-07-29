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
    parent: {params: of ({courseId: '123'}), queryParams: {} },
    snapshot: {
        data: {
            telemetry: {
                env: 'dashboard', pageid: 'course-dashboard', type: 'view', subtype: 'paginate', object: {type: 'course', ver: '1.0'}
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
    },
    languageSelected$: of({})
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseDashboardComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot(), RouterTestingModule],
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
    spyOn(component, 'setImpressionEvent');
    spyOn(component['activatedRoute'].parent, 'params');
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.getBatchList).toHaveBeenCalled();
    expect(component.setImpressionEvent).toHaveBeenCalled();
  });

  it('should assign impression data', () => {
    component.courseId = '123';
    spyOn(component['navigationhelperService'], 'getPageLoadTime').and.returnValue(0.90);
    component.setImpressionEvent();
    const obj = {
      context: { env: 'dashboard'},
      edata: {type: 'view', pageid: 'course-dashboard', uri: '/', duration: 0.90},
      object: { id: '123', type: 'course', ver: '1.0' }
    };
    expect(component['navigationhelperService'].getPageLoadTime).toHaveBeenCalled();
    expect(component.telemetryImpression).toEqual(obj);

  });

  it('should return data', () => {
    const searchParamsCreator = {
      courseId: '123',
      status: ['0', '1', '2']
    };
    spyOn(component, 'getDashboardData');
    spyOn(component['courseProgressService'], 'getBatches').and.returnValue(of (mockUserData.getBatchRes));
    component.getBatchList();
    courseProgressService.getBatches(searchParamsCreator).subscribe(data => {
      expect(data).toEqual(mockUserData.getBatchRes);
      expect(component.getDashboardData).toHaveBeenCalledWith(_.get(data, 'result.response'));
    });
    expect(component['courseProgressService'].getBatches).toHaveBeenCalledWith(searchParamsCreator);
  });

  it('should throw error', () => {
    component.courseId = '123';
    component['userService'].setUserId('12');
    const searchParamsCreator = {
      courseId: '123',
      status: ['0', '1', '2'],
    };
    spyOn(component['courseProgressService'], 'getBatches').and.returnValue(throwError ([]));
    spyOn(component, 'getDashboardData');
    spyOn(component['toasterService'], 'error');
    component.getBatchList();
    courseProgressService.getBatches(searchParamsCreator).subscribe(data => {
    }, (err) => {
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
    });
  });

  it('should call updateDashBoardItems for totalCompletions', () => {
    component.dashBoardItems = [];
    spyOn(component, 'updateDashBoardItems');
    component.getDashboardData({content: [{ participantCount: 2}], count: 1});
    expect(component.updateDashBoardItems).toHaveBeenCalledWith(resourceBundle.frmelmnts.lbl.totalEnrollments, 2, 'small');
    expect(component.updateDashBoardItems).toHaveBeenCalledTimes(2);
  });

  it('should call updateDashBoardItems for totalEnrollments', () => {
    component.dashBoardItems = [];
    spyOn(component, 'updateDashBoardItems');
    component.getDashboardData({content: [{completedCount: 2, participantCount: 0}], count: 1});
    expect(component.updateDashBoardItems).toHaveBeenCalledWith(resourceBundle.frmelmnts.lbl.totalCompletions, 2, 'large');
    expect(component.updateDashBoardItems).toHaveBeenCalledWith(resourceBundle.frmelmnts.lbl.totalEnrollments, 0, 'small');
    expect(component.updateDashBoardItems).toHaveBeenCalledTimes(2);
  });

  it('should push data to dashBoardItems for completed count', () => {
    component.dashBoardItems = [];
    component.updateDashBoardItems(resourceBundle.frmelmnts.lbl.totalCompletions, 25, 'large');
    expect(component.dashBoardItems).toContain({title: resourceBundle.frmelmnts.lbl.totalCompletions, count: 25, type: 'large'});
  });

  it('should push data to dashBoardItems for enrollment', () => {
    component.dashBoardItems = [];
    component.updateDashBoardItems(resourceBundle.frmelmnts.lbl.totalEnrollments, 25, 'small');
    expect(component.dashBoardItems).toContain({title: resourceBundle.frmelmnts.lbl.totalEnrollments, count: 25, type: 'small'});
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

});
