
import {of as observableOf,  Observable } from 'rxjs';
import { TelemetryErrorDirective } from './telemetry-error.directive';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {eventData} from './telemetry-error.dircetive.spec.data';
describe('TelemetryErrorDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryErrorDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should take input and generate the telemetry  error event ', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryErrorDirective(telemetryService);
    spyOn(telemetryService, 'error').and.callFake(() => observableOf(eventData.inputData));
    directive.appTelemetryError = eventData.inputData;
    directive.ngOnChanges();
    expect(directive.appTelemetryError).toBeDefined();
    expect(directive.appTelemetryError).toBe(eventData.inputData);
    expect(telemetryService.error).toHaveBeenCalled();
  });
});
