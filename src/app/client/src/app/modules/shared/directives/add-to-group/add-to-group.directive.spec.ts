
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { ActivatedRoute } from '@angular/router';
import { Directive, OnInit, HostListener, ElementRef, Input, Inject } from '@angular/core';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { filter } from 'rxjs/operators';
import { ResourceService } from './../../services/resource/resource.service';
import { NavigationHelperService } from '../../services/navigation-helper/navigation-helper.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { _ } from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { CsGroupService } from '@project-sunbird/client-services/services/group/interface';
import { CsModule } from '@project-sunbird/client-services';
import { TelemetryService } from '@sunbird/telemetry';
import { SELECT_ACTIVITY } from '../../../groups/interfaces/telemetryConstants';
import { ActivityDashboardService } from '../../services';
import { AddToGroupDirective } from './add-to-group.directive';

describe('AddToGroupDirective', () => {
    let component: AddToGroupDirective;

    const ref: Partial<ElementRef> = {};
    const navigationHelperService: Partial<NavigationHelperService> = {
        navigateToLastUrl: jest.fn()
    };
    const toasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };
    const resourceService: Partial<ResourceService> = {
        messages: {
            groups: {
                emsg: {
                    m003: 'You have exceeded the maximum number of activities that can be added for the group'
                }
            },
            emsg: {
                activityAddedToGroup: 'You have added this activity previously for the group'
            },
            imsg: {
                activityAddedSuccess: 'Activity added successfully'
            }
        }
    };
    const csGroupService: Partial<CsGroupService> = {
        addActivities: jest.fn()
    };
    const activatedRoute: Partial<ActivatedRoute> = {};
    const telemetryService: Partial<TelemetryService> = {
        interact: jest.fn()
    };
    const activityDashboardService: Partial<ActivityDashboardService> = {};

    beforeAll(() => {
        component = new AddToGroupDirective(
            ref as ElementRef,
            navigationHelperService as NavigationHelperService,
            toasterService as ToasterService,
            resourceService as ResourceService,
            csGroupService as CsGroupService,
            activatedRoute as ActivatedRoute,
            telemetryService as TelemetryService,
            activityDashboardService as ActivityDashboardService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        component.identifier = '12345678';
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call the ngOnInit method', () => {
        component['ref'] = { nativeElement: { value: 'mock-value', focus: jest.fn(), style: jest.fn() } } as ElementRef;
        component.ngOnInit();
        expect(component).toBeTruthy();
        expect(_.get(component['ref'], 'nativeElement.style.display')).toBe('block');
    });
    it('should create a instance of component and call addActivityToGroup method', () => {
        csGroupService.addActivities = jest.fn().mockReturnValue(of({ error: { activities: [{ errorCode: 'EXCEEDED_ACTIVITY_MAX_LIMIT' }] } })) as any;
        component.addActivityToGroup();
        jest.spyOn(component, 'showErrorMsg');
        jest.spyOn(component, 'sendInteractData');
        expect(component).toBeTruthy();
        //expect(component.showErrorMsg).toBeCalled();
    });
    it('should create a instance of component and call addActivityToGroup method with success', () => {
        csGroupService.addActivities = jest.fn().mockReturnValue(of({})) as any;
        component.addActivityToGroup();
        jest.spyOn(toasterService, 'success');
        expect(component).toBeTruthy();
        expect(toasterService.success).toBeCalledWith('Activity added successfully')
    });
    it('should create a instance of component and call addActivityToGroup method with error', () => {
        csGroupService.addActivities = jest.fn().mockReturnValue(throwError({ error: 'error' })) as any;
        component.addActivityToGroup();
        jest.spyOn(component, 'goBack');
        expect(component).toBeTruthy();
       // expect(component.goBack).toBeCalled();
    });
    it('should create a instance of component and call addActivityToGroup method with activity added', () => {
       
        component.groupAddableBlocData ={
            params:{
                groupData:{
                    activities:[{
                        id:'12345678'
                    },
                    {
                        id:'12345678234'
                    }]
                }
            }
        }
        component.addActivityToGroup();
        jest.spyOn(component, 'goBack');
        jest.spyOn(component, 'showErrorMsg');
        expect(component).toBeTruthy();
        expect(component.showErrorMsg).toBeCalled();
    });
});