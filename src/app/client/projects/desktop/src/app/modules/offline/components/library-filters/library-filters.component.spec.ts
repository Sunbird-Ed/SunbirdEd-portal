import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryFiltersComponent } from './library-filters.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';

import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, ConfigService, BrowserCacheTtlService, ToasterService } from '@sunbird/shared';
import { of, throwError } from 'rxjs';
import { CacheService } from 'ng2-cache-service';
import { OrgDetailsService, TenantService } from '@sunbird/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FrameworkService } from 'src/app/modules/core';

describe('LibraryFiltersComponent', () => {
    let component: LibraryFiltersComponent;
    let fixture: ComponentFixture<LibraryFiltersComponent>;
    let orgDetailsService, sendOrgDetails, frameworkService;
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
        },
        languageSelected$: of({}),
        getLanguageChange: () => { },
        getResource: () => ({})
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LibraryFiltersComponent],
            imports: [CommonConsumptionModule, TelemetryModule, SuiModule, RouterModule.forRoot([])],
            providers: [
                { provide: ResourceService, useValue: resourceBundle },
                CacheService,
                ConfigService,
                OrgDetailsService,
                CacheService,
                BrowserCacheTtlService,
                TenantService,
                HttpClient,
                HttpHandler,
                ToasterService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryFiltersComponent);
        component = fixture.componentInstance;
        orgDetailsService = TestBed.get(OrgDetailsService);
        frameworkService = TestBed.get(FrameworkService);
        sendOrgDetails = true;
        spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
            if (sendOrgDetails) {
                return of({ hashTagId: '123' });
            }
            return throwError({});
        });

        spyOn(frameworkService, 'frameworkData$').and.callFake(() => {
            return of([]);
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
