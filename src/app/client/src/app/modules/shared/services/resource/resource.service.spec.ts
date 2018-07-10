
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';
import { ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import {mockRes} from './resource.service.spec.data';
describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService]
    });
  });

 it('should be created', inject([ResourceService, CacheService], (service: ResourceService, cacheService: CacheService) => {
    expect(service).toBeTruthy();
  }));
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
});
