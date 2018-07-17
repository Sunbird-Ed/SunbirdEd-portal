
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
// NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// Modules
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { SharedModule, ConfigService, ResourceService } from '@sunbird/shared';
// SB components and service
import { DashboardUtilsService, LineChartService, CourseConsumptionService, RendererService } from './../../services';
import { CourseConsumptionComponent } from './course-consumption.component';
import { UserService, SearchService, ContentService, LearnerService } from '@sunbird/core';
// Test data
import * as mockData from './course-consumption.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';

const testData = mockData.mockRes;
describe('CourseConsumptionComponent', () => {
  let component: CourseConsumptionComponent;
  let fixture: ComponentFixture<CourseConsumptionComponent>;
  let router: Router;

  const fakeActivatedRoute = {
    'params': observableOf({ 'id': 1, 'timePeriod': '7d' }),
    snapshot: {
      data: {
        telemetry: {
          env: 'course', pageid: 'course-creator-dashboard', type: 'view',
          object: { type: 'course', ver: '1.0' }
        }
      }
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseConsumptionComponent],
      imports: [HttpClientModule, FormsModule, SuiModule, ChartsModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      providers: [CourseConsumptionService,
        RendererService,
        LearnerService,
        ContentService,
        UserService,
        SearchService,
        LineChartService,
        DashboardUtilsService,
        ConfigService,
        ResourceService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should call search api and returns result count 1', inject([SearchService], (searchService) => {
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => observableOf(testData.searchSuccess));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.myCoursesList).toBeDefined();
    expect(component.myCoursesList.length).toEqual(1);
    expect(component.identifier).toEqual('do_2124339707713126401772');
    expect(component.isMultipleCourses).toEqual(false);
  }));

  // When search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => observableThrowError({}));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.blockData.length).toBeLessThanOrEqual(0);
    expect(component.myCoursesList.length).toEqual(0);
  }));

  // If search api returns more than one course
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    component.isMultipleCourses = false;
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.myCoursesList).toBeDefined();
    expect(component.isMultipleCourses).toEqual(true);
    expect(component.myCoursesList.length).toBeGreaterThan(1);
  }));

  it('should call validateIdentifier method when counet is more than 1 ', inject([SearchService], (searchService) => {
    component.isMultipleCourses = false;
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => observableOf(testData.searchSuccessWithCountTwo));
    spyOn(component, 'validateIdentifier').and.callThrough();
    component.getMyContent();
    component.validateIdentifier(testData.searchSuccessWithCountTwo.result.content[0].identifier);
    fixture.detectChanges();
    expect(component.selectedCourse).toBe(testData.searchSuccessWithCountTwo.result.content[0]);
    expect(component.myCoursesList).toBeDefined();
    expect(component.isMultipleCourses).toEqual(true);
    expect(component.myCoursesList.length).toBeGreaterThan(1);
  }));

  // When course consumption api's return response
  it('should call dashboard api and return valid response', inject([CourseConsumptionService],
    (courseConsumptionService) => {
      spyOn(courseConsumptionService, 'getDashboardData').and.callFake(() => observableOf(testData.consumptionData));
      component.getDashboardData('7d', 'do_2123250076616048641482');
      fixture.detectChanges();
      expect(component.blockData.length).toBeGreaterThan(1);
      expect(component.graphData.length).toBeGreaterThanOrEqual(1);
      expect(component.showLoader).toEqual(false);
    }));

  it('should call dashboard api and return error', inject([CourseConsumptionService], (courseConsumptionService) => {
    spyOn(courseConsumptionService, 'getDashboardData').and.callFake(() => observableThrowError({}));
    component.getDashboardData('', 'do_2123250076616048641482');
    fixture.detectChanges();
    expect(component.blockData.length).toEqual(0);
    expect(component.showLoader).toEqual(false);
  }));

  it('should call onAfterCourseChange - and load graph', inject([Router], (route) => {
    component.identifier = 'do_2124319530479697921602';
    const courseDetails = { 'identifier': 'do_2124319530479697921602123' };
    spyOn(component, 'onAfterCourseChange').and.callThrough();
    const response = component.onAfterCourseChange(courseDetails);
    fixture.detectChanges();
    expect(component.isMultipleCourses).toBeFalsy();
    expect(route.navigate).toHaveBeenCalledWith(['activity/course/consumption', courseDetails.identifier, '7d']);
  }));

  it('should call onAfterFilterChange function - but should not change time period', inject([Router], (route) => {
    component.timePeriod = '7d';
    const response = component.onAfterFilterChange('7d');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(response).toBeFalsy();
    expect(component.timePeriod).toEqual('7d');
    expect(route.navigate).not.toHaveBeenCalled();
  }));

  it('should call onAfterFilterChange function - and display last 14 days data', inject([Router], (route) => {
    component.timePeriod = '7d';
    component.identifier = 'do_1234';
    const response = component.onAfterFilterChange('14d');
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(route.navigate).toHaveBeenCalledWith(['activity/course/consumption', component.identifier, '14d']);
  }));

  it('should call onAfterCourseChange function - but should not load graph', inject([Router], (route) => {
    component.identifier = 'do_2124319530479697921602';
    const response = component.onAfterCourseChange({ identifier: 'do_2124319530479697921602' });
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier).toEqual('do_2124319530479697921602');
    expect(route.navigate).not.toHaveBeenCalled();
  }));

  it('should validate identifier and load dashboard data', inject([Router], (route) => {
    component.myCoursesList = [{ identifier: 'do_123' }];
    component.validateIdentifier('do_123');
    fixture.detectChanges();
    expect(component.myCoursesList.length).toBeGreaterThanOrEqual(1);
    expect(route.navigate).not.toHaveBeenCalled();
  }));

  it('should throw invalidate identifier error', inject([Router], (route) => {
    component.myCoursesList = [{ identifier: 'do_1231' }];
    component.validateIdentifier('do_123');
    fixture.detectChanges();
    expect(component.myCoursesList.length).toBeGreaterThanOrEqual(1);
    expect(route.navigate).toHaveBeenCalledWith(['home']);
  }));

  it('should display next graph', () => {
    component.showGraph = 0;
    component.graphNavigation('next');
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1);
  });

  it('should call getMyContent when content length is 1', inject([SearchService, Router],
    (searchService, route) => {
      searchService._searchedContentList = testData.searchSuccess.result;
      component.myCoursesList = testData.searchSuccess.result.content;
      component.getMyContent();
      expect(route.navigate).toHaveBeenCalledWith(['activity/course/consumption', component.identifier, '7d']);
      expect(component.showLoader).toEqual(false);
    }));

    it('should unsubscribe from all observable subscriptions', () => {
      component.initTelemetryImpressionEvent();
      component.getDashboardData('7d', 'do_2123250076616048641482');
      component.getMyContent();
      spyOn(component.unsubscribe, 'complete');
      component.ngOnDestroy();
      expect(component.unsubscribe.complete).toHaveBeenCalled();
    });
});
