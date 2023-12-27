import { metaData } from './../../../shared/components/alert-modal/alert-modal.component.spec.data';
import { PaginationService,ResourceService,ConfigService,ToasterService,UtilService,BrowserCacheTtlService,NavigationHelperService,IPagination,LayoutService,COLUMN_TYPE,OfflineCardService } from '@sunbird/shared';
import { SearchService,PlayerService,CoursesService,UserService,OrgDetailsService,SchemaService,KendraService,ObservationUtilService } from '@sunbird/core';
import { Subject, of } from 'rxjs';
import { Component,OnInit,OnDestroy,ChangeDetectorRef,AfterViewInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { _ } from 'lodash-es';
import { IInteractEventEdata,IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { takeUntil } from 'rxjs/operators';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { ContentManagerService } from '../../../public/module/offline/services/content-manager/content-manager.service';
import { Location } from '@angular/common';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { ObservationListingComponent } from './observation-listing.component';
import { Response } from './observation-listing.component.spec.data';

describe('ObservationListingComponent', () => {
    let component: ObservationListingComponent;

    const mockSearchService :Partial<SearchService> ={};
	const mockRouter :Partial<Router> ={
		navigate: jest.fn(),
		url: 'mock-url',
	};
	const mockActivatedRoute :Partial<ActivatedRoute> ={
		snapshot: {
			data: {
			  telemetry: {
				env: 'mock-env', pageid: 'mock-page-id', type: 'mock-type',subtype: 'mock-sub-type',uuid: '9545879'
			  }
			},
		} as any,
	};
	const mockPaginationService :Partial<PaginationService> ={
		getPager: jest.fn(),
	};
	const mockResourceService :Partial<ResourceService> ={};
	const mockToasterService :Partial<ToasterService> ={};
	const mockChangeDetectorRef :Partial<ChangeDetectorRef> ={};
	const mockConfigService :Partial<ConfigService> ={
		appConfig: {
			SEARCH: {
			  PAGE_LIMIT: 10,
			}
		  },
	};
	const mockUtilService :Partial<UtilService> ={};
	const mockCoursesService :Partial<CoursesService> ={};
	const mockPlayerService :Partial<PlayerService> ={};
	const mockUserService :Partial<UserService> ={
		slug: 'mock-slug',
	};
	const mockCacheService :Partial<CacheService> ={};
	const mockBrowserCacheTtlService :Partial<BrowserCacheTtlService> ={};
	const mockOrgDetailsService :Partial<OrgDetailsService> ={};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={
		getPageLoadTime: jest.fn(),
	};
	const mockLayoutService :Partial<LayoutService> ={
		initlayoutConfig: jest.fn(),
		switchableLayout: jest.fn(),
		redoLayoutCSS: jest.fn(),
	};
	const mockSchemaService :Partial<SchemaService> ={};
	const mockContentManagerService :Partial<ContentManagerService> ={};
	const mockTelemetryService :Partial<TelemetryService> ={};
	const mockOfflineCardService :Partial<OfflineCardService> ={};
	const mockKendraService :Partial<KendraService> ={
		post: jest.fn().mockReturnValue(of({ result: { count: 10, data:{} } })),

	};
	const mockConfig :Partial<ConfigService> ={};
	const mockObservationUtil :Partial<ObservationUtilService> ={
		getProfileDataList: jest.fn().mockResolvedValue({ result: 'mock-result' }),
		getProfileInfo: jest.fn(),
		getAlertMetaData: jest.fn(),
	};
	const mockLocation :Partial<Location> ={};
	const mockCslFrameworkService :Partial<CslFrameworkService> ={
		transformDataForCC: jest.fn(),
	};

    beforeAll(() => {
        component = new ObservationListingComponent(
            mockSearchService as SearchService,
			mockRouter as Router,
			mockActivatedRoute as ActivatedRoute,
			mockPaginationService as PaginationService,
			mockResourceService as ResourceService,
			mockToasterService as ToasterService,
			mockChangeDetectorRef as ChangeDetectorRef,
			mockConfigService as ConfigService,
			mockUtilService as UtilService,
			mockCoursesService as CoursesService,
			mockPlayerService as PlayerService,
			mockUserService as UserService,
			mockCacheService as CacheService,
			mockBrowserCacheTtlService as BrowserCacheTtlService,
			mockOrgDetailsService as OrgDetailsService,
			mockNavigationHelperService as NavigationHelperService,
			mockLayoutService as LayoutService,
			mockSchemaService as SchemaService,
			mockContentManagerService as ContentManagerService,
			mockTelemetryService as TelemetryService,
			mockOfflineCardService as OfflineCardService,
			mockKendraService as KendraService,
			mockConfig as ConfigService,
			mockObservationUtil as ObservationUtilService,
			mockLocation as Location,
			mockCslFrameworkService as CslFrameworkService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

	afterEach(() => {
		component.inViewLogs = []; 
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should add entries to inViewLogs and update telemetryImpression', () => {
		const mockEvent = {
		  inview: [
			{ data: { metaData: { identifier: '1', contentType: 'video' } }, id: 1 },
			{ data: { metaData: { identifier: '2' } }, id: 2 },
		  ],
		};
	    component.telemetryImpression=Response.mockTelemetryImpression;
		component.inView(mockEvent);
	
		expect(component.inViewLogs.length).toBe(2);
		expect(component.inViewLogs[0]).toEqual({
		  objid: '1',
		  objtype: 'video',
		  index: 1,
		});
		expect(component.inViewLogs[1]).toEqual({
		  objid: '2',
		  objtype: 'content',
		  index: 2,
		});
		expect(component.telemetryImpression.edata.visits).toEqual(component.inViewLogs);
		expect(component.telemetryImpression.edata.subtype).toBe('pageexit');
	});

	it('should call playcontent component',()=>{
		const mockEvent ={ data:{programId:'mock-program-id',
		    solutionId: 'mock-solution-id',
		    _id: 'mock-id',
		    name: 'mock-name',
			subject: ['subject1','subject2'],
			entityType: 'mock-entity'}};
		const data = mockEvent.data;
		component.playContent(mockEvent)
		expect(component.queryParam).toEqual( {
			programId: data.programId,
			solutionId: data.solutionId,
			observationId: data._id,
			solutionName: data.name,
			programName: data.subject[0],
			entityType:data.entityType
		})
		expect(component.router.navigate).toHaveBeenCalledWith(['observation/details'],{
			queryParams: component.queryParam,
		});
	});
    
	it('should call setTelemetryData',()=>{
		const mockTelemetryData =  {"context": {"env": "mock-env"}, 
		"edata": {"duration": 1, "pageid": "mock-page-id", 
		"subtype": "pageexit", "type": "mock-Type", 
		"uri": "/library/mock", 
		"visits": [{"index": 1, "objid": "1", "objtype": "video"}, 
		{"index": 2, "objid": "2", "objtype": "content"}]}}
		component['setTelemetryData']

		expect(component.inViewLogs).toEqual([]);
		expect(component.telemetryImpression).toEqual(mockTelemetryData);
		expect(component.cardIntractEdata).toBe(undefined);
	});

	it('should call ngAfterViewInit',()=>{
       component.ngAfterViewInit();

	   setTimeout(() => {
		  expect(component['setTelemetryData']).toHaveBeenCalled();
		  expect(component.inView).toHaveBeenCalledWith({ inview: [] });
	   });
	});

	describe('ngOndestroy',()=>{
		it('should destroy observation', () => {
			component.unsubscribe$ = {
				next: jest.fn(),
				complete: jest.fn()
			} as any;
			component.ngOnDestroy();
			expect(component.unsubscribe$.next).toHaveBeenCalled();
			expect(component.unsubscribe$.complete).toHaveBeenCalled();
		});
	});

	xdescribe('initLayout',()=>{
		it('should initialize layout configuration and call redoLayout', () => {
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
			jest.spyOn(component,'redoLayout');
			component.initLayout();
			expect(mockLayoutService.initlayoutConfig).toHaveBeenCalled();
			expect(mockLayoutService.switchableLayout).toHaveBeenCalled();
			expect(component.redoLayout).toHaveBeenCalled();
		});

		it('should handle switchableLayout observable with non-null layout configuration', () => {
			const layoutConfig = { layout: 'mockLayoutConfig'};
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({ layout: 'mockLayoutConfig' }));
		    jest.spyOn(component,'redoLayout');
			component.initLayout();
			expect(component.layoutConfiguration).toBe(undefined);
		});
    });

	describe('redoLayout',()=>{
		it('should set layout configurations when layoutConfiguration is not null', () => {
			component.layoutConfiguration = { layout: 'mockLayoutConfig' };
			component.redoLayout();
	
			expect(component.layoutService.redoLayoutCSS).toHaveBeenCalledWith(0, component.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
			expect(component.layoutService.redoLayoutCSS).toHaveBeenCalledWith(1, component.layoutConfiguration, COLUMN_TYPE.threeToNine, true);
		});
		
		it('should set full layout configurations when layoutConfiguration is null', () => {
			component.layoutConfiguration = null;
			component.redoLayout();
		
			expect(component.layoutService.redoLayoutCSS).toHaveBeenCalledWith(0, null, COLUMN_TYPE.fullLayout);
			expect(component.layoutService.redoLayoutCSS).toHaveBeenCalledWith(1, null, COLUMN_TYPE.fullLayout);
		});
	});
    
	describe('setFormat',()=>{
		it('should set the contentList and update showLoader', () => {
			const mockValue = [
			{
				name: 'mockobservation',
				solutionId: '1',
				programName: 'mock-program',
				entityType: 'mockEntityType',
				programId: '123',
				language: 'mock-language',
				creator: 'mock-name',
				_id: 'mock123',
			},
			];
		
			component.setFormat(mockValue);
		
			expect(component.showLoader).toBe(false);
			expect(component.contentList.length).toBe(mockValue.length);
		
			expect(component.contentList[0]).toEqual({
			name: 'Mockobservation',
			contentType: 'Observation',
			metaData: { identifier: '1' },
			entityType: 'mockEntityType',
			identifier: '1',
			solutionId: '1',
			programId: '123',
			medium: 'mock-language',
			organization: 'mock-name',
			_id: 'mock123',
			subject: ['mock-program'],
			gradeLevel: ['mock-name'],
			});
		});
		
		it('should handle empty data', () => {
			const emptyData = [];
			component.setFormat(emptyData);
		
			expect(component.showLoader).toBe(false);
			expect(component.contentList.length).toBe(0);
		});
    });
    
    it('should call back method',()=>{
		component['location'] = {
			back: jest.fn()
		} as any;
		component.back();
		expect(component['location'].back).toHaveBeenCalled();
	});
    
	// describe('ngonInit()',()=>{
	//    const metaData = {type: '',size: '',isClosed: false,
	//    content: {title: '',body: {type: '',data: '',},},
	//    footer: {className: '',buttons: [],},
	//    }
    //    it('calls the functions and initializes the values', async ()=>{
	// 	  jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
	// 	  jest.spyOn(component,'initLayout');
	// 	  jest.spyOn(component['observationUtil'],'getAlertMetaData');
	// 	  await component.ngOnInit();
	// 	  expect(component.initLayout).toHaveBeenCalled();
	// 	  expect(component.cslFrameworkService.transformDataForCC).toHaveBeenCalled();
	//    });

	//    it('should get values from getProfileInfo and set metadata',async()=>{
	// 	  jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
	// 	  jest.spyOn(component,'initLayout');
    //       component.showEditUserDetailsPopup = false;
	// 	  await component.ngOnInit();
	// 	  expect(component['observationUtil'].getProfileInfo).toHaveBeenCalled();
	//    });

    //    it('should get values from getProfileInfo and set metadata',async()=>{
	// 	  jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
	// 	  jest.spyOn(component,'initLayout');
    //       component.showEditUserDetailsPopup = false;
	// 	  await component.ngOnInit();
	// 	  expect(component['observationUtil'].getAlertMetaData).toHaveBeenCalled();
	//    });
	// });
	 
});