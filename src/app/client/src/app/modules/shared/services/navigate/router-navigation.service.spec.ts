import { TestBed, inject } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { configureTestSuite } from '@sunbird/test-util';
import { RouterNavigationService } from './router-navigation.service';
import { Observable, of } from 'rxjs';

class RouterStub {
  public navigationEnd = new NavigationEnd(0, '/explore', '/explore');
  public url = '';
  public events = new Observable(observer => {
    observer.next(this.navigationEnd);
    observer.complete();
  });
  public navigate() {
    return of({});
  }
}

describe('RouterNavigationService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouterNavigationService,
        { provide: Router, useClass: RouterStub }
      ]
    });
  });

  it('should be created', inject([RouterNavigationService], (service: RouterNavigationService) => {
    expect(service).toBeTruthy();
  }));

  it('should call navigateToParentUrl', inject([RouterNavigationService], (service: RouterNavigationService) => {
    let routeMock: any = { snapshot: {},
      parent: {
        url: [
          {
            path: '/home'
          }
        ]
      }
    };
    service.navigateToParentUrl(routeMock);
    expect(service.parentUrl).toEqual('/home');
  }));

});
