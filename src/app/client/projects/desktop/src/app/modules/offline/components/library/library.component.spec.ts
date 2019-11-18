import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryComponent } from './library.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import { ConfigService } from '@sunbird/shared';
import { TenantService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { BrowserCacheTtlService, UtilService, ToasterService } from '@sunbird/shared';
import { ResourceService } from 'src/app/modules/shared';

describe('LibraryComponent', () => {
    let component: LibraryComponent;
    let fixture: ComponentFixture<LibraryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LibraryComponent],
            imports: [CommonConsumptionModule, TelemetryModule, RouterModule.forRoot([]),
                HttpClientModule],
            providers: [ConfigService, TenantService, CacheService, BrowserCacheTtlService, UtilService, ToasterService, ResourceService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
