import { TestBed } from '@angular/core/testing';

import { OfflineFileUploaderService } from './offline-file-uploader.service';
import { ToasterService } from '@sunbird/shared';

describe('OfflineFileUploaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ToasterService]
    });
  });

  it('should be created', () => {
    const service: OfflineFileUploaderService = TestBed.get(OfflineFileUploaderService);
    expect(service).toBeTruthy();
  });
});
