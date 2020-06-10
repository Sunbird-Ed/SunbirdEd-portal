import {TestBed, inject} from '@angular/core/testing';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {ConfigService} from '@sunbird/shared';
import {DeviceService} from './device.service';
import { configureTestSuite } from '@sunbird/test-util';

describe('DeviceService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DeviceService, ConfigService, HttpClient]
    });
  });

  it('should be created', () => {
    const service: DeviceService = TestBed.get(DeviceService);
    expect(service).toBeTruthy();
  });
});
