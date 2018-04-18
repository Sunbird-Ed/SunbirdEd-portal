import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ITelemetry, ITelemetryEvent
} from './../../interfaces';
import { TelemetryLibUtilService } from './telemetry-lib-util.service';
import * as mockData from './telemetry-lib-util.service.spec.data';
import { Observable } from 'rxjs/Observable';

describe('TelemetryLibUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TelemetryLibUtilService]
    });
  });

  it('should be created', inject([TelemetryLibUtilService], (service: TelemetryLibUtilService) => {
    expect(service).toBeTruthy();
  }));
  it('should call initalize telemetry function', inject([TelemetryLibUtilService],
    (telemetryLibUtilService: TelemetryLibUtilService) => {
      expect(telemetryLibUtilService).toBeTruthy();
      spyOn(EkTelemetry, 'initialize').and.callThrough();
      const apiRes = telemetryLibUtilService.initEvent(mockData.mockRes.telemetry);
      expect(EkTelemetry.initialize).toHaveBeenCalled();
    }));
  it('should call telemetry start event', inject([TelemetryLibUtilService],
    (telemetryLibUtilService: TelemetryLibUtilService) => {
      expect(telemetryLibUtilService).toBeTruthy();
      spyOn(EkTelemetry, 'start').and.callThrough();
      const apiRes = telemetryLibUtilService.startEvent(mockData.mockRes.telemetryEvent, mockData.mockRes.telemetry);
      expect(EkTelemetry.start).toHaveBeenCalled();
    }));
  it('should call telemetry impression event', inject([TelemetryLibUtilService],
    (telemetryLibUtilService: TelemetryLibUtilService) => {
      spyOn(EkTelemetry, 'impression').and.callThrough();
      const apiRes = telemetryLibUtilService.impressionEvent(mockData.mockRes.telemetryEvent);
      expect(telemetryLibUtilService).toBeTruthy();
      expect(EkTelemetry.impression).toHaveBeenCalled();
    }));
  it('should call telemetry interact event', inject([TelemetryLibUtilService],
    (telemetryLibUtilService: TelemetryLibUtilService) => {
      spyOn(EkTelemetry, 'interact').and.callThrough();
      const apiRes = telemetryLibUtilService.interactEvent(mockData.mockRes.telemetryEvent);
      expect(telemetryLibUtilService).toBeTruthy();
      expect(EkTelemetry.interact).toHaveBeenCalled();
    }));
  it('should call telemetry share event', inject([TelemetryLibUtilService],
    (telemetryLibUtilService: TelemetryLibUtilService) => {
      spyOn(EkTelemetry, 'share').and.callThrough();
      const apiRes = telemetryLibUtilService.shareEvent(mockData.mockRes.telemetryEvent);
      expect(telemetryLibUtilService).toBeTruthy();
      expect(EkTelemetry.share).toHaveBeenCalled();
    }));
  it('should call telemetry error event', inject([TelemetryLibUtilService],
    (telemetryLibUtilService: TelemetryLibUtilService) => {
      spyOn(EkTelemetry, 'error').and.callThrough();
      const apiRes = telemetryLibUtilService.errorEvent(mockData.mockRes.telemetryEvent);
      expect(telemetryLibUtilService).toBeTruthy();
      expect(EkTelemetry.error).toHaveBeenCalled();
    }));
  it('should call telemetry end event', inject([TelemetryLibUtilService],
    (telemetryLibUtilService: TelemetryLibUtilService) => {
      spyOn(EkTelemetry, 'end').and.callThrough();
      const apiRes = telemetryLibUtilService.endEvent(mockData.mockRes.telemetryEvent);
      expect(telemetryLibUtilService).toBeTruthy();
      expect(EkTelemetry.end).toHaveBeenCalled();
    }));
  it('should call telemetry log event', inject([TelemetryLibUtilService],
    (telemetryLibUtilService: TelemetryLibUtilService) => {
      spyOn(EkTelemetry, 'log').and.callThrough();
      const apiRes = telemetryLibUtilService.logEvent(mockData.mockRes.telemetryEvent);
      expect(telemetryLibUtilService).toBeTruthy();
      expect(EkTelemetry.log).toHaveBeenCalled();
    }));
});
