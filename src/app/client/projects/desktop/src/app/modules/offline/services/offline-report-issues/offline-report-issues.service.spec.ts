import { TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OfflineReportIssuesService } from './offline-report-issues.service';
import { PublicDataService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { of as observableOf } from 'rxjs';
import { response } from '../offline-report-issues/offline-report-issues.service.spec.data'
describe('OfflineReportIssuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, SharedModule.forRoot()],
    providers: [ConfigService, ToasterService, ResourceService, OfflineReportIssuesService,
      PublicDataService, CacheService, BrowserCacheTtlService]
  }));
  it('should be created', () => {
    const service: OfflineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    expect(service).toBeTruthy();
  });

  fit('should be call report other issue method', () => {
    const service: OfflineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    const publicDataService = TestBed.get(PublicDataService);
    const params = {
      email: 'sample@emal.com',
      description: 'sample description'
    };
    spyOn(publicDataService, 'post').and.callFake(() => observableOf(response.reportOtherIssueStatus));
    const apiRes = service.reportOtherIssue(params);
    publicDataService.post(params).subscribe(responseData => {
      expect(responseData).toBe(response.reportOtherIssueStatus);
    });
  });
});
