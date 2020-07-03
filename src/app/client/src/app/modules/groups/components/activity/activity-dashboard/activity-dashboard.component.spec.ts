import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ActivityDashboardComponent } from './activity-dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { of, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsService } from '../../../services/groups/groups.service';
import { configureTestSuite } from '@sunbird/test-util';

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
        'm0085': 'Please wait',
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
    component.fetchActivity();
    expect(component.showLoader).toBe(false);
    expect(component.activity).toBeDefined();
    expect(component.groupMembers).toBeDefined();
  });

  it('should call search', () => {
    component.showSearchResults = false;
    const members = [
      { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true }
    ];
    component.groupMembers = members;
    component.memberListToShow = [];
    component.search('Joh');
    expect(component.showSearchResults).toBe(true);
  });

  it('should reset the list to membersList when no search key present', () => {
    component.showSearchResults = true;
    const members = [
      { identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false, indexOfMember: 1, isCreator: true }
    ];
    component.groupMembers = members;
    component.search('');
    expect(component.showSearchResults).toBe(false);
  });
});
