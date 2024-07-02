import { FormControl, FormGroup } from '@angular/forms';
import { ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { UntypedFormBuilder } from '@angular/forms';
import { DeviceRegisterService, UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { ProfileService } from '@sunbird/profile';
import { _ } from 'lodash-es';
import { TelemetryService } from '@sunbird/telemetry';
import { of, throwError } from 'rxjs';
import { PopupControlService } from '../../../../service/popup-control.service';
import { UserLocationComponent } from './user-location.component';
import { userLocationMockData } from './user-location.component.spec.data';

describe('UserLocationComponent', () => {
	let component: UserLocationComponent;

	const resourceService: Partial<ResourceService> = {
		messages: {
			emsg: {
				m0016: 'Fetching states failed. Try again later',
				m0017: 'Fetching districts failed. Try again later'
			}
		}
	};
	const toasterService: Partial<ToasterService> = {
		error: jest.fn(),
		success: jest.fn()
	};
	const formBuilder: Partial<UntypedFormBuilder> = {};
	const profileService: Partial<ProfileService> = {
		updateProfile: jest.fn()
	};
	const activatedRoute: Partial<ActivatedRoute> = {};
	const router: Partial<Router> = {};
	const userService: Partial<UserService> = {
		loggedIn: true,
		userData$: of({
			userProfile: {
				userId: 'sample-uid',
				rootOrgId: 'sample-root-id',
				rootOrg: {},
				hashTagIds: ['id'],
				profileUserType: {
					type: 'student'
				}
			} as any
		}) as any
	};
	const deviceRegisterService: Partial<DeviceRegisterService> = {
		updateDeviceProfile: jest.fn()
	};
	const navigationhelperService: Partial<NavigationHelperService> = {};
	const telemetryService: Partial<TelemetryService> = {
		log: jest.fn(),
		interact: jest.fn()
	};
	const popupControlService: Partial<PopupControlService> = {
		changePopupStatus: jest.fn()
	};

	beforeAll(() => {
		component = new UserLocationComponent(
			resourceService as ResourceService,
			toasterService as ToasterService,
			formBuilder as UntypedFormBuilder,
			profileService as ProfileService,
			activatedRoute as ActivatedRoute,
			router as Router,
			userService as UserService,
			deviceRegisterService as DeviceRegisterService,
			navigationhelperService as NavigationHelperService,
			telemetryService as TelemetryService,
			popupControlService as PopupControlService
		)
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should create a instance of component', () => {
		expect(component).toBeTruthy();
	});
	it('should call set state and district is state and district when empty object', () => {
		jest.spyOn(component, 'setState');
		jest.spyOn(component, 'setDistrict');
		jest.spyOn(component, 'onStateChange');
		component.userDetailsForm = new FormGroup({
			state: new FormControl({ name: 'state', 'code': 'statecode' }),
			district: new FormControl({ name: 'district', 'code': 'districtcode' })
		});
		component.userDetailsForm.controls['state'].setValue('')
		component.setStateDistrict({ state: {}, district: {} });
		expect(component.setState).toHaveBeenCalled();
		expect(component.setDistrict).toHaveBeenCalled();
		expect(component.onStateChange).toHaveBeenCalled();
	});
	it('should call set state and district is state and district when state empty', () => {
		jest.spyOn(component, 'setState');
		jest.spyOn(component, 'setDistrict');
		jest.spyOn(component, 'onStateChange');
		component.setStateDistrict({
			state: userLocationMockData.stateList[0],
			district: userLocationMockData.districtList[0]
		});
		expect(component.setState).toHaveBeenCalled();
		expect(component.setDistrict).toHaveBeenCalled();
		expect(component.onStateChange).toHaveBeenCalled();
	});
	it('should call onStateChange when state and district null', () => {
		jest.spyOn(component, 'setState');
		jest.spyOn(component, 'setDistrict');
		jest.spyOn(component, 'onStateChange');
		component.setStateDistrict({ state: null, district: null });
		expect(component.setState).toHaveBeenCalledTimes(0);
		expect(component.setDistrict).toHaveBeenCalledTimes(0);
		expect(component.onStateChange).toHaveBeenCalled();
	});
	it('should call set state when district undefined', () => {
		jest.spyOn(component, 'setState');
		jest.spyOn(component, 'setDistrict');
		jest.spyOn(component, 'onStateChange');
		component.setStateDistrict({ state: undefined, district: undefined });
		expect(component.setState).toHaveBeenCalledTimes(0);
		expect(component.setDistrict).toHaveBeenCalledTimes(0);
		expect(component.onStateChange).toHaveBeenCalled();
	});

	it('should call set state change when location null', () => {
		jest.spyOn(component, 'setState');
		jest.spyOn(component, 'setDistrict');
		jest.spyOn(component, 'onStateChange');
		component.setStateDistrict(null);
		expect(component.setState).toHaveBeenCalledTimes(0);
		expect(component.setDistrict).toHaveBeenCalledTimes(0);
		expect(component.onStateChange).toHaveBeenCalled();
	});

	it('should call set state change when location undefined', () => {
		jest.spyOn(component, 'setState');
		jest.spyOn(component, 'setDistrict');
		jest.spyOn(component, 'onStateChange');
		component.setStateDistrict(undefined);
		expect(component.setState).toHaveBeenCalledTimes(0);
		expect(component.setDistrict).toHaveBeenCalledTimes(0);
		expect(component.onStateChange).toHaveBeenCalled();
	});
	it('should call only set state change when location empty object', () => {
		jest.spyOn(component, 'setState');
		jest.spyOn(component, 'setDistrict');
		jest.spyOn(component, 'onStateChange');
		component.setStateDistrict({});
		expect(component.setState).toHaveBeenCalledTimes(0);
		expect(component.setDistrict).toHaveBeenCalledTimes(0);
		expect(component.onStateChange).toHaveBeenCalled();
	});
	it('should get telemetry data when nothing state and district not changed', () => {
		const data = component.getTelemetryData('');
		expect(data).toEqual(userLocationMockData.telemetryData);
	});

	it('should get telemetry data when state changed', () => {
		const data = component.getTelemetryData('state-changed');
		expect(data).toEqual(userLocationMockData.stateChanged);
	});

	it('should get telemetry data when dist changed', () => {
		const data = component.getTelemetryData('dist-changed');
		expect(data).toEqual(userLocationMockData.districtChanged);
	});

	it('should get telemetry data when both changed', () => {
		const data = component.getTelemetryData('state-dist-changed');
		expect(data).toEqual(userLocationMockData.bothChanged);
	});
	it('should call the ngoninit method', () => {
		component.sbFormBuilder.group = jest.fn().mockReturnValue(new FormGroup({
			state: new FormControl('state'),
			district: new FormControl('district'),
		})) as any;
		profileService.getUserLocation = jest.fn().mockReturnValue(of(userLocationMockData)) as any;
		component.ngOnInit();
		expect(component.enableSubmitBtn).toBeTruthy();
	});
	it('should call the ngoninit method with error', () => {
		component.sbFormBuilder.group = jest.fn().mockReturnValue(new FormGroup({
			state: new FormControl('state'),
			district: new FormControl('district'),
		})) as any;
		jest.spyOn(toasterService, 'error');
		component.close = new EventEmitter<void>();
		component.userLocationModal = {
			deny: jest.fn()
		};
		jest.spyOn(component.userLocationModal, 'deny');
		profileService.getUserLocation = jest.fn().mockReturnValue(throwError({ error: 'error' })) as any;
		component.ngOnInit();
		expect(component.enableSubmitBtn).toBeTruthy();
		expect(component.userLocationModal.deny).toBeCalled();
		expect(toasterService.error).toBeCalledWith(resourceService.messages.emsg.m0016);
	});
	it('should call ngOnDestroy', () => {
		component.ngOnDestroy();
		expect(component.popupControlService.changePopupStatus).toBeDefined()
	});
	it('should return telemetry log events', () => {
		component.telemetryLogEvents('test', true);
		expect(telemetryService.log).toHaveBeenCalled();
	});
	it('should updateUserProfileData method with data', () => {
		component.isUserProfileUpdateAllowed = true;
		component.isCustodianOrgUser = true;
		jest.spyOn(profileService, 'updateProfile');
		component.updateUserProfileData({ data: 'object' });
		expect(profileService.updateProfile).toHaveBeenCalled();
	});
	it('should updateUserProfileData method with data and isUserProfileUpdateAllowed as false', () => {
		component.isUserProfileUpdateAllowed = false;
		jest.spyOn(profileService, 'updateProfile');
		let obj = component.updateUserProfileData({ data: 'object' });
		let val = JSON.stringify(of({}));
		expect(JSON.stringify(obj)).toBe(val);
	});
	it('should updateDeviceProfileData method with data and locationDetails', () => {
		component.isDeviceProfileUpdateAllowed = false;
		jest.spyOn(profileService, 'updateProfile');
		let obj = component.updateDeviceProfileData({ data: 'object' }, { locationDetails: 'abcd' });
		let val = JSON.stringify(of({}));
		expect(JSON.stringify(obj)).toBe(val);
	});
	it('should updateDeviceProfileData method with data and location value of isDeviceProfileUpdateAllowed as true', () => {
		component.isDeviceProfileUpdateAllowed = true;
		jest.spyOn(deviceRegisterService, 'updateDeviceProfile');
		component.updateDeviceProfileData({ data: 'object' }, { state: { name: 'karnataka' }, district: { name: 'bangalore' } });
		expect(deviceRegisterService.updateDeviceProfile).toHaveBeenCalled();
	});
	it('should updateLocation method with data', () => {
		component.updateDeviceProfileData = jest.fn().mockReturnValue(of({ return: true })) as any;
		component.updateUserProfileData = jest.fn().mockReturnValue(of({ return: true })) as any;
		component.updateLocation({ data: 'object' }, { state: { name: 'karnataka' }, district: { name: 'bangalore' } });
		expect(telemetryService.log).toHaveBeenCalledWith({ "context": { "env": "portal" }, "edata": { "level": "SUCCESS", "message": "Updation of Device Profile success", "type": "update-location" } });
		expect(telemetryService.log).toHaveBeenCalledWith({ "context": { "env": "portal" }, "edata": { "level": "SUCCESS", "message": "Updation of User Profile success", "type": "update-location" } });
	});
	it('should updateLocation method with  data and error', () => {
		component.updateDeviceProfileData = jest.fn().mockReturnValue(throwError([{ error: 'one' }])) as any;
		component.updateUserProfileData = jest.fn().mockReturnValue(of({ return: true })) as any;
		component.updateLocation({ data: 'object' }, { state: { name: 'karnataka' }, district: { name: 'bangalore' } });
		expect(telemetryService.log).toHaveBeenCalledWith({ "context": { "env": "portal" }, "edata": { "level": "ERROR", "message": "Updation of Device Profile failed", "type": "update-location" } });
	});
	it('should updateLocation method with  data and error', () => {
		component.updateDeviceProfileData = jest.fn().mockReturnValue(of({ return: true })) as any;
		component.updateUserProfileData = jest.fn().mockReturnValue(throwError([{ error: 'one' }, { error: 'two' }])) as any;
		component.updateLocation({ data: 'object' }, { state: { name: 'karnataka' }, district: { name: 'bangalore' } });
		expect(telemetryService.log).toHaveBeenCalledWith({ "context": { "env": "portal" }, "edata": { "level": "ERROR", "message": "Updation of User Profile failed", "type": "update-location" } });
	});
	it('should updateUserLocation method has to be called', () => {
		component.allDistricts = userLocationMockData.districtList
		component.userDetailsForm = new FormGroup({
			state: new FormControl('3'),
			district: new FormControl('3045')
		});
		jest.spyOn(component, 'updateLocation');
		component.updateUserLocation();
		expect(component.updateLocation).toHaveBeenCalled();
	});
	it('should getState method has to be called', () => {
		profileService.getUserLocation = jest.fn().mockReturnValue(of(userLocationMockData)) as any;
		const obj = [{
			code: '2907',
			name: 'KOPPAL',
			id: 'cde02789-5803-424b-a3f5-10db347280e9',
			type: 'district',
			parentId: '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
		}, {
			code: '3045',
			name: 'Bangalore',
			id: 'cde02789-5803-424b-a3f5-10db347280e9',
			type: 'district',
			parentId: '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
		}]
		component.getState();
		expect(component.allDistricts).toEqual(obj);
	});
	it('should getLocationCodes method has to be called', () => {
		jest.spyOn(component, 'processStateLocation');
		profileService.getUserLocation = jest.fn().mockReturnValue(of(userLocationMockData)) as any;
		component.getLocationCodes(userLocationMockData);
		expect(component.processStateLocation).toBeCalled();
	});
	it('should getSelectionStrategy method has to be called', () => {
		component.deviceProfile = userLocationMockData.deviceLocation;
		profileService.getUserLocation = jest.fn().mockReturnValue(of(userLocationMockData)) as any;
		jest.spyOn(component, 'setSelectedLocation');
		component.getSelectionStrategy();
		expect(component.setSelectedLocation).toBeCalled();
		expect(component.suggestionType).toBe('ipLocation');
	});
	it('should getSelectionStrategy method has to be called with user loggedin', () => {
		component.deviceProfile = userLocationMockData.deviceLocation;
		profileService.getUserLocation = jest.fn().mockReturnValue(of(userLocationMockData)) as any;
		jest.spyOn(component, 'setSelectedLocation');
		component.getSelectionStrategy();
	});

});
