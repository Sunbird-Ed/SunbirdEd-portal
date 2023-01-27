import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ResourceService, ConfigService, BrowserCacheTtlService, UtilService } from '../../../../../shared';
import {  TelemetryService } from '../../../../../telemetry';
import { OtpComponent } from './otp.component';
import { OtpComponentMockResponse } from './otp.component.spec.data';
import { SignupService } from '../../services';
import { throwError as observableThrowError, of as observableOf, Observable, throwError, of } from 'rxjs';
import * as _ from 'lodash-es';
import { TncService } from '../../../../../core';
import { ToasterService } from '../../../../../shared';
import { ProfileService } from '../../../../../../plugins/profile';

describe('OtpComponent', () => {
  let component: OtpComponent;
  const resourceService: Partial<ResourceService> = {};
  const signupService: Partial<SignupService> = {
    verifyOTP: jest.fn(),
    generateOTPforAnonymousUser: jest.fn(),
    generateOTP: jest.fn(),
    createUserV3: jest.fn(),
    acceptTermsAndConditions: jest.fn()
  };
  const activatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      data: {
        telemetry: {
          env: 'explore', pageid: 'download-offline-app', type: 'view', uuid: '9545879'
        }
      },
      queryParams: {
        client_id: 'portal', redirectUri: '/learn',
        state: 'state-id', response_type: 'code', version: '3'
      }
    } as any,
  };
  const telemetryService: Partial<TelemetryService> = {
    interact: jest.fn(),
    log: jest.fn()
  };
  const deviceDetectorService: Partial<DeviceDetectorService> = {};
  const router: Partial<Router> = {
    navigate: jest.fn()
  };
  const utilService: Partial<UtilService> = {
    parseJson: jest.fn()
  };
  const configService: Partial<ConfigService> = {};
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
  const toasterService: Partial<ToasterService> = {
    error: jest.fn(),
    success: jest.fn()
  };
  const profileService: Partial<ProfileService> = {};
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

  beforeEach(() => {
    component = new OtpComponent(
      resourceService as ResourceService,
      signupService as SignupService,
      activatedRoute as ActivatedRoute,
      telemetryService as TelemetryService,
      deviceDetectorService as DeviceDetectorService,
      router as Router,
      utilService as UtilService,
      configService as ConfigService,
      tncService as TncService,
      toasterService as ToasterService,
      profileService as ProfileService);
    const fb = new FormBuilder();
    component.signUpdata = fb.group({
      name: ['test'],
      password: ['test1234'],
      confirmPassword: ['test1234'],
      phone: ['9876543210'],
      email: ['test@gmail.com'],
      contactType: ['phone'],
      tncAccepted: ['true']
    })
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit for email verification', () => {
    component.mode = 'email';
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      }
    };

    resourceService.frmelmnts = OtpComponentMockResponse.resourceBundle.frmelmnts;
    jest.spyOn(component, 'enableSignUpSubmitButton');
    // @ts-ignore
    window.setInterval = jest.fn((fn) => fn(), 1000) as any;
    component.ngOnInit();
    expect(component.enableSignUpSubmitButton).toHaveBeenCalled();
  });

  it('should call ngOnInit for phone verification', () => {
    component.mode = 'phone';
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'phone',
        password: 'Test@123'
      },
      routeParams: {
        loginMode: 'gmail'
      }
    };
    resourceService.frmelmnts = OtpComponentMockResponse.resourceBundle.frmelmnts;
    let mockElement = (<HTMLInputElement>document.createElement('p2reCaptchaEnabled'));
    mockElement.value = "false";
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
    jest.spyOn(tncService, 'getTncConfig').mockReturnValue(observableThrowError({}));
    jest.spyOn(component, 'enableSignUpSubmitButton');
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should verify the OTP and call createUser()', () => {
    component.mode = 'phone';
    resourceService.frmelmnts = OtpComponentMockResponse.resourceBundle.frmelmnts;
    jest.spyOn(signupService, 'verifyOTP').mockReturnValue(observableOf(OtpComponentMockResponse.verifyOtpSuccessResponse));
    jest.spyOn(component, 'createUser');
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(false, [Validators.requiredTrue])
    });
    component.verifyOTP();
    expect(component.createUser).toHaveBeenCalled();
    expect(component.infoMessage).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should verify the OTP and call updateUserBasicInfo()', () => {
    component.mode = 'phone';
    resourceService.frmelmnts = OtpComponentMockResponse.resourceBundle.frmelmnts;
    jest.spyOn(signupService, 'verifyOTP').mockReturnValue(observableOf(OtpComponentMockResponse.verifyOtpSuccessResponse));
    jest.spyOn(component, 'updateUserBasicInfo');
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(false, [Validators.requiredTrue])
    });
    component.startingForm = {
      routeParams: {
        loginMode: 'gmail'
      }
    };
    component.verifyOTP();
    expect(component.updateUserBasicInfo).toHaveBeenCalled();
    expect(component.infoMessage).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should not verify the OTP for phone', () => {
    component.mode = 'phone';
    resourceService.frmelmnts = OtpComponentMockResponse.resourceBundle.frmelmnts;
    resourceService.messages = OtpComponentMockResponse.resourceBundle.messages;
    component.disableResendButton = true;
    jest.spyOn(signupService, 'verifyOTP').mockImplementation(() => throwError(OtpComponentMockResponse.verifyOtpErrorResponse));
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(false, [Validators.requiredTrue])
    });
    component.verifyOTP();
    expect(signupService.verifyOTP).toHaveBeenCalled();
  });

  it('should not verify the OTP for email', () => {
    component.mode = 'email';
    resourceService.frmelmnts = OtpComponentMockResponse.resourceBundle.frmelmnts;
    resourceService.messages = OtpComponentMockResponse.resourceBundle.messages;
    OtpComponentMockResponse.verifyOtpErrorResponse.error.result.remainingAttempt = 0
    jest.spyOn(signupService, 'verifyOTP').mockImplementation(() => throwError(OtpComponentMockResponse.verifyOtpErrorResponse));
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(false, [Validators.requiredTrue])
    });
    component.verifyOTP();
    expect(signupService.verifyOTP).toHaveBeenCalled();

  });
  it('it should resend otp', () => {
    jest.spyOn(signupService, 'generateOTPforAnonymousUser').mockReturnValue(observableOf(OtpComponentMockResponse.generateOtpSuccessResponse));
    jest.spyOn(component, 'resendOTP').mockImplementation(((captcha) => {
      const request = OtpComponentMockResponse.generateOtp;
    }) as any);
    const captchaResponse = "G-cjkdjflsfkja"
    component.resendOTP(captchaResponse);
    expect(component.errorMessage).not.toBeDefined;
  });

  it('it should resend otp with for user', () => {
    jest.spyOn(signupService, 'generateOTPforAnonymousUser').mockReturnValue(observableOf(OtpComponentMockResponse.generateOtpSuccessResponse));
    const contactType = component.signUpdata.controls['contactType'];
    contactType.setValue('phone');
    const phone = component.signUpdata.controls['phone'];
    phone.setValue(OtpComponentMockResponse.generateOtpMinor.request.key);
    jest.spyOn(component, 'resendOTP').mockImplementation(((captcha) => {
      const request = OtpComponentMockResponse.generateOtp;
    }) as any);
    const captchaResponse = "G-cjkdjflsfkja"
    component.resendOTP(captchaResponse);
    expect(component.errorMessage).not.toBeDefined;
  });

  it('it should throw error for resending the otp for exceeded tries', () => {
    component.resendOtpCounter = 5;
    component.maxResendTry = 4;
    component.resendOTP();
    expect(component.errorMessage).toBe(OtpComponentMockResponse.resourceBundle.frmelmnts.lbl.OTPresendMaxretry);
  });

  it('it should call updateUserBasicInfo for phone', () => {
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'phone',
        password: 'Test@123'
      },
    };
    profileService.updateProfile = jest.fn(() => of({
      'result': {
        'response': 'SUCCESS'
      }
    })) as any;
    component.updateUserBasicInfo();
  });

  it('it should call updateUserBasicInfo for email', () => {
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      },
    };
    // @ts-ignore
    window.setTimeout = jest.fn((fn) => fn(), 1000) as any;
    profileService.updateProfile = jest.fn(() => of({
      'result': {
        'response': 'SUCCESS'
      }
    })) as any;
    component.updateUserBasicInfo();
    expect(toasterService.success).toHaveBeenCalled();

  });

  it('it should call updateUserBasicInfo', () => {
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      },
    };
    profileService.updateProfile = jest.fn(() => of({
      'result': {
        'response': 'FAILURE'
      }
    })) as any;
    component.updateUserBasicInfo()
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('it should not call updateUserBasicInfo for email', () => {
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      },
    };
    jest.spyOn(profileService, 'updateProfile').mockReturnValue(observableThrowError({}))
    component.updateUserBasicInfo();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('it should call redirectToSignUp', () => {
    jest.spyOn(component.redirectToParent, 'emit')
    component.redirectToSignUp();
    expect(component.redirectToParent.emit).toHaveBeenCalled()
  });

  it('it should call showAndHidePopup', () => {
    component.showAndHidePopup(true);
    expect(component.showTncPopup).toBeTruthy();
  });

  it('it should call resetGoogleCaptcha', () => {
    let mockElement = (<HTMLElement>document.createElement('resetGoogleCaptcha'));
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
    component.resetGoogleCaptcha()
  });

  it('it should call resolved', () => {
    component.startingForm = {
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      }
    };
    jest.spyOn(component, 'resendOTP')
    const captchaResponse = "G-cjkdjflsfkja"
    component.resolved(captchaResponse)
    expect(component.resendOTP).toHaveBeenCalled();
  });

  it('it should  call generateResendOTP', () => {
    component.isP2CaptchaEnabled = 'false'
    component.startingForm = {
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      }
    };
    jest.spyOn(component, 'resendOTP')
    component.generateResendOTP();
    expect(component.resendOTP).toHaveBeenCalled();
  });

  it('it should  call generateTelemetry', () => {
    component.generateTelemetry({ target: { checked: true } });
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('it should  call generateTelemetry', () => {
    component.generateTelemetry({ target: { checked: false } });
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('it should not resend the otp', () => {
    const contactType = component.signUpdata.controls['contactType'];
    contactType.setValue('phone');
    component.startingForm = {
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      }
    };
    component.generateOTPErrorInteractEdata = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata: [{ 'type': 'otp' }]
      },
      edata: {
        id: 'resend-otp-error',
        type: 'click',
        pageid: 'otp',
        extra: {
          'isError': 'true'
        }
      }
    };
    const phone = component.signUpdata.controls['phone'];
    phone.setValue(OtpComponentMockResponse.generateOtpMinor.request.key);
    jest.spyOn(signupService, 'generateOTPforAnonymousUser').mockImplementation(() => observableThrowError(OtpComponentMockResponse.verifyOtpErrorResponse));
    component.resendOTP();
    expect(component.errorMessage).toBe('There was a technical error. Try again.');
  });

  it('it should resend the otp', () => {
    const contactType = component.signUpdata.controls['contactType'];
    contactType.setValue('phone');
    component.startingForm = {
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      }
    };

    const phone = component.signUpdata.controls['phone'];
    phone.setValue(OtpComponentMockResponse.generateOtpMinor.request.key);
    jest.spyOn(signupService, 'generateOTPforAnonymousUser').mockImplementation(() => observableThrowError(OtpComponentMockResponse.verifyOtpErrorResponse));
    component.resendOTP();
    expect(component.errorMessage).toBe('There was a technical error. Try again.');
  });

  it('it should not create new user as create user api failed', () => {
    jest.spyOn(telemetryService, 'log');
    jest.spyOn(signupService, 'createUserV3').mockReturnValue(observableThrowError(OtpComponentMockResponse.createUserErrorResponse));
    jest.spyOn(signupService, 'acceptTermsAndConditions').mockReturnValue(observableOf(OtpComponentMockResponse.tncAcceptResponse));
    component.mode = 'email';
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      },
      routeParams: {
        loginMode: 'gmail'
      }
    };
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(true, [Validators.requiredTrue])
    });
    component.tncLatestVersion = 'v4';
    jest.spyOn(component, 'logCreateUserError');
    component.createUser(OtpComponentMockResponse.data);
    expect(component.infoMessage).toEqual('');
    expect(component.disableSubmitBtn).toEqual(false);
    expect(component.logCreateUserError).toHaveBeenCalled();
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryCreateUserError);
  });

  it('it should not create new user as create user api failed', () => {
    jest.spyOn(telemetryService, 'log');
    OtpComponentMockResponse.createUserErrorResponse.status = 301
    jest.spyOn(signupService, 'createUserV3').mockReturnValue(observableThrowError(OtpComponentMockResponse.createUserErrorResponse));
    jest.spyOn(signupService, 'acceptTermsAndConditions').mockReturnValue(observableOf(OtpComponentMockResponse.tncAcceptResponse));
    component.mode = 'email';
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      },
      routeParams: {
        loginMode: 'gmail'
      }
    };
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(true, [Validators.requiredTrue])
    });
    component.tncLatestVersion = 'v4';
    jest.spyOn(component, 'logCreateUserError');
    component.createUser(OtpComponentMockResponse.data);
    expect(component.infoMessage).toEqual('');
    expect(component.disableSubmitBtn).toEqual(false);
    expect(component.logCreateUserError).toHaveBeenCalled();
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryCreateUserError);
  });

  it('it should redirect to sign page as tnc api failed but user created', () => {
    jest.spyOn(component, 'redirectToSignPage');
    jest.spyOn(telemetryService, 'log');
    jest.spyOn(signupService, 'createUserV3').mockReturnValue(observableOf(OtpComponentMockResponse.createUserSuccessResponse));
    jest.spyOn(signupService, 'acceptTermsAndConditions').mockReturnValue(observableThrowError(OtpComponentMockResponse.tncAcceptResponse));
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      }
    };
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(true, [Validators.requiredTrue])
    });
    component.mode = 'email';
    component.tncLatestVersion = 'v4';
    component.createUser(OtpComponentMockResponse.data);
    expect(component.redirectToSignPage).toHaveBeenCalled();
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryCreateUserSuccess);
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryTncError);
  });


  it('it should create new user for email user', () => {
    jest.spyOn(telemetryService, 'log');
    jest.spyOn(component, 'redirectToSignPage');
    jest.spyOn(signupService, 'createUserV3').mockReturnValue(observableOf(OtpComponentMockResponse.createUserSuccessResponse));
    jest.spyOn(signupService, 'acceptTermsAndConditions').mockReturnValue(observableOf(OtpComponentMockResponse.tncAcceptResponse));
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      }
    };
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(true, [Validators.requiredTrue])
    });
    component.mode = 'email';
    component.tncLatestVersion = 'v4';
    component.createUser(OtpComponentMockResponse.data);
    expect(component.redirectToSignPage).toHaveBeenCalled();
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryCreateUserSuccess);
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryTncSuccess);
  });

  it('it should create new user for phone user', () => {
    jest.spyOn(telemetryService, 'log');
    jest.spyOn(component, 'redirectToSignPage');
    jest.spyOn(signupService, 'createUserV3').mockReturnValue(observableOf(OtpComponentMockResponse.createUserSuccessResponse));
    jest.spyOn(signupService, 'acceptTermsAndConditions').mockReturnValue(observableOf(OtpComponentMockResponse.tncAcceptResponse));
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'phone',
        password: 'Test@123'
      }
    };
    component.otpForm = new FormGroup({
      otp: new FormControl('895136', [Validators.required]),
      tncAccepted: new FormControl(true, [Validators.requiredTrue])
    });
    component.mode = 'phone';
    component.tncLatestVersion = 'v4';
    component.createUser(OtpComponentMockResponse.data);
    expect(component.redirectToSignPage).toHaveBeenCalled();
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryCreateUserSuccess);
    expect(telemetryService.log).toHaveBeenCalledWith(OtpComponentMockResponse.telemetryTncSuccess);
  });
});