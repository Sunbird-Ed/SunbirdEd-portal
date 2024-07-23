import { Directive,ElementRef,HostListener,Input,OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ACTIVITY_DASHBOARD,GROUP_DETAILS,MY_GROUPS } from '../../interfaces';
import { GroupsService } from '../../services/groups/groups.service';
import { ActivityDashboardService } from '../../../shared/services/activity-dashboard/activity-dashboard.service';
import { ActivityDashboardDirective } from './activity-dashbord.directive';

describe('ActivityDashboardDirective', () => {
    let activityDirective: ActivityDashboardDirective;

    const mockRouter :Partial<Router> ={
        navigate: jest.fn(),
    };
	const mockGroupService :Partial<GroupsService> ={
        addTelemetry: jest.fn(),
        groupData: {id: 'mock-id'} as any,
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot:{
            queryParams:{
                param: 'mock-param',
            }
        } as any,
    };
	const mockRef :Partial<ElementRef> ={
        nativeElement: document.createElement('button'),
    };
	const mockActivityDashboardService :Partial<ActivityDashboardService> ={
        isActivityAdded: true,
    };

    beforeAll(() => {
        activityDirective = new ActivityDashboardDirective(
            mockRouter as Router,
			mockGroupService as GroupsService,
			mockActivatedRoute as ActivatedRoute,
			mockRef as ElementRef,
			mockActivityDashboardService as ActivityDashboardService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of activityDirective', () => {
        expect(activityDirective).toBeTruthy();
    });
    
    it('should call groupservice on addTelemetry',() =>{
        mockGroupService.groupData = {id: 'mock-id'} as any;
        activityDirective.addTelemetry('mock-id','mock-cdata','mock-extra','mock-obj');

        expect(activityDirective.groupService.addTelemetry).toHaveBeenCalledWith(
            {"extra": "mock-extra", "id": "mock-id"}, {"queryParams": 
            {"param": "mock-param"}}, "mock-cdata", "mock-id", "mock-obj"
        );
    });

    it('should call methods on navigateToActivityDashboard',() =>{
        const addTelemetrySpy = jest.spyOn(activityDirective,'addTelemetry');
        activityDirective.hierarchyData ={identifier: 'mock-id',primaryCategory: 'mock-category'};
        activityDirective.navigateToActivityDashboard();

        expect(addTelemetrySpy).toHaveBeenCalledWith(
            "activity-detail", [{"id": "mock-id", 
            "type": "mock-category"}]
        );
        expect(activityDirective.router.navigate).toHaveBeenCalledWith(
            ["my-groups/group-details", "mock-id", "activity-dashboard", 
            "mock-id"], {"state": {"hierarchyData": {"identifier": "mock-id", 
            "primaryCategory": "mock-category"}}}
        );
    });
    
    describe('ngOnInit',() =>{
        it('should set style display to block when isActivityAdded is true', () => {
            activityDirective.ngOnInit();
            expect(mockRef.nativeElement.style.display).toBe('block');
        });

        it('should set style display to none when isActivityAdded is false', () => {
            mockActivityDashboardService.isActivityAdded = false;
            activityDirective.ngOnInit();
            expect(mockRef.nativeElement.style.display).toBe('none');
        });
    });
    
    it('should call navigateToActivityDashboard on click', () => {
        activityDirective.navigateToActivityDashboard = jest.fn();
        const eventMock = {};
        activityDirective.onClick(eventMock);
        expect(activityDirective.navigateToActivityDashboard).toHaveBeenCalled();
    });
});