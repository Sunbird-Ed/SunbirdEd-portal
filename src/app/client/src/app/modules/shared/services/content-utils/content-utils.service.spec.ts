import { ContentUtilsServiceService } from './content-utils.service';
import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from './../config/config.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('ContentUtilsService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentUtilsServiceService, ConfigService]
    });
  });

  it('should be created', inject([ContentUtilsServiceService], (service: ContentUtilsServiceService) => {
    expect(service).toBeDefined();
  }));
  it('should take content share INPUT and return the base64 link ',
  inject([ContentUtilsServiceService], (service: ContentUtilsServiceService) => {
    const contentShare =  {
        'type': '',
        'icon': 'linkify',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'identifier': 'do_1124786006384066561162',
    };
    service.getUnlistedShareUrl(contentShare);
    expect(service).toBeDefined();
    expect(service.getBase64Url).toBeDefined();
  }));
  it('should return with collection id in url if parent id is passed',
  inject([ContentUtilsServiceService], (service: ContentUtilsServiceService) => {
    const url = service.getPublicShareUrl('123', 'application/pdf', '456');
    expect(url).toBeDefined();
    expect(url).toBe(`${service.baseUrl}play/collection/456?contentId=123`);
  }));
});
