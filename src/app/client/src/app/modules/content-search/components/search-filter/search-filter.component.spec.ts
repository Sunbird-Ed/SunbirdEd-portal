import { SearchFilterComponent } from './search-filter.component';
import { ResourceService, LayoutService, UtilService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { FormService } from '../../../../modules/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ContentSearchService } from './../../services';
import * as _ from 'lodash-es';

describe('SearchFilterComponent', () => {
    let component: SearchFilterComponent;
    const mockContentSearchService: Partial<ContentSearchService> = {
        getCategoriesMapping: {
            subject: 'se_subjects',
            medium: 'se_mediums',
            gradeLevel: 'se_gradeLevels',
            board: 'se_boards'
        },
        fetchFilter:jest.fn()
    };
    const mockFormService: Partial<FormService> = {};

    const mockActivatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({
            board: ['sample-board'],
            medium: ['sample-medium'],
            gradeLevel: ['grade-1']
        })
    };

    const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
    };
    const mockRouter: Partial<Router> = {
        events: of({ id: 1, url: 'sample-url' }) as any,
        navigate: jest.fn()
    };
    const mockResourceService: Partial<ResourceService> = {
        languageSelected$: of({ language: 'en' }) as any,
        selectedLang: 'sample-language'
    };
    const mockLayoutService: Partial<LayoutService> = {
        isLayoutAvailable: jest.fn(() => true)
    };
    const mockCacheService: Partial<CacheService> = {
        set: jest.fn()
    };
    const mockUtilService: Partial<UtilService> = {
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
            mockCacheService as CacheService,
            mockUtilService as UtilService
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
        component.filterChange = {
            emit: jest.fn(() => inputData)
        } as any;
        component.selectedGroupOption(inputData);
        expect(component.selectedBoard).toBe(inputData);
    });

    it('should check for layout option', () => {
        const res = component.isLayoutAvailable();
        expect(res).toBeTruthy();
    });

    it('should call interactEdata', () => {
        component.selectedFilters = {
            board: ['sample-board'],
            medium: ['sample-medium'],
            publisher: ['publisher-name-1', 'pub-name-2']
        };
        component.selectedNgModels = {
            selected_subjects: ['subject-1']
        };
        const returnData = component.getInteractEdata();
        expect(returnData).toEqual({
            'id': 'reset-filter', 'type': 'click',
            'pageid': 'resource-search', 'extra': {
                'filters': {
                    board: ['AP Board'],
                    channel: [],
                    medium: [],
                    publisher: [],
                    subject: ['subject-1'],
                    selectedTab: 'textbook'
                }
            }
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
    

    describe('ngOnInit', () => {
        it('should invoked ngOnInit for reset filters', () => {
            component.selectedFilters = {
                board: ['sample-board'],
                audience: ['sample-audience'],
                publisher: 'publisher'
            };
            component.selectedNgModels = {
                selected_subjects: ['subject-1']
            };
            component.filterChangeEvent.next({ board: 'sample-board' });
            mockContentSearchService.fetchFilter = jest.fn(() => of({ board: ['sample-board'] }));
            mockFormService.getFormConfig = jest.fn(() => of([{ visibility: { data: {} } }]));
            mockResourceService.languageSelected$ = of({
                language: 'en'
            });
            component.facets$ = of({ id: 'sample-id' }) as any;
            mockChangeDetectionRef.detectChanges = jest.fn();
            mockUtilService.transposeTerms = jest.fn(() => 'sample-terms');
            component.defaultFilters = {
                board: ['sample-board'],
                audience: ['sample-audience'],
                publisher: 'publisher'
            };
            component.ngOnInit();
            expect(mockContentSearchService.fetchFilter).toHaveBeenCalled();
            expect(mockFormService.getFormConfig).toHaveBeenCalled();
            expect(mockChangeDetectionRef.detectChanges).toHaveBeenCalled();
        });

        it('should return error for catch part', () => {
            mockContentSearchService.fetchFilter = jest.fn(() => throwError({ error: '' }));
            mockFormService.getFormConfig = jest.fn(() => throwError([{ visibility: { data: {} } }]));
            component.facets$ = of({ id: 'sample-id' }) as any;
            mockChangeDetectionRef.detectChanges = jest.fn();
            component.ngOnInit();
            expect(mockContentSearchService.fetchFilter).toHaveBeenCalled();
            expect(mockFormService.getFormConfig).toHaveBeenCalled();
        });
    });

    it('should unsubscribe the services', () => {
        component.ngOnDestroy();
    });

    it('should reset filters', () => {
        mockRouter.navigate = jest.fn(() => Promise.resolve(true));
        component.resetFilters();
        expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should remove cache', () => {
        mockCacheService.exists = jest.fn(() => (true));
        mockCacheService.remove = jest.fn();
        component.searchFrameworkFilterComponent = {
            resetFilter: jest.fn()
        };
        component.onSearchFrameworkFilterReset();
        expect(mockCacheService.exists).toHaveBeenCalled();
        expect(mockCacheService.remove).toHaveBeenCalled();
    });


    it('should call getFilterForm$', () => {
        component.filterResponseData = [
            {
                category: 'board',
                type: 'dropdown',
                labelText: 'frmelmnts.lbl.boards',
                defaultLabelText: 'board',
                placeholderText: 'frmelmnts.lbl.selectBoard',
                defaultPlaceholderText: 'select board',
                multiple: false,
                dataSource: 'framework'
            },
            {
                category: 'medium',
                type: 'dropdown',
                labelText: 'frmelmnts.lbl.medium',
                defaultLabelText: 'medium',
                placeholderText: 'frmelmnts.lbl.selectMedium',
                defaultPlaceholderText: 'select medium',
                multiple: true,
                dataSource: 'framework'
            },
            {
                category: 'gradeLevel',
                type: 'dropdown',
                labelText: 'frmelmnts.lbl.class',
                defaultLabelText: 'grade',
                placeholderText: 'frmelmnts.lbl.selectClass',
                defaultPlaceholderText: 'select grade',
                multiple: true,
                dataSource: 'framework'
            },
            {
                category: 'subject',
                type: 'dropdown',
                labelText: 'frmelmnts.lbl.subject',
                defaultLabelText: 'subject',
                placeholderText: 'frmelmnts.lbl.selectSubject',
                defaultPlaceholderText: 'select subject',
                multiple: true,
                dataSource: 'facet'
            },
            {
                category: 'audience',
                type: 'dropdown',
                labelText: 'frmelmnts.lbl.publishedUserType',
                defaultLabelText: 'audience',
                placeholderText: 'Select User Type',
                defaultPlaceholderText: "Select User Type",
                multiple: true,
                dataSource: 'framework'
            }
        ]
        //@ts-ignore
        component.getFilterForm$()
        //@ts-ignore
        expect(component._filterConfig$).toBeDefined();
    });

    it('should call getFramework when no boardname is present', () => {
        let obj={}
    //@ts-ignore
     component.getFramework(obj);
     expect(mockContentSearchService.fetchFilter).toHaveBeenCalled();
    });
});
