import { GlobalSearchSelectedFilterComponent } from './global-search-selected-filter.component';
import { Response } from './global-search-selected-filter.component.spec.data';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { BehaviorSubject } from 'rxjs';

describe('GlobalSearchSelectedFilterComponent', () => {
  let component: GlobalSearchSelectedFilterComponent;
  let fixture: ComponentFixture<GlobalSearchSelectedFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = '/all/1?medium=test';
  }

  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({ subject: ['English'] });
    paramsMock = new BehaviorSubject<any>({ pageNumber: '1' });
    get params() { return this.paramsMock.asObservable(); }
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      data: {
        telemetry: { env: 'search', pageid: 'global-search', type: 'view', subtype: 'paginate' }
      }
    };
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot()],
      declarations: [GlobalSearchSelectedFilterComponent],
      providers: [{ provide: Router, useClass: RouterStub }, { provide: ActivatedRoute, useClass: FakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchSelectedFilterComponent);
    component = fixture.componentInstance;
  });
  it('should call removeFilterSelection', () => {
    component.facets = Response.facets;
    component.selectedFilters = Response.selectedFilters;
    component.removeFilterSelection({type: 'medium', value: 'assamese'});
    expect(component.selectedFilters).toEqual(Response.filterChange.filters);
  });


  it('should update routes', () => {
    component.selectedFilters = Response.selectedFiltersData;
    component.facets = Response.facetsData;
    component.updateRoute();
    expect(component.selectedFilters).toEqual(Response.selectedFilterData);
  });

});

