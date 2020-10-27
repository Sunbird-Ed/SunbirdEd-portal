import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ActivityListComponent } from './activity-list.component';
import { SharedModule, ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { mockActivityList } from './activity-list.component.data.spec';
import { GroupsService } from '../../../services/groups/groups.service';
import * as _ from 'lodash-es';

describe('ActivityListComponent', () => {
  let component: ActivityListComponent;
  let fixture: ComponentFixture<ActivityListComponent>;
  let router;

  class FakeActivatedRoute {
    queryParamsMock = new BehaviorSubject<any>({});
    paramsMock = new BehaviorSubject<any>({ groupId: 'abcd12322', activityId: 'do_34534' });
    get params() { return this.paramsMock.asObservable(); }
    get queryParams() { return this.queryParamsMock.asObservable(); }
    snapshot = {
      params: {},
      data: {
        telemetry: {}
      }
    };
    public changeQueryParams(queryParams) { this.queryParamsMock.next(queryParams); }
    public changeParams(params) { this.paramsMock.next(params); }
  }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    languageSelected$: of ({}),
    'messages': {
      'fmsg': {
        'm0085': 'Please wait',
      },
      'smsg': {
        'activityRemove': 'Activity removed from the group successfully'
      },
      'emsg': {
        'activityRemove': 'Could not remove activity. Try again later'
      }
    },
    'frmelmnts': {
      'lbl': {
        ACTIVITY_COLLECTION_TITLE: 'Collection',
        ACTIVITY_COURSE_TITLE: 'Courses',
        ACTIVITY_EXPLANATION_CONTENT_TITLE: 'Explanation content',
        ACTIVITY_PRACTICE_QUESTION_SET_TITLE: 'Practice question set',
        ACTIVITY_PRACTICE_RESOURE_TITLE : 'Practice resource',
        ACTIVITY_RESOURCE_TITLE: 'Resource',
        ACTIVITY_TEXTBOOK_TITLE: 'Textbooks',
        ACTIVITY_TV_EPISODE_TITLE: 'TV Episode'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityListComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule.forRoot(), SuiModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
        GroupsService, ConfigService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(ActivityListComponent);
    component = fixture.componentInstance;
    component.groupData = mockActivityList.groupData;
    component.activityList = mockActivityList.groupData.activitiesGrouped;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
    expect(component.showLoader).toBe(false);

  });


  it('should call openActivity for Admin', () => {
    spyOn(component, 'addTelemetry');
    spyOn(component['playerService'], 'playContent');
    const event = {
      data: {
      name: 'Class 5 English',
      identifier: 'do_123523212190',
      appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3129265279296552961416/artifact/book_2_1491393340123.thumb_1577945304197.png',
      organisation: ['Pre-prod Custodian Organization'],
      subject: 'Social Science',
      contentType: 'Course'
    }};
    component.groupData.active = true;
    component.openActivity(event, 'ACTIVITY_COURSE_TITLE');
    expect(component['playerService'].playContent).toHaveBeenCalledWith(event.data);
    expect(component.addTelemetry).toHaveBeenCalled();
  });

  it('should call openActivity for group member', fakeAsync(() => {
    spyOn(component, 'addTelemetry');
    const event = {
      data: {
      name: 'Class 5 English',
      identifier: 'do_123523212190',
      appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3129265279296552961416/artifact/book_2_1491393340123.thumb_1577945304197.png',
      organisation: ['Pre-prod Custodian Organization'],
      subject: 'Social Science',
      contentType: 'Course'
    }};
    component.groupData.isAdmin = true;
    component.groupData.active = true;
    const activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.changeQueryParams({ contentType: 'Course',
    title: 'ACTIVITY_COURSE_TITLE'});
    tick(100);
    const option = {relativeTo: component['activateRoute'], queryParams: { contentType: 'Course',
    title: 'ACTIVITY_COURSE_TITLE'}};
    component.openActivity(event, 'ACTIVITY_COURSE_TITLE');
    expect(router.navigate).toHaveBeenCalledWith(['activity-details', 'do_123523212190'], option);
    expect(component.addTelemetry).toHaveBeenCalled();
  }));

  it('should call getMenuData', () => {
    component.showMenu = false;
    const eventData = {
      event: {
        stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
      },
      data: {
        name: 'Footprints without Feet - English Supplementary Reader',
        identifier: 'do_1235232121343',
        appIcon: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130298331259453441627/artifact/jefp1cc.thumb.jpg',
        organisation: ['Prod Custodian Organization'],
        subject: 'Social Science',
        type: 'Course',
        primaryCategory: 'Course'
      }
    };

    spyOn(component['groupService'], 'emitMenuVisibility');
    spyOn(component, 'addTelemetry');
    component.getMenuData(eventData);
    expect(component.selectedActivity).toEqual(eventData.data);
    expect(component.showMenu).toBe(true);
    expect(component.addTelemetry).toHaveBeenCalledWith('activity-kebab-menu-open',
    [], {}, {id: 'do_1235232121343', type: 'Course', ver: '1.0' });
    expect(component['groupService'].emitMenuVisibility).toHaveBeenCalledWith('activity');
  });

  it('should call toggleModal', () => {
    spyOn(component, 'addTelemetry');
    component.toggleModal(true);
    expect(component.showModal).toEqual(true);
    expect(component.addTelemetry).toHaveBeenCalledWith('remove-activity-kebab-menu-btn');
  });

  it('should call toggleModal', () => {
    spyOn(component, 'addTelemetry');
    component.toggleModal();
    expect(component.showModal).toEqual(false);
    expect(component.addTelemetry).toHaveBeenCalledWith('close-remove-activity-popup');
  });

  it('should throw error on removeActivity', () => {
    component.selectedActivity = mockActivityList.groupData.activitiesGrouped[0].items[0];
    spyOn(component['groupService'], 'removeActivities').and.returnValue(throwError ({}));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    component.removeActivity();
    component['groupService'].removeActivities('4130b072-fb0a-453b-a07b-4c93812c741b',
    {activityIds: ['do_21271200473210880012152']}).subscribe(data => {
    }, err => {
      expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.activityRemove);
    });
  });

  it('should call removeActivity', () => {
    component.selectedActivity = mockActivityList.groupData.activitiesGrouped[0].items[0];
    component.activityList = mockActivityList.activityList;
    spyOn(component['groupService'], 'removeActivities').and.returnValue(of ({}));
    const toasterService = TestBed.get(ToasterService);
    spyOn(component, 'toggleModal');
    spyOn(toasterService, 'success');
    component.removeActivity();
    component['groupService'].removeActivities('4130b072-fb0a-453b-a07b-4c93812c741b',
    {activityIds: ['do_21271200473210880012152']}).subscribe(data => {
      component.activityList = mockActivityList.removedList;
    });
    expect(component.activityList[0].title).toEqual('Course');
    expect(component.activityList[0].items.length).toEqual(3);
    expect(component.toggleModal).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalled();
  });

  it ('should disable "disableViewAllMode"', () => {
    component.toggleViewAll(false, {});
    expect(component.disableViewAllMode).toBe(false);
  });

  it ('should enable "disableViewAllMode"', () => {
    component.toggleViewAll(true, {key: 'Courses', value: [{}]});
    expect(component.disableViewAllMode).toBe(true);
  });

  it('should return TRUE (when type is COURSE)', () => {
    const value = component.isCourse('ACTIVITY_COURSE_TITLE');
    expect(value).toBe(true);
  });

  it('should return FALSE (when type is not COURSE)', () => {
    const value = component.isCourse('Resource');
    expect(value).toBe(false);
  });

  it('should return TRUE (when activityType.length < 3)', () => {
    component.selectedTypeContents = {};
    const value = component.viewSelectedTypeContents('Course', [{id: '12'}], 0);
    expect(value).toBe(true);
  });

  it('should return FALSE (when activityType.length > 3)', () => {
    component.selectedTypeContents = {};
    const value = component.viewSelectedTypeContents('Course',
    [{id: '12'}, {id: '2'}, {id: '123'}, {id: '132'}], 4);
    expect(value).toBe(false);
  });

  it('should return TRUE (when there is no SELECTED ACTIVITY TYPE)', () => {
    component.selectedTypeContents = {};
    const value = component.isSelectedType('Course');
    expect(value).toBe(true);
  });

  it('should return TRUE (when there is  SELECTED ACTIVITY TYPE)', () => {
    component.selectedTypeContents = {ACTIVITY_RESOURCE_TITLE: [{id: 123}]};
    const value = component.isSelectedType('ACTIVITY_RESOURCE_TITLE');
    expect(value).toBe(true);
  });

  it('should call ngOnDestroy', () => {
    component.showModal = true;
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.modal.deny).toHaveBeenCalled();
  });

});
