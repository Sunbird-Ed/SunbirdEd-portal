import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateContactComponent } from './update-contact.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SharedModule, ToasterService} from '@sunbird/shared';
import {CoreModule, SearchService, TncService } from '@sunbird/core';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceService} from '@sunbird/shared';
import {of as observableOf, Observable, throwError as observableThrowError} from 'rxjs';
import {TenantService, UserService, OtpService, OrgDetailsService} from '@sunbird/core';
import {mockUpdateContactData} from './update-contact.mock.spec.data';
import { RecaptchaModule } from 'ng-recaptcha';

import { configureTestSuite } from '@sunbird/test-util';

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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), RecaptchaModule, CoreModule, FormsModule, HttpClientTestingModule,
        SuiModule, TelemetryModule.forRoot(), RouterTestingModule],
      declarations: [UpdateContactComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: ResourceService, useValue: mockUpdateContactData.resourceBundle},
        TenantService, ToasterService, UserService, TelemetryService, TncService
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
      type: 'phone',
      tncAccepted: false
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
    const userService = TestBed.get(UserService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(userService, 'getUserByKey').and.callFake(() => observableOf(mockUpdateContactData.userData));
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() => observableOf(mockUpdateContactData.nonCustOrgDetails));
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
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() => observableOf(mockUpdateContactData.nonCustOrgDetails));
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
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() =>
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
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() =>
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
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() =>
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
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() =>
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
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() =>
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
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() =>
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
    spyOn(orgDetailsService, 'getCustodianOrgDetails').and.callFake(() =>
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

  it('initiate instance with SUNBIRD', () => {
    spyOn(component, 'fetchTncConfiguration');
    component.ngOnInit();
    expect(component.instance).toEqual('SUNBIRD');
    expect(component.fetchTncConfiguration).toHaveBeenCalled();
  });

  it('should toggle tnc checkboc if already false', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.toggleTncCheckBox({target: {checked: true}});
    expect(component.contactForm.tncAccepted).toEqual(true);
    expect(telemetryService.interact).toHaveBeenCalledWith(mockUpdateContactData.interactEDataSelected);
  });

  it('should toggle tnc checkboc', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.toggleTncCheckBox({target: {checked: false}});
    expect(component.contactForm.tncAccepted).toEqual(false);
    expect(telemetryService.interact).toHaveBeenCalledWith(mockUpdateContactData.interactEDataUnSelected);
  });


  it('should fetch tnc configuration', () => {
    const tncService = TestBed.get(TncService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockUpdateContactData.tncConfig));
    component.fetchTncConfiguration();
    expect(component.tncLatestVersion).toEqual('v4');
    expect(component.termsAndConditionLink).toEqual('http://test.com/tnc.html');
    expect(telemetryService.log).toHaveBeenCalledWith(mockUpdateContactData.telemetryLogSuccess);
  });

  it('should not fetch tnc configuration and throw error', () => {
    const tncService = TestBed.get(TncService);
    const toasterService = TestBed.get(ToasterService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(tncService, 'getTncConfig').and.returnValue(observableThrowError(mockUpdateContactData.tncConfig));
    component.fetchTncConfiguration();
    expect(telemetryService.log).toHaveBeenCalledWith(mockUpdateContactData.telemetryLogError);
    expect(toasterService.error).toHaveBeenCalledWith(mockUpdateContactData.resourceBundle.messages.fmsg.m0004);
  });

  it('should fetch tnc configuration and throw error as cannot parse data', () => {
    const tncService = TestBed.get(TncService);
    spyOn(tncService, 'getTncConfig').and.returnValue(observableOf(mockUpdateContactData.tncConfigIncorrectData));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
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
    spyOn(component, 'resetGoogleCaptcha').and.callThrough();
    spyOn(component, 'resolved').and.callFake(() => true);
    component.submitForm();
    expect(component.resetGoogleCaptcha).toHaveBeenCalled();
  });

  it('should submit form when captcha is not enabled', () => {
    component.isP1CaptchaEnabled = 'false';
    spyOn(component, 'onFormUpdate').and.callThrough();
    component.submitForm();
    expect(component.onFormUpdate).toHaveBeenCalled();
  });

  it('should receive response from captcha', () => {
    component.isP1CaptchaEnabled = 'true';
    spyOn(component, 'onFormUpdate').and.callFake(() => true);
    component.resolved(mockUpdateContactData.captchaToken);
    expect(component.onFormUpdate).toHaveBeenCalledWith(mockUpdateContactData.captchaToken);
  });
});
