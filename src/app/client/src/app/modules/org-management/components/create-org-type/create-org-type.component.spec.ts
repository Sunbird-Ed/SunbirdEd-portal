import { Component,OnInit,OnDestroy,ViewChild,AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceService,ToasterService,RouterNavigationService,ServerResponse,NavigationHelperService } from '@sunbird/shared';
import { OrgTypeService } from './../../services/';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { _ } from 'lodash-es';
import { IImpressionEventInput,IInteractEventEdata } from '@sunbird/telemetry';
import { Subject, of, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreateOrgTypeComponent } from './create-org-type.component';

describe('CreateOrgTypeComponent', () => {
    let component: CreateOrgTypeComponent;

    const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
            data: {
              telemetry: { env: 'mock-env', type: 'mock-type', subtype: 'mock-sub-type' }
            },
        } as any,
    };
	const mockResourceService :Partial<ResourceService> ={};
	const mockToasterService :Partial<ToasterService> ={
        success: jest.fn(),
        error: jest.fn(),
    };
	const mockRouterNavigationService :Partial<RouterNavigationService> ={
        navigateToParentUrl: jest.fn(),
    };
	const mockOrgTypeService :Partial<OrgTypeService> ={
        orgTypeData$: of({id: 'mock-id',params: {params: 'mock-params'},
            responseCode: 'mock-response-code',result:'mock-result',ts: 'mock-ts',
            ver: '1.2'}) as any,
        updateOrgType: jest.fn(),
        addOrgType: jest.fn(),
    };
	const mockNavigationhelperService :Partial<NavigationHelperService> ={
        getPageLoadTime: jest.fn(),
    };

    beforeAll(() => {
        component = new CreateOrgTypeComponent(
            mockActivatedRoute as ActivatedRoute,
			mockResourceService as ResourceService,
			mockToasterService as ToasterService,
			mockRouterNavigationService as RouterNavigationService,
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
    
    describe('ngOninit',() =>{
        it('should set form for update when URL path is "update"', () => {
            mockActivatedRoute.url = of([{ path: 'update' }]) as any;
            component.orgTypeId = 'mock-id';
            component.ngOnInit();
        
            expect(component.createForm).toBe(false);
            expect(component.pageUri).toBe('orgType/update/mock-id');
            expect(component.pageId).toBe('update-organization-type');
        });
        
        it('should set form for creation when URL path is "create"', () => {
            mockActivatedRoute.url = of([{ path: 'create' }]) as any;
            jest.spyOn(component,'setInteractEventData');
            component.ngOnInit();

            expect(component.createForm).toBe(true);
            expect(component.pageUri).toBe('orgType/create');
            expect(component.pageId).toBe('create-organization-type');
            expect(component.setInteractEventData).toHaveBeenCalled();
        });
    });

    it('should set values on setInteractEventData', () => {
       component.pageId = "create-organization-type";
       component.setInteractEventData();

       expect(component.addOrganizationType).toEqual({
            id: 'create-organization-type',
            type: 'click',
            pageid: "create-organization-type"
       })
       expect(component.updateOrganizationType).toEqual({
            id: 'update-organization-type',
            type: 'click',
            pageid: "create-organization-type",
       })
       expect(component.cancelModal).toEqual({
            id: 'cancel',
            type: 'click',
            pageid: "create-organization-type",
       })   
    });

    it('should set values on setInteractEventData', (done) => {
        mockNavigationhelperService.getPageLoadTime = jest.fn().mockReturnValue(10);
        component.ngAfterViewInit();
        setTimeout(() => {
            expect(component.telemetryImpression).toEqual({
                context: {
                   env: "mock-env",
                },
                edata: {
                   duration: 10,
                   pageid: "create-organization-type",
                   subtype: "mock-sub-type",
                   type: "mock-type",
                   uri: "orgType/create",
                },
            })
            done();
        });
    });

    it('should call ngOnDestroy', () => {
		component.unsubscribe$ = {
		  next: jest.fn(),
		  complete: jest.fn()
	  } as any;
	   component.ngOnDestroy();
	   expect(component.unsubscribe$.next).toHaveBeenCalled();
	   expect(component.unsubscribe$.complete).toHaveBeenCalled();
	});

    it('should call navigateToParentUrl on redirect method',()=>{
       component.redirect();

       expect(component.routerNavigationService.navigateToParentUrl)
            .toHaveBeenCalledWith(component.activatedRoute.snapshot);
    });
});