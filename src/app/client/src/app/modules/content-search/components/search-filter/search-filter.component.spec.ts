import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterComponent } from './search-filter.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, ConfigService, BrowserCacheTtlService, ToasterService, SharedModule, LayoutService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { OrgDetailsService, TenantService, ChannelService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { response } from './search-filter.component.spec.data';
import { BehaviorSubject, of } from 'rxjs';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentSearchService } from './../../services';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';


describe('SearchFilterComponent', () => {
    let component: SearchFilterComponent;
    let fixture: ComponentFixture<SearchFilterComponent>;
    let contentSearchService: ContentSearchService;
    const resourceBundle = {
        'frmelmnts': {
            'lbl': {
                'medium': '',
                'filters': ''
            }
        },
        'messages': {
            'stmsg': {
                'm0007': 'Search for something else',
                'm0006': 'No result'
            },
            'fmsg': {
                'm0077': 'Fetching search result failed',
                'm0051': 'Fetching other courses failed, please try again later...'
            }
        }
    };
    class FakeActivatedRoute {
        queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
        params = of({});
        get queryParams() { return this.queryParamsMock.asObservable(); }
        snapshot = {
            params: { slug: 'ap' },
            data: {
                telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate' }
            }
        };
        public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    }
    configureTestSuite();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchFilterComponent],
            imports: [CoreModule, CommonConsumptionModule, TelemetryModule.forRoot(),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
                SuiModule, HttpClientModule, SharedModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
            providers: [ContentSearchService,
                { provide: ActivatedRoute, useClass: FakeActivatedRoute },
                { provide: ResourceService, useValue: resourceBundle },
                CacheService,
                ConfigService,
                OrgDetailsService,
                CacheService,
                BrowserCacheTtlService,
                TenantService,
                ToasterService,
                ChannelService,
                LayoutService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchFilterComponent);
        component = fixture.componentInstance;
        component.layoutConfiguration = {};
        fixture.detectChanges();
    });

    beforeEach(() => {
        contentSearchService = TestBed.get(ContentSearchService);
        spyOn(contentSearchService, 'fetchFilter').and.returnValue(observableOf(response.filterValue));

    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call selectedGroupOption with board data', () => {
        const contentSearchService = TestBed.get(ContentSearchService);
        const inputData = { 'label': 'Board', 'value': 'board', 'selectedOption': 'AP Board' };
        component.selectedGroupOption(inputData);
        expect(component.selectedBoard).toBe(inputData);
    });
    it('should check for layout option', () => {
        component.isLayoutAvailable();
        expect(component).toBeTruthy();
    });
    it('should call interactEdata', () => {
        const returnData = component.getInteractEdata();
        expect(returnData).toEqual({
            'id': 'apply-filter', 'type': 'click',
            'pageid': 'resource-search', 'extra': { 'filters': { board: [], selectedTab: 'textbook', audience: ['other', 'student', 'teacher'] } }
        });
    });
    it('should update selectedFilters from queryParams', done => {
        component['fetchSelectedFilterOptions']()
            .subscribe(res => {
                expect(res).toBeDefined();
                expect(component['filters']).toBeDefined();

                done()
            }, err => {
                console.error(err);
                done();
            });

    })

    it('should handle filter change event - add new filter', done => {
        component.selectedFilters = {};
        const spy = spyOn<any>(component, 'pushNewFilter').and.callThrough();
        component['handleFilterChange']().subscribe(res => {
            expect(spy).toHaveBeenCalledWith({ type: 'gradeLevel', index: 0 })
            expect(component.selectedFilters['gradeLevel']).toBeDefined();
            expect(res).toBeDefined();
            done();
        })
        component.filterChangeEvent.next({ event: { data: { index: 0 } }, type: 'gradeLevel' });
    })

    it('should handle filter change event - remove existing filter', done => {
        const spy = spyOn<any>(component, 'popFilter').and.callThrough();
        component['selectedFilters'] = { gradeLevel: [0] }
        component['handleFilterChange']().subscribe(res => {
            expect(spy).toHaveBeenCalled()
            expect(component.selectedFilters['gradeLevel']).toBeDefined();
            done();
        })
        component.filterChangeEvent.next({ event: { data: { index: 0 } }, type: 'gradeLevel' });
    })

});
