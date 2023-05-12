import { ConfigService } from '@sunbird/shared';
import { LearnerService } from '@sunbird/core';
import { ContentBadgeService } from './content-badge.service';

describe('ContentBadgeService', () => {
  let contentBadgeService: ContentBadgeService;
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        BADGE: {
          CREATE: 'badging/v1/issuer/badge/assertion/create'
        },
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
  const mockLearnerService: Partial<LearnerService> = {
    post: jest.fn()
  };
  beforeAll(() => {
    contentBadgeService = new ContentBadgeService(
      mockConfigService  as ConfigService,
      mockLearnerService as LearnerService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of contentBadgeService', () => {
    expect(contentBadgeService).toBeTruthy();
  });

  describe('addBadge', () => {
    it('should call add badge method with the badge create ', () => {
      const req = {
        testObject: 'testing'
      };
      contentBadgeService.addBadge(req);
      expect(contentBadgeService.learner.post).toHaveBeenCalled();
    });
  });

  describe('setAssignBadge', () => {
    it('should call set assign badge method ', () => {
      const badges = {
        obj: 'testing'
      };
      jest.spyOn(contentBadgeService, 'setAssignBadge');
      contentBadgeService.setAssignBadge(badges);
      expect(contentBadgeService.setAssignBadge).toHaveBeenCalled();
    });
  });
});