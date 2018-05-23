import { TelemetryStartDirective } from './telemetry-start.directive';
import { IStartEventInput } from '../../interfaces';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {eventData} from './telemetry-start.directive.spec.data';
describe('TelemetryStartDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryStartDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should create an instance', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryStartDirective(telemetryService);
    expect(directive).toBeTruthy();
  });
  it('should take input', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryStartDirective(telemetryService);
    directive.appTelemetryStart = eventData.inputData;
    expect(directive.appTelemetryStart).toBeDefined();
    expect(directive.appTelemetryStart).toBe(eventData.inputData);
  });
});
