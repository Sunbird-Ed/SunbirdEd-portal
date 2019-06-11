import { TestBed } from '@angular/core/testing';

import { OfflineFileUploaderService } from './offline-file-uploader.service';
import { ToasterService, ResourceService } from '@sunbird/shared';

describe('OfflineFileUploaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ToasterService, ResourceService]
    });
  });

  it('should be created', () => {
    const service: OfflineFileUploaderService = TestBed.get(OfflineFileUploaderService);
    expect(service).toBeTruthy();
  });
});
