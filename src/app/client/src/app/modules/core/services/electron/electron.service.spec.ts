import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { ElectronService } from './electron.service';

describe('ElectronService', () => {
  let electronService: ElectronService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        ELECTRON_DIALOG_PREFIX: '/dialog/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    electronService = new ElectronService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of ElectronService', () => {
    expect(electronService).toBeTruthy();
    expect(electronService.baseUrl).toBe('/dialog/');
  });
});