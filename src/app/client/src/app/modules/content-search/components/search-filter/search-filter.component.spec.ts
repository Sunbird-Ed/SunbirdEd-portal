import { SearchFilterComponent } from './search-filter.component';
import { ResourceService, LayoutService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { FormService } from '../../../../modules/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ContentSearchService } from './../../services';

describe('SearchFilterComponent', () => {
    let component: SearchFilterComponent;
    let mockContentSearchService: Partial<ContentSearchService>;
    let mockFormService: Partial<FormService>;

    const mockActivatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({})
    };

    const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
    };
    const mockRouter: Partial<Router> = {
        events: of({ id: 1, url: 'sample-url' }) as any,
        navigate: jest.fn()
    };
    const mockResourceService: Partial<ResourceService> = {};
    const mockLayoutService: Partial<LayoutService> = {
        isLayoutAvailable: jest.fn(() => true)
    };
    const mockCacheService: Partial<CacheService> = {
        set: jest.fn()
    };

    beforeAll(() => {
        component = new SearchFilterComponent(
            mockResourceService as ResourceService,
            mockRouter as Router,
            mockContentSearchService as ContentSearchService,
            mockActivatedRoute as ActivatedRoute,
            mockChangeDetectionRef as ChangeDetectorRef,
            mockLayoutService as LayoutService,
            mockFormService as FormService,
            mockCacheService as CacheService

        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    Object.defineProperty(mockActivatedRoute, 'snapshot', {
        get: jest.fn(() => ({
            params: { slug: 'ap' },
            data: {
                telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate' }
            }
        })),
    });

    it('should be create a instance of Search Filter Component', () => {
        expect(component).toBeTruthy();
    });

    it('should call selectedGroupOption with board data', () => {
        const inputData = { 'label': 'Board', 'value': 'board', 'selectedOption': 'AP Board' };
        component.selectedGroupOption(inputData);
        expect(component.selectedBoard).toBe(inputData);
    });

    it('should check for layout option', () => {
        const res = component.isLayoutAvailable();
        expect(res).toBeTruthy();
    });

    it('should call interactEdata', () => {
        const returnData = component.getInteractEdata();
        expect(returnData).toEqual({
            'id': 'reset-filter', 'type': 'click',
            'pageid': 'resource-search', 'extra': { 'filters': { board: ['AP Board'], selectedTab: 'textbook' } }
        });
    });

    it('should update selectedFilters from queryParams', done => {
        component['fetchSelectedFilterOptions']().subscribe(res => {
            expect(res).toBeDefined();
            expect(component['filters']).toBeDefined();
            done();
        }, err => {
            done();
        });
    });

    it('should call filterData', () => {
        const returnData = component.filterData;
        expect(returnData).toEqual([
            'medium',
            'gradeLevel',
            'board',
            'channel',
            'subject',
            'audience',
            'publisher',
            'se_subjects',
            'se_boards',
            'se_gradeLevels',
            'se_mediums'
        ]);
    });

    it('should call getChannelId', () => {
        const returnData = component.getChannelId(0);
        expect(returnData).toEqual(undefined);
    });

    it('should call checkForWindowSize', () => {
        Object.defineProperty(window, 'innerWidth', {
            value: 900,
        });
        component['checkForWindowSize']();
        expect(component.isOpen).toBeFalsy();
    });

});
