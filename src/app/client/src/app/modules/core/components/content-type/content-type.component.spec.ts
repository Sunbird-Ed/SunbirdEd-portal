import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormService, UserService} from '@sunbird/core';
import {ContentTypeComponent} from './content-type.component';
import {ResourceService, ConfigService, BrowserCacheTtlService, LayoutService} from '@sunbird/shared';
import {Router, ActivatedRoute} from '@angular/router';
import {of as observableOf, of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CacheService} from 'ng2-cache-service';
import {APP_BASE_HREF} from '@angular/common';
import {mockData} from './content-type.component.spec.data';

describe('ContentTypeComponent', () => {
  let component: ContentTypeComponent;
  let fixture: ComponentFixture<ContentTypeComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      root: {firstChild: {params: {slug: 'sunbird'}}},
      queryParams: {}
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        textbook: 'textbook'
      },
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ContentTypeComponent],
      providers: [{provide: ResourceService, useValue: resourceBundle}, CacheService,
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}, LayoutService,
        {provide: APP_BASE_HREF, useValue: '/'}, BrowserCacheTtlService,
        FormService, ConfigService, {provide: Router, useClass: RouterStub}],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inint the component', () => {
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockData.formData));
    component.ngOnInit();
    expect(component.contentTypes).toEqual(mockData.formData);
    expect(component.selectedContentType).toBe('textbook');
  });

  it('should fetch title', () => {
    const title = component.getTitle({title: 'frmelmnts.lbl.textbook'});
    expect(title).toEqual('textbook');
  });

  it('should fetch title for logged in user', () => {
    const userService = TestBed.get(UserService);
    const router = TestBed.get(Router);
    userService._authenticated = true;
    component.showContentType({
      loggedInUserRoute: {route: '/resources', queryParam: 'textbooks'},
      contentType: 'textbook'
    });
    expect(component.selectedContentType).toBe('textbook');
    expect(router.navigate).toHaveBeenCalledWith(
      ['/resources'], {queryParams: {selectedTab: 'textbooks'}});
  });

  it('should fetch title for non logged in user', () => {
    const userService = TestBed.get(UserService);
    const router = TestBed.get(Router);
    userService._authenticated = false;
    component.showContentType({
      anonumousUserRoute: {route: '/explore', queryParam: 'textbooks'},
      contentType: 'tv'
    });
    expect(component.selectedContentType).toBe('tv');
    expect(router.navigate).toHaveBeenCalledWith(
      ['/explore'], {queryParams: {selectedTab: 'textbooks'}});
  });

  it('should get Icon', () => {
    const icon = component.getIcon({
      theme: {
        className: 'textbook'
      }
    });
    expect(icon).toEqual('textbook');
  });

  it('should tell is layout is available', () => {
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'isLayoutAvailable').and.returnValue(true);
    const layoutData = component.isLayoutAvailable();
    expect(layoutData).toBe(true);
  });
});
