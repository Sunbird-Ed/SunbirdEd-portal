
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component,EventEmitter,Input,OnInit,Output,ViewChild,OnDestroy,AfterViewInit } from '@angular/core';
import { ResourceService,ToasterService,NavigationHelperService } from '@sunbird/shared';
import { UntypedFormBuilder,UntypedFormControl,UntypedFormGroup,Validators } from '@angular/forms';
import { DeviceRegisterService,UserService } from '@sunbird/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ProfileService } from '@sunbird/profile';
import { _ } from 'lodash-es';
import { IImpressionEventInput,IInteractEventInput,TelemetryService } from '@sunbird/telemetry';
import { map } from 'rxjs/operators';
import { forkJoin,of } from 'rxjs';
import { PopupControlService } from '../../../../service/popup-control.service';
import {UserLocationComponent } from './user-location.component';
describe('UserLocationComponent', () => {
    let component: UserLocationComponent;

    const resourceService :Partial<ResourceService> ={};
	const toasterService :Partial<ToasterService> ={};
	const formBuilder :Partial<UntypedFormBuilder> ={};
	const profileService :Partial<ProfileService> ={};
	const activatedRoute :Partial<ActivatedRoute> ={};
	const router :Partial<Router> ={};
	const userService :Partial<UserService> ={};
	const deviceRegisterService :Partial<DeviceRegisterService> ={};
	const navigationhelperService :Partial<NavigationHelperService> ={};
	const telemetryService :Partial<TelemetryService> ={};
	const popupControlService :Partial<PopupControlService> ={};

    beforeAll(() => {
        component = new UserLocationComponent(
            resourceService as ResourceService,
			toasterService as ToasterService,
			formBuilder as UntypedFormBuilder,
			profileService as ProfileService,
			activatedRoute as ActivatedRoute,
			router as Router,
			userService as UserService,
			deviceRegisterService as DeviceRegisterService,
			navigationhelperService as NavigationHelperService,
			telemetryService as TelemetryService,
			popupControlService as PopupControlService
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