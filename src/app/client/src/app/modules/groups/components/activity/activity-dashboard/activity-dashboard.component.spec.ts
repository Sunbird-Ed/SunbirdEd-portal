import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ActivityDashboardComponent } from './activity-dashboard.component';
import { DashletModule } from '@project-sunbird/sb-dashlet';
import { GroupsService } from '../../../services';
import { ConfigService } from '@sunbird/shared';
import { CourseConsumptionService } from '@sunbird/learn';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule, ActivatedRoute, Router, Params } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { groupData, courseHierarchy, activityData, dashletData } from './activity-dashboard.component.spec.data';
import * as _ from 'lodash-es';
import { ToasterService } from '@sunbird/shared';
import * as $ from 'jquery';
import 'datatables.net';
import { By } from '@angular/platform-browser';


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
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityDashboardComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, CoreModule, TelemetryModule.forRoot(),
        RouterModule, DashletModule],
      providers: [
        GroupsService, ConfigService, CourseConsumptionService, ToasterService,
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
    activatedRoute = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
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
    expect(component.groupId).toBeDefined();
    expect(component.fetchActivity).toHaveBeenCalled();
  }));

  it('should fetch activity', () => {
    const activityId = 'do_2127638382202880001645';
    const groupId = 'abc123';
    component.isLoader = true;
    const groupService = TestBed.get(GroupsService);
    spyOn(groupService, 'getGroupById').and.returnValue(of({ groupName: 'name', groupDescription: 'description' }));
    spyOn(component, 'getHierarchy');
    component.fetchActivity(groupId, activityId);
    expect(component.getHierarchy).toHaveBeenCalled();
    expect(component.isLoader).toBe(false);
  });

  it('should call getHierarchy()', () => {
    const activityId = 'do_2127638382202880001645';
    const inputParams = { params: component.configService.appConfig.CourseConsumption.contentApiQueryParams };
    spyOn(component['courseConsumptionService'], 'getCourseHierarchy').and.returnValue(of(courseHierarchy));
    spyOn(component, 'getAggData');
    component.getHierarchy(activityId, groupData);
    component['courseConsumptionService'].getCourseHierarchy('do_2127638382202880001645', inputParams).subscribe(data => {
      expect(component.activity).toBeDefined();
      expect(component.getAggData).toHaveBeenCalled();
    });

    // expect(component.coursehierarchy).toBeDefined();
  });

  it('should throw error in getHierarchy()', () => {
    const activityId = 'do_2127638382202880001645';
    const inputParams = { params: component.configService.appConfig.CourseConsumption.contentApiQueryParams };
    spyOn(component['courseConsumptionService'], 'getCourseHierarchy').and.returnValue(throwError({}));
    spyOn(component['toasterService'], 'error');
    spyOn(component, 'navigateBack');
    component.getHierarchy(activityId, groupData);
    component['courseConsumptionService'].getCourseHierarchy('do_2127638382202880001645', inputParams).subscribe(data => {
    }, err => {
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0051);
      expect(component.navigateBack).toHaveBeenCalled();
    });
  });


  it('should call getAggData()', () => {
   const activityId = 'do_2127638382202880001645';
   const leafNodesCount = 5;
    spyOn(component['groupService'], 'getActivity').and.returnValue(of(activityData));
    spyOn(component, 'getDashletData');
    component.getAggData(activityId, courseHierarchy, groupData, leafNodesCount);
    component['groupService'].getActivity('ddebb90c-59b5-4e82-9805-0fbeabed9389',
      { id: 'do_2125636421522554881918', type: 'Course' }, groupData).subscribe(data => {
        expect(component.getDashletData).toHaveBeenCalled();
      });
    expect(component['groupService'].getActivity).toHaveBeenCalledWith('ddebb90c-59b5-4e82-9805-0fbeabed9389',
      { id: 'do_2125636421522554881918', type: 'Course' }, groupData);
  });
  it('should throw error in getAggData()', () => {
    const activityId = 'do_2127638382202880001645';
    const leafNodesCount = 5;
    spyOn(component['groupService'], 'getActivity').and.returnValue(throwError({}));
    spyOn(component['toasterService'], 'error');
    spyOn(component, 'navigateBack');
    component.getAggData(activityId, courseHierarchy, groupData, leafNodesCount);
    component['groupService'].getActivity('ddebb90c-59b5-4e82-9805-0fbeabed9389',
      { id: 'do_2125636421522554881918', type: 'Course' }, groupData).subscribe(data => {
      }, err => {
        expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0051);
        expect(component.navigateBack).toHaveBeenCalled();
      });
  });

  it('should call getDashletData()', () => {
    spyOn(component['groupService'], 'getDashletData').and.returnValue(of(dashletData));
    component.getDashletData(courseHierarchy, activityData);
    component['groupService'].getDashletData(courseHierarchy, activityData).subscribe(data => {
      expect(component.Dashletdata).toBeDefined();
      expect(component.columnConfig).toBeDefined();
    });
  });

  it('should call navigateBack()', () => {
    spyOn(component['toasterService'], 'error');
    spyOn(component['groupService'], 'goBack');
    component.navigateBack();
    expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
    expect(component['groupService'].goBack).toHaveBeenCalled();
  });

  it('should call addTelemetry', () => {
    const groupService = TestBed.get(GroupsService);
    component.groupId = '123';
    spyOn(groupService, 'addTelemetry');
    component.addTelemetry('download-csv', [], {}, { id: 'abc', type: 'Course', version: '1.0' });
    expect(groupService.addTelemetry).toHaveBeenCalledWith({ id: 'download-csv', extra: {} },
      { params: {}, data: { telemetry: {} } }, [], '123', { id: 'abc', type: 'Course', version: '1.0' });
  });

  // fit('should call downloadCSV()', () => {
  //   component.lib = {
  //     instance: {
  //         exportCsv: (fn: (value: Params) => void) => fn( Promise.resolve('csv data'))
  //     }
  // };
  //   spyOn(component, 'addTelemetry');
  //   component.downloadCSV();
  //   expect(component.addTelemetry).toHaveBeenCalled();
  // });

});
