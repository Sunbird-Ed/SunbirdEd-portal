import { TestBed } from '@angular/core/testing';

import { OfflineFileUploaderService } from './offline-file-uploader.service';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('OfflineFileUploaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), HttpClientTestingModule],
      providers: []
    });
  });

  it('should be created', () => {
    const service: OfflineFileUploaderService = TestBed.get(OfflineFileUploaderService);
    expect(service).toBeTruthy();
  });
});
