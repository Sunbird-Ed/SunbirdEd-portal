import { tap, delay, mergeMap } from 'rxjs/operators';
import { SuiModalModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { BatchInfoComponent } from './batch-info.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { batchInfoMockResponse } from './batch-info.component.spec.data';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';


describe('BatchInfoComponent', () => {
  let component: BatchInfoComponent;
  let fixture: ComponentFixture<BatchInfoComponent>;
  const resourceBundle = {
    'messages': {
      'emsg': {'m0005': '', m0001: ''},
      'smsg': {'m0036': ''}
    },
    'frmelmnts': {
      'lbl': {},
      'btn': {}
    }
  };
  class FakeActivatedRoute {
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, SuiModalModule],
      declarations: [BatchInfoComponent],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ongoing batch will be true if enrolledBatchInfo has onGoingBatchCount', () => {
    component.enrolledBatchInfo = batchInfoMockResponse.enrolledBatchInfoSuccessResponse;
    component.ngOnInit();
    expect(component.hasOngoingBatches).toBeTruthy();
    expect(component.enrolledBatches.length).toEqual(0);
  });

  it('ongoing batch will be false if enrolledBatchInfo not having onGoingBatchCount', () => {
    component.enrolledBatchInfo = batchInfoMockResponse.enrolledBatchInfoErrorResponse;
    component.ngOnInit();
    expect(component.hasOngoingBatches).toBeFalsy();
    expect(component.enrolledBatches.length).toEqual(1);
  });

  it('should return open batches list', () => {
  spyOn(component['learnerService'], 'post').and.returnValue(of (batchInfoMockResponse.batchList));
  component.enrolledBatchInfo = batchInfoMockResponse.enrolledBatchInfoSuccessResponse;
  const option = {
    url: component.configService.urlConFig.URLS.BATCH.GET_BATCHS,
    data: {
      request: {
        filters: {
          status: [ '1', '0' ],
          enrollmentType: 'open',
          courseId: 'do_2127644219762278401149'
        },
        offset: 0,
        sort_by: { createdDate: 'desc' }
      }
    }
  };
  component['getAllOpenBatchForCourse']();
  expect(component['learnerService'].post).toHaveBeenCalledWith(option);
  });

  xit('should call playcontent()', () => {
   spyOn(component.playerService, 'playContent');
   component.handleResumeEvent({});
   expect(component.playerService.playContent).toHaveBeenCalledWith({mimeType: 'application/vnd.ekstep.content-collection', contentType: 'Course'});
  });


  it('should throw error learnerService post()', () => {
    spyOn(component['learnerService'], 'post').and.returnValue(throwError ({}));
    spyOn(component.toasterService, 'error');
    component['userService'].setUserId('123');
    const options = {
      url: component.configService.urlConFig.URLS.COURSE.ENROLL_USER_COURSE,
      data: {
        request: {
          courseId: 'do_2127644219762278401149',
          userId: '123',
          batchId: '0127644280892047364'
        }
      }
    };
    const event = {
      identifier: '0127644280892047364',
      courseId: 'do_2127644219762278401149'
    };
    component.handleEnrollEvent(event);
    component.learnerService.post(options).pipe(
    delay(2000),
    ).subscribe(data => {}, err => {
      expect(component.disableEnrollBtn).toBeFalsy();
    });
    expect(component.learnerService.post).toHaveBeenCalledWith(options);
    expect(component.toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0001);
  });

  it ('should return when no userids', () => {
    spyOn(component['learnerService'], 'post').and.returnValue(of ({}));
    component['fetchUserDetails']([]);
    expect(component.learnerService.post).not.toHaveBeenCalled();
  });

  it ('should call learnerService.post when  userids present', () => {
    spyOn(component['learnerService'], 'post').and.returnValue(of ({}));
    const option = {
      url: component.configService.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: { identifier: _.compact(_.uniq([{identifier: '1'}])) }
        }
      }
    };
    component['fetchUserDetails']([{identifier: '1'}]);
    expect(component.learnerService.post).toHaveBeenCalledWith(option);
  });

  it ('should unsubscribe on destroy', () => {
    spyOn(component.unsubscribe, 'next');
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.next).toHaveBeenCalled();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });

  it('should handle the enrollment end date', () => {
    let isDisabled = component.handleEnrollmentEndDate({ enrollmentEndDate: dayjs().add(7, 'day') });
    expect(isDisabled).toBeFalsy();

    isDisabled = component.handleEnrollmentEndDate({ enrollmentEndDate: dayjs().subtract(7, 'day') });
    expect(isDisabled).toBeTruthy();
  });

  it('should handle the enrollment start date', () => {
    let isDisabled = component.handleStartDate({ startDate: dayjs().add(7, 'day') });
    expect(isDisabled).toBeTruthy();

    isDisabled = component.handleStartDate({ startDate: dayjs().subtract(7, 'day') });
    expect(isDisabled).toBeFalsy();
  });


});
