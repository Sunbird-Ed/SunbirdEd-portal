
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import * as testData from './org-management.service.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@sunbird/shared';
import { OrgManagementService } from './org-management.service';
import { LearnerService } from '@sunbird/core';

describe('OrgManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrgManagementService, ConfigService, LearnerService]
    });
  });
  it('should call get status api and return success response', () => {
    const learnerService = TestBed.get(LearnerService);
    const orgManagementService = TestBed.get(OrgManagementService);
    const processId = '012465880638177280660';
    spyOn(learnerService, 'get').and.callFake(() => observableOf(testData.mockRes.successBulkStatusResponse));
    orgManagementService.getBulkUploadStatus(processId).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
      });
  });
  it('should call bulkOrgUpload method', () => {
    const learnerService = TestBed.get(LearnerService);
    const orgManagementService = TestBed.get(OrgManagementService);
    const formData = new FormData();
    formData.append('org', testData.mockRes.request[0]);
    const fd = formData;
    spyOn(learnerService, 'post').and.callFake(() => observableOf(testData.mockRes.successBulkStatusResponse));
    orgManagementService.bulkOrgUpload(testData.mockRes.request).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
      });
  });
  it('should call bulkUserUpload method', () => {
    const learnerService = TestBed.get(LearnerService);
    const orgManagementService = TestBed.get(OrgManagementService);
    const formData = new FormData();
    formData.append('org', testData.mockRes.userRequest[0]);
    const fd = formData;
    spyOn(learnerService, 'post').and.callFake(() => observableOf(testData.mockRes.successBulkStatusResponse));
    orgManagementService.bulkUserUpload(fd).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
      });
  });
});
