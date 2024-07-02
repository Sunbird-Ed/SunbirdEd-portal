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
  const mockUtilService: Partial<UtilService> ={};
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

});
