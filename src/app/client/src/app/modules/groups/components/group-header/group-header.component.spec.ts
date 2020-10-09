import { GroupEntityStatus, GroupMemberRole, GroupMembershipType } from '@project-sunbird/client-services/models/group';
import { TelemetryService } from '@sunbird/telemetry';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupHeaderComponent } from './group-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MY_GROUPS, GROUP_DETAILS, CREATE_GROUP, EDIT_GROUP } from './../../interfaces';
import { APP_BASE_HREF } from '@angular/common';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { impressionObj, fakeActivatedRoute } from './../../services/groups/groups.service.spec.data';
import { GroupsService } from '../../services/groups/groups.service';

describe('GroupHeaderComponent', () => {
  let component: GroupHeaderComponent;
  let fixture: ComponentFixture<GroupHeaderComponent>;
  configureTestSuite();

  const resourceBundle = {
    messages: {
      smsg: { m002: '' },
      emsg: { m003: '' },
      imsg: { m0082: 'Deleting {group name} will permanently remove the group from the application' }
    },
    frmelmnts: {
      lbl: {
        createGroup: 'create group',
        you: 'You',
        deactivategrpques: 'Deactivate group',
        activategrpques: 'Activate group?',
        deleteGroup: 'Delete Group'
      },
      msg: {
        deactivategrpsuccess: 'Group deactivated successfully',
        deactivategrpfailed: 'Could not deactivate group, try again later',
        activategrpsuccess: 'Group activated successfully',
        activategrpfailed: 'Could not activate group, try again later',
        deactivategrpmsg: 'Deactivating the group will take it off from the list of active groups and you will not be able to check member progress on it',
        activategrppopup: 'This group is temporarily deactivated. Group Admin can activate the group'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url: '/my-groups';
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupHeaderComponent],
      imports: [SuiModule, CommonConsumptionModule, SharedModule.forRoot(), HttpClientModule, RouterTestingModule],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
      { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      { provide: APP_BASE_HREF, useValue: '/' },
      { provide: Router, useClass: RouterStub },
        TelemetryService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHeaderComponent);
    component = fixture.componentInstance;
    component.groupData = {
      id: '123', isAdmin: true, createdBy: 'user_123', name: 'Test group',
      members: [{ userId: 'user_123', createdBy: 'user_123', name: 'user123', role: GroupMemberRole.ADMIN, id: '1',
      groupId: '', status: GroupEntityStatus.ACTIVE }],
      description: '',
      membershipType: GroupMembershipType.INVITE_ONLY,
    };
    spyOn(component['groupService'], 'getImpressionObject').and.returnValue(impressionObj);
    spyOn(component['groupService'], 'addTelemetry');
    fixture.detectChanges();
  });

  it('should create', () => {
    component.groupData['isCreator'] = true;
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.creator).toEqual('User123');
  });

  it('should set creator name', () => {
    component.groupData = {
      isAdmin: false,
      name: 'Test',
      createdBy: 'abcd-pqr-xyz',
      id: 'pop-wer',
      description: '',
      membershipType: GroupMembershipType.INVITE_ONLY,
      members: [{
        identifier: '2', initial: 'P', title: 'Paul Walker', isAdmin: false, isMenu: true,
      indexOfMember: 5, isCreator: false, name: 'Admin user', userId: 'abcd-pqr-xyz', role: GroupMemberRole.MEMBER, id: '1',
      groupId: '', status: GroupEntityStatus.ACTIVE, createdBy: 'abcd-pqr-xyz'}]
    };

    component.ngOnInit();
    expect(component.creator).toEqual('Admin user');
  });

  it('should assign modalTitle and msg as deactivate strings when name = "deActivate" ', () => {
    spyOn(component, 'assignModalStrings');
    component.toggleModal(true, 'deActivate');
    expect(component.showModal).toBeTruthy();
    expect(component.modalName).toBe('deActivate');
    expect(component.assignModalStrings).toHaveBeenCalledWith(resourceBundle.frmelmnts.lbl.deactivategrpques,
      resourceBundle.frmelmnts.msg.deactivategrpmsg);
  });

  it('should assign modalTitle and msg as deactivate strings when name = "delete" ', () => {
    spyOn(component, 'assignModalStrings');
    component.groupData.name = 'group';
    component.toggleModal(true, 'delete');
    expect(component.showModal).toBeTruthy();
    expect(component.modalName).toBe('delete');
    expect(component.assignModalStrings).toHaveBeenCalledWith(resourceBundle.frmelmnts.lbl.deleteGroup,
      resourceBundle.messages.imsg.m0082, '{group name}');
  });

  it('should assign modalTitle and msg as deactivate strings when name = "activate" ', () => {
    spyOn(component, 'assignModalStrings');
    component.toggleModal(true, 'activate');
    expect(component.showModal).toBeTruthy();
    expect(component.modalName).toBe('activate');
    expect(component.assignModalStrings).toHaveBeenCalledWith(resourceBundle.frmelmnts.lbl.activategrpques,
      resourceBundle.frmelmnts.msg.activategrppopup);
  });

  it('should not call "assignModalStrings when there is name param is passed"', () => {
    spyOn(component, 'assignModalStrings');
    component.toggleModal(false);
    expect(component.showModal).toBeFalsy();
    expect(component.assignModalStrings).not.toHaveBeenCalled();
  });

  it ('should assign modaltitle and modalmsg strings', () => {
    component.assignModalStrings(resourceBundle.frmelmnts.lbl.activategrpques,
      resourceBundle.frmelmnts.msg.activategrppopup);
      expect(component.modalTitle).toEqual(resourceBundle.frmelmnts.lbl.activategrpques);
      expect(component.modalMsg).toEqual(resourceBundle.frmelmnts.msg.activategrppopup);
  });

  it('should call toggle modal and deleteGroupById', fakeAsync(() => {
    spyOn(component, 'navigateToPreviousPage');
    spyOn(component['groupService'], 'deleteGroupById').and.returnValue(of(true));
    spyOn(component['toasterService'], 'success');
    component.deleteGroup();
    tick(1500);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component['groupService'].deleteGroupById('123').subscribe(response => {
        expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m002);
        expect(component.navigateToPreviousPage).toHaveBeenCalled();
      });
    });
  }));

  it('should route to create-edit-group', () => {
    component.editGroup();
    expect(component['router'].navigate).toHaveBeenCalledWith([`${MY_GROUPS}/${GROUP_DETAILS}`,
    _.get(component.groupData, 'id'), EDIT_GROUP]);
  });

  it('show call goBack', () => {
    spyOn(component['navigationHelperService'], 'goBack');
    component.goBack();
    expect(component['navigationHelperService'].goBack).toHaveBeenCalled();
  });

  it('show change dropdownMenuContent', () => {
    component.dropdownContent = true;
    component.dropdownMenu();
    expect(component.dropdownContent).toBeFalsy();
  });

  it('show emit closeModal event dropdownMenuContent', () => {
    spyOn(component.handleFtuModal, 'emit');
    component.toggleFtuModal(true);
    expect(component.handleFtuModal.emit).toHaveBeenCalledWith(true);
  });

  it('should call addTelemetry', () => {
    component.addTelemetry('ftu-popup');
    expect(component['groupService'].addTelemetry).toHaveBeenCalledWith({id: 'ftu-popup', extra: undefined}, fakeActivatedRoute.snapshot, [{id: '123', type: 'group'}]);
  });

  it('should call leaveGroup on success', () => {
    const groupService = TestBed.get(GroupsService);
    const toastService = TestBed.get(ToasterService);
    groupService.isCurrentUserCreator = false;
    spyOn(toastService, 'success');
    spyOn(groupService, 'removeMembers').and.returnValue(of({}));
    spyOn(component, 'goBack');
    component.leaveGroup();
    expect(component.goBack).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalled();
  });

  it('should call leaveGroup on error', () => {
    const groupService = TestBed.get(GroupsService);
    const toastService = TestBed.get(ToasterService);
    groupService.isCurrentUserCreator = false;
    spyOn(toastService, 'error');
    spyOn(groupService, 'removeMembers').and.returnValue(throwError({}));
    component.leaveGroup();
    expect(toastService.error).toHaveBeenCalled();
  });

  it('should "deActivateGroup on SUCCESS" ', () => {
    spyOn(component['groupService'], 'deActivateGroupById').and.returnValue(of(true));
    spyOn(component['toasterService'], 'success');
    spyOn(component.updateEvent, 'emit');
    component.deActivateGroup();
    component['groupService'].deActivateGroupById('123').subscribe(response => {
      expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.frmelmnts.msg.deactivategrpsuccess);
      expect(component.showLoader).toBeFalsy();
      expect(component.updateEvent.emit).toHaveBeenCalled();
    });
  });

  it('should " throw ERROR on deActivateGroup on Failure" ', () => {
    spyOn(component['groupService'], 'deActivateGroupById').and.returnValue(throwError(true));
    spyOn(component['toasterService'], 'error');
    component.deActivateGroup();
      component['groupService'].deActivateGroupById('123').subscribe(response => {}, err => {
        expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.frmelmnts.msg.deactivategrpfailed);
        expect(component.showLoader).toBeFalsy();
      });
  });

  it('should "activateGroup on SUCCESS" ', () => {
    spyOn(component['groupService'], 'activateGroupById').and.returnValue(of(true));
    spyOn(component['toasterService'], 'success');
    spyOn(component.updateEvent, 'emit');
    component.activateGroup();
    component['groupService'].activateGroupById('123').subscribe(response => {
      expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.frmelmnts.msg.activategrpsuccess);
      expect(component.showLoader).toBeFalsy();
      expect(component.updateEvent.emit).toHaveBeenCalled();
    });
  });

  it('should " throw ERROR on activateGroup on Failure" ', () => {
    spyOn(component['groupService'], 'activateGroupById').and.returnValue(throwError(true));
    spyOn(component['toasterService'], 'error');
    component.activateGroup();
      component['groupService'].activateGroupById('123').subscribe(response => {}, err => {
        expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.frmelmnts.msg.activategrpfailed);
        expect(component.showLoader).toBeFalsy();
      });
  });

  it('should "call deleteGroup() when event id delete" ', () => {
    spyOn(component, 'deleteGroup');
    component.handleEvent({name: 'delete', action: true});
    expect(component.deleteGroup).toHaveBeenCalled();
    expect(component.showModal).toBeFalsy();
    expect(component.showLoader).toBeTruthy();
  });

  it('should "call deActivateGroup() when event id deActivate" ', () => {
    spyOn(component, 'deActivateGroup');
    component.handleEvent({name: 'deActivate', action: true});
    expect(component.deActivateGroup).toHaveBeenCalled();
    expect(component.showModal).toBeFalsy();
    expect(component.showLoader).toBeTruthy();
  });

  it('should "call activateGroup() when event id activate" ', () => {
    spyOn(component, 'activateGroup');
    component.handleEvent({name: 'activate', action: true});
    expect(component.activateGroup).toHaveBeenCalled();
    expect(component.showModal).toBeFalsy();
    expect(component.showLoader).toBeTruthy();
  });

  it ('should call "toggleModal() when showActivateModal event emitted"', () => {
    spyOn(component, 'toggleModal');
    spyOn(component['groupService'], 'showActivateModal').and.returnValue(of (true));
    component.ngOnInit();

    component['groupService'].showActivateModal.subscribe(data => {
      expect(component.toggleModal).toHaveBeenCalledWith(true, 'activate');
    });

  });

});
