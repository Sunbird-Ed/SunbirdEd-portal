
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { combineLatest,Subject,of,merge,throwError,forkJoin } from 'rxjs';
import { PageApiService,OrgDetailsService,FormService,UserService,CoursesService,FrameworkService,PlayerService,SearchService } from '@sunbird/core';
import { Component,OnInit,OnDestroy,EventEmitter,HostListener,AfterViewInit } from '@angular/core';
import { ResourceService,ToasterService,INoResultMessage,ConfigService,UtilService,ICaraouselData,BrowserCacheTtlService,ServerResponse,NavigationHelperService,LayoutService,COLUMN_TYPE } from '@sunbird/shared';
import { Router,ActivatedRoute } from '@angular/router';
import { _ } from 'lodash-es';
import { IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { PublicPlayerService } from '@sunbird/public';
import { takeUntil,map,mergeMap,filter,catchError,tap,pluck,switchMap,delay } from 'rxjs/operators';
import { OfflineCardService } from '@sunbird/shared';
import { ContentManagerService } from '../../../public/module/offline/services/content-manager/content-manager.service';
import { CoursePageComponent } from './course-page.component';
import { Response } from './course-page.component.spec.data';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe('CoursePageComponent', () => {
  let component: CoursePageComponent;

  const pageApiService :Partial<PageApiService> ={};
	const toasterService :Partial<ToasterService> ={
    error: jest.fn(),
	};
	const resourceService :Partial<ResourceService> ={
    languageSelected$: of({ language: 'en' }) as any,
		frmelmnts: {
			lbl: {
				mytrainings: 'My Trainings',
			},
		},
	};
		const configService :Partial<ConfigService> ={
			appConfig: {
			CoursePageSection: {
				enrolledCourses: {
					constantData: {},
					metaData: {},
					dynamicFields: {},
					slickSize: 5,
				},
			},
		},
	};

	const activatedRoute :Partial<ActivatedRoute> ={
		snapshot: {
			data: {
			  telemetry: {
				env: 'explore', pageid: 'download-offline-app', type: 'view', uuid: '9545879'
			  }
			},
			queryParams: {
			  client_id: 'portal', redirectUri: '/learn',
			  state: 'state-id', response_type: 'code', version: '3'
			}
		  } as any,
	};
	const router :Partial<Router> ={
		onSameUrlNavigation: 'reload',
		url: '/mocked-url',
	};
	const utilService :Partial<UtilService> ={
		addHoverData:jest.fn(),
		processContent: jest.fn((content, constantData, dynamicFields, metaData) => ({
    })),
	};
	const orgDetailsService :Partial<OrgDetailsService> ={
		getOrgDetails: jest.fn().mockReturnValue(of({ hashTagId: 'mockedHashTagId' })),
		searchOrgDetails: jest.fn()
	};
	const publicPlayerService :Partial<PublicPlayerService> ={
		playContent: jest.fn(),
	};
	const cacheService :Partial<CacheService> ={};
	const browserCacheTtlService :Partial<BrowserCacheTtlService> ={};
	const userService: Partial<UserService> = {
    slug: jest.fn().mockReturnValue('tn') as any,
	}
	const formService :Partial<FormService> ={
		 getFormConfig: jest.fn().mockReturnValue(of({
			formServiceInputParams: {
				contentType: 'admin_framework',
				formAction: 'create',
				formType: 'user',
			},
			hashTagId: 'mockedHashTagId',
  })),
	};
	const navigationhelperService :Partial<NavigationHelperService> ={
		getPageLoadTime:jest.fn().mockReturnValue(10)
	};
	const layoutService :Partial<LayoutService> ={
		initlayoutConfig: jest.fn(),
		redoLayoutCSS: jest.fn(),
    switchableLayout: jest.fn(() => of([{ layout: 'demo' }]))
	};
	const coursesService :Partial<CoursesService> ={
		enrolledCourseData$: of({
        enrolledCourses: [
					{
						courseName: 'Copy of Book testing 1 - 0708',
						courseId: 'do_2130595997829611521527',
					} as any
				],
        err: null,
      }),
	};
	const frameworkService :Partial<FrameworkService> ={
    getDefaultCourseFramework: jest.fn()
  };
	const playerService :Partial<PlayerService> ={
		playContent: jest.fn(),
	};
	const searchService :Partial<SearchService> ={};
	const offlineCardService :Partial<OfflineCardService> ={
		isYoutubeContent: jest.fn(),
	};
	const contentManagerService :Partial<ContentManagerService> ={
		contentDownloadStatus$: of({ enrolledCourses: [{ identifier: 'COMPLETED' }] }),
		startDownload: jest.fn(() => of({})),
    updateContent: jest.fn(),
		exportContent: jest.fn(),
		deleteContent: jest.fn(),
  } as any;
	const telemetryService :Partial<TelemetryService> ={
		interact: jest.fn(),
	};
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getFrameworkCategories: jest.fn(),
    setDefaultFWforCsl: jest.fn(),
		getGlobalFilterCategoriesObject: jest.fn(),
		getAllFwCatName: jest.fn(),
		transformDataForCC: jest.fn(),
  };

	beforeAll(() => {
			component = new CoursePageComponent(
					pageApiService as PageApiService,
					toasterService as ToasterService,
					resourceService as ResourceService,
					configService as ConfigService,
					activatedRoute as ActivatedRoute,
					router as Router,
					utilService as UtilService,
					orgDetailsService as OrgDetailsService,
					publicPlayerService as PublicPlayerService,
					cacheService as CacheService,
					browserCacheTtlService as BrowserCacheTtlService,
					userService as UserService,
					formService as FormService,
					navigationhelperService as NavigationHelperService,
					layoutService as LayoutService,
					coursesService as CoursesService,
					frameworkService as FrameworkService,
					playerService as PlayerService,
					searchService as SearchService,
					offlineCardService as OfflineCardService,
					contentManagerService as ContentManagerService,
					telemetryService as TelemetryService,
					mockCslFrameworkService as CslFrameworkService
			)
	});

	beforeEach(() => {
	    window.scroll = jest.fn() as any;
			jest.clearAllMocks();
			jest.resetAllMocks();
	});

	it('should create a instance of component', () => {
			expect(component).toBeTruthy();
	});

	it('should call the method onScroll to be called', () => {
		jest.spyOn(component,'addHoverData');
		component.pageSections = Response.pageSections as any
		component.carouselMasterData = Response.pageSectionsNew as any
		component.onScroll();
				expect(component.addHoverData).toBeCalled();
		});

	describe("ngOnDestroy", () => {
		it('should destroy sub', () => {
				component.unsubscribe$ = {
						next: jest.fn(),
						complete: jest.fn()
				} as any;
				component.ngOnDestroy();
				expect(component.unsubscribe$.next).toHaveBeenCalled();
				expect(component.unsubscribe$.complete).toHaveBeenCalled();
		});
	});

	it('should initialize the component', () => {
		const isUserLoggedInSpy = jest.spyOn(component, 'isUserLoggedIn');
		isUserLoggedInSpy.mockReturnValue(true);
    component['initialize']();
    expect(layoutService.initlayoutConfig).toHaveBeenCalled();
    expect(layoutService.redoLayoutCSS).toHaveBeenCalled();
    // expect(window.scroll).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
    expect(router.onSameUrlNavigation).toBe('reload');
  });

  it('should set onSameUrlNavigation to "reload" when the user is not logged in', () => {
    component['initialize']();
    expect(router.onSameUrlNavigation).toBe('reload');
  });

	it('should call getOrgDetails and set hashTagId', async () => {
		const mockOrgDetails = { hashTagId: 'mockedHashTagId' };
		jest.spyOn(orgDetailsService, 'getOrgDetails' as any).mockReturnValue(of(mockOrgDetails));

		await component['getOrgDetails']().toPromise();
		expect(orgDetailsService.getOrgDetails).toHaveBeenCalled();
		expect(component.hashTagId).toEqual('mockedHashTagId');
	});

	it('should call searchOrgDetails and return content', async () => {
    const filters = { orgType: 'exampleOrgType', location: 'exampleLocation' };
    const fields = ['name', 'description'];
		const mockorgDetails = {
			count: 1,
			content: {
					identifier: 'string',
					orgName: 'string',
					slug: 'string',
					name: 'string',
			}
		}
		orgDetailsService.searchOrgDetails = jest.fn().mockReturnValue(of(mockorgDetails)) as any;
    const result = await component['searchOrgDetails']({ filters, fields }).toPromise();
    expect(result).toEqual( {"identifier": "string", "name": "string", "orgName": "string", "slug": "string"});
    expect(orgDetailsService.searchOrgDetails).toHaveBeenCalledWith({ filters, fields });
  });

  it('should set formData, pageTitle, pageTitleSrc, and svgToDisplay when query parameters are empty', async () => {
    const mockFormData = [
      { contentType: 'course', title: 'CourseTitle', theme: { imageName: 'course.svg' } },
    ];

		formService.getFormConfig  = jest.fn().mockReturnValue(of(mockFormData)) as any;
    activatedRoute.snapshot.queryParams = {};

    await component.getFormData().toPromise();

    expect(component.formData).toEqual(mockFormData);
    expect(component.svgToDisplay).toEqual('course.svg');
  });

  it('should redo layout with configuration if layoutConfiguration is not null', () => {
      const mockLayoutConfiguration = {};
      component.layoutConfiguration = mockLayoutConfiguration;
      component['redoLayout']();
      expect(layoutService.redoLayoutCSS).toHaveBeenCalledWith(0, mockLayoutConfiguration, COLUMN_TYPE.threeToNine, true);
      expect(layoutService.redoLayoutCSS).toHaveBeenCalledWith(1, mockLayoutConfiguration, COLUMN_TYPE.threeToNine, true);
  });

	it('should redo layout without configuration if layoutConfiguration is null', () => {
		component.layoutConfiguration = null;
		component['redoLayout']();
		expect(layoutService.redoLayoutCSS).toHaveBeenCalledWith(0, null, COLUMN_TYPE.fullLayout);
		expect(layoutService.redoLayoutCSS).toHaveBeenCalledWith(1, null, COLUMN_TYPE.fullLayout);
	});

	it('should not set layoutConfiguration if layoutConfig is null', () => {
		layoutService.switchableLayout = jest.fn(() => of(null))

		component['initLayout']().subscribe(() => {
			expect(component.layoutConfiguration).toBeUndefined();
		});
	});

	it('should set layoutConfiguration if layoutConfig is not null', () => {
		layoutService.switchableLayout = jest.fn(() => of([{ layoutConfig:{layout: 'demo' }}]))

		component['initLayout']().subscribe(() => {
			expect(component.layoutConfiguration).toEqual({layout: 'demo' });
		});
  });

	it('should return the correct page data based on contentType', () => {
    const mockFormData = [
      { contentType: 'type1', data: 'data1' },
      { contentType: 'type2', data: 'data2' },
      { contentType: 'type3', data: 'data3' },
    ];
    component['formData'] = mockFormData;
    const result1 = component.getPageData('type1');
    const result2 = component.getPageData('type3');
    const result3 = component.getPageData('nonExistentType');
    expect(result1).toEqual({ contentType: 'type1', data: 'data1' });
    expect(result2).toEqual({ contentType: 'type3', data: 'data3' });
    expect(result3).toBeUndefined();
  });

	it('should filter out selectedTab and merge with default filters', () => {
    const mockFilters = {
      selectedTab: 'someValue',
      someOtherFilter: 'someValue',
    };
    const result = component.getSearchFilters(mockFilters);
    expect(result.selectedTab).toBeUndefined();
    expect(result.someOtherFilter).toBe('someValue');
    expect(result.primaryCategory).toEqual(['Course', 'Course Assessment']);
    expect(result.status).toEqual(['Live']);
    expect(result['batches.enrollmentType']).toBe('open');
    expect(result['batches.status']).toBe(1);
  });

	it('should update the name property if orgName is present', () => {
    const facet = [
      { orgName: 'Organization A', otherProperty: 'value1' },
      { orgName: 'Organization B', otherProperty: 'value2' },
    ];
    const result = component.processChannelData(facet);
    result.forEach((channelList, index) => {
      expect(channelList.name).toEqual(facet[index].orgName);
    });
  });

  it('should not update the name property if orgName is not present', () => {
    const facet = [
      { name: 'Channel A', otherProperty: 'value1' },
      { name: 'Channel B', otherProperty: 'value2' },
    ];
    const result = component.processChannelData(facet);
    result.forEach((channelList, index) => {
      expect(channelList.name).toEqual(facet[index].name);
    });
  });

   it('should return an array of rootOrgIds from channels with names', () => {
    const channels = [
      { name: 'Org1' },
      { name: 'Org2' },
      { name: 'Org3' },
    ];
    const result = component.processOrgData(channels);
    expect(result).toEqual(['Org1', 'Org2', 'Org3']);
  });

  it('should return an empty array if channels is empty', () => {
    const channels = [];
    const result = component.processOrgData(channels);
    expect(result).toEqual([]);
  });

  it('should return an empty array if channels have no names', () => {
    const channels = [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ];
    const result = component.processOrgData(channels);
    expect(result).toEqual([]);
  });

  it('should return an empty array if channels is null', () => {
    const channels = null;
    const result = component.processOrgData(channels);
    expect(result).toEqual([]);
  });

  it('should return an empty array if channels is undefined', () => {
    const channels = undefined;
    const result = component.processOrgData(channels);
    expect(result).toEqual([]);
  });

	it('should update facets data based on global filter categories', () => {
    const facets = {
      channel: [
        { orgName: 'Org1' },
        { orgName: 'Org2' },
      ],
    };
    const globalFilterCategoriesObject = [
      { code: 'channel', index: 1, label: 'Channel', placeHolder: 'Select Channel' },
    ];
    const mockProcessChannelData = jest.fn((facet) => facet.map((channelList) => ({ ...channelList, name: channelList.orgName })));
    const result = component.updateFacetsData.call({ processChannelData: mockProcessChannelData, globalFilterCategoriesObject }, facets);
    expect(mockProcessChannelData).toHaveBeenCalledWith(facets.channel);
    expect(result).toEqual([
      {
        index: '1',
        label: 'Channel',
        placeholder: 'Select Channel',
        values: [
          { orgName: 'Org1', name: 'Org1' },
          { orgName: 'Org2', name: 'Org2' },
        ],
        name: 'channel',
      },
    ]);
  });

	xdescribe('ngOnInit', () => {
		xit('should initialize framework categories and keys on ngOnInit', () => {
			jest.spyOn(orgDetailsService, 'getOrgDetails' as any).mockReturnValue(of({ hashTagId: 'mockedHashTagId' }));
			jest.spyOn(formService, 'getFormConfig').mockReturnValue(of({}));
			jest.spyOn(layoutService, 'switchableLayout').mockReturnValue(of({ layout: {} }));
			component.ngOnInit();
			jest.spyOn(mockCslFrameworkService, 'getGlobalFilterCategoriesObject').mockReturnValue(['filter1', 'filter2']);
			jest.spyOn(mockCslFrameworkService, 'getAllFwCatName').mockReturnValue(['category1', 'category2']);
			jest.spyOn(mockCslFrameworkService, 'transformDataForCC').mockReturnValue(['key1', 'key2']);
			component.ngOnInit();
			expect(jest.spyOn(component.cslFrameworkService, 'getGlobalFilterCategoriesObject')).toHaveBeenCalled();
			expect(jest.spyOn(component.cslFrameworkService, 'getAllFwCatName')).toHaveBeenCalled();
			expect(jest.spyOn(component.cslFrameworkService, 'transformDataForCC')).toHaveBeenCalled();
			expect(component.globalFilterCategoriesObject).toEqual(['filter1', 'filter2']);
			expect(component.frameworkCategoriesList).toEqual(['category1', 'category2']);
			expect(component.categoryKeys).toEqual(['key1', 'key2']);
		});
	});

	xit('should transform filters with channel data correctly', () => {
    const filters = {
      filters: {
        channel: ['channelId1', 'channelId2'],
      },
    };
    component.facets = [
      {
        name: 'channel',
        values: [
          { identifier: 'channelId1', name: 'Channel 1' },
          { identifier: 'channelId2', name: 'Channel 2' },
        ],
      },
    ];
    component.getFilters(filters);
    expect(component.selectedFilters.channel).toEqual(['Channel 1', 'Channel 2']);
  });

	it('should prepare visits and update telemetryImpression', () => {
    const sampleEvent = [
      { metaData: { identifier: 'id1', contentType: 'type1' }, section: 'section1' },
      { metaData: { identifier: 'id2', contentType: 'type2' }, section: 'section2' },
    ];
    component.prepareVisits(sampleEvent);
    expect(component.inViewLogs).toEqual([
      { objid: 'id1', objtype: 'type1', index: 0, section: 'section1' },
      { objid: 'id2', objtype: 'type2', index: 1, section: 'section2' },
    ]);
    expect(component.telemetryImpression.edata.visits).toEqual(component.inViewLogs);
    expect(component.telemetryImpression.edata.subtype).toEqual('pageexit');
  });

	it('should set showDownloadLoader to true and call downloadContent', () => {
    component.showDownloadLoader = false;
    const downloadIdentifier = 'yourDownloadIdentifier';
    const downloadContentSpy = jest.spyOn(component, 'downloadContent').mockImplementation(() => {});
    component.downloadIdentifier = downloadIdentifier;
    component.callDownload();
    expect(component.showDownloadLoader).toBe(true);
    expect(downloadContentSpy).toHaveBeenCalledWith(downloadIdentifier);
  });

	xit('should handle successful download', () => {
    const contentId = 'yourContentId';
    component.showDownloadLoader = true;
    const contentManagerServiceSpy = jest.spyOn(component['contentManagerService'], 'startDownload' as any).mockReturnValue(of({}));
    component.downloadContent(contentId);
    expect(component.showDownloadLoader).toBe(false);
    expect(component.downloadIdentifier).toBe('');
    expect(component.contentManagerService.downloadContentId).toBe('');
    expect(component.contentManagerService.downloadContentData).toEqual({});
    expect(component.contentManagerService.failedContentName).toBe('');
    expect(contentManagerServiceSpy).toHaveBeenCalledWith({});
  });

	it('should handle hover action click for play content', () => {
    const event = {
      hover: { type: 'OPEN' },
      content: { name: 'ContentName' },
      data: {}
    };
    const playContentSpy = jest.spyOn(component, 'playContent');
    const logTelemetrySpy = jest.spyOn(component, 'logTelemetry');
    component.hoverActionClicked(event);
    expect(event.data).toEqual(event.content);
    expect(component.contentName).toBe('ContentName');
    expect(playContentSpy).toHaveBeenCalledWith(event);
    expect(logTelemetrySpy).toHaveBeenCalledWith(event.data, 'play-content');
  });

  it('should handle hover action click for download content', () => {
    const event = {
      hover: { type: 'DOWNLOAD' },
      content: { identifier: 'ContentIdentifier' },
      data: {}
    };
    component.showModal = false;
    component.showDownloadLoader = false;
    component.downloadContent = jest.fn(() => of({}));
    const downloadContentSpy = jest.spyOn(component, 'downloadContent');
    const logTelemetrySpy = jest.spyOn(component, 'logTelemetry');

    component.hoverActionClicked(event);
    expect(component.downloadIdentifier).toBe('ContentIdentifier');
    expect(offlineCardService.isYoutubeContent).toHaveBeenCalledWith(event.data);
    expect(downloadContentSpy).toHaveBeenCalledWith('ContentIdentifier');
    expect(logTelemetrySpy).toHaveBeenCalledWith(event.data, 'download-trackable-collection');
  });

  it('should get framework for logged-in user', () => {
    jest.spyOn(component, 'isUserLoggedIn').mockReturnValue(true);

    const frameworkMock = of('MockedFramework');
    jest.spyOn(component['frameworkService'], 'getDefaultCourseFramework').mockReturnValue(frameworkMock);
    component['getFrameWork']().subscribe(() => {
      expect(component.frameWorkName).toEqual('MockedFramework');
      expect(component.initFilters).toBe(true);
    });
  });

  it('should handle error for logged-in user', () => {
    jest.spyOn(component, 'isUserLoggedIn').mockReturnValue(true);
    const errorMock = throwError({});
    jest.spyOn(component['frameworkService'], 'getDefaultCourseFramework').mockReturnValue(errorMock);
    component['getFrameWork']().subscribe({
      error: (error) => {
        expect(error).toEqual({});
      },
    });
  });

  it('should get framework for non-logged-in user', () => {
    jest.spyOn(component, 'isUserLoggedIn').mockReturnValue(false);
    const formConfigMock = of({ framework: 'MockedFramework' });
    jest.spyOn(component['formService'], 'getFormConfig').mockReturnValue(formConfigMock);
    component['getFrameWork']().subscribe(() => {
      expect(component.frameWorkName).toEqual('MockedFramework');
      expect(component.initFilters).toBe(true);
    });
  });
});