import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { PublicDataService } from './public-data.service';

describe('PublicDataService', () => {
  let publicDataService: PublicDataService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        PUBLIC_PREFIX: '/api/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    publicDataService = new PublicDataService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of PublicDataService', () => {
    expect(publicDataService).toBeTruthy();
    expect(publicDataService.baseUrl).toBe('/api/');
  });
});