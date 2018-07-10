import { SharedModule } from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { NavigationHelperService } from './navigation-helper.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of as observableOf } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
  // events: Observable<NavigationEnd>  = observableOf([
  //   {id: 2, url: '/home', urlAfterRedirects: '/home', toString: () =>  'home' }
  // ]);
}
const fakeActivatedRoute = {
  'params': observableOf({ contentId: 'd0_33567325' }),
  'root': {
    children: [{snapshot: {
      queryParams: {}
    }}]
  }
};
describe('NavigationHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule.forRoot()],
      providers: [NavigationHelperService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute},
        { provide: Router, useClass: RouterStub }]
    });
  });

  it('should store route history', inject([NavigationHelperService, Router], (service: NavigationHelperService, router) => {
    const history = service.history;
    expect(service).toBeTruthy();
    expect(history).toBeDefined();
    // expect(history).toContain('/home');
  }));
});
