import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivityDashboardComponent } from './activity-dashboard.component';
import { groupData, GroupsService } from '../../../services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { of, throwError } from 'rxjs';
import { courseHierarchy, activityData, dashletData, groupInfo } from './activity-dashboard.component.spec.data';
import * as _ from 'lodash-es';
import { ToasterService } from '@sunbird/shared';

// Old One
xdescribe('ActivityDashboardComponent', () => {
  let component: ActivityDashboardComponent;
  let fixture: ComponentFixture<ActivityDashboardComponent>;
  let activatedRoute;
  let router;

  class ActivatedRouteStub {
    snapshot: {
      params: {
        activityId: 'do_2132740696478433281380',
        groupId: '83201038-9f23-4a8f-8055-01f79dbf2e20'
      }
    };
  }

  class RouterStub {
    url = 'my-groups/group-details/83201038-9f23-4a8f-8055-01f79dbf2e20';
    navigate() { }
    getCurrentNavigation = () => {
      const _routerExtras = {
        extras: {
          state: {
            hierarchyData: courseHierarchy.result.content,
            activity: activityData,
            memberListUpdatedOn: '12'
          }
        }
      };
      return _routerExtras;
    }
  }

  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0087': 'Please wait',
        'm0051': 'Something went wrong, try again later'
      },
      'emsg': {
        'm002': 'Could not find the group. Try again later',
        'm0005': 'Something went wrong, try again later',
        'noAdminRoleActivity': 'You are not authorised to access this page'
      }
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityDashboardComponent],
      imports: [
        SharedModule.forRoot(),
        HttpClientTestingModule,
        CoreModule,
        TelemetryModule.forRoot(),
        SharedModule,
        RouterModule
      ],
      providers: [
        GroupsService, ToasterService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDashboardComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.hierarchyData = courseHierarchy.result.content;
    component.activity = activityData;
    component.groupData = groupInfo;
    component.memberListUpdatedOn = '123';
    activatedRoute.snapshot = {
      params: {
        groupId: 'do_2132740696478433281380',
        activityId: '83201038-9f23-4a8f-8055-01f79dbf2e20'
      }
    };
    component.activatedRoute = activatedRoute;
    spyOn(router, 'getCurrentNavigation').and.returnValue({
      extras: {
        state: {
          hierarchyData: courseHierarchy.result.content,
          activity: activityData,
          activityName: 'abc',
          memberListUpdatedOn: '12'
        }
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAggData()', () => {
    spyOn<any>(component, 'getAggData');
    component.ngOnInit();
    expect(component['getAggData']).toHaveBeenCalled();
  });

  it('should call getAggData() success', () => {
    const activityDatas = { id: _.get(courseHierarchy.result.content, 'identifier'), type: 'Course' };
    const groupService = TestBed.inject(GroupsService);
    component.groupData = groupInfo;
    spyOn(groupService, 'getActivity').and.returnValue(of(activityData));
    component.getAggData();
    groupService.getActivity('do_2132740696478433281380', activityDatas, component.groupData, 1).subscribe(data => {
    expect(component.activity).toBeDefined();
    expect(component.memberListUpdatedOn).toBeDefined();
    });
  });

  it('should call getAggData() fail', () => {
    const activityDatas = { id: _.get(courseHierarchy.result.content, 'identifier'), type: 'Course' };
    const groupService = TestBed.inject(GroupsService);
    const toasterService:any = TestBed.inject(ToasterService);
    component.groupData = groupInfo;
    spyOn(toasterService, 'error');
    spyOn(component, 'navigateBack').and.returnValue(true);
    spyOn(groupService, 'getActivity').and.returnValue(throwError({ err: '' }));
    component.getAggData();
    groupService.getActivity('do_2132740696478433281380', activityDatas, component.groupData, 1).subscribe(data => {},
      data => { }, (err) => {
    expect(component.activity).toBeDefined();
    expect(component.memberListUpdatedOn).toBeDefined();
    });
  });

  it('should get data for dashlet library', () => {
    const groupService = TestBed.inject(GroupsService);
    spyOn(groupService, 'getDashletData').and.returnValue(of(dashletData));
    component.getDashletData();
    groupService.getDashletData(courseHierarchy.result.content, activityData).subscribe(data => {
      expect(component.dashletData).toBeDefined();
    });
  });

  it('should fail while getting the data for dashlet library', () => {
    const toasterService:any = TestBed.inject(ToasterService);
    const groupService = TestBed.inject(GroupsService);
    spyOn(toasterService, 'error');
    spyOn(component, 'navigateBack').and.returnValue(true);
    spyOn(groupService, 'getDashletData').and.returnValue(throwError({ err: '' }));
    component.getDashletData();
    groupService.getDashletData(component.hierarchyData, component.activity).subscribe(data => { }, (err) => {
      expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
      expect(component['navigateBack']).toHaveBeenCalled();
    });
  });

  it('should call navigateBack()', () => {
    const toasterService:any = TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.navigateBack();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0005);
  });

  it('should call addTelemetry', () => {
    const groupService = TestBed.inject(GroupsService);
    spyOn(groupService, 'addTelemetry');
    component.addTelemetry();
    expect(groupService.addTelemetry).toHaveBeenCalledWith({ id: 'download-csv', extra: {} },
      // tslint:disable-next-line:max-line-length
      { params: { groupId: 'do_2132740696478433281380', activityId: '83201038-9f23-4a8f-8055-01f79dbf2e20' } }, [], 'do_2132740696478433281380', { id: '83201038-9f23-4a8f-8055-01f79dbf2e20', type: 'course' });
  });
});
