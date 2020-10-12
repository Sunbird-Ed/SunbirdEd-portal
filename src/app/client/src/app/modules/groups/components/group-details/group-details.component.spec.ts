import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupDetailsComponent } from './group-details.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GroupsService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs';
import { impressionObj, fakeActivatedRoute } from './../../services/groups/groups.service.spec.data';
import { GroupDetailsData } from './group-details.component.spec.data';
import * as _ from 'lodash-es';
import { GroupMembershipType } from '@project-sunbird/client-services/models';

describe('GroupDetailsComponent', () => {
  let component: GroupDetailsComponent;
  let fixture: ComponentFixture<GroupDetailsComponent>;
  configureTestSuite();


  const resourceBundle = {
    'messages': {
      'emsg': {
        'm002': 'Unable to get Group data.Please try again later...',
      }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/my-groups';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupDetailsComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, RouterTestingModule, SuiModalModule, TelemetryModule],
      providers: [ResourceService, GroupsService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle },
        TelemetryService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component['groupService'], 'getImpressionObject').and.returnValue(impressionObj);
    spyOn(component['groupService'], 'addTelemetry');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getGroupData');
    component.ngOnInit();
    expect(component.getGroupData).toHaveBeenCalled();
  });

  it('should get group data', () => {
    const groupService = TestBed.get(GroupsService);
    component['groupId'] = '123';
    spyOn(groupService, 'getGroupById').and.returnValue(of({id: '123', name: 'groupName', members: [], createdBy: '1', description: '',
    membershipType: GroupMembershipType.INVITE_ONLY}));
    spyOn(groupService, 'groupContentsByActivityType').and.returnValue({showList:  true});
    component.getGroupData();
    expect(groupService.getGroupById).toHaveBeenCalledWith('123', true, true, true);
    expect(groupService.groupContentsByActivityType).toHaveBeenCalledWith(false,
    {id: '123', name: 'groupName', members: [], createdBy: '1', isCreator: false, isAdmin: false, initial: 'g',
    description: '', membershipType: GroupMembershipType.INVITE_ONLY});
    expect(component.showActivityList).toBeTruthy();
    expect(component.groupData).toEqual({id: '123', name: 'groupName', members: [], createdBy: '1',
    isCreator: false, isAdmin: false, initial: 'g', description: '',
    membershipType: GroupMembershipType.INVITE_ONLY});
  });


  it('should call toggleActivityModal', () => {
    component.toggleActivityModal();
    expect(component.showModal).toBe(false);
  });

  it('should call filterList', () => {
    component.filterList();
    expect(component.showFilters).toBe(true);
  });

  it('should call handleNextClick', () => {
    component.groupData = GroupDetailsData.groupData;
    const router = TestBed.get(Router);
    component.navigateToAddActivity();
    expect(router.navigate).toHaveBeenCalledWith(['add-activity-content-types'], {
      relativeTo: fakeActivatedRoute,
      queryParams: {
        groupName: _.get(component.groupData, 'name'),
        createdBy: _.capitalize(_.get(_.find(component.groupData['members'], { userId: component.groupData['createdBy'] }), 'name'))
      }
    });
  });

  it('should ngOnDestroy', () => {
    component.showModal = true;
    component.addActivityModal = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
    expect(component.addActivityModal.deny).toHaveBeenCalled();
  });

  it('should get impressionObject', () => {
    component.ngOnInit();
    expect(component.telemetryImpression).toEqual(impressionObj);
    expect(component['groupService'].getImpressionObject).toHaveBeenCalled();
  });

  it('show change dropdownMenuContent', () => {
    component.showMemberPopup = false;
    component.toggleFtuModal(true);
    expect(component.showMemberPopup).toBeTruthy();
  });

  it('should emit "EVENT when user clicked on activate group next to msg: activate"', () => {
    spyOn(component['groupService'], 'emitActivateEvent');
    component.handleEvent();
    expect(component['groupService'].emitActivateEvent).toHaveBeenCalledWith('activate', 'activate-group');
  });
});
