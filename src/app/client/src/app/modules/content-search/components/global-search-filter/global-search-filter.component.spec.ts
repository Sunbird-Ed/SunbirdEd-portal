import { GlobalSearchFilterComponent } from './global-search-filter.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash-es';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { BehaviorSubject } from 'rxjs';
import { Response } from '../global-search-selected-filter/global-search-selected-filter.component.spec.data';
import { MockData } from './global-search-filter.component.spec.data';
import { CoreModule, UserService } from '@sunbird/core';


fdescribe('GlobalSearchFilterComponent', () => {
  let component: GlobalSearchFilterComponent;
  let fixture: ComponentFixture<GlobalSearchFilterComponent>;
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
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule.forRoot(), CoreModule],
      declarations: [GlobalSearchFilterComponent],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        UserService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchFilterComponent);
    component = fixture.componentInstance;
  });
  it('should call ngoninit', () => {
    component.ngOnInit();
    expect(component.selectedFilters).toEqual({ subject: ['English'] });
  });

  it('should reset filters', () => {
    component.resetFilters();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should call removeFilterSelection', () => {
    component.facets = Response.facets;
    component.selectedFilters = Response.selectedFilters;
    component.removeFilterSelection({ type: 'medium', value: 'assamese' });
    expect(component.selectedFilters).toEqual(Response.filterChange.filters);
  });

  it('should update routes', () => {
    component.selectedFilters = MockData.selectedFilters;
    component.facets = MockData.facets;
    component.updateRoute();
    expect(component.selectedFilters).toEqual(MockData.selectedFilterData);
  });

  it('should call removeFilterSelection', () => {
    component.facets = MockData.facets;
    component.selectedFilters = MockData.removedSelectedFilter;
    component.onChange(MockData.facetData);
    expect(component.selectedFilters).toEqual(MockData.removedSelectedFilter);
  });

});
