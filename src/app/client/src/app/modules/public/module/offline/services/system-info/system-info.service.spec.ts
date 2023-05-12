import { PublicDataService } from '../../../../../core/services/public-data/public-data.service';
import { ConfigService } from '../../../../../shared/services/config/config.service';
import { SystemInfoService } from './system-info.service';
import { of } from 'rxjs';

describe('SystemInfoService', () => {
  let systemInfoService: SystemInfoService;
  const mockPublicDataService: Partial<PublicDataService> = {};
  const mockConfigService: Partial<ConfigService> = {
      urlConFig: {
          URLS: {
            OFFLINE: {
              SYSTEM_INFO: 'desktop/v1/system-info'
            }
          }
      }
  };
  const data = {
    id: 'api.content.read',
    ver: '1.0',
    ts: '2018-05-03T10:51:12.648Z',
    params: 'params',
    responseCode: 'OK',
    result: {
      response: {
        contents: [
          {
            createdOn: '12345',
            identifier: 'do_3129981407884492801158'
          },
          {
            createdOn: '12345678',
            identifier: 'do_3129981407884492801159'
          },
          {
            createdOn: '1234567890',
            identifier: 'do_3129981407884492801160'
          }
        ]
      }
    }
  };
  beforeAll(() => {
    systemInfoService = new SystemInfoService(
          mockPublicDataService as PublicDataService,
          mockConfigService as ConfigService
      );
  });

  beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
  });

    it('should create a instance of ElectronDialogService', () => {
        expect(systemInfoService).toBeTruthy();
    });
    describe('getSystemInfo', () => {
      it('should call get system info method called ', () => {
        const requestParams = {
          url: 'desktop/v1/system-info'
        };
        mockPublicDataService.get = jest.fn(() => of(data)) as any;
        systemInfoService.getSystemInfo().subscribe((obj) => {
          expect(systemInfoService['publicDataService'].get).toHaveBeenCalled();
          expect(systemInfoService['publicDataService'].get).toBeCalledWith(requestParams);
        });
      });
    });
});
