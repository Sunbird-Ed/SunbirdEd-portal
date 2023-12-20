import { Component,OnInit } from '@angular/core';
import { DeviceRegisterService,UserService } from '@sunbird/core';
import { ResourceService,UtilService,NavigationHelperService,ToasterService,ConfigService } from '@sunbird/shared';
import { IInteractEventEdata,IImpressionEventInput } from '@sunbird/telemetry';
import { _ } from 'lodash-es';
import { Subject, of, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../../../shared/services/layoutconfig/layout.service';
import { ActivatedRoute,Router } from '@angular/router';
import { GuestProfileComponent } from './guest-profile.component';

describe('GuestProfileComponent', () => {
    let component: GuestProfileComponent;

    const mockActivatedRoute :Partial<ActivatedRoute> ={
		snapshot: {
			data: {
			  telemetry: {
				env: 'mock-env', pageid: 'mock-page-id', type: 'mock-type',subtype: 'mock-sub-type',uuid: '9545879'
			  }
			},
			queryParams: {
			  client_id: 'mock-id', redirectUri: '/mock-profile',
			  state: 'state-id', response_type: 'code', version: '3'
			}
		} as any,
	};
	const mockResourceService :Partial<ResourceService> ={
		messages: {
            smsg: {
                m0058: 'Update success message'
            }
        }
	};
	const mockLayoutService :Partial<LayoutService> ={
		initlayoutConfig: jest.fn(() => 'mockInitialLayout'),
		switchableLayout: jest.fn(),
	};
	const mockDeviceRegisterService :Partial<DeviceRegisterService> ={
		fetchDeviceProfile: jest.fn(),
	};
	const mockUtilService :Partial<UtilService> ={
		isDesktopApp: true
	};
	const mockUserService :Partial<UserService> ={
		getGuestUser: jest.fn(),
		updateAnonymousUserDetails: jest.fn(),
	};
	const mockRouter :Partial<Router> ={
		url: '/guest-mock',
	};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={
		goBack: jest.fn(),
		getPageLoadTime: jest.fn()
	};
	const mockToasterService :Partial<ToasterService> ={
		success: jest.fn(),
	};
	const mockConfig :Partial<ConfigService> ={
		constants: {
			SIZE: {
			  SMALL: 1,
			  MEDIUM: 2
			},
			VIEW: {
			  VERTICAL: {
			  }
			}
		  }
	};

    beforeAll(() => {
        component = new GuestProfileComponent(
            mockActivatedRoute as ActivatedRoute,
			mockResourceService as ResourceService,
			mockLayoutService as LayoutService,
			mockDeviceRegisterService as DeviceRegisterService,
			mockUtilService as UtilService,
			mockUserService as UserService,
			mockRouter as Router,
			mockNavigationHelperService as NavigationHelperService,
			mockToasterService as ToasterService,
			mockConfig as ConfigService,
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should call goback',()=>{
      component.goBack();
	  expect(mockNavigationHelperService.goBack).toHaveBeenCalled();
	});

	describe('ngOndestroy',()=>{
		it('should destroy library', () => {
			component.unsubscribe$ = {
				next: jest.fn(),
				complete: jest.fn()
			} as any;
			component.ngOnDestroy();
			expect(component.unsubscribe$.next).toHaveBeenCalled();
			expect(component.unsubscribe$.complete).toHaveBeenCalled();
		});
	});
    
	describe('convertToString',()=>{
		it('should return joined string for array value', () => {
			const arrayValue = ['item1', 'item2', 'item3'];
			const result = component.convertToString(arrayValue);
			const expectedString = _.join(arrayValue, ', ');
			expect(result).toEqual(expectedString);
		});

		it('should return undefined for null value', () => {
			const result = component.convertToString(null);
			expect(result).toBeUndefined();
		});
    })
    
	describe('setInteractEventData',() =>{
		it('should set editProfileInteractEdata correctly', () => {
			component.setInteractEventData();

			expect(component.editProfileInteractEdata).toEqual({
				id: 'guest-profile-edit',
				type: 'click',
				pageid: 'guest-profile-read'
			});
		});

		it('should set editFrameworkInteractEData correctly', () => {
			component.setInteractEventData();

			expect(component.editFrameworkInteractEData).toEqual({
				id: 'guest-profile-framework-edit',
				type: 'click',
				pageid: 'guest-profile-read'
			});
		});
		
		it('should set telemetryImpression correctly', () => {
			component.setInteractEventData();

			expect(component.telemetryImpression).toEqual({
				context: {
					env: mockActivatedRoute.snapshot.data.telemetry.env 
				},
				object: {
					id: 'guest',
					type: 'User',
					ver: '1.0'
				},
				edata: {
					type: mockActivatedRoute.snapshot.data.telemetry.type, 
					pageid: mockActivatedRoute.snapshot.data.telemetry.pageid, 
					subtype: mockActivatedRoute.snapshot.data.telemetry.subtype, 
					uri: mockRouter.url, 
					duration: mockNavigationHelperService.getPageLoadTime()
				},
			});
		});
    });

	it('should call closeEditDetailsPopup',()=>{
	    component.showEditUserDetailsPopup = false;
		jest.spyOn(component,'getGuestUser');
		jest.spyOn(component,'getLocation');
	    jest.spyOn(component.userService,'getGuestUser').mockReturnValue(of({}));
		const result = { ipLocation: { state: "Karnataka", district: "Bangalore" } }
		mockDeviceRegisterService.fetchDeviceProfile = jest.fn().mockReturnValue(of({ result: result })) as any
		component.closeEditDetailsPopup();
		expect(component.getGuestUser).toHaveBeenCalled();
        expect(component.getLocation).toHaveBeenCalled();
		expect(component.showEditUserDetailsPopup).toBeTruthy();
	});

    describe('updateGuestUser',()=>{
		const mockUser = 
		{
			"name": "guest",
			"formatedName": "Guest",
			"framework": {
				"board": [
					"mock-board"
				],
				"medium": [
					"mock-Medium"
				],
				"gradeLevel": [
					"mock-grade"
				],
				"subject": [
					"mock-subject"
				],
				"id": "mock-board"
			},
			"role": "mock-role"
		}
		it('should update guest user and display success message', () => {
			jest.spyOn(component.userService as any,'updateAnonymousUserDetails' as any).mockReturnValue(of({}));
			component.updateGuestUser(mockUser);
			expect(mockUserService.updateAnonymousUserDetails).toHaveBeenCalledWith({
				request: { ...mockUser }
			});
			expect(component.getGuestUser).toHaveBeenCalled();
		});

		it('should handle error during user update', () => {
			const errorResponse = { message: 'Update failed' };
			jest.spyOn(component.userService as any,'updateAnonymousUserDetails' as any).mockImplementation(() => throwError({}));
			jest.spyOn(console, 'error').mockImplementation();
			component.updateGuestUser(mockUser);
			expect(console.error).toHaveBeenCalled();
		});
    });
    
	describe('updateProfile',()=>{
		it('should update guest user framework and call updateGuestUser for desktop', () => {
			const mockEvent = 'mockEvent';
			component.isDesktop = true;
			component.guestUser ={};
			jest.spyOn(component,'updateGuestUser');
			jest.spyOn(component.userService as any,'updateAnonymousUserDetails' as any).mockReturnValue(of({}));
			component.updateProfile(mockEvent);
			expect(component.guestUser.framework).toEqual(mockEvent);
			expect(component.updateGuestUser).toHaveBeenCalledWith(component.guestUser);
		});

		it('should update localStorage and call getGuestUser for non-desktop', () => {
			const mockEvent = 'mockEvent';
			component.isDesktop = false;
			jest.spyOn(component.userService as any,'getGuestUser' as any).mockReturnValue(of({}));

			component.updateProfile(mockEvent);

			const storedGuestUser = JSON.parse(localStorage.getItem('USER_DETAILS_KEY'));
			expect(storedGuestUser).toBe(null);
			expect(component.getGuestUser).toHaveBeenCalled();
			expect(mockToasterService.success).toHaveBeenCalledWith('Update success message');
		});
    });
    
	it('should get the location',(done)=>{
		jest.spyOn(component.deviceRegisterService,'fetchDeviceProfile').mockReturnValue(of({
			id: 'id',
			params: {
			  resmsgid: '',
			  status: 'staus'
			},
			responseCode: 'OK',
			result: {},
			ts: '',
			ver: ''
		}));
		component.getLocation();
		component.deviceRegisterService.fetchDeviceProfile().subscribe(() => {
			done();
		});
        expect(component.deviceProfile).toEqual(undefined);
	});
    
	describe('initLayout',()=>{
		it('should set layoutConfiguration to initlayoutConfig result', () => {
			jest.spyOn(component.layoutService,'initlayoutConfig')
			jest.spyOn(mockLayoutService as any, 'switchableLayout' as any).mockImplementation(() =>of([{}]));
			component.initLayout();
			expect(component.layoutService.initlayoutConfig).toHaveBeenCalled();
		});

		it('should set layoutConfiguration to switchableLayout result if available', () => {
			jest.spyOn(component.layoutService,'initlayoutConfig')
			jest.spyOn(mockLayoutService as any, 'switchableLayout' as any).mockImplementation(() =>of([{layout: 'mock-layout'}]));
			component.initLayout();
			expect(mockLayoutService.switchableLayout).toHaveBeenCalled();
			expect(component.layoutConfiguration).toEqual(undefined);
		});
    });
    
	it('should call getGuestUser method', () => {
		const mockUser = 
		{
			"name": "guest",
			"formatedName": "Guest",
			"framework": {
				"board": [
					"mock-board"
				],
				"medium": [
					"mock-Medium"
				],
				"gradeLevel": [
					"mock-grade"
				],
				"subject": [
					"mock-subject"
				],
				"id": "mock-board"
			},
			"role": "mock-role"
		}
		component.isDesktop = true;
		jest.spyOn(component.userService as any,'getGuestUser' as any).mockReturnValue(of(mockUser));
        component.getGuestUser();

        expect(component.guestUser).toEqual(mockUser);
		expect(component.userRole).toEqual('mock-role');
    });

	describe('ngOninit',()=>{
	   const mockDevice ={id: 'id',params: {resmsgid: '',status: 'status'},
	   responseCode: 'OK',result: {},ts: '',ver: ''}
       
	   it('should set isDesktop value',()=>{
		  component.isDesktop = false;
		  jest.spyOn(component.userService as any,'getGuestUser' as any).mockReturnValue(of({}));
		  jest.spyOn(mockLayoutService as any, 'switchableLayout' as any).mockImplementation(() =>of([{}]));
		  jest.spyOn(component.deviceRegisterService,'fetchDeviceProfile').mockReturnValue(of(mockDevice));
	   	  component.ngOnInit();
		  expect(component.isDesktop).toBeTruthy();
	   });
       
	   it('should call all the required methods',()=>{
           jest.spyOn(component.userService as any,'getGuestUser' as any).mockReturnValue(of({}));
		   jest.spyOn(component,'initLayout');
		   jest.spyOn(component,'setInteractEventData');
		   jest.spyOn(mockLayoutService as any, 'switchableLayout' as any).mockImplementation(() =>of([{}]));
           jest.spyOn(component.deviceRegisterService,'fetchDeviceProfile').mockReturnValue(of(mockDevice));
		   component.ngOnInit();
		   expect(component.getGuestUser).toHaveBeenCalled();
		   expect(component.initLayout).toHaveBeenCalled();
		   expect(component.getLocation).toHaveBeenCalled();
		   expect(component.setInteractEventData).toHaveBeenCalled();
	   });
	});
});
