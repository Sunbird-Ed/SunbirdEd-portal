import { PlayerService } from '@sunbird/core';
import { Component,Input,ViewChild,OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { _ } from 'lodash-es';
import { BehaviorSubject, fromEvent,of,Subject, throwError } from 'rxjs';
import { takeUntil,delay } from 'rxjs/operators';
import { GroupsService } from '../../../services/groups/groups.service';
import { ToasterService,ConfigService,ResourceService,LayoutService,ActivityDashboardService } from '../../../../shared/services';
import { CslFrameworkService } from '../../../../public/services/csl-framework/csl-framework.service';
import { ActivityListComponent } from './activity-list.component';

describe('ActivityListComponent', () => {
    let component: ActivityListComponent;

    const mockConfigService :Partial<ConfigService> ={
		appConfig: {
			SEARCH: {
			  PAGE_LIMIT: 1,
			},
			contentType: {
				Course: 'course',
				Courses: 'courses',
			},
		} 
	};
	const mockRouter :Partial<Router> ={};
	const mockActivateRoute :Partial<ActivatedRoute> ={};
	const mockResourceService :Partial<ResourceService> ={
		frmelmnts: {
			lbl: {
			  course: 'course', 
			  courses: 'courses'
			},
		},
		messages:{
			smsg:{
				activityRemove: 'Activity has been removed'
			}
		}
	};
	const mockGroupService :Partial<GroupsService> ={
		addTelemetry: jest.fn(),
		removeActivities: jest.fn(),
		emitMenuVisibility: jest.fn(),
	};
	const mockToasterService :Partial<ToasterService> ={
		success: jest.fn(),
		error: jest.fn()
	};
	const mockPlayerService :Partial<PlayerService> ={
		playContent: jest.fn(),
	};
	const mockLayoutService :Partial<LayoutService> ={
		initlayoutConfig: jest.fn(),
        switchableLayout: jest.fn(),
	};
	const mockActivityDashboardService :Partial<ActivityDashboardService> ={
		isActivityAdded: false,
	};
	const mockCslFrameworkService :Partial<CslFrameworkService> ={
		transformDataForCC: jest.fn(),
	};

    beforeAll(() => {
        component = new ActivityListComponent(
            mockConfigService as ConfigService,
			mockRouter as Router,
			mockActivateRoute as ActivatedRoute,
			mockResourceService as ResourceService,
			mockGroupService as GroupsService,
			mockToasterService as ToasterService,
			mockPlayerService as PlayerService,
			mockLayoutService as LayoutService,
			mockActivityDashboardService as ActivityDashboardService,
			mockCslFrameworkService as CslFrameworkService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should call addTelemetry method from group service',()=>{
		component.addTelemetry('mock-id');
		expect(component['groupService'].addTelemetry).toHaveBeenCalled();
	});

	describe('initLayout', () => {
		it('should call init Layout', () => {
		  mockLayoutService.switchableLayout = jest.fn(() => of([{ layout: 'mock-layout' }]));
		  component.initLayout();
		  mockLayoutService.switchableLayout().subscribe(layoutConfig => {
			expect(layoutConfig).toBeDefined();
			expect(component.layoutConfiguration).toEqual('mock-layout');
		  });
		});
	});

	describe('openActivity',()=>{
		it('should return if groupData is false',()=>{
			const mockEvent={data:{identifier: 'mock-identifier', primaryCategory: 'mock-category' }}
			component.groupData = {id: 'mock-id'};
			jest.spyOn(component,'addTelemetry');
			component.openActivity(mockEvent, 'mock-activity')
			expect(component.addTelemetry).toHaveBeenCalledWith('activity-suspend-card', [], {},
				{id: 'mock-identifier', type: 'mock-category',  ver: '1.0'});
	   });

	   it('should return if groupData is false',()=>{
			const mockEvent={data:{identifier: 'mock-identifier', primaryCategory: 'mock-category', resourceType: 'mock-resource' }}
			component.groupData = {id: 'mock-id', active: true};
			jest.spyOn(component,'addTelemetry');
			component.openActivity(mockEvent, 'mock-activity')
			expect(component.addTelemetry).toHaveBeenCalledWith('activity-card',
				[{id: 'mock-identifier', type: 'mock-resource'}]);
			expect(component.activityDashboardService.isActivityAdded).toBe(true);
			expect(component['playerService'].playContent).toHaveBeenCalled();
       });
	});

	it('should call getMenuData method',()=>{
		const mockEvent = { data: 'mock-data' }
		component.showMenu = false;
		jest.spyOn(component,'addTelemetry');
		component.getMenuData(mockEvent);
		expect(component.showMenu).toBeTruthy;
		expect(component['groupService'].emitMenuVisibility).toHaveBeenCalledWith('activity');
		expect(component.selectedActivity).toEqual('mock-data');
		expect(component.addTelemetry).toHaveBeenCalled();
	})
    
	describe('getTitle',()=>{
		it('should return name',()=>{
		const result = component.getTitle('course');
		expect(result).toBe('course');
		});

		it('should return title',()=>{
			const result = component.getTitle('mock-title');
			expect(result).toBe('mock-title');
		}); 
    });
    
	describe('toggleModal',()=>{
		it('should call addTelemetry when show is true',()=>{
			component.selectedActivity = {name:'mock-name',identifier: 'mock-identifier',appIcon: 'mock-icon',
			organisation: ['mock-org'], subject: 'mock-subject',type: 'mock-type' }
			const telemetrySpy =jest.spyOn(component, 'addTelemetry');
			component.toggleModal(true);
		
			expect(telemetrySpy).toHaveBeenCalledWith(
			'remove-activity-kebab-menu-btn',[],{},
			{
				id: 'mock-identifier',
				type: undefined,
				ver: '1.0',
			}
			);
			expect(component.showModal).toBe(true);
		});

		it('should call addTelemetry when show is false',()=>{
			component.selectedActivity = {name:'mock-name',identifier: 'mock-identifier',appIcon: 'mock-icon',
			organisation: ['mock-org'], subject: 'mock-subject',type: 'mock-type' }
			const telemetrySpy =jest.spyOn(component, 'addTelemetry');
			component.toggleModal(false);
		
			expect(telemetrySpy).toHaveBeenCalledWith(
			'close-remove-activity-popup',[],{},
			{
				id: 'mock-identifier',
				type: undefined,
				ver: '1.0',
			}
			);
			expect(component.showModal).toBe(false);
		});
    });

	it('should remove activity successfully and show success toaster', () => {
		const mockResponse = {activity: 'mock-activity'};
		component.groupData ={id: 'mock-id'};
		component.selectedActivity = {name:'mock-name',identifier: 'mock-identifier',appIcon: 'mock-icon',
		organisation: ['mock-org'], subject: 'mock-subject',type: 'mock-type' }
		jest.spyOn(component['groupService'], 'removeActivities').mockReturnValue(of(mockResponse));
		jest.spyOn(component['toasterService'], 'success');
	    const toggleSpy = jest.spyOn(component, 'toggleModal');

		component.removeActivity();
		const activityIds = [component.selectedActivity.identifier];
		component['groupService'].removeActivities(component.groupData.id, {activityIds} )
         .subscribe(response => {
			expect(component.showLoader).toBe(false);
			expect(component['toasterService'].success).toHaveBeenCalledWith(mockResourceService.messages.smsg.activityRemove);
			expect(component.activityList.someCategory.length).toBe(0);
		});
		expect(toggleSpy).toHaveBeenCalled();
	});

	it('should remove activity successfully and show success toaster', () => {
		component.groupData ={id: 'mock-id'};
		component.selectedActivity = {name:'mock-name',identifier: 'mock-identifier',appIcon: 'mock-icon',
		organisation: ['mock-org'], subject: 'mock-subject',type: 'mock-type' }
		jest.spyOn(component['groupService'], 'removeActivities').mockReturnValue(throwError('mock error'));
		jest.spyOn(component['toasterService'], 'success');

		component.removeActivity();
		const activityIds = [component.selectedActivity.identifier];
		component['groupService'].removeActivities(component.groupData.id, {activityIds} )
         .subscribe(response => {
			expect(component.showLoader).toBe(false);
			expect(component['toasterService'].error).toHaveBeenCalledWith(mockResourceService.messages.smsg.activityRemove);
		});
	});
    
	describe('toggleViewAll',() =>{
		it('should return the type from activitylist when type param is present', () => {
			component.activityList ={activity: 'mock-activity' }
			component.toggleViewAll(true,'activity')
			expect(component.disableViewAllMode).toBeTruthy;
			expect(component.selectedTypeContents).toEqual({"activity": "mock-activity"});
		});

		it('should empty list when type param is not present', () => {
			component.toggleViewAll(false);
			expect(component.disableViewAllMode).toBeFalsy;
			expect(component.selectedTypeContents).toEqual({});
		});
	});
    
	describe('isCourse',()=>{
		it('should return true when type matches Course in lbl', () => {
			const result = component.isCourse('course');
			expect(result).toBe(true);
		});
	
		it('should return true when type matches Courses in lbl', () => {
		const result = component.isCourse('courses');
		expect(result).toBe(true);
		});

		it('should return false when type does not match Course or Courses in lbl or configService', () => {
		const result = component.isCourse('mock-type');
		expect(result).toBe(false);
		});
	});

    describe('viewSelectedType',() =>{
		it('should return true when selectedTypeContents is empty and list length is less than or equal to 3', () => {
			component.selectedTypeContents = {};
			const result = component.viewSelectedTypeContents('type', ['mock-data1'], 0);
			expect(result).toBe(true);
		});
	
		it('should return true when selectedTypeContents is empty and list length is greater than 3 and index is less than or equal to 2', () => {
		component.selectedTypeContents = {};
		const result = component.viewSelectedTypeContents('type', ['mock-data1','mock-data2','mock-data3','mock-data4'], 2);
		expect(result).toBe(true);
		});
	
		it('should return false when selectedTypeContents is empty and list length is greater than 3 and index is greater than 2', () => {
		component.selectedTypeContents = {};
		const result = component.viewSelectedTypeContents('type',['mock-data1','mock-data2','mock-data3','mock-data4'], 3);
		expect(result).toBe(false);
		});
	
		it('should return true when type exists in selectedTypeContents', () => {
		component.selectedTypeContents = { type: 'mock-type'};
		const result = component.viewSelectedTypeContents('type', ['mock-data1'], 0);
		expect(result).toBe(true);
		});
	
		it('should return false when type does not exist in selectedTypeContents', () => {
		component.selectedTypeContents = {type: 'mock-type'};
		const result = component.viewSelectedTypeContents('type1',['mock-data1'], 0);
		expect(result).toBe(false);
		});
	});

	describe('isSelectedType',() =>{
		it('should return true when selectedTypeContents is empty', () => {
			component.selectedTypeContents = {};
			const result = component.isSelectedType('type');
			expect(result).toBe(true);
		});
		
		it('should return true when type exists in selectedTypeContents', () => {
			component.selectedTypeContents = { type: 'mock-type'};
			const result = component.isSelectedType('type');
			expect(result).toBe(true);
		});
		
		it('should return false when type does not exist in selectedTypeContents', () => {
			component.selectedTypeContents = { someType: 'mock-type' };
			const result = component.isSelectedType('type');
			expect(result).toBe(false);
		});
    });

	it('should destroy the activity list', () => {
		component.unsubscribe$ = {
			next: jest.fn(),
			complete: jest.fn()
		} as any;
		component.modal ={
			deny: jest.fn()
		} as any;
		component.showModal = true;

		component.ngOnDestroy();
		expect(component.unsubscribe$.next).toHaveBeenCalled();
		expect(component.unsubscribe$.complete).toHaveBeenCalled();
		expect(component.modal.deny).toHaveBeenCalled();
	});
});