import { SearchFilterComponent } from './search-filter.component';
import { ResourceService, LayoutService, UtilService } from '@sunbird/shared';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { FormService } from '../../../../modules/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ContentSearchService } from './../../services';
import * as _ from 'lodash-es';
import { CslFrameworkService } from  '../../../public/services/csl-framework/csl-framework.service';

describe('SearchFilterComponent', () => {
    let component: SearchFilterComponent;
    const mockContentSearchService: Partial<ContentSearchService> = {
        getCategoriesMapping: {
            subject: 'se_subjects',
            medium: 'se_mediums',
            gradeLevel: 'se_gradeLevels',
            board: 'se_boards'
        } as any,
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
        detectChanges: jest.fn(),
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
    const mockCslFrameworkService: Partial<CslFrameworkService> = {
        getFrameworkCategories: jest.fn(),
        setDefaultFWforCsl: jest.fn(),
        getAlternativeCodeForFilter: jest.fn(),
        getAllFwCatName: jest.fn(),
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
            mockUtilService as UtilService,
            mockCslFrameworkService as CslFrameworkService
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

    describe('hardRefreshFilter', ()=> {
        it('should call refresh true', () => {
            //@ts-ignore
            component.refresh = false;
            jest.spyOn(component['cdr'], 'detectChanges')
            component['hardRefreshFilter']();
            expect(component['cdr'].detectChanges).toBeCalled();
            expect(component.refresh).toBe(true)
        });
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
                    board: [],
                    channel: [],
                    medium: [],
                    publisher: [],
                    undefined: [
                        "AP Board",
                    ],
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
        component.frameworkCategoriesList = ['mock-framework1','mock-framework2'];
        component.globalFilterCategories = ['categories1','categories2'];
        const returnData = component.filterData;
        expect(returnData).toEqual(["mock-framework1", "mock-framework2","categories1",
            "categories2", "channel","audience", "publisher",
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
            const getFilterSpy = jest.spyOn(component as any,'getFilterForm$' as any);
            const checkWindowSpy = jest.spyOn(component as any,'checkForWindowSize' as any);
            const boardChangeSpy =  jest.spyOn(component as any,'boardChangeHandler' as any);
            const fetchSelectedFilterSpy = jest.spyOn(component as any,'fetchSelectedFilterOptions' as any);
            const handleFilterSpy = jest.spyOn(component as any,'handleFilterChange' as any);
            const getFacetSpy = jest.spyOn(component as any,'getFacets' as any);
            component.ngOnInit();
            expect(component['cslFrameworkService'].getFrameworkCategories).toHaveBeenCalled();
            expect(component['cslFrameworkService'].getAlternativeCodeForFilter).toHaveBeenCalled();
            expect(component['cslFrameworkService'].getAllFwCatName).toHaveBeenCalled();
            expect(getFilterSpy).toHaveBeenCalled();
            expect(checkWindowSpy).toHaveBeenCalled();
            expect(boardChangeSpy).toHaveBeenCalled();
            expect(fetchSelectedFilterSpy).toHaveBeenCalled();
            expect(handleFilterSpy).toHaveBeenCalled();
            expect(getFacetSpy).toHaveBeenCalled();
        });

        it('should return error for catch part', () => {
            mockContentSearchService.fetchFilter = jest.fn(() => throwError({ error: '' }));
            mockFormService.getFormConfig = jest.fn(() => throwError([{ visibility: { data: {} } }]));
            component.facets$ = of({ id: 'sample-id' }) as any;
            mockChangeDetectionRef.detectChanges = jest.fn();
            const getFilterSpy = jest.spyOn(component as any,'getFilterForm$' as any);
            const checkWindowSpy = jest.spyOn(component as any,'checkForWindowSize' as any);
            component.ngOnInit();
            expect(component['cslFrameworkService'].getFrameworkCategories).toHaveBeenCalled();
            expect(component['cslFrameworkService'].getAlternativeCodeForFilter).toHaveBeenCalled();
            expect(component['cslFrameworkService'].getAllFwCatName).toHaveBeenCalled();
            expect(getFilterSpy).toHaveBeenCalled();
            expect(checkWindowSpy).toHaveBeenCalled();
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

    it('should fetch filters and emit filterChange event', () => {
        const mockFilters = {  };
        const mockAudienceTypeFilter = {  };
        const queryParams = {
            sampleBoard: ['board'],
            sampleMedium: ['medium'],
            gradeLevel: ['grade-1']
        };
        component['fetchAndFormatQueryParams'] = jest.fn(() => of(queryParams));
        component['getFramework'] = jest.fn(() => of(mockFilters));
        component['getAudienceTypeFormConfig'] = jest.fn(() => of(mockAudienceTypeFilter));
        component['fetchFilters']().subscribe(() => {
            expect(component.filterChange.emit).toHaveBeenCalledWith({
                status: 'FETCHING'
            });
            expect(component['filters']).toEqual({ });
        });
        mockChangeDetectionRef.detectChanges();
    });

    it('should fetch selected filter options and perform necessary operations', () => {
        const mockFilters = { };
        jest.spyOn(component, 'fetchFilters' as any).mockReturnValue(of(mockFilters));
        jest.spyOn(component, 'updateBoardList' as any).mockImplementation(() => {});
        jest.spyOn(component, 'updateFiltersList' as any).mockImplementation(() => {});
        jest.spyOn(component, 'emitFilterChangeEvent' as any).mockImplementation(() => {});
        jest.spyOn(component, 'hardRefreshFilter' as any).mockImplementation(() => {});
        component['fetchSelectedFilterOptions']().subscribe(() => {
            expect(component['fetchFilters']).toHaveBeenCalled();
            expect(component['filters']).toEqual({});
            expect(component['updateBoardList']).toHaveBeenCalled();
            expect(component['updateFiltersList' as any]).toHaveBeenCalledWith({ filters: {} });
            expect(component['emitFilterChangeEvent']).toHaveBeenCalledWith(true);
            expect(component['hardRefreshFilter' as any]).toHaveBeenCalled();
        });
    });

    describe('popFilter', () => {
        it('should remove the specified index from the selectedFilters', () => {
            component.selectedFilters = { type1: [1, 2, 3] };
            const type = 'type1';
            const index = 2;
            component['popFilter']({ type, index });
            expect(component.selectedFilters[type]).toEqual([1, 3]);
        });
    });

    describe('pushNewFilter', () => {
        it('should add a new index to the selectedFilters', () => {
            component.selectedFilters = {};
            const type = 'type1';
            const index = 1;
            component['pushNewFilter']({ type, index });
            expect(component.selectedFilters[type]).toEqual([1]);
        });

        it('should add updatedValues to the selectedFilters when index is null', () => {
            component.selectedFilters = {};
            const type = 'type2';
            const updatedValues = [1, 2, 3];
            component['pushNewFilter']({ type, updatedValues });
            expect(component.selectedFilters[type]).toEqual(updatedValues);
        });

        it('should append index to existing selectedFilters[type] if index is not null', () => {
            component.selectedFilters = { type1: [2, 3] };
            const type = 'type1';
            const index = 1;
            component['pushNewFilter']({ type, index });
            expect(component.selectedFilters[type]).toEqual([1, 2, 3]);
        });
    });

    describe('getIndicesFromDefaultFilters', () => {
        it('should return indices of default values for a given type', () => {
            component.defaultFilters = { type1: [1, 2, 3] };
            component.allValues = { type1: [1, 2, 3, 4, 5] };
            const indices = component['getIndicesFromDefaultFilters']({ type: 'type1' });
            expect(indices).toEqual([0, 1, 2]);
        });

        it('should return an empty array if default values are not found', () => {
            component.defaultFilters = {};
            component.allValues = { type2: [1, 2, 3, 4, 5] };
            const indices = component['getIndicesFromDefaultFilters']({ type: 'type2' });
            expect(indices).toEqual([]);
        });

        it('should return an empty array for certain types if no indices are found', () => {
            component.defaultFilters = { type3: [1, 2, 3] };
            component.allValues = { type3: [] };
            const indices = component['getIndicesFromDefaultFilters']({ type: 'type3' });
            expect(indices).toEqual([]);
        });
    });

    describe('getAudienceTypeFormConfig', () => {
        it('should handle error gracefully', (done) => {
            const mockFormService = {
                getFormConfig: jest.fn(() => throwError('Error')),
            };
            component['getAudienceTypeFormConfig']().subscribe((response) => {
                expect(response).toEqual({});
                done();
            });
        });
    });

    describe('getFacets', () => {
        it('should update filters list and refresh filter', (done) => {
            const mockFacets$ = of({ subjects: ['Math', 'Science'], grades: [1, 2, 3] });
            const mockContentSearchService = {
                getCategoriesMapping: { subjects: 'se_subjects', grades: 'se_gradeLevels' },
            };
            component.facets$ = mockFacets$ as any;
            component['contentSearchService'] = mockContentSearchService as any;
            component['getFacets']().subscribe(() => {
                expect(component['filters']).toEqual({ subjects: ['Math', 'Science'], grades: [1, 2, 3] });
                done();
            });
        });
    });

});
