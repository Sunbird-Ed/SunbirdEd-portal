import { TelemetryEndDirective } from './telemetry-end.directive';
import { IEndEventInput } from '../../interfaces';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {  ElementRef } from '@angular/core';
import {eventData} from './telemetry-end.directive.spec.data';
describe('TelemetryStartDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryEndDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should create an instance', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryEndDirective(telemetryService);
    expect(directive).toBeTruthy();
  });
  it('should take input', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryEndDirective( telemetryService);
    directive.appTelemetryEnd = eventData.inputData;
    expect(directive.appTelemetryEnd).toBeDefined();
    spyOn(directive, 'telemetryEnd').and.callThrough();
    expect(directive.appTelemetryEnd).toBe(eventData.inputData);
  });
});
