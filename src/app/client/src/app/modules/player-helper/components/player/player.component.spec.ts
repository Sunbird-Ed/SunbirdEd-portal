import { ConfigService,NavigationHelperService,UtilService } from '@sunbird/shared';
import { ChangeDetectorRef } from '@angular/core';
import { _ } from 'lodash-es';
import { Router } from '@angular/router';
import { ToasterService,ResourceService,ContentUtilsServiceService } from '@sunbird/shared';
import {  of } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService,FormService } from '../../../core/services';
import { ContentService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
    let component: PlayerComponent;
    
    const mockConfigService :Partial<ConfigService> ={
		urlConFig:{
			URLS:{
				TELEMETRY:{
			        SYNC: 'mock-id'
				}
			}
		},
		appConfig:{
			PLAYER_CONFIG:{
				MIME_TYPE:{
					questionset: 'mock-question-set'
				}
			}
		}
	};
	const mockRouter :Partial<Router> ={};
	const mockToasterService :Partial<ToasterService> ={};
	const mockResourceService :Partial<ResourceService> ={};
	const mockNavigationHelperService :Partial<NavigationHelperService> ={};
	const mockDeviceDetectorService :Partial<DeviceDetectorService> ={};
	const mockUserService :Partial<UserService> ={};
	const mockFormService :Partial<FormService> ={
		getFormConfig: jest.fn()
	};
	const mockContentUtilsServiceService :Partial<ContentUtilsServiceService> ={};
	const mockContentService :Partial<ContentService> ={
		post: jest.fn().mockImplementation(() => { }),
	};
	const mockCdr :Partial<ChangeDetectorRef> ={};
	const mockPlayerService :Partial<PublicPlayerService> ={};
	const mockUtilService :Partial<UtilService> ={};

    beforeAll(() => {
        component = new PlayerComponent(
            mockConfigService as ConfigService,
			mockRouter as Router,
			mockToasterService as ToasterService,
			mockResourceService as ResourceService,
			mockNavigationHelperService as NavigationHelperService,
			mockDeviceDetectorService as DeviceDetectorService,
			mockUserService as UserService,
			mockFormService as FormService,
			mockContentUtilsServiceService as ContentUtilsServiceService,
			mockContentService as ContentService,
			mockCdr as ChangeDetectorRef,
			mockPlayerService as PublicPlayerService,
			mockUtilService as UtilService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

	describe('loadPlayer',()=>{
		it('should load new player when formService returns data', () => {
			const formConfigMock = [
			  { mimeType: 'video/mp4', version: 2, threshold: 0.5, type: 'pdf-player' },
			];
			jest.spyOn(mockFormService,'getFormConfig').mockReturnValue(of(formConfigMock));
			jest.spyOn(component,'checkForQumlPlayer');
			jest.spyOn(component,'loadOldPlayer');
			component.loadPlayer();
		    
			expect(component.checkForQumlPlayer).toHaveBeenCalled();
			expect(mockFormService.getFormConfig).toHaveBeenCalledWith({
			  formType: 'content',
			  formAction: 'play',
			  contentType: 'player',
			});
			expect(component.playerLoaded).toBeFalsy();
			expect(component.loadOldPlayer).toHaveBeenCalled();
		});
    });

	describe('load players as web components',()=>{
		const customElementMock = {
			append: jest.fn()
		};

		it('should create custom pdf element and append it to pdf view child nativeElement', () => {
			component.playerConfig ={ context: 'mock-context', data: 'mock-data', metadata: 'mock-meta', config: 'mock-config'}
			component.videoPlayer = { nativeElement: customElementMock };
			const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
				setAttribute: jest.fn(),
				addEventListener: jest.fn(),
			} as any);	
			component.videoPlayerConfig();
			
			expect(createElementSpy).toHaveBeenCalledWith('sunbird-video-player');
			expect(createElementSpy).toHaveBeenCalledTimes(1);

			const pdfElement = document.createElement('sunbird-video-player');
			expect(pdfElement.setAttribute).toHaveBeenCalledWith('player-config', JSON.stringify(component.playerConfig));
			expect(pdfElement.addEventListener).toHaveBeenCalledWith('playerEvent', expect.any(Function));
			expect(pdfElement.addEventListener).toHaveBeenCalledWith('telemetryEvent', expect.any(Function));
			expect(customElementMock.append).toHaveBeenCalled();
		});

    });

	it('should call contentService.post and remove playerElement on ngOnDestroy', () => {
		const playerElementMock = {
		  contentWindow: {
			telemetry_web: {
			  tList: ['{"event": "someEvent"}', '{"event": "anotherEvent"}']
			}
		  },
		  remove: jest.fn() 
		};
		component.unsubscribe = {
			next: jest.fn(),
			complete: jest.fn()
		} as any;
		component.contentIframe = { nativeElement: playerElementMock };
		const postSpy = (mockContentService.post as any).mockReturnValue(of({ }));

		component.ngOnDestroy();

		expect(postSpy).toHaveBeenCalledWith({
		  url: 'mock-id',
		  data: {
			id: 'api.sunbird.telemetry',
			ver: '3.0',
			events: playerElementMock.contentWindow.telemetry_web.tList.map(item => JSON.parse(item))
		  }
		});
		expect(playerElementMock.remove).toHaveBeenCalled();
		expect(component.unsubscribe.next).toHaveBeenCalled();
		expect(component.unsubscribe.complete).toHaveBeenCalled();
	});

});