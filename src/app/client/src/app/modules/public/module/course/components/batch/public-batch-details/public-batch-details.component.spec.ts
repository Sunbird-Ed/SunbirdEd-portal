
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PublicBatchDetailsComponent } from './public-batch-details.component';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { CoreModule, PermissionService } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { allBatchDetails } from './public-batch-details.component.data';
import { UserService } from '@sunbird/core';
import { CourseBatchService } from '@sunbird/learn';
import { configureTestSuite } from '@sunbird/test-util';
import { TelemetryService } from '@sunbird/telemetry';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
const fakeActivatedRoute = {
  'params': observableOf({ courseId: 'do_1125083286221291521153' }),
  'queryParams': observableOf({}),
  'snapshot' : {
    data: {
      telemetry: { env: 'explore-course', pageid: 'explore-course', type: 'view', object: { ver: '1.0', type: 'course' } }
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
describe('PublicBatchDetailsComponent', () => {
  let component: PublicBatchDetailsComponent;
  let fixture: ComponentFixture<PublicBatchDetailsComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, SuiModule],
      declarations: [PublicBatchDetailsComponent],
      providers: [CourseBatchService, UserService, TelemetryService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicBatchDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should fetch only open batchs of course by courseid', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    component.courseId = 'do_1125083286221291521153';
    component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
    spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableOf(allBatchDetails));
    component.ngOnInit();
    const searchParams: any = {
      filters: {
        status: component.batchStatus.toString(),
        courseId: component.courseId
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    searchParams.filters.enrollmentType = 'open';
    expect(component.batchList).toBeDefined();
    expect(component.showBatchList).toBeTruthy();
    expect(component.courseBatchService.getAllBatchDetails).toHaveBeenCalledWith(searchParams);
  });
  it('should throw error when fetching all batch details fails', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
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
  it('should show login modal if user is not loggedin on click of enroll button', () => {
      const courseBatchService = TestBed.get(CourseBatchService);
      spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableOf(allBatchDetails));
      const userService = TestBed.get(UserService);
      component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
      component.ngOnInit();
      component.enrollBatch(component.batchList[0].identifier);
      expect(component.showLoginModal).toBeTruthy();
  });

  it('should navigate to enroll course if user is loggedin', () => {
      const courseBatchService = TestBed.get(CourseBatchService);
      const route = TestBed.get(Router);
      spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableOf(allBatchDetails));
      const userService = TestBed.get(UserService);
      userService._authenticated = true;
      component.courseId = 'do_1125083286221291521153';
      component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
      component.ngOnInit();
      component.enrollBatch(component.batchList[0].identifier);
    expect(route.navigate).toHaveBeenCalledWith([component.baseUrl], { queryParams: { textbook: undefined } });
  });

  it('should log telemetry event when user close login popup', () => {
    const courseBatchService = TestBed.get(CourseBatchService);
    spyOn(courseBatchService, 'getAllBatchDetails').and.returnValue(observableOf(allBatchDetails));
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.courseHierarchy = {identifier: '01250836468775321655', pkgVersion: '1'} ;
    component.courseId = 'do_1125083286221291521153';
    component.ngOnInit();
    component.enrollBatch(component.batchList[0].identifier);
    expect(component.showLoginModal).toBeTruthy();
    component.closeLoginModal();
    expect(telemetryService.interact).toHaveBeenCalled();
    expect(component.showLoginModal).toBeFalsy();
  });
});
