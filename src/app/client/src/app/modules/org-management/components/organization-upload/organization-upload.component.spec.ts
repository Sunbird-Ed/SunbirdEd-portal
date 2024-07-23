import { Component,ViewChild,ElementRef,OnInit,OnDestroy,AfterViewInit } from '@angular/core';
import { ResourceService,ToasterService,ServerResponse,ConfigService,NavigationHelperService } from '@sunbird/shared';
import { Router,ActivatedRoute } from '@angular/router';
import { OrgManagementService } from '../../services';
import { IImpressionEventInput,IInteractEventEdata,IInteractEventObject } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, of, throwError } from 'rxjs';
import { _ } from 'lodash-es';
import { OrganizationUploadComponent } from './organization-upload.component';
import { mockRes } from './organization-upload.component.spec.data';

describe('OrganizationUploadComponent', () => {
    let component: OrganizationUploadComponent;

    const mockOrgManagementService :Partial<OrgManagementService> ={
        bulkOrgUpload: jest.fn(),
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        data: of({ redirectUrl: '/mock-url' }),
        snapshot: {
            data: {
              telemetry: {
                env: 'mock-env', type: 'mock-type', subtype: 'mock-sub-type'
              }
            }
        } as any
    };
	const mockToasterService :Partial<ToasterService> ={
        success: jest.fn(),
        error: jest.fn(),
    };
	const mockConfig :Partial<ConfigService> ={};
	const mockResourceService :Partial<ResourceService> ={
        frmelmnts:{
            instn: mockRes.frmelementsInstn,
        } as any,
        messages:{
            fmsg: {
              m0051: 'Error message'
            },
            stmsg:{
                m0080: 'mock-sterror-message'
            }
        }
    };
	const mockUserService :Partial<UserService> ={
        userid: 'mock-user-id',
    };
	const mockRouter :Partial<Router> ={
        navigate: jest.fn(),
        url: 'mock-url'
    };
	const mockNavigationhelperService :Partial<NavigationHelperService> ={
        getPageLoadTime: jest.fn().mockReturnValue('1ms'),
    };

    beforeAll(() => {
        component = new OrganizationUploadComponent(
            mockOrgManagementService as OrgManagementService,
			mockActivatedRoute as ActivatedRoute,
			mockToasterService as ToasterService,
			mockConfig as ConfigService,
			mockResourceService as ResourceService,
			mockUserService as UserService,
			mockRouter as Router,
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
    
    describe('ngOninit',()=>{
        it('should set body class and redirect URL on ngOnInit', () => {
            document.body.classList.add = jest.fn();
            jest.spyOn(component,'setInteractEventData');
            component.ngOnInit();
        
            expect(document.body.classList.add).toHaveBeenCalledWith('no-scroll');
            expect(component.redirectUrl).toEqual('/mock-url');
            expect(component.setInteractEventData).toHaveBeenCalled();
        });

        it('should set default url when redirect URL is not received', () => {
            document.body.classList.add = jest.fn();
            mockActivatedRoute.data = of({});
            jest.spyOn(component,'setInteractEventData');
            component.ngOnInit();
        
            expect(component.redirectUrl).toEqual('/home');
            expect(component.setInteractEventData).toHaveBeenCalled();
        });
    });

    it('should redirect to the specified URL', () => {
        component.redirect();
    
        expect(component.fileName).toBe('');
        expect(component.processId).toBe('');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should trigger click on input element', () => {
        const mockInputBtn = {
          click: jest.fn()
        };
        component.openImageBrowser(mockInputBtn);
    
        expect(mockInputBtn.click).toHaveBeenCalled();
    });

    describe('uploadOrg',()=>{
        it('should upload organization and handle success response', () => {
            const mockFile = [{
            name: 'example.csv'
            }];
            const mockApiResponse = {
            result: {
                processId: '123'
            }
            };
            jest.spyOn(component.orgManagementService as any,'bulkOrgUpload' as any).mockReturnValue(of(mockApiResponse));
            component.uploadOrg(mockFile);
        
            expect(mockOrgManagementService.bulkOrgUpload).toHaveBeenCalledWith(expect.any(FormData));
            expect(component.showLoader).toBe(false);
            expect(component.processId).toBe('123');
            expect(component.fileName).toBe('');
        });

        it('should handle error when uploading organization', () => {
            const mockFile = [{
            name: 'example.csv'
            }];
            const mockErrorResponse = {
            error: {
                params: {
                errmsg: 'Error message'
                }
            }
            };
        
            jest.spyOn(component.orgManagementService as any,'bulkOrgUpload' as any).mockReturnValue(throwError(mockErrorResponse));
            component.uploadOrg(mockFile);
        
            expect(component.showLoader).toBe(false);
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0051);
        });

        it('should handle error when uploading organization with invalid file extension', () => {
            const mockFile = [{
            name: 'example.txt'
            }];
            component.uploadOrg(mockFile);

            expect(component.showLoader).toBe(false);
            expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.stmsg.m0080);
        });
    });

    it('should destroy the observation upload', () => {
		component.unsubscribe$ = {
			next: jest.fn(),
			complete: jest.fn()
		} as any;
		component.modal ={
			deny: jest.fn()
		} as any;
        document.body.classList.remove = jest.fn();
		component.ngOnDestroy();

        expect(document.body.classList.remove).toHaveBeenCalledWith('no-scroll');
		expect(component.modal.deny).toHaveBeenCalled();
		expect(component.unsubscribe$.next).toHaveBeenCalled();
		expect(component.unsubscribe$.complete).toHaveBeenCalled();
	});

    it('should set telemetry impression data correctly on ngafterviewinit', () => {
        component.ngAfterViewInit();

        setTimeout(() => {
            expect(component.telemetryImpression).toEqual({
                context:{
                    env: mockActivatedRoute.snapshot.data.telemetry.env,
                },
                edata:{
                    type: mockActivatedRoute.snapshot.data.telemetry.type,
                    pageid: 'profile-bulk-upload-organization-upload',
                    subtype: mockActivatedRoute.snapshot.data.telemetry.subtype,
                    uri: mockRouter.url,
                    duration: mockNavigationhelperService.getPageLoadTime()
                }
            });
        });
    });

    it('should set interact event data correctly', () => {
        component.setInteractEventData();

        expect(component.orgUploadInteractEdata).toEqual({
          id: 'upload-org',
          type: 'click',
          pageid: 'profile-read'
        });
        expect(component.downloadSampleOrgCSVInteractEdata).toEqual({
          id: 'download-sample-org-csv',
          type: 'click',
          pageid: 'profile-read'
        });
        expect(component.telemetryInteractObject).toEqual({
          id: component.userService.userid,
          type: 'User',
          ver: '1.0'
        });
    });
});
