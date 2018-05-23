import { TelemetryErrorDirective } from './telemetry-error.directive';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
// import {eventData} from './telemetry-start.directive.spec.data';
describe('TelemetryErrorDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryErrorDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  fit('should create an instance', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryErrorDirective(telemetryService);
    expect(directive).toBeTruthy();
  });
  // it('should take input', () => {
  //   const telemetryService = TestBed.get(TelemetryService);
  //   const directive = new TelemetryStartDirective(telemetryService);
  //   directive.appTelemetryStart = eventData.inputData;
  //   expect(directive.appTelemetryStart).toBeDefined();
  //   expect(directive.appTelemetryStart).toBe(eventData.inputData);
  // });
});
