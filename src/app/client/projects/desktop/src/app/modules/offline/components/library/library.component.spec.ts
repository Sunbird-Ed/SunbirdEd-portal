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
import { LibraryFiltersComponent } from '../library-filters/library-filters.component';
import { SuiModule } from 'ng2-semantic-ui';
import { of, throwError } from 'rxjs';


describe('LibraryComponent', () => {
    let component: LibraryComponent;
    let fixture: ComponentFixture<LibraryComponent>;
    let orgDetailsService, sendOrgDetails;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LibraryComponent,
                LibraryFiltersComponent
            ],
            imports: [
                CommonConsumptionModule,
                TelemetryModule,
                RouterModule.forRoot([]),
                HttpClientModule,
                SuiModule
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
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryComponent);
        component = fixture.componentInstance;
        orgDetailsService = TestBed.get(OrgDetailsService);
        sendOrgDetails = true;
        spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
            if (sendOrgDetails) {
              return of({hashTagId: '123'});
            }
            return throwError({});
          });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
