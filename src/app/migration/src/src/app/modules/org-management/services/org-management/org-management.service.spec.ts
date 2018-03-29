import { TestBed, inject } from '@angular/core/testing';
import * as testData from './org-management.service.data';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@sunbird/shared';
import { OrgManagementService } from './org-management.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LearnerService } from '@sunbird/core';

describe('OrgManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientModule, OrgManagementService, ConfigService, LearnerService, HttpClient]
    });
  });

  it('should be created', inject([OrgManagementService], (service: OrgManagementService) => {
    expect(service).toBeTruthy();
  }));
  it('should call get status api and return success response', inject([OrgManagementService, LearnerService],
    (orgManagementService: OrgManagementService, learnerService: LearnerService) => {
      const processId = '012465880638177280660';
      spyOn(learnerService, 'get').and.callFake(() => Observable.of(testData.mockRes.successBulkStatusResponse));
      orgManagementService.getBulkUploadStatus(processId).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        });
    }));
  it('should call bulkOrgUpload method',
    inject([OrgManagementService, LearnerService], (orgManagementService: OrgManagementService, learnerService: LearnerService) => {
      const formData = new FormData();
      formData.append('org', testData.mockRes.request[0]);
      const fd = formData;
      spyOn(learnerService, 'post').and.callFake(() => Observable.of(testData.mockRes.successBulkStatusResponse));
      orgManagementService.bulkOrgUpload(testData.mockRes.request).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        });
    }));
  it('should call bulkUserUpload method',
    inject([OrgManagementService, LearnerService], (orgManagementService: OrgManagementService, learnerService: LearnerService) => {
      const formData = new FormData();
      formData.append('org', testData.mockRes.userRequest[0]);
      const fd = formData;
      spyOn(learnerService, 'post').and.callFake(() => Observable.of(testData.mockRes.successBulkStatusResponse));
      orgManagementService.bulkUserUpload(fd).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        });
    }));
});
