import { TelemetryService } from '@sunbird/telemetry';
import { TestBed, inject } from '@angular/core/testing';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { GroupsService } from './groups.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, FrameworkService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@sunbird/shared';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';
import { GroupMemberRole } from '@project-sunbird/client-services/models/group';
import { groupData, modifiedActivities } from './groups.service.spec.data';

describe('GroupsService', () => {
  configureTestSuite();
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        you: 'You',
        ACTIVITY_COURSE_TITLE: 'Courses',
        ACTIVITY_TEXTBOOK_TITLE: 'Textbooks'
      },

    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [GroupsService, ConfigService, UserService, FrameworkService, ChannelService, OrgDetailsService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ResourceService, useValue: resourceBundle },
        TelemetryService,
      ]
    });
  });

  it('should be created', inject([GroupsService], (service: GroupsService) => {
    expect(service).toBeTruthy();
  }));

  it('should call groupCs create', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'create');
    service.createGroup({ name: 'BAC', description: 'NEW GROUPS' });
    expect(service['groupCservice'].create).toHaveBeenCalledWith({ name: 'BAC', description: 'NEW GROUPS' });
  });

  it('should get all group list', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'search').and.callThrough();
    service.searchUserGroups({ filters: { userId: '123' } });
    expect(service['groupCservice'].search).toHaveBeenCalledWith({ filters: { userId: '123' } });
  });


  it('should call updateMembers', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'updateMembers').and.callThrough();
    service.updateMembers('123', { userId: 'pop-sdsds-sdsd', role: GroupMemberRole.ADMIN });
    expect(service['groupCservice'].updateMembers).toHaveBeenCalledWith('123', { userId: 'pop-sdsds-sdsd', role: GroupMemberRole.ADMIN });
  });


  it('should call removeMembers', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'removeMembers').and.callThrough();
    service.removeMembers('123', ['por-sdl-sas']);
    expect(service['groupCservice'].removeMembers).toHaveBeenCalledWith('123', { userIds: ['por-sdl-sas'] });
  });


  it('should call addActivities', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'addActivities').and.callThrough();
    service.addActivities('123', { id: 'do_233433y4234324', type: 'Course' });
    expect(service['groupCservice'].addActivities).toHaveBeenCalledWith('123', { id: 'do_233433y4234324', type: 'Course' });
  });


  it('should call updateActivities', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'updateActivities').and.callThrough();
    service.updateActivities('123', { id: 'do_233433y4234324', type: 'Textbook' });
    expect(service['groupCservice'].updateActivities).toHaveBeenCalledWith('123', { id: 'do_233433y4234324', type: 'Textbook' });
  });

  it('should call removeActivities', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'removeActivities').and.callThrough();
    service.removeActivities('123', { activityIds: ['do_233433y4234324'] });
    expect(service['groupCservice'].removeActivities).toHaveBeenCalledWith('123', { activityIds: ['do_233433y4234324'] });
  });


  xit('should call getActivity', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'getActivity').and.callThrough();
    service.getActivity('123', { id: 'do_233433y4234324', type: 'Course' });
    expect(service['groupCservice']['activityService']['getDataAggregation']).toHaveBeenCalledWith('123', { id: 'do_233433y4234324', type: 'Course' });
  });

  it('should call groupCs getById', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'getById');
    service.getGroupById('123', true, true, true);
    expect(service['groupCservice'].getById).toHaveBeenCalledWith('123',
    { includeMembers: true, includeActivities: true, groupActivities: true });
  });

  it('should call groupCs deleteById', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'deleteById').and.callThrough();
    service.deleteGroupById('123');
    expect(service['groupCservice'].deleteById).toHaveBeenCalledWith('123');
  });

  it('should call groupCs updateById', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'updateById');
    service.updateGroup('123', { name: 'abcd' });
    expect(service['groupCservice'].updateById).toHaveBeenCalledWith('123', { name: 'abcd' });
  });

  it('should set group', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service, 'addGroupFields').and.returnValue({
      name: 'Test',
      description: 'Test groups description', isCreator: true, isAdmin: true, initial: 'T'
    });
    service.groupData = { name: 'Test', description: 'Test groups description' };
    expect(service['_groupData']).toEqual({
      name: 'Test',
      description: 'Test groups description', isCreator: true, isAdmin: true, initial: 'T'
    });
  });

  it('should add members to group', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'addMembers');
    service.addMemberById('123', { members: [{ role: 'member', userId: '1' }] });
    expect(service['groupCservice'].addMembers).toHaveBeenCalledWith('123', { members: [{ role: 'member', userId: '1' }] });
  });

  it('should emit members', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['membersList'], 'emit');
    service.emitMembers([{ userId: '1', name: 'User' }]);
    expect(service['membersList'].emit).toHaveBeenCalledWith([{ userId: '1', name: 'User' }]);
  });

  it('should return a member with added fields', () => {
    const service = TestBed.get(GroupsService);
    const data = service.addFields({ userId: '1', role: 'admin', name: 'user' });
    expect(data.userId).toEqual('1');
    expect(data.title).toEqual('User');
    expect(data.initial).toEqual('U');
  });

  it('should call addFields()', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service, 'addFields').and.callThrough();
    service.userid = '1';
    service.groupData = { isAdmin: true };
    const data = service.addFieldsToMember([{ userId: '1', role: 'admin', name: 'user', createdBy: '1' }]);
    expect(data[0]).toEqual({
      userId: '1', role: 'admin', name: 'user', createdBy: '1', title: 'User', indexOfMember: 0,
      initial: 'U', identifier: '1', isAdmin: true, isCreator: false, isSelf: false, isMenu: true,
    });
    expect(service.addFields).toHaveBeenCalledTimes(1);
  });

  it('should emit members', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['closeForm'], 'emit');
    service.emitCloseForm();
    expect(service['closeForm'].emit).toHaveBeenCalled();
  });

  it('should call interact() ', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['telemetryService'], 'interact');
    service.addTelemetry('login-group');
    expect(service['telemetryService'].interact).toHaveBeenCalled();
  });

  it('should add colors', () => {
    const service = TestBed.get(GroupsService);
    const response = service.addGroupPaletteList([{name: 'G1', id: '1'}, {name: 'G2', id: '2'}]);
    expect(Object.keys(response[0])).toContain('cardBgColor');
    expect(Object.keys(response[0])).toContain('cardTitleColor');
    expect(Object.keys(response[1])).toContain('cardBgColor');
    expect(Object.keys(response[1])).toContain('cardTitleColor');
  });

  it ('should return activityList and showList value', () => {
    const service = TestBed.get(GroupsService);
    const response = service.groupContentsByActivityType(false, groupData);
    expect(response.showList).toBe(true);
    expect(response.activities).toEqual(modifiedActivities);
  });

  it ('should return activityList and showList value = FALSE', () => {
    const service = TestBed.get(GroupsService);
    const response = service.groupContentsByActivityType(false, {});
    expect(response.showList).toBe(false);
    expect(response.activities).toEqual({});
  });

  it('should emit "showActivateModal EVENT"', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.showActivateModal, 'emit');
    service.emitActivateEvent();
    expect(service.showActivateModal.emit).toHaveBeenCalled();
  });

  it('should call CsGroupService "suspendById()" ', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'suspendById');
    service.deActivateGroupById('123');
    expect(service.groupCservice.suspendById).toHaveBeenCalledWith('123');
  });

  it('should call CsGroupService "reactivateById()" ', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'reactivateById');
    service.activateGroupById('123');
    expect(service.groupCservice.reactivateById).toHaveBeenCalledWith('123');
  });

});
