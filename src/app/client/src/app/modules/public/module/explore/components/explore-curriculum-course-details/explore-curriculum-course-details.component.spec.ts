import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@sunbird/core';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { of, throwError } from 'rxjs';
import { PlayerService } from '../../../../../core/services/player/player.service';
import { NavigationHelperService } from '../../../../../shared/services/navigation-helper/navigation-helper.service';
import { ExploreCurriculumCourseDetailsComponent } from './explore-curriculum-course-details.component';
import { courseMockData } from './explore-curriculum-course-details.component.spec.data';

describe('ExploreCurriculumCourseDetailsComponent', () => {
  let component: ExploreCurriculumCourseDetailsComponent;
  let fixture: ComponentFixture<ExploreCurriculumCourseDetailsComponent>;
  const resourceMockData = {
    frmelmnts: {
      lbl: {
        teacher: 'Teacher',
        student: 'Student',
        other: 'Other'
      }
    }
  };

  const fakeActivatedRoute = {
    'params': of({ courseId: 'do_112771678136754176149' }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExploreCurriculumCourseDetailsComponent],
      imports: [
        CoreModule,
        CommonModule,
        TelemetryModule.forRoot(),
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule],
      providers: [
        { provide: ResourceService, useValue: resourceMockData },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreCurriculumCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit on success', () => {
    spyOn(component, 'setTelemetryData');
    spyOn<any>(component, 'getCourseHierarchy').and.returnValue(of({ name: 'Course Name', identifier: 'do_112771678136754176149' }));
    component.ngOnInit();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.courseId).toEqual('do_112771678136754176149');
  });

  it('should call ngOnInit on error', () => {
    spyOn(component, 'setTelemetryData');
    spyOn<any>(component, 'getCourseHierarchy').and.returnValue(throwError({}));
    component.ngOnInit();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.courseId).toEqual('do_112771678136754176149');
  });

  it('should call goBack', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'goBack');
    component.goBack();
    expect(navigationHelperService.goBack).toHaveBeenCalled();
  });

  it('should call closeLoginModal', () => {
    component.showLoginModal = true;
    component.closeLoginModal();
    expect(component.showLoginModal).toBe(false);
  });

  it('should call showSignInModal', () => {
    component.showLoginModal = false;
    component.showSignInModal();
    expect(component.showLoginModal).toBe(true);
  });

  it('should call getCoursePlayerUrl', () => {
    component.courseId = 'do_113021634697519104119';
    const url = component.getCoursePlayerUrl();
    expect(url).toEqual('/resources/play/curriculum-course/do_113021634697519104119');
  });

  it('should call getCourseHierarchy', () => {
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue(of(courseMockData.collectionHierarchyResponse));
    const expectedResponse = courseMockData.collectionHierarchyResponse.result.content;
    expectedResponse.children = _.orderBy(expectedResponse.children, ['createdOn'], ['desc']);
    const response = component['getCourseHierarchy']('do_113021634697519104119');
    response.subscribe((data) => {
      expect(data).toEqual(expectedResponse);
    });
  });

  it('should call ngOnDestroy', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
