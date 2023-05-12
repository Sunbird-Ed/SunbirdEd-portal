import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { BaseReportService } from '../report/report.service';

describe('BaseReportService', () => {
    let baseReportService: BaseReportService;
    const mockConfigService: Partial<ConfigService> = {
      urlConFig: {
        URLS: {
            REPORT_PREFIX: '/report'
        }
      }
    };
    const mockHttpClient: Partial<HttpClient> = {
    };
    beforeAll(() => {
        baseReportService = new BaseReportService(
        mockConfigService as ConfigService,
        mockHttpClient as HttpClient
      );
    });

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should create a instance of BaseReportService', () => {
      expect(baseReportService).toBeTruthy();
      expect(baseReportService.baseUrl).toBe('/report');
    });
  });