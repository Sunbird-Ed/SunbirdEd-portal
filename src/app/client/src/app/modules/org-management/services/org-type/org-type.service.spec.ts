
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrgTypeService } from './org-type.service';
import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { mockRes } from './org-type.service.spec.data';

describe('OrgTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgTypeService]
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrgTypeService, LearnerService, ConfigService]
    });
  });

  it('should call get org type API and get success', inject([OrgTypeService, LearnerService], (orgTypeService: OrgTypeService,
    learnerService: LearnerService) => {
    spyOn(learnerService, 'get').and.callFake(() => observableOf(mockRes.orgTypeSuccess));
    const apiRes = orgTypeService.getOrgTypes();
    expect(orgTypeService).toBeTruthy();
    expect(learnerService.get).toHaveBeenCalled();
    expect(orgTypeService.orgTypeData$).toBeDefined();
  }));

  it('should call get org type API and get error', inject([OrgTypeService, LearnerService], (orgTypeService: OrgTypeService,
    learnerService: LearnerService) => {
    spyOn(learnerService, 'get').and.callFake(() => observableThrowError(mockRes.orgTypeError));
    const apiRes = orgTypeService.getOrgTypes();
    expect(orgTypeService).toBeTruthy();
    expect(learnerService.get).toHaveBeenCalled();
    expect(orgTypeService.orgTypeData$).toBeDefined();
  }));

  it('should call add org type API and get success', inject([OrgTypeService, LearnerService], (orgTypeService: OrgTypeService,
    learnerService: LearnerService) => {
    spyOn(learnerService, 'post').and.callFake(() => observableOf(mockRes.orgTypeAddSuccess));
    const apiRes = orgTypeService.addOrgType('test');
    expect(orgTypeService).toBeTruthy();
    expect(learnerService.post).toHaveBeenCalled();
    expect(orgTypeService.orgTypeData$).toBeDefined();
  }));

  it('should call add org type API and get error', inject([OrgTypeService, LearnerService], (orgTypeService: OrgTypeService,
    learnerService: LearnerService) => {
    spyOn(learnerService, 'post').and.callFake(() => observableThrowError(mockRes.orgTypeAddError));
    const apiRes = orgTypeService.addOrgType('test');
    expect(orgTypeService).toBeTruthy();
    expect(learnerService.post).toHaveBeenCalled();
    expect(orgTypeService.orgTypeData$).toBeDefined();
  }));

  it('should call update org type API and get success', inject([OrgTypeService, LearnerService], (orgTypeService: OrgTypeService,
    learnerService: LearnerService) => {
    spyOn(learnerService, 'patch').and.callFake(() => observableOf(mockRes.orgTypeUpdateSuccess));
    const apiRes = orgTypeService.updateOrgType('test');
    expect(orgTypeService).toBeTruthy();
    expect(learnerService.patch).toHaveBeenCalled();
    expect(orgTypeService.orgTypeData$).toBeDefined();
  }));

  it('should call update org type API and get error', inject([OrgTypeService, LearnerService], (orgTypeService: OrgTypeService,
    learnerService: LearnerService) => {
    spyOn(learnerService, 'patch').and.callFake(() => observableThrowError(mockRes.orgTypeUpdateError));
    const apiRes = orgTypeService.updateOrgType('test');
    expect(orgTypeService).toBeTruthy();
    expect(learnerService.patch).toHaveBeenCalled();
    expect(orgTypeService.orgTypeData$).toBeDefined();
  }));
});
