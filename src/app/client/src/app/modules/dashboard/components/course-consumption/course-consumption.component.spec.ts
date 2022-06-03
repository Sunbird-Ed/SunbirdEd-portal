
import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Custom service(s)
import { RendererService, CourseConsumptionService } from '../../services';
import { SearchService, GeneraliseLabelService } from '@sunbird/core';
import { ResourceService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
// Interface
import { DashboardData } from '../../interfaces';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { EventEmitter } from "@angular/core";
import { Subject, of } from 'rxjs';
import { mockRes } from './course-consumption.component.spec.data';
import { CourseConsumptionComponent } from './course-consumption.component';


describe("CourseConsumptionComponent", () => {
  let component: CourseConsumptionComponent;
  const mockRouter: Partial<Router> = {
    url: '/resources/view-all/Course-Unit/1',
    navigate: jest.fn(),
    events: of({}) as any
  };
  const mockCourseConsumptionService: Partial<CourseConsumptionService> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({
      selectedTab: 'all',
      contentType: ['Course'], objectType: ['Content'], status: ['Live'],
      defaultSortBy: JSON.stringify({ lastPublishedOn: 'desc' })
    }),
    snapshot: {
      queryParams: {
        selectedTab: 'course'
      }
    } as any,
    params: of({
      id: 'sample-id',
      utm_campaign: 'utm_campaign',
      utm_medium: 'utm_medium',
      clientId: 'android',
      timePeriod: '7d',
      context: JSON.stringify({ data: 'sample-data' })
    }) as any
  };
  const mockSearchService: Partial<SearchService> = {
    searchContentByUserId: jest.fn().mockReturnValue(of(mockRes.searchSuccess)) as any,
    _searchedContentList:mockRes.searchSuccess.result
  };
  const mockRendererService: Partial<RendererService> = {};
  const mockResourceService: Partial<ResourceService> = {};
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: new EventEmitter<any>()
  };
  const mockGeneraliseLabelService: Partial<GeneraliseLabelService> = {};
  beforeAll(() => {
    component = new CourseConsumptionComponent(
      mockRouter as Router,
      mockCourseConsumptionService as CourseConsumptionService,
      mockActivatedRoute as ActivatedRoute,
      mockSearchService as SearchService,
      mockRendererService as RendererService,
      mockResourceService as ResourceService,
      mockNavigationHelperService as NavigationHelperService,
      mockGeneraliseLabelService as GeneraliseLabelService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be create a instance of CourseConsumptionComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should be create a instance of CourseConsumptionComponent and interactObject should have a value of', () => {
    const obj = { id: 'sample-id', type: 'Course', ver: '1.0' }
    expect(component).toBeTruthy();
    expect(JSON.stringify(component.interactObject)).toBe(JSON.stringify(obj));
  });

  it('should be create a instance of CourseConsumptionComponent and isMultipleCourses should have a value of false', () => {
    expect(component).toBeTruthy();
    expect(component.isMultipleCourses).toBeFalsy();
  });

  it('should be create a instance of CourseConsumptionComponent and showDashboard should have a value of true', () => {
    expect(component).toBeTruthy();
    expect(component.showDashboard).toBeTruthy();
  });
  // it('should be create a instance of CourseConsumptionComponent and call getMyContent method', () => {
  //   component.searchService._searchedContentList = {
  //     count:50
  //   }
  //   console.log(component.searchService.searchedContentList);
  //   component.getMyContent();
  //   expect(component).toBeTruthy();
  //   expect(component.showDashboard).toBeTruthy();
  // });
  
});