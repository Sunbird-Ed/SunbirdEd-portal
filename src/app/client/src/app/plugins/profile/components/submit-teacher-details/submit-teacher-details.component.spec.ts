import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, FormService, OtpService, SearchService, TncService, UserService } from '@sunbird/core';
import { ProfileService } from '@sunbird/profile';
import {
  BrowserCacheTtlService, ConfigService,
  NavigationHelperService, ResourceService,
  SharedModule, ToasterService
} from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { CacheService } from 'ng2-cache-service';
import { SuiModule } from 'ng2-semantic-ui';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of as observableOf, of, Subject, throwError } from 'rxjs';
import { SubmitTeacherDetailsComponent } from './submit-teacher-details.component';
import { mockRes } from './submit-teacher-details.component.spec.data';

describe('SubmitTeacherDetailsComponent', () => {
  let component: SubmitTeacherDetailsComponent;
  let fixture: ComponentFixture<SubmitTeacherDetailsComponent>;
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

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
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
    }
  };

  const MockCSService = {
    updateConsent() { return of({}); },
    getConsent() { return of({}); }
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SuiModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TelemetryModule.forRoot(),
        RouterTestingModule,
        SharedModule.forRoot()],
      declarations: [SubmitTeacherDetailsComponent],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: 'CS_USER_SERVICE', useValue: MockCSService },
        { provide: Router, useClass: RouterStub },
        NavigationHelperService, DeviceDetectorService,
        TelemetryService, OtpService,
        UserService,
        ToasterService, ProfileService, ConfigService, CacheService,
        BrowserCacheTtlService, FormService, SearchService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitTeacherDetailsComponent);
    component = fixture.componentInstance;
    component.userProfile = mockRes.userData.result.response;
  });

  it('should call ngOnInit', () => {
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'impression');
    spyOn(component, 'setTelemetryData');
    userService._userData$.next({ err: null, userProfile: mockRes.userData.result.response });
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
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    component.fetchTncData();
    expect(component.tncLatestVersion).toEqual('v4');
    expect(component.termsAndConditionLink).toEqual('http://test.com/tnc.html');
  });

  it('should not fetch tnc configuration and throw error', () => {
    const tncService = TestBed.get(TncService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(tncService, 'getTncConfig').and.returnValue(throwError(mockRes.tncConfig));
    component.fetchTncData();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
  });

  it('should fetch tnc configuration and throw error as cannot parse data', () => {
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfigIncorrectData));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.fetchTncData();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0004);
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
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'generateOTP').and.callFake(() => observableOf(mockRes.successResponse));
    component.generateOTP('declared-email', 'xyz@yopmail.com');
    expect(component.isOtpVerificationRequired).toBe(true);
    expect(component.otpData.instructions).toBe(resourceBundle.frmelmnts.instn.t0084);
    expect(component.otpData.type).toBe('email');
  });

  it('should generate otp for phone', () => {
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'generateOTP').and.callFake(() => observableOf(mockRes.successResponse));
    component.generateOTP('declared-phone', '901100110011');
    expect(component.isOtpVerificationRequired).toBe(true);
    expect(component.otpData.instructions).toBe(resourceBundle.frmelmnts.instn.t0083);
    expect(component.otpData.type).toBe('phone');
  });

  it('should not validate user as otp generation failed', () => {
    const otpService = TestBed.get(OtpService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(otpService, 'generateOTP').and.returnValue(throwError({}));
    component.generateOTP('declared-phone', '901100110011');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0051);
  });

  it('should set validators for phone', () => {
    const tncService = TestBed.get(TncService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    spyOn(telemetryService, 'impression');
    component.userProfile = mockRes.userData.result.response;
    component.ngOnInit();
  });

  it('should set form data and user profile email from user profile', () => {
    const tncService = TestBed.get(TncService);
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    spyOn(telemetryService, 'impression');
    userService._userData$.next({ err: null, userProfile: mockRes.userData.result.response });
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.validationType['declared-email'].isVerified).toBe(false);
  });

  it('should call updateProfile with success', () => {
    component.formAction = 'update';
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'declarations').and.returnValue(observableOf(mockRes.updateProfile));
    spyOn(toasterService, 'success');
    spyOn(component, 'navigateToProfile');
    component.updateProfile('');
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0037);
    expect(component.navigateToProfile).toHaveBeenCalled();
  });

  it('should call updateProfile with success modal and log audit event for tnc ', () => {
    component.formAction = 'submit';
    const profileService = TestBed.get(ProfileService);
    component.declaredLatestFormValue = { tnc: true };
    spyOn(profileService, 'declarations').and.returnValue(observableOf(mockRes.updateProfile));
    spyOn(component, 'logAuditEvent');
    component.updateProfile('');
    expect(component.showSuccessModal).toBeTruthy();
    expect(component.logAuditEvent).toHaveBeenCalled();
  });

  it('should call updateProfile with error while submit form', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'declarations').and.returnValue(throwError({}));
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'navigateToProfile');
    component.formAction = 'submit';
    component.updateProfile('');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0051);
    expect(component.navigateToProfile).toHaveBeenCalled();
  });

  it('should call updateProfile with error while update form', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'declarations').and.returnValue(throwError({}));
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'navigateToProfile');
    component.formAction = 'update';
    component.updateProfile('');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0052);
    expect(component.navigateToProfile).toHaveBeenCalled();
  });

  it('should update Telemetry on updating field', () => {
    component.declaredDetails = mockRes.userData.result.response.declarations[0];
    component.formAction = 'update';
    const updateTelemetry = component.getUpdateTelemetry();
    expect(updateTelemetry).toBeDefined();
  });

  it('should navigateToProfile and redirect to profile page while updating', () => {
    const route = TestBed.get(Router);
    component.navigateToProfile();
    expect(route.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should close Success modal and redirect to profile page while submitting', () => {
    const route = TestBed.get(Router);
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    component.closeSuccessModal();
    expect(component.modal.deny).toHaveBeenCalled();
    expect(component.showSuccessModal).toBeFalsy();
    expect(route.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('Show verification confirmed in UI, on verification success', () => {
    spyOn(component, 'setOtpValidation');
    component.otpConfirm = new Subject();
    spyOn(component.otpConfirm, 'next');
    spyOn(component.otpConfirm, 'complete');
    component.onVerificationSuccess({});
    expect(component.setOtpValidation).toHaveBeenCalledWith(false);
    expect(component.otpConfirm.next).toHaveBeenCalledWith(true);
    expect(component.otpConfirm.complete).toHaveBeenCalled();
  });

  it('should log audit event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'audit');
    component.logAuditEvent();
    expect(telemetryService.audit).toHaveBeenCalled();
  });

  it('Should show Terms and condition popup', () => {
    component.linkClicked(
      {
        event: { preventDefault: jasmine.createSpy('preventDefault') },
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
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getSelfDeclarationForm').and.returnValue(of({}));
    spyOn(component, 'initializeFormData');
    component.getTeacherDetailsForm();
    expect(profileService.getSelfDeclarationForm).toHaveBeenCalled();
    expect(component.initializeFormData).toHaveBeenCalled();
  });

  it('should get getTeacherDetails Form, on error', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'getSelfDeclarationForm').and.returnValue(throwError({}));
    spyOn(toasterService, 'error');
    spyOn(component, 'initializeFormData');
    component.getTeacherDetailsForm();
    expect(profileService.getSelfDeclarationForm).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try later');
  });

  it('should get teacher details form if tenant-persona form filled', () => {
    component.selectedTenant = '01259339426316288055';
    spyOn(component, 'getTeacherDetailsForm');
    component.tenantPersonaFormValueChanges({ persona: 'teacher', tenant: '01259339426316288054' });
    expect(component.tenantPersonaLatestFormValue).toEqual({ persona: 'teacher', tenant: '01259339426316288054' });
    expect(component.selectedTenant).toEqual('01259339426316288054');
    expect(component.getTeacherDetailsForm).toHaveBeenCalled();
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
    spyOn<any>(component, 'assignDefaultValue');
    component.initializeFormData(mockRes.declarationFormConfig);
    expect(component.teacherDetailsForm).toBeDefined();
    expect(component['assignDefaultValue']).toHaveBeenCalled();
  });
  it('should get persona and tenant form details, on success', () => {
    const profileService = TestBed.get(ProfileService);
    component.userProfile.declarations = [
      {
        'persona': 'teacher',
        'orgId': '01259339426316288054',
      }
    ];
    component.selectedTenant = '01259339426316288054';
    spyOn(profileService, 'getPersonaTenantForm').and.returnValue(of(mockRes.personaTenantForm));
    spyOn(component, 'getTeacherDetailsForm');
    component.getPersonaTenant();
    expect(profileService.getPersonaTenantForm).toHaveBeenCalled();
    expect(component.tenantPersonaForm).toBeDefined();
    expect(component.getTeacherDetailsForm).toHaveBeenCalled();
  });

  it('should get persona and tenant form details, on error', () => {
    const toasterService = TestBed.get(ToasterService);
    const profileService = TestBed.get(ProfileService);
    spyOn(toasterService, 'error');
    spyOn(component, 'navigateToProfile');
    spyOn(profileService, 'getPersonaTenantForm').and.returnValue(throwError({}));
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

  it('should update the profile successfully', () => {
    component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
    component.tenantPersonaLatestFormValue = mockRes.tenantPersonaLatestFormValue;
    spyOn<any>(component, 'getDeclarationReqObject');
    spyOn(component, 'getProfileInfo');
    spyOn(component, 'updateProfile');
    component.submit();
    expect(component['getDeclarationReqObject']).toHaveBeenCalled();
    expect(component.updateProfile).toHaveBeenCalled();
  });

  it('should update the profile successfully', () => {
    component.userProfile = { declaration: [] };
    component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
    component.tenantPersonaLatestFormValue = mockRes.tenantPersonaLatestFormValue;
    spyOn<any>(component, 'getDeclarationReqObject');
    spyOn(component, 'getProfileInfo');
    spyOn(component, 'updateProfile');
    component.submit();
    expect(component['getDeclarationReqObject']).toHaveBeenCalled();
    expect(component.updateProfile).toHaveBeenCalled();
  });

  it('should return if the form does not have the latest value', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    component.submit();
    expect(toasterService.error).toHaveBeenCalledWith('m0051');
  });

  it('should call ngOnDestroy', () => {
    spyOn(component.unsubscribe, 'complete');
    spyOn(component.unsubscribe, 'next');
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
    expect(component.unsubscribe.next).toHaveBeenCalled();
    expect(component.modal.deny).toHaveBeenCalled();
  });

  it('should get the updated profile info', () => {
    component.declaredLatestFormValue = mockRes.declaredLatestFormValue;
    component.tenantPersonaLatestFormValue = mockRes.tenantPersonaLatestFormValue;
    spyOn<any>(component, 'getDeclarationReqObject');
    spyOn(component, 'getProfileInfo');
    spyOn(component, 'updateProfile');
    component.submit();
    expect(component.getProfileInfo).toHaveBeenCalled();
  });
});
