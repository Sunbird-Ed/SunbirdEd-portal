import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreModule, FormService, UserService } from '@sunbird/core';
import { BrowserCacheTtlService, ConfigService, LayoutService, ResourceService, UtilService , IUserData} from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { of as observableOf } from 'rxjs';
import { ContentTypeComponent } from './content-type.component';
import { mockData } from './content-type.component.spec.data';
import { OnlineOnlyDirective } from '../../directives/online-only/online-only.directive';

describe('ContentTypeComponent', () => {
  let component: ContentTypeComponent;
  let fixture: ComponentFixture<ContentTypeComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      root: { firstChild: { params: { slug: 'sunbird' } } },
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
      imports: [HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [ContentTypeComponent, OnlineOnlyDirective],
      providers: [{ provide: ResourceService, useValue: resourceBundle }, CacheService,
      { provide: ActivatedRoute, useValue: fakeActivatedRoute }, LayoutService, UtilService,
      { provide: APP_BASE_HREF, useValue: '/' }, BrowserCacheTtlService,
        FormService, ConfigService, { provide: Router, useClass: RouterStub }],
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
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should fetch title', () => {
    const title = component.getTitle({ title: 'frmelmnts.lbl.textbook' });
    expect(title).toEqual('textbook');
  });

  it('should tell is layout is available', () => {
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'isLayoutAvailable').and.returnValue(true);
    const layoutData = component.isLayoutAvailable();
    expect(layoutData).toBe(true);
  });

  it('should fetch title for logged in user', () => {
    const userService = TestBed.get(UserService);
    const router = TestBed.get(Router);
    userService._authenticated = true;
    component.showContentType({
      loggedInUserRoute: { route: '/course', queryParam: 'course' },
      contentType: 'course'
    });
    expect(router.navigate).toHaveBeenCalledWith(
      ['/course'], { queryParams: { selectedTab: 'course' } });
  });

  it('should inint the component', () => {
    const formService = TestBed.get(FormService);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockData.formData));
    const utilService = TestBed.get(UtilService);
    utilService._isDesktopApp = false;
    component.ngOnInit();
    expect(component.contentTypes).toEqual(mockData.formData);
    expect(component.selectedContentType).toBe('textbook');
  });

  it('should fetch title for non logged in user', () => {
    const userService = TestBed.get(UserService);
    const router = TestBed.get(Router);
    userService._authenticated = false;
    component.showContentType({
      anonumousUserRoute: { route: '/explore-course', queryParam: 'course' },
      contentType: 'course'
    });
    expect(router.navigate).toHaveBeenCalledWith(
      ['/explore-course'], { queryParams: { selectedTab: 'course' } });
  });

  it('should get Icon', () => {
    const icon = component.getIcon({
      theme: {
        className: 'textbook'
      }
    });
    expect(icon).toEqual('textbook');
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  it('should set selected content type for profile page', () => {
    component.setSelectedContentType('/profile', {}, {});
    expect(component.selectedContentType).toBe(null);
  });

  it('should set selected content type for explore-groups', () => {
    component.setSelectedContentType('/explore-groups', {}, {});
    expect(component.selectedContentType).toBe(null);
  });

  it('should set selected content type as url has selectedTab as query', () => {
    component.setSelectedContentType('/profile', { selectedTab: 'textbook' }, {});
    expect(component.selectedContentType).toBe('textbook');
  });

  it('should set selected content type for play url', () => {
    component.setSelectedContentType('/play', {}, {});
    expect(component.selectedContentType).toBe(null);
  });

  it('should set selected content type for play when content type is textbook', () => {
    component.setSelectedContentType('/play', { contentType: 'TextBook' }, {});
    expect(component.selectedContentType).toBe('textbook');
  });

  it('should set selected content type for explore-course', () => {
    component.setSelectedContentType('/explore-course', {}, {});
    expect(component.selectedContentType).toBe('course');
  });

  it('should set selected content type for learn', () => {
    component.setSelectedContentType('/learn', {}, {});
    expect(component.selectedContentType).toBe('course');
  });

  it('should set selected content type for explore page', () => {
    component.setSelectedContentType('/explore', {}, {});
    expect(component.selectedContentType).toBe('textbook');
  });

  it('should set selected content type for resources page', () => {
    component.setSelectedContentType('/resources', {}, {});
    expect(component.selectedContentType).toBe('textbook');
  });

  it('should set selected content type for resources page when selected tab is tv', () => {
    component.setSelectedContentType('/resources', { selectedTab: 'tv' }, {});
    expect(component.selectedContentType).toBe('tv');
  });
  it('should fetch title for non logged in user', () => {
    const userService = TestBed.get(UserService);
    const router = TestBed.get(Router);
    userService._authenticated = false;
    component.showContentType({
      anonumousUserRoute: { route: '/explore', queryParam: 'textbook' },
      contentType: 'textbook'
    });
    expect(router.navigate).toHaveBeenCalledWith(
      ['/explore'], { queryParams: { selectedTab: 'textbook' } });
  });
  it('should set conent type as all when updateSelectedContentType trigger with unknown content type', () => {
    const layoutService = TestBed.get(LayoutService);
    component.contentTypes = mockData.formData;
    spyOn(component, 'updateSelectedContentType').and.callThrough();
    component.ngOnInit();
    layoutService.updateSelectedContentType.emit('LessionPlan');
    expect(component.updateSelectedContentType).toHaveBeenCalled();
    expect(component.selectedContentType).toEqual('all');
  });
  it('should fetch title for logged in user', () => {
    const userService = TestBed.get(UserService);
    const router = TestBed.get(Router);
    userService._authenticated = true;
    component.showContentType({
      loggedInUserRoute: { route: '/resource', queryParam: 'textbook' },
      contentType: 'textbook'
    });
    expect(router.navigate).toHaveBeenCalledWith(
      ['/resource'], { queryParams: { selectedTab: 'textbook' } });
  });
  it('should set selected conent type when updateSelectedContentType trigger', () => {
    const layoutService = TestBed.get(LayoutService);
    component.contentTypes = mockData.formData;
    spyOn(component, 'updateSelectedContentType').and.callThrough();
    component.ngOnInit();
    layoutService.updateSelectedContentType.emit('TextBook');
    expect(component.updateSelectedContentType).toHaveBeenCalled();
    expect(component.selectedContentType).toEqual('textbook');
  });


});
