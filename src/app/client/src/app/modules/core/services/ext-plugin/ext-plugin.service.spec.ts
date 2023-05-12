import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { ExtPluginService } from './ext-plugin.service';

describe('ExtPluginService', () => {
  let extPluginService: ExtPluginService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        EXT_PLUGIN_PREFIX: '/plugin/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    extPluginService = new ExtPluginService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of ExtPluginService', () => {
    expect(extPluginService).toBeTruthy();
    expect(extPluginService.baseUrl).toBe('/plugin/');
  });
});