import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AddActivityContentTypesComponent } from './add-activity-content-types.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule, ToasterService, ResourceService, ConfigService, BrowserCacheTtlService, NavigationHelperService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { TelemetryService } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { of as observableOf, throwError } from 'rxjs';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { GroupsService } from '../../../services';
import { AddActivityContentTypesData } from './add-activity-content-types.spec.data';
import * as _ from 'lodash-es';


describe('AddActivityContentTypesComponent', () => {
  let component: AddActivityContentTypesComponent;
  let fixture: ComponentFixture<AddActivityContentTypesComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    public url = '/add-activity-to-group';
  }

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        ACTIVITY_COURSE_TITLE: 'Courses',
        ACTIVITY_TEXTBOOK_TITLE: 'Textbooks',
        ACTIVITY_EXPLANATION_CONTENT_TITLE: 'Explanation content',
        ACTIVITY_PRACTICE_RESOURCE_TITLE: 'Practice resource',
        ACTIVITY_PRACTICE_QUESTION_SET_TITLE: 'Practice question set',
        ACTIVITY_COLLECTION_TITLE: 'Collection',
        ACTIVITY_RESOURCE_TITLE: 'Resource'
      }
    },
    messages: {
      emsg: {
        m0005: 'Something went wrong, try again later'
      }
    }
  };

  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'groups',
          pageid: 'add-activity-to-group',
          type: 'view',
          subtype: 'paginate',
          ver: '1.0'
        }
      }
    },
    queryParams: observableOf({
      groupName: 'SOME_GROUP_NAME',
      createdBy: 'SOME_GROUP_CREATOR',
      groupId: '123456'
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot()],
      declarations: [AddActivityContentTypesComponent],
      providers: [
        TelemetryService,
        ResourceService,
        ConfigService,
        BrowserCacheTtlService,
        NavigationHelperService,
        CsGroupAddableBloc,
        GroupsService,
        ToasterService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ResourceService, useValue: resourceBundle }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityContentTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the necessary group data from query params', () => {
    /** Arrange */
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'setNavigationUrl').and.stub();
    spyOn(component, 'fetchActivityList').and.stub();

    /** Act */
    component.ngOnInit();

    /** Assert */
    expect(navigationHelperService.setNavigationUrl).toHaveBeenCalled();
    expect(component.groupName).toEqual('SOME_GROUP_NAME');
    expect(component.groupCreator).toEqual('SOME_GROUP_CREATOR');
    expect(component.fetchActivityList).toHaveBeenCalled();
  });

  it('should trigger impression event', () => {
    /** Arrange */
    spyOn(component, 'setTelemetryImpressionData').and.stub();

    /** Act */
    component.ngAfterViewInit();

    /** Assert */
    expect(component.setTelemetryImpressionData).toHaveBeenCalled();

  });

  xit('Should fetch all the supported activities', () => {
    /** Arrange */
    const groupService = TestBed.get(GroupsService);
    spyOn(groupService, 'getSupportedActivityList').and.returnValue(observableOf(AddActivityContentTypesData.listData));

    /** Act */
    component.fetchActivityList();

    /** Assert */
    expect(component.supportedActivityList).toEqual(AddActivityContentTypesData.processedActivityList.data.fields);
  });

  it('should show error toast message if fetch activity list api fails', () => {
    /** Arrange */
    const groupService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(groupService, 'getSupportedActivityList').and.callFake(() => throwError({}));
    spyOn(toasterService, 'error');

    /** Act */
    component.fetchActivityList();

    /** Assert */
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');

  });

  it('should navigate to result page on click of any activity card', () => {
    /** Arrange */
    const cardData = AddActivityContentTypesData.mockCardData;
    const csGroupAddableBloc = CsGroupAddableBloc.instance;
    const router = TestBed.get(Router);
    const groupService = TestBed.get(GroupsService);
    spyOn(csGroupAddableBloc, 'updateState');
    spyOnProperty(groupService, 'groupData').and.returnValue(AddActivityContentTypesData.groupData);
    /** Act */
    component.onCardClick(cardData);

    /** Assert */
    expect(csGroupAddableBloc.updateState).toHaveBeenCalledWith({
      pageIds: ['course', 'add-activity-to-group'],
      groupId: AddActivityContentTypesData.groupData.id,
      params: {
        searchQuery: cardData.searchQuery,
        groupData: AddActivityContentTypesData.groupData,
        contentType: cardData.activityType
      }
    });
    expect(router.navigate).toHaveBeenCalledWith(['add-activity-to-group', 'Course', 1], { relativeTo: fakeActivatedRoute });
  });

  it('should trigger interact event', () => {
    /** Arrange */
    const groupService = TestBed.get(GroupsService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOnProperty(groupService, 'groupData').and.returnValue(AddActivityContentTypesData.groupData);
    const interactData = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Group',
          id: _.get(groupService, 'groupData.id')
        }]
      },
      edata: {
        id: 'textbook-card',
        type: 'CLICK',
        pageid: fakeActivatedRoute.snapshot.data.telemetry.pageid
      }
    };
    spyOn(telemetryService, 'interact');

    /** Act */
    component.sendInteractData({id: 'textbook-card'});

    /** Assert */
    expect(telemetryService.interact).toHaveBeenCalledWith(interactData);

  });

  it('should trigger impression event', () => {
    /** Arrange */
    const groupService = TestBed.get(GroupsService);
    const navigationHelperService = TestBed.get(NavigationHelperService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOnProperty(groupService, 'groupData').and.returnValue(AddActivityContentTypesData.groupData);
    spyOn(navigationHelperService, 'getPageLoadTime').and.returnValue(10);
    spyOn(telemetryService, 'impression').and.stub();

    const telemetryImpressionData = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata: [{
          type: 'Group',
          id: _.get(groupService, 'groupData.id')
        }]
      },
      edata: {
        type: fakeActivatedRoute.snapshot.data.telemetry.type,
        subtype: fakeActivatedRoute.snapshot.data.telemetry.subtype,
        pageid: fakeActivatedRoute.snapshot.data.telemetry.pageid,
        uri: '/add-activity-to-group',
        duration: 10
      }
    };

    /** Act */
    component.setTelemetryImpressionData();

    /** Assert */
    expect(telemetryService.impression).toHaveBeenCalledWith(telemetryImpressionData);
  });
});
