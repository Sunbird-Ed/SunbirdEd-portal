import { TestBed } from '@angular/core/testing';

import { OfflineReportIssuesService } from './offline-report-issues.service';

xdescribe('OfflineReportIssuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfflineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    expect(service).toBeTruthy();
  });
});
