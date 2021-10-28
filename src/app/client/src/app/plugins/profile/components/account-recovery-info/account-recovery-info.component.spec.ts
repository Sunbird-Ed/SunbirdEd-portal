import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountRecoveryInfoComponent } from './account-recovery-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './../../services';
import { configureTestSuite } from '@sunbird/test-util';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';




describe('AccountRecoveryInfoComponent', () => {
  let component: AccountRecoveryInfoComponent;
  let fixture: ComponentFixture<AccountRecoveryInfoComponent>;
  const resourceBundle = {
    'messages': {
      'smsg': {
        'm0047': 'Your Mobile Number has been updated',
        'm0048': 'Your email address has been updated'
      },
      'emsg': {
        'm0014': 'Could not update mobile number',
        'm0015': 'Could not update email address'
      }
    },
    'frmelmnts': {
      'lbl': {
        unableToUpdateMobile: 'unableToUpdateMobile',
        unableToUpdateEmail: 'unableToUpdateEmail',
        wrongPhoneOTP: 'wrongPhoneOTP',
        wrongEmailOTP: 'wrongEmailOTP'

      },
      instn: {
          't0083': 'Could not update email address',
          't0084': 'Could not update email address',
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, SuiModule, TelemetryModule.forRoot() , RouterTestingModule],
      declarations: [AccountRecoveryInfoComponent],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        ProfileService
    ],
    schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRecoveryInfoComponent);
    component = fixture.componentInstance;
    component.userProfile = {
      email: 'emailid',
      phone: '5253252321'
    };
    component.otpData = {};
    component.showOTPForm = true;
    fixture.detectChanges();
  });

  it('should select email id radio button by default and call initialize initializeFormFields() ', () => {
    spyOn(component, 'validateAndEditContact').and.callThrough();
    component.showOTPForm = false;
    component.ngOnInit();
    expect(component.contactType).toBe('emailId');
    expect(component.validateAndEditContact).toHaveBeenCalled();
  });

  it('should select email id radio button by default and call initialize initializeFormFields() ', () => {
    component.userVerificationSuccess();
    expect(component.showOTPForm).toEqual(false);
  });

  it('initializeFormFields if emailId radio is selected', () => {
    component.contactType = 'emailId';
    spyOn(component, 'handleSubmitButton').and.callThrough();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.initializeFormFields();
    expect(component.handleSubmitButton).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('initializeFormFields if phone no. radio is selected', () => {
    component.contactType = 'phoneNo';
    spyOn(component, 'handleSubmitButton').and.callThrough();
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.initializeFormFields();
    expect(component.handleSubmitButton).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should shoudl call initializeFormFields() whenever different radio button is selected', () => {
    spyOn(component, 'initializeFormFields').and.callThrough();
    component.onItemChange();
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('should add/update phone no. for account recovery identifier', () => {
    component.enableSubmitButton = false;
    component.contactType = 'phoneNo';
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(profileService, 'updateProfile').and.returnValue(observableOf({}));
    component.onItemChange();
    component.updateRecoveryId();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should add/update email id for account recovery identifier', () => {
    component.enableSubmitButton = false;
    component.contactType = 'emailId';
    const profileService = TestBed.get(ProfileService);
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(profileService, 'updateProfile').and.returnValue(observableOf({}));
    component.onItemChange();
    component.updateRecoveryId();
    expect(component.closeModal).toHaveBeenCalled();
  });
});
