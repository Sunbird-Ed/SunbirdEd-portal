import { TestBed, inject } from '@angular/core/testing';
import { ConfigService, ResourceService, ToasterService } from '../../services';
import { ExternalUrlPreviewService } from '../exturl-util/exturl-util.service';
import { configureTestSuite } from '@sunbird/test-util';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockResponse } from './exturl-util.service.mock.data';
import { CacheService } from 'ng2-cache-service';
import { BrowserCacheTtlService } from './../browser-cache-ttl/browser-cache-ttl.service';

class RouterStub {
    navigate = jasmine.createSpy('navigate');
}

describe('External Url UtilsService', () => {
    configureTestSuite();
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
});
