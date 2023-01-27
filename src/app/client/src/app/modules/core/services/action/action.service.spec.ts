import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from '@angular/common/http';
import { ActionService } from './action.service';

describe('Test spec to create actionService', () => {
  let actionService: ActionService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        DEVICE_PREFIX: '/device/',
        DEVICE: {
          PROFILE: 'profile/'
        }
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };

  beforeAll(() => {
    actionService = new ActionService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of ActionService', () => {
    expect(actionService).toBeTruthy();
  });
});
