// import { By } from '@angular/platform-browser';
import { of as observableOf, throwError } from 'rxjs';
import { onboarding_user_preference_test } from './onboarding-user-preference.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OnboardingUserPreferenceComponent } from './onboarding-user-preference.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { OrgDetailsService, ChannelService, FrameworkService } from '@sunbird/core';


describe('OnboardingUserPreferenceComponent', () => {
  let component: OnboardingUserPreferenceComponent;
  let fixture: ComponentFixture<OnboardingUserPreferenceComponent>;

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        submit: 'Submit'
      }
    },
    messages: {
      emsg: {
        m0022: 'Unable to save user preferenece. please try again after some time.',
        m0005: 'Something went wrong. Please try again later...'
      },
      smsg: {
        m0058: 'User preference saved successfully...'
      }
    }
  };
  class ActivatedRouteStub {
  }

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingUserPreferenceComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot(), SuiModule, FormsModule, ReactiveFormsModule],
      providers: [ OrgDetailsService, ChannelService, FrameworkService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingUserPreferenceComponent);
    component = fixture.componentInstance;
    spyOn(document, 'getElementById').and.callFake((id) => {
      if (id === 'defaultTenant') {
        return { value: 'ntp' };
      }
    });
    fixture.detectChanges();
  });

  it('should get tenant data', () => {
    spyOn(component.tenantService, 'tenantData$').and.returnValue(observableOf(onboarding_user_preference_test.tenantInfo));
    component.ngOnInit();
    expect(component.tenantInfo).toBeDefined();
  });

  it('should call readChannel and get board option', () => {
    spyOn(component.channelService, 'getFrameWork').and.returnValue(observableOf(onboarding_user_preference_test.readChannel));
    component.readChannel('01285019302823526477');
    expect(component.boardOption).toBeDefined();
  });

  it('should call readChannel and get error', () => {
    spyOn(component.channelService, 'getFrameWork').and.returnValue(throwError(onboarding_user_preference_test.readChannel_error));
    spyOn(component.toasterService, 'error').and.returnValue(throwError(resourceBundle.messages.emsg.m0005));
    component.readChannel('01285019302823526477');
    expect(component.toasterService.error).toHaveBeenCalled();
  });

  it('should call onBoardChange and get framework api success', () => {
    spyOn(component.onboardingService, 'getAssociationData');
    spyOn(component.frameworkService, 'getFrameworkCategories').and.returnValue(observableOf(onboarding_user_preference_test.framework));
    component.onBoardChange(onboarding_user_preference_test.options.board);
    expect(component.onboardingService.getAssociationData).toHaveBeenCalled();
    expect(component.showMedium).toBeTruthy();
    expect(component.showClass).toBeFalsy();
    expect(component.disableContinueBtn).toBeTruthy();
  });

  it('should call onBoardChange and get framework api error', () => {
    spyOn(component.onboardingService, 'getAssociationData');
    spyOn(component.toasterService, 'error').and.returnValue(throwError(resourceBundle.messages.emsg.m0005));
    spyOn(component.frameworkService, 'getFrameworkCategories')
    .and.returnValue(throwError(onboarding_user_preference_test.framework_error));
    component.onBoardChange(onboarding_user_preference_test.options.board);
    expect(component.showMedium).toBeFalsy();
    expect(component.showClass).toBeFalsy();
    expect(component.disableContinueBtn).toBeTruthy();
    expect(component.toasterService.error).toHaveBeenCalled();
  });

  it('should call onMediumChange when class is empty', () => {
    component.selectedClass = '';
    component.onMediumChange(onboarding_user_preference_test.options.medium);
    expect(component.showMedium).toBeFalsy();
    expect(component.showClass).toBeTruthy();
    expect(component.disableContinueBtn).toBeTruthy();
  });

  it('should call onMediumChange when class is not empty', () => {
    component.selectedClass = onboarding_user_preference_test.options.class;
    component.onMediumChange(onboarding_user_preference_test.options.medium);
    expect(component.showMedium).toBeFalsy();
    expect(component.showClass).toBeTruthy();
    expect(component.disableContinueBtn).toBeTruthy();
  });

  it('should call onClassChange when medium is empty', () => {
    component.selectedMedium = '';
    component.onClassChange(onboarding_user_preference_test.options.class);
    expect(component.disableContinueBtn).toBeTruthy();
  });

  it('should call onClassChange when medium is not empty', () => {
    component.selectedMedium = onboarding_user_preference_test.options.medium;
    component.onClassChange(onboarding_user_preference_test.options.class);
    expect(component.disableContinueBtn).toBeFalsy();
  });

  it('should call saveUserData and get success', () => {
    spyOn(component.onboardingService, 'saveUserPreference').and.returnValue(observableOf(onboarding_user_preference_test.user_save));
    spyOn(component, 'getUserData');
    component.saveUserData();
    expect(component.getUserData).toHaveBeenCalled();
  });

  it('should call saveUserData and get error', () => {
    spyOn(component.onboardingService, 'saveUserPreference').and.returnValue(throwError(onboarding_user_preference_test.user_error));
    spyOn(component.toasterService, 'error').and.returnValue(throwError(resourceBundle.messages.emsg.m0022));
    component.saveUserData();
    expect(component.toasterService.error).toHaveBeenCalled();
  });

  it('should call getUserData, get success and emit event', () => {
    spyOn(component.onboardingService, 'getUser').and.returnValue(observableOf(onboarding_user_preference_test.get_user));
    spyOn(component.userPreferenceSaved, 'emit');
    component.getUserData();
    expect(component.userPreferenceSaved.emit).toHaveBeenCalledWith('SUCCESS');
  });

  it('should call getUserData, get error and emit event', () => {
    spyOn(component.onboardingService, 'getUser').and.returnValue(throwError(onboarding_user_preference_test.get_user_error));
    spyOn(component.userPreferenceSaved, 'emit');
    component.getUserData();
    expect(component.userPreferenceSaved.emit).toHaveBeenCalledWith('SUCCESS');
  });
});
