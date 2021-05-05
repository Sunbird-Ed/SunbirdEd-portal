import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('DataService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DataService, HttpClient]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('should return required headers', inject([DataService], (service: DataService) => {
    spyOn(document, 'getElementById').and.callFake((id) => {
      if (id === 'deviceId') {
        return { value: 'fake-device-id' };
      }
      if (id === 'appId') {
        return { value: 'fake-appId' };
      }
      return { value: 'mock Id' };
    });
    service.appVersion = 'fake-appversion';
    service.rootOrgId = 'fake-rootOrgId';
    service.channelId = 'fake-channelId';
    service['userId'] = 'fake_userId';
    service['sessionId'] = 'fake-sessionId';
    const request = service['getHeader']();
    expect(request).toBeDefined();
  }));
});
