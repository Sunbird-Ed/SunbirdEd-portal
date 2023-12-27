
import { Component,OnInit,Input } from '@angular/core';
import { _ } from 'lodash-es';
import { ContentData,ResourceService } from '@sunbird/shared';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { ContentPlayerMetadataComponent } from './content-player-metadata.component';
import { of } from 'rxjs';

describe('ContentPlayerMetadataComponent', () => {
    let component: ContentPlayerMetadataComponent;

    const resourceService :Partial<ResourceService> ={
        instance: 'mock string'
    };
	const cslFrameworkService :Partial<CslFrameworkService> ={
        getGlobalFilterCategoriesObject: jest.fn(),
        transformContentDataFwBased: jest.fn()
    };

    beforeAll(() => {
        component = new ContentPlayerMetadataComponent(
            resourceService as ResourceService,
			cslFrameworkService as CslFrameworkService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
            

    it('should initialize properties on ngOnInit', () => {
        const contentData = { 
            name: 'sample-collection',
            description: '',
            framework: 'sample-framework',
            body: 'mock-body',
            identifier: 'sample-id',
            code: 'sample-course',
            contentType: 'course',
            mimeType: 'sample-mime-type',
            versionKey: '1497028761823',
            me_averageRating: 3,
            userName: 'mock-name',
            userId: '3',
            status:'mock-status',
        };
        component.contentData = contentData;
        jest.spyOn(component as any,'validateContent').mockReturnValue(of({}));
        component.ngOnInit();
    
        expect(component.metadata).toEqual(contentData);
        expect(component.cslFrameworkService.getGlobalFilterCategoriesObject).toHaveBeenCalled();
        expect(component.cslFrameworkService.transformContentDataFwBased).toHaveBeenCalledWith(component.frameworkCategoriesList,component.metadata);
        expect(component.validateContent).toHaveBeenCalled();
        expect(component.instance).toEqual(component.resourceService.instance.toUpperCase());
    });

    it('should validate content fields', () => {
        const contentData = {
          language: 'English',
          gradeLevel: ['Grade 1', 'Grade 2'],
          subject: 'Math',
          flags: [1, 2, 3],
          keywords: 'keyword1, keyword2',
          resourceTypes: ['Type1', 'Type2'],
          attributions: 'Attribution 1, Attribution 2',
          primaryCategory: 'Category1',
          additionalCategories: ['Category2', 'Category3'],
          invalidField: 'Invalid Field'
        };
    
        component.metadata = { ...contentData };
        component.validateContent();
    
        expect(component.metadata.language).toBe('English');
        //expect(component.metadata.gradeLevel).toEqual(['Grade 1, Grade 2']);
        expect(component.metadata.subject).toBe('Math');
        //expect(component.metadata.flags).toBe(['1, 2, 3']);
        // expect(component.metadata.keywords).toBe('keyword1, keyword2');
        // expect(component.metadata.resourceTypes).toBe('Type1, Type2');
        // expect(component.metadata.attributions).toBe('Attribution 1, Attribution 2');
        expect(component.metadata.primaryCategory).toBe('Category1');
       // expect(component.metadata.additionalCategories).toBe('Category2, Category3');
        expect(component.metadata.invalidField).toBe('Invalid Field');
      });
    

    it('should set showContentCreditsModal to true', () => {
        component.showContentCreditsPopup();
        expect(component.showContentCreditsModal).toBe(true);
    });
    
});