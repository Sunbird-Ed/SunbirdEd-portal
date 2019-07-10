import { ActivatedRoute, Router } from '@angular/router';
import { InterpolatePipe } from './../../../../../shared/pipes/interpolate/interpolate.pipe';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CacheService } from 'ng2-cache-service';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpComponent } from './otp.component';
import { OtpComponentMockResponse } from './otp.component.spec.data';
import { SignupService } from '../../services';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';


describe('OtpComponent', () => {
  let component: OtpComponent;
  let fixture: ComponentFixture<OtpComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'explore', pageid: 'download-offline-app', type: 'view'
        }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OtpComponent, InterpolatePipe],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), FormsModule, ReactiveFormsModule],
      providers: [ConfigService, CacheService, BrowserCacheTtlService,
        DeviceDetectorService, SignupService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: OtpComponentMockResponse.resourceBundle }
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
      contactType: ['phone']
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
    spyOn(signupService, 'generateOTP').and.returnValue(observableOf(OtpComponentMockResponse.generateOtpSuccessResponse));
    component.resendOTP();
    expect(component.errorMessage).toBe('');
  });

  it('it should not resend the otp', () => {
    component.errorMessage = OtpComponentMockResponse.resourceBundle.messages.fmsg.m0085;
    const signupService = TestBed.get(SignupService);
    spyOn(signupService, 'generateOTP').and.callFake(() => observableThrowError(OtpComponentMockResponse.verifyOtpErrorResponse));
    component.resendOTP();
    expect(component.errorMessage).toBe('There was a technical error. Try again.');
  });
});
