import { Injectable } from '@angular/core';
import { LearnerService } from '../learner/learner.service';
import { ConfigService } from '@sunbird/shared';
import { TncService } from './tnc.service';
import { of } from 'rxjs';

describe('tncService', () => {
  let tncService: TncService;
  const mockConfig: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        SYSTEM_SETTING: {
          'TNC_CONFIG': 'data/v1/system/settings/get/tncConfig',
          'GROUPS_TNC': 'data/v1/system/settings/get/groupsTnc',
          'ORG_ADMIN_URL': 'data/v1/system/settings/get/orgAdminTnc',
          'REPORT_VIEWER_TNC': 'data/v1/system/settings/get/reportViewerTnc'
        },
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn().mockImplementation(() => { })
  };
  const obj = {
    ServerResponse : {
    id: 'api',
    params: {
      status: 'success',
    },
    responseCode: 'OK',
    result: {
      response: {
        id: 'tncConfig',
        field: 'tncConfig',
        value: '{"latestVersion":"v4","v4":{"url":}}'
      }
    }
    }
  };
  beforeAll(() => {
    tncService = new TncService(
          mockLearnerService as LearnerService,
          mockConfig as ConfigService
      );
  });

  beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
  });

  it('should be create a instance of tnc Service', () => {
      expect(tncService).toBeTruthy();
  });
  describe('getTncConfig', () => {
    it('should call the get tnc config method', () => {
      mockLearnerService.get = jest.fn(() => of(obj.ServerResponse)) as any;
      tncService.getTncConfig().subscribe((data) => {
       expect(mockLearnerService.get).toHaveBeenCalled();
      });
    });
  });
  describe('getGroupsTnc', () => {
    it('should call the get group tnc method', () => {
      mockLearnerService.get = jest.fn(() => of(obj.ServerResponse)) as any;
      tncService.getGroupsTnc().subscribe((data) => {
       expect(mockLearnerService.get).toHaveBeenCalled();
      });
    });
  });
  describe('getAdminTnc', () => {
    it('should call the get Admin tnc method', () => {
      mockLearnerService.get = jest.fn(() => of(obj.ServerResponse)) as any;
      tncService.getAdminTnc().subscribe((data) => {
       expect(mockLearnerService.get).toHaveBeenCalled();
      });
    });
  });
  describe('getReportViewerTnc', () => {
    it('should call the get report viewer tnc method', () => {
      mockLearnerService.get = jest.fn(() => of(obj.ServerResponse)) as any;
      tncService.getReportViewerTnc().subscribe((data) => {
       expect(mockLearnerService.get).toHaveBeenCalled();
      });
    });
  });
});