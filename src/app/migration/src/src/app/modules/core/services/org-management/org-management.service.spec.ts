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
  it('should call get status api and return success response', inject([OrgManagementService],
    (orgManagementService: OrgManagementService) => {
      const processId = '012465880638177280660';
      spyOn(orgManagementService, 'bulkUploadStatus').and.callFake(() => Observable.of(testData.mockRes.successBulkStatusResponse));
      orgManagementService.bulkUploadStatus(processId).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        });
    }));
  it('should call upload method for organization and return success response',
    inject([OrgManagementService], (orgManagementService: OrgManagementService) => {
      const data = [{
        name: 'organizations.csv',
        orgName: 'new org',
        isRootOrg: 'TRUE',
        channel: 'channel110001',
        externalId: 'ugc0001',
        provider: 'technical002',
        description: 'desc',
        homeUrl: 'googlehomeurl',
        orgCode: 'orgcode12345',
        orgType: '',
        preferredLanguage: 'hindi',
        theme: 'goodtheme',
        contactDetail: ''
      }];
      spyOn(orgManagementService, 'bulkOrgUpload').and.callFake(() => Observable.of(testData.mockRes.successBulkStatusResponse));
      orgManagementService.bulkOrgUpload(data).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        });
    }));
  it('should call upload method for user and return success response',
    inject([OrgManagementService], (orgManagementService: OrgManagementService) => {
      const data = [{
        name: 'organizations.csv',
        orgName: 'new org',
        isRootOrg: 'TRUE',
        channel: 'channel110001',
        externalId: 'ugc0001',
        provider: 'technical002',
        description: 'desc',
        homeUrl: 'googlehomeurl',
        orgCode: 'orgcode12345',
        orgType: '',
        preferredLanguage: 'hindi',
        theme: 'goodtheme',
        contactDetail: ''
      }];
      spyOn(orgManagementService, 'bulkUserUpload').and.callFake(() => Observable.of(testData.mockRes.successBulkStatusResponse));
      orgManagementService.bulkUserUpload(data).subscribe(
        apiResponse => {
          // expect(apiResponse.responseCode).toBe('OK');
        });
      expect(orgManagementService.upload(data)).toHaveBeenCalled();
    }));
  it('should call get status api and return success response', inject([OrgManagementService, ConfigService],
    (orgManagementService: OrgManagementService) => {
      const data = [{
        name: 'organizations.csv',
        orgName: 'new org',
        isRootOrg: 'TRUE',
        channel: 'channel110001',
        externalId: 'ugc0001',
        provider: 'technical002',
        description: 'desc',
        homeUrl: 'googlehomeurl',
        orgCode: 'orgcode12345',
        orgType: '',
        preferredLanguage: 'hindi',
        theme: 'goodtheme',
        contactDetail: ''
      }];
      spyOn(orgManagementService, 'upload').and.callFake(() => Observable.of(testData.mockRes.successBulkStatusResponse));
      orgManagementService.upload(data).subscribe(
        apiResponse => {
          expect(apiResponse.responseCode).toBe('OK');
        });
    }));
});
