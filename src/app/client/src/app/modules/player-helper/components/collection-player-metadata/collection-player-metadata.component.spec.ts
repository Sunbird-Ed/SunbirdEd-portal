import { Component,OnInit,Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { _ } from 'lodash-es';
import { ContentData } from '@sunbird/shared';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { CollectionPlayerMetadataComponent } from './collection-player-metadata.component';
import { of } from 'rxjs';

describe('CollectionPlayerMetadataComponent', () => {
    let component: CollectionPlayerMetadataComponent;

    const mockResourceService :Partial<ResourceService> ={
        instance: 'mockInstance'
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        params: of({collectionId: "mock-collection-id"})
    };
	const mockCslFrameworkService :Partial<CslFrameworkService> ={
        getAllFwCatName: jest.fn().mockReturnValue(['fwCat1', 'fwCat2'])
    };

    beforeAll(() => {
        component = new CollectionPlayerMetadataComponent(
            mockResourceService as ResourceService,
			mockActivatedRoute as ActivatedRoute,
			mockCslFrameworkService as CslFrameworkService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize frameworkCategoriesList on ngOnInit', () => {
        jest.spyOn(component.cslFrameworkService,'getAllFwCatName').mockReturnValue(['fwCat1', 'fwCat2']);
        component.ngOnInit();
        expect(component.frameworkCategoriesList).toEqual(['fwCat1', 'fwCat2']);
    });
    
    it('should set collectionId on route param subscription', () => {
        component.ngOnInit();
        expect(component.collectionId).toEqual('mock-collection-id');
    });
    
    it('should set instance to upper case on ngOnInit', () => {
        component.ngOnInit();
        expect(component.instance).toEqual('MOCK INSTANCE');
    });
    
    it('should set showContentCreditsModal to true when showContentCreditsPopup is called', () => {
        component.showContentCreditsPopup();
        expect(component.showContentCreditsModal).toEqual(true);
    });

    it('should return telemetry interact edata', () => {
        const edata = component.getTelemetryInteractEdata({ id: 'mockId' });
        expect(edata).toEqual({ id: 'mockId', type: 'click', pageid: 'collection-player' });
    });
});