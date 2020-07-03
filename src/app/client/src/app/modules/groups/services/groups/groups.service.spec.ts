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

  it('should get all group list', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service.groupCservice, 'getAll').and.callThrough();
    service.getAllGroups();
  });

  it ('should call groupCs create', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'create');
    service.createGroup({name: 'BAC', description: 'NEW GROUPS'});
    expect(service['groupCservice'].create).toHaveBeenCalled();
  });

  it ('should call groupCs create', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'getById');
    service.getGroupById('123');
    expect(service['groupCservice'].getById).toHaveBeenCalledWith('123');
  });

  it ('should call groupCs create', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'deleteById');
    service.deleteGroupById('123');
    expect(service['groupCservice'].deleteById).toHaveBeenCalledWith('123');
  });

  it ('should call groupCs create', () => {
    const service = TestBed.get(GroupsService);
    spyOn(service['groupCservice'], 'addMemberById');
    service.addMemberById('member1', '123');
    expect(service['groupCservice'].addMemberById).toHaveBeenCalledWith('member1', '123');
  });

});

