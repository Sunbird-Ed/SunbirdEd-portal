import { CacheService } from 'ng2-cache-service';
import { response } from './content-manager.service.spec.data';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService, ToasterService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { ContentManagerService } from './content-manager.service';
import {  of as observableOf } from 'rxjs';


describe('ContentManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService, ToasterService, ResourceService, ContentManagerService,
        PublicDataService, CacheService, BrowserCacheTtlService]
  }));

  it('should make getalldownloads API call', () => {

    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    expect(service).toBeTruthy();
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(response.downloadListStatus));
    const apiRes = service.getContentList();
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should make download API call', () => {

    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    expect(service).toBeTruthy();
    const params = {
      downloadContentId: '/do_312522408518803456214665',
      request : {}
    };
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(response.downloadSuccess));
    const apiRes = service.startDownload(params);
    expect(publicDataService.post).toHaveBeenCalled();
  });

  xit('should make export API call', () => {

    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.callFake(() => observableOf(response.exportSuccess));
    const apiRes = service.exportContent('do_312522408518803456214665');
    expect(publicDataService.get).toHaveBeenCalled();
  });

  it('should get same data ', () => {
    const service: ContentManagerService = TestBed.get(ContentManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    const params = {
      downloadContentId: '/do_312522408518803456214665',
      request : {}
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
      request : {}
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
});
