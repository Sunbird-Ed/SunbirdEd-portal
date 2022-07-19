import { of, throwError } from "rxjs";
import { ConfigService } from '../../../shared/services/config/config.service';
import { HttpClient } from "@angular/common/http";
import { DeviceRegisterService } from './device-register.service';
import { PublicDataService } from './../public-data/public-data.service';
import { DeviceService } from '../../services/device/device.service';

describe('DeviceRegisterService', () => {
  let deviceRegisterService: DeviceRegisterService;
  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        DEVICE_PREFIX: '/device/',
        DEVICE: {
          PROFILE: 'profile/'
        }
      }
    }
  };
  const mockPublicDataService: Partial<PublicDataService> = {};
  const mockDeviceService: Partial<DeviceService> = {
    post: jest.fn().mockImplementation(() => { }),
    get: jest.fn().mockImplementation(() => { })
  };
  const mockHttpClient: Partial<HttpClient> = {
  };
  beforeAll(() => {
    deviceRegisterService = new DeviceRegisterService(
      mockPublicDataService as PublicDataService,
      mockDeviceService as DeviceService,
      mockConfigService as ConfigService,
      mockHttpClient as HttpClient
    );
    jest.spyOn(document, 'getElementById').mockImplementation((data) => {
      switch (data) {
        case 'deviceId':
          return { value: '32cef05697d1ab3a8049c0e8981bcc79' } as any;
        case 'buildNumber':
          return { value: '4.9.1' } as any;
        case 'appId':
          return { value: 'dev.sunbird.portal' } as any;
        case 'deviceRegisterApi':
          return { value: 'https://apistaging.sunbired.org/v3/device/register/' } as any;
        case 'deviceProfileApi':
          return { value: 'https://staging.open-sunbird.org/api/v3/device/profile/' } as any;
        case 'deviceApi':
          return { value: 'http://kong:8000/' } as any;

      }
    });
  });


  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of DeviceRegisterService', () => {
    expect(deviceRegisterService).toBeTruthy();
    expect(deviceRegisterService['portalVersion']).toBe('1.0');
  });

  describe('should update the Device ID', () => {
    it('should update the setDeviceId using the DOM element', () => {
      jest.spyOn(document, 'getElementById').mockImplementation((data) => {
        switch (data) {
          case 'deviceId':
            return { value: '32cef05697d1ab3a8049c0e8981bcc79' } as any;
        }
      });
      deviceRegisterService.setDeviceId();
      expect(deviceRegisterService['deviceId']).toBe('32cef05697d1ab3a8049c0e8981bcc79');
    });
  });

  describe('should call fetchDeviceProfile', () => {
    it('should call fetchDeviceProfile using the DOM element', (done) => {
      jest.spyOn(deviceRegisterService['deviceService'], 'get').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
      // act
      deviceRegisterService.fetchDeviceProfile().subscribe(() => {
        done();
      });
      expect(deviceRegisterService['deviceService'].get).toHaveBeenCalled();
    });

    it('should call fetchDeviceProfile using the DOM element with error', () => {
      // arrange
      jest.spyOn(deviceRegisterService['deviceService'], 'get').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      deviceRegisterService.fetchDeviceProfile().subscribe(() => {
      });
      expect(deviceRegisterService['deviceService'].get).toHaveBeenCalled();
    });
  });

  describe('should call getDeviceProfile', () => {
    it('should call getDeviceProfile using the DOM element', () => {
      deviceRegisterService.deviceProfile = {
        deviceId : '32cef05697d1ab3a8049c0e8981bcc79'
      };
      deviceRegisterService.getDeviceProfile().subscribe(() => {
        expect(deviceRegisterService.deviceProfile).toBe({deviceId : '32cef05697d1ab3a8049c0e8981bcc79'});
      });
    });
    it('should call getDeviceProfile using the DOM element', (done) => {
      deviceRegisterService.deviceProfile = null;
      jest.spyOn(deviceRegisterService, 'fetchDeviceProfile').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
      // act
      deviceRegisterService.getDeviceProfile().subscribe(() => {
        done();
      });
      expect(deviceRegisterService.fetchDeviceProfile).toHaveBeenCalled();
    });

    it('should call getDeviceProfile using the DOM element with error', () => {
      deviceRegisterService.deviceProfile = null;
      // arrange
      jest.spyOn(deviceRegisterService,'fetchDeviceProfile').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      deviceRegisterService.getDeviceProfile().subscribe(() => {
      });
      expect(deviceRegisterService.fetchDeviceProfile).toHaveBeenCalled();
    });
  });

  describe('should call updateDeviceProfile', () => {
      const userDeclaredLocation = {
        state: 'karnataka',
        district: 'Bangalore'
      }
    it('should call updateDeviceProfile using the DOM element', (done) => {
      jest.spyOn(deviceRegisterService['deviceService'], 'post').mockReturnValue(of({
        id: 'id',
        params: {
          resmsgid: '',
          status: 'staus'
        },
        responseCode: 'OK',
        result: {},
        ts: '',
        ver: ''
      }));
      // act
      deviceRegisterService.updateDeviceProfile(userDeclaredLocation).subscribe(() => {
        done();
      });
      expect(deviceRegisterService['deviceService'].post).toHaveBeenCalled();
    });

    it('should call updateDeviceProfile using the DOM element with error', () => {
      deviceRegisterService.deviceProfile = null;
      // arrange
      jest.spyOn(deviceRegisterService['deviceService'], 'post').mockImplementation(() => {
        return throwError({ error: {} });
      });
      // act
      deviceRegisterService.updateDeviceProfile(userDeclaredLocation).subscribe(() => {
      });
      expect(deviceRegisterService['deviceService'].post).toHaveBeenCalled();
    });
  });
});