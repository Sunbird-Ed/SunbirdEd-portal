import { TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OfflineReportIssuesService } from './offline-report-issues.service';

describe('OfflineReportIssuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule,  SharedModule.forRoot()]
}));
  it('should be created', () => {
    const service: OfflineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    expect(service).toBeTruthy();
  });
});
