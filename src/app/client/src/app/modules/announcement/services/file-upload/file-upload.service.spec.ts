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

  it('should return window object from getWindowObject method ', inject([FileUploadService], (service: FileUploadService) => {
    spyOn(service, 'getWindowObject').and.callThrough();
    expect(service).toBeTruthy();
  }));

  it('should call getDefaultOption method ', inject([FileUploadService], (service: FileUploadService) => {
    spyOn(service, 'getDefaultOption').and.callThrough();
    const result = service.getDefaultOption();
    expect(result.request).toBeTruthy();
    expect(result.failedUploadTextDisplay).toBeTruthy();
    expect(result.fileValidation).toBeTruthy();
    expect(result.containerName).toBeTruthy();
  }));

  it('should call initilizeFileUploader method ', inject([FileUploadService], (service: FileUploadService) => {
    spyOn(service, 'initilizeFileUploader').and.callThrough();
    expect(service.attachedFiles).toEqual([]);
    expect(service.uiOptions).toBeUndefined();
    expect(service.getWindowObject.cancelUploadFile).toBeUndefined();
    expect(service.uploader).toBeUndefined();
  }));

  it('should call formatFileSize method ', inject([FileUploadService], (service: FileUploadService) => {
    spyOn(service, 'formatFileSize').and.callThrough();
    expect(service).toBeTruthy();
  }));

  it('should call showErrorMessage method ', inject([FileUploadService], (service: FileUploadService, toaster: ToasterService) => {
    spyOn(service, 'showErrorMessage').and.callThrough();
    expect(service).toBeTruthy();
  }));

});
