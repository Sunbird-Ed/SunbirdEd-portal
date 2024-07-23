import { GroupEntityStatus,CsGroup } from '@project-sunbird/client-services/models/group';
import { UserService } from '@sunbird/core';
import { Component,OnDestroy,OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ResourceService,ToasterService,LayoutService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { Subject, of, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupsService } from '../../services';
import { IGroupMemberConfig,IGroupCard,IGroupMember,ADD_ACTIVITY_CONTENT_TYPES } from '../../interfaces';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { ADD_ACTIVITY,PAGE_LOADED } from '../../interfaces/telemetryConstants';
import { sessionKeys } from '../../../../modules/groups/interfaces/group';
import { GroupDetailsComponent } from './group-details.component';
import { visibility } from 'html2canvas/dist/types/css/property-descriptors/visibility';

describe('GroupDetailsComponent', () => {
    let component: GroupDetailsComponent;

    const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot:{
            params:{
                groupId: 'mock-group-id'
            }
        } as any,
    };
	const mockGroupService :Partial<GroupsService> ={
        emitActivateEvent: jest.fn(),
        addTelemetry: jest.fn(),
        getGroupById: jest.fn(),
        goBack: jest.fn(),
        groupData: null,
        addGroupFields: jest.fn(),
        addFieldsToMember: jest.fn(),
        isCurrentUserAdmin: false,
        groupContentsByActivityType: jest.fn().mockReturnValue({ showList: true, activities: [] }),
        closeForm: new Subject<void>() as any,
        updateEvent:  new Subject<void>() as any,
        getImpressionObject: jest.fn(),
        updateGroupStatus: jest.fn(),
    };
	const mockToasterService :Partial<ToasterService> ={
        error: jest.fn()
    };
	const mockRouter :Partial<Router> ={
        navigate: jest.fn(),
    };
	const mockResourceService :Partial<ResourceService> ={};
	const mockUserService :Partial<UserService> ={
        userid: 'mock-user-id'
    };
	const mockLayoutService :Partial<LayoutService> ={
        initlayoutConfig: jest.fn().mockReturnValue({}),
        switchableLayout: jest.fn().mockReturnValue(of({ layout: {} }))
    };

    beforeAll(() => {
        component = new GroupDetailsComponent(
            mockActivatedRoute as ActivatedRoute,
			mockGroupService as GroupsService,
			mockToasterService as ToasterService,
			mockRouter as Router,
			mockResourceService as ResourceService,
			mockUserService as UserService,
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

    it('should destroy the group details', () => {
        component.unsubscribe$ ={
           next: jest.fn(),
           complete: jest.fn(),
        }as any;
        component.showModal = true;
        component.addActivityModal ={
			deny: jest.fn(),
		} as any;
		component.ngOnDestroy();

        expect(component.unsubscribe$.next).toHaveBeenCalled();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
		expect(component.addActivityModal.deny).toHaveBeenCalled();
	});

    it('should call emitActivateEvent on handleEvent', () => {
        component.handleEvent();
        expect(component['groupService'].emitActivateEvent).toHaveBeenCalledWith('activate', 'activate-group');
	});

    it('should set showMemberPopup on toggleFtuModal', () => {
        component.toggleFtuModal(false);
        expect(component.showMemberPopup).toBeFalsy;
	});

    it('should call groupservice on addTelemetry', () => {
        component.addTelemetry('mock-id','mock-extra','mock-edata');
        expect(component['groupService'].addTelemetry).toHaveBeenCalled();
	});

    it('should call router-navigate on navigateToAddActivity', () => {
       component.groupData = {members: 'mock-members'} as any;
       component.navigateToAddActivity();
       expect(component['router'].navigate).toHaveBeenCalled();
    });

    it('should set showFilters on filterList', () => {
        component.filterList();
        expect(component.showFilters).toBeTruthy;
	});

    it('should set showModal on toggleActivityModal', () => {
        component.toggleActivityModal(false);
        expect(component.showModal).toBeFalsy;
	});

    describe('getGroupData',() => {
        it('should set loader to true and fetch group data successfully', () => {
            component['groupId'] = 'mock-group-id';
            component.unsubscribe$ = new Subject<void>();
        
            const mockGroupData = { members: [], status: 'active' };
            const mockResponse = { showList: false, activities: [] };
            jest.spyOn(Storage.prototype, 'setItem');
            jest.spyOn(component['groupService'],'getGroupById').mockReturnValue(of(mockGroupData));
        
            component.getGroupData();
        
            expect(component.isLoader).toBeTruthy();
            expect(mockGroupService.getGroupById).toHaveBeenCalledWith('mock-group-id', true, true, true);

            expect(mockGroupService.groupData).toEqual(mockGroupData);
            expect(sessionStorage.setItem).toHaveBeenCalled();
            expect(mockGroupService.addGroupFields).toHaveBeenCalledWith(mockGroupData);
            expect(component.isAdmin).toBeFalsy();
            expect(component.isLoader).toBeTruthy();
            expect(component.showActivityList).toEqual(mockResponse.showList);
            expect(component.activityList).toBe(undefined);
        });

        it('should handle error if group data retrieval fails', () => {
            component['groupId'] = 'testGroupId';
            component.unsubscribe$ = new Subject<void>();
        
            jest.spyOn(component['groupService'],'getGroupById').mockReturnValue(throwError('Error'));
        
            component.getGroupData();
        
            expect(component.isLoader).toBeFalsy();
            expect(mockGroupService.goBack).toHaveBeenCalled();
        });
    });

    it('should initialize layout configuration', () => {
        component.unsubscribe$ = new Subject<void>();
        jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({layout: {}}));
        component.initLayout();
    
        expect(mockLayoutService.initlayoutConfig).toHaveBeenCalled();
        expect(component.layoutConfiguration).toEqual({});
    });

    it('should call methods and set values on ngOninit', () => {
        component.unsubscribe$ = new Subject<void>();
        const mockGroupData = { members: [], status: 'active' };
        jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({layout: {}}));
        jest.spyOn(component,'initLayout');
        jest.spyOn(component['groupService'],'getGroupById').mockReturnValue(of(mockGroupData));
        jest.spyOn(component,'getGroupData');

        component.ngOnInit();
        expect(component.initLayout).toHaveBeenCalled();
        expect(component['groupId']).toEqual('mock-group-id');
        expect(component.getGroupData).toHaveBeenCalled();
        expect(component['groupService'].getImpressionObject).toHaveBeenCalled();
    });
 
});