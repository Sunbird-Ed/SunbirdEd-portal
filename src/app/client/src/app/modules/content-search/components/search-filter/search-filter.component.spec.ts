import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterComponent } from './search-filter.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, ConfigService, BrowserCacheTtlService, ToasterService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { OrgDetailsService, TenantService, ChannelService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { response } from './search-filter.component.spec.data';
import { of as observableOf } from 'rxjs';


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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchFilterComponent],
            imports: [CommonConsumptionModule, TelemetryModule.forRoot(), SuiModule, HttpClientModule, RouterModule.forRoot([])],
            providers: [
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
