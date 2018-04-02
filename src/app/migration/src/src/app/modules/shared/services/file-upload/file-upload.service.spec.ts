import { TestBed, inject } from '@angular/core/testing';

import { FileUploadService } from './file-upload.service';
import { ConfigService } from './../config/config.service';
import { ToasterService } from './../toaster/toaster.service';
import { Ng2IziToastModule } from 'ng2-izitoast';

describe('FileUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Ng2IziToastModule],
      providers: [FileUploadService, ConfigService, ToasterService]
    });
  });

  it('should be created', inject([FileUploadService], (service: FileUploadService) => {
    expect(service).toBeTruthy();
  }));
});
