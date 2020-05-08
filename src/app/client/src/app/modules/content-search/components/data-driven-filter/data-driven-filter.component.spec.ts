

import { BehaviorSubject, throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as _ from 'lodash-es';
import { DataDrivenFilterComponent } from './data-driven-filter.component';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule, ResourceService, ConfigService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import { CoreModule, FrameworkService, FormService, UserService, PublicDataService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';

describe('DataDrivenFilterComponent', () => {
  let component: DataDrivenFilterComponent;
  let fixture: ComponentFixture<DataDrivenFilterComponent>;
  let frameworkService, formService, cacheService, userService, publicDataService, resourceService;
  let mockHashTagId: string, mockFrameworkInput: string;
  let mockFrameworkCategories: Array<any> = [];
  let mockFormFields: Array<any> = [];
  let makeChannelReadSuc, makeFrameworkReadSuc, makeFormReadSuc  = true;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = '/explore/1?';
  }

  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    snapshot = {
      params: {pageNumber: '1'},
    };
    get queryParams() {
      return this.queryParamsMock.asObservable();
    }
    public changeQueryParams(queryParams) {
      this.queryParamsMock.next(queryParams);
    }
  }
  const mockUserRoles = {
    userRoles: ['PUBLIC', 'CONTENT_REVIEWER']
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot()],
      providers: [ConfigService, CacheService, ResourceService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDrivenFilterComponent);
    component = fixture.componentInstance;
    frameworkService = TestBed.get(FrameworkService);
    formService = TestBed.get(FormService);
    cacheService = TestBed.get(CacheService);
    userService = TestBed.get(UserService);
    resourceService = TestBed.get(ResourceService);
    publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.callFake((options) => {
      if (options.url === 'channel/v1/read/' + mockHashTagId && makeChannelReadSuc) {
        return of({result: {channel: {defaultFramework: mockFrameworkInput}}});
      } else if (options.url === 'framework/v1/read/' + mockFrameworkInput && makeFrameworkReadSuc) {
        return of({result: {framework: {code: mockFrameworkInput, categories: mockFrameworkCategories}}});
      }
      return throwError({});
    });
    spyOn(publicDataService, 'post').and.callFake((options) => {
      if (makeFormReadSuc) {
        return of({result: {form: {data: {fields: mockFormFields}}}});
      }
      return throwError({});
    });
  });

  it('should get formated filter data by calling framework service and form service and set formated date in session', () => {
    mockHashTagId = undefined;
    mockFrameworkInput = undefined;
    mockFrameworkCategories = [];
    mockFormFields = [];
    makeChannelReadSuc = true;
    makeFrameworkReadSuc = true;
    makeFormReadSuc = true;
    resourceService._languageSelected.next({value: 'en', label: 'English', dir: 'ltr'});
    spyOn(cacheService, 'get').and.returnValue(undefined);
    spyOn(cacheService, 'set').and.returnValue(undefined);
    spyOn(component.dataDrivenFilter, 'emit').and.returnValue([]);
    component.ngOnInit();
    expect(component.formFieldProperties).toBeDefined();
    expect(component.filtersDetails).toBeDefined();
    expect(component.dataDrivenFilter.emit).toHaveBeenCalledWith([]);
    expect(component.showFilters).toBeTruthy();
    expect(cacheService.set).toHaveBeenCalled();
  });
  it('should reset filters', () => {
    component.resetFilters();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should apply filters', () => {
    component.formFieldProperties = [{code: 'subject'}];
    component.formInputData = {subject: 'Math'};
    component.applyFilters();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should remove filter selection', () => {
    component.formInputData = { 'subject': ['English'] };
    component.removeFilterSelection('subject', 'English');
    expect(component.formInputData.subject).toEqual([]);
  });
});
