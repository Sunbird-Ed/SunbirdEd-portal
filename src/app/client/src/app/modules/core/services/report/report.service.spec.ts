import { TestBed } from '@angular/core/testing';

import { BaseReportService } from './report.service';

describe('ReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseReportService = TestBed.get(BaseReportService);
    expect(service).toBeTruthy();
  });
});
