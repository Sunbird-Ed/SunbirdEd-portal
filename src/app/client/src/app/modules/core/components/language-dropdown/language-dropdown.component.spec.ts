
import { of } from 'rxjs';
import { ResourceService, LayoutService, UtilService, GenericResourceService } from '../../../shared';
import { Router, ActivatedRoute } from '@angular/router';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import * as _ from 'lodash-es';
import { LanguageDropdownComponent } from './language-dropdown.component';

describe('LanguageDropdownComponent', () => {
    let component: LanguageDropdownComponent;
    const mockCacheService: Partial<CacheService> = {
        set: jest.fn(),
        get: jest.fn()
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {};
    const mockGenericResourceService: Partial<GenericResourceService> = {
        initialize: jest.fn(),
        getResource: jest.fn(),
        getLanguageChange: jest.fn()
    };
    const mockLayoutService: Partial<LayoutService> = {
        isLayoutAvailable: jest.fn(() => true),
        updateSelectedContentType: jest.fn(() => {
            return
        }) as any
    };
    const mockUtilService: Partial<UtilService> = {
        emitLanguageChangeEvent: jest.fn()
    };
    const mockResourceService: Partial<ResourceService> = {
        initialize: jest.fn(),
        getResource: jest.fn(),
        getLanguageChange: jest.fn()
    };
    const mockRouter: Partial<Router> = {
        url: '/learn?selectedTab=course',
        navigate: jest.fn()
    };
    beforeAll(() => {
        component = new LanguageDropdownComponent(
            mockActivatedRoute as ActivatedRoute,
            mockCacheService as CacheService,
            mockResourceService as ResourceService,
            mockRouter as Router,
            mockUtilService as UtilService,
            mockLayoutService as LayoutService,
            mockGenericResourceService as GenericResourceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('On language change', () => {
        mockCacheService.set('portalLanguage', 'en', { maxAge: 10 * 60 });
        component.onLanguageChange('en');
        expect(mockUtilService.emitLanguageChangeEvent).toHaveBeenCalled();
        expect(mockResourceService.getResource).toHaveBeenCalled();
    });

    it('On ngOninit for else case', () => {
        mockCacheService.set('portalLanguage', null);
        component.ngOnInit();
        expect(component.selectedLanguage).toBe('en');
    });

    it('should get the interact edata for telemetry', () => {
        mockRouter.navigate(['learn?selectedTab=course'])
        jest.spyOn(component, 'getTelemetryInteractEdata');
        const result = component.getTelemetryInteractEdata('en');
        expect(result).toEqual({ id: 'en-lang', type: 'click', pageid: 'learn' });
    });

    it('should tell is layout is available', () => {
        const layoutData = component.isLayoutAvailable();
        expect(layoutData).toBe(true);
    });
});
