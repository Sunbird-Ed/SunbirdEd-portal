import { ElectronDialogService } from '../electron-dialog/electron-dialog.service';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { of } from 'rxjs';
import { SystemInfoService } from '../system-info/system-info.service';
import { ActivatedRoute } from '@angular/router';
import { TelemetryService } from '@sunbird/telemetry';
import { ContentManagerService } from './content-manager.service';
import { response } from './content-manager.service.spec.data';
describe('ContentManagerService', () => {
  let contentManagerService: ContentManagerService;
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        OFFLINE: {
        DOWNLOAD_LIST: 'content/v1/download/list',
        RESUME_IMPORT: 'content/v1/import/resume',
        CANCEL_IMPORT: 'content/v1/import/cancel',
        PAUSE_IMPORT: 'content/v1/import/pause',
        RETRY_IMPORT: 'content/v1/import/retry',
        RESUME_DOWNLOAD: 'content/v1/download/resume',
        CANCEL_DOWNLOAD: 'content/v1/download/cancel',
        PAUSE_DOWNLOAD: 'content/v1/download/pause',
        RETRY_DOWNLOAD: 'content/v1/download/retry',
        DELETE_CONTENT: 'content/v1/delete',
        CHANGE_CONTENT_LOCATION: 'content/v1/contentLocation',
        UPDATE: 'content/v1/update',
        EXPORT: 'content/v1/export',
        DOWNLOAD: 'content/v1/download'
        }
      }
    }
  };
  const mockPublicDataService: Partial<PublicDataService> = {};
  const mockToasterService: Partial<ToasterService> = {
    info: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockElectronDialogService: Partial<ElectronDialogService> = {};
  const mockSystemInfoService: Partial<SystemInfoService> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      firstChild: 'test' as any
    } as any
  };
  const mockTelemetryService: Partial<TelemetryService> = {
    error: jest.fn()
  };
  beforeAll(() => {
    contentManagerService = new ContentManagerService(
      mockConfigService  as ConfigService,
      mockPublicDataService as PublicDataService,
      mockToasterService as ToasterService,
      mockResourceService as ResourceService,
      mockElectronDialogService as ElectronDialogService,
      mockSystemInfoService as SystemInfoService,
      mockActivatedRoute as ActivatedRoute,
      mockTelemetryService as TelemetryService
    );
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of contentManagerService', () => {
    expect(contentManagerService).toBeTruthy();
  });

  describe('updateContentDownloadStatus', () => {
    it('should call update content download status method with some data ', () => {
      jest.spyOn(contentManagerService, 'updateContentDownloadStatus');
      contentManagerService.updateContentDownloadStatus(response?.contentDownloadLists);
      expect(contentManagerService.updateContentDownloadStatus).toHaveBeenCalled();
      const obj = {
        do_3129981407884492801158: 'DOWNLOADED',
        do_3129981407884492801159: 'INPROCESS',
        do_3129981407884492801160: 'INPROCESS'
      };
      expect(JSON.stringify(contentManagerService.contentDownloadStatus)).toBe(JSON.stringify(obj));
    });
  });
  describe('emitAfterDeleteContent', () => {
    it('should call emit after delete content method ', () => {
      jest.spyOn(contentManagerService, 'emitAfterDeleteContent');
      contentManagerService.emitAfterDeleteContent({});
      expect(contentManagerService.emitAfterDeleteContent).toHaveBeenCalled();
    });
  });
  describe('emitDownloadListEvent', () => {
    it('should call emit after download content from a list method ', () => {
      jest.spyOn(contentManagerService, 'emitDownloadListEvent');
      contentManagerService.emitDownloadListEvent({});
      expect(contentManagerService.emitDownloadListEvent).toHaveBeenCalled();
    });
  });
  describe('getContentList', () => {
    it('should call get content list method ', () => {
      mockPublicDataService.post = jest.fn(() => of(response?.data)) as any;
      contentManagerService.deleteContentTimeStamps = {
        'do_3129981407884492801159': '12345',
        'do_3129981407884492801151': '12345',
        'do_3129981407884492801153': '12345'
     } as any;
     contentManagerService.deletedContentIds = [
        'do_3129981407884492801159',
        'do_3129981407884492801151',
        'do_3129981407884492801153'
      ] as any;
      contentManagerService.getContentList();
      jest.spyOn(contentManagerService, 'updateContentDownloadStatus');
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      contentManagerService.getContentList().subscribe((obj) => {
        expect(contentManagerService.updateContentDownloadStatus).toHaveBeenCalled();
      });
    });
    it('should call get content list method with error', () => {
      mockPublicDataService.post = jest.fn(() => of(response?.error)) as any;
      contentManagerService.getContentList().subscribe((obj) => {
        expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      });
    });
  });
  describe('resumeImportContent', () => {
    it('should call resume Import Content method with the do id ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.resumeImportContent('do_3129981407884492801153');
      const options = {
        url: 'content/v1/import/resume/do_3129981407884492801153',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('cancelImportContent', () => {
    it('should call cancel Import Content method with the do id ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.cancelImportContent('do_3129981407884492801153');
      const options = {
        url: 'content/v1/import/cancel/do_3129981407884492801153',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('pauseImportContent', () => {
    it('should call pause Import Content method with the do id ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.pauseImportContent('do_3129981407884492801153');
      const options = {
        url: 'content/v1/import/pause/do_3129981407884492801153',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('retryImportContent', () => {
    it('should call retry Import Content method with the do id ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.retryImportContent('do_3129981407884492801153');
      const options = {
        url: 'content/v1/import/retry/do_3129981407884492801153',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('resumeDownloadContent', () => {
    it('should call resume download Content method with the do id ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.resumeDownloadContent('do_3129981407884492801153');
      const options = {
        url: 'content/v1/download/resume/do_3129981407884492801153',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('cancelDownloadContent', () => {
    it('should call cancel download Content method with the do id ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.cancelDownloadContent('do_3129981407884492801153');
      const options = {
        url: 'content/v1/download/cancel/do_3129981407884492801153',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('pauseDownloadContent', () => {
    it('should call pause Download Content method with the do id ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.pauseDownloadContent('do_3129981407884492801153');
      const options = {
        url: 'content/v1/download/pause/do_3129981407884492801153',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('retryDownloadContent', () => {
    it('should call retry Download Content method with the do id ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.retryDownloadContent('do_3129981407884492801153');
      const options = {
        url: 'content/v1/download/retry/do_3129981407884492801153',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('telemetry error log event', () => {
    it('should call the log telemetry event ', () => {
      jest.spyOn(contentManagerService['telemetryService'], 'error');
      contentManagerService.logErrorTelemetry({error: 'error occured'});
      expect(contentManagerService['telemetryService'].error).toHaveBeenCalled();
    });
  });
  describe('changeContentLocation', () => {
    it('should call change the content location method called ', () => {
      jest.spyOn(contentManagerService['publicDataService'], 'post');
      contentManagerService.changeContentLocation({});
      const options = {
        url: 'content/v1/contentLocation',
        data: {}
      };
      expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
      expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
    });
  });
  describe('deleteContent', () => {
    it('should call delete content Method with delete content time stamp as null ', () => {
      mockPublicDataService.post = jest.fn(() => of(response?.data)) as any;
      const options = {
        url: 'content/v1/delete',
        data: {}
      };
      contentManagerService.deleteContentTimeStamps = null as any;
      contentManagerService.deleteContent({}).subscribe((obj) => {
        expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
        expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
      });
    });
    it('should call delete content Method with the delete content set to some object ', () => {
      mockPublicDataService.post = jest.fn(() => of(response?.data)) as any;
      const options = {
        url: 'content/v1/delete',
        data: {}
      };
      contentManagerService.deleteContentTimeStamps =   {
        'do_3129981407884492801159': '12345',
        'do_3129981407884492801151': '12345',
        'do_3129981407884492801153': '12345'
     } as any;
      contentManagerService.deleteContent({}).subscribe((obj) => {
        expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
        expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
      });
    });
  });
  describe('update Content', () => {
    it('should call update Content method is called ', () => {
      mockPublicDataService.post = jest.fn(() => of(response?.data)) as any;
      jest.spyOn(contentManagerService['toasterService'], 'info');
      const data = {
        contentId: 'do_3129981407884492801159',
        parentId: 'do_3129981407884492801151'
      };
      const options = {
        url: 'content/v1/update/do_3129981407884492801159',
        data: {
          request: {
            parentId: data.parentId
          }
        }
      };
      contentManagerService.updateContent(data).subscribe((obj) => {
        expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
        expect(contentManagerService['publicDataService'].post).toBeCalledWith(options);
        expect(contentManagerService['toasterService'].info).toBeCalledWith('Updating...');
      });
    });
  });
  describe('exportContent', () => {
    it('should call export content method is called ', () => {
      mockPublicDataService.get = jest.fn(() => of(response?.data)) as any;
      mockElectronDialogService.showContentExportDialog = jest.fn(() => of(response?.response)) as any;
      const options = {
        url: 'content/v1/export/do_3129981407884492801159',
        destFolder: '/file_to_save/'
      };
      contentManagerService.exportContent('do_3129981407884492801159').subscribe((obj) => {
        expect(contentManagerService['publicDataService'].get).toHaveBeenCalled();
        expect(contentManagerService['publicDataService'].get).toBeCalledWith(options);
      });
    });
  });
  describe('startDownload', () => {
    it('should call start Download method is called ', () => {
      mockPublicDataService.post = jest.fn(() => of(response?.data)) as any;
      contentManagerService.downloadContentId = 'do_3129981407884492801159';
      const data = {
        contentId: 'do_3129981407884492801159',
        parentId: 'do_3129981407884492801151'
      };
      const options = {
        url: 'content/v1/download/do_3129981407884492801159',
        data: data
      };
      contentManagerService.startDownload(data).subscribe((obj) => {
        expect(contentManagerService['publicDataService'].post).toHaveBeenCalled();
        expect(contentManagerService['publicDataService'].get).toBeCalledWith(options);
      });
    });
  });
});
