import { Component,Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { GeneraliseLabelService } from '@sunbird/core';
import { CslFrameworkService } from '../../../../public/services/csl-framework/csl-framework.service';
import { CourseDetailsComponent } from './course-details.component';
import { of } from 'rxjs';

describe('CourseDetailsComponent', () => {
    let component: CourseDetailsComponent;

    const resourceService :Partial<ResourceService> ={};
	const generaliseLabelService :Partial<GeneraliseLabelService> ={};
	const cslFrameworkService :Partial<CslFrameworkService> ={
        getGlobalFilterCategoriesObject: jest.fn(),
        transformContentDataFwBased: jest.fn()
    };

    beforeAll(() => {
        component = new CourseDetailsComponent(
            resourceService as ResourceService,
			generaliseLabelService as GeneraliseLabelService,
			cslFrameworkService as CslFrameworkService as any,
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should call cslframework methods', () => {
        jest.spyOn(component.cslFrameworkService as any,'getGlobalFilterCategoriesObject').mockReturnValue(of({}));
        jest.spyOn(component.cslFrameworkService as any,'transformContentDataFwBased').mockReturnValue(of({}));

        expect(component.cslFrameworkService.getGlobalFilterCategoriesObject).toBeDefined();
        expect(component.cslFrameworkService.transformContentDataFwBased).toBeDefined();
    });
});