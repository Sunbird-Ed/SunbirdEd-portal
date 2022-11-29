import { SignupOnboardingInfoComponent } from './signup-onboarding-info.component';
import { ResourceService, ToasterService } from '../../../../../shared';
import { ProfileService } from '@sunbird/profile';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';

describe('SignupOnboardingInfoComponent', () => {
  let component: SignupOnboardingInfoComponent;

  const mockResourceService: Partial<ResourceService> = {};
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
    success: jest.fn()
  };
  const mockProfileService: Partial<ProfileService> = {
    updateProfile(request): Observable<any> {
      return of({});
    }
  };
  const mockRouter: Partial<Router> = {
    navigate: jest.fn()
  };

  beforeAll(() => {
    component = new SignupOnboardingInfoComponent(
      mockResourceService as ResourceService,
      mockToasterService as ToasterService,
      mockRouter as Router,
      mockProfileService as ProfileService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should call onRegisterSubmit on submitting form", () => {
    jest.spyOn(component.subformInitialized, 'emit');
    jest.spyOn(component.triggerNext, 'emit');
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
    const onboardingData = {}
    component.onRegisterSubmit(onboardingData);
    expect(component.subformInitialized.emit).toHaveBeenCalled();
    expect(component.triggerNext.emit).toHaveBeenCalled();
  });

  it("should call onRegisterSubmit on submitting form for gmail registration workflow - minor", () => {
    jest.spyOn(component.subformInitialized, 'emit');
    jest.spyOn(component.triggerNext, 'emit');
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
    const onboardingData = {}
    component.onRegisterSubmit(onboardingData);
    expect(component.subformInitialized.emit).toHaveBeenCalled();
    expect(component.triggerNext.emit).toHaveBeenCalled();
  });

  it("should call onRegisterSubmit on submitting form for gmail registration workflow - major", () => {
    jest.spyOn(component.subformInitialized, 'emit');
    jest.spyOn(component.triggerNext, 'emit');
    component.startingForm = {
      basicInfo: {
        name: 'Sunbird',
        yearOfBirth: '2000',
        isMinor: false
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
    const onboardingData = {};
    jest.spyOn(mockProfileService, 'updateProfile').mockReturnValue(of({ result: { response: 'SUCCESS' } }) as any);
    jest.spyOn(component, 'updateUserDetails').mockImplementation(() => { });
    component.onRegisterSubmit(onboardingData);
    expect(component.updateUserDetails).toHaveBeenCalled();
  });

});
