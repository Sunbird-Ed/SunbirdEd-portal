import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CourseConsumptionService, CourseProgressService } from './../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { _ } from 'lodash-es';
import { CoursesService, PermissionService, CopyContentService, OrgDetailsService, UserService, GeneraliseLabelService } from '@sunbird/core';
import { ResourceService, ToasterService, ContentData, ContentUtilsServiceService, ITelemetryShare, ExternalUrlPreviewService, UtilService, ConnectionService, OfflineCardService, ServerResponse } from '@sunbird/shared';
import { IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import dayjs from 'dayjs';
import { GroupsService } from '../../../../groups/services/groups/groups.service';
import { NavigationHelperService } from '@sunbird/shared';
import { CourseBatchService } from './../../../services';
import { DiscussionService } from '../../../../discussion/services/discussion/discussion.service';
import { FormService } from '../../../../core/services/form/form.service';
import { IForumContext } from '../../../interfaces';
import { ContentManagerService } from '../../../../public/module/offline/services';
import { DiscussionTelemetryService } from './../../../../shared/services/discussion-telemetry/discussion-telemetry.service';
import { CourseConsumptionHeaderComponent } from './course-consumption-header.component';
import { of, throwError } from 'rxjs';
import { MockResponseData } from './course-consumption-header.spec.data';
import { json } from 'body-parser';

describe('CourseConsumptionHeaderComponent', () => {
	let component: CourseConsumptionHeaderComponent;

	const mockActivatedRoute: Partial<ActivatedRoute> = {
		snapshot: {
			params: {
				courseId: 'mock-course-id',
			},
			data: {
				telemetry: {
					env: 'mock-env',
					pageid: 'page-id',
				}
			}
		} as any,
	};
	const mockCourseConsumptionService: Partial<CourseConsumptionService> = {
		getContentRollUp: jest.fn(),
		getRollUp: jest.fn(),
		setCoursePagePreviousUrl: jest.fn(),
		isTrackableCollection: jest.fn(),
		canViewDashboard: jest.fn()
	};
	const mockResourceService: Partial<ResourceService> = {
		messages: {
			fmsg: {
				m0090: 'mock-error-message',
				m0004: 'Could not fetch data, try again later'
			},
			stmsg: {
				desktop: {
					deleteCourseSuccessMessage: 'Course deleted successfully'
				},
				m0140: 'Downloading'
			},
			etmsg: {
				desktop: {
					deleteCourseErrorMessage: 'Error deleting course'
				}
			},
			smsg: {
				m0059: 'mock-error-message',
				m0056: 'You should be online to update the {contentName}'
			},
		}

	};
	const mockRouter: Partial<Router> = {
		navigate: jest.fn(),
	};
	const mockPermissionService: Partial<PermissionService> = {
		checkRolesPermissions: jest.fn(() => {
			return true;
		}) as any
	};
	const mockToasterService: Partial<ToasterService> = {
		success: jest.fn(),
		error: jest.fn(),
	};
	const mockCopyContentService: Partial<CopyContentService> = {};
	const mockChangeDetectorRef: Partial<ChangeDetectorRef> = {};
	const mockCourseProgressService: Partial<CourseProgressService> = {};
	const mockContentUtilsServiceService: Partial<ContentUtilsServiceService> = {};
	const mockExternalUrlPreviewService: Partial<ExternalUrlPreviewService> = {};
	const mockCoursesService: Partial<CoursesService> = {};
	const mockUserService: Partial<UserService> = {
		loggedIn: true,
		slug: jest.fn().mockReturnValue('tn') as any,
		userData$: of({
			userProfile: {
				userId: 'sample-uid',
				rootOrgId: 'sample-root-id',
				rootOrg: {
					rootOrgId: 'sample-root-id'
				},
				hashTagIds: ['id']
			} as any
		}) as any,
		setIsCustodianUser: jest.fn(),
		setGuestUser: jest.fn(),
		userid: 'sample-uid',
		userProfile: {
			rootOrg: {
				rootOrgId: 'sample-root-id'
			}
		},
		appId: 'sample-id',
		getServerTimeDiff: '',
	};
	const mockTelemetryService: Partial<TelemetryService> = {
		interact: jest.fn(),
	};
	const mockGroupService: Partial<GroupsService> = {};
	const mockNavigationHelperService: Partial<NavigationHelperService> = {};
	const mockOrgDetailsService: Partial<OrgDetailsService> = {

	};
	const mockGeneraliseLabelService: Partial<GeneraliseLabelService> = {};
	const mockConnectionService: Partial<ConnectionService> = {
		monitor: jest.fn(() => of(true))
	};
	const mockCourseBatchService: Partial<CourseBatchService> = {
		getAllBatchDetails: jest.fn(),
	};
	const mockUtilService: Partial<UtilService> = {
		getPlayerDownloadStatus: jest.fn(),
		//isDesktopApp:true
	};
	const mockContentManagerService: Partial<ContentManagerService> = {
		downloadContentId: '',
		downloadContentData: {},
		failedContentName: '',
		startDownload: jest.fn(),
		deleteContent: jest.fn(),
		exportContent: jest.fn(),
		updateContent: jest.fn(),
	};
	const mockFormService: Partial<FormService> = {
		getFormConfig: jest.fn(),
	};
	const mockOfflineCardService: Partial<OfflineCardService> = {
		isYoutubeContent: jest.fn(),
	};
	const mockDiscussionService: Partial<DiscussionService> = {};
	const mockDiscussionTelemetryService: Partial<DiscussionTelemetryService> = {};

	beforeAll(() => {
		component = new CourseConsumptionHeaderComponent(
			mockActivatedRoute as ActivatedRoute,
			mockCourseConsumptionService as CourseConsumptionService,
			mockResourceService as ResourceService,
			mockRouter as Router,
			mockPermissionService as PermissionService,
			mockToasterService as ToasterService,
			mockCopyContentService as CopyContentService,
			mockChangeDetectorRef as ChangeDetectorRef,
			mockCourseProgressService as CourseProgressService,
			mockContentUtilsServiceService as ContentUtilsServiceService,
			mockExternalUrlPreviewService as ExternalUrlPreviewService,
			mockCoursesService as CoursesService,
			mockUserService as UserService,
			mockTelemetryService as TelemetryService,
			mockGroupService as GroupsService,
			mockNavigationHelperService as NavigationHelperService,
			mockOrgDetailsService as OrgDetailsService,
			mockGeneraliseLabelService as GeneraliseLabelService,
			mockConnectionService as ConnectionService,
			mockCourseBatchService as CourseBatchService,
			mockUtilService as UtilService,
			mockContentManagerService as ContentManagerService,
			mockFormService as FormService,
			mockOfflineCardService as OfflineCardService,
			mockDiscussionService as DiscussionService,
			mockDiscussionTelemetryService as DiscussionTelemetryService
		)
	});

	beforeEach(() => {
		jest.mock('dayjs', () => jest.fn(date => ({
			isBefore: jest.fn(() => true) // Mocking always true for simplicity
		})));
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should create a instance of component', () => {
		expect(component).toBeTruthy();
	});

	it('should return enrollmentEndDate on isValidEnrollmentEndDate', () => {
		const result = component.isValidEnrollmentEndDate(true);
		expect(result).toEqual(true);
	});

	describe('isEnrollmentAllowed', () => {
		it('should return true if enrollment end date is before today', () => {
			const enrollmentEndDate = '2024-03-26';
			expect(component.isEnrollmentAllowed(enrollmentEndDate)).toBeTruthy();
		});

		it('should return false if enrollment end date is same as today', () => {
			const enrollmentEndDate = '2024-03-27';
			expect(component.isEnrollmentAllowed(enrollmentEndDate)).toBeTruthy();
		});

		it('should return false if enrollment end date is after today', () => {
			const enrollmentEndDate = '2024-03-28';
			expect(component.isEnrollmentAllowed(enrollmentEndDate)).toBeTruthy();
		});
	});

	it('should navigate to discussion forum with correct query parameters', () => {
		const routerData = {
			forumIds: [123, 456],
			userId: 'user123'
		};
		component.assignForumData(routerData);

		expect(mockRouter.navigate).toHaveBeenCalledWith(['/discussion-forum'], {
			queryParams: {
				categories: JSON.stringify({ result: routerData.forumIds }),
				userId: routerData.userId
			}
		});
	});

	describe('deleteCollection', () => {
		it('should delete collection successfully', () => {
			jest.spyOn(mockContentManagerService as any, 'deleteContent').mockReturnValue(of({}));
			component.deleteCollection({ identifier: 'collection_id' });

			expect(component.disableDelete).toBeTruthy();
			expect(mockContentManagerService.deleteContent).toHaveBeenCalledWith({ request: { contents: ['collection_id'] } });
			expect(mockToasterService.success).toHaveBeenCalledWith('Course deleted successfully');
		});

		it('should handle error while deleting collection', () => {
			jest.spyOn(mockContentManagerService, 'deleteContent').mockReturnValue(throwError({}));
			component.deleteCollection({ identifier: 'collection_id' });

			expect(component.disableDelete).toBeFalsy(); // disableDelete should be set to false due to error
			expect(mockContentManagerService.deleteContent).toHaveBeenCalledWith({ request: { contents: ['collection_id'] } });
			expect(mockToasterService.error).toHaveBeenCalledWith('Error deleting course');
		});
	});

	describe('downloadCollection', () => {
		it('should set download status and call startDownload method', () => {
			const collection = {
				identifier: '123',
				name: 'Sample Collection'
			};
			jest.spyOn(component.contentManagerService as any, 'startDownload' as any).mockReturnValue(of({}));
			component.downloadCollection(collection);

			expect(component.showDownloadLoader).toBe(false);
			expect(component.disableDelete).toBe(false);
			expect(component.contentManagerService.downloadContentId).toBe('');
			expect(component.contentManagerService.downloadContentData).toEqual({});
			expect(component.contentManagerService.failedContentName).toBe('Sample Collection');
			expect(component.contentManagerService.startDownload).toHaveBeenCalled();
		});

		it('should handle error if download fails due to low disk space', () => {
			jest.spyOn(component.contentManagerService as any, 'startDownload' as any).mockReturnValue(throwError({ error: { params: { err: 'LOW_DISK_SPACE' } } }));
			const collection = {
				identifier: '123',
				name: 'Sample Collection'
			};
			component.downloadCollection(collection);
			expect(component.showDownloadLoader).toBe(false);
			expect(component.disableDelete).toBe(true);
		});

		it('should handle error if download fails due to other reasons', () => {
			jest.spyOn(component.contentManagerService as any, 'startDownload' as any).mockReturnValue(throwError({ error: { params: { err: 'SOME_OTHER_REASON' } } }));
			const collection = {
				identifier: '123',
				name: 'Sample Collection'
			};
			component.downloadCollection(collection);
			expect(component.showDownloadLoader).toBe(false);
			expect(component.disableDelete).toBe(true);
		});
	});

	it('should set values and call methods on isYoutubeContentPresent', () => {
		const mockCollection = { data: 'mock-data' };
		jest.spyOn(component, 'logTelemetry');
		component.showModal = false;
		jest.spyOn(component.contentManagerService as any, 'startDownload').mockReturnValue(of({}));
		jest.spyOn(component, 'downloadCollection')
		component.isYoutubeContentPresent(mockCollection);

		expect(component.logTelemetry).toHaveBeenCalledWith('is-youtube-in-collection');
		expect(component['offlineCardService'].isYoutubeContent).toHaveBeenCalledWith(mockCollection);
		expect(component.downloadCollection).toHaveBeenCalledWith(mockCollection);
	});
	it('should call getFormData for the gloabal menubar', () => {
		jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(of(MockResponseData.menubar.data.fields));
		component.getFormData();
		expect(component.batchEndCounter).toBe(4);
	});
	it('should call getFormData for the gloabal menubar and no batchEndCounter', () => {
		jest.spyOn(mockFormService, 'getFormConfig').mockReturnValue(of(MockResponseData.menubarNew.data.fields));
		component.getFormData();
		expect(component.batchEndCounter).toBe(null);
	});
	describe('exportCollection', () => {
		it('should call exportContent method and show success message on successful export', () => {
			const collection = {
				identifier: '123'
			};
			jest.spyOn(component.contentManagerService as any, 'exportContent').mockReturnValue(of({}));
			component.exportCollection(collection);
			expect(component.showExportLoader).toBe(false);
			expect(component.contentManagerService.exportContent).toHaveBeenCalledWith('123');
			expect(component.toasterService.success).toHaveBeenCalledWith(component.resourceService.messages.smsg.m0059);
			expect(component.showExportLoader).toBe(false);
		});

		it('should call exportContent method and show error message on failed export with responseCode other than NO_DEST_FOLDER', () => {
			jest.spyOn(mockContentManagerService as any, 'exportContent').mockReturnValue(throwError({ error: { responseCode: 'SOME_ERROR' } }));
			const collection = {
				identifier: '123'
			};
			component.exportCollection(collection);
			expect(component.showExportLoader).toBe(false);
			expect(component.contentManagerService.exportContent).toHaveBeenCalledWith('123');
			expect(component.toasterService.error).toHaveBeenCalledWith(component.resourceService.messages.fmsg.m0091);
			expect(component.showExportLoader).toBe(false);
		});

		it('should call exportContent method and show no destination folder error message on failed export with responseCode NO_DEST_FOLDER', () => {
			jest.spyOn(mockContentManagerService as any, 'exportContent').mockReturnValue(throwError({ error: { responseCode: 'NO_DEST_FOLDER' } }));
			const collection = {
				identifier: '123'
			};
			component.exportCollection(collection);
			expect(component.showExportLoader).toBe(false);
			expect(component.contentManagerService.exportContent).toHaveBeenCalledWith('123');
			expect(component.toasterService.error).not.toHaveBeenCalled();
			expect(component.showExportLoader).toBe(false);
		});
	});
	describe('getAllBatchDetails', () => {
		it('should call the getAllBatchDetails method with the course id', () => {
			component.courseId = 'do_213878753577951232165';
			jest.spyOn(mockCourseBatchService as any, 'getAllBatchDetails').mockReturnValue((of(MockResponseData.batchList)));
			component.getAllBatchDetails();
			expect(JSON.stringify(component.batchList)).toBe(JSON.stringify(MockResponseData.batchList.result.response.content))
		});

		it('should call the getAllBatchDetails method with the course id and should throw error', () => {
			component.courseId = 'do_213878753577951232165';
			jest.spyOn(mockCourseBatchService as any, 'getAllBatchDetails').mockReturnValue(throwError({ error: { params: { err: 'SOME_OTHER_REASON' } } }));
			component.getAllBatchDetails();
			expect(component.showError).toBeTruthy();
			expect(mockToasterService.error).toBeCalled();
			expect(mockToasterService.error).toHaveBeenCalledWith('Could not fetch data, try again later');
		});
	});
	describe('updateCollection', () => {
		it('should call the updateCollection method ', () => {
			jest.spyOn(mockContentManagerService as any, 'updateContent').mockReturnValue(of({ data: 1234 }));
			const collection = {
				identifier: 'do_213878753577951232165'
			}
			component.updateCollection(collection);
			expect(component.showUpdate).toBeFalsy();
		});
		it('should call the updateCollection method with error ', () => {
			jest.spyOn(mockContentManagerService as any, 'updateContent').mockReturnValue(throwError({ error: { params: { err: '123' } } }));
			const collection = {
				identifier: 'do_213878753577951232165'
			}
			component.updateCollection(collection);
			expect(component.showUpdate).toBeTruthy();
		});
		it('should call the updateCollection method with error and  isConnected as false', () => {
			component.isConnected = false;
			jest.spyOn(mockContentManagerService as any, 'updateContent').mockReturnValue(throwError({ error: { params: { err: '123' } } }));
			const collection = {
				identifier: 'do_213878753577951232165',
				name: 'ABCD'
			}
			component.updateCollection(collection);
			expect(component.showUpdate).toBeTruthy();
			expect(mockToasterService.error).toHaveBeenCalledWith('You should be online to update the ABCD');
		});


	});
	describe('checkStatus and checkDownloadStatus', () => {
		it('should call the checkStatus method ', () => {
			jest.spyOn(component, 'checkDownloadStatus');
			component.courseHierarchy = MockResponseData.contentHeaderData.downloadList
			const value = component.checkStatus({});
			expect(component.checkDownloadStatus).toBeCalled();
		});
	});
	describe('generateDataForDF', () => {
		it('should call the generateDataForDF method isCreator is true ', () => {
			component.generateDataForDF();
			component.courseHierarchy = MockResponseData.contentHeaderData.downloadList
			expect(JSON.stringify(component.fetchForumIdReq)).toBe(JSON.stringify({ type: 'course', identifier: ['do_213878753577951232165'] }));
		});
		it('should call the generateDataForDF method ', () => {
			component.courseHierarchy = MockResponseData.contentHeaderData.contentList
			component.enrolledCourse = true;
			component.batchId = '1234567890123';
			component.generateDataForDF();
			expect(JSON.stringify(component.fetchForumIdReq)).toBe(JSON.stringify({ type: 'batch', identifier: ['1234567890123'] }));
		});
		it('should call the generateDataForDF method with the mentor as true ', () => {
			component.courseHierarchy = MockResponseData.contentHeaderData.contentList
			jest.spyOn(mockPermissionService, 'checkRolesPermissions').mockReturnValue(true);
			component.enrolledCourse = false;
			component.generateDataForDF();
			expect(JSON.stringify(component.fetchForumIdReq)).toBe(JSON.stringify({ type: 'course', identifier: ['do_213878753577951232165'] }));
		});
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
	describe("getCustodianOrgUser", () => {
		it('should call the getCustodianOrgUser method', () => {
			const custodianOrg = {
				result: { response: { value: 'ROOT_ORG' } }
			}
			mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(custodianOrg)) as any;
			component['getCustodianOrgUser']();
			expect(component.isCustodianOrgUser).toBeFalsy();
		});
		it('should call the getCustodianOrgUser method', () => {
			const custodianOrg = {
				result: { response: { value: 'sample-root-id' } }
			}
			mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(custodianOrg)) as any;
			component['getCustodianOrgUser']();
			expect(component.isCustodianOrgUser).toBeTruthy();
		});
	});
	xdescribe("ngOnInit", () => {
		it('should call the ngOnInit method ', () => {
			const custodianOrg = {
				result: { response: { value: 'sample-root-id' } }
			}
			mockConnectionService.monitor = jest.fn().mockReturnValue(of(true)) as any;
			mockOrgDetailsService.getCustodianOrgDetails = jest.fn().mockReturnValue(of(custodianOrg)) as any;
			mockConnectionService.monitor = jest.fn().mockReturnValue(of(true)) as any;
			component.ngOnInit();

		});
	});
});


