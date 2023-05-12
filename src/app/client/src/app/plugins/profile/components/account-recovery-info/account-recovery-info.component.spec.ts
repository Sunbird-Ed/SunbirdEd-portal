import { AccountRecoveryInfoComponent } from './account-recovery-info.component';
import { ResourceService } from '@sunbird/shared';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../services';
import { of as observableOf, of, throwError } from 'rxjs';
import { OtpService, UserService } from '../../../../modules/core';
import { ConfigService, ToasterService } from '../../../../modules/shared';
import { MatDialog } from '@angular/material/dialog';

describe('AccountRecoveryInfoComponent', () => {
  let component: AccountRecoveryInfoComponent;

  const resourceService: Partial<ResourceService> = {
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
  const profileService: Partial<ProfileService> = {
    updateProfile: jest.fn()
  };
  const userService: Partial<UserService> = {};
  const matDialog: Partial<MatDialog> = {
    getDialogById: jest.fn()
  };
  const toasterService: Partial<ToasterService> = {
    success: jest.fn(),
    error: jest.fn()
  };
  const otpService: Partial<OtpService> = {
    generateOTP: jest.fn().mockImplementation(() => of(true))
  };
  const configService: Partial<ConfigService> = {
    appConfig: {
      OTPTemplate: {
        updateContactTemplate: 'updateContactTemplate'
      }
    },
  };

  beforeEach(() => {
    component = new AccountRecoveryInfoComponent(
      resourceService as ResourceService,
      profileService as ProfileService,
      userService as UserService,
      matDialog as MatDialog,
      toasterService as ToasterService,
      otpService as OtpService,
      configService as ConfigService,
    )
    component.userProfile = {
      email: 'emailid',
      phone: '5253252321'
    };
    component.otpData = {};
    component.showOTPForm = true;
  });

  it('should select email id radio button by default and call initialize initializeFormFields() ', () => {
    jest.spyOn(component, 'validateAndEditContact');
    component.showOTPForm = false;
    component.ngOnInit();
    expect(component.contactType).toBe('emailId');
    expect(component.validateAndEditContact).toHaveBeenCalled();
  });

  it('should select recovery email id radio button and call initialize initializeFormFields() ', () => {
    jest.spyOn(component, 'validateAndEditContact');
    component.userProfile = {
      recoveryEmail: 'emailid',
    };
    component.showOTPForm = false;
    component.ngOnInit();
    expect(component.contactType).toBe('emailId');
    expect(component.validateAndEditContact).toHaveBeenCalled();
  });

  it('should select recovery phone radio button and call initialize initializeFormFields() ', () => {
    jest.spyOn(component, 'validateAndEditContact');
    component.userProfile = {
      recoveryPhone: 567127788,
    };
    component.showOTPForm = false;
    component.ngOnInit();
    expect(component.contactType).toBe('emailId');
    expect(component.validateAndEditContact).toHaveBeenCalled();
  });

  it('should select email id radio button by default and call initialize initializeFormFields() ', () => {
    component.accountRecoveryForm = new FormGroup({
      email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
    });
    component.userVerificationSuccess();
    expect(component.showOTPForm).toEqual(false);
  });

  it('initializeFormFields if emailId radio is selected', () => {
    component.contactType = 'emailId';
    jest.spyOn(component, 'handleSubmitButton');
    jest.spyOn(component, 'setTelemetryData');
    component.initializeFormFields();
    expect(component.handleSubmitButton).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('initializeFormFields if phone no. radio is selected', () => {
    component.contactType = 'phoneNo';
    jest.spyOn(component, 'handleSubmitButton');
    jest.spyOn(component, 'setTelemetryData');
    component.initializeFormFields();
    expect(component.handleSubmitButton).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should shoudl call initializeFormFields() whenever different radio button is selected', () => {
    component.accountRecoveryForm = new FormGroup({
      email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
    });
    jest.spyOn(component, 'initializeFormFields');
    component.onItemChange();
    expect(component.initializeFormFields).toHaveBeenCalled();
  });

  it('should add/update phone no. for account recovery identifier', () => {
    component.enableSubmitButton = false;
    component.contactType = 'phoneNo';
    jest.spyOn(component, 'closeModal');
    jest.spyOn(profileService, 'updateProfile').mockReturnValue(observableOf({}) as any);
    component.onItemChange();
    component.updateRecoveryId();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should throw error while adding/updating phone no for recovery identifier', () => {
    component.enableSubmitButton = false;
    component.contactType = 'phoneNo';
    jest.spyOn(component, 'closeModal');
    jest.spyOn(profileService, 'updateProfile').mockReturnValue(throwError({ error: { params: { err: 'RECOVERY_PARAM_MATCH_EXCEPTION' } } }) as any);
    component.onItemChange();
    component.updateRecoveryId();
    expect(component.closeModal).not.toHaveBeenCalled();
  });

  it('should throw error while adding/updating phone no for recovery identifier error', () => {
    component.enableSubmitButton = false;
    component.contactType = 'phoneNo';
    jest.spyOn(component, 'closeModal');
    jest.spyOn(profileService, 'updateProfile').mockReturnValue(throwError({ error: {} }) as any);
    component.onItemChange();
    component.updateRecoveryId();
  });

  it('should add/update email id for account recovery identifier', () => {
    component.enableSubmitButton = false;
    component.contactType = 'emailId';
    jest.spyOn(component, 'closeModal');
    jest.spyOn(profileService, 'updateProfile').mockReturnValue(observableOf({}) as any);
    component.onItemChange();
    component.updateRecoveryId();
    expect(component.closeModal).toHaveBeenCalled();
  });
  it('should show appropriate message when fails to generate OTP', () => {
    component.accountRecoveryForm = new FormGroup({
      email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      uniqueContact: new FormControl(true, [Validators.required])
    });
    component.contactType = 'email';
    jest.spyOn(otpService, 'generateOTP').mockReturnValue(throwError({ error: { params: { status: 'EMAIL_IN_USE', errmsg: 'error' } } }));
    component.validateAndEditContact();
    expect(otpService.generateOTP).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });

  it('should show appropriate error message when fails to generate OTP', () => {
    component.accountRecoveryForm = new FormGroup({
      email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      uniqueContact: new FormControl(true, [Validators.required])
    });
    component.contactType = 'email';
    jest.spyOn(otpService, 'generateOTP').mockReturnValue(throwError({ error: { params: { status: 'error', errmsg: 'error' } } }));
    component.validateAndEditContact();
    expect(otpService.generateOTP).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });


  it('should unsubscribe from all observable subscriptions', () => {
    component.contactType = 'phone';
    component.accountRecoveryForm = new FormGroup({
      email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
    });
    component.dialogProps = { id: "asd" };
    jest.spyOn(component, 'closeMatDialog');
    component.initializeFormFields();
    component.ngOnDestroy();
    expect(component.closeMatDialog).toHaveBeenCalled();
  });
});