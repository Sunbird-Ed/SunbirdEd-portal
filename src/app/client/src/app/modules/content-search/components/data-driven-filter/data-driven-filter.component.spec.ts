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
	const mockCdr :Partial<ChangeDetectorRef> ={
		detectChanges: jest.fn(),
	};
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
	const mockOrgDetailsService :Partial<OrgDetailsService> ={
		searchOrg: jest.fn(),
		setOrg: jest.fn(),
	};
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

	it('should hard refresh filter', () => {
    component.refresh = true;
    component['hardRefreshFilter']();

    expect(component.refresh).toBeTruthy();
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  });

  it('should call org search and return data', () => {
    jest.spyOn(mockOrgDetailsService, 'searchOrg' as any).mockReturnValue(of({ content: ['org1', 'org2'] }));

    component.getOrgSearch().subscribe(data => {
      expect(data).toEqual(['org1', 'org2']);
    });
  });

  it('should unsubscribe from subscriptions on destroy', () => {
    const mockResourceDataSubscription = {
      unsubscribe: jest.fn(),
    };
    component.resourceDataSubscription = mockResourceDataSubscription as any;
    component.unsubscribe = {
        next: jest.fn(),
        complete: jest.fn()
      } as any;

    component.ngOnDestroy();

    expect(mockResourceDataSubscription.unsubscribe).toHaveBeenCalled();
  });

	it('should handle topic change and detect changes', () => {
    component.formInputData = {};
    const topicsSelected = [{ name: 'Topic1' }, { name: 'Topic2' }];
    component.handleTopicChange(topicsSelected);

    expect(component.formInputData['topic']).toEqual(['Topic1', 'Topic2']);
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  });

  it('should update channel input label and call org details service', () => {
    component.formFieldProperties = [{ code: 'channel', range: [{ identifier: 'id1' }, { identifier: 'id2' }] }];

    const data = ['id1', 'id2'];
    component['modelChange'](data);

    expect(component.channelInputLabel).toEqual([{ identifier: 'id1' }, { identifier: 'id2' }]);
    expect(mockOrgDetailsService.setOrg).toHaveBeenCalledWith([{ identifier: 'id1' }, { identifier: 'id2' }]);
  });


});