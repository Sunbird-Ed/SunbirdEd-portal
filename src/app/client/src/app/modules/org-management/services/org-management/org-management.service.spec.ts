import { Injectable } from '@angular/core';
import { ConfigService,RequestParam,ServerResponse } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { Observable } from 'rxjs';
import { OrgManagementService } from './org-management.service';

describe('OrgManagementService', () => {
    let orgService: OrgManagementService;

    const mockConfigService :Partial<ConfigService> = {
        urlConFig: {
            URLS: {
              ADMIN: {
                BULK: {
                  ORGANIZATIONS_UPLOAD: 'mockUploadUrl',
                  STATUS: 'mockStatusUrl'
                }
              }
            }
        }
    };
	const mockLearnerService :Partial<LearnerService> = {
        post: jest.fn(),
        get: jest.fn()
    };

    beforeAll(() => {
        orgService = new OrgManagementService(
            mockConfigService as ConfigService,
			mockLearnerService as LearnerService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(orgService).toBeTruthy();
    });

    it('should call learnerService post method with correct URL for bulkOrgUpload', () => {
        const mockRequest = { response:'mock-response'};
        const expectedHttpOptions = {
          url: 'mockUploadUrl',
          data: mockRequest
        };
        orgService.bulkOrgUpload(mockRequest);

        expect(mockLearnerService.post).toHaveBeenCalledWith(expectedHttpOptions);
    });

    it('should call learnerService get method with correct URL for getBulkUploadStatus', () => {
        const mockProcessId = 'mockProcessId';
        const expectedOptions = {
          url: 'mockStatusUrl/mockProcessId'
        };
        orgService.getBulkUploadStatus(mockProcessId);
    
        expect(mockLearnerService.get).toHaveBeenCalledWith(expectedOptions);
    });
});
