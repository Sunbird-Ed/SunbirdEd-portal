import { LearnerService, CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UploadCertificateService } from './upload-certificate.service';
import { ConfigService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { ContentService } from './../../../../modules/core/services/content/content.service';
import { of } from 'rxjs';
import { configureTestSuite } from '@sunbird/test-util';
import { PublicDataService, UserService } from '@sunbird/core';


describe('UploadCertificateService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [CoreModule, HttpClientTestingModule],
    providers: [
      ConfigService,
      LearnerService,
      CacheService,
      ContentService,
      PublicDataService,
      UserService
    ]
  }));

  it('should be created', () => {
    const service: UploadCertificateService = TestBed.get(UploadCertificateService);
    expect(service).toBeTruthy();
  });

  it('should upload the certificate template', () => {
    const formData = new FormData();
    formData.append('file', 'SVG_BYTE_ARRAY');
    const service = TestBed.get(UploadCertificateService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(of({}));
    service.uploadTemplate('SVG_BYTE_ARRAY', 'SOME_IDENTIFIER');
    const data = {
      url: 'asset/v1/upload/SOME_IDENTIFIER',
      data: formData
    };
    expect(contentService.post).toHaveBeenCalledWith(data);
  });

  it('should create the certificate template', () => {
    const data = { };
    const service = TestBed.get(UploadCertificateService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.returnValue(of({}));
    service.createCertTemplate(data);
    const request = {
      url: 'asset/v1/create',
      data: data
    };
    expect(contentService.post).toHaveBeenCalledWith(request);
  });

  // it('should store the asset', () => {
  //   const formData = new FormData();
  //   formData.append('file', 'SVG_BYTE_ARRAY');
  //   const service = TestBed.get(UploadCertificateService);
  //   const publicDataService = TestBed.get(PublicDataService);
  //   spyOn(publicDataService, 'post').and.returnValue(of({}));
  //   service.storeAsset('SVG_BYTE_ARRAY', 'SOME_IDENTIFIER');
  //   const data = {
  //     url: 'content/v1/upload/SOME_IDENTIFIER',
  //     data: formData
  //   };
  //   expect(publicDataService.post).toHaveBeenCalledWith(data);
  // });

  it('should get the asset data', () => {
    const body = {
      'request': {
        'filters': {
          'mediaType': ['image'],
          'contentType': ['Asset'],
          'compatibilityLevel': { 'min': 1, 'max': 2 },
          'status': ['Live'],
          'channel': '12345'
        },
        'limit': 50,
        'offset': 0
      }
    };
    const service = TestBed.get(UploadCertificateService);
    const userService = TestBed.get(UserService);
    spyOnProperty(userService, 'channel').and.returnValue('12345');
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    service.getAssetData();
    const data = {
      url: 'content/v1/search',
      data: body
    };
    expect(publicDataService.post).toHaveBeenCalledWith(data);
  });

  // it('should create asset', () => {

  //   const body = {
  //     'request':
  //     {
  //       'content': {
  //         'name': 'picture1',
  //         'creator': 'ekstep',
  //         'createdBy': '123456',
  //         'code': 'org.ekstep0.9002440445885993',
  //         'mimeType': 'image/png',
  //         'mediaType': 'image',
  //         'contentType': 'Asset',
  //         'osId': 'org.ekstep.quiz.app',
  //         'language': ['English']
  //       }
  //     }
  //   };
  //   const service = TestBed.get(UploadCertificateService);
  //   const publicDataService = TestBed.get(PublicDataService);
  //   spyOn(publicDataService, 'post').and.returnValue(of({}));
  //   service.createAsset( {
  //     assetCaption: 'picture1',
  //     creator: 'ekstep',
  //     creatorId: '123456'
  //   });
  //   const data = {
  //     url: 'content/v1/create',
  //     data: body
  //   };
  //   expect(publicDataService.post).toHaveBeenCalledWith(data);

  // });
});
