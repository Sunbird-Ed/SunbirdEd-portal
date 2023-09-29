
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component,OnInit,Input,Output,EventEmitter,OnDestroy } from '@angular/core';
import { ResourceService,ServerResponse,UtilService,ConfigService,ToasterService } from '@sunbird/shared';
import { Validators,UntypedFormGroup,UntypedFormControl } from '@angular/forms';
import { _ } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription,Subject } from 'rxjs';
import { TenantService,OtpService,UserService } from '@sunbird/core';
import { IInteractEventObject,IInteractEventEdata } from '@sunbird/telemetry';
import { OtpPopupComponent } from './otp-popup.component';

describe('OtpPopupComponent', () => {
    let component: OtpPopupComponent;

    const resourceService :Partial<ResourceService> ={};
	const tenantService :Partial<TenantService> ={};
	const deviceDetectorService :Partial<DeviceDetectorService> ={};
	const otpService :Partial<OtpService> ={};
	const userService :Partial<UserService> ={};
	const utilService :Partial<UtilService> ={};
	const configService :Partial<ConfigService> ={};
	const toasterService :Partial<ToasterService> ={};

    beforeAll(() => {
        component = new OtpPopupComponent(
            resourceService as ResourceService,
			tenantService as TenantService,
			deviceDetectorService as DeviceDetectorService,
			otpService as OtpService,
			userService as UserService,
			utilService as UtilService,
			configService as ConfigService,
			toasterService as ToasterService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
});