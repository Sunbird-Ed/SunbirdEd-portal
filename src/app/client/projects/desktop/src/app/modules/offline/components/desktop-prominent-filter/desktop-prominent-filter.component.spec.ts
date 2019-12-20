import { formatedFilterDetails, frameworkDetails } from './desktop-prominent-filter.component.spec.data';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DesktopProminentFilterComponent } from './desktop-prominent-filter.component';
import { CoreModule, FrameworkService, PublicDataService, FormService, OrgDetailsService } from '@sunbird/core';
import { SharedModule, ConfigService, ResourceService, BrowserCacheTtlService, UtilService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';

import { of, throwError } from 'rxjs';
describe('DesktopProminentFilterComponent', () => {
    let component: DesktopProminentFilterComponent;
    let fixture: ComponentFixture<DesktopProminentFilterComponent>;
    let frameworkService, resourceService, utilService, publicDataService, formService, orgDetailsService;
    let mockHashTagId: string, mockFrameworkInput: string;
    let mockFrameworkCategories: Array<any> = [];
    let mockFormFields: Array<any> = [];
    let makeChannelReadSuc, makeFrameworkReadSuc, makeFormReadSuc = true;
    const resourceBundle = {
        messages: {
            fmsg: {
                m0004: 'Fetching data failed, please try again later...'
            }
        }
    };

    const fakeActivatedRoute = {
        queryParams: of({ key: 'test' })
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DesktopProminentFilterComponent],
            imports: [
                CoreModule,
                SharedModule,
                TelemetryModule,
                RouterModule.forRoot([]),
                SuiModule,
                TelemetryModule.forRoot()],
            providers: [
                ResourceService,
                BrowserCacheTtlService,
                ConfigService,
                UtilService,
                FrameworkService,
                PublicDataService,
                FormService,
                OrgDetailsService,
                { provide: ActivatedRoute, useValue: fakeActivatedRoute },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DesktopProminentFilterComponent);
        component = fixture.componentInstance;
        resourceService = TestBed.get(ResourceService);
        frameworkService = TestBed.get(FrameworkService);
        utilService = TestBed.get(UtilService);
        fixture.detectChanges();
    });

    it('should call ngOnInit', () => {
        spyOn(frameworkService, 'initialize').and.returnValue([]);
        mockHashTagId = undefined;
        mockFrameworkInput = undefined;
        mockFrameworkCategories = [];
        mockFormFields = [];
        makeChannelReadSuc = true;
        makeFrameworkReadSuc = true;
        makeFormReadSuc = true;

        publicDataService = TestBed.get(PublicDataService);
        formService = TestBed.get(FormService);
        orgDetailsService = TestBed.get(OrgDetailsService);

        spyOn(publicDataService, 'get').and.callFake((options) => {
            if (options.url === 'channel/v1/read/' + mockHashTagId && makeChannelReadSuc) {
                return of({ result: { channel: { defaultFramework: mockFrameworkInput } } });
            } else if (options.url === 'framework/v1/read/' + mockFrameworkInput && makeFrameworkReadSuc) {
                return of({ result: { framework: { code: mockFrameworkInput, categories: mockFrameworkCategories } } });
            }
            return throwError({});
        });
        spyOn(publicDataService, 'post').and.callFake((options) => {
            if (makeFormReadSuc) {
                return of({ result: { form: { data: { fields: mockFormFields } } } });
            }
            return throwError({});
        });


        resourceService._languageSelected.next({ value: 'en', label: 'English', dir: 'ltr' });
        spyOn(component, 'getFormatedFilterDetails').and.returnValue(of(formatedFilterDetails));
        spyOn(component.prominentFilter, 'emit');
        component.ngOnInit();
        expect(frameworkService.initialize).toHaveBeenCalled();
        expect(component.formFieldProperties).toEqual(formatedFilterDetails);
        expect(component.prominentFilter.emit).toHaveBeenCalledWith(formatedFilterDetails);
    });

    it('should change form field Properties', () => {
        component.formFieldProperties = formatedFilterDetails;
        resourceService._languageSelected.next({ value: 'hi', label: 'Hindi', dir: 'ltr' });
        spyOn(utilService, 'convertSelectedOption');
        component.ngOnInit();
        expect(component.filtersDetails).toEqual(formatedFilterDetails);
    });

    it('should reset filters when ignoreQuery input present', () => {
        component.formInputData = formatedFilterDetails;
        component.ignoreQuery = ['key'];
        spyOn(component.filterChange, 'emit');
        spyOn<any>(component, 'hardRefreshFilter');
        spyOn<any>(component, 'setFilterInteractData');
        component.resetFilters();

        expect(component.filterChange.emit).toHaveBeenCalled();
        expect(component['hardRefreshFilter']).toHaveBeenCalled();
        expect(component.formInputData).toEqual({});
        expect(component['setFilterInteractData']).toHaveBeenCalled();

    });

    it('should reset filters', () => {
        component.ignoreQuery = [];
        spyOn(component.filterChange, 'emit');
        spyOn<any>(component, 'hardRefreshFilter');
        spyOn<any>(component, 'setFilterInteractData');
        component.resetFilters();

        expect(component.filterChange.emit).toHaveBeenCalled();
        expect(component['hardRefreshFilter']).toHaveBeenCalled();
        expect(component.formInputData).toEqual({});
        expect(component['setFilterInteractData']).toHaveBeenCalled();

    });

    it('should set formInputData', () => {
        component.selectedValue({}, 'board');
        expect(component.formInputData['board']).toEqual({});
    });

    it('should apply Filters', () => {
        component.formInputData = { key: 'test' };
        component.formFieldProperties = formatedFilterDetails;
        component.selectedLanguage = 'en';
        component.queryParams = { key: 'test' };
        spyOn<any>(component, 'setFilterInteractData');
        spyOn(utilService, 'convertSelectedOption').and.returnValue({ key: 'test' });

        component.applyFilters();

        expect(utilService.convertSelectedOption).toHaveBeenCalledWith({ key: 'test' }, formatedFilterDetails, 'en', 'en');
        expect(component['setFilterInteractData']).toHaveBeenCalled();
        expect(component.isFiltered).toBe(true);
    });

    it('should emit filterChange Event', () => {
        component.formInputData = { channel: '1d121d3343434fs' };
        component.formFieldProperties = formatedFilterDetails;
        component.selectedLanguage = 'en';

        spyOn<any>(component, 'setFilterInteractData');
        spyOn(utilService, 'convertSelectedOption').and.returnValue({ channel: '1d121d3343434fs' });
        spyOn<any>(component, 'populateChannelData');

        component.applyFilters();

        expect(utilService.convertSelectedOption).toHaveBeenCalledWith({ channel: '1d121d3343434fs' }, formatedFilterDetails, 'en', 'en');
        expect(component['setFilterInteractData']).toHaveBeenCalled();
        expect(component.isFiltered).toBe(false);
        expect(component['populateChannelData']).toHaveBeenCalled();
    });

    it('should set InteractData', fakeAsync(() => {
        component.formFieldProperties = formatedFilterDetails;
        component.pageId = 'explore-page';
        component['setFilterInteractData']();
        tick(500);
        expect(component.applyFilterInteractEdata).toEqual({
            id: 'apply-filter',
            type: 'click',
            pageid: 'explore-page',
            extra: { filters: {} }
        });
        expect(component.resetFilterInteractEdata).toEqual({
            id: 'reset-filter',
            type: 'click',
            pageid: 'explore-page',
            extra: { filters: {} }
        });
    }));

    it('fetchFrameWorkDetails', () => {
        frameworkService._frameworkData$.next(frameworkDetails);
        const returnValue = component['fetchFrameWorkDetails']();
        returnValue.subscribe((data) => {
            expect(Object.keys(data).length).toBe(2);
        });
    });

    it('should return form configurations', () => {
        const formServiceInputParams = {
            contentType: 'explore',
            formAction: 'search',
            formType: 'content',
            framework: undefined
        };
        component.hashTagId = '5s3d23hgsd232';
        const formConfig = spyOn(formService, 'getFormConfig').and.returnValue(of({}));
        component['getFormDetails']();
        expect(formConfig).toBeTruthy();
    });

    it('hardRefreshFilter', () => {
        const spy = spyOn((component as any).cdr, 'detectChanges');
        component['hardRefreshFilter']();
        expect(component.refresh).toBe(true);
        expect(spy).toHaveBeenCalled();
    });

    it('should return org details', () => {
        spyOn(orgDetailsService, 'searchOrg').and.returnValue(of({ data: { content: 'some content' } }));
        const returnValue = component['getOrgSearch']();
        expect(returnValue).toBeDefined();
        expect(returnValue).toBeTruthy();
    });

    xit('should return channel data', () => {
        component.formFieldProperties = formatedFilterDetails;
        const returnValue = component['populateChannelData']({ code: 'channel' });
        expect(returnValue).toEqual([]);
    });

    it('should handle error for orgDetailsSearch', () => {
        spyOn(orgDetailsService, 'searchOrg').and.returnValue(throwError(''));
        const returnValue = component['getOrgSearch']();
        expect(returnValue).toBeDefined();
        expect(returnValue).toBeTruthy();
    });

    it('should unsubscribe subject', () => {
        spyOn(component.unsubscribe$, 'next');
        spyOn(component.unsubscribe$, 'complete');
        component.ngOnDestroy();
        expect(component.unsubscribe$.next).toHaveBeenCalled();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
    });
});
