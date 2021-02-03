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

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
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
    localStorage.setItem('traceId', 'fake-traceId');
    const request = service['getHeader']();
    expect(request).toBeDefined();
    expect(request['X-Request-ID']).toEqual('fake-traceId');
  }));
});
