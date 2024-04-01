
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component,OnInit,Output,Input,EventEmitter,OnDestroy,AfterViewInit } from '@angular/core';
import { _ } from 'lodash-es';
import { Subscription,combineLatest } from 'rxjs';
import { ResourceService } from '@sunbird/shared';
import { tap } from 'rxjs/operators';
import { LazzyLoadScriptService } from 'LazzyLoadScriptService';
import { TopicPickerComponent } from './topic-picker.component'

describe('TopicPickerComponent', () => {
    let component: TopicPickerComponent;

    const resourceService :Partial<ResourceService> ={};
	const lazzyLoadScriptService :Partial<LazzyLoadScriptService> ={};

    beforeAll(() => {
        component = new TopicPickerComponent(
            resourceService as ResourceService,
			lazzyLoadScriptService as LazzyLoadScriptService
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