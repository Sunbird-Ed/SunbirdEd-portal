import { Component,OnInit,OnDestroy,OnChanges,Input,EventEmitter,Output } from '@angular/core';
import { ActivatedRoute,Router,NavigationStart } from '@angular/router';
import { ConfigService,NavigationHelperService,ToasterService,ResourceService,UtilService,LayoutService } from '@sunbird/shared';
import { Subject, of, throwError } from 'rxjs';
import { takeUntil,filter } from 'rxjs/operators';
import { _ } from 'lodash-es';
import { IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { PublicPlayerService } from '@sunbird/public';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { ContentPlayerPageComponent } from './contentplayer-page.component';
import { resourceData } from './contentplayer-page.component.spec.data';

describe('ContentPlayerPageComponent', () => {
    let component: ContentPlayerPageComponent;

    const mockActivatedRoute :Partial<ActivatedRoute> ={
		snapshot: {
			data: {
			  telemetry: {
				env: 'mock-env', pageid: 'mock-page-id', type: 'mock-type',subtype: 'mock-sub-type',uuid: '9545879'
			  }
			},
			queryParams: {
			  client_id: 'portal', redirectUri: '/learn',
			  state: 'state-id', response_type: 'code', version: '3',
			  contentType: 'mockContentType',l1Parent: 'mockL1Parent'
			}
		} as any,

		params: of({
			id: 'sample-id',
			contrntId: 'mock-content-id',
			utm_campaign: 'utm_campaign',
			utm_medium: 'utm_medium',
			clientId: 'android',
			timePeriod: '7d',
			context: JSON.stringify({ data: 'sample-data' })
		}) as any
	};
	const mockConfigService :Partial<ConfigService> ={
		appConfig: {
            PublicPlayer: {
                contentApiQueryParams: {
                    orgdetails: 'orgName,email',
                    licenseDetails: 'name,description,url'
                }
            },
        },
	};
	const mockRouter :Partial<Router> ={
		events: of({}) as any,
		url: '/mock-url'
	};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={
		goBack: jest.fn(),
		getPageLoadTime: jest.fn(),
	};
	const mockToasterService :Partial<ToasterService> ={};
	const mockResourceService :Partial<ResourceService> ={};
	const mockUtilService :Partial<UtilService> ={
		isDesktopApp: true,
		emitHideHeaderTabsEvent: jest.fn()
	};
	const mockTelemetryService :Partial<TelemetryService> ={
		interact: jest.fn(),
	};
	const mockLayoutService :Partial<LayoutService> ={
		initlayoutConfig: jest.fn(),
		switchableLayout: jest.fn(),
	};
	const mockPlayerService :Partial<PublicPlayerService> ={
		getContent: jest.fn(),
	};
	const mockCslFrameworkService :Partial<CslFrameworkService> ={
		getGlobalFilterCategoriesObject: jest.fn(() => [{ index: 1, code: 'category1', label: 'Category 1' }]),
        transformContentDataFwBased: jest.fn()
	};

    beforeAll(() => {
        component = new ContentPlayerPageComponent(
            mockActivatedRoute as ActivatedRoute,
			mockConfigService as ConfigService,
			mockRouter as Router,
			mockNavigationHelperService as NavigationHelperService,
			mockToasterService as ToasterService,
			mockResourceService as ResourceService,
			mockUtilService as UtilService,
			mockTelemetryService as TelemetryService,
			mockLayoutService as LayoutService,
			mockPlayerService as PublicPlayerService,
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

	it('should set properties and call methods in ngOnInit', () => {
        const mockCollectionData = 'mockCollectionData';
        component.tocPage = false;
        component.collectionData = mockCollectionData;
        jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
		jest.spyOn(component,'initLayout');
		jest.spyOn(component,'getContentIdFromRoute');
		jest.spyOn(component,'setPageExitTelemtry');
		const mockContentProgressEvents$ = new Subject<any>();
        component.contentProgressEvents$ = mockContentProgressEvents$;
        const nextSpy = jest.spyOn(mockContentProgressEvents$, 'next');

        component.ngOnInit();
        
		expect(component.cslFrameworkService.getFrameworkCategoriesObject).toHaveBeenCalled;
        expect(component.cslFrameworkService.transformContentDataFwBased).toHaveBeenCalledWith(
            component.frameworkCategoriesList,
            component.collectionData
        );
        expect(component.isDesktopApp).toBeTruthy();
		expect(component.initLayout).toHaveBeenCalled();
        expect(component['utilService'].emitHideHeaderTabsEvent).toHaveBeenCalledWith(true);
        expect(component.contentType).toEqual('mockContentType');
        expect(component.getContentIdFromRoute).toHaveBeenCalled();
		mockRouter.events
        .pipe(filter((event) => event instanceof NavigationStart), takeUntil(component.unsubscribe$))
        .subscribe(x => {
	 	expect(component.setPageExitTelemtry).toHaveBeenCalled();
	    })
        expect(component.playerOption).toEqual( {showContentRating: true});
        expect(component.objectRollUp).toEqual({ l1: 'mockL1Parent' });
		const testData = { someKey: 'someValue' };
        mockContentProgressEvents$.next(testData);
        expect(nextSpy).toHaveBeenCalledWith(testData);
    });

	describe('initLayout',()=>{
		xit('should set layoutConfiguration to initlayoutConfig result', () => {
			jest.spyOn(component.layoutService,'initlayoutConfig')
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({}));
			component.initLayout();
			expect(component.layoutService.initlayoutConfig).toHaveBeenCalled();
		});

		xit('should set layoutConfiguration to switchableLayout result if available', () => {
			jest.spyOn(component.layoutService,'initlayoutConfig')
			jest.spyOn(component.layoutService,'switchableLayout').mockReturnValue(of({layout: 'mockLayout'}));
			component.initLayout();
			expect(mockLayoutService.switchableLayout).toHaveBeenCalled();
			expect(component.layoutConfiguration).toEqual('mockLayout');
		});
    });

	it('calls set content id and call getcontent',() =>{
      component.contentDetails = {content: 'mockContent', identifier: 'mock-identifier'}
	  component.tocPage =true;
	  jest.spyOn(component['playerService'] as any,'getContent').mockReturnValue(of({}));
	  jest.spyOn(component,'getContent');
	  component.ngOnChanges();
      expect(component.contentId).toEqual('mock-identifier');
      expect(component.getContent).toHaveBeenCalled();
	});

	it('should set contentId and call getContent when params contain contentId', () => {
        jest.spyOn(component['playerService'],'getContent')
        component.getContentIdFromRoute();
		mockActivatedRoute.params.pipe(
			takeUntil(component.unsubscribe$))
			.subscribe(params => {
        expect(component.contentId).toEqual('mock-content-id');
		expect(component.getContent).toHaveBeenCalled();
       });
    });

	describe('getContent',()=>{
		xit('should call getContent and handle the response correctly', () => {
			const mockResponse = resourceData.getContentResponse;
			mockPlayerService.getContent = jest.fn().mockImplementation(() => of(mockResponse));
			jest.spyOn(component,'setTelemetryData').mockImplementation();
			component.getContent();
			expect(component['playerService'].getContent).toHaveBeenCalledWith(component.contentId, {
				params: mockConfigService.appConfig.PublicPlayer.contentApiQueryParams
			});
		});
	    
		xit('should handle error response correctly', () => {
			const mockResponse = resourceData.getContentResponse;
			mockPlayerService.getContent = jest.fn().mockImplementation(() => throwError('mock-Error'));
			component.isContentDeleted = {
				next: jest.fn(),
			} as any;
			component.getContent();
	
			expect(component['playerService'].getContent).toHaveBeenCalledWith(component.contentId, {
				params: mockConfigService.appConfig.PublicPlayer.contentApiQueryParams
			});
	
			expect(component.contentDetails).toEqual({});
			expect(component.isContentDeleted.next).toHaveBeenCalledWith({ value: true });
	        expect(component.setTelemetryData).toHaveBeenCalled();
		});
	});
    
	it('should call checkContentDeleted method',()=>{
       const mockEvent = { event: 'mock-Event-name'};
	   component.isContentDeleted = {
		 next: jest.fn(),
	   } as any;
	   jest.spyOn(component.deletedContent,'emit');
	   component.checkContentDeleted(mockEvent);
       expect(component.isContentDeleted.next).toHaveBeenCalledWith({ value: true });
	   expect(component.deletedContent.emit).toHaveBeenCalledWith(component.contentDetails);
	});

	it('should call checkContentDownloading method',()=>{
	   const mockEvent = { event: 'mock-Event-name'};
	   component.isContentDeleted = {
		 next: jest.fn(),
	   } as any;
	   jest.spyOn(component.contentDownloaded,'emit');
	   component.checkContentDownloading(mockEvent);
	   expect(component.isContentDeleted.next).toHaveBeenCalledWith({ value: false });
	   expect(component.contentDownloaded.emit).toHaveBeenCalledWith(mockEvent);
	});

	it('should call goback method',()=>{
	  jest.spyOn(component,'logTelemetry');
      component.goBack();
	  expect(component.logTelemetry).toHaveBeenCalledWith('close-content-player');
	  expect(component['navigationHelperService'].goBack).toHaveBeenCalled();
	});

	it('should call onAssessmentEvent method',()=>{
	  const mockEvent = { event: 'mock-Event-name'};
	  jest.spyOn(component.assessmentEvents,'emit');
	  component.onAssessmentEvents(mockEvent);
      expect(component.assessmentEvents.emit).toHaveBeenCalledWith(mockEvent);
	});

	it('should call onQuestionScoreSubmitEvents method',()=>{
		const mockEvent = { event: 'mock-Event-name'};
		jest.spyOn(component.questionScoreSubmitEvents,'emit');
		component.onQuestionScoreSubmitEvents(mockEvent);
		expect(component.questionScoreSubmitEvents.emit).toHaveBeenCalledWith(mockEvent);
	});

	it('should call onQuestionScoreReviewEvents method',()=>{
		const mockEvent = { event: 'mock-Event-name'};
		jest.spyOn(component.questionScoreReviewEvents,'emit');
		component.onQuestionScoreReviewEvents(mockEvent);
		expect(component.questionScoreReviewEvents.emit).toHaveBeenCalledWith(mockEvent);
	});

	describe('ngOndestroy',()=>{
		it('should destroy contentplayer-page', () => {
			component.unsubscribe$ = {
				next: jest.fn(),
				complete: jest.fn()
			} as any;

			component.ngOnDestroy();
			expect(component.unsubscribe$.next).toHaveBeenCalled();
			expect(component.unsubscribe$.complete).toHaveBeenCalled();
			expect(component['utilService'].emitHideHeaderTabsEvent).toHaveBeenCalledWith(false);
		});
	});

	xit('should call logTelemetry method',()=>{
		const mockId ='mock-id';
		const mockInteractData = {
		context: {
			env: mockActivatedRoute.snapshot.data.telemetry.env || 'content',
			cdata: []
		},
		edata: {
			id: mockId,
			type: 'click',
			pageid: mockActivatedRoute.snapshot.data.telemetry.pageid || 'play-content',
		}
		};
		component.logTelemetry(mockId);
		expect(component['telemetryService'].interact).toHaveBeenCalledWith(mockInteractData);
	});

	xit('should call setPageExitTelemtry method',()=>{
		component.contentDetails = {contentType: 'mockContent', identifier: 'mock-identifier', pkgVersion: '1.0'};
		component.setPageExitTelemtry();
        expect(component.telemetryImpression.object).toEqual({
			id: component.contentDetails['identifier'],
            type: component.contentDetails['contentType'],
            ver: `${component.contentDetails['pkgVersion']}`,
		});
		expect(component.telemetryImpression.edata.subtype).toEqual('pageexit');
	});
	
	xit('should call setTelemetryData method',()=>{
		component.tocPage = false;
		component.contentDetails = {contentType: 'mockContent', identifier: 'mock-identifier', pkgVersion: '1.0'};
		component.setTelemetryData();
        expect(component.telemetryImpression).toEqual({
			context: {
			   env: mockActivatedRoute.snapshot.data.telemetry.env,
			   cdata:[]
			},
			edata: {
			   type: mockActivatedRoute.snapshot.data.telemetry.type,
			   pageid: mockActivatedRoute.snapshot.data.telemetry.pageid,
			   subtype: mockActivatedRoute.snapshot.data.telemetry.subtype,
		       uri: mockRouter.url,
			   duration:mockNavigationHelperService.getPageLoadTime()
			},
			object:{
				id: component.contentDetails['identifier'],
				type: 'mockContentType',
				ver:  '1.0',
				rollup: component.objectRollUp
			}
		});
		expect(component.telemetryImpression.edata['subtype']).toEqual(mockActivatedRoute.snapshot.data.telemetry.subtype);
		expect(component['navigationHelperService'].getPageLoadTime).toHaveBeenCalled();
		expect(component.telemetryImpression.edata['duration']).toEqual(mockNavigationHelperService.getPageLoadTime());
		expect(component.telemetryImpression.object).toEqual({
			id: component.contentDetails['identifier'],
            type: 'mockContentType',
        	ver:  '1.0',
        	rollup: component.objectRollUp
		});
	});
});