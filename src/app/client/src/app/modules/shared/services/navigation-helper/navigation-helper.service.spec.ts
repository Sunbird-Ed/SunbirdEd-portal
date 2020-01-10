import { SharedModule } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { NavigationHelperService } from './navigation-helper.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of as observableOf } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CacheService } from 'ng2-cache-service';

class RouterStub {
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
describe('NavigationHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule.forRoot()],
      providers: [NavigationHelperService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    });
  });

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
      service['_cacheServiceName'] = 'previousUrl';
      spyOn(cacheService, 'get');
      spyOn(service.history, 'pop');

      const previousUrl = service.getDesktopPreviousUrl();
      expect(service.history.pop).toHaveBeenCalled();
      expect(previousUrl).toEqual(history[0]);
    }));
});
