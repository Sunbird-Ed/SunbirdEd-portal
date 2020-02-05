import { TestBed } from '@angular/core/testing';

import { SystemInfoService } from './system-info.service';

describe('SystemInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemInfoService = TestBed.get(SystemInfoService);
    expect(service).toBeTruthy();
  });
});
