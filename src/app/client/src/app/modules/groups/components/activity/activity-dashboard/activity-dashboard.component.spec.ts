import { Component,OnInit } from '@angular/core';
import { GroupsService } from '../../../services';
import { ToasterService,ResourceService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { Router,ActivatedRoute } from '@angular/router';
import { MY_GROUPS,GROUP_DETAILS } from '../../../interfaces/routerLinks';
import { ActivityDashboardComponent } from './activity-dashboard.component';
import { of, throwError } from 'rxjs';

describe('ActivityDashboardComponent', () => {
    let component: ActivityDashboardComponent;

    const mockGroupService :Partial<GroupsService> ={
        getActivity: jest.fn(),
        getDashletData: jest.fn(),
        addTelemetry: jest.fn(),
        groupData: {
            id: '1'
        } as any,
    };
	const mockToasterService :Partial<ToasterService> ={
        error: jest.fn(),
    };
	const mockResourceService :Partial<ResourceService> ={
        messages: {
            emsg: {
              m0005: 'Something went wrong',
            }
        },
    };
	const mockRouter :Partial<Router> ={
        getCurrentNavigation: jest.fn(),
        navigate: jest.fn()
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
            params:{
              groupId: 'mock-groupid',
              activityId: 'mock-activityId',
            },
            data: {
                telemetry: {
                  env: 'certs',
                  pageid: 'certificate-configuration',
                  type: 'view',
                  subtype: 'paginate',
                  ver: '1.0'
                }
            }
        } as any
    };

    beforeAll(() => {
        component = new ActivityDashboardComponent(
            mockGroupService as GroupsService,
			mockToasterService as ToasterService,
			mockResourceService as ResourceService,
			mockRouter as Router,
			mockActivatedRoute as ActivatedRoute
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set group data and call getAggData', () => {
            jest.spyOn(component['groupService'], 'getActivity').mockReturnValue(of({}));
            jest.spyOn(component, 'getAggData');
            component.ngOnInit();
            expect(component.groupData).toEqual({"id": "1"});
            expect(component.getAggData).toHaveBeenCalled();
        });

        it('should navigate back if group data is undefined', () => {
            mockGroupService.groupData = undefined;
            jest.spyOn(component['groupService'], 'getActivity').mockReturnValue(of({}));
            jest.spyOn(component, 'getAggData');
            jest.spyOn(component, 'navigateBack');
            component.ngOnInit();
            expect(component.navigateBack).toHaveBeenCalled();
            expect(component.getAggData).toHaveBeenCalled();
        });
    });

    describe('getDashletData', () => {
        it('should call getDashletData from groupservice and return data', () => {
            component.hierarchyData={children:'mock-children'};
            component.activity = 'mock-activity';
            jest.spyOn(component['groupService'],'getDashletData').mockReturnValue(of({data: 'mock-data'}));
            component.getDashletData();
            expect(component['groupService'].getDashletData).toHaveBeenCalled();
            expect(component.dashletData).toEqual({data: 'mock-data'});
        });

        it('should handle error case',()=>{
            component.hierarchyData={children:'mock-children'};
            component.activity = 'mock-activity';
            jest.spyOn(component['groupService'],'getDashletData').mockReturnValue(throwError('No mock Data is sent'));
            component.getDashletData();
            expect(component['groupService'].getDashletData).toHaveBeenCalled();
        });
    });

    describe('addTelemetry', () => {
        it('should call addtelemetry method with object and other params', () => {
            component.addTelemetry();
            expect(component['groupService'].addTelemetry).toHaveBeenCalledWith({ id: 'download-csv', extra: {} },
            component.activatedRoute.snapshot, [],'mock-groupid',{"id": "mock-activityId", "type": "course"});
        });
    });   
});