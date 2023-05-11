import { PublicDataService } from '@sunbird/core';
import { of } from 'rxjs';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { OfflineReportIssuesService } from './offline-report-issues.service';


xdescribe('OfflineReportIssuesService', () => {
  let offlineReportIssuesService: OfflineReportIssuesService;
  const mockPublicDataService: Partial<PublicDataService> = {};
  const mockConfigService: Partial<ConfigService> = {
      urlConFig: {
          URLS: {
            OFFLINE: {
              REPORT_OTHER_ISSUE: 'help/v1/report/issue'
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
  const error =  {
    'id': 'api.user.read',
    'ver': 'v1',
    'ts': '2018-02-28 12:07:33:518+0000',
    'params': {
        'resmsgid': null,
        'msgid': 'bdf695fd-3916-adb0-2072-1d53deb14aea',
        'err': null,
        'status': 'error',
        'errmsg': null
    },
    'responseCode': 'CLINTERROR',
    'result': {}
};
  beforeAll(() => {
    offlineReportIssuesService = new OfflineReportIssuesService(
          mockPublicDataService as PublicDataService,
          mockConfigService as ConfigService
      );
  });

  beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
  });

    it('should create a instance of ElectronDialogService', () => {
        expect(offlineReportIssuesService).toBeTruthy();
    });
    xdescribe('reportOtherIssue', () => {
      it('should call report other issue method called ', () => {
        const apiBody = {};
        const requestParams = {
          url: 'help/v1/report/issue',
          data: apiBody
        };
        mockPublicDataService.post = jest.fn(() => of(data)) as any;
        offlineReportIssuesService.reportOtherIssue(apiBody).subscribe((obj) => {
          expect(offlineReportIssuesService['publicDataService'].post).toHaveBeenCalled();
        });
      });
    });
});
