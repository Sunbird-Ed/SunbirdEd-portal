import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterComponent } from './search-filter.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, ConfigService, BrowserCacheTtlService, ToasterService, SharedModule } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { OrgDetailsService, TenantService, ChannelService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { response } from './search-filter.component.spec.data';
import { BehaviorSubject, throwError, of} from 'rxjs';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';

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
          params: {slug: 'ap'},
          data: {
            telemetry: { env: 'resource', pageid: 'resource-search', type: 'view', subtype: 'paginate'}
          }
        };
        public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
      }
    configureTestSuite();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchFilterComponent],
            imports: [CoreModule, CommonConsumptionModule, TelemetryModule.forRoot(),
                SuiModule, HttpClientModule, SharedModule, RouterModule.forRoot([])],
            providers: [
                { provide: ActivatedRoute, useClass: FakeActivatedRoute },
                { provide: ResourceService, useValue: resourceBundle },
                CacheService,
                ConfigService,
                OrgDetailsService,
                CacheService,
                BrowserCacheTtlService,
                TenantService,
                ToasterService,
                ChannelService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
