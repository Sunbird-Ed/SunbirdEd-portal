import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { ChannelService } from "./channel.service";
import { PublicDataService } from './../public-data/public-data.service';

describe('ChannelService', () => {
  let channelService: ChannelService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        CHANNEL: {
          READ: 'channel/v1/read'
        }
      }
    }
  };
  const mockPublicDataService: Partial<PublicDataService> = {
    get: jest.fn().mockImplementation(() => { })
  };
  beforeAll(() => {
    channelService = new ChannelService(
      mockConfigService as ConfigService,
      mockPublicDataService as PublicDataService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of appUpdateService', () => {
    expect(channelService).toBeTruthy();
  });

});