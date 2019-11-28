import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { CbseProgramService } from './cbse-program.service';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';

describe('CbseProgramService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule]
  }));

  xit('should be created', () => {
    const service: CbseProgramService = TestBed.get(CbseProgramService);
    expect(service).toBeTruthy();
  });
});
