import { IGroupMember } from './../../interfaces/group';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersComponent } from './group-members.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ResourceService, SharedModule, ToasterService } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule } from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';
import { configureTestSuite } from '@sunbird/test-util';
import { of, throwError } from 'rxjs';
import { GroupsService } from '../../services/groups/groups.service';
import { GroupEntityStatus, GroupMembershipType, GroupMemberRole } from '@project-sunbird/client-services/models/group';

describe('GroupMembersComponent', () => {
  let component: GroupMembersComponent;
  let fixture: ComponentFixture<GroupMembersComponent>;
  let members: IGroupMember[] = [];
  const resourceBundle = {
    'messages': {
      'fmsg': {
        'm0085': 'There is some technical error',
      },
      'smsg': {
        'promoteAsAdmin': '{memberName} is admin now',
        'dissmissAsAdmin': '{memberName} is no more admin now',
        'removeMember': '{memberName} is no longer part of the group'
      },
      'emsg': {
        'promoteAsAdmin': 'Unable to make {memberName} as admin',
        'dissmissAsAdmin': 'Unable to demote as an admin',
        'removeMember': 'Unable to remove member from the group, please try again'
      }
    },
    'frmelmnts': {
      'lbl': {}
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    snapshot: {
      queryParams: {},
      data: {
        telemetry: { env: 'group' }
      }
    }
  };

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupMembersComponent],
      imports: [SharedModule.forRoot(),
        CoreModule, HttpClientTestingModule, SuiModule, TelemetryModule.forRoot(), SlickModule],
      providers: [
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMembersComponent);
    component = fixture.componentInstance;
    members = [
      {
        identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false,
        indexOfMember: 1, isCreator: true, name: 'John Doe', userId: '1', role: GroupMemberRole.ADMIN, id: '1',
        groupId: '', status: GroupEntityStatus.ACTIVE
      },
      {
        identifier: '2', initial: 'P', title: 'Paul Walker', isAdmin: false, isMenu: true,
        indexOfMember: 5, isCreator: false, name: 'Paul Walke', userId: '2', role: GroupMemberRole.MEMBER, id: '1',
        groupId: '', status: GroupEntityStatus.ACTIVE
      },
      {
        identifier: '6', initial: 'R', title: 'Robert Downey', isAdmin: true, isMenu: true,
        indexOfMember: 7, isCreator: false, name: 'Robert Downey', userId: '3', role: GroupMemberRole.MEMBER, id: '1',
        groupId: '', status: GroupEntityStatus.ACTIVE
      }
    ];
    component.groupData = {id: '123', name: 'Test', members: [
      {
        groupId: '',
        status: GroupEntityStatus.ACTIVE,
        userId: '1',
        role: GroupMemberRole.ADMIN,
        name: 'user'
      }],
      createdBy: '1',
      description: '',
      membershipType: GroupMembershipType.INVITE_ONLY
    };
    spyOn(component['groupsService'], 'addFieldsToMember').and.returnValue(members);
    spyOn(component['groupsService'], 'membersList').and.returnValue(of(members));
    fixture.detectChanges();
  });

  it('should create', () => {
    component.groupId = '123';
    spyOn(component, 'getUpdatedGroupData');
    const expectedMemberList = members.map(item => { item.isMenu = false; return item; });
    console.log('expectedMemberList', expectedMemberList);
    component.showKebabMenu = true;
    component.config.showMemberMenu = false;
    document.body.dispatchEvent(new Event('click'));
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.getUpdatedGroupData).toHaveBeenCalled();
  });

  it('should call getMenuData', () => {
    component.showKebabMenu = false;
    const member = {
      identifier: '2', initial: 'P', title: 'Paul Walker', isAdmin: false, isMenu: true, indexOfMember: 5, isCreator: false
    };
    const clickEvent = {
      stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
    };
    component.getMenuData({ data: { name: 'delete' }, event: clickEvent }, member);
    expect(component.showKebabMenu).toBe(true);
  });

  it('should call search', () => {
    component.showSearchResults = false;
    members = [
      {
        identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false,
        indexOfMember: 1, isCreator: true, name: 'John Doe', userId: '1', role: GroupMemberRole.ADMIN, id: '1',
        groupId: '', status: GroupEntityStatus.ACTIVE
      },
    ];
    component.members = members;
    component.memberListToShow = [];
    component.search('Joh');
    expect(component.showSearchResults).toBe(true);
  });

  it('should reset the list to membersList when no search key present', () => {
    component.showSearchResults = true;
    members = [
      {
        identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false,
        indexOfMember: 1, isCreator: true, name: 'John Doe', userId: '1', role: GroupMemberRole.ADMIN, id: '1',
        groupId: '', status: GroupEntityStatus.ACTIVE
      },
    ];
    component.members = members;
    component.search('');
    expect(component.showSearchResults).toBe(false);
  });

  it('should call search when there is space in searchKey', () => {
    component.showSearchResults = false;
    members = [
      {
        identifier: '1', initial: 'J', title: 'John Doe', isAdmin: true, isMenu: false,
        indexOfMember: 1, isCreator: true, name: 'John Doe', userId: '1', role: GroupMemberRole.ADMIN, id: '1',
        groupId: '', status: GroupEntityStatus.ACTIVE},
    ];
    component.members = members;
    component.search(' j ');
    expect(component.showSearchResults).toBe(true);
    expect(component.memberListToShow).toEqual(members);
  });

  it('should open the modal', () => {
    component.showModal = false;
    component.openModal('delete');
    expect(component.showModal).toBe(true);
    expect(component.memberAction).toEqual('delete');
  });

  it('should call addMember', () => {
    const router = TestBed.get(Router);
    component.addMember();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call onModalClose', () => {
    component.onModalClose();
  });

  it('should call onActionConfirm on promote as admin', () => {
    spyOn(component, 'promoteMember');
    const event = { action: 'promoteAsAdmin', data: {} };
    component.onActionConfirm(event);
    expect(component.promoteMember).toHaveBeenCalled();
  });

  it('should call onActionConfirm on remove member', () => {
    spyOn(component, 'removeMember');
    const event = { action: 'removeFromGroup', data: {} };
    component.onActionConfirm(event);
    expect(component.removeMember).toHaveBeenCalled();
  });

  it('should call onActionConfirm on dismiss Admin', () => {
    spyOn(component, 'dismissRole');
    const event = { action: 'dismissAsAdmin', data: {} };
    component.onActionConfirm(event);
    expect(component.dismissRole).toHaveBeenCalled();
  });

  it('should call promoteMember', () => {
    const groupsService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    const data = {
      userId: 'abcd-pqrs',
      name: 'John'
    };
    spyOn(groupsService, 'updateMembers').and.returnValue(of({}));
    spyOn(component, 'getUpdatedGroupData');
    spyOn(toasterService, 'success');
    component.promoteMember(data);
    expect(component.getUpdatedGroupData).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalled();
  });

  it('should call promoteMember on error', () => {
    const groupsService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    const data = {
      userId: 'abcd-pqrs',
      name: 'John'
    };
    spyOn(groupsService, 'updateMembers').and.returnValue(throwError({}));
    spyOn(component, 'getUpdatedGroupData');
    spyOn(toasterService, 'error');
    component.promoteMember(data);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call removeMember', () => {
    const groupsService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    const data = {
      userId: 'abcd-pqrs',
      name: 'John'
    };
    spyOn(groupsService, 'removeMembers').and.returnValue(of({}));
    spyOn(component, 'getUpdatedGroupData');
    spyOn(toasterService, 'success');
    component.removeMember(data);
    expect(component.getUpdatedGroupData).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalled();
  });

  it('should call removeMember error', () => {
    const groupsService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    const data = {
      userId: 'abcd-pqrs',
      name: 'John'
    };
    spyOn(groupsService, 'removeMembers').and.returnValue(throwError({}));
    spyOn(component, 'getUpdatedGroupData');
    spyOn(toasterService, 'error');
    component.removeMember(data);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call dismissRole', () => {
    const groupsService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    const data = {
      userId: 'abcd-pqrs',
      name: 'John'
    };
    spyOn(groupsService, 'updateMembers').and.returnValue(of({}));
    spyOn(component, 'getUpdatedGroupData');
    spyOn(toasterService, 'success');
    component.dismissRole(data);
    expect(component.getUpdatedGroupData).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalled();
  });

  it('should call dismissRole error', () => {
    const groupsService = TestBed.get(GroupsService);
    const toasterService = TestBed.get(ToasterService);
    const data = {
      userId: 'abcd-pqrs',
      name: 'John'
    };
    spyOn(groupsService, 'updateMembers').and.returnValue(throwError({}));
    spyOn(toasterService, 'error');
    component.dismissRole(data);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call getUpdatedGroupData', () => {
    const response = {
      id: '123', name: 'Test', members:
        [{ userId: '2', role: 'member', name: 'user' }, { userId: '1', role: 'admin', name: 'user 2' }]
    };
    component.groupData = {
      id: '123', isAdmin: true, createdBy: 'user_123', name: 'Test group',
      description: '', membershipType: GroupMembershipType.INVITE_ONLY,
      members: []
    };
    spyOn(component['groupsService'], 'getGroupById').and.returnValue(of(response));
    component.getUpdatedGroupData();
    expect(component.groupData).toBeDefined();
    expect(component.memberListToShow).toBeDefined();
  });
});
