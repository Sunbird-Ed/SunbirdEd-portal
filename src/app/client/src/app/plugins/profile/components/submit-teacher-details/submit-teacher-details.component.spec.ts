import {async, ComponentFixture, TestBed, tick, fakeAsync, discardPeriodicTasks} from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import { SubmitTeacherDetailsComponent } from './submit-teacher-details.component';
import {
  ResourceService,
  ToasterService,
  ConfigService,
  BrowserCacheTtlService,
  NavigationHelperService,
  SharedModule
} from '@sunbird/shared';
import { ProfileService } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RouterTestingModule } from '@angular/router/testing';
import { mockRes } from './submit-teacher-details.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {CoreModule, FormService, SearchService, TncService, UserService, OtpService} from '@sunbird/core';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { FormControl } from '@angular/forms';
import { configureTestSuite } from '@sunbird/test-util';
import { Router, ActivatedRoute } from '@angular/router';

describe('SubmitTeacherDetailsComponent', () => {
  let component: SubmitTeacherDetailsComponent;
  let fixture: ComponentFixture<SubmitTeacherDetailsComponent>;
  let configService;

  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'teacher-declaration', type: 'view',
          uri: '/profile/teacher-declaration',
        }
      }, queryParams: {formaction: 'submit'}
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
      providers: [{provide: ResourceService, useValue: resourceBundle}, UserService,
        {provide: ActivatedRoute, useValue: fakeActivatedRoute }, TelemetryService, OtpService,
        ToasterService, ProfileService, ConfigService, CacheService, BrowserCacheTtlService, FormService, SearchService,
        NavigationHelperService, DeviceDetectorService, { provide: Router, useClass: RouterStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitTeacherDetailsComponent);
    component = fixture.componentInstance;
    configService = TestBed.get(ConfigService);
    component.pageId = 'profile-read';
    const formGroupObj = {};
    formGroupObj['persona'] = new FormControl(null, Validators.required);
    formGroupObj['tenants'] = new FormControl(null, Validators.required);
    component.userDetailsForm = component.sbFormBuilder.group(formGroupObj);
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
    component.setTelemetryData();
    expect(component.submitInteractEdata).toEqual({ id: 'submit-teacher-details', type: 'click', pageid: 'profile-read' });
    expect(component.cancelInteractEdata).toBeDefined();
  });

  it('should get personas list', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getPersonas').and.returnValue(observableOf(mockRes.personas));
    component.getPersona();
    expect(component.personaList).toBe(mockRes.personas[0].range);
  });

  it('should get personas list and set value while updating details', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getPersonas').and.returnValue(observableOf(mockRes.personas));
    component.formAction = 'update';
    component.declaredDetails = mockRes.userData.result.response.declarations[0];
    component.getPersona();
    expect(component.personaList).toBe(mockRes.personas[0].range);
    expect(component.forChanges.prevPersonaValue).toEqual(component.declaredDetails.persona);
    expect(component.userDetailsForm.controls.persona.valid).toBeTruthy();
  });

  it('should get tenants list', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getTenants').and.returnValue(observableOf(mockRes.tenantsList));
    component.getTenants();
    expect(component.allTenants).toBe(mockRes.tenantsList[0].range);
  });

  it('should get tenants list and set value while updating details', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getTenants').and.returnValue(observableOf(mockRes.tenantsList));
    component.formAction = 'update';
    component.declaredDetails = mockRes.userData.result.response.declarations[0];
    component.getTenants();
    expect(component.allTenants).toBe(mockRes.tenantsList[0].range);
    expect(component.forChanges.prevTenantValue).toEqual(component.declaredDetails.orgId);
    expect(component.userDetailsForm.controls.tenants.valid).toBeTruthy();
  });

  it('should get teacher detail form on change of tenant', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getTeacherDetailForm').and.returnValue(observableOf(mockRes.teacherDetailForm));
    spyOn(component, 'initializeFormFields').and.callThrough();
    component.onTenantChange();
    component.userDetailsForm.controls.tenants.setValue('013016492159606784174');
    expect(component.formData).toEqual(mockRes.teacherDetailForm);
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('should initializeFormFields for update form', () => {
    component.formData = mockRes.teacherDetailForm;
    component.formAction = 'update';
    component.forChanges.prevTenantValue = '013016492159606784174';
    component.userDetailsForm.controls.tenants.setValue('013016492159606784174');
    component.declaredDetails = mockRes.userData.result.response.declarations[0];
    component.initializeFormFields();
    expect(component.userDetailsForm.value['declared-phone']).toEqual(component.declaredDetails.info['declared-phone']);
  });

  it('should call setValidations and should return data', () => {
    const returnData = component.setValidations(mockRes.checkValidationInput);
    expect(returnData).toBeDefined();
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
    spyOn(tncService, 'getTncConfig').and.returnValue(observableThrowError(mockRes.tncConfig));
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
    const fieldType = component.getFieldType({phone: '22'});
    expect(fieldType).toBe('declared-phone');
  });

  it('should get proper field type email', () => {
    const fieldType = component.getFieldType({email: '22'});
    expect(fieldType).toBe('declared-email');
  });

  it('should set if verification success', () => {
    component.formData = mockRes.teacherDetailForm;
    component.initializeFormFields();
    component.userDetailsForm.addControl('emailVerified', new FormControl());
    component.onVerificationSuccess({email: '22'});
    expect(component.isOtpVerificationRequired).toBe(false);
    expect(component.validationType['declared-email'].isVerified).toBe(true);
  });

  it('should generate otp for email', () => {
    component.formData = mockRes.teacherDetailForm;
    component.initializeFormFields();
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'generateOTP').and.callFake(() => observableOf(mockRes.successResponse));
    const emailControl = component.userDetailsForm.controls['declared-email'];
    emailControl.setValue('test@gmail.com');
    component.userDetailsForm.addControl('emailVerified', new FormControl());
    component.generateOTP('declared-email');
    expect(component.isOtpVerificationRequired).toBe(true);
    expect(component.otpData.instructions).toBe(resourceBundle.frmelmnts.instn.t0084);
    expect(component.otpData.type).toBe('email');
  });

  it('should generate otp for phone', () => {
    component.formData = mockRes.teacherDetailForm;
    component.initializeFormFields();
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'generateOTP').and.callFake(() => observableOf(mockRes.successResponse));
    const phoneControl = component.userDetailsForm.controls['declared-phone'];
    phoneControl.setValue('9595698965');
    component.userDetailsForm.addControl('phoneVerified', new FormControl());
    component.generateOTP('declared-phone');
    expect(component.isOtpVerificationRequired).toBe(true);
    expect(component.otpData.instructions).toBe(resourceBundle.frmelmnts.instn.t0083);
    expect(component.otpData.type).toBe('phone');
  });

  it('should not validate user as otp generation failed', () => {
    component.formData = mockRes.teacherDetailForm;
    component.initializeFormFields();
    const otpService = TestBed.get(OtpService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(otpService, 'generateOTP').and.callFake(() => observableThrowError(mockRes.successResponse));
    const emailControl = component.userDetailsForm.controls['declared-email'];
    emailControl.setValue('test@gmail.com');
    component.userDetailsForm.addControl('emailVerified', new FormControl());
    component.generateOTP('declared-email');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0051);
  });


  it('should set validators for email', () => {
    const tncService = TestBed.get(TncService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    spyOn(telemetryService, 'impression');
    component.userProfile = mockRes.userData.result.response;
    component.ngOnInit();
    component.setValidators('declared-email');
    const emailControl = component.userDetailsForm.controls['declared-emailVerified'];
    expect(emailControl.value).toBe(true);
  });

  it('should set validators for phone', () => {
    const tncService = TestBed.get(TncService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    spyOn(telemetryService, 'impression');
    component.userProfile = mockRes.userData.result.response;
    component.ngOnInit();
    component.setValidators('declared-phone');
    const emailControl = component.userDetailsForm.controls['declared-phoneVerified'];
    expect(emailControl.value).toBe(true);
  });

  it('should set form data and user profile email from userprofile', () => {
    component.formData = mockRes.teacherDetailForm;
    component.initializeFormFields();
    const tncService = TestBed.get(TncService);
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    spyOn(telemetryService, 'impression');
    userService._userData$.next({err: null, userProfile: mockRes.userData.result.response});
    component.ngOnInit();
    fixture.detectChanges();
    const emailControl = component.userDetailsForm.controls['declared-email'];
    expect(component.prepopulatedValue['declared-email']).toBe('so******@techjoomla.com');
    expect(component.validationType['declared-email'].isVerified).toBe(true);
    expect(emailControl.value).toBe('so******@techjoomla.com');
  });

  it('should ask for verification as user changed email', fakeAsync(() => {
    component.formData = mockRes.teacherDetailForm;
    const tncService = TestBed.get(TncService);
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    spyOn(telemetryService, 'impression');
    userService._userData$.next({err: null, userProfile: mockRes.userData.result.response});
    component.ngOnInit();
    component.initializeFormFields();
    const emailControl = component.userDetailsForm.controls['declared-email'];
    emailControl.setValue('differentmailid@yopmail.com');
    tick(500);
    fixture.detectChanges();
    expect(component.prepopulatedValue['declared-email']).toBe('so******@techjoomla.com');
    expect(component.validationType['declared-email'].isVerificationRequired).toBe(true);
    expect(component.validationType['declared-email'].isVerified).toBe(false);
  }));

  it('should not show verification as user changed phone and made it blank', fakeAsync(() => {
    const tncService = TestBed.get(TncService);
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    spyOn(telemetryService, 'impression');
    userService._userData$.next({err: null, userProfile: mockRes.userData.result.response});
    component.formData = mockRes.teacherDetailForm;
    component.ngOnInit();
    component.initializeFormFields();
    const phoneControl = component.userDetailsForm.controls['declared-phone'];
    phoneControl.setValue('9656989656');
    tick(500);
    fixture.detectChanges();
    phoneControl.setValue('');
    tick(500);
    fixture.detectChanges();
    discardPeriodicTasks();
    expect(component.validationType['declared-phone'].isVerificationRequired).toBe(false);
    expect(component.validationType['declared-phone'].isVerified).toBe(false);
  }));

  it('should return add operation as form action is submit', () => {
    component.formAction = 'submit';
    const data = component.getOperation();
    expect(data).toBe('add');
  });

  it('should return remove operation as form action is update and tenant changed', () => {
    const tenant = component.userDetailsForm.controls['tenants'];
    tenant.setValue('01232241426855526450');
    component.formAction = 'update';
    component.declaredDetails = mockRes.userData.result.response.declarations[0];
    component.forChanges.prevTenantValue = component.declaredDetails.orgId;
    const data = component.getOperation();
    expect(data).toBe('remove');
  });

  it('should return edit operation as form action is update and value present in userprofile', () => {
    component.formAction = 'update';
    component.declaredDetails = mockRes.userData.result.response.declarations[0];
    component.forChanges.prevTenantValue = component.declaredDetails.orgId;
    component.forChanges.prevPersonaValue = component.declaredDetails.persona;
    component.userDetailsForm.controls['tenants'].setValue('013016492159606784174');
    component.userDetailsForm.controls['persona'].setValue('volunteer');
    const data = component.getOperation();
    expect(data).toBe('edit');
  });

  it('should call onSubmitForm method with submit action', () => {
    component.formAction = 'submit';
    component.formData = mockRes.teacherDetailForm;
    component.initializeFormFields();
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'declarations').and.returnValue(observableOf(mockRes.updateProfile));
    spyOn(component, 'updateProfile');
    component.onSubmitForm();
    expect(component.updateProfile).toHaveBeenCalled();
  });

  it('should call updateProfile with success', () => {
    component.formAction = 'update';
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'declarations').and.returnValue(observableOf(mockRes.updateProfile));
    spyOn(toasterService, 'success');
    spyOn(component, 'closeModal');
    component.updateProfile('');
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0037);
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call updateProfile with success modal and log audit event for tnc ', () => {
    component.formAction = 'submit';
    component.formData = mockRes.teacherDetailForm;
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'declarations').and.returnValue(observableOf(mockRes.updateProfile));
    spyOn(component, 'logAuditEvent');
    component.initializeFormFields();
    component.userDetailsForm.controls['tnc'].setValue(true);
    component.updateProfile('');
    expect(component.showSuccessModal).toBeTruthy();
    expect(component.logAuditEvent).toHaveBeenCalled();
  });

  it('should call updateProfile with error while submit form', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'declarations').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'closeModal');
    component.formAction = 'submit';
    component.updateProfile('');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0051);
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call updateProfile with error while update form', () => {
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'declarations').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'closeModal');
    component.formAction = 'update';
    component.updateProfile('');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0052);
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should update Telemetry on updating field', () => {
    component.formData = mockRes.teacherDetailForm;
    component.declaredDetails = mockRes.userData.result.response.declarations[0];
    component.formAction = 'update';
    component.initializeFormFields();
    component.userDetailsForm.controls['declared-email'].setValue('abc@yopmail.com');
    const updateTelemety = component.getUpdateTelemetry();
    expect(updateTelemety).toBeDefined();
  });

  it('should closeModal and redirect to profile page while updating', () => {
    const route = TestBed.get(Router);
    component.closeModal();
    expect(route.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should close Success modal and redirect to profile page while submiting', () => {
    const route = TestBed.get(Router);
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    component.closeSuccessModal();
    expect(component.modal.deny).toHaveBeenCalled();
    expect(component.showSuccessModal).toBeFalsy();
    expect(route.navigate).toHaveBeenCalledWith(['/profile']);
  });

});
