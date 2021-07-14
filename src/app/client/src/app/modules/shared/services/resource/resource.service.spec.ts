
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';
import { ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import {mockRes} from './resource.service.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('ResourceService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot({
                  loader: {
                    provide: TranslateLoader,
                    useClass: TranslateFakeLoader
                  }
                })],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService]
    });
  });

  it('should call get resource method   when resourcebundle is not cached',
   inject([ResourceService, CacheService, HttpClient ],
    (resourceService: ResourceService , cacheService: CacheService, http ) => {
    cacheService.set('resourcebundlesen', null , { maxAge: 10 * 60});
    spyOn(resourceService, 'initialize').and.callThrough();
    spyOn(resourceService, 'get').and.callFake(() => observableOf(mockRes.resourceData));
    spyOn(http, 'get').and.callFake(() => observableOf(mockRes.resourceData));
    spyOn(resourceService, 'getResource').and.callThrough();
    resourceService.getResource();
    expect(resourceService.frmelmnts).toBeDefined();
    expect(resourceService.messages).toBeDefined();
  }));
  it('should  not call get resource method   when resourcebundle is  cached',
   inject([ResourceService, CacheService, HttpClient ],
    (resourceService: ResourceService , cacheService: CacheService, http ) => {
    cacheService.set('resourcebundlesen', mockRes.cachedResourceData.value , { maxAge: 10 * 60});
    spyOn(resourceService, 'initialize').and.callThrough();
    spyOn(resourceService, 'getResource').and.callThrough();
    resourceService.getResource();
    expect(resourceService.frmelmnts).toBeDefined();
    expect(resourceService.messages).toBeDefined();
  }));
  it('should  emit languageSelected when portalLanguage and resourcebundlesearch is cached ',
  inject([ResourceService, CacheService, HttpClient ],
   (resourceService: ResourceService , cacheService: CacheService, http ) => {
   cacheService.set('resourcebundlesearch', mockRes.cachedResourcebundleSearch.value , { maxAge: 10 * 60});
   cacheService.set('portalLanguage', mockRes.cachedPortalLanguage.value , { maxAge: 10 * 60});
   spyOn(resourceService, 'initialize').and.callThrough();
   spyOn(resourceService, 'getLanguageChange').and.callThrough();
   resourceService.getResource();
   resourceService.initialize();
   expect(resourceService.frmelmnts).toBeDefined();
   expect(resourceService.messages).toBeDefined();
 }));
});
