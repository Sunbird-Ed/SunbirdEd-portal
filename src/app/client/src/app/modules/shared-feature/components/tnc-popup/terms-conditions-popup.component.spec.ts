
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component,OnInit,Input,EventEmitter,Output,OnDestroy } from '@angular/core';
import { UserService,TenantService } from '@sunbird/core';
import { Subscription,Subject } from 'rxjs';
import { ResourceService,ToasterService } from '@sunbird/shared';
import { IUserProfile,ILoaderMessage } from '@sunbird/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { _ } from 'lodash-es';
import { PopupControlService } from '../../../../service/popup-control.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndConditionsPopupComponent } from './terms-conditions-popup.component';

describe('TermsAndConditionsPopupComponent', () => {
    let component: TermsAndConditionsPopupComponent;

    const userService :Partial<UserService> ={};
	const resourceService :Partial<ResourceService> ={
        messages: {
            stmsg:{
                m0129: 'Loading the terms and conditions.'
            }
        }
    };
	const toasterService :Partial<ToasterService> ={};
	const tenantService :Partial<TenantService> ={};
	const sanitizer :Partial<DomSanitizer> ={};
	const popupControlService :Partial<PopupControlService> ={};
	const matDialog :Partial<MatDialog> ={};

    beforeAll(() => {
        component = new TermsAndConditionsPopupComponent(
            userService as UserService,
			resourceService as ResourceService,
			toasterService as ToasterService,
			tenantService as TenantService,
			sanitizer as DomSanitizer,
			popupControlService as PopupControlService,
			matDialog as MatDialog
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