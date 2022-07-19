import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { ObservationService } from './observation.service';

describe('ObservationService', () => {
  let observationService: ObservationService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        OBSERVATION_PREFIX: '/assessment/'
      }
    }
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    observationService = new ObservationService(
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of ObservationService', () => {
    expect(observationService).toBeTruthy();
    expect(observationService.baseUrl).toBe('/assessment/');
  });
});