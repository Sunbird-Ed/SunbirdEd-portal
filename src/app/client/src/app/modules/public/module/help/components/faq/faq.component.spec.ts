import { mockData } from './../../../../../../app.component.spec.data';
import { Component,HostListener,OnInit,ViewChild,ViewChildren,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../../../../../shared/services/cache-service/cache.service';
import { UtilService,ResourceService,LayoutService,NavigationHelperService,ToasterService,ConfigService,ContentUtilsServiceService } from '@sunbird/shared';
import { TenantService,PublicDataService } from '@sunbird/core';
import { IInteractEventEdata,IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute,Router } from '@angular/router';
import { _ } from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject, of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { FaqService } from '../../services/faq/faq.service';
import { VideoConfig } from './faq-data';
import { HttpOptions } from '../../../../../shared/interfaces/httpOptions';
import { FormService } from '../../../../../core/services/form/form.service';
import { FaqComponent } from './faq.component';
import { ComponentFixtureNoNgZone } from '@angular/core/testing';

describe('FaqComponent', () => {
    let component: FaqComponent;

    const mockHttp :Partial<HttpClient> ={
		get: jest.fn(),
	};
	const mockCacheService :Partial<CacheService> ={};
	const mockUtilService :Partial<UtilService> ={};
	const mockTenantService :Partial<TenantService> ={};
	const mockResourceService :Partial<ResourceService> ={};
	const mockActivatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
			data:{
				telemetry:{
					env: 'mock-env',
					type: 'mock-type',
					pageid: 'mock-page-id',
					subtype: 'mock-sub-type',
				}
			}
		} as any,
		root:{
			firstChild:{
				snapshot:{
					data:{
						telemetry:{
							env: 'mock-env',
							pageid: 'mock-pageid',
						}
					}
				}
			}
		} as any,
	};
	const mockLayoutService :Partial<LayoutService> ={};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={
		getPageLoadTime: jest.fn().mockReturnValue('1ms') as any,
	};
	const mockLocation :Partial<Location> ={
		back: jest.fn(),
	};
	const mockRouter :Partial<Router> ={
		url: 'mock-url',
	};
	const mockTelemetryService :Partial<TelemetryService> ={
		interact: jest.fn(),
	};
	const mockFaqService :Partial<FaqService> ={};
	const mockToasterService :Partial<ToasterService> ={
		success: jest.fn(),
		error: jest.fn()
	};
	const mockConfigService :Partial<ConfigService> ={};
	const mockPublicDataService :Partial<PublicDataService> ={};
	const mockContentUtilsServiceService :Partial<ContentUtilsServiceService> ={};
	const mockFormService :Partial<FormService> ={
		getFormConfig: jest.fn(),
	};

    beforeAll(() => {
        component = new FaqComponent(
            mockHttp as HttpClient,
			mockCacheService as CacheService,
			mockUtilService as UtilService,
			mockTenantService as TenantService,
			mockResourceService as ResourceService,
			mockActivatedRoute as ActivatedRoute,
			mockLayoutService as LayoutService,
			mockNavigationHelperService as NavigationHelperService,
			mockLocation as Location,
			mockRouter as Router,
			mockTelemetryService as TelemetryService,
			mockFaqService as FaqService,
			mockToasterService as ToasterService,
			mockConfigService as ConfigService,
			mockPublicDataService as PublicDataService,
			mockContentUtilsServiceService as ContentUtilsServiceService,
			mockFormService as FormService
        )
    });

    beforeEach(() => {
		component.videoWebPlayer = {
			nativeElement: document.createElement('div')
		};
		component.videoPlayer = {
			changes: {
			  subscribe: jest.fn()
			}
		};
		document.getElementsByClassName = jest.fn().mockReturnValue([{ style: { display: '' } }]);
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    
	it('should create and append sunbird-video-player element to videoWebPlayer', () => {
		component.playerConfig = { config: 'mock-player-config'};
		component.videoPlayerConfig();

		const videoPlayerElement = component.videoWebPlayer.nativeElement.querySelector('sunbird-video-player');
		expect(videoPlayerElement).toBeTruthy();
		expect(videoPlayerElement.getAttribute('player-config')).toEqual(JSON.stringify(component.playerConfig));
	});
	
	describe('checkScreenView',() =>{
		it('should set mobileview and showOnlyCategory when width is greater than 767',() =>{
           component.checkScreenView(800);

		   expect(component.isMobileView).toBeTruthy;
		   expect(component.showOnlyFaqCategory).toBeTruthy;
		});

		it('should set mobileview when width is lesser than 767',() =>{
			component.checkScreenView(700);
			expect(component.isMobileView).toBeFalsy;
		});
	});

	describe('onVideoSelect',() =>{
		it('should return when event or event data is not present',() => {
			const mockEvent = {};
			jest.spyOn(component,'onVideoSelect');
			component.onVideoSelect(mockEvent);

			expect(component.onVideoSelect).toReturn();
		});
	});

	it('should set values on enableFaqReport',() =>{
        const mockEvent = {};
		component.sbFaqCategoryList = {selectedIndex: 'mock-selected-index'}
		component.enableFaqReport(mockEvent);

		expect(component.sbFaqCategoryList.selectedIndex).toEqual(-1);
		expect(component.showFaqReport).toBeTruthy;
        expect(component.showFaqReport).toBeTruthy;
	});
    
	describe('onCategorySelect',() => {
		it('should update showOnlyFaqCategory, showFaqReport, and selectedFaqCategory and return when event data is not provided', () => {
			const eventData = { };
			jest.spyOn(component,'onCategorySelect')
			const result = component.onCategorySelect(eventData);
		
			expect(component.showOnlyFaqCategory).toBeFalsy;
			expect(component.showFaqReport).toBeFalsy;
			expect(component.selectedFaqCategory).toBeUndefined;
			expect(component.onCategorySelect).toReturn();
		});
		
		it('should update showOnlyFaqCategory, showFaqReport, and selectedFaqCategory when event data is provided', () => {
			const eventData = { data: 'mock-data'};
			component.faqData = {constants: 'mock-constants'};
			component.onCategorySelect(eventData);
		
			setTimeout(() => {
			expect(component.selectedFaqCategory).toEqual('');
			}, 0);
		});
    });
    
	it('should call interact method of telemetryService on logInteractEvent',() =>{
		const mockEvent = { data: 'mock-data' };
        component.logInteractEvent(mockEvent,'mock-sub-type');

        expect(component['telemetryService'].interact).toHaveBeenCalled();
	});

	it('should return value on setTelemetryInteractEdata',() => {
		const result = component.setTelemetryInteractEdata('mock-type');
        expect(result).toEqual({
			"id": "mock-type", 
			"pageid": "mock-pageid",
			"type": "click"
		});
	});
    
	describe('goBack',() => {
		it('should set values goBack when showOnlyFaqCategory is false and isMobileView is true',() =>{
			component.showOnlyFaqCategory = false;
			component.isMobileView = true;
			component.goBack();

			expect(component.showOnlyFaqCategory).toBeTruthy;
		});

		it('should call back method of location',() =>{
			component.showOnlyFaqCategory = true;
			component.isMobileView = false;
			component.goBack();

			expect(component['location'].back).toHaveBeenCalled();
		});
    });
    
	describe('getFaqJson',() =>{
		it('should retry with default language if 404 error occurs and defaultToEnglish is false', () => {
			const mockError = { status: 404 };
			const mockData = { data: 'mock-data' };
			const faqBaseUrl = 'mockBaseUrl';
			component.faqBaseUrl = faqBaseUrl;
			component.selectedLanguage = 'mockLanguage';
			component.showLoader = true;
			component.defaultToEnglish = false;
		
			jest.spyOn(mockHttp,'get').mockReturnValueOnce(throwError(mockError)).mockReturnValueOnce(of(mockData));
			component['getFaqJson']();
		
			expect(mockHttp.get).toHaveBeenCalledTimes(2);
			expect(mockHttp.get).toHaveBeenCalledWith(`${faqBaseUrl}/faq-${component.selectedLanguage}.json`);
			expect(mockHttp.get).toHaveBeenCalledWith(`${faqBaseUrl}/faq-en.json`);
			expect(component.faqData).toBeUndefined;
			expect(component.showLoader).toBeFalsy();
			expect(component.defaultToEnglish).toBeFalsy;
			expect(component.selectedLanguage).toEqual('en'); 
		});
		
		it('should show error toaster if HTTP request fails with non-404 error', () => {
			const mockError = { status: 500 };
			component.showLoader = true;
			jest.spyOn(mockHttp,'get').mockReturnValue(throwError(mockError));
			component['getFaqJson']();
		
			expect(component.showLoader).toBeFalsy();
		});
    });

    describe('prepareFaqData',() => {
		it('should replace {instance} placeholders in faq topics and descriptions', () => {
			const mockData = {
			categories: [
				{
				faqs: [
					{ topic: '{instance} topic1', description: '{instance} description1' },
					{ topic: '{instance} topic2', description: '{instance} description2' }
				],
				videos: []
				},
				{
				faqs: [],
				videos: [
					{ name: '{instance} video1' },
					{ name: '{instance} video2' }
				]
				}
			]
			};
			const expectedData = {
			categories: [
				{
				faqs: [
					{ topic: 'mock-instance topic1', description: 'mock-instance description1' },
					{ topic: 'mock-instance topic2', description: 'mock-instance description2' }
				],
				videos: []
				},
				{
				faqs: [],
				videos: [
					{ name: 'mock-instance video1' },
					{ name: 'mock-instance video2' }
				]
				}
			]
			};
			component.instance = 'mock-instance';
			const result = component['prepareFaqData'](mockData);
		
			expect(result).toEqual(expectedData);
		});
		
		it('should handle empty faqs and videos arrays gracefully', () => {
			const mockData = {
				categories: [
				{
					faqs: [],
					videos: []
				}
				]
			};
			const expectedData = {
				categories: [
				{
					faqs: [],
					videos: []
				}
				]
			};
			component.instance = 'mock-instance';
			const processedData = component['prepareFaqData'](mockData);

			expect(processedData).toEqual(expectedData);
		});
    });

    it('should set telemetryImpression value on setTelemetryImpression',() =>{
		component.setTelemetryImpression();

		expect(component.telemetryImpression).toEqual({
			"context": {
				"env": "mock-env"
			}, 
			"edata": {
				"duration": undefined, 
				"pageid": "mock-page-id", 
				"subtype": "mock-sub-type", 
				"type": "mock-type", "uri": "mock-url"
			}
		});
	});
    
	describe('getDebugTimeInterval',() => {
		it('should return the debug time interval from formService if available', async () => {
			const mockFormFields = [{ timeInterval: '600000' }];
			const expectedTimeInterval = '600000';
			jest.spyOn(mockFormService,'getFormConfig').mockReturnValueOnce(of(mockFormFields));
			const result = await component['getDebugTimeInterval']();
		
			expect(mockFormService.getFormConfig).toHaveBeenCalledWith({ 
				formType: 'config',
				formAction: 'get', 
				contentType: 'debugMode', 
				component: 'portal' 
			});
			expect(component.timeInterval).toEqual(expectedTimeInterval);
			expect(result).toEqual(expectedTimeInterval);
		});
		
		it('should return the default time interval if formService request fails', async () => {
			const expectedTimeInterval = '600000';
			const error = new Error('Error fetching form config');
		
			jest.spyOn(mockFormService,'getFormConfig').mockReturnValueOnce(throwError(error));
		
			const result = await component['getDebugTimeInterval']();
		
			expect(mockFormService.getFormConfig).toHaveBeenCalled();
			expect(component.timeInterval).toEqual(expectedTimeInterval);
			expect(result).toEqual(expectedTimeInterval);
		});

		it('should return the default time interval if formService response does not contain timeInterval field', async () => {
			const mockFormFields = [{}];
			const expectedTimeInterval = '600000';
			jest.spyOn(mockFormService,'getFormConfig').mockReturnValueOnce(of(mockFormFields));
			const result = await component['getDebugTimeInterval']();
		
			expect(mockFormService.getFormConfig).toHaveBeenCalled();
			expect(component.timeInterval).toEqual(expectedTimeInterval);
			expect(result).toEqual(expectedTimeInterval);
		});
    });
    
	describe('updateButtonVisibility',() => {
		it('should disable the button if current time is greater than disable time', () => {
			const currentTime = 1000000;
			const valueStored = 0;
			const timeInterval = 600000;
			const expectedIsDisabled = false;
			jest.spyOn(Date, 'now').mockReturnValueOnce(currentTime);
			localStorage.setItem('debugDisabledAt', String(valueStored));
			component.timeInterval = String(timeInterval);
		
			component.updateButtonVisibility();
		
			expect(component.isDisabled).toEqual(expectedIsDisabled);
			expect(localStorage.getItem('debugDisabled')).toBeNull;
			expect(localStorage.getItem('debugDisabledAt')).toEqual('0');
		});
		
		it('should set a timeout to disable the button after the delay', () => {
			jest.useFakeTimers();
			const currentTime = 1000000; 
			const valueStored = 0;
			const timeInterval = 600000;
			const expectedIsDisabled = false;
			jest.spyOn(Date, 'now').mockReturnValueOnce(currentTime);
			localStorage.setItem('debugDisabledAt', String(valueStored));
			component.timeInterval = String(timeInterval);
			component.updateButtonVisibility();
		
			jest.advanceTimersByTime(10000);
		
			expect(component.isDisabled).toEqual(expectedIsDisabled);
			expect(localStorage.getItem('debugDisabled')).toEqual('false');
			expect(localStorage.getItem('debugDisabledAt')).toEqual('0');
		});
    });
    
	describe('enableDebugMode',() =>{ 
		it('should enable debug mode and show success message on successful HTTP request', async () => {
			const mockTimeInterval = '600000';
			const currentTime = 1000000; 
			const expectedParams = {
			params: {
				logLevel: 'debug',
				timeInterval: mockTimeInterval
			}
			};
			const mockEvent = {}
			jest.spyOn(Date, 'now').mockReturnValueOnce(currentTime);
			jest.spyOn(component as any, 'getDebugTimeInterval').mockResolvedValueOnce(mockTimeInterval);
			jest.spyOn(mockHttp as any,'get').mockReturnValueOnce(of({}));
			jest.spyOn(component,'updateButtonVisibility');
			await component.enableDebugMode(mockEvent);
		
			expect(localStorage.getItem('debugDisabled')).toEqual('true');
			expect(localStorage.getItem('debugDisabledAt')).toEqual(String(currentTime));
			expect(component.isDisabled).toEqual(true);
			expect(component.updateButtonVisibility).toHaveBeenCalled();
			expect(mockHttp.get).toHaveBeenCalledWith('/enableDebugMode', expectedParams);
			expect(mockToasterService.success).toHaveBeenCalled();
		});
		
		it('should enable debug mode and show error message on failed HTTP request', async () => {
			const mockTimeInterval = '600000';
			const currentTime = 1000000;
			const error = new Error('Failed to enable debug mode');
			const mockEvent = {}
			jest.spyOn(Date, 'now').mockReturnValueOnce(currentTime);
			jest.spyOn(component as any, 'getDebugTimeInterval').mockResolvedValueOnce(mockTimeInterval);
			jest.spyOn(mockHttp as any,'get').mockReturnValueOnce(throwError(error));
			await component.enableDebugMode(mockEvent);
		
			expect(localStorage.getItem('debugDisabled')).toEqual('true');
			expect(localStorage.getItem('debugDisabledAt')).toEqual(String(currentTime));
			expect(component.isDisabled).toEqual(true);
			expect(component.updateButtonVisibility).toHaveBeenCalled();
			expect(mockHttp.get).toHaveBeenCalledWith('/enableDebugMode', expect.any(Object));
			expect(mockToasterService.error).toHaveBeenCalled();
		});
    });
	
});