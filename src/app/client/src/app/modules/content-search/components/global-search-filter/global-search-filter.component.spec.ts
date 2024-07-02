import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { promise } from 'protractor';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../core';
import { ResourceService, UtilService, ConnectionService } from '../../../shared';
import { GlobalSearchFilterComponent } from './global-search-filter.component';
import { MockData } from './global-search-filter.component.spec.data';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe('GlobalSearchFilterComponent', () => {
    let globalSearchFilterComponent: GlobalSearchFilterComponent;
    const mockActivatedRoute: Partial<ActivatedRoute> = {};
    const mockCacheService: Partial<CacheService> = {};
    const mockCdr: Partial<ChangeDetectorRef> = {};
    const mockConnectionService: Partial<ConnectionService> = {};
    const mockResourceService: Partial<ResourceService> = {};
    const mockRouter: Partial<Router> = {
        url: 'https://sample.com?campaign_param?ABCD'
    };
    const mockUserService: Partial<UserService> = {};
    const mockUtilService: Partial<UtilService> = {
        isDesktopApp: true
    };
    const mockCslFrameworkService: Partial<CslFrameworkService> = {
        getFrameworkCategories: jest.fn(),
        setDefaultFWforCsl: jest.fn(),
        getAllFwCatName: jest.fn(),
        getAlternativeCodeForFilter: jest.fn()
    };

    beforeAll(() => {
        globalSearchFilterComponent = new GlobalSearchFilterComponent(
            mockResourceService as ResourceService,
            mockRouter as Router,
            mockActivatedRoute as ActivatedRoute,
            mockCdr as ChangeDetectorRef,
            mockUtilService as UtilService,
            mockUserService as UserService,
            mockCacheService as CacheService,
            mockConnectionService as ConnectionService,
            mockCslFrameworkService as CslFrameworkService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should be create a instance of globalSearchFilterComponent', () => {
        expect(globalSearchFilterComponent).toBeTruthy();
    });

    describe('onChange', () => {
        it('should update channelId', () => {
            const facet = {
                name: 'sample-facet',
                channel: {
                    channelId: 'sample-channel-id'
                }
            };
            globalSearchFilterComponent.selectedFilters = {
                channel: ['Chhattisgarh']
            };
            globalSearchFilterComponent.facets = MockData.facets;
            // act
            globalSearchFilterComponent.onChange(facet);
            // assert
            expect(globalSearchFilterComponent.selectedFilters.channel).toStrictEqual(['Chhattisgarh']);
            expect(globalSearchFilterComponent.filterChangeEvent).toBeTruthy();
        });
    });

    describe('ngOnChanges', () => {
        it('should return previous and current value', () => {
            // arrange
            const changes = {
                facets: {
                    currentValue: [{
                        index: 'class 1',
                        name: 'mediaType',
                        mimeTypeList: ['course', 'content'],
                        label: 'sample-label'
                    }, {
                        index: 'class 10',
                        name: 'mediaType',
                        mimeTypeList: ['course', 'content'],
                        label: 'sample-label'
                    }]
                }
            } as any;
            mockResourceService.frmelmnts = {
                lbl: {
                    Select: 'sample-select'
                }
            };
            mockResourceService.languageSelected$ = of({ language: 'en' });
            globalSearchFilterComponent.filterFormTemplateConfig = MockData.facets as any;
            mockUtilService.transposeTerms = jest.fn(() => 'sample-terms');
            // act
            globalSearchFilterComponent.ngOnChanges(changes);
            // assert
            expect(mockResourceService.languageSelected$).toBeTruthy();
            expect(mockUtilService.transposeTerms).toHaveBeenNthCalledWith(1, 'sample-label', 'sample-label', undefined);
            expect(mockUtilService.transposeTerms).toHaveBeenNthCalledWith(2, 'sample-select sample-label',
                'sample-select sample-label', undefined);
        });
    });

    describe('updateRoute', () => {
        it('should be update route', () => {
            mockActivatedRoute.snapshot = {
                queryParams: {
                    board: ['board'],
                    medium: ['medium-1'],
                    gradeLevel: ['gradeLevel-1'],
                    chhanel: '',
                    selectedTab: 'mydownloads'
                },
                params: {
                    pageNumber: 1
                }
            } as any;
            globalSearchFilterComponent.selectedFilters = {
                channel: ['Chhattisgarh'],
                key: 'key-1',
                selectedTab: 'home',
                item: {
                    board: ['board'],
                    medium: ['medium-1'],
                    gradeLevel: ['gradeLevel-1'],
                    chhanel: ''
                }
            };
            globalSearchFilterComponent.facets = MockData.facets;
            globalSearchFilterComponent.isConnected = true;
            globalSearchFilterComponent.queryParamsToOmit = [{ id: 'id' }];
            mockCacheService.get = jest.fn(() => ({
                selectedTab: 'all'
            }));
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            // act
            globalSearchFilterComponent.updateRoute();
            // assert
            expect(mockCacheService.get).toHaveBeenCalled();
            expect(globalSearchFilterComponent.selectedFilters.selectedTab).toBe('all');
        });
    });

    it('should update terms for filters', () => {
        mockResourceService.languageSelected$ = of({
            language: 'en'
        });
        globalSearchFilterComponent.facets = [{
            'index': '1',
            'label': 'Organization Name',
            'placeholder': 'Organization Name',
            'values': [
                {
                    'identifier': '01258043108936908899',
                    'orgName': 'Chhattisgarh',
                    'slug': 'ct',
                    'name': 'Chhattisgarh'
                },

            ],
            'name': 'channel'
        }];
        mockUtilService.transposeTerms = jest.fn(() => 'sample-string');
        // act
        globalSearchFilterComponent.updateTerms();
        // assert
        expect(mockResourceService.languageSelected$).not.toBeUndefined();
        expect(mockUtilService.transposeTerms).toHaveBeenCalled();
    });

    describe('ngOnInit', () => {
        it('should invoked ngOnInit', (done) => {
            mockActivatedRoute.snapshot = {
                data: {
                    telemetry: {
                        pageid: 'sample-pageId',
                        params: ''
                    }
                }
            } as any;
            mockActivatedRoute.queryParams = of({
                ignoreSavedFilter: false,
                selectedTab: 'home',
                mediaType: ['sample-media'],
                primaryCategory: ['sample-primary-category'],
                key: 'sample-key'
            });
            global.innerWidth = 500;
            mockConnectionService.monitor = jest.fn(() => of(true));
            mockCacheService.remove = jest.fn();
            mockCacheService.exists = jest.fn(() => true);
            mockCacheService.get = jest.fn(() => { });
            jest.spyOn(globalSearchFilterComponent, 'updateTerms').mockImplementation(() => {
                return;
            });
            jest.spyOn(globalSearchFilterComponent, 'updateRoute').mockImplementation(() => {
                return;
            });
            mockCdr.detectChanges = jest.fn();
            globalSearchFilterComponent.filterChangeEvent = of({
                type: 'mediaType',
                event: {
                    data: {
                        index: 'class-1'
                    }
                }
            }) as any;
            jest.spyOn(globalSearchFilterComponent.cslFrameworkService, 'getAllFwCatName').mockReturnValue([]);
            // act
            jest.spyOn(globalSearchFilterComponent.cslFrameworkService, 'getAllFwCatName').mockReturnValue([]);
            jest.spyOn(mockCslFrameworkService, 'getAlternativeCodeForFilter').mockReturnValue(['code1', 'code2', 'code3', 'code4']);
            globalSearchFilterComponent.ngOnInit();
            setTimeout(() => {
                expect(globalSearchFilterComponent.refresh).toBeTruthy();
                expect(globalSearchFilterComponent.isOpen).toBeFalsy();
                expect(mockConnectionService.monitor).toHaveBeenCalled();
                expect(mockCacheService.remove).toHaveBeenCalled();
                expect(mockCacheService.exists).toHaveBeenCalled();
                expect(mockCacheService.get).toHaveBeenCalled();
                done();
            }, 10);
        });

        it('should invoked ngOnInit for else part and ignoreSavedFilter is false', (done) => {
            mockActivatedRoute.snapshot = {
                data: {
                    telemetry: {
                        pageid: 'sample-pageId',
                        params: ''
                    }
                }
            } as any;
            mockActivatedRoute.queryParams = of({
                ignoreSavedFilter: false,
                selectedTab: 'home',
                mediaType: undefined,
                primaryCategory: ['sample-primary-category']
            });
            mockConnectionService.monitor = jest.fn(() => of(true));
            mockCacheService.exists = jest.fn(() => true);
            // act
            jest.spyOn(globalSearchFilterComponent.cslFrameworkService, 'getAllFwCatName').mockReturnValue([]);
            jest.spyOn(mockCslFrameworkService, 'getAlternativeCodeForFilter').mockReturnValue(['code1', 'code2', 'code3', 'code4']);
            globalSearchFilterComponent.ngOnInit();
            setTimeout(() => {
                expect(globalSearchFilterComponent.refresh).toBeTruthy();
                expect(globalSearchFilterComponent.isOpen).toBeFalsy();
                expect(mockConnectionService.monitor).toHaveBeenCalled();
                done();
            }, 10);
        });

        it('should invoked ngOnInit for else part and ignoreSavedFilter is true', (done) => {
            mockActivatedRoute.snapshot = {
                data: {
                    telemetry: {
                        pageid: 'sample-pageId',
                        params: ''
                    }
                }
            } as any;
            mockActivatedRoute.queryParams = of({
                ignoreSavedFilter: true,
                selectedTab: 'home',
                mediaType: undefined,
                primaryCategory: ['sample-primary-category']
            });
            mockConnectionService.monitor = jest.fn(() => of(true));
            mockCacheService.exists = jest.fn(() => false);
            // act
            jest.spyOn(globalSearchFilterComponent.cslFrameworkService, 'getAllFwCatName').mockReturnValue([]);
            jest.spyOn(mockCslFrameworkService, 'getAlternativeCodeForFilter').mockReturnValue(['code1', 'code2', 'code3', 'code4']);
            globalSearchFilterComponent.ngOnInit();
            setTimeout(() => {
                expect(globalSearchFilterComponent.refresh).toBeTruthy();
                expect(globalSearchFilterComponent.isOpen).toBeFalsy();
                expect(mockConnectionService.monitor).toHaveBeenCalled();
                done();
            }, 10);
        });

        it('should invoked ngOnInit for catch part', () => {
            mockActivatedRoute.snapshot = {
                data: {
                    telemetry: {
                        pageid: 'sample-pageId',
                        params: ''
                    }
                }
            } as any;
            mockActivatedRoute.queryParams = throwError({
                error: {}
            });
            mockConnectionService.monitor = jest.fn(() => of(true));
            mockCacheService.exists = jest.fn(() => false);
            // act
            jest.spyOn(globalSearchFilterComponent.cslFrameworkService, 'getAllFwCatName').mockReturnValue([]);
            jest.spyOn(mockCslFrameworkService, 'getAlternativeCodeForFilter').mockReturnValue(['code1', 'code2', 'code3', 'code4']);
            globalSearchFilterComponent.ngOnInit();
            setTimeout(() => {
                expect(globalSearchFilterComponent.refresh).toBeTruthy();
                expect(globalSearchFilterComponent.isOpen).toBeFalsy();
                expect(mockConnectionService.monitor).toHaveBeenCalled();
            }, 10);
        });
    });

    describe('resetFilters', () => {
        it('should be reset filters', () => {
            globalSearchFilterComponent.selectedFilters = {
                channel: ['Chhattisgarh'],
                key: 'key-1',
                selectedTab: 'home',
                item: {
                    board: ['board'],
                    medium: ['medium-1'],
                    gradeLevel: ['gradeLevel-1'],
                    chhanel: ''
                }
            };
            mockUtilService._isDesktopApp = true;
            mockUserService.anonymousUserPreference = {
                framework: {
                    item: {
                        board: ['board'],
                        medium: ['medium-1'],
                        gradeLevel: ['gradeLevel-1'],
                        chhanel: ''
                    }
                }
            };
            mockActivatedRoute.snapshot = {
                queryParams: {
                    board: ['board'],
                    medium: ['medium-1'],
                    gradeLevel: ['gradeLevel-1'],
                    chhanel: ''
                },
                params: {
                    pageNumber: 1
                }
            } as any;
            globalSearchFilterComponent.queryParamsToOmit = { params: {} };
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            mockCdr.detectChanges = jest.fn();
            // act
            globalSearchFilterComponent.resetFilters();
            // assert
            expect(mockRouter.navigate).toHaveBeenCalled();
            expect(mockCdr.detectChanges).toHaveBeenCalled();
            expect(globalSearchFilterComponent.refresh).toBeTruthy();
        });

        it('should reset filters for else part', () => {
            globalSearchFilterComponent.selectedFilters = {
                channel: ['Chhattisgarh'],
                key: 'key-1',
                selectedTab: 'home',
                item: {
                    board: ['board'],
                    medium: ['medium-1'],
                    gradeLevel: ['gradeLevel-1'],
                    chhanel: ''
                }
            };
            mockUtilService._isDesktopApp = true;
            mockUserService.anonymousUserPreference = {
                framework: {
                    item: {
                        board: ['board'],
                        medium: ['medium-1'],
                        gradeLevel: ['gradeLevel-1'],
                        chhanel: ''
                    }
                }
            };
            mockActivatedRoute.snapshot = {
                queryParams: {
                    board: ['board'],
                    medium: ['medium-1'],
                    gradeLevel: ['gradeLevel-1'],
                    chhanel: ''
                },
                params: undefined
            } as any;
            globalSearchFilterComponent.queryParamsToOmit = { params: {} };
            mockRouter.navigate = jest.fn(() => Promise.resolve(true));
            mockCdr.detectChanges = jest.fn();
            // act
            globalSearchFilterComponent.resetFilters();
            // assert
            expect(mockRouter.navigate).toHaveBeenCalled();
            expect(mockCdr.detectChanges).toHaveBeenCalled();
            expect(globalSearchFilterComponent.refresh).toBeTruthy();
        });
    });

    describe('removeFilterSelection', () => {
        it('should remove selected filters', () => {
            const data = {
                value: { id: 'id' },
                type: 'key'
            };
            globalSearchFilterComponent.selectedFilters = {
                channel: ['Chhattisgarh'],
                key: 'key-1',
                selectedTab: 'home',
                item: {
                    board: ['board'],
                    medium: ['medium-1'],
                    gradeLevel: ['gradeLevel-1'],
                    chhanel: ''
                }
            };
            jest.spyOn(globalSearchFilterComponent, 'updateRoute').mockImplementation(() => {
                return;
            });
            globalSearchFilterComponent.removeFilterSelection(data);
            // assert
            expect(globalSearchFilterComponent.filterChange).toBeTruthy();
        });
    });

    it('should remove filters from cache', () => {
        mockCacheService.remove = jest.fn();
        globalSearchFilterComponent.searchFacetFilterComponent = {
            resetFilter: jest.fn()
        };
        globalSearchFilterComponent.onSearchFacetFilterReset();
        expect(mockCacheService.remove).toHaveBeenCalled();
        expect(globalSearchFilterComponent.searchFacetFilterComponent).toBeTruthy();
        expect(globalSearchFilterComponent.searchFacetFilterComponent.resetFilter).toHaveBeenCalled();
    });

    it('should destroy the component', () => {
        globalSearchFilterComponent.ngOnDestroy();
    });
});
