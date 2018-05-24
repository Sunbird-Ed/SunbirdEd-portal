import { TelemetryLogDirective } from './telemetry-log.directive';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {eventData} from './telemetry-log.directive.spec.data';
import { Observable } from 'rxjs/Observable';
describe('TelemetryLogDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryLogDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should create an instance', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryLogDirective(telemetryService);
    expect(directive).toBeTruthy();
  });
  it('should take input', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryLogDirective(telemetryService);
    spyOn(telemetryService, 'log').and.callFake(() => Observable.of(eventData.inputData));
    directive.appTelemetryLog = eventData.inputData;
    directive.log();
    expect(directive.appTelemetryLog).toBeDefined();
    expect(directive.appTelemetryLog).toBe(eventData.inputData);
    expect(telemetryService.log).toHaveBeenCalled();
  });
});
