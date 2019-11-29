import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateContactComponent } from './update-contact.component';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SharedModule, ToasterService} from '@sunbird/shared';
import {CoreModule, SearchService} from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceService} from '@sunbird/shared';
import {of as observableOf, Observable, throwError as observableThrowError} from 'rxjs';
import {TenantService, UserService, OtpService, OrgDetailsService} from '@sunbird/core';
import {mockUpdateContactData} from './update-contact.mock.spec.data';

describe('UpdateContactComponent', () => {
  let component: UpdateContactComponent;
  let fixture: ComponentFixture<UpdateContactComponent>;
  const fakeActivatedRoute = {
    snapshot: mockUpdateContactData.snapshotData,
    queryParams: observableOf({userId: 'mockUserId'}),
  };

  const fakeUserService = {
    getUserByKey: observableOf(mockUpdateContactData.userData)
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(),
        RouterTestingModule],
      declarations: [UpdateContactComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: ResourceService, useValue: mockUpdateContactData.resourceBundle},
        TenantService, ToasterService, UserService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set telemetry data on initialization', () => {
    expect(component.submitPhoneInteractEdata).toEqual({
      id: 'submit-phone',
      type: 'click',
      pageid: 'sso-sign-in',
    });
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

  it('should reset form as otp validation failed', () => {
    fixture.detectChanges();
    component.handleOtpValidationFailed();
    expect(component).toBeTruthy();
    expect(component.showOtpComp).toEqual(false);
    expect(component.disableSubmitBtn).toEqual(true);
    expect(component.contactForm).toEqual({
      value: '',
      type: 'phone'
    });
    expect(component.userExist).toEqual(false);
    expect(component.userBlocked).toEqual(false);
  });


  it('should return query params for given query object', () => {
    const test = component.getQueryParams({queryParam1: 'mockValue'});
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
      type: 'phone'
    });
    expect(component.userExist).toEqual(false);
    expect(component.userDetails).toEqual({});
    expect(component.userBlocked).toEqual(false);
  });

  it('should not throw error and not generate otp as root org id is different', () => {
    component.contactForm.type = 'email';
    component.contactForm.value = 'test@gmail.com';
    const userService = TestBed.get(UserService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableOf(mockUpdateContactData.userData));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() => observableOf(mockUpdateContactData.nonCustOrgDetails));
    component.onFormUpdate();
    expect(component.userExist).toEqual(true);
    expect(component.userBlocked).toEqual(false);
    expect(component.disableSubmitBtn).toEqual(true);
  });

  it('should not generate otp as user account blocked', () => {
    component.contactForm.type = 'email';
    component.contactForm.value = 'test@gmail.com';
    const userService = TestBed.get(UserService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableThrowError(mockUpdateContactData.blockedUserError));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() => observableOf(mockUpdateContactData.nonCustOrgDetails));
    component.onFormUpdate();
    expect(component.userExist).toEqual(false);
    expect(component.userBlocked).toEqual(true);
    expect(component.disableSubmitBtn).toEqual(true);
  });

  it('should generate otp as user not found', () => {
    component.contactForm.type = 'email';
    component.contactForm.value = 'test@gmail.com';
    const userService = TestBed.get(UserService);
    const otpService = TestBed.get(OtpService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableThrowError(mockUpdateContactData.serverError));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() =>
      observableOf(mockUpdateContactData.nonCustOrgDetails));
    spyOn(otpService, 'generateOTP').and.callFake(() => observableOf(mockUpdateContactData.successResponse));
    component.onFormUpdate();
    expect(component.showOtpComp).toEqual(true);
    expect(component.otpData).toEqual(mockUpdateContactData.otpData);
  });


  it('should not generate otp and throw error as phone is in use', () => {
    component.contactForm.type = 'email';
    component.contactForm.value = 'test@gmail.com';
    const userService = TestBed.get(UserService);
    const otpService = TestBed.get(OtpService);
    const toasterService = TestBed.get(ToasterService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableThrowError(mockUpdateContactData.serverError));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() =>
      observableOf(mockUpdateContactData.nonCustOrgDetails));
    spyOn(otpService, 'generateOTP').and.callFake(() => observableThrowError(mockUpdateContactData.phoneAlreadyUsedError));
    spyOn(toasterService, 'error').and.callFake((value) => {
      return value;
    });
    component.onFormUpdate();
    expect(toasterService.error).toHaveBeenCalledWith('PHONE_ALREADY_IN_USE');
  });

  it('should not generate otp and throw error as email is in use', () => {
    component.contactForm.type = 'email';
    component.contactForm.value = 'test@gmail.com';
    const userService = TestBed.get(UserService);
    const otpService = TestBed.get(OtpService);
    const toasterService = TestBed.get(ToasterService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableThrowError(mockUpdateContactData.serverError));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() =>
      observableOf(mockUpdateContactData.nonCustOrgDetails));
    spyOn(otpService, 'generateOTP').and.callFake(() => observableThrowError(mockUpdateContactData.emailAlreadyUsedError));
    spyOn(toasterService, 'error').and.callFake((value) => {
      return value;
    });
    component.onFormUpdate();
    expect(toasterService.error).toHaveBeenCalledWith('EMAIL_IN_USE');
  });

  it('should not generate otp and throw error as rate limit has exceed', () => {
    component.contactForm.type = 'email';
    component.contactForm.value = 'test@gmail.com';
    const userService = TestBed.get(UserService);
    const otpService = TestBed.get(OtpService);
    const toasterService = TestBed.get(ToasterService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableThrowError(mockUpdateContactData.serverError));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() =>
      observableOf(mockUpdateContactData.nonCustOrgDetails));
    spyOn(otpService, 'generateOTP').and.callFake(() => observableThrowError(mockUpdateContactData.rateLimitExceed));
    spyOn(toasterService, 'error').and.callFake((value) => {
      return value;
    });
    component.onFormUpdate();
    expect(toasterService.error).toHaveBeenCalledWith('ERROR_RATE_LIMIT_EXCEEDED');
  });

  it('should not generate otp and throw error as server error', () => {
    component.contactForm.type = 'email';
    component.contactForm.value = 'test@gmail.com';
    const userService = TestBed.get(UserService);
    const otpService = TestBed.get(OtpService);
    const toasterService = TestBed.get(ToasterService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableThrowError(mockUpdateContactData.serverError));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() =>
      observableOf(mockUpdateContactData.nonCustOrgDetails));
    spyOn(otpService, 'generateOTP').and.callFake(() => observableThrowError(mockUpdateContactData.serverError));
    spyOn(toasterService, 'error').and.callFake((value) => {
      return value;
    });
    component.onFormUpdate();
    expect(toasterService.error).toHaveBeenCalledWith(mockUpdateContactData.resourceBundle.messages.fmsg.m0085);
  });

  it('should generate otp as user org id is same for email id', () => {
    component.contactForm.type = 'email';
    component.contactForm.value = 'test@gmail.com';
    const userService = TestBed.get(UserService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const otpService = TestBed.get(OtpService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableOf(mockUpdateContactData.userData));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() =>
      observableOf(mockUpdateContactData.custOrgDetails));
    spyOn(otpService, 'generateOTP').and.callFake(() => observableOf(mockUpdateContactData.successResponse));
    component.onFormUpdate();
    expect(component.userDetails).toEqual(mockUpdateContactData.userData.result.response);
    expect(component.userExist).toEqual(false);
    expect(component.userBlocked).toEqual(false);
    expect(component.disableSubmitBtn).toEqual(false);
    expect(component.otpData).toEqual(mockUpdateContactData.otpData);
  });

  it('should generate otp as user org id is same for phone number', () => {
    component.contactForm.type = 'phone';
    component.contactForm.value = '7896541257';
    const userService = TestBed.get(UserService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const otpService = TestBed.get(OtpService);
    spyOn(userService, 'getUserByKey').and.callFake(() =>
      observableOf(mockUpdateContactData.userData));
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() =>
      observableOf(mockUpdateContactData.custOrgDetails));
    spyOn(otpService, 'generateOTP').and.callFake(() =>
      observableOf(mockUpdateContactData.successResponse));
    component.onFormUpdate();
    expect(component.userDetails).toEqual(mockUpdateContactData.userData.result.response);
    expect(component.userExist).toEqual(false);
    expect(component.userBlocked).toEqual(false);
    expect(component.disableSubmitBtn).toEqual(false);
    expect(component.otpData).toEqual(mockUpdateContactData.phoneOtpData);
  });
});
