import { of,throwError,Subscription,Subject } from 'rxjs';
import { first,mergeMap,map,catchError,filter } from 'rxjs/operators';
import { ConfigService,ResourceService,Framework,BrowserCacheTtlService,UtilService,LayoutService } from '@sunbird/shared';
import { Component,OnInit,Input,Output,EventEmitter,ChangeDetectorRef,OnChanges,OnDestroy,ViewRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FrameworkService,FormService,PermissionService,UserService,OrgDetailsService } from '@sunbird/core';
import { _ } from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { DataDrivenFilterComponent } from './data-driven-filter.component';

describe('DataDrivenFilterComponent', () => {
    let component: DataDrivenFilterComponent;

    const mockConfigService :Partial<ConfigService> ={};
	const mockResourceService :Partial<ResourceService> ={};
	const mockRouter :Partial<Router> ={};
	const mockActivatedRoute :Partial<ActivatedRoute> ={};
	const mockCacheService :Partial<CacheService> ={
		get: jest.fn(),
	};
	const mockCdr :Partial<ChangeDetectorRef> ={};
	const mockFrameworkService :Partial<FrameworkService> ={
		initialize: jest.fn(),
		frameworkData$: of({
            defaultFramework: {
                code: 'CODE'
            }
        }) as any
	};
	const mockFormService :Partial<FormService> ={};
	const mockUserService :Partial<UserService> ={};
	const mockPermissionService :Partial<PermissionService> ={};
	const mockUtilService :Partial<UtilService> ={};
	const mockBrowserCacheTtlService :Partial<BrowserCacheTtlService> ={};
	const mockOrgDetailsService :Partial<OrgDetailsService> ={};
	const mockLayoutService :Partial<LayoutService> ={};
	const mockCslFrameworkService :Partial<CslFrameworkService> ={
		getAllFwCatName: jest.fn(),
	};

    beforeAll(() => {
        component = new DataDrivenFilterComponent(
            mockConfigService as ConfigService,
			mockResourceService as ResourceService,
			mockRouter as Router,
			mockActivatedRoute as ActivatedRoute,
			mockCacheService as CacheService,
			mockCdr as ChangeDetectorRef,
			mockFrameworkService as FrameworkService,
			mockFormService as FormService,
			mockUserService as UserService,
			mockPermissionService as PermissionService,
			mockUtilService as UtilService,
			mockBrowserCacheTtlService as BrowserCacheTtlService,
			mockOrgDetailsService as OrgDetailsService,
			mockLayoutService as LayoutService,
			mockCslFrameworkService as CslFrameworkService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should call methods on ngoninit',()=>{
		mockResourceService.languageSelected$ = of({
			language: 'en'
		});
		jest.spyOn(component.cslFrameworkService,'getAllFwCatName');
		jest.spyOn(component as any,'setFilterInteractData');
		jest.spyOn(component.dataDrivenFilter,'emit');
		component.ngOnInit();

		expect(component.cslFrameworkService.getAllFwCatName).toHaveBeenCalled();
		expect(component.frameworkService.initialize).toHaveBeenCalled();
		expect(component['setFilterInteractData']).toHaveBeenCalled();
		expect(component.dataDrivenFilter.emit).toHaveBeenCalled();
	})
});