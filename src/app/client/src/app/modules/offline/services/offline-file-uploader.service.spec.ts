import { TestBed } from '@angular/core/testing';

import { OfflineFileUploaderService } from './offline-file-uploader.service';

describe('OfflineFileUploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfflineFileUploaderService = TestBed.get(OfflineFileUploaderService);
    expect(service).toBeTruthy();
  });
});
