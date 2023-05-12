import { LearnerService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { FaqService } from './faq.service';

describe('FaqService', () => {
  let faqService: FaqService;
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        SYSTEM_SETTING: {
          FAQ_URL: 'data/v1/system/settings/get/portalFaqURL'
        },
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
  const mockLearnerService: Partial<LearnerService> = {
    get: jest.fn()
  };
  beforeAll(() => {
    faqService = new FaqService(
      mockLearnerService as LearnerService,
      mockConfigService  as ConfigService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of faqService', () => {
    expect(faqService).toBeTruthy();
  });

  describe('getFaqJSON', () => {
    it('should call get faq json method ', () => {
      const req = {
        testObject: 'testing'
      };
      faqService.getFaqJSON();
      expect(faqService['learnerService'].get).toHaveBeenCalled();
    });
  });
});