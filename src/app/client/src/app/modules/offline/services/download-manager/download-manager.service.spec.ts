import { CacheService } from 'ng2-cache-service';
import { response } from './download-manager.service.spec.data';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService, ToasterService, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { PublicDataService } from '@sunbird/core';
import { DownloadManagerService } from './download-manager.service';
import {  of as observableOf } from 'rxjs';


describe('DownloadManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService, ToasterService, ResourceService, DownloadManagerService,
        PublicDataService, CacheService, BrowserCacheTtlService]
  }));

  it('should make getalldownloads API call', () => {

    const service: DownloadManagerService = TestBed.get(DownloadManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    expect(service).toBeTruthy();
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(response.downloadListStatus));
    const apiRes = service.getDownloadList();
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('should make download API call', () => {

    const service: DownloadManagerService = TestBed.get(DownloadManagerService);
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

  it('should make export API call', () => {

    const service: DownloadManagerService = TestBed.get(DownloadManagerService);
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.callFake(() => observableOf(response.exportSuccess));
    const apiRes = service.exportContent('do_312522408518803456214665');
    expect(publicDataService.get).toHaveBeenCalled();
  });
});
