import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { CloudService } from "./cloud.service";


describe('CloudService', () => {
  let cloudService: CloudService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        CLOUD_PREFIX: '/cloudUpload/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    cloudService = new CloudService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of CloudService', () => {
    expect(cloudService).toBeTruthy();
    expect(cloudService.baseUrl).toBe('/cloudUpload/');
  });
});