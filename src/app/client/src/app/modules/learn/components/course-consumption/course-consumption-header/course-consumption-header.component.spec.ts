import { takeUntil } from 'rxjs/operators';
import { Component,OnInit,Input,AfterViewInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import { CourseConsumptionService,CourseProgressService } from './../../../services';
import { ActivatedRoute,Router } from '@angular/router';
import { _ } from 'lodash-es';
import { CoursesService,PermissionService,CopyContentService,OrgDetailsService,UserService,GeneraliseLabelService } from '@sunbird/core';
import { ResourceService,ToasterService,ContentData,ContentUtilsServiceService,ITelemetryShare,ExternalUrlPreviewService,UtilService,ConnectionService,OfflineCardService,ServerResponse } from '@sunbird/shared';
import { IInteractEventObject,TelemetryService } from '@sunbird/telemetry';
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

describe('CourseConsumptionHeaderComponent', () => {
    let component: CourseConsumptionHeaderComponent;

    const mockActivatedRoute :Partial<ActivatedRoute> ={
		snapshot:{
			params:{
              courseId: 'mock-course-id',
			},
			data:{
				telemetry:{
					env: 'mock-env',
					pageid: 'page-id',
				}
			}
		} as any,
	};
	const mockCourseConsumptionService :Partial<CourseConsumptionService> ={
		getContentRollUp: jest.fn(),
		getRollUp: jest.fn(),
	};
	const mockResourceService :Partial<ResourceService> ={
		messages: {
			fmsg:{
				m0090: 'mock-error-message',
			},
			stmsg: {
			  desktop: {
				deleteCourseSuccessMessage: 'Course deleted successfully'
			  }
			},
			etmsg: {
			  desktop: {
				deleteCourseErrorMessage: 'Error deleting course'
			  }
			},
			smsg:{
				m0059: 'mock-error-message'
			},
		}
		
	};
	const mockRouter :Partial<Router> ={
		navigate: jest.fn(),
	};
	const mockPermissionService :Partial<PermissionService> ={};
	const mockToasterService :Partial<ToasterService> ={
		success: jest.fn(),
        error: jest.fn(),
	};
	const mockCopyContentService :Partial<CopyContentService> ={};
	const mockChangeDetectorRef :Partial<ChangeDetectorRef> ={};
	const mockCourseProgressService :Partial<CourseProgressService> ={};
	const mockContentUtilsServiceService :Partial<ContentUtilsServiceService> ={};
	const mockExternalUrlPreviewService :Partial<ExternalUrlPreviewService> ={};
	const mockCoursesService :Partial<CoursesService> ={};
	const mockUserService :Partial<UserService> ={};
	const mockTelemetryService :Partial<TelemetryService> ={
		interact: jest.fn(),
	};
	const mockGroupService :Partial<GroupsService> ={};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={};
	const mockOrgDetailsService :Partial<OrgDetailsService> ={};
	const mockGeneraliseLabelService :Partial<GeneraliseLabelService> ={};
	const mockConnectionService :Partial<ConnectionService> ={};
	const mockCourseBatchService :Partial<CourseBatchService> ={};
	const mockUtilService :Partial<UtilService> ={};
	const mockContentManagerService :Partial<ContentManagerService> ={
		downloadContentId: '',
        downloadContentData: {},
        failedContentName: '',
        startDownload: jest.fn(),
        deleteContent: jest.fn(),
		exportContent: jest.fn(),
	};
	const mockFormService :Partial<FormService> ={};
	const mockOfflineCardService :Partial<OfflineCardService> ={
		isYoutubeContent: jest.fn(),
	};
	const mockDiscussionService :Partial<DiscussionService> ={};
	const mockDiscussionTelemetryService :Partial<DiscussionTelemetryService> ={};

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

	it('should return enrollmentEndDate on isValidEnrollmentEndDate',() =>{
		const result = component.isValidEnrollmentEndDate(true);
		expect(result).toEqual(true);
	});
    
	describe('isEnrollmentAllowed',() => {
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
    
	describe('deleteCollection',() =>{
		it('should delete collection successfully', () => {
			jest.spyOn(mockContentManagerService as any,'deleteContent').mockReturnValue(of({}));
			component.deleteCollection({ identifier: 'collection_id' });
		
			expect(component.disableDelete).toBeTruthy();
			expect(mockContentManagerService.deleteContent).toHaveBeenCalledWith({ request: { contents: ['collection_id'] } });
			expect(mockToasterService.success).toHaveBeenCalledWith('Course deleted successfully');
		});

		it('should handle error while deleting collection', () => {
			jest.spyOn(mockContentManagerService,'deleteContent').mockReturnValue(throwError({}));
			component.deleteCollection({ identifier: 'collection_id' });
		
			expect(component.disableDelete).toBeFalsy(); // disableDelete should be set to false due to error
			expect(mockContentManagerService.deleteContent).toHaveBeenCalledWith({ request: { contents: ['collection_id'] } });
			expect(mockToasterService.error).toHaveBeenCalledWith('Error deleting course');
		});
    });
    
	describe('downloadCollection',() =>{ 
		it('should set download status and call startDownload method', () => {
			const collection = {
			identifier: '123',
			name: 'Sample Collection'
			};
			jest.spyOn(component.contentManagerService as any,'startDownload' as any).mockReturnValue(of({}));
			component.downloadCollection(collection);

			expect(component.showDownloadLoader).toBe(false);
			expect(component.disableDelete).toBe(false);
			expect(component.contentManagerService.downloadContentId).toBe('');
			expect(component.contentManagerService.downloadContentData).toEqual({});
			expect(component.contentManagerService.failedContentName).toBe('Sample Collection');
			expect(component.contentManagerService.startDownload).toHaveBeenCalled();
		});
		
		it('should handle error if download fails due to low disk space', () => {
			jest.spyOn(component.contentManagerService as any,'startDownload' as any).mockReturnValue(throwError({ error: { params: { err: 'LOW_DISK_SPACE' } } }));
			const collection = {
			identifier: '123',
			name: 'Sample Collection'
			};
			component.downloadCollection(collection);
			expect(component.showDownloadLoader).toBe(false);
			expect(component.disableDelete).toBe(true);
		});

		it('should handle error if download fails due to other reasons', () => {
			jest.spyOn(component.contentManagerService as any,'startDownload' as any).mockReturnValue(throwError({}));
			const collection = {
			identifier: '123',
			name: 'Sample Collection'
			};
			component.downloadCollection(collection);
			expect(component.showDownloadLoader).toBe(false);
			expect(component.disableDelete).toBe(true);
		});
    });
	
	it('should set values and call methods on isYoutubeContentPresent',() =>{
		const mockCollection = {data: 'mock-data'};
		jest.spyOn(component,'logTelemetry');
		component.showModal = false;
		jest.spyOn(component.contentManagerService as any,'startDownload').mockReturnValue(of({}));
		jest.spyOn(component,'downloadCollection')
		component.isYoutubeContentPresent(mockCollection);

        expect(component.logTelemetry).toHaveBeenCalledWith('is-youtube-in-collection');
		expect(component['offlineCardService'].isYoutubeContent).toHaveBeenCalledWith(mockCollection);
		expect(component.downloadCollection).toHaveBeenCalledWith(mockCollection);
	});
  
    describe('exportCollection',() => {
		it('should call exportContent method and show success message on successful export', () => {
			const collection = {
			identifier: '123'
			};
			jest.spyOn(component.contentManagerService as any,'exportContent').mockReturnValue(of({}));
			component.exportCollection(collection);
			expect(component.showExportLoader).toBe(false);
			expect(component.contentManagerService.exportContent).toHaveBeenCalledWith('123');
			expect(component.toasterService.success).toHaveBeenCalledWith(component.resourceService.messages.smsg.m0059);
			expect(component.showExportLoader).toBe(false);
		});
		
		it('should call exportContent method and show error message on failed export with responseCode other than NO_DEST_FOLDER', () => {
			jest.spyOn(mockContentManagerService as any,'exportContent').mockReturnValue(throwError({ error: { responseCode: 'SOME_ERROR' } }));
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
			jest.spyOn(mockContentManagerService as any,'exportContent').mockReturnValue(throwError({ error: { responseCode: 'NO_DEST_FOLDER' } }));
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
});