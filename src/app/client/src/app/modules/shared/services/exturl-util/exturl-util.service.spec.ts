import { TestBed, inject } from '@angular/core/testing';
import { ConfigService, ResourceService, ToasterService } from '../../services';
import { ExternalUrlPreviewService } from '../exturl-util/exturl-util.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockResponse } from './exturl-util.service.mock.data';
import { CacheService } from 'ng2-cache-service';
import { BrowserCacheTtlService } from './../browser-cache-ttl/browser-cache-ttl.service';

class RouterStub {
    navigate = jasmine.createSpy('navigate');
}

describe('External Url UtilsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ExternalUrlPreviewService, ConfigService, CacheService,
                BrowserCacheTtlService,
                { provide: Router, useClass: RouterStub }]
        });
    });

    it('should be created', inject([ExternalUrlPreviewService], (service: ExternalUrlPreviewService) => {
        expect(service).toBeDefined();
    }));

    it('should open preview link in newtab for mimeType x-url',
        inject([Router, ExternalUrlPreviewService], (router, service) => {
            service.generateRedirectUrl(MockResponse.ServerResponse, '9dvdkjlsds2423423', 'do_1125110622654464001294', '293482034290999');
            const windowSpy = spyOn(window, 'open');
            window.open('/learn/redirect', '_blank');
            expect(windowSpy).toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledWith('/learn/redirect', '_blank');
        }));
});
