import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopHeaderComponent } from './desktop-header.component';
import { NetworkStatusComponent } from '../network-status/network-status.component';
import { SharedModule } from '@sunbird/shared';
import { FormService, TenantService, CoreModule } from '@sunbird/core';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { ElectronDialogService } from '../../services';
import { BrowserCacheTtlService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';

describe('DesktopHeaderComponent', () => {
    let component: DesktopHeaderComponent;
    let fixture: ComponentFixture<DesktopHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DesktopHeaderComponent, NetworkStatusComponent],
            imports: [SharedModule, CommonConsumptionModule, FormsModule, RouterModule.forRoot([]), CoreModule],
            providers: [ConfigService, ResourceService, ElectronDialogService, TenantService, FormService,
                BrowserCacheTtlService, TelemetryService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DesktopHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
