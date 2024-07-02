import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, UtilService } from '@sunbird/shared';
import { takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { Response } from './global-search-selected-filter.component.spec.data';
import { GlobalSearchSelectedFilterComponent } from './global-search-selected-filter.component';

describe('PageSectionComponent', () => {
  let component: GlobalSearchSelectedFilterComponent;
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn()
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {

    params: of({ collectionId: "123" }),
    snapshot: {
      queryParams: {
        type: 'edit',
        courseId: 'do_456789',
        batchId: '124631256',
      },
      data: {
        telemetry: {
          env: 'certs',
          pageid: 'certificate-configuration',
          type: 'view',
          subtype: 'paginate',
          ver: '1.0'
        }
      }
    } as any
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockUtilService: Partial<UtilService> = {
    isDesktopApp: true,
    isIos: true,
    transposeTerms: jest.fn()
  };
  beforeAll(() => {
    component = new GlobalSearchSelectedFilterComponent(
      mockRouter as Router,
      mockActivatedRoute as ActivatedRoute,
      mockResourceService as ResourceService,
      mockUtilService as UtilService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be create a instance of GlobalSearchSelectedFilterComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should call removeFilterSelection', () => {
    component.facets = Response.facets;
    component.selectedFilters = Response.selectedFilters;
    component.removeFilterSelection({ type: 'medium', value: 'assamese' });
    expect(component.selectedFilters).toEqual(Response.filterChange.filters);
  });
  it('should update routes', () => {
    component.selectedFilters = Response.selectedFiltersData;
    component.facets = Response.facetsData;
    component.queryParamsToOmit = { obj: 'abc' };
    component.updateRoute();
    expect(component.selectedFilters).toEqual(Response.selectedFilterData);
  });

  it('should call showLabel method', () => {
    const obj = component.showLabel();
    expect(obj).toBeTruthy()
  });
  it('should call showLabel method', () => {
    component.selectedFilters = Response.selectedFilter;
    const obj = component.showLabel();
    expect(obj).toBeFalsy()
  });
  it('should call ngOnInit method', () => {
    mockResourceService.languageSelected$ = of({
      language: 'en'
    });
    component.ngOnInit();
    expect(mockUtilService.transposeTerms).toBeCalled();
  });
});