import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, CoreModule } from '@sunbird/core';
import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { UsageService } from '../usage/usage.service';
import { SharedModule } from '@sunbird/shared';

describe('ReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ReportService, UsageService, UserService],
    imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule]
  }));

  it('should be created', () => {
    const service: ReportService = TestBed.get(ReportService);
    expect(service).toBeTruthy();
  });
});
