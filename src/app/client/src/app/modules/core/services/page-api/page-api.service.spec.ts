
import { of as observableOf, Observable } from 'rxjs';
import { LearnerService, IPageSection, CoreModule, PublicDataService } from '@sunbird/core';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageApiService } from './page-api.service';
import { ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { testData } from './page-api.service.spec.data';
describe('PageApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule.forRoot()],
      providers: [PageApiService, ConfigService, LearnerService, CacheService, BrowserCacheTtlService, PublicDataService]
    });
  });
  xit('should be created', inject([PageApiService, LearnerService], (service: PageApiService,
    learnerService: LearnerService, publicDataService: PublicDataService) => {
    const param = { source: 'web', name: 'Resource', filters: {}, sort_by: { 'lastUpdatedOn': 'desc' } };
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(testData.successData));
    service.getPageData(param);
    service.getPageData(param).subscribe(apiResponse => {
      expect(apiResponse).toBeDefined();
      expect(service).toBeTruthy();
      expect(publicDataService.post).toHaveBeenCalled();
    });
  }));
  it('should be created when no sortby', inject([PageApiService, LearnerService],
    (service: PageApiService, learnerService: LearnerService) => {
      const param = { source: 'web', name: 'Resource', filters: {}, sort_by: {} };
      spyOn(learnerService, 'post').and.callFake(() => observableOf(testData.successData));
      service.getPageData(param);
      service.getPageData(param).subscribe(apiResponse => {
        expect(apiResponse).toBeDefined();
      });
      expect(service).toBeTruthy();
    }));
  it('should be created when cache is present', inject([PageApiService, LearnerService, CacheService],
    (service: PageApiService, learnerService: LearnerService, cacheService: CacheService) => {
      const param = { source: 'web', name: 'Resource', filters: {}, sort_by: {} };
      cacheService.set('AnnouncementInboxData', { sections: testData.successData.result.response.section }, { maxAge: 10 * 60 });
      service.getPageData(param).subscribe(apiResponse => {
        expect(apiResponse).toBeDefined();
      });
      expect(service).toBeTruthy();
    }));
});
