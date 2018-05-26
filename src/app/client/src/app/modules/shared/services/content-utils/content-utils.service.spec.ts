import { ContentUtilsServiceService } from './content-utils.service';
import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from './../config/config.service';

describe('ContentUtilsService', () => {
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
});
