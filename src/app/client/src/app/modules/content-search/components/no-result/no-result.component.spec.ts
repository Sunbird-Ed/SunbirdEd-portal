
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { FormService,UserService } from '@sunbird/core';
import { Component,OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ResourceService,UtilService,ConnectionService,ToasterService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NoResultComponent } from './no-result.component';

describe('NoResultComponent', () => {
    let component: NoResultComponent;

    const router :Partial<Router> ={};
	const resourceService :Partial<ResourceService> ={};
	const UtilService :Partial<UtilService> ={};
	const ConnectionService :Partial<ConnectionService> ={};
	const activatedRoute :Partial<ActivatedRoute> ={};
	const formService :Partial<FormService> ={};
	const userService :Partial<UserService> ={};
	const ToasterService :Partial<ToasterService> ={};

    beforeAll(() => {
        component = new NoResultComponent(
            router as Router,
			resourceService as ResourceService,
			UtilService as UtilService,
			ConnectionService as ConnectionService,
			activatedRoute as ActivatedRoute,
			formService as FormService,
			userService as UserService,
			ToasterService as ToasterService
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