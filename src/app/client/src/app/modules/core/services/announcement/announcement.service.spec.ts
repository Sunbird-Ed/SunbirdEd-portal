
import {of as observableOf, throwError as observableThrowError,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as testData from './announcement.service.spec.data';

import { AnnouncementService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';

describe('AnnouncementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientModule, AnnouncementService, ConfigService]
    });
  });

  it('should be created', inject([AnnouncementService], (service: AnnouncementService) => {
    expect(service).toBeTruthy();
  }));

  it('should make inbox api call and get success response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'limit': 10, 'offset': 10 } } };
    spyOn(service, 'post').and.callFake(() => observableOf(testData.mockRes.inboxSuccess));
    service.getInboxData(params).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.result.count).toBe(1169);
      }
    );
  }));

  it('should make inbox api call and get error response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'limit': 10, 'offset': 10 } } };
    spyOn(service, 'post').and.callFake(() => observableThrowError(testData.mockRes.inboxError));
    service.getInboxData(params).subscribe(
      apiResponse => { },
      err => {
        expect(err.params.errmsg).toBe('Cannot set property of undefined');
        // expect(err.params.status).toBe('failed');
        expect(err.responseCode).toBe('CLIENT_ERROR');
      }
    );
  }));

  it('should make outbox api call and get success response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'limit': 25, 'offset': 10 } } };
    spyOn(service, 'post').and.callFake(() => observableOf(testData.mockRes.outBoxSuccess));
    service.getOutboxData(params).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.result.count).toBe(1000);
      }
    );
  }));

  it('should make outbox api call and get error response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'limit': 25, 'offset': 10 } } };
    spyOn(service, 'post').and.callFake(() => observableThrowError(testData.mockRes.outboxError));
    service.getOutboxData(params);
    service.getOutboxData(params).subscribe(
      apiResponse => { },
      err => {
        expect(err.params.errmsg).toBe('Cannot set property of undefined');
        // expect(err.params.status).toBe('failed');
        expect(err.responseCode).toBe('CLIENT_ERROR');
      }
    );
  }));

  it('should make received api call and get success response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba', 'channel': 'web' } } };
    spyOn(service, 'post').and.callFake(() => observableOf(testData.mockRes.receivedSuccess));
    service.receivedAnnouncement(params).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        // expect(apiResponse.params.status).toBe('successful');
      }
    );
  }));

  it('should make received api call and get error response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba', 'channel': 'web' } } };
    spyOn(service, 'post').and.callFake(() => observableThrowError(testData.mockRes.receivedError));
    service.receivedAnnouncement(params).subscribe(
      apiResponse => { },
      err => {
        expect(err.params.errmsg).toBe('Unauthorized User');
        // expect(err.params.status).toBe('failed');
        expect(err.responseCode).toBe('CLIENT_ERROR');
      }
    );
  }));

  it('should make read api call and get success response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba', 'channel': 'web' } } };
    spyOn(service, 'post').and.callFake(() => observableOf(testData.mockRes.readSuccess));
    service.readAnnouncement(params).subscribe(
      apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        // expect(apiResponse.params.status).toBe('successful');
      }
    );
  }));

  it('should make read api call and get error response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba', 'channel': 'web' } } };
    spyOn(service, 'post').and.callFake(() => observableThrowError(testData.mockRes.readError));
    service.readAnnouncement(params).subscribe(
      apiResponse => { },
      err => {
        expect(err.params.errmsg).toBe('Unauthorized User');
        // expect(err.params.status).toBe('failed');
        expect(err.responseCode).toBe('CLIENT_ERROR');
      }
    );
  }));

  it('should make delete api call and get success response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba' } } };
    spyOn(service, 'delete').and.callFake(() => observableOf(testData.mockRes.deleteSuccess));
    service.deleteAnnouncement(params).subscribe(
      (apiResponse: any) => {
        expect(apiResponse.responseCode).toBe('OK');
        // expect(apiResponse.params.status).toBe('successful');
      }
    );
  }));

  it('should make delete api call and get error response', inject([AnnouncementService], (service: AnnouncementService) => {
    const params = { data: { 'request': { 'announcementId': 'fa355310-0b09-11e8-93d1-2970a259a0ba' } } };
    spyOn(service, 'delete').and.callFake(() => observableThrowError(testData.mockRes.deleteError));
    service.deleteAnnouncement(params).subscribe(
      apiResponse => { },
      err => {
        expect(err.params.errmsg).toBe('Unauthorized User!22');
        // expect(err.params.status).toBe('failed');
        expect(err.responseCode).toBe('CLIENT_ERROR');
      }
    );
  }));

  it('should make get announcement by id api call and get success response', inject([AnnouncementService],
    (service: AnnouncementService) => {
    const params = { data: { 'request': { 'announcementId': '92ca4110-19df-11e8-8773-d9334313c305' } } };
    spyOn(service, 'delete').and.callFake(() => observableOf(testData.mockRes.getAnnByIdSuccess));
    service.getAnnouncementById(params).subscribe(
      (apiResponse: any) => {
        expect(apiResponse.responseCode).toBe('OK');
        // expect(apiResponse.params.status).toBe('successful');
        expect(apiResponse.result.announcement.title).toBe('announcement-7th');
      }
    );
  }));

  it('should make get announcement by id api call and get error response', inject([AnnouncementService],
    (service: AnnouncementService) => {
    spyOn(service, 'delete').and.callFake(() => observableThrowError(testData.mockRes.getAnnByIdError));
    service.getAnnouncementById({}).subscribe(
      apiResponse => { },
      err => {
        expect(err.params.errmsg).toBe('Unauthorized User');
        // expect(err.params.status).toBe('failed');
        expect(err.responseCode).toBe('CLIENT_ERROR');
      }
    );
  }));
});
