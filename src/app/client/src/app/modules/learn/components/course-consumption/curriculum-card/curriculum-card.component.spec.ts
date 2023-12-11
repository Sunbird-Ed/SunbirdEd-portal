
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component,Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { CurriculumCardComponent } from './curriculum-card.component';

describe('CurriculumCardComponent', () => {
    let component: CurriculumCardComponent;

    const resourceService :Partial<ResourceService> ={};

    beforeAll(() => {
        component = new CurriculumCardComponent(
            resourceService as ResourceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should have curriculum input property', () => {
        const curriculum = {"Board": "CBSE"};
        component.curriculum = curriculum;
        expect(component.curriculum).toEqual(curriculum);
    });

    it('should have a resourceService instance', () => {
        expect(component.resourceService).toBeDefined();
    });

    it('should set resourceService in the constructor', () => {
        expect(component.resourceService).toBe(resourceService);
    });
    
});