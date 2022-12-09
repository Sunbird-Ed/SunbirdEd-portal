import { FormControl, FormGroup } from '@angular/forms';
import { UpdateContactComponent } from './update-contact.component';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@sunbird/shared';
import { TncService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { ResourceService } from '@sunbird/shared';
import { of as observableOf, Observable, throwError as observableThrowError } from 'rxjs';
import { TenantService, UserService, OtpService, OrgDetailsService } from '@sunbird/core';
import { mockUpdateContactData } from './update-contact.mock.spec.data'
import { NavigationHelperService, UtilService } from '../../../../../../shared/services';
import { SignupService } from '../../../../signup';

describe('UpdateContactComponent', () => {
    let component: UpdateContactComponent;

    const activatedRoute: Partial<ActivatedRoute> = {
        snapshot: mockUpdateContactData.snapshotData as any,
        queryParams: observableOf({ userId: 'mockUserId' })
    };
    const tenantService: Partial<TenantService> = {
        tenantData$: observableOf({ favicon: 'sample-favicon', tenantData: { logo: 'test' } }) as any
    };
    const resourceService: Partial<ResourceService> = {
        frmelmnts: mockUpdateContactData.resourceBundle.frmelmnts,
        messages: mockUpdateContactData.resourceBundle.messages
    };
    const userService: Partial<UserService> = {
        getUserByKey: jest.fn().mockReturnValue(observableOf(mockUpdateContactData.userData))
    };
    const otpService: Partial<OtpService> = {
        generateOTP: jest.fn().mockReturnValue(observableOf())
    };
    const toasterService: Partial<ToasterService> = {
        error: jest.fn()
    };
    const navigationHelperService: Partial<NavigationHelperService> = {
        getPageLoadTime: jest.fn()
    };
    const orgDetailsService: Partial<OrgDetailsService> = {
        getCustodianOrgDetails: jest.fn()
    };
    const utilService: Partial<UtilService> = {
        parseJson: jest.fn()
    };
    const signupService: Partial<SignupService> = {};
    const telemetryService: Partial<TelemetryService> = {
        interact: jest.fn(),
        log: jest.fn()
    };
    const tncService: Partial<TncService> = {
        getTncConfig: jest.fn().mockReturnValue(observableOf({
            'id': 'api',
            'params': {
                'status': 'success',
            },
            'responseCode': 'OK',
            'result': {
                'response': {
                    'id': 'tncConfig',
                    'field': 'tncConfig',
                    'value': '{"latestVersion":"v4","v4":{"url":}}'
                }
            }
        }))
    };

    beforeEach(() => {
        component = new UpdateContactComponent(

            activatedRoute as ActivatedRoute,
            tenantService as TenantService,
            resourceService as ResourceService,
            userService as UserService,
            otpService as OtpService,
            toasterService as ToasterService,
            navigationHelperService as NavigationHelperService,
            orgDetailsService as OrgDetailsService,
            utilService as UtilService,
            signupService as SignupService,
            telemetryService as TelemetryService,
            tncService as TncService,
        )
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show Merge confirmation after success otp verification', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        component.userDetails = {
            id: 'mockId'
        };
        component.handleOtpValidationSuccess();
        expect(component.showOtpComp).toEqual(false);
        expect(component.showMergeConfirmation).toEqual(true);
    });

    it('should redirect verified user', () => {
        jest.spyOn(component, 'getQueryParams');
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { assign: jest.fn() }
        });
        component.userDetails = {};
        component.handleOtpValidationSuccess();
        expect(component.getQueryParams).toHaveBeenCalled();
    });

    it('should reset form as otp validation failed', () => {
        component.handleOtpValidationFailed();
        expect(component).toBeTruthy();
        expect(component.showOtpComp).toEqual(false);
        expect(component.disableSubmitBtn).toEqual(true);
        expect(component.contactForm).toEqual({
            value: '',
            type: 'phone',
            tncAccepted: false
        });
        expect(component.userExist).toEqual(false);
        expect(component.userBlocked).toEqual(false);
    });

    it('should reset form as otp validation failed', (done) => {
        jest.spyOn(component, 'handleFormChangeEvent').mockImplementation();
        component.handleOtpValidationFailed();
        setTimeout(() => {
            expect(component.handleFormChangeEvent).toHaveBeenCalled();
            done()
        }, 100);
    });

    it('should return query params for given query object', () => {
        const test = component.getQueryParams({ queryParam1: 'mockValue' });
        expect(test).toEqual('?queryParam1=mockValue');
    });

    it('should not fail if query parmas are not send', () => {
        const test = component.getQueryParams({});
        expect(test).toEqual('?');
    });

    it('should reset form', () => {
        component.resetForm();
        expect(component.disableSubmitBtn).toEqual(true);
        expect(component.contactForm).toEqual({
            value: '',
            type: 'phone',
            tncAccepted: false
        });
        expect(component.userExist).toEqual(false);
        expect(component.userDetails).toEqual({});
        expect(component.userBlocked).toEqual(false);
    });

    it('should not throw error and not generate otp as root org id is different', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableOf(mockUpdateContactData.userData) as any);
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() => observableOf(mockUpdateContactData.nonCustOrgDetails) as any);
        component.onFormUpdate();
        expect(component.userExist).toEqual(true);
        expect(component.userBlocked).toEqual(false);
        expect(component.disableSubmitBtn).toEqual(true);
    });

    it('should not generate otp as user account blocked', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableThrowError(mockUpdateContactData.blockedUserError));
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() => observableOf(mockUpdateContactData.nonCustOrgDetails));
        component.onFormUpdate();
        expect(component.userExist).toEqual(false);
        expect(component.userBlocked).toEqual(true);
        expect(component.disableSubmitBtn).toEqual(true);
    });

    it('should not generate otp as an eror occured', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableThrowError({
            error: {
                params: {
                    status: 'I\'m a teapot'
                }
            }
        }));
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() => observableOf(mockUpdateContactData.nonCustOrgDetails));
        component.onFormUpdate();
        expect(component.disableSubmitBtn).toEqual(true);
        expect(component.captchaValidationFailed).toEqual(true);
    });

    it('should generate otp as user not found', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableThrowError(mockUpdateContactData.serverError) as any);
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() =>
            observableOf(mockUpdateContactData.nonCustOrgDetails));
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() => observableOf(mockUpdateContactData.successResponse) as any);
        component.onFormUpdate();
    });

    it('should not generate otp and throw error as phone is in use', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableThrowError(mockUpdateContactData.serverError));
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() =>
            observableOf(mockUpdateContactData.nonCustOrgDetails));
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() => observableThrowError(mockUpdateContactData.phoneAlreadyUsedError));
        jest.spyOn(toasterService, 'error').mockImplementation((value) => {
            return value;
        });
        component.onFormUpdate();
        expect(toasterService.error).toHaveBeenCalledWith('PHONE_ALREADY_IN_USE');
    });

    it('should not generate otp and throw error as email is in use', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableThrowError(mockUpdateContactData.serverError));
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() =>
            observableOf(mockUpdateContactData.nonCustOrgDetails));
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() => observableThrowError(mockUpdateContactData.emailAlreadyUsedError));
        jest.spyOn(toasterService, 'error').mockImplementation((value) => {
            return value;
        });
        component.onFormUpdate();
        expect(toasterService.error).toHaveBeenCalledWith('EMAIL_IN_USE');
    });

    it('should not generate otp and throw error as rate limit has exceed', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableThrowError(mockUpdateContactData.serverError));
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() =>
            observableOf(mockUpdateContactData.nonCustOrgDetails));
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() => observableThrowError(mockUpdateContactData.rateLimitExceed));
        jest.spyOn(toasterService, 'error').mockImplementation((value) => {
            return value;
        });
        component.onFormUpdate();
        expect(toasterService.error).toHaveBeenCalledWith('ERROR_RATE_LIMIT_EXCEEDED');
    });

    it('should not generate otp and throw error as server error', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableThrowError(mockUpdateContactData.serverError));
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() =>
            observableOf(mockUpdateContactData.nonCustOrgDetails));
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() => observableThrowError(mockUpdateContactData.serverError));
        jest.spyOn(toasterService, 'error').mockImplementation((value) => {
            return value;
        });
        component.onFormUpdate();
        expect(toasterService.error).toHaveBeenCalledWith(mockUpdateContactData.resourceBundle.messages.fmsg.m0085);
    });

    it('should generate otp as user org id is same for email id', () => {
        component.contactForm.type = 'email';
        component.contactForm.value = 'test@gmail.com';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() => observableOf(mockUpdateContactData.userData) as Observable<any>);
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() =>
            observableOf(mockUpdateContactData.custOrgDetails));
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() => observableOf(mockUpdateContactData.successResponse) as Observable<any>);
        component.onFormUpdate();
        expect(component.userDetails).toEqual(mockUpdateContactData.userData.result.response);
        expect(component.userExist).toEqual(false);
        expect(component.userBlocked).toEqual(false);
        expect(component.disableSubmitBtn).toEqual(false);
    });

    it('should generate otp as user org id is same for phone number', () => {
        component.contactForm.type = 'phone';
        component.contactForm.value = '7896541257';
        jest.spyOn(userService, 'getUserByKey').mockImplementation(() =>
            observableOf(mockUpdateContactData.userData) as Observable<any>);
        jest.spyOn(orgDetailsService, 'getCustodianOrgDetails').mockImplementation(() =>
            observableOf(mockUpdateContactData.custOrgDetails));
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() =>
            observableOf(mockUpdateContactData.successResponse) as Observable<any>);
        component.onFormUpdate();
        expect(component.userDetails).toEqual(mockUpdateContactData.userData.result.response);
        expect(component.userExist).toEqual(false);
        expect(component.userBlocked).toEqual(false);
        expect(component.disableSubmitBtn).toEqual(false);
    });

    it('initiate instance with SUNBIRD', () => {
        jest.spyOn(component, 'fetchTncConfiguration');
        component.ngOnInit();
        expect(component.instance).toEqual('SUNBIRD');
        expect(component.fetchTncConfiguration).toHaveBeenCalled();
    });

    it('initiate instance with SUNBIRD without captcha', () => {
        jest.spyOn(component, 'fetchTncConfiguration');
        let mockElement = (<HTMLInputElement>document.createElement('p1reCaptchaEnabled'));
        mockElement.value = "false";
        jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
        component.ngOnInit();
        expect(component.instance).toEqual('SUNBIRD');
        expect(component.fetchTncConfiguration).toHaveBeenCalled();
    });

    it('should toggle tnc checkboc if already false', () => {
        jest.spyOn(telemetryService, 'interact');
        component.toggleTncCheckBox({ target: { checked: true } });
        expect(component.contactForm.tncAccepted).toEqual(true);
        expect(telemetryService.interact).toHaveBeenCalledWith(mockUpdateContactData.interactEDataSelected);
    });

    it('should toggle tnc checkboc', () => {
        jest.spyOn(telemetryService, 'interact');
        component.toggleTncCheckBox({ target: { checked: false } });
        expect(component.contactForm.tncAccepted).toEqual(false);
        expect(telemetryService.interact).toHaveBeenCalledWith(mockUpdateContactData.interactEDataUnSelected);
    });

    it('should fetch tnc configuration', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableOf(mockUpdateContactData.tncConfig) as any)
        jest.spyOn(telemetryService, 'log');
        component.fetchTncConfiguration();
        expect(telemetryService.log).toHaveBeenCalledWith(mockUpdateContactData.telemetryLogSuccess);
    });

    it('should fetch tnc configuration and throw error as cannot parse data', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableOf(mockUpdateContactData.tncConfigIncorrectData) as any);
        jest.spyOn(toasterService, 'error');
        component.fetchTncConfiguration();
        expect(toasterService.error).toHaveBeenCalledWith(mockUpdateContactData.resourceBundle.messages.fmsg.m0004);
    });

    it('should fetch tnc configuration and throw error', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableThrowError(mockUpdateContactData.tncConfigIncorrectData) as any);
        jest.spyOn(toasterService, 'error');
        component.fetchTncConfiguration();
        expect(toasterService.error).toHaveBeenCalledWith(mockUpdateContactData.resourceBundle.messages.fmsg.m0004);
    });

    it('should show tnc popup if given mode is true', () => {
        component.showAndHidePopup(true);
        expect(component.showTncPopup).toBe(true);
    });

    it('should not show tnc popup if given mode is false', () => {
        component.showAndHidePopup(false);
        expect(component.showTncPopup).toBe(false);
    });

    it('should submit form when captcha enabled', () => {
        component.isP1CaptchaEnabled = 'true';
        jest.spyOn(component, 'resetGoogleCaptcha');
        jest.spyOn(component, 'resolved').mockImplementation(() => true);
        component.submitForm();
        expect(component.resetGoogleCaptcha).toHaveBeenCalled();
    });

    it('should submit form when captcha is not enabled', () => {
        component.isP1CaptchaEnabled = 'false';
        jest.spyOn(component, 'onFormUpdate');
        component.submitForm();
        expect(component.onFormUpdate).toHaveBeenCalled();
    });

    it('should receive response from captcha', () => {
        component.isP1CaptchaEnabled = 'true';
        jest.spyOn(component, 'onFormUpdate').mockImplementation(() => true);
        component.resolved(mockUpdateContactData.captchaToken);
        expect(component.onFormUpdate).toHaveBeenCalledWith(mockUpdateContactData.captchaToken);
    });

    it("should call ngAfterViewInit", (done) => {
        jest.spyOn(component, 'handleFormChangeEvent').mockImplementation();
        component.ngAfterViewInit();
        setTimeout(() => {
            expect(component.handleFormChangeEvent).toHaveBeenCalled();
            done()
        });
    });

    it("should call handleFormChangeEvent", () => {
        // @ts-ignore
        component.contactDetailsForm = new FormGroup({
            value: new FormControl('12345'),
            type: new FormControl('phone'),
            tncAccepted: new FormControl(true),
            status: new FormControl('VALID'),
        })
        component.handleFormChangeEvent();
        // @ts-ignore
        component.contactDetailsForm.valueChanges.subscribe((data, data2) => {
            expect(component.disableSubmitBtn).toBeFalsy();
        })
    })
});