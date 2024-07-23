import { Subject, Subscription, of } from 'rxjs';
import { Component,OnInit,OnDestroy,AfterViewInit, EventEmitter } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { _ } from 'lodash-es';
import { ResourceService,ToasterService,NavigationHelperService } from '@sunbird/shared';
import { OrgTypeService } from './../../services';
import { IImpressionEventInput,IInteractEventEdata } from '@sunbird/telemetry';
import { ViewOrgTypeComponent } from './view-org-type.component';

describe('ViewOrgTypeComponent', () => {
    let component: ViewOrgTypeComponent;

    const mockRoute :Partial<Router> ={};
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
            data: {
                telemetry: {
                    env: 'mock-env',
                    pageid: 'mock-pageid',
                    type: 'mock-type',
                    subtype: 'mock-subtype',
                }
            }
        } as any,
    };
	const mockResourceService :Partial<ResourceService> ={};
	const mockToasterService :Partial<ToasterService> ={};
	const mockOrgTypeService :Partial<OrgTypeService> ={
        orgTypeUpdateEvent: new EventEmitter<any>(),
        getOrgTypes:jest.fn(),
        orgTypeData$: 'mock-org-type-data' as any,
    };
	const mockNavigationhelperService :Partial<NavigationHelperService> ={
        getPageLoadTime: jest.fn().mockReturnValue('1ms'),
    };

    beforeAll(() => {
        component = new ViewOrgTypeComponent(
            mockRoute as Router,
			mockActivatedRoute as ActivatedRoute,
			mockResourceService as ResourceService,
			mockToasterService as ToasterService,
			mockOrgTypeService as OrgTypeService,
			mockNavigationhelperService as NavigationHelperService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should call methods on ngOnDestroy',() => {
        component.orgTypeSubscription = { unsubscribe: jest.fn()} as any;
        component.orgUpdateSubscription = { unsubscribe: jest.fn()} as any;
        component.ngOnDestroy();
        
        expect(component.orgTypeSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.orgUpdateSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should set the telemetryImpression on ngAfterViewInit',(done) =>{
        const mockTelemetry = {
            context: {
              env: mockActivatedRoute.snapshot.data.telemetry.env
            },
            edata: {
              type: mockActivatedRoute.snapshot.data.telemetry.type,
              pageid: mockActivatedRoute.snapshot.data.telemetry.pageid,
              uri: 'orgType',
              subtype: mockActivatedRoute.snapshot.data.telemetry.subtype,
              duration: mockNavigationhelperService.getPageLoadTime()
            }
          };
        component.ngAfterViewInit();

        setTimeout(() => {
            expect(component.telemetryImpression).toEqual(mockTelemetry);
            done();
        });
    });

    it('should set the addOrganizationType on setInteractEventData',() =>{
        const mockAddOrganization = {
            id: 'add-organization-type',
            type: 'click',
            pageid: 'view-organization-type'
        };
        const mockUpdateOrganization = {
            id: 'update-organization-type',
            type: 'click',
            pageid: 'view-organization-type'
        };
        component.setInteractEventData();
        
        expect(component.addOrganizationType).toEqual(mockAddOrganization);
        expect(component.updateOrganizationType).toEqual(mockUpdateOrganization);
    });
});
