import { VerifyAccountIdentifierComponent } from './verify-account-identifier.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverAccountService } from './../../services';
import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule, ResourceService, UtilService, ToasterService} from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';
import { RecaptchaModule } from 'ng-recaptcha';

describe('VerifyAccountIdentifierComponent', () => {
  let component: VerifyAccountIdentifierComponent;
  let fixture: ComponentFixture<VerifyAccountIdentifierComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceServiceMockData = {
    messages: {
      imsg: {m0027: 'Something went wrong', m0086: 'otp attempt left {remainingAttempt}'},
      stmsg: { m0009: 'error' },
      emsg: {m0005: 'error', m0050: 'failed'}
    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        description: 'description',
        otpValidationFailed: 'OTP validation failed.'
      }
    }
  };
  class ActivatedRouteStub {
    snapshot = {
      data: {
        telemetry: { env: 'course', pageid: 'course-read', type: 'workflow', object: { ver: '1.0', type: 'course' } }
      }
    };
    queryParamsMock = { contentId: 'do_112270494168555520130' };
    queryParams = of(this.queryParamsMock);
    public changeQueryParams(params) {
      this.queryParamsMock = params;
    }
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyAccountIdentifierComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), FormsModule, ReactiveFormsModule,
        RecaptchaModule, CoreModule, SharedModule.forRoot()],
      providers: [RecoverAccountService, UtilService, ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceServiceMockData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyAccountIdentifierComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    recoverAccountService.fuzzySearchResults = [{}];
    recoverAccountService.selectedAccountIdentifier = {
      id: '123'
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect to login as no attempt left', () => {
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'redirectToLogin').and.callFake(() => {
    });
    component.handleError({error: {result: {remainingAttempt: 0}}});
    expect(utilService.redirectToLogin).toHaveBeenCalledWith(resourceServiceMockData.messages.emsg.m0050);
  });

  it('should show toaster error message as otp is wrong', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {
    });
    component.handleError({error: {result: {remainingAttempt: 1}}});
    expect(toasterService.error).toHaveBeenCalledWith('otp attempt left 1');
  });

  it('should call handleVerifyOtp', () => {
    const recoverAccountService = TestBed.get(RecoverAccountService);
    spyOn(recoverAccountService, 'verifyOTP').and.returnValue(of([{}]));
    spyOn(component, 'resetPassword').and.callFake(() => {})
    component.initializeForm();
    component.form.patchValue({otp: 123456});
    component.handleVerifyOtp();
    expect(component.resetPassword).toHaveBeenCalled();
    expect(component.disableFormSubmit).toBeTruthy();
  })
    it('should call handleResendOtp', () => {
      spyOn(component, 'resendOtpEnablePostTimer')
      component.resendOtpCounter = 1;
      component.maxResendTry = 1;
     const result = component.handleResendOtp();
      expect(component.disableResendOtp).toBeFalsy()
      expect(component.resendOtpCounter).toBe(2);
      expect(result).toBeFalsy();
    });
  
    it('should call handleResendOtp error case', () => {
      const recoverAccountService = TestBed.get(RecoverAccountService);
      const toasterService = TestBed.get(ToasterService);
      spyOn(toasterService, 'success').and.callFake(() => {
      });
      spyOn(component, 'resendOtpEnablePostTimer');
      spyOn(recoverAccountService, 'generateOTP').and.returnValue(of([{}]));
      component.resendOtpCounter = 1;
      component.maxResendTry = 3;
       component.handleResendOtp();
      expect(component.disableResendOtp).toBeFalsy()
      expect(component.resendOtpCounter).toBe(2);
      expect(toasterService.success).toHaveBeenCalledWith('OTP sent successfully.');
    });
    it('should call submitSelection', () => {
      component.isP2CaptchaEnabled = 'false';
      spyOn(component, 'handleResendOtp').and.callThrough();
      component.submitResendOTP();
      expect(component.handleResendOtp).toHaveBeenCalled();
    });
  
     it('should call resetPassword error case', () => {
      const recoverAccountService = TestBed.get(RecoverAccountService);
      spyOn(component, 'handleError').and.callFake(()=> {})
      spyOn(recoverAccountService, 'resetPassword').and.returnValue(throwError('error'));
      component.resetPassword();
      expect(component.handleError).toHaveBeenCalledWith('error')
  
     });
     it('should call resetPassword', () => {
      const recoverAccountService = TestBed.get(RecoverAccountService);
      const response = {
        result : {
          remainingAttempt : 1
        }
      }
      spyOn(component, 'handleError').and.callFake(()=> {})
      spyOn(recoverAccountService, 'resetPassword').and.returnValue(of(response));
      component.resetPassword();
      expect(component.handleError).toHaveBeenCalledWith(response)
     });
});
