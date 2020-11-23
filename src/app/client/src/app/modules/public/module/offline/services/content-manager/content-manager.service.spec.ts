import { CacheService } from 'ng2-cache-service';
import { response } from './content-manager.service.spec.data';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService, ToasterService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { ContentManagerService } from './content-manager.service';
import { of as observableOf, throwError } from 'rxjs';
import { SystemInfoService } from '../system-info/system-info.service';
import { ElectronDialogService } from '../electron-dialog/electron-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';

describe('ContentManagerService', () => {

  const resourceMockData = {
    frmelmnts: {
      lbl: {
        currentLocation: 'Current location',
        recommended: 'Recommended'
      }
    },
    messages: {
      fmsg: { m0097: 'Something went wrong' },
      stmsg: { contentLocationChanged: 'Content location changed successfully, try to download content now.' }
    }
  };
  class FakeActivatedRoute {
    snapshot = {
      data: {
        telemetry: { env: 'browse', pageid: 'browse' }
      }
    };
  }
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ConfigService, ToasterService, ContentManagerService, ElectronDialogService,
      PublicDataService, CacheService, BrowserCacheTtlService,
      { provide: ResourceService, useValue: resourceMockData },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute },
      TelemetryService
    ]
  }));

  it('should make getalldownloads API call', () => {

    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    expect(service).toBeTruthy();
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(response.downloadListStatus));
    const apiRes = service.getContentList();
    expect(publicDataService.post).toHaveBeenCalled();
    expect(service.downloadFailEvent).toBeDefined();
  });

  it('should make download API call', () => {

    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    expect(service).toBeTruthy();
    const params = {
      downloadContentId: '/do_312522408518803456214665',
      request: {}
    };
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(response.downloadSuccess));
    const apiRes = service.startDownload(params);
    expect(publicDataService.post).toHaveBeenCalled();
  });

  xit('should make export API call', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.callFake(() => observableOf(response.exportSuccess));
    expect(publicDataService.get).toHaveBeenCalled();
  });

  it('should get same data ', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    const params = {
      downloadContentId: '/do_312522408518803456214665',
      request: {}
    };
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(response.downloadSuccess));
    const apiRes = service.startDownload(params);
    publicDataService.post(params).subscribe(responseData => {
      expect(responseData).toBe(response.downloadSuccess);
    });
  });

  it('Updating data should be successful', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    const params = {
      updateContentId: '/domain_66675',
      request: {}
    };
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(response.content_update_success));
    const apiRes = service.updateContent(params);
    publicDataService.post(params).subscribe(responseData => {
      expect(responseData).toBe(response.content_update_success);
    });
  });

  it('should call resumeImportContent', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf({}));
    const apiRes = service.resumeImportContent('do_312522408518803456214665');
    expect(publicDataService.post).toHaveBeenCalled();
    publicDataService.post({}).subscribe(responseData => {
      expect(responseData).toBeTruthy();
    });
  });

  it('should call cancelImportContent', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf({}));
    const apiRes = service.cancelImportContent('do_312522408518803456214665');
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should call pauseImportContent', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf({}));
    const apiRes = service.pauseImportContent('do_312522408518803456214665');
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should call retryImportContent', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf({}));
    const apiRes = service.retryImportContent('do_312522408518803456214665');
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should call resumeDownloadContent', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf({}));
    const apiRes = service.resumeDownloadContent('do_312522408518803456214665');
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should call cancelDownloadContent', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf({}));
    const apiRes = service.cancelDownloadContent('do_312522408518803456214665');
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should call pauseDownloadContent', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf({}));
    const apiRes = service.pauseDownloadContent('do_312522408518803456214665');
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should call retryDownloadContent', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.callFake(() => observableOf({}));
    const apiRes = service.retryDownloadContent('do_312522408518803456214665');
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should show popup message on failure of download', async () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    service.failedContentName = 'testContent';

    const error = {
      contentSize: 100,
      currentDrive: 'C',
      suggestedDrive: 'D',
      isWindows: true,
    };
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(throwError(error)));
    spyOn(service, 'getSuggestedDrive').and.returnValue({});
    spyOn(service, 'downloadFailEvent');
    service.startDownload({}).subscribe(res => { }, (err: any) => {
      const popInfo = {
        failedContentName: 'testContent',
        isWindows: true,
        suggestedDrive: 'D'
      };
      expect(err.params.err).toEqual('LOW_DISK_SPACE');
      expect(service.downloadFailEvent.emit).toHaveBeenCalledWith(popInfo);
      expect(service.getSuggestedDrive).toHaveBeenCalled();
      expect(service.downloadFailEvent).toHaveBeenCalled();
    });
  });

  it('should call getSuggestedDrive', async () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const popupInfo = {
      failedContentName: 'Test1'
    };
    const systemInfoService = TestBed.get(SystemInfoService);
    const systemInfoResponse = {
      result: {
        drives: [
          { fs: 'C:', size: 1212121212121, used: 1212121212120 },
          { fs: 'D:', size: 1212121212121, used: 1212121212120 },
          { fs: 'E:', size: 4592323023202, used: 1212121212120 }],
        contentBasePath: 'C:\\test\test1',
        platform: 'win32'
      }

    };
    spyOn(systemInfoService, 'getSystemInfo').and.returnValue(observableOf(systemInfoResponse));
    const resp = await service.getSuggestedDrive(popupInfo);
    expect(systemInfoService.getSystemInfo).toHaveBeenCalled();
    expect(resp).toEqual(response.popupInfo);
  });

  it('should call getSuggestedDrive and handle error', async () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const systemInfoService = TestBed.get(SystemInfoService);
    spyOn(systemInfoService, 'getSystemInfo').and.returnValue(throwError({}));
    const resp = await service.getSuggestedDrive({});
    expect(resp).toBeTruthy();
  });

  it('should call changeContentLocation', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const configService = TestBed.get(ConfigService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post');
    service.changeContentLocation({});
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should call logErrorTelemetry', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const telemetryService: TelemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'error');
    service.logErrorTelemetry(response.errorTelemetryData);
    expect(telemetryService.error).toHaveBeenCalled();
  });
});
