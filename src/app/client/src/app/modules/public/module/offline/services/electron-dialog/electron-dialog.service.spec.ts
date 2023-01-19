import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { DataService } from '@sunbird/core';
import { ElectronDialogService } from './electron-dialog.service';

describe('ElectronDialogService', () => {
  let electronDialogService: ElectronDialogService;
  const mockHttpClient: Partial<HttpClient> = {
    get: jest.fn()
};
const mockDataService: Partial<DataService> = {
  get: jest.fn()
};
  const mockConfigService: Partial<ConfigService> = {
      urlConFig: {
          URLS: {
            ELECTRON_DIALOG_PREFIX: '/dialog/',
            ELECTRON_DIALOG: {
              CONTENT_IMPORT: 'content/import',
              CONTENT_EXPORT: 'content/export',
              TELEMETRY_EXPORT: 'telemetry/export',
              TELEMETRY_IMPORT: 'telemetry/import'
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
    electronDialogService = new ElectronDialogService(
          mockHttpClient as HttpClient,
          mockConfigService as ConfigService
      );
  });

  beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
  });

  it('should create a instance of ElectronDialogService', () => {
      expect(electronDialogService).toBeTruthy();
      expect(electronDialogService['baseUrl']).toBe('/dialog/');
  });
  });

