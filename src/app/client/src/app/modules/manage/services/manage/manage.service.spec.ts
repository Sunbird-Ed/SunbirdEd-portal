import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ConfigService,RequestParam,ServerResponse } from '@sunbird/shared';
import { LearnerService } from '../../../core/services/learner/learner.service';
import { of } from 'rxjs';
import { ManageService } from './manage.service';

describe('ManageService', () => {
    let manageService: ManageService;

    const mockConfigService :Partial<ConfigService> ={
        urlConFig: {
            URLS: {
              ADMIN: {
                BULK: {
                  ORGANIZATIONS_UPLOAD: 'mocked_upload_url',
                  STATUS: 'mocked_status_url',
                },
              },
            },
        },
    };
	const mockLearnerService :Partial<LearnerService> ={
        post: jest.fn(),
        get: jest.fn(),
    };
	const mockHttpClient :Partial<HttpClient> ={
        get: jest.fn(),
    } as any;

    beforeAll(() => {
        manageService = new ManageService(
            mockConfigService as ConfigService,
			mockLearnerService as LearnerService,
			mockHttpClient as HttpClient as any
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(manageService).toBeTruthy();
    });

    describe('bulkOrgUpload', () => {
        it('should call learnerService.post with the correct options', () => {
          const req = {mockRequest: "MockUpload"};
          manageService.bulkOrgUpload(req);
          expect(mockLearnerService.post).toHaveBeenCalledWith({
            url: mockConfigService.urlConFig.URLS.ADMIN.BULK.ORGANIZATIONS_UPLOAD,
            data: req,
          });
        });
    });

    describe('getBulkUploadStatus', () => {
        it('should call learnerService.get with the correct options', () => {
          const processId = 1;
          manageService.getBulkUploadStatus(processId);
          expect(mockLearnerService.get).toHaveBeenCalledWith({
            url: `${mockConfigService.urlConFig.URLS.ADMIN.BULK.STATUS}/${processId}`,
          });
        });
    });
    
    describe('getData', () => {
      it('should call httpClient.get with correct parameters and return mapped response', () => {
          const slug = 'example-slug';
          const fileName = 'example-file';
          const downloadFileName = 'example-download-file';
          const expectedUrl = `/admin-reports/${slug}/${fileName}`;
          const expectedHeaders = new HttpHeaders({
            'Content-Disposition': 'attachment',
            'filename': downloadFileName,
          });
      
          const mockApiResponse = { result: 'mocked data' };
          (mockHttpClient.get as jest.Mock).mockReturnValue(of(mockApiResponse));
      
          manageService.getData(slug, fileName, downloadFileName).subscribe((result) => {
            expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl, { headers: expectedHeaders });
            expect(result).toEqual({ responseCode: 'OK', result: mockApiResponse.result });
          });
      });

      it('should call httpClient.get with correct parameters when downloadFileName is not provided', () => {
          const slug = 'example-slug';
          const fileName = 'example-file';
          const expectedUrl = `/admin-reports/${slug}/${fileName}`;
          const expectedHeaders = new HttpHeaders();

          const mockApiResponse = { result: 'mocked data' };
          (mockHttpClient.get as jest.Mock).mockReturnValue(of(mockApiResponse));
      
          manageService.getData(slug, fileName).subscribe((result) => {
            expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl, { headers: expectedHeaders });
            expect(result).toEqual({ responseCode: 'OK', result: mockApiResponse.result });
          });
      });
  });

    describe('updateRoles', () => {
        it('should call learnerService.post with the correct options', () => {
            const requestParam = { userId:1,orgId:1,roles:['Content-Creator','Content-Reader'] };
            manageService.updateRoles(requestParam);
            expect(mockLearnerService.post).toHaveBeenCalledWith({
            url: mockConfigService.urlConFig.URLS.ADMIN.UPDATE_USER_ORG_ROLES,
            data: {
                request: {
                userId: requestParam.userId,
                organisationId: requestParam.orgId,
                roles: requestParam.roles,
                },
            },
            });
        });
    });  
 });
    
