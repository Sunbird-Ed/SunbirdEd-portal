import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CsUserService } from '@project-fmps/client-services/services/user/interface';
import { CoreModule, FormService, OtpService, SearchService, TncService, UserService } from '@sunbird/core';
import { ProfileService } from '@sunbird/profile';
import {
    BrowserCacheTtlService, ConfigService,
    NavigationHelperService, ResourceService,
    SharedModule, ToasterService
} from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { Observable, of as observableOf, of, Subject, throwError } from 'rxjs';
import { LayoutService, UtilService } from '../../../../modules/shared';
import { SubmitTeacherDetailsComponent } from './submit-teacher-details.component';
import { mockRes } from './submit-teacher-details.component.spec.data';
import * as _ from "lodash-es";

xdescribe('SubmitTeacherDetailsComponent', () => {
    let component: SubmitTeacherDetailsComponent;

    const csUserService: Partial<CsUserService> = {
        updateConsent: jest.fn()
    };
    const activatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: {
                telemetry: {
                    env: 'profile', pageid: 'teacher-declaration', type: 'view',
                    uri: '/profile/teacher-declaration',
                }
            }, queryParams: { formaction: 'submit' }
        } as any
    };
    const telemetryService: Partial<TelemetryService> = {
        impression: jest.fn(),
        log: jest.fn(),
        interact: jest.fn(),
        audit: jest.fn()
    };
    const resourceService: Partial<ResourceService> = {
        'frmelmnts': {
            'lbl': {
                'resentOTP': 'OTP resent',
                unableToUpdateEmail: 'unableToUpdateEmail',
                wrongEmailOTP: 'wrongEmailOTP',
                wrongPhoneOTP: 'wrongPhoneOTP',
                unableToUpdateMobile: 'unableToUpdateMobile'
            },
            instn: {
                t0084: 't0084',
                t0083: 't0083',
            }
        },

        'messages': {
            'fmsg': {
                'm0085': 'There is some technical error',
                'm0004': 'Something went wrong, try later',
                'm0051': 'm0051'
            },
            'stmsg': {
                'm0130': 'We are fetching districts',
            },
            'emsg': {
                'm0005': 'Something went wrong, try later',
                'm0018': 'error',
                'm0016': 'error',
                'm0017': 'error',
                'm0051': 'Teacher declaration submission failed',
                'm0052': 'Teacher declaration updation failed',
            },
            'smsg': {
                'm0046': 'Profile updated successfully',
                'm0037': 'Updated'
            }
        },
    };
    const toasterService: Partial<ToasterService> = {
        error: jest.fn(),
        success: jest.fn()
    };
    const profileService: Partial<ProfileService> = {
        declarations: jest.fn(),
        getSelfDeclarationForm: jest.fn(),
        getPersonaTenantForm: jest.fn()
    };
    const userService: Partial<UserService> = {
        userData$: of({ err: null, userProfile: mockRes.userData.result.response as any }) as any,
    };
    const formService: Partial<FormService> = {};
    const router: Partial<Router> = {
        navigate: jest.fn()
    };
    const navigationHelperService: Partial<NavigationHelperService> = {
        getPageLoadTime: jest.fn(),
        goBack: jest.fn()
    };
    const otpService: Partial<OtpService> = {
        generateOTP: jest.fn()
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
    const utilService: Partial<UtilService> = {
        parseJson: jest.fn()
    };
    const layoutService: Partial<LayoutService> = {
        initlayoutConfig: jest.fn(),
        switchableLayout: jest.fn(() => of([{ data: 'demo' }]))
    };


    const fakeActivatedRoute = {
        snapshot: {
            data: {
                telemetry: {
                    env: 'profile', pageid: 'teacher-declaration', type: 'view',
                    uri: '/profile/teacher-declaration',
                }
            }, queryParams: { formaction: 'submit' }
        }
    };
    
    const MockCSService = {
        updateConsent() { return of({}); },
        getConsent() { return of({}); }
    };

    beforeEach(() => {
        component = new SubmitTeacherDetailsComponent(
            csUserService as CsUserService,
            activatedRoute as ActivatedRoute,
            telemetryService as TelemetryService,
            resourceService as ResourceService,
            toasterService as ToasterService,
            profileService as ProfileService,
            userService as UserService,
            formService as FormService,
            router as Router,
            navigationHelperService as NavigationHelperService,
            otpService as OtpService,
            tncService as TncService,
            utilService as UtilService,
            layoutService as LayoutService,
        )
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should be create a instance of unroll batch component', () => {
        expect(component).toBeTruthy();
    });
   it('should call ngOnInit', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableOf(mockRes.tncConfig) as Observable<any>);
        jest.spyOn(telemetryService, 'impression');
        jest.spyOn(component, 'setTelemetryData');
        component.ngOnInit();
        expect(telemetryService.impression).toHaveBeenCalled();
        expect(component.setTelemetryData).toHaveBeenCalled();
    });

   it('should call setTelemetryData', () => {
        component.formAction = 'update';
        component.setTelemetryData();
        expect(component.submitInteractEdata).toEqual({ id: 'submit-teacher-details', type: 'click', pageid: 'teacher-declaration' });
        expect(component.cancelInteractEdata).toEqual({ id: 'cancel-update-teacher-details', type: 'click', pageid: 'teacher-declaration' });
        expect(component.submitDetailsInteractEdata).toEqual({ id: 'teacher-details-submit-success', type: 'click', pageid: 'teacher-declaration' });
    });


   it('should get location details', () => {
        component.userProfile = mockRes.userData.result.response;
        component.getLocations();
        expect(component.selectedState).toBeDefined();
        expect(component.selectedDistrict).toBeDefined();
    });

   it('should fetch tnc configuration', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableOf(mockRes.tncConfig) as any)
        jest.spyOn(telemetryService, 'log');
        component.fetchTncData();
    });

   it('should fetch tnc configuration and throw error as cannot parse data', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableOf(mockRes.tncConfigIncorrectData) as any);
        jest.spyOn(toasterService, 'error');
        component.fetchTncData();
    });

   it('should fetch tnc configuration and throw error', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(throwError(mockRes.tncConfigIncorrectData) as any);
        jest.spyOn(toasterService, 'error');
        component.fetchTncData();
    });

   it('should show tnc popup if given mode is true', () => {
        component.showAndHidePopup(true);
        expect(component.showTncPopup).toBe(true);
    });

   it('should not show tnc popup if given mode is false', () => {
        component.showAndHidePopup(false);
        expect(component.showTncPopup).toBe(false);
    });

   it('should closed popup as otp verification failed', () => {
        component.onOtpVerificationError({});
        expect(component.isOtpVerificationRequired).toBe(false);
    });

   it('should closed popup as event fired', () => {
        component.onOtpPopupClose();
        expect(component.isOtpVerificationRequired).toBe(false);
    });

   it('should get proper field type phone', () => {
        const fieldType = component.getFieldType({ phone: '22' });
        expect(fieldType).toBe('declared-phone');
    });

   it('should get proper field type email', () => {
        const fieldType = component.getFieldType({ email: '22' });
        expect(fieldType).toBe('declared-email');
    });

   it('should generate otp for email', () => {
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() => observableOf(mockRes.successResponse) as Observable<any>);
        component.generateOTP('declared-email', 'xyz@yopmail.com');
        expect(component.isOtpVerificationRequired).toBe(true);
        expect(component.otpData.instructions).toBe(resourceService.frmelmnts.instn.t0084);
        expect(component.otpData.type).toBe('email');
    });

   it('should generate otp for phone', () => {
        jest.spyOn(otpService, 'generateOTP').mockImplementation(() => observableOf(mockRes.successResponse) as Observable<any>);
        component.generateOTP('declared-phone', '901100110011');
        expect(component.isOtpVerificationRequired).toBe(true);
        expect(component.otpData.instructions).toBe(resourceService.frmelmnts.instn.t0083);
        expect(component.otpData.type).toBe('phone');
    });

   it('should not validate user as otp generation failed', () => {
        jest.spyOn(toasterService, 'error');
        jest.spyOn(otpService, 'generateOTP').mockReturnValue(throwError({}));
        component.generateOTP('declared-phone', '901100110011');
        expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0051);
    });

   it('should set validators for phone', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableOf(mockRes.tncConfig) as Observable<any>);
        jest.spyOn(telemetryService, 'impression');
        component.userProfile = mockRes.userData.result.response;
        component.ngOnInit();
    });

   it('should set form data and user profile email from user profile', () => {
        jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableOf(mockRes.tncConfig) as Observable<any>);
        jest.spyOn(telemetryService, 'impression');
        component.ngOnInit();
        expect(component.validationType['declared-email'].isVerified).toBe(false);
    });

   it('should call updateProfile with success', () => {
        component.formAction = 'update';
        jest.spyOn(profileService, 'declarations').mockReturnValue(observableOf(mockRes.updateProfile));
        jest.spyOn(toasterService, 'success');
        jest.spyOn(component, 'navigateToProfile');
        component.updateProfile('');
        expect(toasterService.success).toHaveBeenCalledWith(resourceService.messages.smsg.m0037);
        expect(component.navigateToProfile).toHaveBeenCalled();
    });

   it('should call updateProfile with success modal and log audit event for tnc ', () => {
        component.formAction = 'submit';
        component.declaredLatestFormValue = { tnc: true };
        jest.spyOn(profileService, 'declarations').mockReturnValue(observableOf(mockRes.updateProfile));
        jest.spyOn(component, 'logAuditEvent');
        component.updateProfile('');
        expect(component.logAuditEvent).toHaveBeenCalled();
    });

   it('should call updateProfile with error while submit form', () => {
        jest.spyOn(profileService, 'declarations').mockReturnValue(throwError({}));
        jest.spyOn(toasterService, 'error');
        jest.spyOn(component, 'navigateToProfile');
        component.formAction = 'submit';
        component.updateProfile('');
        expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0051);
        expect(component.navigateToProfile).toHaveBeenCalled();
    });

   it('should call updateProfile with error while update form', () => {
        jest.spyOn(profileService, 'declarations').mockReturnValue(throwError({}));
        jest.spyOn(toasterService, 'error');
        jest.spyOn(component, 'navigateToProfile');
        component.formAction = 'update';
        component.updateProfile('');
        expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0052);
        expect(component.navigateToProfile).toHaveBeenCalled();
    });

   it('should update Telemetry on updating field', () => {
        component.declaredDetails = mockRes.userData.result.response.declarations[0];
        component.formAction = 'update';
        const updateTelemetry = component.getUpdateTelemetry();
        expect(updateTelemetry).toBeDefined();
    });

   it('should update Telemetry on updating field for declared value', () => {
        component.declaredDetails = mockRes.userData.result.response.declarations[0];
        component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
        component.formAction = 'update';
        const updateTelemetry = component.getUpdateTelemetry();
        expect(updateTelemetry).toBeDefined();
    });

   it('should call goBack', () => {
        component.goBack();
    });

   it('should call closeConsentPopUp', () => {
        component.closeConsentPopUp();
        expect(component.showGlobalConsentPopUpSection).toBeFalsy();
        expect(component.isglobalConsent).toBeFalsy();
        expect(component.globalConsent).toEqual('');
    });


   it('should navigateToProfile and redirect to profile page while updating', () => {
        component.navigateToProfile();
        expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

   it('should close Success modal and redirect to profile page while submitting', () => {
        component.modal = {
            deny: jest.fn()
        };
        component.closeSuccessModal();
        expect(component.modal.deny).toHaveBeenCalled();
        expect(component.showSuccessModal).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

   it('Show verification confirmed in UI, on verification success', () => {
        jest.spyOn(component, 'setOtpValidation');
        component.otpConfirm = new Subject();
        jest.spyOn(component.otpConfirm, 'next');
        jest.spyOn(component.otpConfirm, 'complete');
        component.onVerificationSuccess({});
        expect(component.setOtpValidation).toHaveBeenCalledWith(false);
        expect(component.otpConfirm.next).toHaveBeenCalledWith(true);
        expect(component.otpConfirm.complete).toHaveBeenCalled();
    });

   it('should log audit event', () => {
        jest.spyOn(telemetryService, 'audit');
        component.logAuditEvent();
        expect(telemetryService.audit).toHaveBeenCalled();
    });

   it('Should show Terms and condition popup', () => {
        component.linkClicked(
            {
                event: { preventDefault: jest.fn() },
                data: { url: 'https://dev.sunbirded.org/profile' }
            });
        expect(component.showTncPopup).toBe(true);
    });

   it('should update tenant-persona form status', () => {
        component.tenantPersonaFormStatusChanges({ valid: true });
        expect(component.isTenantPersonaFormValid).toBe(true);
    });

   it('should update declaration form status', () => {
        component.declarationFormStatusChanges({ isValid: true });
        expect(component.isDeclarationFormValid).toBe(true);
    });

   it('should get getTeacherDetails Form, on success', () => {
        jest.spyOn(profileService, 'getSelfDeclarationForm').mockReturnValue(of({}));
        jest.spyOn(component, 'initializeFormData');
        component.getTeacherDetailsForm()
        expect(profileService.getSelfDeclarationForm).toHaveBeenCalled();
        expect(component.initializeFormData).toHaveBeenCalled();
    });

   it('should get getTeacherDetails Form, on error', () => {
        jest.spyOn(profileService, 'getSelfDeclarationForm').mockReturnValue(throwError({}));
        jest.spyOn(toasterService, 'error');
        jest.spyOn(component, 'initializeFormData');
        component.getTeacherDetailsForm();
        expect(profileService.getSelfDeclarationForm).toHaveBeenCalled();
        expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try later');
    });

   it('should get teacher details form if tenant-persona form filled', () => {
        component.selectedTenant = '01259339426316288055';
        jest.spyOn(component, 'getTeacherDetailsForm');
        component.tenantPersonaFormValueChanges({ persona: 'teacher', tenant: '01259339426316288054' });
        expect(component.tenantPersonaLatestFormValue).toEqual({ persona: 'teacher', tenant: '01259339426316288054' });
        expect(component.selectedTenant).toEqual('01259339426316288054');
        expect(component.getTeacherDetailsForm).toHaveBeenCalled();
        expect(component.isTenantChanged).toBeTruthy();
    });

   it('should get teacher details form if tenant-persona form filled', () => {
        jest.spyOn(component, 'getTeacherDetailsForm');
        component.tenantPersonaFormValueChanges({ persona: 'teacher', tenant: '01259339426316288054' });
        expect(component.tenantPersonaLatestFormValue).toEqual({ persona: 'teacher', tenant: '01259339426316288054' });
        expect(component.selectedTenant).toEqual('01259339426316288054');
        expect(component.getTeacherDetailsForm).toHaveBeenCalled();
        expect(component.isTenantChanged).toBeFalsy();
    });

   it('should call declarationFormValueChanges', () => {
        const event = {
            'externalIds': '',
            'children': {
                'externalIds': {
                    'declared-state': 'Maharashtra'
                }
            }
        };
        component.declarationFormValueChanges(event);
        expect(component.selectedStateCode).toEqual('Maharashtra');
    });

   it('should call declarationFormValueChanges check for state selected', () => {
        component.selectedStateCode = "Maharashtra"
        const event = {
            'externalIds': '',
            'children': {
                'externalIds': {
                    'declared-state': 'Karnataka'
                }
            }
        };
        component.declarationFormValueChanges(event);
        expect(component.selectedStateCode).toEqual('Karnataka');
    });

   it('should return declaration form object', () => {
        const declarationDetails = {
            'declared-phone': '8698645680',
            'declared-email': 'pdf_test@yopmail.com',
            'declared-school-name': 'abcd',
            'declared-school-udise-code': 'cdd',
            'declared-ext-id': 'cdd'
        };
        const tenantPersonaDetails = {
            'persona': 'teacher',
            'tenant': '01259339426316288054'
        };
        component.userProfile = { userId: 'db2c95fe-7ef5-4ef8-a3c9-7e84994da762' };
        const response = {
            operation: 'edit',
            userId: 'db2c95fe-7ef5-4ef8-a3c9-7e84994da762',
            orgId: '01259339426316288054',
            persona: 'teacher',
            info: declarationDetails
        };
        const resp = component['getDeclarationReqObject']('edit', declarationDetails, tenantPersonaDetails);
        expect(resp).toEqual(response);
    });

   it('should initialize formData', () => {
        component.formAction = 'update';
        component.userProfile = mockRes.userData.result.response;
        // @ts-ignore
        jest.spyOn(component, 'assignDefaultValue');
        component.initializeFormData(mockRes.declarationFormConfig);
        expect(component.teacherDetailsForm).toBeDefined();
        expect(component['assignDefaultValue']).toHaveBeenCalled();
    });

   it('should initialize formData for selected state', () => {
        component.formAction = 'update';
        component.userProfile = mockRes.userData.result.response;
        component.selectedState = 'ka'
        // @ts-ignore
        jest.spyOn(component, 'assignDefaultValue');
        component.initializeFormData(mockRes.declarationFormConfig);
        expect(component.teacherDetailsForm).toBeDefined();
        expect(component['assignDefaultValue']).toHaveBeenCalled();
    });

   it('should assign default value', () => {
        component.userProfile = mockRes.userData.result.response;
        let childConfig = mockRes.declarationFormConfig[3].children[1];

        component.userProfile.declarations = [{
            'info': { 'test': 'test' }
        }
        ]
        component.formAction = 'submit'
        // @ts-ignore
        component.assignDefaultValue(childConfig)
        expect(childConfig).toBeDefined()
    });

   it('should get persona and tenant form details, on success', () => {
        component.userProfile = mockRes.userData.result.response;
        component.userProfile.declarations = [
            {
                'persona': 'teacher',
                'orgId': '01259339426316288054',
            }
        ];
        component.selectedTenant = '01259339426316288054';
        jest.spyOn(profileService, 'getPersonaTenantForm').mockReturnValue(of(mockRes.personaTenantForm));
        jest.spyOn(component, 'getTeacherDetailsForm');
        component.getPersonaTenant();
        expect(profileService.getPersonaTenantForm).toHaveBeenCalled();
        expect(component.tenantPersonaForm).toBeDefined();
        expect(component.getTeacherDetailsForm).toHaveBeenCalled();
    });

   it('should get persona and tenant form details, on success and no selected tenant', () => {
        component.userProfile = mockRes.userData.result.response;
        component.userProfile.declarations = [
            {
                'persona': 'teacher',
            }
        ];
        component.selectedTenant = '01259339426316288054';
        jest.spyOn(profileService, 'getPersonaTenantForm').mockReturnValue(of(mockRes.personaTenantForm));
        jest.spyOn(component, 'getTeacherDetailsForm');
        component.getPersonaTenant();
        expect(profileService.getPersonaTenantForm).toHaveBeenCalled();
        expect(component.tenantPersonaForm).toBeDefined();
    });

   it('should get persona and tenant form details, on error', () => {
        jest.spyOn(toasterService, 'error');
        jest.spyOn(component, 'navigateToProfile');
        jest.spyOn(profileService, 'getPersonaTenantForm').mockReturnValue(throwError({}));
        component.getPersonaTenant();
        expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try later');
        expect(component.navigateToProfile).toHaveBeenCalled();
    });

   it('should assign default value', () => {
        component.formAction = 'submit';
        component.userProfile = { declarations: [{ info: { 'declared-phone': '8899009988' } }], maskedPhone: '99***90' };
        const resp = component['assignDefaultValue'](mockRes.phoneConfig);
        const resChildConfig: any = mockRes.phoneConfig;
        resChildConfig.default = '99***90';
        expect(resChildConfig).toEqual(resp);
    });

   it('should define mobile field validation', () => {
        const resp = component.mobileVerificationAsyncFactory(mockRes.mobileFormElement as any, {}, '');
        resp('MOBILE_OTP_VALIDATION', { type: 'submit' })({} as any);
        expect(resp).toBeDefined();
    });

   it('should define mobile field validation', () => {
        const resp = component.mobileVerificationAsyncFactory(mockRes.mobileFormElement as any, {}, '');
        resp('MOBILE_OTP_VALIDATION', { type: 'submit' })({ value: 'test@yopmail.com' } as any);
        expect(resp).toBeDefined();
    });

   it('should define email field validation', () => {
        const resp = component.emailVerificationAsyncFactory(mockRes.mobileFormElement as any, {}, '');
        resp('EMAIL_OTP_VALIDATION', { type: 'submit' })({} as any);
        expect(resp).toBeDefined();
    });

   it('should define mobile field validation', () => {
        const resp = component.emailVerificationAsyncFactory({} as any, {}, '');
        resp('EMAIL_OTP_VALIDATION', { type: 'submit' })({ value: 'test@yopmail.com' } as any);
        expect(resp).toBeDefined();
    });

   it('should call getProfileInfo', () => {
        let declarations = [
            {
                'persona': 'volunteer',
                'errorType': null,
                'orgId': '013016492159606784174',
                'status': 'PENDING',
                'info': {
                    'declared-email': 'dev-user-10@yopmail.com',
                    'declared-ext-id': 'EKL12345',
                    'declared-phone': '8867003222',
                    'declared-school-name': 'Ekstep dev school',
                    'declared-school-udise-code': '12312312311',
                    'type': 'Kendria Vidhyalaya 1'
                }
            }
        ]
        component.getProfileInfo(declarations)
        expect(component.profileInfo).toBeDefined();
    });
   it('should return if the form does not have the latest value', () => {
        jest.spyOn(toasterService, 'error');
        component.submit();
        expect(toasterService.error).toHaveBeenCalledWith('m0051');
    });

   it('should call ngOnDestroy', () => {
        jest.spyOn(component.unsubscribe, 'complete');
        jest.spyOn(component.unsubscribe, 'next');
        component.modal = {
            deny: jest.fn()
        };
        component.ngOnDestroy();
        expect(component.unsubscribe.complete).toHaveBeenCalled();
        expect(component.unsubscribe.next).toHaveBeenCalled();
        expect(component.modal.deny).toHaveBeenCalled();
    });

   xit('shouldnupdate the profile  info', () => {
        component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
        component.tenantPersonaLatestFormValue = mockRes.tenantPersonaLatestFormValue;
        // // @ts-ignore
        jest.spyOn(component, 'getProfileInfo');
        jest.spyOn(component, 'updateProfile');
        component.userProfile = {};
        component.submit();
        expect(component.updateProfile).toHaveBeenCalled();
    });

   xit('should update the profile when no declaration present', () => {
        component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
        component.tenantPersonaLatestFormValue = mockRes.tenantPersonaLatestFormValue;
        // @ts-ignore
        jest.spyOn(component, 'getProfileInfo');
        jest.spyOn(component, 'updateProfile');
        component.formAction = 'submit';

        component.userProfile = { declarations: [] };
        component.submit();
        expect(component.updateProfile).toHaveBeenCalled();
    });

   xit('should update the profile successfully', () => {
        component.userProfile = { declarations: [] };
        component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
        component.tenantPersonaLatestFormValue = mockRes.tenantPersonaLatestFormValue;
        component.formAction = 'update';
        component.isTenantChanged = true;
        // @ts-ignore

        jest.spyOn(component, 'getDeclarationReqObject');
        jest.spyOn(component, 'getProfileInfo');
        jest.spyOn(component, 'updateProfile');
        component.submit();
        expect(component['getDeclarationReqObject']).toHaveBeenCalled();
        expect(component.updateProfile).toHaveBeenCalled();
    });

   xit('should update the profile successfully for edit operation', () => {
        component.userProfile = { declarations: [] };
        component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
        component.userProfile.declarations = [
            {
                'persona': 'teacher',
                'orgId': '01259339426316288054',
            }
        ]
        component.tenantPersonaLatestFormValue = mockRes.tenantPersonaLatestFormValue;
        jest.spyOn(_, 'get');
        component.formAction = 'update';
        component.isTenantChanged = true;
        // @ts-ignore

        jest.spyOn(component, 'getDeclarationReqObject');
        jest.spyOn(component, 'getProfileInfo');
        jest.spyOn(component, 'updateProfile');
        component.submit();
        expect(component['getDeclarationReqObject']).toHaveBeenCalled();
        expect(component.updateProfile).toHaveBeenCalled();
    });


   xit('should update the profile successfully for add operation', () => {
        component.userProfile = { declarations: [] };
        component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
        component.userProfile.declarations = [
            {
                'persona': 'teacher',
                'orgId': '0125933942631628805',
            }
        ]
        component.tenantPersonaLatestFormValue = mockRes.tenantPersonaLatestFormValue;
        jest.spyOn(_, 'get');
        component.formAction = 'update';
        component.isTenantChanged = true;
        // @ts-ignore

        jest.spyOn(component, 'getDeclarationReqObject');
        jest.spyOn(component, 'getProfileInfo');
        jest.spyOn(component, 'updateProfile');
        component.submit();
    });

    describe('updateUserConsent', () => {
       it('should be revoked old ordId and update new orgId if Tenant is Changed', () => {
            // arrange
            const currentOrgId = 'new-sample-org-id';
            const previousOrgId = 'old-sample-org-id';
            component.isTenantChanged = true;
            jest.spyOn(csUserService, 'updateConsent').mockReturnValue(of({
                'consent': {
                    'userId': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad'
                },
                'message': 'User Consent updated successfully.'
            }));
            jest.spyOn(toasterService, 'success');
            // act
            component.updateUserConsent(currentOrgId, previousOrgId);
            // assert
            expect(csUserService.updateConsent).toHaveBeenCalledTimes(2);
            expect(toasterService.success).toHaveBeenCalled();
            expect(component.isTenantChanged).toBeFalsy();
        });

       it('should not revoked old ordId and update new orgId if Tenant is Changed for catch part', () => {
            // arrange
            const currentOrgId = 'new-sample-org-id';
            const previousOrgId = 'old-sample-org-id';
            component.isTenantChanged = true;
            jest.spyOn(csUserService, 'updateConsent').mockReturnValue(throwError({
                error: 'samle-error'
            }));
            jest.spyOn(toasterService, 'error');
            // act
            component.updateUserConsent(currentOrgId, previousOrgId);
            // assert
            expect(csUserService.updateConsent).toHaveBeenCalled();
            expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
            expect(component.isTenantChanged).toBeTruthy();
        });

       it('should be update consent if formAction is submit', () => {
            // arrange
            const currentOrgId = 'new-sample-org-id';
            const previousOrgId = 'old-sample-org-id';
            component.isTenantChanged = false;
            jest.spyOn(csUserService, 'updateConsent').mockReturnValue(of({
                'consent': {
                    'userId': 'c4cc494f-04c3-49f3-b3d5-7b1a1984abad'
                },
                'message': 'User Consent updated successfully.'
            }));
            jest.spyOn(toasterService, 'success');
            // act
            component.updateUserConsent(currentOrgId, previousOrgId);
            // assert
            // expect(csUserService.updateConsent).toHaveBeenCalledTimes(1);
            expect(toasterService.success).toHaveBeenCalled();
        });

       it('should not revoked old ordId and update new orgId if Tenant is Changed for catch part', () => {
            // arrange
            const currentOrgId = 'new-sample-org-id';
            const previousOrgId = 'old-sample-org-id';
            component.isTenantChanged = false;
            jest.spyOn(csUserService, 'updateConsent').mockReturnValue(throwError({
                error: 'samle-error'
            }));
            jest.spyOn(toasterService, 'error');
            // act
            component.updateUserConsent(currentOrgId, previousOrgId);
            // assert
            expect(csUserService.updateConsent).toHaveBeenCalled();
            expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
            expect(component.isTenantChanged).toBeFalsy();
        });
    });
});