import { Component, Inject, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Consent, ConsentStatus } from '@project-sunbird/client-services/models';
import { CsUserService } from '@project-sunbird/client-services/services/user/interface';
import { TncService, UserService, CoursesService, GeneraliseLabelService } from '@sunbird/core';
import { ResourceService, ServerResponse, ToasterService, UtilService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { Subject, of, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PopupControlService } from '../../../../service/popup-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConsentPiiComponent } from './global-consent-pii.component';
import { MockData } from './global-consent-pii.component.spec.data';

describe('GlobalConsentPiiComponent', () => {
	let component: GlobalConsentPiiComponent;

	const csUserService: Partial<CsUserService> = {
		getConsent: jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any,
		updateConsent:jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any
	};
	const toasterService: Partial<ToasterService> = {
		error: jest.fn(),
		success: jest.fn()
	};
	const userService: Partial<UserService> = {
		loggedIn: true,
		slug: jest.fn().mockReturnValue("tn") as any,
		userData$: of({ userProfile: MockData.userProfile as any }) as any,
		setIsCustodianUser: jest.fn(),
		userid: 'sample-uid',
		appId: 'sample-id',
		getServerTimeDiff: '',
		userProfile: MockData.userProfile as any
	};
	const resourceService: Partial<ResourceService> = {
		messages: {
			fmsg: {
				m0004: 'Could not fetch data, try again later'
			}
		}
	};
	const tncService: Partial<TncService> = {
		getTncConfig: jest.fn()
	};
	const utilService: Partial<UtilService> = {
		parseJson: jest.fn()
	};
	const popupControlService: Partial<PopupControlService> = {
		changePopupStatus: jest.fn()
	};
	const activatedRoute: Partial<ActivatedRoute> = {
		queryParams: of({
			id: 'sample-id',
			utm_campaign: 'utm_campaign',
			utm_medium: 'utm_medium',
			clientId: 'android',
			context: JSON.stringify({ data: 'sample-data' })
		})
	};
	const coursesService: Partial<CoursesService> = {
		revokeConsent: new EventEmitter<any>()
	};
	const router: Partial<Router> = {};
	const generaliseLabelService: Partial<GeneraliseLabelService> = {};

	beforeAll(() => {
		component = new GlobalConsentPiiComponent(
			csUserService as CsUserService,
			toasterService as ToasterService,
			userService as UserService,
			resourceService as ResourceService,
			tncService as TncService,
			utilService as UtilService,
			popupControlService as PopupControlService,
			activatedRoute as ActivatedRoute,
			coursesService as CoursesService,
			router as Router,
			generaliseLabelService as GeneraliseLabelService
		)
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should create a instance of component', () => {
		expect(component).toBeTruthy();
	});
	it('should set user Information', () => {
		csUserService.getConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		component.userService._userProfile = MockData.userProfile as any;
		component.collection = MockData.collection as any;
		component.ngOnInit();
		jest.spyOn(component, 'getUserConsent');
		jest.spyOn(component, 'getUserInformation').mockReturnValue();
		component.ngOnInit();
		expect(component.getUserInformation).toHaveBeenCalled();
		expect(component.getUserConsent).toHaveBeenCalled();
		expect(component.userInformation['name']).toEqual(`${MockData.userProfile.firstName} ${MockData.userProfile.lastName}`);
	});
	it('should fetch tnc configuration', () => {
		jest.spyOn(tncService, 'getTncConfig').mockReturnValue(of(MockData.tncConfig) as any);
		jest.spyOn(utilService, 'parseJson').mockReturnValue(JSON.parse(MockData.tncConfig.result.response.value))
		component.fetchTncData();
		expect(component.termsAndConditionLink).toEqual('http://test.com/tnc.html');
	});
	it('should not fetch tnc configuration and throw error', () => {
		jest.spyOn(toasterService, 'error');
		jest.spyOn(tncService, 'getTncConfig').mockReturnValue(throwError(MockData.tncConfig));
		component.fetchTncData();
		expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0004);
	});
	it('should fetch tnc configuration and throw error as cannot parse data', () => {
		jest.spyOn(tncService, 'getTncConfig').mockReturnValue(throwError(MockData.tncConfigIncorrectData));
		jest.spyOn(toasterService, 'error')
		component.fetchTncData();
		expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0004);
	});
	it('should call toggleEditSetting', () => {
		component.editSetting = false;
		component.toggleEditSetting();
		expect(component.editSetting).toBe(true);
	});

	it('should call showAndHidePopup', () => {
		component.showAndHidePopup(true);
		expect(component.showTncPopup).toBe(true);
	});
	it('should call saveConsent and as NO', () => {
		component.consentPii = 'No';
		jest.spyOn(component, 'updateUserConsent');
		jest.spyOn(component, 'toggleEditSetting');
		jest.spyOn(csUserService, 'updateConsent').mockReturnValue(of({
			'consent': {
				'userId': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad'
			},
			'message': 'User Consent updated successfully.'
		}));
		component.saveConsent();
		expect(component.updateUserConsent).toHaveBeenCalled();
		expect(component.toggleEditSetting).toHaveBeenCalled();
	  });
	  it('should call saveConsent and as YES', () => {
		component.consentPii = 'Yes';
		jest.spyOn(component, 'updateUserConsent');
		jest.spyOn(component, 'toggleEditSetting');
		jest.spyOn(csUserService, 'updateConsent').mockReturnValue(of({
			'consent': {
				'userId': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad'
			},
			'message': 'User Consent updated successfully.'
		}));
		component.saveConsent();
		expect(component.showConsentPopup).toBe(true);
		expect(component.toggleEditSetting).toHaveBeenCalled();
	  });
	  it('should get getUserConsent', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.getUserConsent();
		jest.spyOn(csUserService, 'getConsent').mockReturnValue(of(MockData.getConsentResponse)as any);
		component.getUserConsent();
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	describe("ngOnDestroy", () => {
		it('should destroy sub', () => {
			component.unsubscribe = {
				next: jest.fn(),
				complete: jest.fn()
			} as any;
			component.profileDetailsModal = {
				deny: jest.fn()
			  };
			component.ngOnDestroy();
			expect(component.unsubscribe.next).toHaveBeenCalled();
			expect(component.unsubscribe.complete).toHaveBeenCalled();
			expect(component.profileDetailsModal.deny).toHaveBeenCalled();
		});
	});
});