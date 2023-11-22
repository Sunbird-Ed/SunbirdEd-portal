
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component,Input,EventEmitter,Output } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Ibatch } from './../../interfaces';
import { ResourceService } from '../../services/index';
import { Response } from './batch-card.component.spec.data'
import { BatchCardComponent } from './batch-card.component'
describe('BatchCardComponent', () => {
    let component: BatchCardComponent;

    const resourceService :Partial<ResourceService> ={};
	const activatedRoute :Partial<ActivatedRoute> ={};
	const route :Partial<Router> ={};

    beforeAll(() => {
        component = new BatchCardComponent(
            resourceService as ResourceService,
			activatedRoute as ActivatedRoute,
			route as Router
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