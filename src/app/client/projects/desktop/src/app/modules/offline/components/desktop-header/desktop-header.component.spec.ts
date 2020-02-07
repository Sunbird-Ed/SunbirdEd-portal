import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopHeaderComponent } from './desktop-header.component';
import { FormService, TenantService, CoreModule, OrgDetailsService } from '@sunbird/core';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConfigService, ResourceService, BrowserCacheTtlService, SharedModule, UtilService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { response } from './desktop-header.component.spec.data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DesktopHeaderComponent', () => {
    let component: DesktopHeaderComponent;
    let fixture: ComponentFixture<DesktopHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DesktopHeaderComponent],
            imports: [SharedModule.forRoot(), CommonConsumptionModule, FormsModule, RouterModule.forRoot([]), CoreModule],
            providers: [ConfigService, ResourceService, TenantService, FormService, OrgDetailsService,
                BrowserCacheTtlService, TelemetryService, UtilService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DesktopHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Call ngOnInit', () => {
        const orgDetailsService = TestBed.get(OrgDetailsService);
        const utilService = TestBed.get(UtilService);
        orgDetailsService._orgDetails$.next({ err: null, orgDetails: response.orgData.orgDetails });
        utilService.hideHeaderTabs.emit(true);
        utilService.searchKeyword.emit('test');
        spyOn(component, 'getLanguage');
        spyOn(component, 'getTenantInfo');
        component.ngOnInit();
        expect(component.getLanguage).toHaveBeenCalledWith(response.orgData.orgDetails.hashTagId);
        expect(component.getTenantInfo).toHaveBeenCalled();
        expect(component.hideHeader).toBe(true);
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

    it('Call handleImportContentDialog when click on load content', () => {
        component.handleImportContentDialog();
        expect(component.showLoadContentModal).toBeTruthy();
    });

    it('Call closeLoadContentModal when modal closes', () => {
        component.showLoadContentModal = true;
        component.handleImportContentDialog();
        expect(component.showLoadContentModal).toBeFalsy();
    });

    it('should call onEnter', () => {
        const router = TestBed.get(Router);
        const queryParams = {
            key: 'test'
        };
        spyOn(router, 'navigate');
        component.onEnter('test');
        expect(component.queryParam).toEqual(queryParams);
        expect(router.navigate).toHaveBeenCalledWith(['search'], { queryParams });
    });
});
