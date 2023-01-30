import { ResourceService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { SignupComponent } from './signup.component';
import { TenantService, FormService } from '@sunbird/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;

  const mockResourceService: Partial<ResourceService> = {
    instance: 'SUNBIRD'
  };
  const mockTenantService: Partial<TenantService> = {
    tenantData$: of({tenantData: {titleName: 'sample-favicon', logo: "logo-path"}}) as any
  };
  const mockDeviceDetectorService: Partial<DeviceDetectorService> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      data: {
        telemetry: {
          env: 'signup', pageid: 'signup', uri: '/signup',
          type: 'view', mode: 'self', uuid: 'hadfisgefkjsdvv'
        }
      }
    } as any,
    queryParams: of({}) as any
  };
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockNavigationHelperService: Partial<NavigationHelperService> = {};
  const mockRouter: Partial<Router> = {
    navigate: jest.fn()
  };

  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn()
  };

  const SignUpStage = {
    BASIC_INFO:'basic_info',
    ONBOARDING_INFO:'onboarding_info',
    EMAIL_PASSWORD:'email_password',
    OTP:'otp'
  }
  beforeAll(() => {
    component = new SignupComponent(
      mockResourceService as ResourceService, 
      mockTenantService as TenantService, 
      mockDeviceDetectorService as DeviceDetectorService, 
      mockActivatedRoute as ActivatedRoute, 
      mockTelemetryService as TelemetryService, 
      mockNavigationHelperService as NavigationHelperService, 
      mockRouter as Router,
      mockFormService as FormService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialized initializeFormFields', () => {
    component.initializeFormFields();
    expect(component.signUpForm).toEqual({
      basicInfo: null,
      onboardingInfo: null,
      emailPassInfo: null
    });
  });

  it('should set Interact Event telemetry Data', () => {
    const deviceInfo = {
      browser: "chrome",
      browser_version: "1",
      os_version: "1",
      os: "mac",
      userAgent: "agent"
    }
    mockDeviceDetectorService.getDeviceInfo = jest.fn().mockReturnValue(deviceInfo);
    component.setInteractEventData();
    expect(component.submitInteractEdata).toBeDefined();
  });

  it('should set Interact Event telemetry Data', () => {
    component.signUpTelemetryStart();
    expect(component.telemetryStart).toBeDefined();
  });

  it('should initialize sub form with data', () => {
    const basicFormFields = {
      name: "test-user",
      yearOfBirth: "2000"
    }
    component.subformInitialized('basicInfo', basicFormFields);
    expect(component.signUpForm.basicInfo).toEqual(basicFormFields);
  });

  describe("ngOnInit", () => {
    it('initialize Form Fields and telemetry', () => {
      jest.spyOn(component, 'initializeFormFields').mockImplementation();
      jest.spyOn(component, 'setInteractEventData').mockImplementation();
      jest.spyOn(component, 'signUpTelemetryStart').mockImplementation();
      mockFormService.getFormConfig = jest.fn().mockImplementation(() => of());
      component.ngOnInit();
      expect(component.signupStage).toEqual(SignUpStage.BASIC_INFO);
      expect(component.instance).toEqual(mockResourceService.instance);
      expect(component.initializeFormFields).toHaveBeenCalled();
      expect(component.setInteractEventData).toHaveBeenCalled();
      expect(component.signUpTelemetryStart).toHaveBeenCalled();
    });
  
  });

  describe("changeStep", () => {
    let registerConfig: any;
    const formInputParams = {
      formType: 'config',
      contentType: 'register',
      formAction: 'display',
      component: 'portal',
    };

    it("should change signup form stage to onboarding info stage", () => {
      component.signupStage = SignUpStage.BASIC_INFO as any;
      component.changeStep();
      expect(component.signupStage).toEqual(SignUpStage.ONBOARDING_INFO);
    });

    it("should change signup form from basic stage to email and password stage", () => {
      mockFormService.getFormConfig = jest.fn(() => of({ 'skipStepTwo': true }));
      mockFormService.getFormConfig(formInputParams).subscribe(data => {
        registerConfig = data;
      });

      component.changeStep();
      expect(registerConfig.skipStepTwo).toEqual(true);
      expect(component.signupStage).toEqual(SignUpStage.EMAIL_PASSWORD);
    });

    it("should change signup form to email and password stage", () => {
      component.signupStage = SignUpStage.ONBOARDING_INFO as any
      component.changeStep();
      expect(component.signupStage).toEqual(SignUpStage.EMAIL_PASSWORD)
    });

    it("should change signup form to otp stage", () => {
      component.signupStage = SignUpStage.EMAIL_PASSWORD as any
      component.changeStep();
      expect(component.signupStage).toEqual(SignUpStage.OTP)
    });

    it("should set default basic info stage", () => {
      component.signupStage = "" as any
      component.changeStep();
      expect(component.signupStage).toEqual(SignUpStage.BASIC_INFO)
    });
  })

  describe("ngAfterViewInit", () => {

    it('should set signUpTelemetryImpression', () => {
      mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue(10);
      component.signUpTelemetryImpression();
      expect(component.telemetryImpression).toBeDefined();
    });
    
    it("should set telemetry data", (done) => {
      jest.spyOn(component, 'signUpTelemetryImpression').mockImplementation();
      component.ngAfterViewInit();
      setTimeout(() => {
        expect(component.telemetryCdata).toEqual([{ 'type': 'signup', 'id': mockActivatedRoute.snapshot.data.telemetry.uuid }]);
        expect(component.signUpTelemetryImpression).toHaveBeenCalled();
        done()
      });
    });

  })

  describe("ngOnDestroy", () => {
    it('should destroy sub', () => {
        component.unsubscribe$ = {
            next: jest.fn(),
            complete: jest.fn()
        } as any;
        component.ngOnDestroy();
        expect(component.unsubscribe$.next).toHaveBeenCalled();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
    });

    it('should unsubscribe tenantDataSubscription', () => {
        component.tenantDataSubscription = {
          unsubscribe: jest.fn()
        } as any;
        component.unsubscribe$ = {
            next: jest.fn(),
            complete: jest.fn()
        } as any;
        component.ngOnDestroy();
        expect(component.unsubscribe$.next).toHaveBeenCalled();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
        expect(component.tenantDataSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
