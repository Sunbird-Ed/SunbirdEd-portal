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
			consent: true,
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
		// component.type = null;
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
		component.profileInfo =MockData.userProfileObj as any;
		component.type='abcd'
		component.ngOnInit();
		// jest.spyOn(component, 'getUserConsent');
		jest.spyOn(component, 'getUserInformation').mockReturnValue();
		component.ngOnInit();
		expect(component.getUserInformation).toHaveBeenCalled();
		// expect(component.getUserConsent).toHaveBeenCalled();
		expect(component.userInformation['name']).toEqual(`${MockData.userProfile.firstName} ${MockData.userProfile.lastName}`);
	});
	it('should set user Information', () => {
		csUserService.getConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		component.userService._userProfile = MockData.userProfile1 as any;
		component.collection = MockData.collection as any;
		component.profileInfo =MockData.userProfileObj as any;
		component.type='abcd'
		component.ngOnInit();
		jest.spyOn(component, 'getUserInformation').mockReturnValue();
		component.ngOnInit();
		expect(component.getUserInformation).toHaveBeenCalled();
		expect(component.userInformation['name']).toEqual(`${MockData.userProfile.firstName} ${MockData.userProfile.lastName}`);
	});
	it('should fetch tnc configuration', () => {
		jest.spyOn(tncService, 'getTncConfig').mockReturnValue(of(MockData.tncConfig) as any);
		jest.spyOn(utilService, 'parseJson').mockReturnValue(JSON.parse(MockData.tncConfig.result.response.value))
		component.fetchTncData();
		expect(component.termsAndConditionLink).toEqual('http://test.com/tnc.html');
	});
	it('should fetch tnc configuration', () => {
		jest.spyOn(tncService, 'getTncConfig').mockReturnValue(of(MockData.tncConfig) as any);
		jest.spyOn(utilService, 'parseJson').mockReturnValue(throwError(MockData.tncConfig.result.response.value))
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
		csUserService.updateConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any
		// jest.spyOn(component, 'updateUserConsent');
		jest.spyOn(component, 'toggleEditSetting');
		jest.spyOn(csUserService, 'updateConsent').mockReturnValue(of({
			'consent': {
				'userId': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad'
			},
			'message': 'User Consent updated successfully.'
		}));
		component.saveConsent();
		// expect(component.updateUserConsent).toHaveBeenCalled();
		expect(component.toggleEditSetting).toHaveBeenCalled();
	  });
	  it('should call saveConsent and as YES', () => {
		component.consentPii = 'Yes';
		csUserService.updateConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any
		// jest.spyOn(component, 'updateUserConsent');
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
	  it('should call checkQueryParams ', () => {
		component.type = 'course-consent';
		component.checkQueryParams();
		expect(component.showConsentPopup).toBe(true);
	  });
	  it('should call checkQueryParams ', () => {
		component.type = 'program-consent';
		component.checkQueryParams();
		expect(component.showConsentPopup).toBe(true);
	  });
	  describe("course-consent", () => {
	  it('should get getUserConsent', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'course-consent';
		csUserService.getConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		component.getUserConsent();
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	  it('should get getUserConsent with error', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'course-consent';
		csUserService.getConsent = jest.fn(() => throwError({code: 'HTTP_CLIENT_ERROR',response:{responseCode:404}}));
		component.getUserConsent();
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	  it('should get updateConsent', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'course-consent';
		csUserService.updateConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		component.updateUserConsent(true);
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	  it('should get updateConsent with type program-consent', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'program-consent';
		csUserService.updateConsent = jest.fn(() => throwError({code: 'HTTP_CLIENT_ERROR',response:{responseCode:404}}));
		component.updateUserConsent(true);
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	});
	  describe("global-consent", () => {
	  it('should get getUserConsent', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'global-consent';
		csUserService.updateUserDeclarations= jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		csUserService.getConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		component.getUserConsent();
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	  it('should get getUserConsent with error', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'global-consent';
		csUserService.updateUserDeclarations= jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		csUserService.getConsent = jest.fn(() => throwError({code: 'HTTP_CLIENT_ERROR'}));
		component.getUserConsent();
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	  it('should get getUserConsent with error', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'global-consent';
		csUserService.updateUserDeclarations= jest.fn(() => throwError({code: 'HTTP_CLIENT_ERROR'}));
		csUserService.getConsent = jest.fn(() => throwError({code: 'HTTP_CLIENT_ERROR'}));
		component.getUserConsent();
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	  it('should get updateConsent', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'global-consent';
		csUserService.updateConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		component.updateUserConsent(true);
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	});
	  describe("program-consent", () => {
	  it('should get getUserConsent', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'program-consent';
		csUserService.getConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		component.getUserConsent();
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
	  it('should get updateConsent', () => {
		userService._userProfile = MockData.userProfile  as any;;
		component.collection = MockData.collection  as any;;
		component.type = 'program-consent';
		csUserService.updateConsent = jest.fn().mockReturnValue(of(MockData.getConsentResponse)) as any;
		component.updateUserConsent(true);
		expect(component.isDataShareOn).toBe(false);
		expect(component.consentPii).toEqual('Yes');
	  });
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