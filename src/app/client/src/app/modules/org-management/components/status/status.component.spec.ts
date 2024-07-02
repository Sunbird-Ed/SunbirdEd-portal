import { Component,OnInit,OnDestroy,ViewChild,AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ResourceService,ToasterService,ServerResponse,NavigationHelperService } from '@sunbird/shared';
import { Router,ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder,UntypedFormGroup } from '@angular/forms';
import { OrgManagementService } from '../../services';
import { IUserUploadStatusResponse,IOrgUploadStatusResponse } from '../../interfaces';
import { IImpressionEventInput,IInteractEventEdata,IInteractEventObject } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { StatusComponent } from './status.component';

describe('StatusComponent', () => {
    let component: StatusComponent;

    const mockOrgManagementService :Partial<OrgManagementService> ={
        getBulkUploadStatus: jest.fn(),
    };
	const mockRouter :Partial<Router> ={
        navigate: jest.fn(),
        url: '/mock-router-url',
    };
	const mockFormBuilder :Partial<UntypedFormBuilder> ={
        group: jest.fn(),
    };
	const mockToasterService :Partial<ToasterService> ={
        success: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    };
	const mockResourceService :Partial<ResourceService> ={
        messages: {
            smsg: { m0032: 'Success Message' },
            imsg: { m0040: 'Info Message' },
            stmsg: { m0006: 'Error Message' },
            fmsg: { m0051: 'Default Error Message' },
        },
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        data: of({ redirectUrl: '/mock-url' }),
        snapshot: {
            data: {
                telemetry: {
                  env: 'mock-env',
                  pageid: 'mock-page-id',
                  type: 'mock-type',
                  subtype: 'mock-sub-type',
                  ver: '1.0'
                }
            }
        } as any
    };
	const mockUserService :Partial<UserService> ={
        userid: 'mock-user',
    };
	const mockNavigationhelperService :Partial<NavigationHelperService> ={
        getPageLoadTime: jest.fn().mockReturnValue(10),
    };

    beforeAll(() => {
        component = new StatusComponent(
            mockOrgManagementService as OrgManagementService,
			mockRouter as Router,
			mockFormBuilder as UntypedFormBuilder,
			mockToasterService as ToasterService,
			mockResourceService as ResourceService,
			mockActivatedRoute as ActivatedRoute,
			mockUserService as UserService,
			mockNavigationhelperService as NavigationHelperService
        )
    });

    beforeEach(() => {
        component.statusForm = { value: { processId: '123' } } as any;
        component.unsubscribe$ = new Subject<void>();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    
    describe('ngOninit',()=>{
        it('ngOnInit should set redirectUrl to custom URL when provided in route data', () => {
            component.ngOnInit();
            expect(component.redirectUrl).toEqual('/mock-url');
        });

        it('ngOnInit should set redirectUrl to default when not provided in route data', () => {
            component.activatedRoute.data = of({});
            component.ngOnInit();
            expect(component.redirectUrl).toEqual('/home');
        });

        it('ngOnInit should call setInteractEventData', () => {
            component.ngOnInit();
            expect(component.setInteractEventData).toHaveBeenCalled;
        });
    });

    it('should set the processId and call navigate on redirect method',()=>{
        component.redirect();
        expect(component.processId).toEqual('');
        expect(mockRouter.navigate).toHaveBeenCalledWith([component.redirectUrl]);
    });

    it('should return the provided status', () => {
        const status = 'COMPLETED';
        const result = component.getStatusResult(status);
        expect(result).toEqual(status);
    });

    it('setInteractEventData should set checkStatusInteractEdata and telemetryInteractObject', (done) => {
        mockNavigationhelperService.getPageLoadTime = jest.fn().mockReturnValue(10);
        const obj = {
            context: { env: 'mock-env' },
            edata: {
              type: 'mock-type',
              subtype: 'mock-sub-type',
              pageid: 'profile-bulk-upload-check-status',
              uri: '/mock-router-url',
              duration: 10
            }
          };
        component.ngAfterViewInit();
        setTimeout(() => {
            expect(component.telemetryImpression).toEqual(obj);
            done()
        });
    });

    it('setInteractEventData should set checkStatusInteractEdata and telemetryInteractObject', () => {
        component.setInteractEventData();
        expect(component.checkStatusInteractEdata).toEqual({
            id:'upload-status',
            type: 'click',
            pageid: 'profile-read'
        });
        expect(component.telemetryInteractObject).toEqual({
            id: 'mock-user',
            type: 'User',
            ver: '1.0'
        });
    });

    describe('ngOndestroy',()=>{
		it('should destroy status', () => {
            component.modal = {
                deny: jest.fn(),
            } as any;
			component.unsubscribe$ = {
				next: jest.fn(),
				complete: jest.fn()
			} as any;
			component.ngOnDestroy();
            expect(component.modal.deny).toHaveBeenCalled();
			expect(component.unsubscribe$.next).toHaveBeenCalled();
			expect(component.unsubscribe$.complete).toHaveBeenCalled();
		});
	});
});