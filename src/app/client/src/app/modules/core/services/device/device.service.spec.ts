import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { DeviceService } from './device.service';

describe('DeviceService', () => {
  let deviceService: DeviceService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        DEVICE_PREFIX: '/device/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    deviceService = new DeviceService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of DeviceService', () => {
    expect(deviceService).toBeTruthy();
    expect(deviceService.baseUrl).toBe('/device/');
  });
});