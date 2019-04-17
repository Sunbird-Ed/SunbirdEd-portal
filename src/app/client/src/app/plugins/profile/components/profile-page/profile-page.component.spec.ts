import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { CoreModule, UserService, SearchService, PlayerService , LearnerService, CoursesService} from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgInviewModule } from 'angular-inport';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileService } from '@sunbird/profile';
import {ProfilePageComponent} from './profile-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SlickModule } from 'ngx-slick';
import { Response } from './profile-page.spec.data';
import {of as observableOf,  Observable } from 'rxjs';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    snapshot: {
      data: {
        telemetry: {
          env: 'profile', pageid: 'profile', subtype: 'paginate', type: 'view',
          object: { type: '', ver: '1.0' }
        }
      }
    };
  }
  const env = 'profile';
  class ActivatedRouteStub {
    snapshot = {
      root: { firstChild : {data: { telemetry: { env: env} } } },
      data : {
          telemetry: { env: env }
      }
    };
  }
  const resourceBundle = {
    'frmelmnts': {
      'instn': {
        't0015': 'Upload Organization',
        't0016': 'Upload User'
      },
      'lbl' : {
        'chkuploadsts': 'Check Status'
      },
    },
    'messages': {
      'smsg': {},
      'fmsg': {
        'm0001': 'api failed, please try again',
        'm0004': 'api failed, please try again'
      }
    },
    languageSelected$: observableOf({})
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,  SharedModule.forRoot(), CoreModule,
        TelemetryModule, NgInviewModule, SlickModule],
      declarations: [ ProfilePageComponent ],
      providers: [ProfileService, UserService, SearchService,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
  });

  it('should call user service', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.frelmnts = resourceBundle.frmelmnts;
    resourceService.messages = resourceBundle.messages;
    const userService = TestBed.get(UserService);
    userService._userData$.next({ err: null, userProfile: Response.userData });
    spyOn(component, 'getOrgDetails').and.callThrough();
    spyOn(component, 'getContribution').and.callThrough();
    spyOn(component, 'getTrainingAttended').and.callThrough();
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.userProfile).toEqual(Response.userData);
    expect(component.getOrgDetails).toHaveBeenCalled();
    expect(component.getContribution).toHaveBeenCalled();
    expect(component.getTrainingAttended).toHaveBeenCalled();
  });

  it('should call search service to get my contributions data', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'searchContentByUserId').and.returnValue(observableOf(Response.success));
    component.getContribution();
    expect(component.contributions).toBeDefined();
  });

  it('should not call user search service when my contributions data count is zero', () => {
    const searchService = TestBed.get(SearchService);
    searchService._searchedContentList = Response.zeroData.result;
    const response = searchService.searchedContentList;
    component.getContribution();
    expect(response.count).toEqual(0);
    expect(component.contributions).toBeDefined();
    expect(component.contributions).toEqual([]);
  });

  it('should call play content when clicked on one of my contributions', () => {
    const playerService = TestBed.get(PlayerService);
    const event = { data: { metaData: { identifier: 'do_11262255104183500812' } } };
    spyOn(playerService, 'playContent').and.callFake(() => observableOf(Response.event.data.metaData));
    component.openContent(event);
    expect(playerService.playContent).toHaveBeenCalled();
  });

  it('should call course service to get attended training data', () => {
    const courseService = TestBed.get(CoursesService);
    const learnerService = TestBed.get(LearnerService);
    courseService._enrolledCourseData$.next({ err: null, enrolledCourses: Response.courseSuccess.result.courses});
    courseService.initialize();
    component.getTrainingAttended();
    expect(component.attendedTraining).toBeDefined();
  });
});
