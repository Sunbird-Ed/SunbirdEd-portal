import { Observable } from 'rxjs';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick, inject} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from './search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, Params, UrlSegment, NavigationEnd} from '@angular/router';

import { CacheService } from 'ng2-cache-service';
describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let location: Location;
  let router: Router;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  class MockRouter {
    navigate = jasmine.createSpy('navigate');
    public navigationEnd = new NavigationEnd(1, '/learn', '/learn');
    public navigationEnd2 = new NavigationEnd(2, '/search/All/1', '/search/All/1');
    public events = new Observable(observer => {
      observer.next(this.navigationEnd);
      observer.complete();
    });
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports: [SuiModule, FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService,
        { provide: Router, useClass: MockRouter},
         { provide: ActivatedRoute, useValue: {queryParams: {
          subscribe: (fn: (value: Params) => void) => fn({
            subjects : ['english']
          })}  }}, Location],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onchange method', ( ) => {
    component.search = {All: '/search/All'};
    component.selectedOption = 'All';
    component.onChange();
    expect(router.navigate).toHaveBeenCalledWith(['/search/All', 1]);
  });
  it('should call onEnter method', ( ) => {
    component.search = {All: '/search/All'};
    component.selectedOption = 'All';
    const key = 'hello';
    component.queryParam['key'] = key;
    component.onEnter(key);
    expect(router.navigate).toHaveBeenCalledWith(['/search/All', 1], {queryParams:  component.queryParam});
  });
});
