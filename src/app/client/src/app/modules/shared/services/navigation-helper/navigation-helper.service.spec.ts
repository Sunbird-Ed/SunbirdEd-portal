import { SharedModule } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { NavigationHelperService } from './navigation-helper.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
  events: Observable<NavigationEnd>  = Observable.from([
    {id: 2, url: '/home', urlAfterRedirects: '/home', toString: () =>  'home' }
  ]);
}
describe('NavigationHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      providers: [NavigationHelperService,
        { provide: Router, useClass: RouterStub }]
    });
  });

  it('should store route history', inject([NavigationHelperService, Router], (service: NavigationHelperService, router) => {
    router.events.filter(event => event instanceof NavigationEnd).subscribe((urlAfterRedirects: NavigationEnd) => {
      console.log(urlAfterRedirects);
    });
    const history = service.history;
    expect(service).toBeTruthy();
    expect(history).toBeDefined();
    // expect(history).toContain('/home');
  }));
});
