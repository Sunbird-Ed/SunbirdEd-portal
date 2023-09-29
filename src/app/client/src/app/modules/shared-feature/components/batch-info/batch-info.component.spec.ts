import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { PlayerService, LearnerService, UserService, CoursesService, GeneraliseLabelService } from '@sunbird/core';
import { _ } from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, mergeMap, tap, delay } from 'rxjs/operators';
import { Subject, of, throwError } from 'rxjs';
import dayjs from 'dayjs';
import { batchInfoMockResponse } from './batch-info.component.spec.data';
import { BatchInfoComponent } from './batch-info.component';

describe('BatchInfoComponent', () => {
	let component: BatchInfoComponent;

	const resourceService: Partial<ResourceService> = {
		messages: {
			emsg: {
				m0001: 'Cannot enrol now. Try again later'
			}
		}
	};
	const playerService: Partial<PlayerService> = {
		playContent: jest.fn()
	};
	const configService: Partial<ConfigService> = {
		urlConFig: {
			URLS: {
				BATCH: {
					'GET_BATCHS': 'course/v1/batch/list',
				},
				COURSE: {
					'ENROLL_USER_COURSE': 'course/v1/enrol',
				},
				ADMIN: {
					'USER_SEARCH': 'user/v3/search',
				}
			}
		}
	};
	const learnerService: Partial<LearnerService> = {
		post: jest.fn()
	};
	const userService: Partial<UserService> = {

	};
	const toasterService: Partial<ToasterService> = {
		error: jest.fn()
	};
	const coursesService: Partial<CoursesService> = {};
	const router: Partial<Router> = {};
	const generaliseLabelService: Partial<GeneraliseLabelService> = {};
	const activatedRoute: Partial<ActivatedRoute> = {};

	beforeAll(() => {
		component = new BatchInfoComponent(
			resourceService as ResourceService,
			playerService as PlayerService,
			configService as ConfigService,
			learnerService as LearnerService,
			userService as UserService,
			toasterService as ToasterService,
			coursesService as CoursesService,
			router as Router,
			generaliseLabelService as GeneraliseLabelService,
			activatedRoute as ActivatedRoute
		)
	});

	beforeEach(() => {
		component.hasOngoingBatches = false;
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should create a instance of component', () => {
		expect(component).toBeTruthy();
	});
	it('ongoing batch will be true if enrolledBatchInfo has onGoingBatchCount', () => {
		component.enrolledBatchInfo = batchInfoMockResponse.enrolledBatchInfoSuccessResponse;
		component['getAllOpenBatchForCourse'] = jest.fn().mockReturnValue(of({})) as any;
		component.ngOnInit();
		expect(component.hasOngoingBatches).toBeTruthy();
		expect(component.enrolledBatches.length).toEqual(0);
	});

	it('ongoing batch will be false if enrolledBatchInfo not having onGoingBatchCount', () => {
		component.enrolledBatchInfo = batchInfoMockResponse.enrolledBatchInfoErrorResponse;
		learnerService.post = jest.fn().mockReturnValue(of(batchInfoMockResponse.batchList)) as any;
		component['getAllOpenBatchForCourse'] = jest.fn().mockReturnValue(of(batchInfoMockResponse.enrolledBatchInfoErrorResponse)) as any;
		component.ngOnInit();
		expect(component.hasOngoingBatches).toBeFalsy();
		expect(component.enrolledBatches.length).toEqual(1);
		expect(component['getAllOpenBatchForCourse']).toBeCalled();
	});
	it('should call playcontent()', () => {
		jest.spyOn(component.playerService, 'playContent');
		component.handleResumeEvent({});
		expect(component.playerService.playContent).toHaveBeenCalledWith({ mimeType: 'application/vnd.ekstep.content-collection', contentType: 'Course', 'primaryCategory': 'Course' });
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
	it('should throw error learnerService post()', () => {
		userService.setUserId = jest.fn();
		jest.spyOn(component['learnerService'], 'post').mockReturnValue(throwError({}));
		jest.spyOn(component.toasterService, 'error');
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
		).subscribe(data => { }, err => {
			expect(component.disableEnrollBtn).toBeFalsy();
		});
		expect(component.learnerService.post).toHaveBeenCalledWith(options);
		expect(component.toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0001);
	});
	it('should return open batches list', () => {
		jest.spyOn(component['learnerService'], 'post').mockReturnValue(of(batchInfoMockResponse.ServerResponse)) as any;
		component.enrolledBatchInfo = batchInfoMockResponse.enrolledBatchInfoSuccessResponse;
		const option = {
			url: component.configService.urlConFig.URLS.BATCH.GET_BATCHS,
			data: {
				request: {
					filters: {
						status: ['1'],
						enrollmentType: 'open',
						courseId: 'do_2127644219762278401149'
					},
					offset: 0,
					sort_by: { createdDate: 'desc' }
				}
			}
		};
		component.learnerService.post(option).pipe(
			delay(2000),
		).subscribe(data => { }, err => {
			expect(component.disableEnrollBtn).toBeFalsy();
		});
		component['getAllOpenBatchForCourse']();
		expect(component['learnerService'].post).toHaveBeenCalledWith(option);
	});
	it ('should call learnerService.post when  userids present', () => {
		jest.spyOn(component['learnerService'], 'post').mockReturnValue(of(batchInfoMockResponse.ServerResponse));
		const option = {
		  url: component.configService.urlConFig.URLS.ADMIN.USER_SEARCH,
		  data: {
			request: {
			  filters: { identifier: _.compact(_.uniq([{identifier: '1'}])) }
			}
		  }
		};
		component.learnerService.post(option).pipe(
			delay(2000),
		).subscribe(data => { }, err => {
			expect(component.disableEnrollBtn).toBeFalsy();
		});
		component['fetchUserDetails']([{identifier: '1'}]);
		expect(component.learnerService.post).toHaveBeenCalledWith(option);
	  });

	describe("ngOnDestroy", () => {
		it('should destroy sub', () => {
			component.unsubscribe = {
				next: jest.fn(),
				complete: jest.fn()
			} as any;
			component.ngOnDestroy();
			expect(component.unsubscribe.next).toHaveBeenCalled();
			expect(component.unsubscribe.complete).toHaveBeenCalled();
		});
	});
});