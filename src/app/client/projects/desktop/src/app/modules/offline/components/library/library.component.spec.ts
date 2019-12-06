import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import {
    ResourceService, ToasterService, BrowserCacheTtlService, NavigationHelperService,
    ConfigService, UtilService
} from '@sunbird/shared';
import { TenantService, OrgDetailsService } from '@sunbird/core';
import { HttpClientModule } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { SuiModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { response } from './library.component.spec.data';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, throwError } from 'rxjs';

describe('LibraryComponent', () => {
    let component: LibraryComponent;
    let fixture: ComponentFixture<LibraryComponent>;
    const resourceBundle = {
        messages: {
            fmsg: {
                m0004: 'Fetching data failed, please try again later...'
            }
        }
    };
    class FakeActivatedRoute {
        snapshot = {
            data: {
                softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
                telemetry: { env: 'library', pageid: 'library', type: 'view', subtype: 'paginate' }
            }
        };
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LibraryComponent
            ],
            imports: [
                CommonConsumptionModule,
                TelemetryModule.forRoot(),
                RouterModule.forRoot([]),
                HttpClientModule,
                SuiModule,
                SlickModule,
                FormsModule
            ],
            providers: [
                { provide: ActivatedRoute, useClass: FakeActivatedRoute },
                NavigationHelperService,
                ConfigService,
                TenantService,
                CacheService,
                BrowserCacheTtlService,
                UtilService,
                ToasterService,
                { provide: ResourceService, useValue: resourceBundle },
                OrgDetailsService],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should call ngOnInit', () => {
        spyOn(component, 'getSelectedFilters');
        component.ngOnInit();
        expect(component.getSelectedFilters).toHaveBeenCalled();
    });

    it('should call getSelectedFilters', () => {
        component.getSelectedFilters();
        expect(component.selectedFilters).toBeDefined();
    });

    it('should unsubscribe to userData observable', () => {
        spyOn(component.unsubscribe$, 'next');
        spyOn(component.unsubscribe$, 'complete');
        component.ngOnDestroy();
        expect(component.unsubscribe$.next).toHaveBeenCalled();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
    });

    it('should call onFilterChange', () => {
        spyOn(component, 'resetSections');
        spyOn(component, 'fetchContents');
        component.onFilterChange(response.onFilterChangeEvent);
        expect(component.showLoader).toBeTruthy();
        expect(component.dataDrivenFilters).toEqual(response.onFilterChangeEvent.filters);
        expect(component.hashTagId).toEqual(response.onFilterChangeEvent.channelId);
    });

    it('should call resetSections', () => {
        component.resetSections();
        expect(component.carouselMasterData).toEqual([]);
        expect(component.pageSections).toEqual([]);
    });

    it('should call constructSearchRequest with true', () => {
        component.hashTagId = '01285019302823526477';
        const result = component.constructSearchRequest(true);
        expect(result).toEqual(response.constructSearchRequestWithFilter);
    });

    it('should call constructSearchRequest with false', () => {
        component.hashTagId = '01285019302823526477';
        const result = component.constructSearchRequest(false);
        expect(result).toEqual(response.constructSearchRequestWithOutFilter);
    });

    it('should call fetchContents and return value', () => {
        spyOn(component, 'searchContent').and.returnValue(observableOf(response.searchResult));
        component.fetchContents();
        expect(component.showLoader).toBeFalsy();
    });

    it('should call fetchContents and return undefined', () => {
        spyOn(component, 'searchContent').and.returnValue(observableOf(undefined));
        const toasterService = TestBed.get(ToasterService);
        spyOn(toasterService, 'error').and.returnValue(throwError(resourceBundle.messages.fmsg.m0004));
        component.fetchContents();
        expect(component.showLoader).toBeFalsy();
        expect(component.carouselMasterData).toEqual([]);
        expect(component.pageSections).toEqual([]);
        expect(toasterService.error).toHaveBeenCalled();
    });
});
