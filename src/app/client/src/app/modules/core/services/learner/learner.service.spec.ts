import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { LearnerService } from './learner.service';

describe('LearnerService', () => {
  let learnerService: LearnerService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        LEARNER_PREFIX: '/learner/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    learnerService = new LearnerService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of LearnerService', () => {
    expect(learnerService).toBeTruthy();
    expect(learnerService.baseUrl).toBe('/learner/');
  });
});