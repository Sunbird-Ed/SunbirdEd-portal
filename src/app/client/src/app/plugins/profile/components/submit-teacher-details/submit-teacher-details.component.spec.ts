import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}, TelemetryService, OtpService,
        ToasterService, ProfileService, ConfigService, CacheService, BrowserCacheTtlService, FormService, SearchService,
        NavigationHelperService, DeviceDetectorService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitTeacherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configService = TestBed.get(ConfigService);
    component.pageId = 'profile-read';
    component.userProfile = mockRes.userData;
    component.formData = mockRes.formData;
    const formGroupObj = {};
    for (const key of component.formData) {
      const validation = component.setValidations(key);
      if (key.visible) {
        formGroupObj[key.code] = new FormControl(null, validation);
      }
    }
    component.userDetailsForm = component.sbFormBuilder.group(formGroupObj);
  });

  it('should call ng on init', () => {
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockRes.tncConfig));
    const userService = TestBed.get(UserService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'impression');
    spyOn(component, 'setTelemetryData');
    spyOn(component, 'setFormDetails');
    spyOn(component, 'initializeFormFields');
    userService._userData$.next({err: null, userProfile: {}});
    component.ngOnInit();
    expect(telemetryService.impression).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.setFormDetails).toHaveBeenCalled();
  });

  it('should call setTelemetryData', () => {
    component.setTelemetryData();
    expect(component.submitInteractEdata).toEqual({ id: 'submit-teacher-details', type: 'click', pageid: 'profile-read' });
    expect(component.cancelInteractEdata).toBeDefined();
  });

  it('should call updateProfile with success', () => {
    component.formAction = 'update';
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'updateProfile').and.returnValue(observableOf(mockRes.updateProfile));
    spyOn(toasterService, 'success');
    spyOn(component, 'closeModal');
    component.updateProfile('');
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0037);
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call updateProfile with error', () => {
    component.formAction = 'update';
    const profileService = TestBed.get(ProfileService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(profileService, 'updateProfile').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'closeModal');
    fixture.detectChanges();
    component.updateProfile('');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0052);
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call setFormDetails and get success', () => {
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockRes.formData));
    spyOn(component, 'initializeFormFields');
    component.setFormDetails();
    expect(component.formData).toEqual(mockRes.formData);
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('should call setFormDetails and get error', () => {
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableThrowError({}));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'closeModal');
    component.setFormDetails();
    expect(component.closeModal).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });

  it('should call onSubmitForm with success', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'getOrganisationDetails').and.returnValue(observableOf(mockRes.orgSearch));
    spyOn(component, 'updateProfile');
    component.onSubmitForm();
    expect(component.updateProfile).toHaveBeenCalled();
  });

  it('should call onSubmitForm with error', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'getOrganisationDetails').and.returnValue(observableThrowError({}));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'closeModal');
    component.onSubmitForm();
    expect(component.closeModal).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0018);
  });

  it('should call setValidations and should return data', () => {
    const returnData = component.setValidations(mockRes.checkValidationInput);
    expect(returnData).toBeDefined();
  });

  it('should call getState and get success', () => {
    const state = component.userDetailsForm.controls['state'];
    state.setValue('');
    component.userProfile = mockRes.userData;
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.returnValue(observableOf(mockRes.stateData));
    spyOn(component, 'initializeFormFields');
    component.getState();
    expect(component.allStates).toBe(mockRes.stateData.result.response);
  });

  it('should call getState and get error', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.returnValue(observableThrowError({}));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'closeModal');
    component.getState();
    expect(component.closeModal).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0016);
  });

  it('should call getDistrict', () => {
    spyOn(component, 'initializeFormFields');
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.returnValue(observableOf(mockRes.stateData));
    const district = component.userDetailsForm.controls['district'];
    district.setValue('12');
    component.getDistrict('1234');
    expect(component.allDistricts).toBe(mockRes.stateData.result.response);

  });

  it('should call getDistrict and get error', () => {
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'getUserLocation').and.returnValue(observableThrowError({}));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'closeModal');
    component.getDistrict('');
    expect(component.closeModal).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0017);
  });

  it('should return false as state not changed', () => {
    const data = component.isStateChanged();
    expect(data).toBe(false);
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

  it('should return add operation as form action is submit', () => {
    component.formAction = 'submit';
    const data = component.getOperation('declared-school-name', 'tp', '2222');
    expect(data).toBe('add');
  });

  it('should return add operation as form action is update and state changed', () => {
    const userData = mockRes.userData.result.response;
    const state = component.userDetailsForm.controls['state'];
    state.setValue(mockRes.stateDetails);
    component.formAction = 'update';
    userData.externalIds = mockRes.externalId;
    component.userProfile = userData;
    const data = component.getOperation('declared-school-name', 'tp', '2222');
    expect(data).toBe('add');
  });

  it('should return edit operation as form action is update and value present in userprofile', () => {
    const userData = mockRes.userData.result.response;
    const state = component.userDetailsForm.controls['state'];
    state.setValue(userData.userLocations[1]);
    component.formAction = 'update';
    userData.externalIds = mockRes.externalId;
    component.userProfile = userData;
    const data = component.getOperation('declared-school-name', 'tp', '2222');
    expect(data).toBe('edit');
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
    expect(fieldType).toBe('phone');
  });

  it('should get proper field type email', () => {
    const fieldType = component.getFieldType({email: '22'});
    expect(fieldType).toBe('email');
  });

  it('should set if verification success', () => {
    component.userDetailsForm.addControl('emailVerified', new FormControl());
    component.onVerificationSuccess({email: '22'});
    expect(component.isOtpVerificationRequired).toBe(false);
    expect(component.validationType.email.isVerified).toBe(true);
  });

  it('should validate user', () => {
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'generateOTP').and.callFake(() => observableOf(mockRes.successResponse));
    const emailControl = component.userDetailsForm.controls['email'];
    emailControl.setValue('test@gmail.com');
    component.userDetailsForm.addControl('emailVerified', new FormControl());
    component.generateOTP('email');
    expect(component.isOtpVerificationRequired).toBe(true);
    expect(component.otpData.instructions).toBe(resourceBundle.frmelmnts.instn.t0084);
    expect(component.otpData.type).toBe('email');
  });

  it('should not validate user as otp generation failed', () => {
    const otpService = TestBed.get(OtpService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(otpService, 'generateOTP').and.callFake(() => observableThrowError(mockRes.successResponse));
    const emailControl = component.userDetailsForm.controls['email'];
    emailControl.setValue('test@gmail.com');
    component.userDetailsForm.addControl('emailVerified', new FormControl());
    component.generateOTP('email');
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0051);
  });
  


});
