import { HttpClient } from "@angular/common/http";
import { doesNotReject } from "assert";
import dayjs from "dayjs";
import { of, throwError } from "rxjs";
import { DataService } from "..";
import { ConfigService } from '../../../shared/services/config/config.service';
import { AppUpdateService } from "./app-update.service";

describe('AppUpdateService', () => {
    let appUpdateService: AppUpdateService;
    const mockConfigService: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                PUBLIC_PREFIX: {},
                OFFLINE: {
                    APP_UPDATE: true,
                    APP_INFO: true
                }
            }
        }
    };
    const mockHttpClient: Partial<HttpClient> = {
    };
    const mockDataService: Partial<DataService> = {};

    beforeAll(() => {
        appUpdateService = new AppUpdateService(
            mockConfigService as ConfigService,
            mockHttpClient as HttpClient,
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of appUpdateService', () => {
        expect(appUpdateService).toBeTruthy();
    });

    describe('checkForAppUpdate', () => {
        it('should return updated info for APP', (done) => {
            jest.spyOn(appUpdateService, 'get').mockReturnValue(of({
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
            appUpdateService.checkForAppUpdate().subscribe(() => {
                done();
            });
        });

        it('should not return updated info for APP', () => {
            // arrange
            jest.spyOn(appUpdateService, 'get').mockImplementation(() => {
                return throwError({error: {}});
            });
            // act
            appUpdateService.checkForAppUpdate().subscribe(() => {
            });
        });
    });
    describe('getAppInfo', () => {
      it('should return APP info ', (done) => {
          jest.spyOn(appUpdateService, 'get').mockReturnValue(of({
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
          appUpdateService.getAppInfo().subscribe(() => {
              done();
          });
      });

      it('should not return APP Info', () => {
          // arrange
          jest.spyOn(appUpdateService, 'get').mockImplementation(() => {
              return throwError({error: {}});
          });
          // act
          appUpdateService.getAppInfo().subscribe(() => {
          });
      });
  });
});