import { TestBed, inject } from '@angular/core/testing';
import { FileUploadService } from './file-upload.service';
import { ConfigService, ToasterService } from '@sunbird/shared';

describe('FileUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [FileUploadService, ConfigService, ToasterService]
    });
  });

  it('should be created', inject([FileUploadService], (service: FileUploadService) => {
    expect(service).toBeTruthy();
  }));
});
