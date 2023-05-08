import { SignupEmailPasswordComponent } from './signup-email-password.component';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { of, Subject, Subscription, throwError } from 'rxjs';
import {
  ResourceService,
  ConfigService,
  ToasterService,
  NavigationHelperService,
  UtilService,
  RecaptchaService
} from '@sunbird/shared';
import { SignupService } from './../../services';
import { TenantService, TncService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';

xdescribe('SignupEmailPasswordComponent', () => {
  let component: SignupEmailPasswordComponent;
  const mockFormBuilder: Partial<FormBuilder> = {};
  const mockResourceService: Partial<ResourceService> = {
    messages: {
      fmsg: {
        m0085: 'There was a technical error. Try again.',
        m0100: 'Enter valid Address line 2'
      },
    },
    frmelmnts: {
      lbl: {
        "uniquePhone": "This mobile number is already registered",
        "uniqueEmail": "Your email address is already registered",
        "blockedUserError": "The user account is blocked. Contact administratorn",
        "captchaValidationFailed": "Failed to validate your details",
        "passwd": "Your password must contain a minimum of 8 characters. It must include numerals, lower and upper case alphabets and special characters, without any spaces."
      }
    }
  };
  const mockSignupService: Partial<SignupService> = {
    checkUserExists: jest.fn().mockReturnValue(of({})),
    generateOTPforAnonymousUser: jest.fn().mockReturnValue(of({}))
  };
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn()
  };
  const mockTenantService: Partial<TenantService> = {
    tenantData$: of({ tenantData: { titleName: 'sample-favicon', logo: "logo-path" } }) as any
  };
  const mockDeviceDetectorService: Partial<DeviceDetectorService> = {
    getDeviceInfo: jest.fn().mockReturnValue({
      browser: "chrome",
      browser_version: "1",
      os_version: "1",
      os: "mac",
      userAgent: "agent"
    })
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      data: {
        telemetry: { env: 'course', pageid: 'signup', type: 'view', subtype: '',uri:'' }, uuid: 'testData'
      }
    } as any

  };
  const mockTelemetryService: Partial<TelemetryService> = {
    log: jest.fn(),
    interact: jest.fn()
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    getPageLoadTime:jest.fn()
  };
  const mockUtilService: Partial<UtilService> = {};
  const mockConfigService: Partial<ConfigService> = {

    constants: {
      TEMPLATES: {
        VERIFY_OTP_MINOR: "wardLoginOTP"
      }
    }
  }
  const mockRecaptchaService: Partial<RecaptchaService> = {};
  const mockTncService: Partial<TncService> = {};
  beforeAll(() => {
    component = new SignupEmailPasswordComponent(
      mockFormBuilder as FormBuilder,
      mockResourceService as ResourceService,
      mockSignupService as SignupService,
      mockToasterService as ToasterService,
      mockTenantService as TenantService,
      mockDeviceDetectorService as DeviceDetectorService,
      mockActivatedRoute as ActivatedRoute,
      mockTelemetryService as TelemetryService,
      mockNavigationHelperService as NavigationHelperService,
      mockUtilService as UtilService,
      mockConfigService as ConfigService,
      mockRecaptchaService as RecaptchaService,
      mockTncService as TncService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngonInit', () => {
    //arrange
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000'
      },
      onboardingInfo: {
        persona: 'teacher',
      },
      emailPassInfo: {
        key: 'sunbird_ed@yopmail.com',
        type: 'email',
        password: 'Test@123'
      }
    };
    mockFormBuilder.group = jest.fn(() => ({
      valueChanges: of({}),
      get: jest.fn(() => (
        {
          valueChanges: of(['SAMPLE_STRING']),
          patchValue: jest.fn(),
          value: ''
        }
      )),
      status: 'VALID',
      controls: {
        contactType: { value: 'phone' }
      },
    })) as any;
    jest.spyOn(component, 'initializeFormFields')
    //act
    component.ngOnInit()
    //assert
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('should call ngonInit for Minor', () => {
    //arrange
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000',
        isMinor: true
      },
      routeParams: {
        loginMode: 'gmail'
      }
    };
    mockFormBuilder.group = jest.fn(() => ({
      valueChanges: of({}),
      get: jest.fn(() => (
        {
          valueChanges: of(['SAMPLE_STRING']),
          patchValue: jest.fn(),
          value: ''
        }
      )),
      status: 'VALID',
      controls: {
        contactType: { value: 'phone' }
      },
    })) as any;
    jest.spyOn(component, 'initializeUpdateForm');
    let mockElement = (<HTMLInputElement>document.createElement('p1reCaptchaEnabled'));
    mockElement.value = "false";
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
    //act
    component.ngOnInit()
    //assert
    expect(component.initializeUpdateForm).toHaveBeenCalled();
    expect(component.showUpdateSignUpForm).toBeTruthy();
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

  xdescribe("getReCaptchaToken", () => {
    it('it should call getReCaptchaToken for phone', () => {
      component.startingForm = {
        basicInfo: {
          name: 'Sunbird',
          yearOfBirth: '2000',
          isMinor: true
        },

      };
      component.captchaRef = {
        execute: jest.fn()
      } as any
      component.signUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: '12345'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
        },
      } as any
      component.isP1CaptchaEnabled = 'true'
      component.getReCaptchaToken('phone')
      expect(component.captchaRef.execute).toHaveBeenCalled();
    });

    it('it should call getReCaptchaToken for email', () => {
      component.startingForm = {
        basicInfo: {
          name: 'Sunbird',
          yearOfBirth: '2000',
          isMinor: true
        },
        routeParams: {
          loginMode: 'gmail'
        }
      };
      component.captchaRef = {
        execute: jest.fn()
      } as any
      component.updateSignUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: 'a@b.c'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
        },
      } as any
      component.isP1CaptchaEnabled = 'true'
      component.getReCaptchaToken('email')
      expect(component.captchaRef.execute).toHaveBeenCalled();
    });

    it('it should call getReCaptchaToken', () => {
      component.startingForm = {
        basicInfo: {
          name: 'Sunbird',
          yearOfBirth: '2000',
          isMinor: true
        },
        routeParams: {
          loginMode: ''
        }
      };
      component.captchaRef = {
        execute: jest.fn()
      } as any
      component.signUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: 'a@b.c'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
          contactType: {
            value: 'phone'
          },
          phone: {
            value: '12345'
          }
        },
      } as any
      jest.spyOn(component, 'vaidateUserContact')
      component.isP1CaptchaEnabled = 'false'
      component.getReCaptchaToken('email')
      expect(component.vaidateUserContact).toHaveBeenCalled();
    });
  })
  xdescribe("validateUserContact", () => {
    it('it should call validateUserContact for email verification', () => {
      component.signUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: 'a@b.c'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
          contactType: {
            value: 'phone'
          },
          phone: {
            value: '12345'
          }
        },
      } as any;
      jest.spyOn(mockSignupService, 'checkUserExists').mockImplementation(() => of({
        result: {
          exists: true
        }
      }) as any)
      const captchaResponse = "G-cjkdjflsfkja"
      component.vaidateUserContact(captchaResponse)
      expect(component.showUniqueError).toBe('This mobile number is already registered')
    });

    it('it should call validateUserContact for phone verification', () => {
      component.signUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: 'a@b.c'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
          contactType: {
            value: 'email'
          },
          email: {
            value: 'a@b.c'
          }
        },
      } as any;
      jest.spyOn(mockSignupService, 'checkUserExists').mockImplementation(() => of({
        result: {
          exists: true
        }
      }) as any)
      const captchaResponse = "G-cjkdjflsfkja"
      component.vaidateUserContact(captchaResponse)
      expect(component.showUniqueError).toBe('Your email address is already registered')
    });

    it('it should call validateUserContact', () => {
      component.signUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: 'a@b.c'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
          contactType: {
            value: 'email'
          },
          email: {
            value: 'a@b.c'
          }
        },
      } as any;
      jest.spyOn(mockSignupService, 'checkUserExists').mockImplementation(() => of({}) as any)
      const captchaResponse = "G-cjkdjflsfkja"
      component.vaidateUserContact(captchaResponse)
      expect(component.showUniqueError).toBe('')
    });

    it('it should call validateUserContact when error occures', () => {
      component.signUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: 'a@b.c'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
          contactType: {
            value: 'email'
          },
          email: {
            value: 'a@b.c'
          }
        },
      } as any;
      jest.spyOn(mockSignupService, 'checkUserExists').mockImplementation(() => throwError({}) as any)
      const captchaResponse = "G-cjkdjflsfkja"
      component.vaidateUserContact(captchaResponse)
      expect(component.showUniqueError).toBe('')
    });

    it('it should call validateUserContact when account is blocked', () => {
      component.signUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: 'a@b.c'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
          contactType: {
            value: 'email'
          },
          email: {
            value: 'a@b.c'
          }
        },
      } as any;
      jest.spyOn(mockSignupService, 'checkUserExists').mockImplementation(() => throwError({ error: { params: { status: 'USER_ACCOUNT_BLOCKED' } } }) as any)
      const captchaResponse = "G-cjkdjflsfkja"
      component.vaidateUserContact(captchaResponse)
      expect(component.showUniqueError).toBe('The user account is blocked. Contact administratorn')
    });

    it('when error occures set error message for captha verification failed', () => {
      component.signUpForm = {
        get: jest.fn(() => (
          {
            status: 'VALID',
            value: 'a@b.c'
          })),
        controls: {
          uniqueContact: {
            setValue: jest.fn()
          },
          contactType: {
            value: 'email'
          },
          email: {
            value: 'a@b.c'
          }
        },
      } as any;
      jest.spyOn(mockSignupService, 'checkUserExists').mockImplementation(() => throwError({ status: 418 }) as any)
      const captchaResponse = "G-cjkdjflsfkja"
      component.vaidateUserContact(captchaResponse)
      expect(component.showUniqueError).toBe('Failed to validate your details')
    });
  })

  it('it should call resetInput', () => {
    component.updateSignUpForm = {
      controls: {
        phone: {
          reset: jest.fn(() => (
            {
              valueChanges: of(),
              value: ''
            }))
        },
        email: { reset: jest.fn() }

      },
    } as any
    component.resetInput()
  });

  it('should return telemetry log events', () => {
    //act
    component.telemetryLogEvents('test', true);
    // assert
    expect(mockTelemetryService.log).toHaveBeenCalled();
  });

  it('should call onPasswordChange', () => {
    const frmctrl = new FormControl('')
    component.showContact = 'email'
    //act
    component.onPasswordChange(frmctrl);
    // assert
    expect(component.passwordError).toBeDefined();
  });

  it('should return false telemetry log events', () => {
    //act
    component.telemetryLogEvents('test', false);
    // assert
    expect(mockTelemetryService.log).toHaveBeenCalled();
  });

  it('it should  call generateTelemetry', () => {
    component.generateTelemetry({ target: { checked: true } });
    expect(mockTelemetryService.interact).toHaveBeenCalled();
  });

  it('it should  call generateTelemetry', () => {
    component.generateTelemetry({ target: { checked: false } });
    expect(mockTelemetryService.interact).toHaveBeenCalled();
  });

  xdescribe("ngAfterViewInit", () => {
    it('should set signUpTelemetryImpression', () => {
      mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue(10);
      component.signUpTelemetryImpression();
      expect(component.telemetryImpression).toBeDefined();
    });

    // it("should set telemetry data", (done) => {
    //   jest.spyOn(component, 'signUpTelemetryImpression').mockImplementation();
    //   component.signUpForm = {
    //     controls: {
    //       uniqueContact: {  
    //         setValue: jest.fn(),
    //         value:'test'
    //       },
    //       contactType:'phone'
    //     },
    //     get: jest.fn(() => (
    //       {
    //         valueChanges: of(['SAMPLE_STRING']),
    //         patchValue: jest.fn(),
    //         value: ''
    //       }
    //     )),
    //   } as any
    //   component.ngAfterViewInit();
    //   setTimeout(() => {
    //     expect(component.telemetryCdata).toEqual([{ 'type': 'signup', 'id': mockActivatedRoute.snapshot.data.telemetry.uuid }]);
    //     expect(component.signUpTelemetryImpression).toHaveBeenCalled();
    //     done()
    //   });
    // });
  })

  it('should call showParentForm', () => {
    component.updateSignUpForm = {
      valueChanges: of({}),
      get: jest.fn(() => (
        {
          valueChanges: of(['SAMPLE_STRING']),
          patchValue: jest.fn(),
          value: ''
        }
      )),
    } as any
    jest.spyOn(component, 'initializeFormFields');
    component.showParentForm('true');
    expect(component.showSignUpForm).toBe(true);
  });

  xdescribe("displayPassword", () => {
    it('should call displayPassword', () => {
      component.showPassword = true
      component.displayPassword();
      expect(component.showPassword).toBe(false);
    });

    it('should call displayPassword', () => {
      component.showPassword = false
      component.displayPassword();
      expect(component.showPassword).toBe(true);
    });
  })

  it('should call enableSignUpSubmitButton', () => {
    component.signUpForm = {
      valueChanges: of({}),
      controls: {
        contactType: { value: 'phone' },
        phone: {
          value: ''
        }
      },
      status: 'INVALID'
    } as any
    component.enableSignUpSubmitButton();
    expect(component.disableSubmitBtn).toBe(true);
  });

  xdescribe("resolved", () => {
    it('it should call resolved', () => {
      component.startingForm = {
        basicInfo: {
          name: 'Sunbird',
          yearOfBirth: '2000',
          isMinor: true
        },
        onboardingInfo: {
          persona: 'teacher',
        },
        emailPassInfo: {
          key: 'sunbird_ed@yopmail.com',
          type: 'email',
          password: 'Test@123'
        },
        routeParams: {
          loginMode: ''
        }
      };
      component.formInputType = 'email'
      const captchaResponse = "G-cjkdjflsfkja"
      component.resolved(captchaResponse)
      expect(component.formInputType).not.toBeDefined()
    });

    it('it should call resolved for email', () => {
      component.startingForm = {
        basicInfo: {
          name: 'Sunbird',
          yearOfBirth: '2000',
          isMinor: true
        },
        onboardingInfo: {
          persona: 'teacher',
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
      component.updateSignUpForm = {
        controls: {
          contactType: { value: 'email' },
          phone: {
            reset: jest.fn(() => (
              {
                valueChanges: of(),
                value: ''
              }))
          },
          email: { reset: jest.fn() },
          password: {
            value: 'test'
          }
        },
      } as any
      component.formInputType = 'email'
      const captchaResponse = "G-cjkdjflsfkja"
      jest.spyOn(component, 'onSubmitSignUpForm')
      component.resolved(captchaResponse)
      expect(component.showSignUpForm).toBeFalsy()
      expect(component.disableSubmitBtn).toBeFalsy()
    });
  })

  xdescribe("generateOTP", () => {
    it('it should not generate otp for already used phone', () => {
      jest.spyOn(mockSignupService, 'generateOTPforAnonymousUser').mockImplementation(() => throwError({
        error: { params: { status: 'PHONE_ALREADY_IN_USE', errmsg: 'PHONE_ALREADY_IN_USE' } }
      }));

      component.startingForm = {
        basicInfo: {
          name: 'Sunbird',
          yearOfBirth: '2000',
          isMinor: true
        },
        onboardingInfo: {
          persona: 'teacher',
        },
        emailPassInfo: {
          key: 'sunbird_ed@yopmail.com',
          type: 'email',
          password: 'Test@123'
        }
      };
      component.signUpForm = {
        controls: {
          contactType: { value: 'phone' },
          phone: {
            value: ''
          }
        },
      } as any
      const captchaResponse = "G-cjkdjflsfkja"
      component.generateOTP(captchaResponse);
      expect(mockToasterService.error).toHaveBeenCalledWith('PHONE_ALREADY_IN_USE')
    });

    it('it should not generate otp for already used email', () => {
      jest.spyOn(mockSignupService, 'generateOTPforAnonymousUser').mockImplementation(() => throwError({
        error: { params: { status: 'EMAIL_IN_USE', errmsg: 'EMAIL_IN_USE' } }
      }));

      component.startingForm = {
        basicInfo: {
          name: 'Sunbird',
          yearOfBirth: '2000',
          isMinor: true
        },
        onboardingInfo: {
          persona: 'teacher',
        },
        emailPassInfo: {
          key: 'sunbird_ed@yopmail.com',
          type: 'email',
          password: 'Test@123'
        }
      };
      component.signUpForm = {
        controls: {
          contactType: { value: 'email' },
          email: {
            value: ''
          }
        },
      } as any
      const captchaResponse = "G-cjkdjflsfkja"
      component.generateOTP(captchaResponse);
      expect(mockToasterService.error).toHaveBeenCalledWith('EMAIL_IN_USE')
    });

    it('it should not generate otp', () => {
      jest.spyOn(mockSignupService, 'generateOTPforAnonymousUser').mockImplementation(() => throwError({}));
      component.startingForm = {
        basicInfo: {
          name: 'Sunbird',
          yearOfBirth: '2000',
          isMinor: true
        },
        onboardingInfo: {
          persona: 'teacher',
        },
        emailPassInfo: {
          key: 'sunbird_ed@yopmail.com',
          type: 'email',
          password: 'Test@123'
        }
      };
      component.signUpForm = {
        controls: {
          contactType: { value: 'email' },
          email: {

            value: ''
          }
        },
      } as any
      const captchaResponse = "G-cjkdjflsfkja"
      component.isP1CaptchaEnabled = 'true'
      component.generateOTP(captchaResponse);
      expect(mockToasterService.error).toHaveBeenCalledWith("There was a technical error. Try again.");
      expect(component.disableSubmitBtn).toBeFalsy();
    });
  })

  xdescribe("submitSignupForm for captcha enabled", () => {
    it('should submitSignupForm', () => {
      component.isP1CaptchaEnabled = 'true'
      component.captchaRef = {
        execute: jest.fn()
      } as any
      jest.spyOn(component, 'resetGoogleCaptcha')
      component.submitSignupForm()
      expect(component.resetGoogleCaptcha).toHaveBeenCalled()
    });

    it('should submitSignupForm', () => {
      component.isP1CaptchaEnabled = 'false'
      jest.spyOn(component, 'onSubmitSignUpForm')
      component.submitSignupForm()
      expect(component.onSubmitSignUpForm).toHaveBeenCalled()
    })
  })

  xdescribe("ngOnDestroy", () => {
    it('should destroy sub', () => {
      component.unsubscribe = {
        next: jest.fn(),
        complete: jest.fn()
      } as any;
      component.ngOnDestroy();
      expect(component.unsubscribe.next).toHaveBeenCalled();
      expect(component.unsubscribe.complete).toHaveBeenCalled();
    });
  })
});
