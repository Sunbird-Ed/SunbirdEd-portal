import { Component,OnInit,AfterViewInit,OnDestroy } from '@angular/core';
import { GroupsService } from '../../../services';
import { ResourceService,ToasterService,NavigationHelperService,LayoutService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { ActivatedRoute,Router } from '@angular/router';
import { ADD_ACTIVITY_TO_GROUP } from '../../../interfaces';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { CsGroupSupportedActivitiesFormField } from '@project-sunbird/client-services/services/group/interface';
import { TelemetryService,IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Subject, of, throwError } from 'rxjs';
import { CONTENT_CATEGORIES,SELECT_CATEGORY } from '../../../interfaces/telemetryConstants';
import { AddActivityContentTypesComponent } from './add-activity-content-types.component';

describe('AddActivityContentTypesComponent', () => {
    let component: AddActivityContentTypesComponent;

    const mockGroupService :Partial<GroupsService> ={
        groupData:{id: 'mock-group-id'} as any,
        getSupportedActivityList: jest.fn(),
        getSelectedLanguageStrings: jest.fn(),
    };
	const mockResourceService :Partial<ResourceService> ={};
	const mockToasterService :Partial<ToasterService> ={
        error: jest.fn(),
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
            data: {
                telemetry: {
                  env: 'mock-env',
                  pageid: 'mock-page-id',
                  type: 'mock-event-type',
                  subtype: 'mock-sub-type',
                }
            }
        } as any,
        queryParams: of({groupName:'test',
        createdBy:'test'}),

    };
	const mockRouter :Partial<Router> ={
        url: '/mock-url',
        navigate: jest.fn(),
    };
	const mockNavigationHelperService :Partial<NavigationHelperService> ={
        getPageLoadTime: jest.fn().mockReturnValue('1ms'),
        setNavigationUrl: jest.fn(),
    };
	const mockTelemetryService :Partial<TelemetryService> ={
        impression: jest.fn(),
        interact: jest.fn(),
    };
	const mockLayoutService :Partial<LayoutService> ={
        initlayoutConfig: jest.fn(),
        switchableLayout: jest.fn(),
    };

    beforeAll(() => {
        component = new AddActivityContentTypesComponent(
            mockGroupService as GroupsService,
			mockResourceService as ResourceService,
			mockToasterService as ToasterService,
			mockActivatedRoute as ActivatedRoute,
			mockRouter as Router,
			mockNavigationHelperService as NavigationHelperService,
			mockTelemetryService as TelemetryService,
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

    it('should call ngOnInit', () => {
        mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
        mockGroupService.getSupportedActivityList = jest.fn(() => of([{ data: '' }]));
        component.ngOnInit()
        expect(mockLayoutService.switchableLayout).toHaveBeenCalled();
    });

    it('should destroy activity-content', () => {
        component.unsubscribe$ = {
            next: jest.fn(),
            complete: jest.fn()
        } as any;
        component.ngOnDestroy();
        expect(component.unsubscribe$.next).toHaveBeenCalled();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
    });

    it('should set telemetry impression data with provided edata', () => {
        const mockEdata = { type: 'mock-event-type' };
    
        component.setTelemetryImpressionData(mockEdata);
        expect(component.telemetryImpression).toEqual(
            {
                context: {
                  env: mockActivatedRoute.snapshot.data.telemetry.env,
                  cdata: [{
                    type: 'Group',
                    id: mockGroupService.groupData.id,
                  }]
                },
                edata: {
                  type: mockActivatedRoute.snapshot.data.telemetry.type,
                  subtype: mockActivatedRoute.snapshot.data.telemetry.subtype,
                  pageid: mockActivatedRoute.snapshot.data.telemetry.pageid,
                  uri: mockRouter.url,
                  duration: mockNavigationHelperService.getPageLoadTime()
                }
            }
        );
        expect(component.telemetryImpression.edata.type).toEqual(mockEdata.type);
        expect(component['telemetryService'].impression).toHaveBeenCalledWith(component.telemetryImpression);
    });

    it('should set telemetry interact data with provided edata', () => {
        const mockInteractdata = { id: 'mockId' };
        const mockEdata = { type: 'mock-event-type' };
        component.sendInteractData(mockInteractdata,mockEdata);
        expect(component['telemetryService'].interact).toHaveBeenCalledWith(
            {
                context: {
                  env: mockActivatedRoute.snapshot.data.telemetry.env,
                  cdata: [{
                    type: 'Group',
                    id: 'mock-group-id'
                  }]
                },
                edata: {
                  id: 'mock-id',
                  type: 'mock-event-type',
                  pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
                }
              }
        );
    });

    it('should update state, send telemetry interact data, and navigate', () => {
        const cardData = {
          activityType: 'mock-activity',
          searchQuery: '{"key": "value"}'
        };
        jest.spyOn(component,'sendInteractData');
        const csGroupAddableSpy = jest.spyOn(component['csGroupAddableBloc'],'updateState');
        component.onCardClick(cardData as any);
        
        expect(csGroupAddableSpy).toHaveBeenCalledWith({
            pageIds: ['mock-activity', ADD_ACTIVITY_TO_GROUP],
            groupId: 'mock-group-id',
            params: {
                searchQuery: JSON.parse(cardData.searchQuery),
                groupData:  mockGroupService.groupData,
                contentType: cardData.activityType
            }
        });
        expect(component.sendInteractData).toHaveBeenCalledWith({ id: 'mock-activity-card' }, { type: 'select-category' });
        expect(mockRouter.navigate).toHaveBeenCalledWith(
          ['add-activity-to-group', 'mock-activity', 1],
          { relativeTo: mockActivatedRoute }
        );
    });

    it('should call setTelemetryImpressionData on ngAfterViewInit', () => {
        jest.spyOn(component,'setTelemetryImpressionData');
        component.ngAfterViewInit();

        expect(component.setTelemetryImpressionData).toHaveBeenCalledWith({type: CONTENT_CATEGORIES});
    });
    
    describe('fetchActivityList',()=>{
        it('should fetch activity list successfully', () => {
            const mockData = { data: { fields: ['mock-field1','mock-field2'] } };
            jest.spyOn(component.groupService,'getSupportedActivityList').mockReturnValue(of(mockData));
            component.fetchActivityList();

            expect(component.showLoader).toBeFalsy;
            expect(component.supportedActivityList).toEqual(mockData.data.fields);
            expect(component.groupService.getSelectedLanguageStrings).toHaveBeenCalled();
        });
        
        it('should handle error when fetching activity list', () => {
            jest.spyOn(component.groupService,'getSupportedActivityList').mockReturnValue(throwError({error: 'mock-error'}));
            component.fetchActivityList();
        
            expect(component.showLoader).toBeFalsy;
        });
    });
});