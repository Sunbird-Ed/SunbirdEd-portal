import { TestBed } from '@angular/core/testing';

import { OnDemandReportService } from './on-demand-report.service';

describe('OnDemandReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnDemandReportService = TestBed.get(OnDemandReportService);
    expect(service).toBeTruthy();
  });
});
