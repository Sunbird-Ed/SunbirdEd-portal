
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { _ } from 'lodash-es';
import { UserService,OtpService } from '@sunbird/core';
import { ResourceService,ToasterService,ConfigService,CacheService } from '@sunbird/shared';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AnonymousDeleteAccountComponent } from './anonymous-delete-account.component'
import { mockResponse } from './anonymous-delete-account.component.spec.data';
import { DeviceDetectorService } from 'ngx-device-detector';

describe('AnonymousDeleteAccountComponent', () => {
    let component: AnonymousDeleteAccountComponent;

    const resourceService :Partial<ResourceService> ={
        messages: {
            fmsg:{
                m0085:'There was a technical error. Try again.'
            },
            imsg: {
                m0092: 'Please accept all terms and conditions'
            }
        },
        frmelmnts:{
            lbl:{
                phoneOtpDeleteInfo: 'An OTP has been sent you your registered mobile number. Please enter the OTP to proceed with account deletion.',
                emailOtpDeleteInfo: 'An OTP has been sent you your registered email. Please enter the OTP to proceed with account deletion.',
                deleteConfirmMessage: 'Are you sure you want to delete your account ? This action is irreversible!',
                deleteNote: 'NOTE: Please Accept all terms and Conditions',
                deleteAccount: 'Delete Account',
                condition1: 'Personal Information: Your personal account information, including your profile and login details, will be permanently deleted, including your activity history. This information cannot be recovered',
                condition2: 'Certificates: For certificate verification purposes, only your name will be stored. Access Loss: You will lose access to all features and services associated with this account, and any subscriptions or memberships may be terminated.',
                condition3: 'Single Sign-On (SSO): If you use Single Sign-On (SSO) to sign in, be aware that a new account will be created the next time you sign in. This new account will not have any historical information.',
                condition4: 'Resource Retention: Even after your account is deleted, any contributions, content, or resources you have created within the portal will not be deleted. These will remain accessible to other users as part of the collective content.You will no longer have control or management rights over them.',
                condition5: 'Usage Reports: Usage reports will retain location data declared by you.',
                condition6: 'Make sure you have backed up any important data and have considered the consequences before confirming account deletion and downloaded your certificates.',
                verification: 'Verification',
                unableToDeleteAccount: 'Unable to delete the account',
                wrongPhoneOTP: 'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.'
            },
            instn: {
                t008: "You will receive an SMS with the OTP for Mobile Number verification",
                t0084: "You will receive an email with the OTP to verify your email address"
            }
        }
    };
	
	const otpService :Partial<OtpService> ={
        generateAnonymousOTP: jest.fn().mockReturnValue(of())
    };
	const toasterService :Partial<ToasterService> ={
        error:jest.fn()
    };
	const matDialog :Partial<MatDialog> ={
        getDialogById:jest.fn()
    };
	const configService :Partial<ConfigService> ={
        appConfig:{
            OTPTemplate:{
                userDeleteTemplate:'otpEmailDeleteUserTemplate'
            }
        }
    };
	const cacheService :Partial<CacheService> ={
        removeAll: jest.fn()
    };
    const mockDeviceDetectorService: Partial<DeviceDetectorService> = {
        isMobile: jest.fn(),
        isTablet: jest.fn()
    };

    beforeAll(() => {
        component = new AnonymousDeleteAccountComponent(
            resourceService as ResourceService,
			otpService as OtpService,
			toasterService as ToasterService,
			matDialog as MatDialog,
			configService as ConfigService,
			cacheService as CacheService,
            mockDeviceDetectorService as DeviceDetectorService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should call prepareOtpData for email', () => {
        component.otpData = null
        component.contactType = 'email'
        component.contactTypeForm = {
            controls: {
                email: {
                    value: 'abcd@test.com'
                },
                phone: {
                    value: 1234567890
                }
            }
        } as any;
        component.prepareOtpData();
    });

    it('should call prepareOtpData for phone', () => {
        component.otpData = null
        component.contactType = 'phone'
        component.contactTypeForm = {
            controls: {
                email: {
                    value: 'abcd@test.com'
                },
                phone: {
                    value: 1234567890
                }
            }
        } as any;
        component.prepareOtpData();
    });

    it('should create a instance of component and call the generateOTP method without req object', () => {
        jest.spyOn(component,'prepareOtpData');
        component.contactType='email'
        component.contactTypeForm = {
            controls:{
                email:{
                    value:'abcd@test.com'
                },
                phone:{
                    value: 1234567890
                }
            }
        } as any;
        const req =  null
        const otpData = {
            type: 'email',
            value: 'abcd@test.com',
            instructions: 'An OTP has been sent you your registered mobile number. Please enter the OTP to proceed with account deletion.',
            retryMessage: 'Unable to delete the account',
            wrongOtpMessage: 'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.'
          }
          otpService.generateAnonymousOTP=jest.fn().mockReturnValue(of(mockResponse.resendOtpSuccess));

          component.generateOTP(req, otpData);
          expect(component.prepareOtpData).toBeCalled();
    });

    it('should create a instance of component and call the generateOTP method without req object', () => {
        jest.spyOn(component,'prepareOtpData');
        component.contactType='phone'
        component.contactTypeForm = {
            controls:{
                email:{
                    value:'abcd@test.com'
                },
                phone:{
                    value: 1234567890
                }
            }
        } as any;
        const req =  null
        const otpData = {
            type: 'phone',
            value: '1234567890',
            instructions: 'An OTP has been sent you your registered mobile number. Please enter the OTP to proceed with account deletion.',
            retryMessage: 'Unable to delete the account',
            wrongOtpMessage: 'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.'
          }
          otpService.generateAnonymousOTP=jest.fn().mockReturnValue(of(mockResponse.resendOtpSuccess));
          component.generateOTP(req, otpData);
          expect(component.prepareOtpData).toBeCalled();
    });

    it('should create a instance of component and call the generateOTP method without req object with error', () => {
        jest.spyOn(component,'prepareOtpData');
        component.contactType='email'
        component.contactTypeForm = {
            controls:{
                email:{
                    value:'abcd@test.com'
                },
                phone:{
                    value: 1234567890
                }
            }
        } as any;
        const req =  null
        const otpData = {
            type: 'phone',
            value: '1234567890',
            instructions: 'An OTP has been sent you your registered mobile number. Please enter the OTP to proceed with account deletion.',
            retryMessage: 'Unable to delete the account',
            wrongOtpMessage: 'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.'
          }
          otpService.generateAnonymousOTP=jest.fn().mockReturnValue(throwError(mockResponse.resendOtpError));
          component.generateOTP(req, otpData);
          expect(component.prepareOtpData).toBeCalled();
    });

    it('should create a instance of component and call the generateOTP method without req object with error', () => {
        jest.spyOn(component,'prepareOtpData');
        component.contactType='email'
        component.contactTypeForm = {
            controls:{
                email:{
                    value:'abcd@test.com'
                },
                phone:{
                    value: 1234567890
                }
            }
        } as any;
        const req =  null
        const otpData = {
            type: 'email',
            value: 'abc@gmail',
            instructions: 'An OTP has been sent you your registered mobile number. Please enter the OTP to proceed with account deletion.',
            retryMessage: 'Unable to delete the account',
            wrongOtpMessage: 'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.'
          }
          otpService.generateAnonymousOTP=jest.fn().mockReturnValue(throwError(mockResponse.resendEmailOtpError));
          component.generateOTP(req, otpData);
          expect(component.prepareOtpData).toBeCalled();
    });

    it('should create a instance of component and call the generateOTP method without req object with error', () => {
        jest.spyOn(component,'prepareOtpData');
        component.contactType='email'
        component.contactTypeForm = {
            controls:{
                email:{
                    value:'abcd@test.com'
                },
                phone:{
                    value: 1234567890
                }
            }
        } as any;
        const req =  null
        const otpData = {
            type: 'phone',
            value: '1234567890',
            instructions: 'An OTP has been sent you your registered mobile number. Please enter the OTP to proceed with account deletion.',
            retryMessage: 'Unable to delete the account',
            wrongOtpMessage: 'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.'
          }
          otpService.generateAnonymousOTP=jest.fn().mockReturnValue(throwError((mockResponse.resendOtpError)));
          component.generateOTP(req, otpData);
          expect(component.prepareOtpData).toBeCalled();
    });

    it('should create a instance of component and call the validateAndEditContact method', () => {
        jest.spyOn(component,'generateOTP');
        component.contactType='email';
        component.userId='sample'
        otpService.generateAnonymousOTP=jest.fn().mockReturnValue(of(mockResponse.resendOtpSuccess));
        component['validateAndEditContact']();
        expect(component.generateOTP).toBeCalled();
    });
    it('should create a instance of component and call the validateAndEditContact method for phone', () => {
        jest.spyOn(component,'generateOTP');
        component.contactType='recoveryPhone';
        component.userId='sample'
        otpService.generateAnonymousOTP=jest.fn().mockReturnValue(of(mockResponse.resendOtpSuccess));
        component['validateAndEditContact']();
        expect(component.generateOTP).toBeCalled();
    });
    it('should create a instance of component and call the validateAndEditContact method for recovery phone', () => {
        jest.spyOn(component,'generateOTP');
        component.contactType='phone';
        component.userId='sample'
        otpService.generateAnonymousOTP=jest.fn().mockReturnValue(of(mockResponse.resendOtpSuccess));
        component['validateAndEditContact']();
        expect(component.generateOTP).toBeCalled();
    });
    it('should create a instance of component and call the ngOnInit method', () => {
        component['validateAndEditContact']=jest.fn();
        component.ngOnInit();
        expect(component).toBeTruthy();
        expect(component['validateAndEditContact']).toBeCalled();
    });
    it('should create a instance of component and call the closeModal method', () => {
        component.dialogProps = { id: 'dialog-id' };
        const dialogRef = {
            close: jest.fn()
        };
        (matDialog.getDialogById as jest.Mock).mockReturnValue(dialogRef);
        component.closeMatDialog();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should create a instance of component and call the generateOTP method', () => {
        jest.spyOn(component,'prepareOtpData');
        const req =  {
            key: '1234567890',
            userId: '874ed8a5-782e-4f6c-8f36-e0288455901e',
            templateId: 'otpEmailDeleteUserTemplate',
            type: 'phone'
          }
        const otpData = {
            type: 'phone',
            value: '1234567890',
            instructions: 'An OTP has been sent you your registered mobile number. Please enter the OTP to proceed with account deletion.',
            retryMessage: 'Unable to delete the account',
            wrongOtpMessage: 'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.'
          }
          otpService.generateOTP=jest.fn().mockReturnValue(of(mockResponse.resendOtpSuccess));
          component.generateOTP(req, otpData);
    });

    it('should create a instance of component and call the verificationSuccess method', () => {
        //(global as any).window = Object.create(window);
        const url = 'http://localhost/';
        const data = {}
        component.verificationSuccess(data);
        expect(window.location.href).toEqual(url);
    });
    it('should create a instance of component and call the verificationSuccess method with mobile is true', () => {
        const url = 'http://localhost/';
        mockDeviceDetectorService.isMobile = jest.fn().mockReturnValue(true);
        component.deepLink='deepLink'
        const data = {}
        component.verificationSuccess(data);
        expect(window.location.href).toEqual(url);
    });
    it('should create a instance of component and call the setInteractEventData method', () => {
        component.setInteractEventData();
        expect(component.submitInteractEdata).toEqual({ id: 'delete-anonymous-account', type: 'click', pageid: 'delete-anonymous-account' });     });
    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component.unsubscribe = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.unsubscribe.next).toHaveBeenCalled();
            expect(component.unsubscribe.complete).toHaveBeenCalled();
        });
    });
});