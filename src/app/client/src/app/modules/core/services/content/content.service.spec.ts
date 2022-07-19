import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { ContentService } from "./content.service";


describe('ContentService', () => {
  let contentService: ContentService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        CONTENT_PREFIX: '/content/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    contentService = new ContentService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of ContentService', () => {
    expect(contentService).toBeTruthy();
    expect(contentService.baseUrl).toBe('/content/');
  });
});