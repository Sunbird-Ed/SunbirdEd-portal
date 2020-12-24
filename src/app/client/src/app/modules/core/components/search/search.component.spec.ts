import { Observable } from 'rxjs';
import { ResourceService, ConfigService, BrowserCacheTtlService, SharedModule, LayoutService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick, inject} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from './search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, Params, UrlSegment, NavigationEnd} from '@angular/router';
import { UserService, LearnerService, ContentService } from '@sunbird/core';
import { mockResponse } from './search.component.spec.data';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { configureTestSuite } from '@sunbird/test-util';

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
    public url = '/profile';
    public events = new Observable(observer => {
      observer.next(this.navigationEnd);
      observer.complete();
    });
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [SharedModule.forRoot(), TelemetryModule.forRoot(),
        CoreModule, SuiModule, FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [ResourceService, ConfigService, CacheService, LayoutService, BrowserCacheTtlService, UserService, LearnerService, LayoutService,
      ContentService, { provide: Router, useClass: MockRouter},
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
    component.layoutConfiguration = {};
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
  it('should hide users search from dropdown if loggedin user is not rootorgadmin', ( ) => {
    const userService = TestBed.get(UserService);
    const resourceService = TestBed.get(ResourceService);
    const route = TestBed.get(Router);
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData.userProfile });
    resourceService._languageSelected.next({ 'value': 'en', 'name': 'English', 'dir': 'ltr' });
    component.searchDropdownValues = ['All', 'Courses', 'Library'];
    component.ngOnInit();
    expect(component.searchDropdownValues).not.toContain('Users');
  });
  it('should show users search from dropdown if loggedin user is rootorgadmin', ( ) => {
    const userService = TestBed.get(UserService);
    const resourceService = TestBed.get(ResourceService);
    mockResponse.userMockData.userProfile.rootOrgAdmin = true;
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData.userProfile });
    resourceService._languageSelected.next({ 'value': 'en', 'name': 'English', 'dir': 'ltr' });
    component.searchDisplayValueMappers = {
      'All': 'all',
      'Library': 'resources',
      'Courses': 'courses',
      'Users': 'users'
    };
    component.searchDropdownValues = ['All', 'Courses', 'Library'];
    component.ngOnInit();
    expect(component.searchDropdownValues).toContain('Users');
  });
  xit('search dropdown selected value should be ALL when non rootorgadmin user lands to profile page', ( ) => {
    const userService = TestBed.get(UserService);
    mockResponse.userMockData.userProfile.rootOrgAdmin = false;
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData.userProfile });
    component.ngOnInit();
    expect(component.selectedOption).toEqual('All');
  });
  xit('search dropdown selected value should be Users when rootorgadmin user lands to profile page', ( ) => {
    const userService = TestBed.get(UserService);
    mockResponse.userMockData.userProfile.rootOrgAdmin = true;
    userService._userData$.next({ err: null, userProfile: mockResponse.userMockData.userProfile });
    component.ngOnInit();
    expect(component.selectedOption).toEqual('Users');
  });
  xit('should call search redo layout', () => {
    component.isLayoutAvailable();
    expect(component).toBeTruthy();
  });
  it('should call setSearchPlaceHolderValue method', () => {
    component.selectedOption = 'Users';
    component.searchDisplayValueMappers = {User: 'user'};
    spyOn(component, 'setSearchPlaceHolderValue');
    component.setSearchPlaceHolderValue();
    expect(component.setSearchPlaceHolderValue).toHaveBeenCalled();
  });
  it('should call onEnter method and redirect to mydownloads page when user is offline', ( ) => {
    component.isDesktopApp = true;
    component.isConnected = false;
    const key = 'hello';
    component.queryParam['key'] = key;
    component.onEnter(key);
    expect(router.navigate).toHaveBeenCalledWith(['mydownloads'], {queryParams:  component.queryParam});
  });
});
