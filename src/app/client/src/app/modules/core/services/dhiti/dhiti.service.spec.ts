import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { DhitiService } from './dhiti.service';

describe('DhitiService', () => {
  let dhitiService: DhitiService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        DHITI_PREFIX: '/dhiti/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    dhitiService = new DhitiService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of DhitiService', () => {
    expect(dhitiService).toBeTruthy();
    expect(dhitiService.baseUrl).toBe('/dhiti/');
  });
});