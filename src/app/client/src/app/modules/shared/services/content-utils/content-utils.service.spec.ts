
import { ContentUtilsServiceService } from './content-utils.service';
import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from './../config/config.service';
import { ResourceService } from './../resource/resource.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ToasterService } from './../toaster/toaster.service';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockResponse } from './content-utils.service.mock.data';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('ContentUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule],
      providers: [ContentUtilsServiceService, ConfigService, ResourceService, ToasterService,
        { provide: Router, useClass: RouterStub }]
    });
  });

  it('should be created', inject([ContentUtilsServiceService], (service: ContentUtilsServiceService) => {
    expect(service).toBeDefined();
  }));
  it('should take content share INPUT and return the base64 link ',
    inject([ContentUtilsServiceService], (service: ContentUtilsServiceService) => {
      const contentShare = {
        'type': '',
        'icon': 'linkify',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'identifier': 'do_1124786006384066561162',
      };
      service.getUnlistedShareUrl(contentShare);
      expect(service).toBeDefined();
      expect(service.getBase64Url).toBeDefined();
    }));

  it('should open preview link in newtab for mimeType x-url',
    inject([Router, ToasterService, ResourceService, ContentUtilsServiceService], (router, toasterService, resourceService, service) => {
      resourceService.messages = MockResponse.resourceBundle.messages;
      spyOn(toasterService, 'warning').and.callThrough();
      service.getRedirectUrl(MockResponse.ServerResponse, '9dvdkjlsds2423423', '9234982302342342', '293482034290999');
      const windowSpy = spyOn(window, 'open');
      window.open('/learn/redirect', '_blank');
      expect(toasterService.warning).toBeDefined();
      expect(toasterService.warning).toHaveBeenCalledWith(resourceService.messages.imsg.m0034);
      expect(window.open).toHaveBeenCalledWith('/learn/redirect', '_blank');
    }));
});
