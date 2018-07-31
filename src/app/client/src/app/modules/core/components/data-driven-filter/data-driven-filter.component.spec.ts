
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as _ from 'lodash';
import { DataDrivenFilterComponent } from './data-driven-filter.component';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ConfigService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import {
  FrameworkService, FormService, ContentService, UserService, LearnerService,
  ConceptPickerService, SearchService, PermissionService
} from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { expand } from 'rxjs/operators';
import * as mockData from './data-driven-filter.component.spec.data';

describe('DataDrivenFilterComponent', () => {
  let component: DataDrivenFilterComponent;
  let fixture: ComponentFixture<DataDrivenFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'messages': {
      'emsg': {
        'm0005': 'api failed, please try again'
      },
      'stmsg': {
        'm0018': 'We are fetching content...',
        'm0008': 'no-results',
        'm0033': 'You dont have any content'
      }
    }
  };
  const fakeActivatedRoute = {
    'params': observableOf({ pageNumber: '1' }),
    'queryParams': observableOf({ subject: ['English'] })
  };
  const mockUserRoles = {
   userRoles: ['PUBLIC', 'CONTENT_REVIEWER']
   };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SuiModule],
      declarations: [DataDrivenFilterComponent],
      providers: [FrameworkService, FormService, UserService, ConfigService, ToasterService, LearnerService, ContentService,
        CacheService, ResourceService, ConceptPickerService, SearchService, PermissionService, BrowserCacheTtlService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDrivenFilterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should get meta data from framework service and call formconfig service if cache not exists', () => {
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const cacheService = TestBed.get(CacheService);
    component.formFieldProperties = mockData.mockRes.formConfigData;
    spyOn(cacheService, 'exists').and.returnValue(false);
    spyOn(component, 'getFormConfig').and.returnValue(component.formFieldProperties);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockData.mockRes.formConfigData));
    frameworkService._frameworkData$.next({ frameworkdata: mockData.mockRes.frameworkData });
    component.fetchFilterMetaData();
    fixture.detectChanges();
    expect(component.formService.getFormConfig).toHaveBeenCalled();
  });
  it('should get meta data from framework service and handle error from formconfig service', () => {
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const cacheService = TestBed.get(CacheService);
    const toasterService = TestBed.get(ToasterService);
    component.formFieldProperties = mockData.mockRes.formConfigData;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(cacheService, 'exists').and.returnValue(false);
    spyOn(component, 'getFormConfig').and.returnValue(component.formFieldProperties);
    spyOn(formService, 'getFormConfig').and.returnValue(observableThrowError({ err: { error: 'SERVER_ERROR' } }));
    frameworkService._frameworkData$.next({ frameworkdata: mockData.mockRes.frameworkData });
    component.fetchFilterMetaData();
    fixture.detectChanges();
    // expect(toasterService.error).toHaveBeenCalled(); // should not throw error should be handled in component
  });

  it('should get meta data from framework service and get formconfig from cache service if cache exists', () => {
    const cacheService = TestBed.get(CacheService);
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    component.formFieldProperties = mockData.mockRes.formConfigData;
    cacheService.set(component.filterType + component.formAction, mockData.mockRes.formConfigData);
    spyOn(cacheService, 'get').and.returnValue(mockData.mockRes.formConfigData);
    spyOn(component, 'getFormConfig').and.returnValue(component.formFieldProperties);
    frameworkService._frameworkData$.next({ frameworkdata: mockData.mockRes.frameworkData });
    component.fetchFilterMetaData();
    fixture.detectChanges();
    expect(component.formFieldProperties).toEqual(mockData.mockRes.formConfigData);
    expect(component.filtersDetails).toBeDefined();
    expect(component.filtersDetails).toEqual(component.formFieldProperties);
  });
  it('should return proper error object if framework service returns error', () => {
    const frameworkService = TestBed.get(FrameworkService);
    const toasterService = TestBed.get(ToasterService);
    const cacheService = TestBed.get(CacheService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(cacheService, 'exists').and.returnValue(false);
    frameworkService._frameworkData$.next({ err: { error: 'SERVER_ERROR' } });
    component.fetchFilterMetaData();
    fixture.detectChanges();
    // expect(toasterService.error).toHaveBeenCalled();
  });
  it('should frame form config data', () => {
    component.categoryMasterList = _.cloneDeep(mockData.mockRes.frameworkData);
    component.getFormConfig();
    fixture.detectChanges();
    expect(component.formFieldProperties).toBeDefined();
  });
  it('should apply filters', () => {
    spyOn(component, 'applyFilters').and.returnValue(null);
    component.applyFilters();
    fixture.detectChanges();
    expect(component.applyFilters).toHaveBeenCalled();
  });
  it('should reset filters', () => {
    spyOn(component, 'applyFilters').and.returnValue(null);
    component.resetFilters();
    fixture.detectChanges();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should initalize in page search incase of inpage filter is enabled', () => {
    component.filterType = 'course';
    const emitData = _.pickBy(component.queryParams);
    component.applyFilters();
    fixture.detectChanges();
  });
  it('should initalize search and navigate to search page if inpage filter is not enabled', () => {
    component.filterType = 'course';
    component.applyFilters();
    fixture.detectChanges();
  });
  it('should remove filter selection', () => {
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: mockData.mockRes.userProfile });
    component.formInputData = { 'subject': ['English'] };
    component.removeFilterSelection('subject', 'English');
    fixture.detectChanges();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    const frameworkService = TestBed.get(FrameworkService);
    const formService = TestBed.get(FormService);
    const cacheService = TestBed.get(CacheService);
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: mockData.mockRes.userProfile });
    userService.getUserProfile();
    component.formFieldProperties = mockData.mockRes.formConfigData;
    spyOn(cacheService, 'exists').and.returnValue(false);
    spyOn(component, 'getFormConfig').and.returnValue(component.formFieldProperties);
    spyOn(formService, 'getFormConfig').and.returnValue(observableOf(mockData.mockRes.formConfigData));
    frameworkService._frameworkData$.next({ frameworkdata: mockData.mockRes.frameworkData });
    component.fetchFilterMetaData();
    fixture.detectChanges();
    spyOn(component.frameworkDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.frameworkDataSubscription.unsubscribe).toHaveBeenCalled();
  });
  it('should call resetFilters method', () => {
    component.ignoreQuery = ['key', 'language'];
    component.resetFilters();
    expect(component.refresh).toBeTruthy();
  });
  it('should call ngOnChanges method', () => {
    component.enrichFilters = mockData.mockRes.enrichFilterData;
    component.formFieldProperties = mockData.mockRes.formData;
    spyOn(component, 'generateRange').and.callThrough();
    component.ngOnChanges();
    expect(component.generateRange).toHaveBeenCalled();
  });
  it('should not call permission service if allowedRoles are present', () => {
    const permissionService = TestBed.get(PermissionService);
    const allowedRoles = ['ORG_ADMIN', 'SYSTEM_ADMINISTRATION'];
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue('');
    component.showField(allowedRoles);
    expect(permissionService.checkRolesPermissions).toHaveBeenCalled();
  });
  it('should not call permission service if allowedRoles are empty', () => {
    const permissionService = TestBed.get(PermissionService);
    const allowedRoles = undefined;
    spyOn(permissionService, 'checkRolesPermissions').and.returnValue('');
    component.showField(allowedRoles);
    expect(permissionService.checkRolesPermissions).not.toHaveBeenCalled();
  });
  it('should apply filters and key should have concepts', () => {
    const router = TestBed.get(Router);
    component.formInputData = { 'subject': ['English'], 'medium': ['English'] };
    component.queryParams = {
      'concepts': [
        {
          identifier: 'AI31',
          name: '(Artificial) Neural Network'
        }
      ]
    };
    component.applyFilters();
    expect(router.navigate).toHaveBeenCalledWith([undefined], { queryParams: component.queryParams });
  });
});
