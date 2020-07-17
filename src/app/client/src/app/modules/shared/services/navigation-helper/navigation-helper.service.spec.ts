import { SharedModule } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { NavigationHelperService } from './navigation-helper.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of as observableOf } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import { UtilService } from '../util/util.service';
import { configureTestSuite } from '@sunbird/test-util';

class RouterStub {
  // navigate = jasmine.createSpy('navigate');
  navigate = jasmine.createSpy('navigate');
  // events: Observable<NavigationEnd>  = observableOf([
  //   {id: 2, url: '/home', urlAfterRedirects: '/home', toString: () =>  'home' }
  // ]);
}
const fakeActivatedRoute = {
  'params': observableOf({ contentId: 'd0_33567325' }),
  'root': {
    children: [{
      snapshot: {
        queryParams: {}
      }
    }]
  }
};
class UtilServiceMock {
  // public  updateSearchKeyword = jasmine.createSpy('updateSearchKeyword');
  public updateSearchKeyword() { }
}
describe('NavigationHelperService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule.forRoot()],
      providers: [NavigationHelperService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
        { provide: UtilService, useClass: UtilServiceMock }
      ]
    });
  });

  it('should navigate to default route',
    inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
      (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
        service.navigateToLastUrl();
        expect(service.router.navigate).toHaveBeenCalledWith(['/resources']);
      }
    ));

  it('should navigate to profile as value present',
    inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
      (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
        service.previousNavigationUrl = {url: '/profile'};
        service.navigateToLastUrl();
        expect(service.router.navigate).toHaveBeenCalledWith(['/profile']);
      }
    ));

  it('should navigate to with query params',
    inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
      (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
        service.previousNavigationUrl = {url: '/profile', queryParams: 'mockQueryParam'};
        service.navigateToLastUrl();
        expect(service.router.navigate).toHaveBeenCalledWith(['/profile'], {queryParams: 'mockQueryParam'});
      }
    ));

  it('should set navigation from previous url',
    inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
      (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
        const mockUrl = {url: '/profile'};
        spyOn(service, 'getPreviousUrl').and.returnValue(mockUrl);
        service.setNavigationUrl();
        expect(service.previousNavigationUrl).toBe(mockUrl);
      }
    ));

  it('should not set navigation as page is create managed user',
    inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
      (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
        const mockUrl = {url: '/create-managed-user'};
        service.previousNavigationUrl = {url: '/profile'};
        spyOn(service, 'getPreviousUrl').and.returnValue(mockUrl);
        service.setNavigationUrl();
        expect(service.previousNavigationUrl).toEqual({url: '/profile'});
      }
    ));

  it('should not set navigation as page is choose user',
    inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
      (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
        const mockUrl = {url: '/choose-managed-user'};
        service.previousNavigationUrl = {url: '/profile'};
        spyOn(service, 'getPreviousUrl').and.returnValue(mockUrl);
        service.setNavigationUrl();
        expect(service.previousNavigationUrl).toEqual({url: '/profile'});
      }
    ));

  it('should store route history', inject([NavigationHelperService, Router], (service: NavigationHelperService, router) => {
    const history = service.history;
    expect(service).toBeTruthy();
    expect(history).toBeDefined();
    // expect(history).toContain('/home');
  }));

  it('should call clearHistory', inject([NavigationHelperService, Router], (service: NavigationHelperService, router) => {
    service.clearHistory();
    expect(service['_history']).toEqual([]);
  }));

  it('should call getDesktopPreviousUrl', inject([NavigationHelperService, Router, ActivatedRoute, CacheService],
    (service: NavigationHelperService, router, activatedRoute, cacheService) => {

      const history = [
        {
          'url': '/search',
          'queryParams': {
            'key': 'test'
          }
        },
        {
          'url': '/view-all'
        }
      ];
      service['_history'] = history;
      const previousUrl = service.getDesktopPreviousUrl();
      expect(previousUrl).toEqual(history[0]);
    }));

  it('should call goBack when previous URL is search and with queryParams',
    inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
      (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
        const previousUrl = {
          'url': '/search',
          'queryParams': {
            'key': 'test'
          }
        };
        spyOn(service, 'getDesktopPreviousUrl').and.returnValue(previousUrl);
        spyOn(service.history, 'pop');
        spyOn(service.utilService, 'updateSearchKeyword');
        service.goBack();
        expect(service.utilService.updateSearchKeyword).toHaveBeenCalledWith('test');
        expect(service.router.navigate).toHaveBeenCalledWith([previousUrl.url], { queryParams: previousUrl.queryParams });
        expect(service.history.pop).toHaveBeenCalled();
      }));

  it('should call goBack when previous URL is without queryParams',
    inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
      (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
        const previousUrl = {
          'url': '/view-all'
        };
        spyOn(service, 'getDesktopPreviousUrl').and.returnValue(previousUrl);
        service.goBack();
        expect(service.router.navigate).toHaveBeenCalledWith([previousUrl.url]);
      }));

  it('Should emit contentFullScreenEvent as TRUE', inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
    (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
      spyOn(service.contentFullScreenEvent, 'emit');
      service.emitFullScreenEvent(true);
      expect(service.contentFullScreenEvent.emit).toHaveBeenCalledWith(true);
    }));

  it('Should emit contentFullScreenEvent as FALSE', inject([NavigationHelperService, Router, ActivatedRoute, CacheService, UtilService],
    (service: NavigationHelperService, router, activatedRoute, cacheService, utilService: UtilService) => {
      spyOn(service.contentFullScreenEvent, 'emit');
      service.emitFullScreenEvent(false);
      expect(service.contentFullScreenEvent.emit).toHaveBeenCalledWith(false);
    }));

});
