import { Observable } from 'rxjs/Observable';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from './search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, Params, UrlSegment, NavigationEnd} from '@angular/router';
import 'rxjs/add/operator/filter';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let location: Location;
  let router: Router;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  class MockRouter {
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
      providers: [ResourceService, ConfigService,
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
});
