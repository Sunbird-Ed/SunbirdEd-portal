
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
        transformContentDataFwBased: jest.fn(),
        getAllFwCatName: jest.fn(),
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
        expect(component.validateContent).toHaveBeenCalled();
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
        expect(component.metadata.subject).toBe('Math');
        expect(component.metadata.primaryCategory).toBe('Category1');
        expect(component.metadata.invalidField).toBe('Invalid Field');
      });
    

    it('should set showContentCreditsModal to true', () => {
        component.showContentCreditsPopup();
        expect(component.showContentCreditsModal).toBe(true);
    });
    
    describe('validateContent',()=>{
        it('should compact string values and join them with comma', () => {
            component.metadata = {
            language: 'English',
            frameworkCategory2: 'Math',
            frameworkCategory3: 'Science'
            };
            component.validateContent();
        
            expect(component.metadata.language).toBe('English');
            expect(component.metadata.frameworkCategory2).toBe('Math');
            expect(component.metadata.frameworkCategory3).toBe('Science');
        });

        it('should compact array values and join them with comma', () => {
            component.metadata = {
            keywords: ['keyword1', 'keyword2'],
            resourceTypes: ['type1', 'type2']
            };
            component.validateContent();
        
            expect(component.metadata.keywords).toEqual(['keyword1', 'keyword2']);
            expect(component.metadata.resourceTypes).toEqual(['type1', 'type2']);
        });
        
        it('should handle null or undefined values', () => {
            component.metadata = {
            language: null,
            frameworkCategory2: undefined
            };
            component.validateContent();
        
            expect(component.metadata.language).toBe(null);
            expect(component.metadata.frameworkCategory2).toBeUndefined;
        });

        it('should handle non-string and non-array values', () => {
            component.metadata = {
            flagReasons: 123,
            flaggedBy: { name: 'User' }
            };
            component.validateContent();

            expect(component.metadata.flagReasons).toBe(123);
            expect(component.metadata.flaggedBy).toEqual({"name": "User"});
        });
        
        it('should handle empty metadata', () => {
            component.metadata = {};
            component.validateContent();

            expect(component.metadata).toEqual({});
        });
        
        it('should compact string values and join them with comma', () => {
            component.frameworkCategories = ['framework1','framework2','framework3','framework4'];
            component.fieldData = ['language', component.frameworkCategories[2], component.frameworkCategories[3], 'flagReasons', 'flaggedBy', 'flags', 'keywords',
            'resourceTypes', 'attributions', 'primaryCategory', 'additionalCategories'];
            component.metadata=[{'language': 'english'}];
            component.validateContent();
        
            expect(component.fieldData).toEqual(["language", "framework3", "framework4", "flagReasons", "flaggedBy", "flags", "keywords", "resourceTypes", "attributions", "primaryCategory","additionalCategories"]);
        });
    })
    
});