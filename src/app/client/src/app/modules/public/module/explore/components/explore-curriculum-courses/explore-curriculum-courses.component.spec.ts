import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreCurriculumCoursesComponent } from './explore-curriculum-courses.component';
import { SharedModule } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule} from '@sunbird/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('ExploreCurriculumCoursesComponent', () => {
  let component: ExploreCurriculumCoursesComponent;
  let fixture: ComponentFixture<ExploreCurriculumCoursesComponent>;

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
      declarations: [ ExploreCurriculumCoursesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, TelemetryModule.forRoot()],
      providers: [ { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreCurriculumCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return empty data from search', () => {
    spyOn(component['searchService'], 'contentSearch').and.returnValue(of ([]));
    component['fetchCourses']();
    expect(component.courseList.length).toEqual(0);
  });

  it('should return data', () => {
    component.title = 'English';
    spyOn(component['searchService'], 'fetchCourses').and.returnValue(of({
      contents: [
        { id: '123', subject: 'Mathematics' },
        { id: '234', subject: 'English' }
      ]
    }));
    component['fetchCourses']();
    expect(component.courseList.length).toEqual(2);
  });

  it('should return channelId', () => {
    component['userService']['_hashTagId'] = '123';
    spyOn(component['orgDetailsService'], 'getCustodianOrgDetails').and.returnValue(of ({}));
    component['getChannelId']();
    expect(component.isCustodianOrg).toBeTruthy();
  });
});
