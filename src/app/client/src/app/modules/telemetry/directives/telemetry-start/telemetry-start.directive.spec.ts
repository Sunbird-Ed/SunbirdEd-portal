
import {of as observableOf,  Observable } from 'rxjs';
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
  it('should take input and  generate the telemetry start event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryStartDirective(telemetryService);
    spyOn(telemetryService, 'start').and.callFake(() => observableOf(eventData.inputData));
    directive.appTelemetryStart = eventData.inputData;
    directive.ngOnChanges();
    expect(directive.appTelemetryStart).toBeDefined();
    expect(directive.appTelemetryStart).toBe(eventData.inputData);
    expect(telemetryService.start).toHaveBeenCalled();
  });
});
