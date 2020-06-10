import { RouterTestingModule } from '@angular/router/testing';
import { OtpPopupComponent } from './otp-popup.component';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {ResourceService, SharedModule, ToasterService} from '@sunbird/shared';
import { CoreModule, TenantService, OtpService, UserService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { testData } from './otp-popup.component.spec.data';
import { configureTestSuite } from '@sunbird/test-util';

describe('OtpPopupComponent', () => {
  let component: OtpPopupComponent;
  let fixture: ComponentFixture<OtpPopupComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, SuiModule, TelemetryModule.forRoot() , RouterTestingModule],
      declarations: [OtpPopupComponent],
      providers: [{
        provide: ResourceService,
        useValue: testData.resourceBundle
      }, ToasterService, TenantService, OtpService, UserService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpPopupComponent);
    component = fixture.componentInstance;
  });

  it('should show validation error message for form', () => {
    spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    expect(component.otpForm.valid).toBeFalsy();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });

  it('should unsubscribe from all observable subscriptions', () => {
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });

  it('set values with enabling the submit button', () => {
    component.ngOnInit();
    const email = component.otpForm.controls['otp'];
    email.setValue('784758');
    expect(component.enableSubmitBtn).toBeTruthy();
  });

  it('call verifyOTP and get success', () => {
    component.otpData = { 'wrongOtpMessage': 'test' };
    component.ngOnInit();
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'verifyOTP').and.returnValue(observableOf(testData.verifyOtpSuccess));
    component.verifyOTP();
    expect(component.infoMessage).toEqual('');
    expect(component.errorMessage).toEqual('');
  });

  it('call verifyOTP and get error', () => {
    component.otpData = { 'wrongOtpMessage': 'test' };
    component.ngOnInit();
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'verifyOTP').and.returnValue(observableThrowError(testData.verifyOtpError));
    component.verifyOTP();
    expect(component.enableSubmitBtn).toBeTruthy();
  });

  it('call verifyOTP and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {
    });
    component.otpData = {'wrongOtpMessage': 'test'};
    component.ngOnInit();
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'verifyOTP').and.returnValue(observableThrowError(testData.noAttemptLeft));
    component.verifyOTP();
    expect(toasterService.error).toHaveBeenCalledWith(testData.resourceBundle.messages.emsg.m0050);
  });

  it('call resendOTP and get success', () => {
    component.otpData = { 'type': 'email', 'value': 'abc@gmail.com' };
    component.ngOnInit();
    const otpService = TestBed.get(OtpService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.frmelmnts = testData.resourceBundle.frmelmnts;
    spyOn(otpService, 'generateOTP').and.returnValue(observableOf(testData.resendOtpSuccess));
    component.resendOTP();
    expect(component.errorMessage).toEqual('');
  });

  it('call resendOTP and get error', () => {
    component.otpData = { 'type': 'email', 'value': 'abc@gmail.com' };
    component.ngOnInit();
    const otpService = TestBed.get(OtpService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = testData.resourceBundle.messages;
    spyOn(otpService, 'generateOTP').and.returnValue(observableThrowError(testData.resendOtpError));
    component.resendOTP();
    expect(component.infoMessage).toEqual('');
  });
});
