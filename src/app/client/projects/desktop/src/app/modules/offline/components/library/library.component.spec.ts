import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryComponent } from './library.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import { ConfigService } from '@sunbird/shared';
import { TenantService, OrgDetailsService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { BrowserCacheTtlService, UtilService, ToasterService } from '@sunbird/shared';
import { ResourceService } from 'src/app/modules/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { of, throwError } from 'rxjs';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('LibraryComponent', () => {
    let component: LibraryComponent;
    let fixture: ComponentFixture<LibraryComponent>;
    let orgDetailsService, sendOrgDetails;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LibraryComponent
            ],
            imports: [
                CommonConsumptionModule,
                TelemetryModule,
                RouterModule.forRoot([]),
                HttpClientModule,
                SuiModule,
                SlickModule,
                FormsModule
            ],
            providers: [
                ConfigService,
                TenantService,
                CacheService,
                BrowserCacheTtlService,
                UtilService,
                ToasterService,
                ResourceService,
                OrgDetailsService],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryComponent);
        component = fixture.componentInstance;
        orgDetailsService = TestBed.get(OrgDetailsService);
        sendOrgDetails = true;
        spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
            if (sendOrgDetails) {
                return of({ hashTagId: '123' });
            }
            return throwError({});
        });

        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
