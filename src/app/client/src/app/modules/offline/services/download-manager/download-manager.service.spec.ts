import { TestBed } from '@angular/core/testing';

import { DownloadManagerService } from './download-manager.service';

describe('DownloadManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadManagerService = TestBed.get(DownloadManagerService);
    expect(service).toBeTruthy();
  });
});
