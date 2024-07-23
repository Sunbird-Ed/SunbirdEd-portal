import { ActivityDetailsComponent } from './activity-details.component';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, SearchService } from '@sunbird/core';
import { ResourceService, ToasterService, LayoutService, UtilService, ConfigService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import {  combineLatest, Subject, of , throwError } from 'rxjs';
import { debounceTime, delay, map, takeUntil, tap } from 'rxjs/operators';
import { GroupsService } from './../../../services';
import { IActivity } from '../activity-list/activity-list.component';
import { PublicPlayerService } from '@sunbird/public';
import { ACTIVITY_DASHBOARD, MY_GROUPS, GROUP_DETAILS } from '../../../interfaces/routerLinks';

describe('ActivityDetailsComponent', () => {
  let component: ActivityDetailsComponent;

  const mockSearchService: Partial<SearchService> = {
    isContentTrackable: jest.fn(),
  };
  const mockRouter: Partial<Router> = {
    navigate: jest.fn(),
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    params: of({ groupId: 'sampleGroupId', activityId: 'sampleActivityId' }),
    queryParams: of({ primaryCategory: 'Course' }),
      snapshot: {
      } as any,
  };
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
            lbl: {
                Select: 'Select'
            },
    },
    messages: {
        emsg:{
          m0005:'Something went wrong, try again later'
        },
        lbl: {
          you: 'You'
        },
      },
    };
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
    warning: jest.fn(),
  };
  const mockConfigService: Partial<ConfigService> = {};
  const mockGroupService: Partial<GroupsService> ={
    getGroupById: jest.fn(() => of({})),
    getActivity: jest.fn(() => of({})),
    addTelemetry: jest.fn(),
    goBack: jest.fn(),
    getImpressionObject: jest.fn(),
  };
  const mockUserService: Partial<UserService> ={};
  const mockLayoutService: Partial<LayoutService> ={
    switchableLayout: jest.fn(),
    initlayoutConfig: jest.fn(),
  };
  const mockUtilService: Partial<UtilService> ={
    downloadCSV: jest.fn(),
  };
  const mockPublicPlayerService: Partial<PublicPlayerService> ={
    getCollectionHierarchy: jest.fn(() => of({
      result: {
        content: {
          leafNodesCount: 2,
          children: []
        }
      }
    }) as any),
    getContent: jest.fn(() => of({})as any),
  };
   beforeAll(() => {
    component = new ActivityDetailsComponent(
      mockResourceService as ResourceService,
      mockActivatedRoute as ActivatedRoute,
      mockGroupService as GroupsService,
      mockToasterService as ToasterService,
      mockUserService as UserService,
      mockRouter as Router,
      mockLayoutService as LayoutService,
      mockPublicPlayerService as PublicPlayerService,
      mockSearchService as SearchService,
      mockUtilService as UtilService,
      mockConfigService as ConfigService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should search and update memberListToShow', () => {
    component.members = [
      { title: 'John', status: 'active', userId: '123' },
      { title: 'Alice', status: 'active', userId: '456' },
    ];

    component.search('John');

    expect(component.showSearchResults).toBeTruthy();
    expect(component.memberListToShow.length).toEqual(1);
    expect(component.memberListToShow[0].title).toEqual('John');
  });

  it('should get sorted members alphabetically', () => {
    component.members = [
      { title: 'John', progress: 20 },
      { title: 'Alice', progress: 10 },
      { title: 'Bob', progress: 30 },
    ];

    const sortedMembers = component.getSortedMembers();

    expect(sortedMembers.length).toEqual(3);
    expect(sortedMembers[0].title).toEqual('Alice');
    expect(sortedMembers[1].title).toEqual('Bob');
    expect(sortedMembers[2].title).toEqual('John');
  });

  it('should initialize layout configuration', () => {
    const switchableLayoutSpy = jest.spyOn(component['layoutService'], 'switchableLayout');
    switchableLayoutSpy.mockReturnValue(of({ layout: 'mockedLayout' }));
    component.ngOnInit();
    expect(component.layoutConfiguration).toEqual('mockedLayout');
    expect(switchableLayoutSpy).toHaveBeenCalled();
  });

  it('should update layout configuration on switchableLayout', async() => {
    await component['layoutService'].switchableLayout().subscribe(() => {
      expect(component.layoutConfiguration).toEqual('updatedLayout');
    });
  });

  it('should set showSearchResults to false and reset memberListToShow when searchKey is empty', () => {
    const searchKey = '';
    component.showSearchResults = true;
    component.members = [{ title: 'exampleTitle1' }, { title: 'exampleTitle2' }];
    component.search(searchKey);
    expect(component.showSearchResults).toBeFalsy();
    expect(component.memberListToShow.length).toBe(2);
  });

  it('should set activity based on activityId', () => {
    const mockGroupData = {
      activities: [
        { id: 'activity1', activityInfo: { name: 'Activity 1' } },
        { id: 'activity2', activityInfo: { name: 'Activity 2' } },
      ],
    };

    const mockActivityId = 'activity2';
    component.groupData = mockGroupData;
    component.activityId = mockActivityId;
    component.getActivityInfo();
    expect(component.activity).toEqual({ name: 'Activity 2' });
  });

  it('should set activity to undefined if activityId is not found', () => {
    const mockGroupData = {
      activities: [
        { id: 'activity1', activityInfo: { name: 'Activity 1' } },
        { id: 'activity2', activityInfo: { name: 'Activity 2' } },
      ],
    };

    const mockActivityId = 'nonexistentActivity';
    component.groupData = mockGroupData;
    component.activityId = mockActivityId;
    component.getActivityInfo();
    expect(component.activity).toBeUndefined();
  });

  it('should fetch content and update arrays', () => {
    const mockGroupData = {};
    const mockActivityData = {};
    const mockContentData = {
      result: {
        content: {
          identifier: 'contentId',
          leafNodesCount: 5,
        },
      },
    };
    mockPublicPlayerService.getContent = jest.fn(() => of(mockContentData as any));
    component.activityId = 'sampleActivityId';
    component.getContent(mockGroupData, mockActivityData);
    expect(mockPublicPlayerService.getContent).toHaveBeenCalledWith('sampleActivityId', {});
  });

  it('should flatten deep contents', () => {
    const mockContents = [
      { name: 'Parent 1', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
      { name: 'Parent 2' },
    ];
    const flattenedContents = component.flattenDeep(mockContents);
    expect(flattenedContents).toHaveLength(4);
  });

  it('should toggle dropdown', () => {
    component.dropdownContent = false;
    component.toggleDropdown();
    expect(component.dropdownContent).toBeTruthy();
  });

  it('should show activity type', () => {
    component.queryParams = { title: 'Sample Title' };
    const activityType = component.showActivityType();
    expect(activityType).toEqual('sample title');
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    jest.spyOn(component.unsubscribe$, 'complete');
    jest.spyOn(component.unsubscribe$, 'next');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
  });

  it('should add telemetry and download CSV file', () => {
    jest.spyOn(component, 'addTelemetry');
    jest.spyOn(mockUtilService, 'downloadCSV');

    const selectedCourse = { identifier: 'course1', name: 'Sample Course', primaryCategory: 'Category', pkgVersion: '1.0' };
    component.selectedCourse = selectedCourse;
    const memberListToShow = [{ title: 'Member 1', progress: 50 }, { title: 'Member 2', progress: 75 }];
    component.memberListToShow = memberListToShow;

    component.downloadCSVFile();

    expect(component.addTelemetry).toHaveBeenCalledWith('download-csv', [], {},
      { id: selectedCourse.identifier, type: selectedCourse.primaryCategory, ver: selectedCourse.pkgVersion });

    const expectedData = memberListToShow.map(member => ({
      courseName: selectedCourse.name,
      memberName: member.title.replace('(You)', ''),
      progress: `${member.progress}%`
    }));
    expect(mockUtilService.downloadCSV).toHaveBeenCalledWith(selectedCourse, expectedData);
  });

  it('should add telemetry and navigate to activity dashboard page', () => {
    jest.spyOn(component, 'addTelemetry');
    jest.spyOn(mockRouter, 'navigate');

    component.activity = { identifier: 'activity1', resourceType: 'Resource' } as any;
    component.groupData = { id: 'group1' };
    component.courseHierarchy = 'hierarchyData';
    component.activityDetails = 'activityDetails';
    component.memberListUpdatedOn = 'memberListUpdatedOn';

    component.navigateToActivityDashboard();

    expect(component.addTelemetry).toHaveBeenCalledWith('activity-detail', [{ id: 'activity1', type: 'Resource' }]);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${GROUP_DETAILS}`, 'group1', `${ACTIVITY_DASHBOARD}`, 'activity1'],
      { state: { hierarchyData: 'hierarchyData', activity: 'activityDetails', memberListUpdatedOn: 'memberListUpdatedOn' } });
  });

   it('should navigate back and show error toast', () => {
    jest.spyOn(mockToasterService, 'error');
    jest.spyOn(mockGroupService, 'goBack');

    component.navigateBack();

    expect(component.showLoader).toBe(false);
    expect(mockToasterService.error).toHaveBeenCalledWith(mockResourceService.messages.emsg.m0005);
    expect(mockGroupService.goBack).toHaveBeenCalled();
  });

  it('should process data correctly', () => {
    const aggResponse = {
      members: [{ status: 'active', agg: [{ metric: 'completedCount', value: 5 }] }],
      activity: {
        agg: [{ metric: 'enrolmentCount', value: 10, lastUpdatedOn: 123456 }],
      }
    };

    component.selectedCourse = { leafNodesCount: 10 };
    component.activity = {} as any;
    component['userService'] = { userid: '1' } as any;
    component.resourceService = {
      frmelmnts: { lbl: { you: 'You' } }
    } as any;
    component.processData(aggResponse);
    expect(component.leafNodesCount).toBe(10);
    expect(component.enrolmentCount).toBe(10);
    expect(component.membersCount).toBe(1);
    expect(component.memberListUpdatedOn).toBe(123456);
    expect(component.members.length).toBe(1);
    expect(component.members[0].indexOfMember).toBe(0);
    expect(component.showLoader).toBe(false);
  });

  describe('fetchActivity', () => {
    it('should fetch activity data and validate user', () => {
      const group = {
        members: [
          { userId: 'adminId', role: 'admin', status: 'active' },
          { userId: 'userId', role: 'member', status: 'active' }
        ],
        status: 'active'
      };
      const getGroupByIdSpy = jest.spyOn(mockGroupService as any, 'getGroupById').mockReturnValue(of(group));
      const validateUserSpy = jest.spyOn(component, 'validateUser');
      component.fetchActivity('someType');
      expect(getGroupByIdSpy).toHaveBeenCalled();
      expect(validateUserSpy).toHaveBeenCalledWith(group);
    });

    it('should call navigateBack on error', () => {
      const getGroupBySpy = jest.spyOn(mockGroupService as any, 'getGroupById').mockReturnValue(throwError('error'));
      const navigateBackSpy = jest.spyOn(component, 'navigateBack');

      component.fetchActivity('someType');
      expect(getGroupBySpy).toHaveBeenCalled();

      expect(navigateBackSpy).toHaveBeenCalled();
    });
  });

  it('should handle error case correctly', () => {
    const course = { identifier: 'courseId' };
    component.searchInputBox = {
      nativeElement: {
        value: '',
      },
    };
    jest.spyOn(mockGroupService, 'getActivity').mockReturnValue(throwError('error'));
    component.handleSelectedCourse(course);

    expect(component.searchInputBox.nativeElement.value).toBe('');
    expect(component.selectedCourse).toEqual(course);
    expect(mockGroupService.getActivity).toHaveBeenCalledWith(
      component.groupId,
      { id: course.identifier, type: 'Course' },
      component.groupData
      );
    expect(component.showLoader).toBe(false);
  });


  it('should handle fetching nested courses correctly', () => {
    const groupData = {};
    const activityData = { id: 'activityId', type: 'Course' };
    const mockCollectionHierarchy = {
      result: {
        content: {
          identifier: 'parentId',
          leafNodesCount: 5,
          children: [
            { identifier: 'childCourseId1', contentType: 'Course', leafNodesCount: 2 },
            { identifier: 'childCourseId2', contentType: 'Course', leafNodesCount: 3 }
          ]
        }
      }
    };
    jest.spyOn(mockPublicPlayerService as any, 'getCollectionHierarchy').mockReturnValue(of(mockCollectionHierarchy));
    component.checkForNestedCourses(groupData, activityData);
    expect(mockPublicPlayerService.getCollectionHierarchy).toHaveBeenCalledWith(component.activityId, {});
    expect(component.courseHierarchy).toEqual(mockCollectionHierarchy.result.content);
    expect(component.parentId).toBe('parentId');
    expect(component.leafNodesCount).toBe(5);
  });

  it('should handle error case correctly', () => {
    const groupData = {};
    const activityData = { id: 'activityId', type: 'Course' };
    jest.spyOn(mockPublicPlayerService as any, 'getCollectionHierarchy').mockReturnValue(throwError('error'));
    component.checkForNestedCourses(groupData, activityData);
    expect(mockPublicPlayerService.getCollectionHierarchy).toHaveBeenCalledWith(component.activityId, {});
  });
});
