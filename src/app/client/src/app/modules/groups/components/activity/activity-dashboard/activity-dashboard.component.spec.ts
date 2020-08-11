import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ActivityDashboardComponent } from './activity-dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CoreModule, UserService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsService } from '../../../services/groups/groups.service';
import { configureTestSuite } from '@sunbird/test-util';
import { courseHierarchy, nestedCourse, activityData, groupData } from './activity-dashboard.component.spec.data';

describe('ActivityDashboardComponent', () => {
  let component: ActivityDashboardComponent;
  let fixture: ComponentFixture<ActivityDashboardComponent>;
  let activatedRoute;

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
    'messages': {
      'fmsg': {
        'm0087': 'Please wait',
        'm0051': 'Something went wrong, try again later'
      },
      'emsg': {
        'm002': 'Could not find the group. Try again later',
        'm0005': 'Something went wrong, please try again',
        'noAdminRoleActivity': 'You are not authorised to access this page'
      }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityDashboardComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule.forRoot()],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDashboardComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to query param change events on init', () => {
    spyOn<any>(component, 'fetchActivityOnParamChange');
    component.ngOnInit();
    expect(component['fetchActivityOnParamChange']).toHaveBeenCalled();
  });

  it('should get Params on routes changes', fakeAsync(() => {
    spyOn(component, 'fetchActivity');
    component['fetchActivityOnParamChange']();
    activatedRoute.changeParams({ groupId: 'abcd12322', activityId: 'do_34534' });
    tick(100);
    expect(component.queryParams).toBeDefined();
    expect(component.queryParams).toBeDefined();
    expect(component.groupId).toBeDefined();
    expect(component.activityId).toBeDefined();
    expect(component.fetchActivity).toHaveBeenCalled();
  }));

  it('should fetch activity', () => {
    component.groupId = 'abcd12343';
    const groupService = TestBed.get(GroupsService);
    spyOn(groupService, 'getGroupById').and.returnValue(of({ groupName: 'name', groupDescription: 'description' }));
    component.fetchActivity('Course');
    expect(component.showLoader).toBe(true);
  });

  it('should reset the list to membersList when no search key present', () => {
    component.showSearchResults = true;
    component.members = [
      { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true }
    ];
    component.search('');
    expect(component.showSearchResults).toBe(false);
  });

  it('should call getActivityInfo', () => {
    component.groupData = { activities: [{ id: 'do_1234', activityInfo: { name: 'activity1' } }, { id: 'do_0903232', activityInfo: { name: 'activity2' } }] };
    component.activityId = 'do_1234';
    component.getActivityInfo();
    expect(component.activity).toBeDefined();
  });

  it('should call processData', () => {
    const agg = { 'activity': { 'agg': [{ 'metric': 'enrolmentCount', 'lastUpdatedOn': 1594898939615, 'value': 2 }, { 'metric': 'leafNodesCount', 'lastUpdatedOn': 1557890515518, 'value': 10 }], 'id': 'do_2125636421522554881918', 'type': 'Course' }, 'groupId': 'ddebb90c-59b5-4e82-9805-0fbeabed9389', 'members': [{ 'role': 'admin', 'createdBy': '1147aef6-ada5-4d27-8d62-937db8afb40b', 'name': 'Tarento Mobility  ', 'userId': '1147aef6-ada5-4d27-8d62-937db8afb40b', 'status': 'active', 'agg': [{ 'metric': 'completedCount', 'lastUpdatedOn': 1594898939617, 'value': 4 }] }, { 'role': 'member', 'createdBy': '0a4300a0-6a7a-4edb-9111-a7c9c6a53693', 'name': 'Qualitrix Book Reviewer', 'userId': '9e74d241-004f-40d9-863e-63947ef10bbd', 'status': 'active', 'agg': [{ 'metric': 'completedCount', 'lastUpdatedOn': 1594898939617, 'value': 5 }] }] };
    spyOn(component, 'getActivityInfo');
    component.processData(agg);
    expect(component.getActivityInfo).toHaveBeenCalled();
    expect(component.members).toBeDefined();
  });
  it('should call search', () => {
    component.showSearchResults = false;
    component.members = [
      { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true }
    ];
    component.memberListToShow = [];
    component.search('Joh');
    expect(component.showSearchResults).toBe(true);
    expect(component.memberListToShow).toBeDefined();
  });

  it('should call validateUser', () => {
    const group = { members: [{ userId: '123', role: 'member' }, { userId: '457', role: 'member' }] };
    const userService = TestBed.get(UserService);
    const toasterService = TestBed.get(ToasterService);
    const groupService = TestBed.get(GroupsService);
    userService.setUserId('123');
    spyOn(toasterService, 'warning');
    spyOn(groupService, 'goBack');
    component.validateUser(group);
    expect(toasterService.warning).toHaveBeenCalled();
    expect(groupService.goBack).toHaveBeenCalled();
  });

  it('should call addTelemetry', () => {
    const groupService = TestBed.get(GroupsService);
    spyOn(groupService, 'addTelemetry');
    component.addTelemetry('activity-dashboard-member-search', [], { query: 'test' });
    expect(groupService.addTelemetry).toHaveBeenCalled();
  });

  it('should sort and return members', () => {
    component['userService'].setUserId('1');
    component.members = [
      { title: 'A', identifier: '1', progress: '0', initial: 'A', indexOfMember: 0},
      { title: 'D', identifier: '2', progress: '80', initial: 'D', indexOfMember: 0},
      { title: 'E', identifier: '3', progress: '100', initial: 'E', indexOfMember: 0},
      { title: 'K', identifier: '4', progress: '0', initial: 'K', indexOfMember: 0},
      { title: 'B', identifier: '5', progress: '0', initial: 'B', indexOfMember: 0},
    ];
    const sortedMembers = [
      { title: 'A', identifier: '1', progress: '0', initial: 'A', indexOfMember: 0},
      { title: 'E', identifier: '3', progress: '100', initial: 'E', indexOfMember: 0},
      { title: 'D', identifier: '2', progress: '80', initial: 'D', indexOfMember: 0},
      { title: 'B', identifier: '5', progress: '0', initial: 'B', indexOfMember: 0},
      { title: 'K', identifier: '4', progress: '0', initial: 'K', indexOfMember: 0},
    ];
    const members = component.getSortedMembers();
    expect(members).toEqual(sortedMembers);
  });

  it ('should call getCollectionHierarchy()', () => {
    spyOn(component['playerService'], 'getCollectionHierarchy').and.returnValue(of (courseHierarchy));
    spyOn(component, 'updateArray');
    spyOn(component, 'flattenDeep').and.returnValue(nestedCourse);
    component.activityId = 'do_21307962614412902412404';
    component.groupData = { activities: [{ id: 'do_1234', activityInfo: { name: 'activity1' } }, { id: 'do_0903232', activityInfo: { name: 'activity2' } }] };
    component.checkForNestedCourses(activityData);
    component['playerService'].getCollectionHierarchy('do_21307962614412902412404', {}).subscribe(data => {
      expect(component.updateArray).toHaveBeenCalledWith(courseHierarchy.result.content);
      expect(component.flattenDeep).toHaveBeenCalledWith(courseHierarchy.result.content.children);
      expect(component.showLoader).toBeFalsy();
    });
  });

  it ('should throw error in checkForNestedCourses()', () => {
    spyOn(component['playerService'], 'getCollectionHierarchy').and.returnValue(throwError ({}));
    component.activityId = 'do_21307962614412902412404';
    spyOn(component['toasterService'], 'error');
    spyOn(component, 'navigateBack');
    component.checkForNestedCourses(activityData);
    component['playerService'].getCollectionHierarchy('do_21307962614412902412404', {}).subscribe(data => {
    }, err => {
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0051);
      expect(component.navigateBack).toHaveBeenCalled();
    });
  });

  it('should push course to nested[]', () => {
    component.nestedCourses = [{identifier: '1', name: 'Test 1', leafNodesCount: 1}];
    component.updateArray({identifier: '123', name: 'Test 2', leafNodesCount: 2});
    expect(component.nestedCourses.length).toEqual(2);
    expect(component.selectedCourse).toEqual({identifier: '1', name: 'Test 1', leafNodesCount: 1});

  });

  it('should flatten nested courses', () => {
   const response = component.flattenDeep(courseHierarchy.result.content.children);
    expect(response.length).toEqual(4);
  });

  it('should flatten nested courses where there is no children', () => {
    const response = component.flattenDeep(nestedCourse);
     expect(response.length).toEqual(2);
   });

  it ('should handleSelectedCourse', () => {
    component.groupData = groupData;
    component.nestedCourses = [
    {identifier: 'do_1234', name: 'Test 1', leafNodesCount: 1},
    {identifier: 'do_0903232', name: 'Test 2', leafNodesCount: 2}
    ];
    component.groupId = 'ddebb90c-59b5-4e82-9805-0fbeabed9389';
    spyOn(component['groupService'], 'getActivity').and.returnValue(of (activityData));
    spyOn(component, 'processData');
    spyOn(component, 'toggleDropdown');
    component.handleSelectedCourse({identifier: 'do_2125636421522554881918', name: 'Test 2', leafNodesCount: 2});
    expect(component.selectedCourse).toEqual({identifier: 'do_2125636421522554881918', name: 'Test 2', leafNodesCount: 2});
    component['groupService'].getActivity('ddebb90c-59b5-4e82-9805-0fbeabed9389',
    {id: 'do_2125636421522554881918' , type: 'Course'}, groupData).subscribe(data => {
      expect(component.showLoader).toBeFalsy();
      expect(component.processData).toHaveBeenCalledWith(data);
      expect(component.toggleDropdown).toHaveBeenCalled();
    });
    expect(component['groupService'].getActivity).toHaveBeenCalledWith('ddebb90c-59b5-4e82-9805-0fbeabed9389',
    {id: 'do_2125636421522554881918' , type: 'Course'}, groupData);
  });

  it ('should throw error on handleSelectedCourse()', () => {
    spyOn(component, 'toggleDropdown');
    spyOn(component['groupService'], 'getActivity').and.returnValue(throwError ({}));
    spyOn(component['toasterService'], 'error');
    component.handleSelectedCourse({identifier: 'do_2125636421522554881918', name: 'Test 2', leafNodesCount: 2});
    component['groupService'].getActivity('ddebb90c-59b5-4e82-9805-0fbeabed9389',
    {id: 'do_2125636421522554881918' , type: 'Course'}, groupData).subscribe(data => {
    }, err => {
      expect(component.showLoader).toBeFalsy();
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
    });
  });

  it('should toggledropdown', () => {
    component.dropdownContent = false;
    component.toggleDropdown();
    expect(component.dropdownContent).toBeTruthy();
  });

  it('should unsubscribe', () => {
    spyOn(component['unsubscribe$'], 'next');
    spyOn(component['unsubscribe$'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe$'].next).toHaveBeenCalled();
    expect(component['unsubscribe$'].complete).toHaveBeenCalled();
  });

});
