import { ActivatedRoute, Router } from '@angular/router';
import { InterpolatePipe } from './../../../../../shared/pipes/interpolate/interpolate.pipe';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CacheService } from 'ng2-cache-service';
import {ResourceService, ConfigService, BrowserCacheTtlService, UtilService} from '@sunbird/shared';
import {TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpComponent } from './otp.component';
import { OtpComponentMockResponse } from './otp.component.spec.data';
import { SignupService } from '../../services';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { RecaptchaModule } from 'ng-recaptcha';
import { configureTestSuite } from '@sunbird/test-util';

describe('OtpComponent', () => {
  let component: OtpComponent;
  let fixture: ComponentFixture<OtpComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'explore', pageid: 'download-offline-app', type: 'view'
        }
      },
      queryParams: {
        client_id: 'portal', redirectUri: '/learn',
        state: 'state-id', response_type: 'code', version: '3'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OtpComponent, InterpolatePipe],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RecaptchaModule,
        FormsModule, ReactiveFormsModule],
      providers: [ConfigService, CacheService, BrowserCacheTtlService, UtilService,
        DeviceDetectorService, SignupService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
        {provide: ResourceService, useValue: OtpComponentMockResponse.resourceBundle},
        TelemetryService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpComponent);
    component = fixture.componentInstance;
    const fb = TestBed.get(FormBuilder);
    component.signUpdata = fb.group({
      name: ['test'],
      password: ['test1234'],
      confirmPassword: ['test1234'],
      phone: ['9876543210'],
      email: ['test@gmail.com'],
      contactType: ['phone'],
      tncAccepted: ['true']
    }),

      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify the OTP and call createUser()', () => {
    const resourceService = TestBed.get(ResourceService);
    component.mode = 'phone';
    const signupService = TestBed.get(SignupService);
    resourceService.frmelmnts = OtpComponentMockResponse.resourceBundle.frmelmnts;
    spyOn(signupService, 'verifyOTP').and.returnValue(observableOf(OtpComponentMockResponse.verifyOtpSuccessResponse));
    spyOn(component, 'createUser').and.callThrough();
    component.otpForm.controls.otp.setValue('895136');
    component.verifyOTP();
    expect(component.createUser).toHaveBeenCalled();
    expect(component.infoMessage).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should not verify the OTP', () => {
    component.disableResendButton = true;
    const resourceService = TestBed.get(ResourceService);
    component.mode = 'phone';
    const signupService = TestBed.get(SignupService);
    resourceService.frmelmnts = OtpComponentMockResponse.resourceBundle.frmelmnts;
    resourceService.messages = OtpComponentMockResponse.resourceBundle.messages;
    spyOn(signupService, 'verifyOTP').and.callFake(() => observableThrowError(OtpComponentMockResponse.verifyOtpErrorResponse));
    component.otpForm.controls.otp.setValue('895136');
    component.verifyOTP();
    expect(component.infoMessage).toEqual('');
  });

  it('it should resend otp', () => {
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'generateOTPforAnonymousUser').and.returnValue(observableOf(OtpComponentMockResponse.generateOtpSuccessResponse));
    component.resendOTP();
    expect(component.errorMessage).toBe('');
  });

  it('it should resend otp with minor user', () => {
    const signupService = TestBed.get(SignupService);
    component.isMinor = true;
    spyOn(signupService, 'generateOTPforAnonymousUser').and.returnValue(observableOf(OtpComponentMockResponse.generateOtpSuccessResponse));
    const contactType = component.signUpdata.controls['contactType'];
    contactType.setValue('phone');
    const phone = component.signUpdata.controls['phone'];
    phone.setValue(OtpComponentMockResponse.generateOtpMinor.request.key);
    component.resendOTP();
    expect(component.errorMessage).toBe('');
    expect(signupService.generateOTPforAnonymousUser).toHaveBeenCalledWith(OtpComponentMockResponse.generateOtpMinor, undefined);
  });

  it('it should throw error for resend the otp for minor user', () => {
    component.errorMessage = OtpComponentMockResponse.resourceBundle.messages.fmsg.m0085;
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'generateOTP').and.callFake(() => observableThrowError(OtpComponentMockResponse.verifyOtpErrorResponse));
    component.resendOTP();
    expect(component.errorMessage).toBe('There was a technical error. Try again.');
  });

  it('it should not resend the otp', () => {
    component.errorMessage = OtpComponentMockResponse.resourceBundle.messages.fmsg.m0085;
    const signupService = TestBed.get(SignupService);
    component.isMinor = false;
    const contactType = component.signUpdata.controls['contactType'];
    contactType.setValue('phone');
    const phone = component.signUpdata.controls['phone'];
    phone.setValue(OtpComponentMockResponse.generateOtpMinor.request.key);
    spyOn(signupService, 'generateOTPforAnonymousUser').and.callFake(() => observableThrowError(OtpComponentMockResponse.verifyOtpErrorResponse));
    component.resendOTP();
    expect(component.errorMessage).toBe('There was a technical error. Try again.');
    expect(signupService.generateOTPforAnonymousUser).toHaveBeenCalledWith(OtpComponentMockResponse.generateOtp, undefined);
  });

  it('it should not create new user as create user api failed', () => {
    const signupService = TestBed.get(SignupService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    spyOn(signupService, 'createUserV3').and.returnValue(observableThrowError(OtpComponentMockResponse.createUserErrorResponse));
    spyOn(signupService, 'acceptTermsAndConditions').and.returnValue(observableOf(OtpComponentMockResponse.tncAcceptResponse));
    component.mode = 'email';
    component.tncLatestVersion = 'v4';
    spyOn(component, 'logCreateUserError');
    component.createUser(OtpComponentMockResponse.data);
    expect(component.infoMessage).toEqual('');
    expect(component.disableSubmitBtn).toEqual(false);
    expect(component.logCreateUserError).toHaveBeenCalled();
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryCreateUserError);
  });

  it('it should redirect to sign page as tnc api failed but user created', () => {
    spyOn(component, 'redirectToSignPage');
    const signupService = TestBed.get(SignupService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    spyOn(signupService, 'createUserV3').and.returnValue(observableOf(OtpComponentMockResponse.createUserSuccessResponse));
    spyOn(signupService, 'acceptTermsAndConditions').and.returnValue(observableThrowError(OtpComponentMockResponse.tncAcceptResponse));
    component.mode = 'email';
    component.tncLatestVersion = 'v4';
    component.createUser(OtpComponentMockResponse.data);
    expect(component.redirectToSignPage).toHaveBeenCalled();
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryCreateUserSuccess);
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryTncError);
  });


  it('it should create new user', () => {
    const signupService = TestBed.get(SignupService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    spyOn(component, 'redirectToSignPage');
    spyOn(signupService, 'createUserV3').and.returnValue(observableOf(OtpComponentMockResponse.createUserSuccessResponse));
    spyOn(signupService, 'acceptTermsAndConditions').and.returnValue(observableOf(OtpComponentMockResponse.tncAcceptResponse));
    component.mode = 'email';
    component.tncLatestVersion = 'v4';
    component.createUser(OtpComponentMockResponse.data);
    expect(component.redirectToSignPage).toHaveBeenCalled();
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryCreateUserSuccess);
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryTncSuccess);
  });


});
