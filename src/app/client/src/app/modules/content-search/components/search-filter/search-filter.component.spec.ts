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
import { BehaviorSubject, throwError, of } from 'rxjs';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentSearchService } from './../../services';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';


describe('SearchFilterComponent', () => {
    let component: SearchFilterComponent;
    let fixture: ComponentFixture<SearchFilterComponent>;
    const resourceBundle = {
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
                SuiModule, HttpClientModule, SharedModule.forRoot(), RouterModule.forRoot([]),SharedModule.forRoot()],
            providers: [ ContentSearchService,
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
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call selectedGroupOption with board data', () => {
        const contentSearchService = TestBed.get(ContentSearchService);
        spyOn(contentSearchService, 'fetchFilter').and.returnValue(observableOf(response.filterValue));
        const inputData = { 'label': 'Board', 'value': 'board', 'selectedOption': 'AP Board' };
        component.selectedGroupOption(inputData);
        expect(component.type).toBe('Board');
        expect(component.selectedBoard).toBe(inputData);
        expect(component.selectedChannel).toBeUndefined();
    });
    xit('should call selectedGroupOption with publisher data', () => {
        const inputData = { 'label': 'Publisher', 'value': 'channel', 'selectedOption': 'NCERT' };
        component.selectedGroupOption(inputData);
        expect(component.type).toBe('Publisher');
        expect(component.selectedChannel).toBe(inputData);
    });
    it('should check for layout option', () => {
        component.isLayoutAvailable();
        expect(component).toBeTruthy();
    });
    it('should call getBoardInteractEdata', () => {
        const returnData = component.getBoardInteractEdata();
        expect(returnData).toEqual({ 'id': 'apply-filter', 'type': 'click',
        'pageid': 'resource-search', 'extra': { 'filters': { 'medium': [], 'gradeLevel': [], 'board': [], 'selectedTab': 'textbook' } } });
    });
});
