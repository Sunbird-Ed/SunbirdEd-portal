import { TestBed, inject } from '@angular/core/testing';
import { ConfigService, ResourceService, ToasterService } from '../../services';
import { ExternalUrlpreviewService } from '../extUrl-util.ts/extUrl-util.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockResponse } from './extUrl-util.service.mock.data';

class RouterStub {
    navigate = jasmine.createSpy('navigate');
}

describe('ContentUtilsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, Ng2IziToastModule],
            providers: [ExternalUrlpreviewService, ConfigService, ResourceService, ToasterService,
                { provide: Router, useClass: RouterStub }]
        });
    });

    it('should be created', inject([ExternalUrlpreviewService], (service: ExternalUrlpreviewService) => {
        expect(service).toBeDefined();
    }));

    it('should open preview link in newtab for mimeType x-url',
        inject([Router, ToasterService, ResourceService, ExternalUrlpreviewService], (router, toasterService, resourceService, service) => {
            resourceService.messages = MockResponse.resourceBundle.messages;
            spyOn(toasterService, 'warning').and.callThrough();
            service.getRedirectUrl(MockResponse.ServerResponse, '9dvdkjlsds2423423', 'do_1125110622654464001294', '293482034290999');
            const windowSpy = spyOn(window, 'open');
            window.open('/learn/redirect', '_blank');
            expect(toasterService.warning).toBeDefined();
            expect(toasterService.warning).toHaveBeenCalledWith(resourceService.messages.imsg.m0034);
            expect(window.open).toHaveBeenCalledWith('/learn/redirect', '_blank');
        }));
});
