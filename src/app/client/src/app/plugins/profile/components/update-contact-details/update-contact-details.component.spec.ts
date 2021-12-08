import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreModule, OtpService } from '@sunbird/core';
import { ProfileService } from '@sunbird/profile';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { SuiModalModule } from 'ng2-semantic-ui-v9';
import { of, throwError } from 'rxjs';
import { UpdateContactDetailsComponent } from './update-contact-details.component';

describe('UpdateContactDetailsComponent', () => {
  let component: UpdateContactDetailsComponent;
  let fixture: ComponentFixture<UpdateContactDetailsComponent>;

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
        HttpClientTestingModule, SuiModalModule, TelemetryModule.forRoot()],
      declarations: [UpdateContactDetailsComponent],
      providers: [
        ProfileService,
        { provide: ResourceService, useValue: resourceBundle },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactDetailsComponent);
    component = fixture.componentInstance;
    component.userProfile = {
      email: 'emailid',
      phone: '5253252321'
    };
  });

  it('should call generateOTP()', () => {
    component.contactType = 'phone';
    spyOn(component, 'generateOTP');
    // spyOn(component, 'onContactValueChange');
    // spyOn(component, 'enableSubmitButton');
    component.ngOnInit();
    expect(component.generateOTP).toHaveBeenCalled();
    // expect(component.contactTypeForm.valid).toBeFalsy();
    // expect(component.onContactValueChange).toHaveBeenCalled();
    // expect(component.enableSubmitButton).toHaveBeenCalled();
    // expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should show validation error message for form', () => {
    component.contactType = 'phone';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.initializeFormFields();
    expect(component.contactTypeForm.valid).toBeFalsy();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should show validation error message for email', () => {
    component.contactType = 'email';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.initializeFormFields();
    let errors = {};
    const email = component.contactTypeForm.controls['email'];
    email.setValue('');
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should show validation error message for phone', () => {
    component.contactType = 'phone';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.initializeFormFields();
    let errors = {};
    const phone = component.contactTypeForm.controls['phone'];
    phone.setValue('');
    errors = phone.errors || {};
    expect(errors['required']).toBeTruthy();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should show pattern match error message for phone', () => {
    component.contactType = 'phone';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.initializeFormFields();
    let errors = {};
    const phone = component.contactTypeForm.controls['phone'];
    phone.setValue('8989');
    errors = phone.errors || {};
    expect(errors['pattern']).toBeTruthy();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitButton).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
  });
  it('should call onContactValueChange method', () => {
    component.contactType = 'email';
    spyOn(component, 'onContactValueChange');
    spyOn(component, 'enableSubmitButton');
    component.initializeFormFields();
    expect(component.onContactValueChange).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBeFalsy();
    expect(component.enableSubmitButton).toHaveBeenCalled();
  });
  it('set values with enabling the submit button ', () => {
    component.contactType = 'email';
    component.initializeFormFields();
    const email = component.contactTypeForm.controls['email'];
    email.setValue('abc@gmail.com');
    const uniqueContact = component.contactTypeForm.controls['uniqueContact'];
    uniqueContact.setValue(true);
    expect(component.enableSubmitBtn).toBeTruthy();
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.contactType = 'phone';
    component.initializeFormFields();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });

  it('should call closeModal', () => {
    // component.contactTypeModal = { deny: jasmine.createSpy('deny') };
    spyOn(component.close, 'emit');
    component.closeModal();
    // expect(component.contactTypeModal.deny).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should call showParentForm', () => {
    spyOn(component, 'initializeFormFields');
    component.showParentForm('true');
    expect(component.initializeFormFields).toHaveBeenCalled();
    expect(component.showForm).toBe(true);
  });

  it('should call onSubmitForm', () => {
    component.contactTypeForm = new FormGroup({
      email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      uniqueContact: new FormControl(true, [Validators.required])
    });
    spyOn(component, 'generateOTP');
    component.onSubmitForm();
    expect(component.enableSubmitBtn).toBe(false);
    expect(component.generateOTP).toHaveBeenCalled();
  });

  it('should call updateProfile for contact type phone', () => {
    const profileService = TestBed.get(ProfileService);
    const toastService = TestBed.get(ToasterService);
    component.verifiedUser = true;
    spyOn(component, 'closeModal');
    spyOn(profileService, 'updateProfile').and.returnValue(of({}));
    spyOn(toastService, 'success');
    component.contactType = 'phone';
    component.updateProfile({});
    expect(component.closeModal).toHaveBeenCalled();
    expect(profileService.updateProfile).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalledWith('Your Mobile Number has been updated');
  });

  it('should call updateProfile for contact type email', () => {
    const profileService = TestBed.get(ProfileService);
    const toastService = TestBed.get(ToasterService);
    component.verifiedUser = true;
    spyOn(component, 'closeModal');
    spyOn(profileService, 'updateProfile').and.returnValue(of({}));
    spyOn(toastService, 'success');
    component.contactType = 'email';
    component.updateProfile({});
    expect(component.closeModal).toHaveBeenCalled();
    expect(profileService.updateProfile).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalledWith('Your email address has been updated');
  });


  it('should close the modal and show appropriate message on update fail for type phone', () => {
    const profileService = TestBed.get(ProfileService);
    const toastService = TestBed.get(ToasterService);
    component.verifiedUser = true;
    spyOn(component, 'closeModal');
    spyOn(profileService, 'updateProfile').and.returnValue(throwError({}));
    spyOn(toastService, 'error');
    component.contactType = 'phone';
    component.updateProfile({});
    expect(component.closeModal).toHaveBeenCalled();
    expect(profileService.updateProfile).toHaveBeenCalled();
    expect(toastService.error).toHaveBeenCalledWith('Could not update mobile number');
  });

  it('should close the modal and show appropriate message on update fail for type email', () => {
    const profileService = TestBed.get(ProfileService);
    const toastService = TestBed.get(ToasterService);
    component.verifiedUser = true;
    spyOn(component, 'closeModal');
    spyOn(profileService, 'updateProfile').and.returnValue(throwError({}));
    spyOn(toastService, 'error');
    component.contactType = 'email';
    component.updateProfile({});
    expect(component.closeModal).toHaveBeenCalled();
    expect(profileService.updateProfile).toHaveBeenCalled();
    expect(toastService.error).toHaveBeenCalledWith('Could not update email address');
  });

  it('should call generateOTP', () => {
    component.contactTypeForm = new FormGroup({
      email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      uniqueContact: new FormControl(true, [Validators.required])
    });
    component.contactType = 'email';
    const otpService = TestBed.get(OtpService);
    spyOn(otpService, 'generateOTP').and.returnValue(of({}));
    spyOn(component, 'prepareOtpData');
    component.generateOTP();
    expect(otpService.generateOTP).toHaveBeenCalled();
    expect(component.prepareOtpData).toHaveBeenCalled();
    expect(component.showForm).toBe(false);
  });

  it('should show appropriate message when fails to generate OTP', () => {
    component.contactTypeForm = new FormGroup({
      email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
      uniqueContact: new FormControl(true, [Validators.required])
    });
    component.contactType = 'email';
    const otpService = TestBed.get(OtpService);
    const toasterService =  TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    spyOn(otpService, 'generateOTP').and.returnValue(throwError({ error: { params: { status: 'EMAIL_IN_USE', errmsg: 'error' } } }));
    component.generateOTP();
    expect(otpService.generateOTP).toHaveBeenCalled();
    expect(component.enableSubmitBtn).toBe(true);
    expect(toasterService.error).toHaveBeenCalledWith('error');
  });
});
