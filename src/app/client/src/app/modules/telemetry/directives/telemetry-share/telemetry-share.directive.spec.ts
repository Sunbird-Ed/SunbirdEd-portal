import { TelemetryShareDirective } from './telemetry-share.directive';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
 import {eventData} from './telemetry-share.directive.spec.data';
describe('TelemetryShareDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryShareDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should create an instance', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryShareDirective(telemetryService);
    expect(directive).toBeTruthy();
  });
  fit('should take input', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryShareDirective(telemetryService);
    directive.appTelemetryShare = eventData.inputData;
    expect(directive.appTelemetryShare).toBeDefined();
    expect(directive.appTelemetryShare).toBe(eventData.inputData);
  });
});
