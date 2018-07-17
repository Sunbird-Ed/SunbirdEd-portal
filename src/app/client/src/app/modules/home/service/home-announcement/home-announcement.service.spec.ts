
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
// import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as testData from './home-announcement.service.spec.data';
import { TestBed, inject } from '@angular/core/testing';

import { HomeAnnouncementService } from './home-announcement.service';
import { ConfigService , BrowserCacheTtlService} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';

describe('HomeAnnouncementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientModule, HomeAnnouncementService, ConfigService, CacheService, BrowserCacheTtlService]
    });
  });

  it('should be created', inject([HomeAnnouncementService], (service: HomeAnnouncementService) => {
    expect(service).toBeTruthy();
  }));

  it('should make inbox api call and get success response when no cache', inject([HomeAnnouncementService, CacheService],
    (service: HomeAnnouncementService, cacheService: CacheService ) => {
    const params = { data: { 'request': { 'limit': 10, 'offset': 10 } } };
   cacheService.set('AnnouncementInboxData', null , { maxAge: 10 * 60});
   spyOn(service, 'post').and.callFake(() => observableOf(testData.mockRes.inboxSuccess));
    service.getInboxData(params).subscribe(
      apiResponse => {
        expect(apiResponse.announcements).toBeDefined();
        expect(apiResponse.announcements).toEqual(testData.mockRes.inboxSuccess.result.announcements);
      }
    );
  }));
  it('should make inbox api call and get success response with cache data', inject([HomeAnnouncementService, CacheService],
    (service: HomeAnnouncementService, cacheService: CacheService ) => {
    const params = { data: { 'request': { 'limit': 10, 'offset': 10 } } };
   cacheService.set('AnnouncementInboxData', {announcements: testData.mockRes.inboxSuccess.result.announcements} , { maxAge: 10 * 60});
    service.getInboxData(params).subscribe(
      apiResponse => {
        expect(apiResponse.announcements).toBeDefined();
        expect(apiResponse.announcements).toEqual(testData.mockRes.inboxSuccess.result.announcements);
      }
    );
  }));

  it('should make inbox api call and get error response', inject([HomeAnnouncementService], (service: HomeAnnouncementService) => {
    const params = { data: { 'request': { 'limit': 10, 'offset': 10 } } };
    spyOn(service, 'post').and.callFake(() => observableThrowError(testData.mockRes.inboxError));
    service.getInboxData(params).subscribe(
      apiResponse => { },
      err => {
        expect(err.params.errmsg).toBe('Cannot set property of undefined');
        expect(err.responseCode).toBe('CLIENT_ERROR');
      }
    );
  }));
 });
