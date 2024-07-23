import { GroupEntityStatus } from '@project-sunbird/client-services/models/group';
import { actions } from './../../interfaces/group';
import { Router,ActivatedRoute } from '@angular/router';
import { Component,ViewChild,Input,Renderer2,OnInit,OnDestroy,Output,EventEmitter } from '@angular/core';
import { ResourceService,NavigationHelperService,ToasterService,LayoutService } from '@sunbird/shared';
import { MY_GROUPS,GROUP_DETAILS,IGroupCard,IFetchForumId,EDIT_GROUP,IFetchForumConfig } from './../../interfaces';
import { GroupsService } from '../../services';
import { _ } from 'lodash-es';
import { Subject, of, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@sunbird/core';
import { DiscussionService } from '../../../discussion/services/discussion/discussion.service';
import { DiscussionTelemetryService } from '../../../shared/services/discussion-telemetry/discussion-telemetry.service';
import { UPDATE_GROUP,SELECT_DELETE,SELECT_DEACTIVATE,SELECT_NO,DELETE_SUCCESS } from '../../interfaces/telemetryConstants';
import { GroupHeaderComponent } from './group-header.component';

describe('GroupHeaderComponent', () => {
    let component: GroupHeaderComponent;

    const mockRenderer :Partial<Renderer2> ={
		listen: jest.fn(),
	};
	const mockResourceService :Partial<ResourceService> ={
		messages:{
			imsg:{
              m0082: 'mock-message',
			},
			emsg:{
				m0005: 'Mock Error Message',
			}
		},
		frmelmnts:{
			lbl:{
				deleteGroup: 'mock-delete-group',
				deactivategrpques: 'mock-deactivate-request',
				activategrpques: 'mock-activate-request',	
			},
			msg:{
				deactivategrpmsg: 'mock-deactivate-msg',
				activategrppopup: 'mock-activate-grp-popup'
			}
		}
	};
	const mockRouter :Partial<Router> ={
		navigate: jest.fn(),
	};
	const mockGroupService :Partial<GroupsService> ={
		addTelemetry: jest.fn(),
		activateGroupById: jest.fn(),
		deleteGroupById: jest.fn() as any,
		emitMenuVisibility:jest.fn(),
		updateGroupStatus: jest.fn(),
	};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={
		goBack: jest.fn(),
	};
	const mockToasterService :Partial<ToasterService> ={
		success: jest.fn(),
		error: jest.fn(),
	};
	const mockActivatedRoute :Partial<ActivatedRoute> ={};
	const mockUserService :Partial<UserService> ={};
	const mockDiscussionService :Partial<DiscussionService> ={
		createForum: jest.fn(),
		removeForum: jest.fn(),
		getForumIds: jest.fn(),
		fetchForumConfig: jest.fn(),
	};
	const mockDiscussionTelemetryService :Partial<DiscussionTelemetryService> ={};
	const mockActivateRoute :Partial<ActivatedRoute> ={};
	const mockLayoutService :Partial<LayoutService> ={};

    beforeAll(() => {
        component = new GroupHeaderComponent(
            mockRenderer as Renderer2,
			mockResourceService as ResourceService,
			mockRouter as Router,
			mockGroupService as GroupsService,
			mockNavigationHelperService as NavigationHelperService,
			mockToasterService as ToasterService,
			mockActivatedRoute as ActivatedRoute,
			mockUserService as UserService,
			mockDiscussionService as DiscussionService,
			mockDiscussionTelemetryService as DiscussionTelemetryService,
			mockActivateRoute as ActivatedRoute,
			mockLayoutService as LayoutService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should destroy the member', () => {
		component['unsubscribe$'] = {
			next: jest.fn(),
			complete: jest.fn()
		} as any;
		component.ngOnDestroy();
		expect(component['unsubscribe$'].next).toHaveBeenCalled();
		expect(component['unsubscribe$'].complete).toHaveBeenCalled();
	});
    
    it('should call router navigate on assignForumData', () => {
		const mockRouterData = {forumIds: 'mock-forum-id', userId: 'mock-user-id'};
		component.assignForumData(mockRouterData);

		expect(component['router'].navigate).toHaveBeenCalledWith(
			['/discussion-forum'], {
				queryParams: {
				  categories: JSON.stringify({ result: mockRouterData.forumIds }),
				  userId: mockRouterData.userId
				}
			}
		);
	});
    
	describe('enableDiscussionForum',() =>{
		it('should call methods and set values when discussionService.createForum returns response', () => {
			component.groupData = {id: 'mock-id'} as any;
			const addTelemetryMock = jest.spyOn(component,'addTelemetry');
			const fetchForumMock = jest.spyOn(component,'fetchForumIds');
			jest.spyOn(component['discussionService'],'createForum').mockReturnValue(of({}));
			component.enableDiscussionForum();
		
			expect(addTelemetryMock).toHaveBeenCalled();
			expect(component.showLoader).toBeFalsy;
			expect(component['toasterService'].success).toHaveBeenCalledWith('Enabled discussion forum successfully');
			expect(fetchForumMock).toHaveBeenCalledWith(component.groupData.id);
		});
		
		it('should handle error from discussionService.createForum ', () => {
			jest.spyOn(component['discussionService'],'createForum').mockReturnValue(throwError('No response is received'));
			component.enableDiscussionForum();

			expect(component.showLoader).toBeFalsy;
			expect(component['toasterService'].error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005);
		});
    });
    
	describe('disableDiscussionForum',() =>{
		it('should call methods and set values when when discussionService.removeForum returns response', () => {
			component.groupData = {id: 'mock-id'} as any;
			const fetchForumMock = jest.spyOn(component,'fetchForumIds');
			jest.spyOn(component['discussionService'],'removeForum').mockReturnValue(of({}));
			component.disableDiscussionForum();

			expect(component.addTelemetry).toHaveBeenCalled();
			expect(component['discussionService'].removeForum).toHaveBeenCalled();
			expect(component.showLoader).toBeFalsy;
			expect(component['toasterService'].success).toHaveBeenCalledWith('Disabled discussion forum successfully');
			expect(fetchForumMock).toHaveBeenCalledWith(component.groupData.id);
		});

		it('should handle error from discussionService.removeForum', () => {
			jest.spyOn(component['discussionService'],'removeForum').mockReturnValue(throwError('No response is received'));
			component.disableDiscussionForum();

			expect(component.showLoader).toBeFalsy;
			expect(component['toasterService'].error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005);
		});
    });
    
	it('should fetch forum IDs successfully', () => {
		const forumDetails = { result: [] };
		jest.spyOn(component['discussionService'],'getForumIds').mockReturnValue(of(forumDetails));
		component.fetchForumIds('mock-groupId');

		expect(component.forumIds).toEqual([]);
	});
	
	describe('fetchForumConfig',() =>{
		it('should set values on fetchForumConfig when discussionService returns response',()=>{
			component.fetchForumConfigReq = 'mock-forum-config' as any;
			const mockFormData = [{category:{context: 'mock-context'}}];
			jest.spyOn(component['discussionService'],'fetchForumConfig').mockReturnValue(of(mockFormData));
			component.fetchForumConfig();

			expect(component.fetchForumConfigReq).toEqual(
				[{
					type: 'group',
					identifier: component.groupData.id
				}]
			);
			expect(component['discussionService'].fetchForumConfig).toHaveBeenCalled();
			expect(component.createForumRequest).toEqual(
				{"category": {"context": [{"identifier": "mock-id", 
				"type": "group"}]}}
			);
		});

		it('should handle error from discussionService.fetchForumConfig', () => {
			jest.spyOn(component['discussionService'],'fetchForumConfig').mockReturnValue(throwError('No response is received'));
			component.fetchForumConfig();

			expect(component['toasterService'].error).toHaveBeenCalled();
		});
    });
    
	describe('handleEvent',()=>{
		it('should set showModal and showLoader correctly', () => {
			component.groupData = {id: 'mock-id', status: 'mock-status'} as any;
			component.handleEvent({ name: 'mock-action', action: false });
		
			expect(component.showModal).toBeFalsy;
			expect(component.showLoader).toBeFalsy;
			expect(component.addTelemetry).toHaveBeenCalledWith(
				"cancel-mock-action-group", {
				status: "mock-status",
			}, { type:  "select-no", });
		});

		it('should call appropriate method based on event name', () => {
			jest.spyOn(component,'deleteGroup');
			jest.spyOn(component,'deActivateGroup');
			jest.spyOn(component,'activateGroup');
			jest.spyOn(component,'disableDiscussionForum');
			jest.spyOn(mockGroupService,'deleteGroupById').mockReturnValue(of({}));
			jest.spyOn(component['discussionService'],'removeForum').mockReturnValue(of({}));
		
			component.handleEvent({ name: actions.DISABLE_FORUM, action: true });
			expect(component.disableDiscussionForum).toHaveBeenCalled();
		});
    });
    
	describe('assignModalStrings',()=>{
		it('should replace message when replacestr is present',() =>{
			component.groupData = {id: 'mock-id', status: 'mock-status', name: 'replaced'} as any;
			component.assignModalStrings('mock-title','mock-original-msg','original');

			expect(component.title).toEqual('mock-title');
			expect(component.msg).toEqual('mock-replaced-msg');
		});

		it('should set the original message when replacestr is not present',() =>{
			component.assignModalStrings('mock-title','mock-default-msg');
			expect(component.msg).toEqual('mock-default-msg');
		});
    });
    
	describe('toggleModal',() =>{
		it('should call emitMenuVisibility and set showModal and name correctly', () => {
			component.toggleModal(false,'mock-name');

			expect(component.showModal).toBeFalsy;
			expect(component['groupService'].emitMenuVisibility).toHaveBeenCalledWith('group');
			expect(component.name).toEqual('mock-name');
		});

		it('should call appropriate methods when name has action delete', () => {
			const assignModalSpy = jest.spyOn(component,'assignModalStrings');
			component.toggleModal(false,actions.DELETE);

			expect(component.addTelemetry).toHaveBeenCalledWith(
				"delete-group", {"status": "mock-status"}, 
				{"type": "select-delete"}
			);
			expect(assignModalSpy).toHaveBeenCalledWith("mock-delete-group", "mock-message", "{groupName}");
		});
		
		it('should call appropriate methods when name has action deactivate', () => {
			const assignModalSpy = jest.spyOn(component,'assignModalStrings');
			component.toggleModal(false,actions.DEACTIVATE);

			expect(component.addTelemetry).toHaveBeenCalledWith(
				"deactivate-group", {"status": "mock-status"}, 
				{"type": "select-deactivate"}
			);
			expect(assignModalSpy).toHaveBeenCalledWith("mock-deactivate-request", "mock-deactivate-msg");
		});

		it('should call appropriate methods when name has action activate', () => {
			const assignModalSpy = jest.spyOn(component,'assignModalStrings');
			component.toggleModal(false,actions.ACTIVATE);
			
			expect(component.addTelemetry).toHaveBeenCalledWith("activate-group-menu", {"status": "mock-status"});
			expect(assignModalSpy).toHaveBeenCalledWith("mock-activate-request", "mock-activate-grp-popup");
		});
		
		it('should call appropriate methods when name has action disable_forum', () => {
			const assignModalSpy = jest.spyOn(component,'assignModalStrings');
			component.toggleModal(false,actions.DISABLE_FORUM);

			expect(component.addTelemetry).toHaveBeenCalledWith("disable-discussion-forum", {"status": "mock-status"});
			expect(assignModalSpy).toHaveBeenCalledWith('Disable discussion forum ?', 'Disabling forum will remove all the discussion. Do you want to continue');
		});
    });

    it('should emit visiblity on toggleFtuModal',() =>{
		 jest.spyOn(component.handleFtuModal,'emit');
         component.toggleFtuModal(false);

		 expect(component.handleFtuModal.emit).toHaveBeenCalledWith(false);
	});

	it('should reverse the boolean value of dropdownContent on dropdownMenu',()=>{
	   component.dropdownContent = false;
       component.dropdownMenu();

	   expect(component.dropdownContent).toBeTruthy;
	});
     
	it('should call navigation method on goback',() =>{
       component.goBack();
	   expect(component['navigationHelperService'].goBack).toHaveBeenCalled();
	});
    
	it('should call router navigate on editGroup',()=>{
       component.editGroup();
	   expect(component['router'].navigate).toHaveBeenCalled();
	});

	it('should set showLoader and goBack on navigateToPreviousPage',() =>{
	  const goBackSpy = jest.spyOn(component,'goBack');
      component.navigateToPreviousPage();
      
	  setTimeout(() => {
		expect(component.showLoader).toBeFalsy;
        expect(goBackSpy).toHaveBeenCalled();
	  });
	});
});