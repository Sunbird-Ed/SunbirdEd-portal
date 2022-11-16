import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {  OtpService } from '@sunbird/core';
import { ProfileService } from '@sunbird/profile';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { of, throwError } from 'rxjs';
import { ConfigService } from '../../../../modules/shared';
import { UserService } from '../../../../modules/core';
import { UpdateContactDetailsComponent } from './update-contact-details.component';

describe('UpdateContactDetailsComponent', () => {
    let component: UpdateContactDetailsComponent;
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
    const userService: Partial<UserService> = {
        getIsUserExistsUserByKey: jest.fn().mockImplementation(() => of(true))
    };
    const otpService: Partial<OtpService> = {
        generateOTP: jest.fn().mockImplementation(() => of(true))
    };
    const toasterService: Partial<ToasterService> = {
        success: jest.fn(),
        error: jest.fn()

    };
    const profileService: Partial<ProfileService> = {
        updateProfile: jest.fn().mockImplementation(() => of({}))
    };
    const matDialog: Partial<MatDialog> = {};
    const configService: Partial<ConfigService> = {
        appConfig: {
            OTPTemplate: {
                updateContactTemplate: "otpContactUpdateTemplate"
            }
        },
    };

    beforeEach(() => {
        component = new UpdateContactDetailsComponent(
            resourceService as ResourceService,
            userService as UserService,
            otpService as OtpService,
            toasterService as ToasterService,
            profileService as ProfileService,
            matDialog as MatDialog,
            configService as ConfigService,
        )

        component.userProfile = {
            email: 'emailid',
            phone: '5253252321'
        };
    });

    it('should call ngOnInit()', () => {
        component.contactType = 'phone';
        jest.spyOn(component, 'generateOTP');
        component.ngOnInit();
        expect(component.generateOTP).toHaveBeenCalled();
    });

    it('should call generateOTP()', () => {
        component.contactType = 'phone';
        component.contactTypeForm = new FormGroup({
            phone: new FormControl('9000000000', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
            uniqueContact: new FormControl(true, [Validators.required])
        });
        component.generateOTP();
    });

    it('should call validateAndEditContact() for email', () => {
        component.userProfile = {
            email: 'emailid',
        };
        jest.spyOn(component, 'generateOTP');
        component.ngOnInit();
        expect(component.generateOTP).toHaveBeenCalled();
    });

    it('should call validateAndEditContact() for recoveryEmail', () => {
        component.userProfile = {
            recoveryEmail: 'emailid',
        };
        jest.spyOn(component, 'generateOTP');
        component.ngOnInit();
        expect(component.generateOTP).toHaveBeenCalled();
    });

    it('should call validateAndEditContact() for recoveryPhone', () => {
        component.userProfile = {
            recoveryPhone: '9456789532'
        };
        jest.spyOn(component, 'generateOTP');
        component.ngOnInit();
        expect(component.generateOTP).toHaveBeenCalled();
    });
    it('should show validation error message for form', () => {
        component.contactType = 'phone';
        jest.spyOn(component, 'onContactValueChange');
        jest.spyOn(component, 'enableSubmitButton');
        component.initializeFormFields();
        expect(component.contactTypeForm.valid).toBeFalsy();
        expect(component.onContactValueChange).toHaveBeenCalled();
        expect(component.enableSubmitButton).toHaveBeenCalled();
        expect(component.enableSubmitBtn).toBeFalsy();
    });

    it('should call vaidateUserContact()', () => {
        component.contactType = 'phone';
        component.contactTypeForm = new FormGroup({
            phone: new FormControl('9000000000', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
            uniqueContact: new FormControl(true, [Validators.required])
        });
        component.vaidateUserContact();
    });

    it('should throw error for vaidateUserContact()', () => {
        component.contactType = 'phone';
        component.contactTypeForm = new FormGroup({
            phone: new FormControl('9000000000', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
            uniqueContact: new FormControl(true, [Validators.required])
        });
        jest.spyOn(userService, 'getIsUserExistsUserByKey').mockReturnValue(throwError({
            error: {
                params: {
                    status: 'USER_ACCOUNT_BLOCKED'
                }
            }
        }));
        component.vaidateUserContact();
    });

    it('should throw error for vaidateUserContact() without status', () => {
        component.contactType = 'phone';
        component.contactTypeForm = new FormGroup({
            phone: new FormControl('9000000000', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
            uniqueContact: new FormControl(true, [Validators.required])
        });
        jest.spyOn(userService, 'getIsUserExistsUserByKey').mockReturnValue(throwError({}));
        component.vaidateUserContact();
    });

    it('should show validation error message for email', () => {
        component.contactType = 'email';
        jest.spyOn(component, 'onContactValueChange');
        jest.spyOn(component, 'enableSubmitButton');
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
        jest.spyOn(component, 'onContactValueChange');
        jest.spyOn(component, 'enableSubmitButton');
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
        jest.spyOn(component, 'onContactValueChange');
        jest.spyOn(component, 'enableSubmitButton');
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
        jest.spyOn(component, 'onContactValueChange');
        jest.spyOn(component, 'enableSubmitButton');
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
        jest.spyOn(component.unsubscribe, 'complete');
        component.ngOnDestroy();
        expect(component.unsubscribe.complete).toHaveBeenCalled();
    });

    it('should call closeModal', () => {
        jest.spyOn(component.close, 'emit');
        component.closeModal();
        expect(component.close.emit).toHaveBeenCalled();
    });

    it('should call showParentForm', () => {
        component.contactTypeForm = new FormGroup({
            email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
            uniqueContact: new FormControl(true, [Validators.required])
        });
        jest.spyOn(component, 'initializeFormFields');
        component.showParentForm('true');
        expect(component.showForm).toBe(true);
    });

    it('should call onSubmitForm', () => {
        component.contactTypeForm = new FormGroup({
            email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
            uniqueContact: new FormControl(true, [Validators.required])
        });
        component.contactType = 'email';
        jest.spyOn(component, 'generateOTP');
        component.onSubmitForm();
        expect(component.enableSubmitBtn).toBe(false);
        expect(component.generateOTP).toHaveBeenCalled();
    });

    it('should call updateProfile for contact type phone', () => {
        component.verifiedUser = true;
        jest.spyOn(component, 'closeModal');
        component.contactType = 'phone';
        component.updateProfile({});
        expect(component.closeModal).toHaveBeenCalled();
        expect(profileService.updateProfile).toHaveBeenCalled();
        expect(toasterService.success).toHaveBeenCalledWith('Your Mobile Number has been updated');
    });

    it('should call updateProfile for contact type phone and unverified user', () => {
        component.verifiedUser = false;
        component.contactType = 'phone';
        component.updateProfile({});
        expect(component.verifiedUser).toBe(true);
        expect(component.showForm).toBe(true);
    });

    it('should call updateProfile for contact type email', () => {
        component.verifiedUser = true;
        jest.spyOn(component, 'closeModal');
        component.contactType = 'email';
        component.updateProfile({});
        expect(component.closeModal).toHaveBeenCalled();
        expect(profileService.updateProfile).toHaveBeenCalled();
        expect(toasterService.success).toHaveBeenCalledWith('Your email address has been updated');
    });


    it('should close the modal and show appropriate message on update fail for type phone', () => {
        component.verifiedUser = true;
        jest.spyOn(component, 'closeModal');
        jest.spyOn(profileService, 'updateProfile').mockReturnValue(throwError({}));
        component.contactType = 'phone';
        component.updateProfile({});
        expect(component.closeModal).toHaveBeenCalled();
        expect(profileService.updateProfile).toHaveBeenCalled();
        expect(toasterService.error).toHaveBeenCalledWith('Could not update mobile number');
    });

    it('should close the modal and show appropriate message on update fail for type email', () => {
        component.verifiedUser = true;
        jest.spyOn(component, 'closeModal');
        jest.spyOn(profileService, 'updateProfile').mockReturnValue(throwError({}));
        component.contactType = 'email';
        component.updateProfile({});
        expect(component.closeModal).toHaveBeenCalled();
        expect(profileService.updateProfile).toHaveBeenCalled();
        expect(toasterService.error).toHaveBeenCalledWith('Could not update email address');
    });

    it('should call generateOTP', () => {
        component.contactTypeForm = new FormGroup({
            email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
            uniqueContact: new FormControl(true, [Validators.required])
        });
        component.contactType = 'email';
        jest.spyOn(component, 'prepareOtpData');
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
        jest.spyOn(otpService, 'generateOTP').mockReturnValue(throwError({ error: { params: { status: 'EMAIL_IN_USE', errmsg: 'error' } } }));
        component.generateOTP();
        expect(otpService.generateOTP).toHaveBeenCalled();
        expect(component.enableSubmitBtn).toBe(true);
        expect(toasterService.error).toHaveBeenCalledWith('error');
    });

    it('should show appropriate message when fails to generate OTP', () => {
        component.contactTypeForm = new FormGroup({
            email: new FormControl('test@demo.com', [Validators.required, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/)]),
            uniqueContact: new FormControl(true, [Validators.required])
        });
        component.contactType = 'email';
        jest.spyOn(otpService, 'generateOTP').mockReturnValue(throwError({ error: { params: { errmsg: 'error' } } }));
        component.generateOTP();
        expect(otpService.generateOTP).toHaveBeenCalled();
        expect(component.enableSubmitBtn).toBe(false);
        expect(toasterService.error).toHaveBeenCalledWith('error');
    });
});