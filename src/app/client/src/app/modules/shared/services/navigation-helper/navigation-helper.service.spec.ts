import { Injectable,EventEmitter } from '@angular/core';
import { Router,NavigationEnd,ActivatedRoute,NavigationStart } from '@angular/router';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { _ } from 'lodash-es';
import { UtilService } from '../util/util.service';
import { Observable, Subject,asyncScheduler } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { NavigationHelperService } from './navigation-helper.service';

describe('NavigationHelperService', () => {
    let navigationHelperService: NavigationHelperService;
    const mockRouter :Partial<Router> ={
        events: new Subject(),
        navigate: jest.fn(),  
        navigateByUrl: jest.fn(),
        get url() {
            return 'profile';
        },
    };
	const mockActivatedRoute :Partial<ActivatedRoute> ={
    };
	const mockCacheService :Partial<CacheService> ={
        set: jest.fn(),
        get: jest.fn(),
    };
	const mockUtilService :Partial<UtilService> ={
        updateSearchKeyword: jest.fn()
    };

    beforeAll(() => {
        navigationHelperService = new NavigationHelperService(
            mockRouter as Router,
			mockActivatedRoute as ActivatedRoute,
			mockCacheService as CacheService,
			mockUtilService as UtilService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        navigationHelperService.clearHistory();
    });
            
    it('should create a instance of navigationHelperService', () => {
        expect(navigationHelperService).toBeTruthy();
    });

    it('should initialize the page start time and set up window.onunload event', () => {
        const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(123456789);
        navigationHelperService['_history'] = [
            { url: '/previous-url-1' },
            { url: '/previous-url-2' },
        ];
        navigationHelperService.initialize();
    
        expect(navigationHelperService['pageStartTime']).toEqual(123456789);
        const unloadEvent = new Event('unload');
        window.dispatchEvent(unloadEvent);
        
        expect(navigationHelperService.cacheService.set).toHaveBeenCalledWith(
            navigationHelperService['cacheServiceName'],
            navigationHelperService.history[navigationHelperService['_history'].length - 2]
        );
        mockDateNow.mockRestore();
    });
    
    
    describe('storeResourceCloseUrl', () => {
        it('should store resource close URL correctly', () => {
            navigationHelperService['_history'] = [
            { url: '/previous-url-1' },
            { url: '/previous-url-2' },
            ];
            navigationHelperService.storeResourceCloseUrl();
        
            expect(navigationHelperService['_resourceCloseUrl']).toEqual({ url: '/previous-url-2' });
        });
    });

    describe('storeWorkSpaceCloseUrl', () => {
        it('should store workspace close URL correctly', () => {
            navigationHelperService['_history'] = [
            { url: '/workspace-url-1' },
            { url: '/workspace-url-2', queryParams: { key: 'value' } },
            ];
            navigationHelperService.storeWorkSpaceCloseUrl();
        
            expect(navigationHelperService['_workspaceCloseUrl']).toEqual({ url: '/workspace-url-2', queryParams: { key: 'value' } });
        });
    });

    describe('navigateToResource', () => {
        it('should navigate to the resource close URL with queryParams if available', () => {
            navigationHelperService['_resourceCloseUrl'] = { url: '/resource-url', queryParams: { key: 'value' } };
            navigationHelperService.navigateToResource();
        
            expect(navigationHelperService.router.navigate).toHaveBeenCalledWith(['/resource-url'], {
            queryParams: { key: 'value' }
            });
        });

        it('should navigate to the resource close URL without queryParams if not available', () => {
            navigationHelperService['_resourceCloseUrl'] = { url: '/resource-url' };
            navigationHelperService.navigateToResource();

            expect(navigationHelperService.router.navigate).toHaveBeenCalledWith(['/resource-url']);
        });

        it('should navigate to the default URL if workspace close URL is not available', () => {
            navigationHelperService['_resourceCloseUrl'] = undefined;
            navigationHelperService.navigateToResource('/default-url');
        
            expect(navigationHelperService.router.navigateByUrl).toHaveBeenCalledWith('/default-url');
        });
    });
    
    describe('getPageLoadTime', () => {
        it('should calculate the page load time correctly', () => {
            navigationHelperService['pageStartTime'] = 123000000;
            jest.spyOn(Date, 'now').mockReturnValue(123456789);
            const result = navigationHelperService.getPageLoadTime();
        
            expect(result).toEqual((123456789 - 123000000) / 1000);
        }); 
    });   

    describe('navigateToWorkSpace', () => {
        it('should navigate to the workspace close URL with queryParams if available', () => {
            navigationHelperService['_workspaceCloseUrl'] = { url: '/workspace-url', queryParams: { key: 'value' } };
            navigationHelperService.navigateToWorkSpace();
        
            expect(navigationHelperService.router.navigate).toHaveBeenCalledWith(['/workspace-url'], {
            queryParams: { key: 'value' },
            });
            expect(navigationHelperService['_workspaceCloseUrl']).toBeUndefined();
        });

        it('should navigate to the workspace close URL without queryParams if not available', () => {
            navigationHelperService['_workspaceCloseUrl'] = { url: '/workspace-url' };
            navigationHelperService.navigateToWorkSpace();

            expect(navigationHelperService.router.navigate).toHaveBeenCalledWith(['/workspace-url']);
            expect(navigationHelperService['_workspaceCloseUrl']).toBeUndefined();
        });

        it('should navigate to the default URL if workspace close URL is not available', () => {
            navigationHelperService['_workspaceCloseUrl'] = undefined;
            navigationHelperService.navigateToWorkSpace('/default-url');
        
            expect(navigationHelperService.router.navigate).toHaveBeenCalledWith(['/default-url']);
        });
    });
    
    describe('getPreviousUrl', () => {
        it('should return the previous URL from history if available and cacheservice returns null', () => {
            navigationHelperService['_history'] = [
                { url: '/previous-url-1' },
                { url: '/previous-url-2' },
            ];
            jest.spyOn(navigationHelperService.cacheService, 'get').mockReturnValue(null);
            const result = navigationHelperService.getPreviousUrl();
        
            expect(result).toEqual({ url: '/previous-url-1' });
        });

        it('should return the previous URL from history if available and cacheservice returns a value', () => {
            navigationHelperService['_history'] = [
                { url: '/previous-url-1' },
                { url: '/previous-url-2' },
            ];
            jest.spyOn(navigationHelperService.cacheService, 'get').mockReturnValue({ url: '/session-url'});
            const result = navigationHelperService.getPreviousUrl();
        
            expect(result).toEqual({ url: '/previous-url-1' });
        });

        it('should return the URL from session if history is not available', () => {
            navigationHelperService['_history']= [];
            jest.spyOn(navigationHelperService.cacheService, 'get').mockReturnValue({ url: '/session-url'});
            const result = navigationHelperService.getPreviousUrl();

            expect(result).toEqual({ url: '/session-url' });
        });

        it('should return the default URL if both history and session URLs are not available', () => {
            navigationHelperService['_history']= [];
            jest.spyOn(navigationHelperService.cacheService, 'get').mockReturnValue(null);
            const result = navigationHelperService.getPreviousUrl();

            expect(result).toEqual({ url: '/explore' });
        });
    });
    
    describe('navigateToPreviousUrl()', () => {
        it('should navigate to default URL when previous URL is /explore', () => {
          jest.spyOn(navigationHelperService, 'getPreviousUrl').mockReturnValue({ url: '/explore' });
          navigationHelperService.navigateToPreviousUrl();

          expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore']);
        });
    });

    
    describe('getDesktopPreviousUrl', () => {
        it('should return the previous URL when history is not empty', () => {
            const history = [
            { url: '/first' },
            { url: '/second', queryParams: { key: 'value' } },
            ];
            navigationHelperService['_history'] = history;
            const result = navigationHelperService.getDesktopPreviousUrl();
        
            expect(result).toEqual(history[0]);
        });
        
        it('should return default URL when history is empty', () => {
            navigationHelperService['_history'] = [];
            const result = navigationHelperService.getDesktopPreviousUrl();

            expect(result).toEqual({ url: '/' });
        });
    });

    describe('goBack', () => {
        it('should navigate with queryParams when previous URL has /search', () => {
            const previousUrl = { url: '/search', queryParams: { key: 'value' } };
            navigationHelperService['_history'] = [previousUrl];
            jest.spyOn(navigationHelperService, 'getDesktopPreviousUrl').mockReturnValue(previousUrl);
            navigationHelperService.goBack();
        
            expect(mockUtilService.updateSearchKeyword).toHaveBeenCalledWith(previousUrl.queryParams.key);
        });
        
        it('should navigate with queryParams for other urls than search', () => {
            const previousUrl = { url: '/mock-url', queryParams: { key: 'value' } };
            navigationHelperService['_history'] = [previousUrl];
            jest.spyOn(navigationHelperService, 'getDesktopPreviousUrl').mockReturnValue(previousUrl);
            navigationHelperService.goBack();
        
            expect(mockRouter.navigate).toHaveBeenCalledWith([previousUrl.url], { queryParams: previousUrl.queryParams });
        });
        
        it('should navigate without queryParams for other urls than search', () => {
            const previousUrl = { url: '/mock-url' };
            navigationHelperService['_history'] = [previousUrl];
            jest.spyOn(navigationHelperService, 'getDesktopPreviousUrl').mockReturnValue(previousUrl);
            navigationHelperService.goBack();

            expect(mockRouter.navigate).toHaveBeenCalledWith([previousUrl.url]);
        });

        it('should navigate with queryParams when previous URL has /search', () => {
            const previousUrl = { url: '/mock-url'};
            Object.defineProperty(navigationHelperService.router, 'url', {value: '/profile' });
            navigationHelperService['_history'] = [previousUrl];
            jest.spyOn(navigationHelperService, 'getDesktopPreviousUrl').mockReturnValue(previousUrl);
            navigationHelperService.goBack();
        
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore']);
        });
    });

    describe('clearHistory', () => {
        it('should clear the history array', () => {
            navigationHelperService['_history'] = [{ url: '/some-url' }];
            navigationHelperService.clearHistory();

            expect(navigationHelperService['_history']).toEqual([]);
        });
    });
    
    it('should emit full-screen event', () => {
        const valueToEmit = 'someValue';
        const emitSpy = jest.spyOn(navigationHelperService.contentFullScreenEvent, 'emit');
        navigationHelperService.emitFullScreenEvent(valueToEmit);
    
        expect(emitSpy).toHaveBeenCalledWith(valueToEmit);
    });
    
    it('should handle content manager visibility on fullscreen', () => {
        const valueToEmit = 'someValue';
        const handleCMvisibilitySpy = jest.spyOn(navigationHelperService.handleCMvisibility, 'emit');
        navigationHelperService.handleContentManagerOnFullscreen(valueToEmit);
    
        expect(handleCMvisibilitySpy).toHaveBeenCalledWith(valueToEmit);
    });

    describe('setNavigationUrl', () => {
        it('should set previousNavigationUrl to provided navigationUrl', () => {
            const navigationUrl = { url: '/example', queryParams: { key: 'value' } };
            navigationHelperService.setNavigationUrl(navigationUrl);
        
            expect(navigationHelperService.previousNavigationUrl).toEqual(navigationUrl);
        });
        
        it('should set previousNavigationUrl to default value if no navigationUrl provided', () => {
            const defaultUrl = '/explore'
            jest.spyOn(navigationHelperService,'getPreviousUrl').mockReturnValue({url: '/explore'});
            navigationHelperService.setNavigationUrl();
            const expectedDefaultNavigationUrl = { url: defaultUrl };

            expect(navigationHelperService.previousNavigationUrl).toEqual(expectedDefaultNavigationUrl);
        });
    });
    describe('setNavigationUrl', () => {
        it('should navigate to the last URL with queryparams', () => {
            const previousUrl = { url: '/previous', queryParams: { key: 'value' } };
            navigationHelperService.previousNavigationUrl = previousUrl;
            navigationHelperService.navigateToLastUrl();

            expect(mockRouter.navigate).toHaveBeenCalledWith([previousUrl.url], { queryParams: previousUrl.queryParams });
        });

        it('should navigate to the last URL without queryparams', () => {
            const previousUrl = { url: '/previous' };
            navigationHelperService.previousNavigationUrl = previousUrl;
            navigationHelperService.navigateToLastUrl();
            
            expect(mockRouter.navigate).toHaveBeenCalledWith([previousUrl.url]);
        });
        
        it('should navigate to the last URL without queryparams', () => {
            navigationHelperService.previousNavigationUrl = undefined;
            navigationHelperService.navigateToLastUrl();
            
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/resources']);
        });
    });
      
    describe('popHistory', () => {
        it('should pop the last entry from the history', () => {
            const history = [
            { url: '/first' },
            { url: '/second' },
            { url: '/third' },
            ];
            navigationHelperService['_history'] = history;
            navigationHelperService.popHistory();

            expect(navigationHelperService['_history']).toEqual([
            { url: '/first' },
            { url: '/second' },
            ]);
        });
        
        it('should not pop if history is empty', () => {
            navigationHelperService['_history'] = [];
            navigationHelperService.popHistory();

            expect(navigationHelperService['_history']).toEqual([]);
        });
    });
    
});