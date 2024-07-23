import { Component,AfterViewInit,OnInit,OnDestroy } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { ManageService } from '../../services/manage/manage.service';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { ToasterService,NavigationHelperService,LayoutService } from '@sunbird/shared';
import { IImpressionEventInput,IInteractEventEdata,IInteractEventObject,TelemetryService } from '@sunbird/telemetry';
import { Router,ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { _ } from 'lodash-es';
import { Subject, of, throwError } from 'rxjs';
import { TncService } from '@sunbird/core';
import { UserOrgManagementComponent } from './user-org-management.component';
import 'datatables.net';
import $ from 'jquery';

describe('UserOrgManagementComponent', () => {
    let component: UserOrgManagementComponent;

    const mockActivatedRoute :Partial<ActivatedRoute> ={
		snapshot: {
            data: {
                telemetry: {
                  env: 'mock-env',
                  pageid: 'mock-page-id',
                  type: 'mock-view',
                  uri: 'mock-uri'
                }
            }
        } as any
	};
	const mockNavigationhelperService :Partial<NavigationHelperService> ={
		getPageLoadTime: jest.fn().mockReturnValue('1ms'),
	};
	const mockUserService :Partial<UserService> ={
		userid: 'mock-user-id',
	};
	const mockManageService :Partial<ManageService> ={
		getData: jest.fn(),
	};
	const mockRouter :Partial<Router> ={
		navigate: jest.fn(),
	};
	const mockToasterService :Partial<ToasterService> ={
		error: jest.fn(),
	};
	const mockResourceService :Partial<ResourceService> ={
		messages:{
			emsg:{
				m0076: 'Error occurred while downloading the file.',
			}
		},
		frmelmnts:{
			btn:{
				viewdetails:'Mock-View-Details',
				viewless:'Mock-View-Less'
			}
		}

	};
	const mockLayoutService :Partial<LayoutService> ={};
	const mockTelemetryService :Partial<TelemetryService> ={
		interact: jest.fn(),
	};
	const mockTncService :Partial<TncService> ={
		getAdminTnc: jest.fn(),
	};

    beforeAll(() => {
        component = new UserOrgManagementComponent(
            mockActivatedRoute as ActivatedRoute,
			mockNavigationhelperService as NavigationHelperService,
			mockUserService as UserService,
			mockManageService as ManageService,
			mockRouter as Router,
			mockToasterService as ToasterService,
			mockResourceService as ResourceService,
			mockLayoutService as LayoutService,
			mockTelemetryService as TelemetryService,
			mockTncService as TncService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should destroy user org management', () => {
        component.unsubscribe$ ={
           next: jest.fn(),
           complete: jest.fn(),
        }as any;
		component.ngOnDestroy();

        expect(component.unsubscribe$.next).toHaveBeenCalled();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
	});

	it('should call router navigate on assignUserRole',() =>{
		component.assignUserRole();
        expect(component['router'].navigate).toHaveBeenCalled();
	});
    
	describe('openAdminPolicyPopup',() =>{
		it('should set showTncPopup to false when closePopup is true',() =>{
			component.openAdminPolicyPopup(true);
			expect(component.showTncPopup).toBeFalsy();	
		});

		it('should set showTncPopup to false when closePopup is false',() =>{
			component.openAdminPolicyPopup(false);
			expect(component.showTncPopup).toBeTruthy();	
		});
    });
    
	describe('showAdminTncForFirstUser',() =>{
		it('should set showTncPopup to true when adminTncObj is false',() =>{
			component.userProfile = {allTncAccepted:{orgAdminTnc: false}};
			component.showAdminTncForFirstUser();
			expect(component.showTncPopup).toBeTruthy();	
		});

		it('should set showTncPopup to false when adminTncObj is true',() =>{
			component.userProfile = {allTncAccepted:{orgAdminTnc: true}};
			component.showAdminTncForFirstUser();
			expect(component.showTncPopup).toBeFalsy();	
		});
	});
    
	it('should retrieve admin policy TnC on getAdminPolicyTnC', () => {
		const mockAdminTncData = {
		  result: {
			response: {
			  value: JSON.stringify({
				latestVersion: '1.0',
				'1.0': {
				  url: 'http://mock-example.com/tnc'
				}
			  })
			}
		  }
		};
		jest.spyOn(component as any,'showAdminTncForFirstUser' as any);
		jest.spyOn(component.tncService as any,'getAdminTnc' as any).mockReturnValue(of(mockAdminTncData));
		component.getAdminPolicyTnC();
	
		expect(component.adminTncVersion).toBe('1.0');
		expect(component.showAdminTnC).toBe(true);
		expect(component.adminTncUrl).toBe('http://mock-example.com/tnc');
		expect(component.showAdminTncForFirstUser).toHaveBeenCalled();
	});
    
	describe('downloadZipFile',() =>{
		it('should open zip file in a new tab', () => {
			const mockResponse = {
			result: {
				signedUrl: 'http://mock-example.com/zipfile.zip'
			}
			};
			jest.spyOn(window as any,'open');
			jest.spyOn(component.manageService,'getData').mockReturnValue(of(mockResponse));
			component.downloadZipFile('mock-slug', 'mock-filename.zip');

			expect(window.open).toHaveBeenCalledWith('http://mock-example.com/zipfile.zip', '_blank');
		});

		it('should show error message if signedUrl is not available', () => {
			const mockResponse = {
			result: {}
			};
			jest.spyOn(component.manageService,'getData').mockReturnValue(of(mockResponse));
			component.downloadZipFile('mock-slug', 'mock-filename.zip');

			expect(mockToasterService.error).toHaveBeenCalledWith('Error occurred while downloading the file.');
		});

		it('should show error if error response is received', () => {
			const mockError = 'mock-error-response'
			jest.spyOn(component.manageService,'getData').mockReturnValue(throwError(mockError));
			component.downloadZipFile('mock-slug', 'mock-filename.zip');

			expect(mockToasterService.error).toHaveBeenCalledWith('Error occurred while downloading the file.');
		});
    });
    
	describe('downloadCSVFile',() =>{
		it('should open CSV file in a new tab', () => {
			const mockResponse = {
			result: {
				signedUrl: 'http://mock-example.com/csvfile.csv'
			}
			};
			jest.spyOn(component.manageService,'getData').mockReturnValue(of(mockResponse));
			component.downloadCSVFile('mock-slug', 'mock-status', 'mock-filename.csv');
		
			expect(window.open).toHaveBeenCalledWith('http://mock-example.com/csvfile.csv', '_blank');
		});
		
		it('should show error if error response is received', () => {
			const mockError = 'mock-error-response'
			jest.spyOn(component.manageService,'getData').mockReturnValue(throwError(mockError));
			jest.spyOn(console as any,'log' as any);
			component.downloadCSVFile('mock-slug', 'mock-status', 'mock-filename.csv');

			expect(console.log).toHaveBeenCalledWith('mock-error-response');
		});
    });

	it('should set showModal on openModal',(done) =>{
		component.openModal();
        
		expect(component.showModal).toBeFalsy;
		setTimeout(() => {
			expect(component.showModal).toBeTruthy;
			done()
		});
	});
    
    
	describe('geoTableView',()=>{
		it('should toggle geoButtonText and populate geoTabledata with correct data', () => {
			component.geoSummary = [
				{ index: 1, districtName: 'Mock-District-A', blocks: 10, schools: 50 },
				{ index: 2, districtName: 'Mock-District-B', blocks: 5, schools: 30 }
			];
			component.geoButtonText = 'Mock-View-Details';
			jest.spyOn(component as any,'renderGeoDetails');
			component.geoTableView();
		
			expect(component.geoButtonText).toBe('Mock-View-Less');
			expect(component.geoTabledata).toEqual([
			[1, 'Mock-District-A', 10, 50],
			[2, 'Mock-District-B', 5, 30]
			]);
			expect(component.renderGeoDetails).toHaveBeenCalled();
		});

		it('should set only geoButtonText when geoButtonText not equals viewdetails',() =>{
			component.geoButtonText = 'No-View-Details';
			component.geoTableView();
			
			expect(component.geoButtonText).toBe('Mock-View-Details');
		});
    });

	describe('getGeoDetail',() =>{
		it('should set geoSummary when data is fetched successfully', () => {
			const mockResponse = {
			result: {
				districts: [
				{ name: 'Mock-District-A', blocks: 10, schools: 50 },
				{ name: 'Mock-District-B', blocks: 5, schools: 30 }
				]
			}
			};
			jest.spyOn(component.manageService,'getData').mockReturnValue(of(mockResponse));
			component.getGeoDetail();
		
			expect(component.geoSummary).toEqual(mockResponse.result);
		});

		it('should log error if error response is received', () => {
			const mockError = 'mock-error-response'
			jest.spyOn(component.manageService,'getData').mockReturnValue(throwError(mockError));
			jest.spyOn(console as any,'log' as any);
			component.getGeoDetail();

			expect(console.log).toHaveBeenCalledWith('mock-error-response');
		});
    });
    
	describe('getGeoJSON',() =>{
		it('should fetch and set geoData correctly', () => {
			const mockResponse = {
			result: {
				districts: 10,
				blocks: 20,
				schools: 50
			}
			};
			jest.spyOn(component.manageService,'getData').mockReturnValue(of(mockResponse));
			component.getGeoJSON();
		
			expect(mockManageService.getData).toHaveBeenCalledWith('geo-summary', 'sunbird.json');
			expect(component.geoData).toEqual({
			districts: 10,
			blocks: 20,
			schools: 50
			});
		});

		it('should handle error when fetching geoData', () => {
			const mockError = 'mock-error-response';
			jest.spyOn(component.manageService,'getData').mockReturnValue(throwError(mockError));
			jest.spyOn(console as any,'log' as any);
			component.getGeoJSON();

			expect(mockManageService.getData).toHaveBeenCalledWith('geo-summary', 'sunbird.json');
			expect(console.log).toHaveBeenCalledWith('mock-error-response');
		});
    });
	
	it('should set values on ngAfterViewInit',(done) =>{
		component.ngAfterViewInit();
        
        setTimeout(() => {
			expect(component.telemetryImpression).toEqual({
				context: {
					env: mockActivatedRoute.snapshot.data.telemetry.env
				},
				edata: {
					type: mockActivatedRoute.snapshot.data.telemetry.type,
					pageid: mockActivatedRoute.snapshot.data.telemetry.pageid,
					uri: mockActivatedRoute.snapshot.data.telemetry.uri,
					duration: mockNavigationhelperService.getPageLoadTime()
				}
			});
			expect(component.geoViewInteractEdata).toEqual({
				id: 'geo-details',
        		type: 'view',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.userDeclaredDetailsEdata).toEqual({
				id: 'user-declared-details',
        		type: 'click',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.geoDownloadInteractEdata).toEqual({
				id: 'geo-details',
        		type: 'download',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.userViewInteractEdata).toEqual({
				id: 'teacher-details',
        		type: 'view',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.userDownloadInteractEdata).toEqual({
				id: 'teacher-details',
        		type: 'download',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.teacherDetailsInteractEdata).toEqual({
				id: 'account-details',
        		type: 'download',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.selectFileInteractEdata).toEqual({
				id: 'upload-user',
        		type: 'click',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.selectUserValidationFileInteractEdata).toEqual({
				id: 'select-user-validation-file',
        		type: 'click',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.userValidationUploadInteractEdata).toEqual({
				id: 'upload-user-validation-status',
				type: 'click',
				pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.openUploadModalInteractEdata).toEqual({
				id: 'open-upload-validation-status-modal',
        		type: 'click',
        		pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.adminPolicyDetailsInteractEdata).toEqual({
				id: 'admin-policy-tnc-popup',
        		type: 'click',
    			pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
			});
			expect(component.telemetryInteractObject).toEqual({
				id: mockUserService.userid,
        		type: 'User',
       		    ver: '1.0'
			});
			done()
		});
	});
    
	it('should set values and call methods on closeUserValidationModal',() =>{
		component.closeUserValidationModal();

		expect(component.showUploadUserModal).toBeFalsy;
		expect(component.telemetryService.interact).toHaveBeenCalledWith(
			{
				context: {
				  env: mockActivatedRoute.snapshot.data.telemetry.env,
				  cdata: []
				},
				edata: {
				  id: 'close-upload-validation-status-modal',
				  type: 'click',
				  pageid: mockActivatedRoute.snapshot.data.telemetry.pageid
				}
			}
		);
	});

	it('should set values on openModel',() =>{
		component.showUploadUserModal = false;
		component.openModal();
        
        expect(component.showUploadUserModal).toBeTruthy;
		expect(component.fileUpload).toBeNull;
	});
    
	it('should set fileUpload and disableBtn correctly', () => {
		const mockEvent = {
		  target: {
			files: [
			  { name: 'mock-file.pdf' }
			]
		  }
		};
		component.fileChanged(mockEvent);
	
		expect(component.fileUpload).toEqual({ name: 'mock-file.pdf' });
		expect(component.disableBtn).toBeFalsy;
	});

	it('should open a tab on downloadFile',() =>{
		component.downloadFile('mock-path');
        
        expect(window.open).toHaveBeenCalledWith('mock-path','_blank');
	});
    
    it('should initialize DataTable with correct configurations', () => {
		$.fn.DataTable = jest.fn();
		component.renderUserDetails();
	    
		setTimeout(() => {
			expect($.fn.DataTable).toHaveBeenCalledWith({
			retrieve: true,
			columnDefs: [{
				targets: 0,
				render: expect.any(Function)
			}],
			data: [],
			searching: false,
			lengthChange: false
			});

			expect($).toHaveBeenCalledWith(`#${component.userTableId}`);
			expect($.fn.removeAttr).toHaveBeenCalledWith('width');
	    });
	});

	it('should initialize DataTable with correct configurations', () => {
        $.fn.DataTable = jest.fn();
		component.renderGeoDetails();
	
		setTimeout(() => {
			expect($.fn.DataTable).toHaveBeenCalledWith({
			retrieve: true,
			columnDefs: [{
				targets: 0,
				render: expect.any(Function)
			}],
			data: [],
			searching: false,
			lengthChange: false
			});
			expect($).toHaveBeenCalledWith(`#${component.GeoTableId}`);
			expect($.fn.removeAttr).toHaveBeenCalledWith('width');
	    });
	});

});