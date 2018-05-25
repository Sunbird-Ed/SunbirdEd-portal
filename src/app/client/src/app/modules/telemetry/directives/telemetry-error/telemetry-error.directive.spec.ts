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
  it('should create an instance', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryErrorDirective(telemetryService);
    expect(directive).toBeTruthy();
  });
});
