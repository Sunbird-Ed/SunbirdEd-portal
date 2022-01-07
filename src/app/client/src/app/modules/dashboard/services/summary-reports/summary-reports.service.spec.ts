import { TestBed } from '@angular/core/testing';

import { SummaryReportsService } from './course-summary-courses.service';

describe('SummaryReportsService', () => {
  let service: SummaryReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
