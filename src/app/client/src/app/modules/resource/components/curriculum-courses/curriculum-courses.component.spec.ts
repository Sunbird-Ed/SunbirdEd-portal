import { throwError, of } from 'rxjs';
import { ToasterService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule, UserService, SearchService, OrgDetailsService } from '@sunbird/core';
import { SharedModule } from './../../../shared/shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumCoursesComponent } from './curriculum-courses.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CurriculumCoursesComponent', () => {
  let component: CurriculumCoursesComponent;
  let fixture: ComponentFixture<CurriculumCoursesComponent>;
  let toasterService, userService, pageApiService, orgDetailsService;
  let sendOrgDetails = true;
  let sendPageApi = true;

  class FakeActivatedRoute {
    snapshot = {
      queryParams: {
        title: 'English',
      }
    };
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurriculumCoursesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot()],
      providers: [ { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumCoursesComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    userService = TestBed.get(UserService);
    pageApiService = TestBed.get(SearchService);
    orgDetailsService = TestBed.get(OrgDetailsService);
    sendOrgDetails = true;
    sendPageApi = true;
    spyOn(orgDetailsService, 'getOrgDetails').and.callFake((options) => {
      if (sendOrgDetails) {
        return of({hashTagId: '123'});
      }
      return throwError({});
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty from search', () => {
    spyOn(component['searchService'], 'contentSearch').and.returnValue(of ([]));
    component['fetchCourses']();
    expect(component.courseList.length).toEqual(0);
  });

  it('should return empty from search', () => {
    component['userService']['_hashTagId'] = '123';
    spyOn(component['orgDetailsService'], 'getCustodianOrgDetails').and.returnValue(of (
      {result: {response: {value: {channelId: '123'}}}}
    ));
    component['getChannelId']();
  });

  it ('should return the searchfilter', () => {
    component.channelId  = '123';
    component.custodianOrg  = false;
    component.defaultFilters = {board : ['test'], medium: ['English'], gradeLevel : ['Class 4']};
    component['contentSearchService']._frameworkId = 'test';
    const data = component['getSearchRequest']();
    expect(data.filters.board).toEqual(['test']);
    expect(data.limit).toEqual(100);
  });
});
