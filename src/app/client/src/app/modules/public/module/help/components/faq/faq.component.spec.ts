import { Component,HostListener,OnInit,ViewChild,ViewChildren,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../../../../../shared/services/cache-service/cache.service';
import { UtilService,ResourceService,LayoutService,NavigationHelperService,ToasterService,ConfigService,ContentUtilsServiceService } from '@sunbird/shared';
import { TenantService,PublicDataService } from '@sunbird/core';
import { IInteractEventEdata,IImpressionEventInput,TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute,Router } from '@angular/router';
import { _ } from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { FaqService } from '../../services/faq/faq.service';
import { VideoConfig } from './faq-data';
import { HttpOptions } from '../../../../../shared/interfaces/httpOptions';
import { FormService } from '../../../../../core/services/form/form.service';
import { FaqComponent } from './faq.component';
import { ComponentFixtureNoNgZone } from '@angular/core/testing';

describe('FaqComponent', () => {
    let component: FaqComponent;

    const mockHttp :Partial<HttpClient> ={};
	const mockCacheService :Partial<CacheService> ={};
	const mockUtilService :Partial<UtilService> ={};
	const mockTenantService :Partial<TenantService> ={};
	const mockResourceService :Partial<ResourceService> ={};
	const mockActivatedRoute :Partial<ActivatedRoute> ={
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
	const mockNavigationHelperService :Partial<NavigationHelperService> ={};
	const mockLocation :Partial<Location> ={
		back: jest.fn(),
	};
	const mockRouter :Partial<Router> ={};
	const mockTelemetryService :Partial<TelemetryService> ={
		interact: jest.fn(),
	};
	const mockFaqService :Partial<FaqService> ={};
	const mockToasterService :Partial<ToasterService> ={};
	const mockConfigService :Partial<ConfigService> ={};
	const mockPublicDataService :Partial<PublicDataService> ={};
	const mockContentUtilsServiceService :Partial<ContentUtilsServiceService> ={};
	const mockFormService :Partial<FormService> ={};

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

		it('should set playerConfig and showVideoModal when event data is provided', () => {
			const eventData = {
			  thumbnail: 'thumbnail-url',
			  name: 'video-name',
			  url: 'video-url'
			};
		    const videoSpy = jest.spyOn(component,'videoPlayerConfig')
			component.onVideoSelect({ data: eventData });
		
			expect(component.playerConfig).toEqual({
				"config": "mock-player-config",
			});
			expect(component.showVideoModal).toBe(false);
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
});