
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

    describe('onAction', () => {
        it('should emit clickEvent with correct action and data', () => {
            const batchdata = { id: 'batchId', name: 'Batch Name' };
            const emitSpy = jest.spyOn(component.clickEvent, 'emit');

            component.onAction(batchdata);

            expect(emitSpy).toHaveBeenCalledWith({ 'action': 'batchcardclick', 'data': batchdata });
        });
    });

});