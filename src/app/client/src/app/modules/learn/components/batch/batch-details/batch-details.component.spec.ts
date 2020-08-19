
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BatchDetailsComponent } from './batch-details.component';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { CoreModule, PermissionService, UserService } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseBatchService, CourseProgressService } from './../../../services';
import {userSearch, allBatchDetails, enrolledBatch } from './batch-details.component.data';
import { configureTestSuite } from '@sunbird/test-util';
import { TelemetryService } from '@sunbird/telemetry';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
const fakeActivatedRoute = {
  'params': observableOf({ courseId: 'do_1125083286221291521153' }),
  'queryParams': observableOf({}),
  'snapshot': {
    data: {
      telemetry: {
        env: 'course', pageid: 'Course', type: 'view',
      }
    }
  }
};

const resourceServiceMockData = {
  messages : {
    imsg: { m0027: 'Something went wrong'},
    stmsg: { m0009: 'error' },
    fmsg: { m0004: 'error'}
  },
  frmelmnts: {
    btn: {
      tryagain: 'tryagain',
      close: 'close'
    },
    lbl: {
      description: 'description'
    }
  }
};
describe('BatchDetailsComponent', () => {
  let component: BatchDetailsComponent;
  let fixture: ComponentFixture<BatchDetailsComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, SuiModule],
      declarations: [BatchDetailsComponent],
      providers: [CourseBatchService, TelemetryService, CourseProgressService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchDetailsComponent);
    component = fixture.componentInstance;

  });
  it('should fetch only open batch of course if course is not enrolled and user is not mentor', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    component.enrolledCourse = false;
    component.courseId = 'do_1125083286221291521153';
    component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
    spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableOf(allBatchDetails));
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(userSearch));
    component.ngOnInit();
    const searchParams: any = {
      filters: {
        status: component.batchStatus.toString(),
        courseId: component.courseId,
        enrollmentType: 'open'
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    expect(component.courseMentor).toBeFalsy();
    expect(component.batchList).toBeDefined();
    expect(component.userList).toBeDefined();
    expect(component.showBatchList).toBeTruthy();
    expect(component.courseBatchService.getAllBatchDetails).toHaveBeenCalledWith(searchParams);
  });
  it('should throw error when fetching all batch details fails', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    component.enrolledCourse = false;
    component.courseId = 'do_1125083286221291521153';
    component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceServiceMockData.messages;
    resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableThrowError(allBatchDetails));
    component.ngOnInit();
    const searchParams: any = {
      filters: {
        status: component.batchStatus.toString(),
        courseId: component.courseId,
        enrollmentType: 'open'
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    expect(component.showError).toBeTruthy();
  });
  it('should fetch all batch of course if course is not enrolled and user is mentor', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const permissionService = TestBed.get(PermissionService);
    component.enrolledCourse = false;
    component.courseId = 'do_1125083286221291521153';
    component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue(true);
    spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableOf(allBatchDetails));
    spyOn(courseBatchService, 'getUserList').and.returnValue(observableOf(userSearch));
    const searchParams: any = {
      filters: {
        status: component.batchStatus.toString(),
        courseId: component.courseId,
        createdBy: component.userService.userid
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    component.ngOnInit();
    expect(component.courseMentor).toBeTruthy();
    expect(component.batchList).toBeDefined();
    expect(component.userList).toBeDefined();
    expect(component.showBatchList).toBeTruthy();
    expect(component.courseBatchService.getAllBatchDetails).toHaveBeenCalledWith(searchParams);
  });
  it('should navigate to update batch route', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const route = TestBed.get(Router);
    spyOn(courseBatchService, 'setUpdateBatchDetails');
    component.batchUpdate({ identifier: '123', enrollmentType: 'open' });
    expect(route.navigate).toHaveBeenCalledWith(['update/batch', '123'],
      { queryParams: { enrollmentType: 'open' }, relativeTo: component.activatedRoute });
  });
  it('should navigate to enroll route', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const route = TestBed.get(Router);
    spyOn(courseBatchService, 'setEnrollToBatchDetails');
    component.enrollBatch({identifier: '123'});
    const routeQueryParams = {
      relativeTo: component.activatedRoute,
      queryParams: { autoEnroll: true }
    };
    expect(route.navigate).toHaveBeenCalledWith(['enroll/batch', '123'], routeQueryParams);
  });
  it('should navigate to create batch', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    const route = TestBed.get(Router);
    component.createBatch();
    expect(route.navigate).toHaveBeenCalledWith(['create/batch'], {relativeTo: component.activatedRoute});
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
  it('should call isUnenrollDisabled and make the isUnenrollbtnDisabled false', () => {
    component.courseProgressData = {progress: 0,
      completedCount: 1, totalCount: 1, content: [], lastPlayedContentId: 'do_112501345261985792135'};
    component.enrolledBatchInfo = {'enrollmentType': 'open'};
    component.isUnenrollDisabled();
    expect(component.isUnenrollbtnDisabled).toBeFalsy();
  });

  it(`should allow 'Create Batch' button to be shown if the user has created to course and has necessary roles`, () => {
    const userService = TestBed.get(UserService);
    const permissionService = TestBed.get(PermissionService);
    spyOnProperty(userService, 'userid', 'get').and.returnValue('9ad90eb4-b8d2-4e99-805f');
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue(true);
    component.courseHierarchy = {createdBy: '9ad90eb4-b8d2-4e99-805f'};
    component.showCreateBatch();
    expect(component.allowBatchCreation).toBe(true);
  });

  it(`should not allow 'Create Batch' button to be shown if the user has not created the course`, () => {
    const userService = TestBed.get(UserService);
    const permissionService = TestBed.get(PermissionService);
    spyOnProperty(userService, 'userid', 'get').and.returnValue('123456789');
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue(true);
    component.courseHierarchy = {createdBy: '9ad90eb4-b8d2-4e99-805f'};
    component.showCreateBatch();
    expect(component.showCreateBatch()).toBeFalsy();
  });

  it(`should not allow 'Create Batch' button to be shown if the user has  created the course but doesn't have roles permission`, () => {
    const userService = TestBed.get(UserService);
    const permissionService = TestBed.get(PermissionService);
    spyOnProperty(userService, 'userid', 'get').and.returnValue('9ad90eb4-b8d2-4e99-805f');
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue(false);
    component.courseHierarchy = {createdBy: '9ad90eb4-b8d2-4e99-805f'};
    component.showCreateBatch();
    expect(component.showCreateBatch()).toBeFalsy();
  });

  it('should call getJoinCourseBatchDetails and get success', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    component.enrolledCourse = false;
    component.courseId = 'do_1125083286221291521153';
    component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
    spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableOf(allBatchDetails));
    component.getJoinCourseBatchDetails();
    const searchParams: any = {
      filters: {
        status: ['0', '1'],
        courseId: component.courseId,
        enrollmentType: 'open'
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    expect(component.courseMentor).toBeFalsy();
    expect(component.allBatchList).toBeDefined();
    expect(component.showAllBatchList).toBeTruthy();
    expect(component.showJoinModal).toBeTruthy();
    expect(component.courseBatchService.getAllBatchDetails).toHaveBeenCalledWith(searchParams);
  });
  it('should call getJoinCourseBatchDetails and get error', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    component.enrolledCourse = false;
    component.courseId = 'do_1125083286221291521153';
    component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
    spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableThrowError(allBatchDetails));
    component.getJoinCourseBatchDetails();
    expect(component.showAllBatchError).toBeTruthy();
  });

  it('should call logTelemetry', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.logTelemetry('buttonId');
    expect(telemetryService.interact).toHaveBeenCalled();
  });
});
