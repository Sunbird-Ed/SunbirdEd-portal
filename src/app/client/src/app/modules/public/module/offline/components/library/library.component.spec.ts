import { Component,OnInit,EventEmitter,HostListener,OnDestroy } from '@angular/core';
import { Router,ActivatedRoute,NavigationStart } from '@angular/router';
import { combineLatest,of,Subject, throwError } from 'rxjs';
import { tap,filter,takeUntil,first,debounceTime,delay } from 'rxjs/operators';
import { _ } from 'lodash-es';
import { OfflineCardService,ResourceService,ToasterService,ConfigService,UtilService,ICaraouselData,NavigationHelperService,ILanguage,LayoutService,COLUMN_TYPE,ConnectionService } from '@sunbird/shared';
import { SearchService,UserService,OrgDetailsService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { IInteractEventEdata,IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { ContentManagerService,SystemInfoService } from '../../services';
import { LibraryComponent } from './library.component';
import { response }  from './library.component.spec.data';
import { CslFrameworkService } from '../../../../services/csl-framework/csl-framework.service';

describe('LibraryComponent', () => {
    let component: LibraryComponent;

    const mockActivatedRoute :Partial<ActivatedRoute> ={
		params: of({}),
        queryParams: of({}),
		snapshot: {
			data: {
			  telemetry: {
				env: 'mock-env', pageid: 'mock-page-id', type: 'mock-type',subtype: 'mock-sub-type',uuid: '9545879'
			  }
			},
			queryParams: {
			  client_id: 'portal', redirectUri: '/learn',
			  state: 'state-id', response_type: 'code', version: '3'
			}
		} as any,
	};
	const mockRouter :Partial<Router> ={
		navigate: jest.fn(),
		url: '/downloads?mock',
		events: of({id: 1, url: 'mock-url'}) as any
	};
	const mockUtilService :Partial<UtilService> ={
		addHoverData: jest.fn(),
		isDesktopApp: false,
		clearSearchQuery: jest.fn(),
		languageChange: of({value: 'mock-language',label: 'mock-Label', dir: 'mock-dir'}) as any
	};
	const mockToasterService :Partial<ToasterService> ={
		success: jest.fn(),
		error: jest.fn()
	};
	const mockConfigService :Partial<ConfigService> ={
		appConfig:{
			AllDownloadsSection:{
				slideConfig: 'mock-config'
			}
		}
	};
	const mockResourceService :Partial<ResourceService> ={
		messages:{
			smsg:{
				m0059: 'Mocked Success Message',
			},
			fmsg:{
				m0090: 'Failed download',
				m0091: 'Mocked Error Message',
			}
		},
		frmelmnts: {
			lbl: {
			  desktop: {
				mylibrary: 'Desktop My Library',
			  },
			  fetchingContentFailed: 'Fetching content failed',
		},
	    },
	};
	const mockPublicPlayerService :Partial<PublicPlayerService> ={
		updateDownloadStatus: jest.fn(),
		playContent: jest.fn()
	};
	const mockSearchService :Partial<SearchService> ={
		getContentTypes: jest.fn(),
	};
	const mockConnectionService :Partial<ConnectionService> ={
		monitor: jest.fn(() => of(true))
	};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={
		goBack: jest.fn(),
		getPageLoadTime: jest.fn()
	};
	const mockTelemetryService :Partial<TelemetryService> ={
		interact: jest.fn()
	};
	const mockContentManagerService :Partial<ContentManagerService> ={
		contentDownloadStatus$: of({ enrolledCourses: [{ identifier: 'COMPLETED' }] }),
		startDownload: jest.fn(),
		exportContent: jest.fn(),
		completeEvent:of({}) as any
	} as any;
	const mockOfflineCardService :Partial<OfflineCardService> ={
		isYoutubeContent: jest.fn()
	};
	const mockSystemInfoService :Partial<SystemInfoService> ={
		getSystemInfo: jest.fn(),
	};
	const mockLayoutService :Partial<LayoutService> ={
	   redoLayoutCSS: jest.fn(),
	   initlayoutConfig: jest.fn(),
       switchableLayout: jest.fn(),
	};
	const mockUserService :Partial<UserService> ={
		slug: 'mockUserSlug',
	};
	const mockOrgDetailsService :Partial<OrgDetailsService> ={
		getOrgDetails: jest.fn(),
	};
	const mockCslFrameworkService  :Partial<CslFrameworkService> ={
		getAlternativeCodeForFilter: jest.fn(),
		transformDataForCC: jest.fn(),
		getAllFwCatName: jest.fn(),
	};
	
    beforeAll(() => {
        component = new LibraryComponent(
            mockActivatedRoute as ActivatedRoute,
			mockRouter as Router,
			mockUtilService as UtilService,
			mockToasterService as ToasterService,
			mockConfigService as ConfigService,
			mockResourceService as ResourceService,
			mockPublicPlayerService as PublicPlayerService,
			mockSearchService as SearchService,
			mockConnectionService as ConnectionService,
			mockNavigationHelperService as NavigationHelperService,
			mockTelemetryService as TelemetryService,
			mockContentManagerService as ContentManagerService,
			mockOfflineCardService as OfflineCardService,
			mockSystemInfoService as SystemInfoService,
			mockLayoutService as LayoutService,
			mockUserService as UserService,
			mockOrgDetailsService as OrgDetailsService,
			mockCslFrameworkService  as CslFrameworkService 
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	it('should navigate to My Downloads', () => {
		jest.spyOn(mockRouter,'navigate');
		component.navigateToMyDownloads();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
	});

	describe('updateCardData',()=>{
		it('should update download status for each content in pageSections', () => {
			component.pageSections = response.mockPageSections;
			component.contentDownloadStatus = response.mockContentDownloadStatus;
			jest.spyOn(mockPublicPlayerService,'updateDownloadStatus')
            component.addHoverData = jest.fn();

			component.updateCardData();
		
			response.mockPageSections.forEach((pageSection) => {
			  pageSection.contents.forEach((pageData) => {
				expect(mockPublicPlayerService.updateDownloadStatus).toHaveBeenCalledWith(response.mockContentDownloadStatus, pageData);
			  });
			});
			expect(component.addHoverData).toHaveBeenCalled();
		});
	});
	
	describe('downloadContent', ()=> {
		it('should download content successfully', () => {
		  const contentId = '';
		  const contentData = {data: 'mock-data'};
		  const contentName = '';
	
		  component.contentData = contentData;
		  component.contentName = contentName;
		  const contentManagerSpy = jest.spyOn(component.contentManagerService as any,'startDownload' as any).mockReturnValue(of({}));
	
		  component.downloadContent(contentId);
	
		  expect(mockContentManagerService.downloadContentId).toBe(contentId);
		  expect(mockContentManagerService.downloadContentData).toEqual({});
		  expect(mockContentManagerService.failedContentName).toBe(contentName);
		  expect(contentManagerSpy).toHaveBeenCalledWith({});
		  expect(component.downloadIdentifier).toBe('');
		  expect(mockContentManagerService.downloadContentId).toBe('');
		  expect(mockContentManagerService.downloadContentData).toEqual({});
		  expect(mockContentManagerService.failedContentName).toBe('');
		  expect(component.showDownloadLoader).toBe(false);
		});

		it('should handle LOW_DISK_SPACE error', () => {
			const mockError = {
			  error: {
				params: {
				  err: 'LOW_DISK_SPACE',
				},
			  },
			};
		
			jest.spyOn(component.contentManagerService as any, 'startDownload' as any).mockReturnValue(throwError(mockError));
			component.showDownloadLoader = true;
		    
			component.downloadContent('mockContentId');
		
			expect(component.downloadIdentifier).toBe('');
		  	expect(mockContentManagerService.downloadContentId).toBe('');
		  	expect(mockContentManagerService.downloadContentData).toEqual({});
		  	expect(mockContentManagerService.failedContentName).toBe('');
		  	expect(component.showDownloadLoader).toBe(false);
			response.mockPageSections.forEach((pageSection) => {
				pageSection.contents.forEach((pageData) => {
				expect(pageData['downloadStatus']).toBe(undefined);
				});
			});
		});
	});
    
	describe('exportContent',() => {
		it('should handle successful content export', () => {
			const contentId = 'content123';
			jest.spyOn(component.contentManagerService as any ,'exportContent' as any).mockReturnValue(of({}));
			
			component.exportContent(contentId);

			expect(component.showExportLoader).toBeFalsy();
			expect(mockToasterService.success).toHaveBeenCalledWith(mockResourceService.messages.smsg.m0059);
		});

		it('should handle content export error with responseCode not equal to NO_DEST_FOLDER', () => {
			const contentId = 'content123';
			const errorResponse = { error: { responseCode: 'MOCK_ERROR_CODE' } };
			jest.spyOn(component.contentManagerService as any ,'exportContent' as any).mockReturnValue(throwError(errorResponse));
		
			component.exportContent(contentId);
		
			expect(component.showExportLoader).toBeFalsy();
			expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.fmsg.m0091);
		});
    });
    
	describe('playcontent',()=>{
		it('should call publicPlayerService.playContent with the provided event', () => {
			const event = {};
			component.playContent(event);
		
			expect(mockPublicPlayerService.playContent).toHaveBeenCalledWith(event);
		});

		it('should call publicPlayerService.playContent if event is not provided', () => {
			component.playContent(null);

			expect(mockPublicPlayerService.playContent).toHaveBeenCalled();
		});
    });
	
	it('should set showLoader and showSectionoader to be false',()=>{
      component.hideLoader();
	  expect(component.showLoader).toBe(false);
	  expect(component.showSectionLoader).toBe(false);
	});
    
	describe('redoLayout',()=>{
		it('should redo layout when layoutConfiguration is not null', () => {
			component.layoutConfiguration ={layout: 'mock-layout'};
			component.redoLayout();
		
			expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(
			expect.any(Number),
			expect.anything(),
			expect.anything(),
			true
			);
		});
		
		it('should redo layout when layoutConfiguration is null', () => {
			component.layoutConfiguration = null;
			component.redoLayout();
		
			expect(mockLayoutService.redoLayoutCSS).toHaveBeenCalledWith(
			expect.any(Number),
			null,
			expect.anything(),
			);
		});
    });
    
	describe('initLayout',()=>{
		it('should initialize layout configuration and call redoLayout', () => {
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
			jest.spyOn(component,'redoLayout');
			component.initLayout();
		
			expect(mockLayoutService.initlayoutConfig).toHaveBeenCalled();
			expect(mockLayoutService.switchableLayout).toHaveBeenCalled();
			expect(component.redoLayout).toBeCalledTimes(2);
		});

		it('should handle switchableLayout observable with non-null layout configuration', () => {
			const layoutConfig = { layout: 'mockLayoutConfig'};
			jest.spyOn(component.layoutService,'initlayoutConfig').mockReturnValue(of({layout: 'mockLayoutConfig'}));
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({ layout: 'mockLayoutConfig' }));
		
			component.initLayout();
		
			expect(component.layoutConfiguration).toEqual(layoutConfig.layout);
		});
    });
    
	describe('fetchCurrentPageData',() => {
		it('should fetch current page data successfully', () => {
			const mockFormData = [
			{
				title: 'frmelmnts.lbl.desktop.mylibrary',
				contentType: 'someType',
				theme: {
				imageName: 'mockImage',
				},
				search: {
				facets: ['se_boards','se_gradeLevels','se_subjects','se_mediums','primaryCategory',
					'mimeType',]
				},
			},
			];
			jest.spyOn(component,'getOrgDetails');
			jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of(mockFormData));
		
			component.fetchCurrentPageData();
		
			expect(mockSearchService.getContentTypes).toHaveBeenCalledWith(true);
			expect(component.currentPageData).toEqual(mockFormData[0]);
			expect(component.pageTitle).toEqual(_.get(mockResourceService, mockFormData[0].title));
			expect(component.pageTitleSrc).toEqual(
			_.get(mockResourceService, 'RESOURCE_CONSUMPTION_ROOT') + mockFormData[0].title
			);
			expect(component.formData).toEqual(mockFormData);
			expect(component.svgToDisplay).toEqual(mockFormData[0].theme.imageName);
			expect(component.globalSearchFacets).toEqual(mockFormData[0].search.facets);
			expect(component.globalSearchFacets).toEqual([
			'se_boards',
			'se_gradeLevels',
			'se_subjects',
			'se_mediums',
			'primaryCategory',
			'mimeType',
			]);
			// expect(component.getOrgDetails).toHaveBeenCalled();
		});
		
		it('should handle error during fetching content types', () => {
			jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(throwError('Error fetching content types'));

			component.fetchCurrentPageData();
		
			expect(mockSearchService.getContentTypes).toHaveBeenCalledWith(true);
			expect(mockToasterService.error).toHaveBeenCalledWith(
			mockResourceService.frmelmnts.lbl.fetchingContentFailed
			);
			expect(mockNavigationHelperService.goBack).toHaveBeenCalled();
		});
   })
  describe('getOrgDetails',()=>{
	xit('should get org details successfully', () => {
		const mockOrgDetails = { hashTagId: 'mockHashTagId' };
		jest.spyOn(component['orgDetailsService'] as any,'getOrgDetails' as any).mockReturnValue(of(mockOrgDetails));
		jest.spyOn(component,'fetchContentOnParamChange');
		component.getOrgDetails();
		//expect(mockOrgDetailsService.getOrgDetails).toHaveBeenCalledWith(mockUserService.slug);
		expect(component.hashTagId).toEqual(mockOrgDetails.hashTagId);
		expect(component.initFilters).toBeTruthy();
		component.dataDrivenFilterEvent.subscribe((filters: any) => {
			expect(filters).toEqual(mockOrgDetails);
		});
		expect(component.fetchContentOnParamChange).toHaveBeenCalled();
		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});
	
	xit('should handle error during getOrgDetails', () => {
		jest.spyOn(component['orgDetailsService'] as any,'getOrgDetails' as any).mockReturnValue(throwError('Error getting org details'));

		component.getOrgDetails();

		expect(mockOrgDetailsService.getOrgDetails).toHaveBeenCalledWith(mockUserService.slug);
		expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
	});
  });

  describe('hoverActionClicked',()=>{
	const mockEvent = {
		content: {
		name: 'Mock Content',
		metaData: {
			identifier: 'mockIdentifier',
		},
		},
		data: 'mock-data',
		hover: {
		type: 'OPEN',
		},
	};

	it('should handle OPEN type and call playContent and logTelemetry', () => {
		const playContentSpy = jest.spyOn(component, 'playContent');
		const logTelemetrySpy = jest.spyOn(component, 'logTelemetry');
	
		component.hoverActionClicked(mockEvent);
	
		expect(playContentSpy).toHaveBeenCalledWith(mockEvent);
		expect(logTelemetrySpy).toHaveBeenCalledWith(mockEvent.data, 'play-content');
	});

	it('should handle DOWNLOAD type and call downloadContent and logTelemetry', () => {
		const downloadContentSpy = jest.spyOn(component, 'downloadContent');
		jest.spyOn(component.contentManagerService as any,'startDownload' as any).mockReturnValue(of({}));
		const logTelemetrySpy = jest.spyOn(component, 'logTelemetry');
	
		component.hoverActionClicked({
		  ...mockEvent,
		  hover: { type: 'DOWNLOAD' },
		});
		expect(component.showDownloadLoader).toBeFalsy();
		expect(downloadContentSpy).toHaveBeenCalledWith('mockIdentifier');
		expect(logTelemetrySpy).toHaveBeenCalledWith(mockEvent.data, 'download-content');
	});


	it('should handle DOWNLOAD type and call offlinecard service', () => {
		const downloadContentSpy = jest.spyOn(component, 'downloadContent');
		const offlineCardSpy= jest.spyOn(component['offlineCardService'] as any,'isYoutubeContent' as any).mockReturnValue(of({}));
		jest.spyOn(component.contentManagerService as any,'startDownload' as any).mockReturnValue(of({}));
		const logTelemetrySpy = jest.spyOn(component, 'logTelemetry');
	
		component.hoverActionClicked({
		  ...mockEvent,
		  hover: { type: 'DOWNLOAD' },
		});
		expect(offlineCardSpy).toHaveBeenCalled();
	});
	
	it('should handle SAVE type and call exportContent and logTelemetry', () => {
		const exportContentSpy = jest.spyOn(component, 'exportContent');
		jest.spyOn(component.contentManagerService as any ,'exportContent' as any).mockReturnValue(of({}));
		const logTelemetrySpy = jest.spyOn(component, 'logTelemetry');
	
		component.hoverActionClicked({
		  ...mockEvent,
		  hover: { type: 'SAVE' },
		});
		expect(exportContentSpy).toHaveBeenCalledWith('mockIdentifier');
		expect(logTelemetrySpy).toHaveBeenCalledWith(mockEvent.data, 'export-content');
	});
  });

  it('should prepare visits for telemetry impression', () => {
	component.sections = response.mockSections;
	component.telemetryImpression = response.mockTelemetryImpression;
    component.prepareVisits();

    expect(component.telemetryImpression.edata.subtype).toBe('pageexit');
  });

  describe('ngOninit',()=>{
	it('should set the value of isDesktopApp', () => {
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
	    jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		component.ngOnInit();
		expect(component.isDesktopApp).toBeFalsy;
	});

	it('should call clearSearchQuery', () => {
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
		jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		component.ngOnInit();
		expect(mockUtilService.clearSearchQuery).toHaveBeenCalled();
	});
    
	it('should call csl frmaework service methods',()=>{
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
		jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		component.ngOnInit();
		expect(component.cslFrameworkService.getAlternativeCodeForFilter).toHaveBeenCalled();
		expect(component.cslFrameworkService.transformDataForCC).toHaveBeenCalled();
		expect(component.cslFrameworkService.getAllFwCatName).toHaveBeenCalled();
	});

	it('should call the component functions',()=>{
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
		jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		jest.spyOn(component as any,'fetchCurrentPageData' as any).mockReturnValue(of({}));
		jest.spyOn(component as any,'initLayout' as any).mockReturnValue(of({}));
		jest.spyOn(component as any,'setTelemetryData' as any).mockReturnValue(of({}));
		component.ngOnInit();
		expect(component.fetchCurrentPageData).toHaveBeenCalled();
		expect(component.initLayout).toHaveBeenCalled();
		expect(component.setTelemetryData).toHaveBeenCalled();
	})

    it('should subscribe contentDownloadStatus',()=>{
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
		jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		jest.spyOn(component as any,'updateCardData' as any).mockReturnValue(of({}));
		component.ngOnInit();
		expect(component.contentDownloadStatus).toEqual({"enrolledCourses": [{"identifier": "COMPLETED"}]});
		expect(component.updateCardData).toHaveBeenCalled();
	});

    describe('systemInfoService.getSystemInfo in ngOninit',()=>{
		it('should create a System warning instance of with data ', () => {
			const data = {
			result:{
				availableMemory: 104857200,
				cpuLoad:95
			}
			}
			jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
			jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
			mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of(data)) as any;
			component.ngOnInit();
			expect(component).toBeTruthy();
			expect(component.showCpuLoadWarning).toBeTruthy();
			expect(component.showMinimumRAMWarning).toBeTruthy();
		});

		it('should create a System warning instance of with data with less value', () => {
			const data = {
			result:{
				availableMemory: 1
			}
			}
			jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
			jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
			mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of(data)) as any;
			component.ngOnInit();
			expect(component.showCpuLoadWarning).toBeFalsy();
			expect(component.showMinimumRAMWarning).toBeFalsy();
		});

		it('should create a System warning instance of with error', () => {
			jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
			jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
			mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(throwError({ result: { response: { err: { message: 'Error' } } } })) as any;
			component.ngOnInit();
			expect(component.showCpuLoadWarning).toBeFalsy();
			expect(component.showMinimumRAMWarning).toBeFalsy();
		});
    });

    it('should should subscribe monitor method of connection service', () => {
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
		jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
        component.ngOnInit();
		expect(component.isConnected).toBeTruthy();
	});

	it('should should call fetch-contents with false if url includes /downloads', () => {
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
		jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
		jest.spyOn(component,'fetchContents')
		component.ngOnInit();
		expect(component.contentManagerService.completeEvent).toBeTruthy();
		component.contentManagerService.completeEvent.pipe(takeUntil(component.unsubscribe$))
		.subscribe((data) =>  {
			expect(component.fetchContents).toHaveBeenCalled();
		});
	})

	it('should handle router events and call preparevists', () => {
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
		jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
		jest.spyOn(component,'prepareVisits');
		component.ngOnInit();
		expect(component.router.events).toBeTruthy();
		component.router.events
            .pipe(filter((event) => event instanceof NavigationStart), takeUntil(component.unsubscribe$))
            .subscribe(x => {
				expect(component.prepareVisits).toHaveBeenCalled();
			});
	});

	it('should subscribe to languageChange event and set languageDirection', () => {
		jest.spyOn(component.searchService as any,'getContentTypes' as any).mockReturnValue(of({}));
		jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		mockSystemInfoService.getSystemInfo = jest.fn().mockReturnValue(of({})) as any;
		jest.spyOn(component['connectionService'],'monitor').mockReturnValue(of(true));
		component.ngOnInit();
		component['utilService'].languageChange
            .pipe(takeUntil(component.unsubscribe$))
            .subscribe((language: ILanguage) => {
		 expect(component.languageDirection).toBe('mock-dir');
		});
	});	
  })

  describe('ngOndestroy',()=>{
	it('should destroy library', () => {
		component.unsubscribe$ = {
			next: jest.fn(),
			complete: jest.fn()
		} as any;
		component.ngOnDestroy();
		expect(component.unsubscribe$.next).toHaveBeenCalled();
		expect(component.unsubscribe$.complete).toHaveBeenCalled();
	});
  })

});