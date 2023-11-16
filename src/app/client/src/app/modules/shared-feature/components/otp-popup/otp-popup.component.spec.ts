import { ResourceService,UtilService,ConfigService,ToasterService, NavigationHelperService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import {  of, throwError } from 'rxjs';
import { TenantService,OtpService,UserService } from '@sunbird/core';
import { testData } from './otp-popup.component.spec.data';
import { OtpPopupComponent } from './otp-popup.component';

describe('OtpPopupComponent', () => {
    let component: OtpPopupComponent;

    const resourceService :Partial<ResourceService> ={
        messages:{
            emsg:{
                m0050:'Failed to validate OTP. Try again later.'
            }
        },
        frmelmnts: {
            lbl: {
                Select: 'Select',
                wrongEmailOTP:'You have entered an incorrect OTP. Enter the OTP received on your Email ID. The OTP is valid only for 30 minutes.',
                wrongPhoneOTP:'You have entered an incorrect OTP. Enter the OTP received on your mobile number. The OTP is valid only for 30 minutes.',
                OTPresendMaxretryreached:'Maximum retry limit exceeded'
            },
            cert: {
                lbl: {
                    preview: 'preview',
                    certAddSuccess: 'Certificate added successfully',
                    certUpdateSuccess: 'Certificate updated successfully.',
                    certAddError: 'Failed to add the certificate. Try again later.',
                    certEditError: 'Failed to edit the certificate. Try again later.'
                }
            }
        }
    };
	const tenantService :Partial<TenantService> ={
        tenantData$: of({
            err:false,
            tenantData:{
              logo:'logo',
              titleName:'merge'
            }
          }) as any
    };
	const deviceDetectorService :Partial<DeviceDetectorService> ={};
	const otpService :Partial<OtpService> ={
        generateOTP: jest.fn().mockImplementation(() => of(true)),
        verifyOTP: jest.fn().mockReturnValue(of(testData.verifyOtpSuccess) as any)
    };
	const userService :Partial<UserService> ={};
	const utilService :Partial<UtilService> ={
        redirectToLogin:jest.fn()
    };
	const configService :Partial<ConfigService> ={};
	const toasterService :Partial<ToasterService> ={
        error: jest.fn(),
        success: jest.fn()
    };
  const navigationHelperService: Partial<NavigationHelperService> ={
    navigateToLastUrl:jest.fn()
  }

    beforeAll(() => {
        component = new OtpPopupComponent(
            resourceService as ResourceService,
			tenantService as TenantService,
			deviceDetectorService as DeviceDetectorService,
			otpService as OtpService,
			userService as UserService,
			utilService as UtilService,
			configService as ConfigService,
			toasterService as ToasterService,
      navigationHelperService as NavigationHelperService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should show validation error message for form', () => {
        jest.spyOn(component, 'enableSubmitButton');
        component.ngOnInit();
        expect(component.otpForm.valid).toBeFalsy();
        expect(component.enableSubmitButton).toHaveBeenCalled();
        expect(component.enableSubmitBtn).toBeFalsy();
      });
      it('should unsubscribe from all observable subscriptions', () => {
        jest.spyOn(component.unsubscribe, 'complete');
        component.ngOnDestroy();
        expect(component.unsubscribe.complete).toHaveBeenCalled();
      });
      xit('set values with enabling the submit button', () => {
        component.enableSubmitBtn = true;
        component.ngOnInit();
        const email = component.otpForm.controls['otp'];
        email.setValue('784758');
        expect(component.enableSubmitBtn).toBeTruthy();
      });
    
      it('call verifyOTP and get success', () => {
        component.otpData = { 'wrongOtpMessage': 'test' };
        component.ngOnInit();
        otpService.verifyOTP=jest.fn().mockReturnValue(of(testData.verifyOtpSuccess));
        component.verifyOTP();
        expect(component.infoMessage).toEqual('');
        expect(component.errorMessage).toEqual('');
      });
      it('call verifyOTP and get success', () => {
        component.otpData = { 'wrongOtpMessage': 'test', 'type':'phone' };
        component.ngOnInit();
        otpService.verifyOTP=jest.fn().mockReturnValue(of(testData.verifyOtpSuccess));
        component.verifyOTP();
        expect(component.infoMessage).toEqual('');
        expect(component.errorMessage).toEqual('');
      });
      it('call verifyOTP and get success', () => {
        component.otpData = { 'wrongOtpMessage': 'test', 'type':'email' };
        component.ngOnInit();
        otpService.verifyOTP=jest.fn().mockReturnValue(of(testData.verifyOtpSuccess));
        component.verifyOTP();
        expect(component.infoMessage).toEqual('');
        expect(component.errorMessage).toEqual('');
      });
      it('call verifyOTP and get error', () => {
        component.otpData = { 'wrongOtpMessage': 'test' };
        component.ngOnInit();
        otpService.verifyOTP=jest.fn().mockReturnValue(throwError(testData.verifyOtpError));
        component.verifyOTP();
        expect(component.enableSubmitBtn).toBeTruthy();
      });
      it('call verifyOTP and get error', () => {
        component.otpData = {'wrongOtpMessage': 'test'};
        component.ngOnInit();
        jest.spyOn(component.closeContactForm, 'emit');
        otpService.verifyOTP=jest.fn().mockReturnValue(throwError(testData.noAttemptLeft));
        component.verifyOTP();
        expect(toasterService.error).toBeCalledWith(resourceService.messages.emsg.m0050);
        expect(component.closeContactForm.emit).toHaveBeenCalledWith('true');
      });
      it('call verifyOTP and get error', () => {
        component.otpData = {'wrongOtpMessage': 'test'};
        component.ngOnInit();
        component.redirectToLogin =true;
        jest.spyOn(component.utilService, 'redirectToLogin');
        otpService.verifyOTP=jest.fn().mockReturnValue(throwError(testData.noAttemptLeft));
        component.verifyOTP();
        expect(component.utilService.redirectToLogin).toBeCalledWith(resourceService.messages.emsg.m0050);
      });
      describe('error workflow',() =>{
        it('call resendOTP and get error', () => {
            component.otpData = { 'type': 'email', 'value': 'abc@gmail.com' };
            component.ngOnInit();
            resourceService.messages = testData.resourceBundle.messages;
            otpService.generateOTP=jest.fn().mockReturnValue(throwError(testData.resendOtpError));
            component.resendOTP();
            expect(component.infoMessage).toEqual('');
          });
      })
      it('call resendOTP and get success', () => {
        component.otpData = { 'type': 'email', 'value': 'abc@gmail.com' };
        component.ngOnInit();
        resourceService.frmelmnts = testData.resourceBundle.frmelmnts;
        otpService.generateOTP=jest.fn().mockReturnValue(of(testData.resendOtpSuccess));
        component.resendOTP();
        expect(component.errorMessage).toEqual('');
      });
      it('call resendOTP and get success', () => {
        component.otpData = { 'type': 'email', 'value': 'abc@gmail.com' };
        component.ngOnInit();
        component.resendOtpCounter = 3
        component.maxResendTry = 2
        resourceService.frmelmnts = testData.resourceBundle.frmelmnts;
        otpService.generateOTP=jest.fn().mockReturnValue(of(testData.resendOtpSuccess));
        component.resendOTP();
        expect(component.infoMessage).toEqual('');
        expect(component.errorMessage).toEqual(resourceService.frmelmnts.lbl.OTPresendMaxretryreached);
      });
      it('call onCancel method ', () => {
        component.onCancel();
        expect(navigationHelperService.navigateToLastUrl).toBeCalled();
      });
      it('call redirectToParentComponent method ', () => {
        jest.spyOn(component.redirectToParent, 'emit');
        component.redirectToParentComponent();
        expect(component.redirectToParent.emit).toBeCalled();
      });
     
});