import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { KendraService } from './kendra.service';

describe('KendraService', () => {
  let kendraService: KendraService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        KENDRA_PREFIX: '/kendra/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    kendraService = new KendraService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of KendraService', () => {
    expect(kendraService).toBeTruthy();
    expect(kendraService.baseUrl).toBe('/kendra/');
  });
});