import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { GroupsService } from './groups.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreModule, FrameworkService, UserService, ChannelService, OrgDetailsService } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@sunbird/shared';
import { groupServiceMockData } from './groups.service.spec.data';
import { of as observableOf, of } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';

describe('GroupsService', () => {
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

  it('should not be custodian user', () => {
    const service = TestBed.get(GroupsService);
    const userService = TestBed.get(UserService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    userService._userProfile = groupServiceMockData.userMockData;
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() => observableOf(groupServiceMockData.custodianOrg));
    service.isCustodianOrgUser().subscribe(
      apiResponse => {
        expect(apiResponse).toBeFalsy();
      }
    );
  });

  it('should be custodian user', () => {
    const service = TestBed.get(GroupsService);
    const userService = TestBed.get(UserService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    userService._userProfile = groupServiceMockData.userMockData;
    userService._userProfile.rootOrg.rootOrgId = '0126632859575746566';
    spyOn(orgDetailsService, 'getCustodianOrg').and.callFake(() => observableOf(groupServiceMockData.custodianOrg));
    service.isCustodianOrgUser().subscribe(
      apiResponse => {
        expect(apiResponse).toBeTruthy();
      }
    );
  });

  it('should get custodian org data', () => {
    const service = TestBed.get(GroupsService);
    const userService = TestBed.get(UserService);
    const channelService = TestBed.get(ChannelService);
    userService._userProfile = groupServiceMockData.userMockData;
    spyOn(channelService, 'getFrameWork').and.callFake(() => observableOf(groupServiceMockData.custOrgFrameworks1));
    service.getCustodianOrgData();
    expect(channelService.getFrameWork).toHaveBeenCalled();
  });

  it('should get filtered field data', () => {
    const service = TestBed.get(GroupsService);
    const frameworkService = TestBed.get(FrameworkService);
    spyOn(frameworkService, 'initialize').and.callThrough();
    spyOn(frameworkService, 'frameworkData$').and.callFake(() => observableOf(groupServiceMockData.frameworkDetails));
    spyOn(service, 'filterFrameworkCategories').and.callThrough();
    spyOn(service, 'filterFrameworkCategoryTerms').and.callThrough();
    service.getFilteredFieldData();
    expect(frameworkService.initialize).toHaveBeenCalled();
  });

});

