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
  
  it('should create a instance of channelService', () => {
    expect(channelService).toBeTruthy();
  });

  describe('should fetch framework details', () => {
    const hashTagId = 'NTP'
    it('should call the getFrameWork method with hashTagId', (done) => {
      jest.spyOn(channelService['publicDataService'],'get').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
      // act
      channelService.getFrameWork(hashTagId).subscribe(() => {
        done();
      });
      const obj = {
        url : `${mockConfigService.urlConFig.URLS.CHANNEL.READ}/${hashTagId}`
      }
      expect(channelService['publicDataService'].get).toHaveBeenCalledWith(obj);
    });
  });
});