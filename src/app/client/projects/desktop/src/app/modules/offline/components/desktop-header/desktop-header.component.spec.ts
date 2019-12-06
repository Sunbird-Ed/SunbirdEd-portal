import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopHeaderComponent } from './desktop-header.component';
import { NetworkStatusComponent } from '../network-status/network-status.component';
import { FormService, TenantService, CoreModule, OrgDetailsService } from '@sunbird/core';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfigService, ResourceService, BrowserCacheTtlService, SharedModule } from '@sunbird/shared';
import { ElectronDialogService } from '../../services';
import { TelemetryService } from '@sunbird/telemetry';
import { response } from './desktop-header.component.spec.data';

describe('DesktopHeaderComponent', () => {
    let component: DesktopHeaderComponent;
    let fixture: ComponentFixture<DesktopHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DesktopHeaderComponent, NetworkStatusComponent],
            imports: [SharedModule.forRoot(), CommonConsumptionModule, FormsModule, RouterModule.forRoot([]), CoreModule],
            providers: [ConfigService, ResourceService, ElectronDialogService, TenantService, FormService, OrgDetailsService,
                BrowserCacheTtlService, TelemetryService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DesktopHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Call ngOnInit', () => {
        const orgDetailsService = TestBed.get(OrgDetailsService);
        orgDetailsService._orgDetails$.next({ err: null, orgDetails: response.orgData.orgDetails });
        spyOn(component, 'getLanguage');
        spyOn(component, 'setInteractData');
        spyOn(component, 'getTenantInfo');
        component.ngOnInit();
        expect(component.getLanguage).toHaveBeenCalledWith(response.orgData.orgDetails.hashTagId);
        expect(component.setInteractData).toHaveBeenCalled();
        expect(component.getTenantInfo).toHaveBeenCalled();
    });

    it('Call getTenantInfo', () => {
        const tenantService = TestBed.get(TenantService);
        const tenantData = { 'appLogo': '/appLogo.png', 'favicon': '/favicon.ico', 'logo': '/logo.png', 'titleName': 'SUNBIRD' };
        tenantService._tenantData$.next({ err: null, tenantData: tenantData });
        component.getTenantInfo();
        component.navigateToHome();
        expect(component.tenantInfo.logo).toEqual(tenantData.logo);
        expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    });

    it('Call clearSearchQuery', () => {
        component.clearSearchQuery();
        expect(component.queryParam).toEqual({});
    });

    it('Call handleImport', () => {
        const electronDialogService = TestBed.get(ElectronDialogService);
        spyOn(electronDialogService, 'showContentImportDialog');
        component.handleImport();
        expect(electronDialogService.showContentImportDialog).toHaveBeenCalled();
    });

    it('Call handleImport', () => {
        spyOn(component, 'routeToOffline');
        component.onEnter('test');
        component.routeToOffline();
        expect(component.queryParam.key).toEqual('test');
        expect(component.routeToOffline).toHaveBeenCalled();
    });
});
