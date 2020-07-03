import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { GroupsService } from './groups.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, FrameworkService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@sunbird/shared';
import { groupServiceMockData } from './groups.service.spec.data';
import { of } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { configureTestSuite } from '@sunbird/test-util';

describe('GroupsService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [GroupsService, ConfigService, UserService, FrameworkService, ChannelService, OrgDetailsService,
        {provide: APP_BASE_HREF, useValue: '/'}]
    });
  });

  it('should be created', inject([GroupsService], (service: GroupsService) => {
    expect(service).toBeTruthy();
  }));

  it ('should call groupCs create', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'create');
    service.createGroup({name: 'BAC', description: 'NEW GROUPS'});
    expect(service['groupCservice'].create).toHaveBeenCalledWith({name: 'BAC', description: 'NEW GROUPS'});
  });

  it('should get all group list', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'search').and.callThrough();
    service.searchUserGroups({filters: {userId: '123'}});
    expect(service['groupCservice'].search).toHaveBeenCalledWith({filters: {userId: '123'}});
  });

  it ('should call groupCs getById', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'getById');
    service.getGroupById('123', true);
    expect(service['groupCservice'].getById).toHaveBeenCalledWith('123', {includeMembers: true});
  });

  it ('should call groupCs deleteById', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'deleteById').and.callThrough();
    service.deleteGroupById('123');
    expect(service['groupCservice'].deleteById).toHaveBeenCalledWith('123');
  });

  it ('should call groupCs updateById', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'updateById');
    service.updateGroup('123', {name: 'abcd'});
    expect(service['groupCservice'].updateById).toHaveBeenCalledWith('123', {name: 'abcd'});
  });


  it ('should set group', () => {
    const service = TestBed.get(GroupsService);
    service.groupData = {name: 'Test', description: 'Test groups description'};
    expect(service['_groupData']).toEqual({name: 'Test', description: 'Test groups description'});
  });

});

