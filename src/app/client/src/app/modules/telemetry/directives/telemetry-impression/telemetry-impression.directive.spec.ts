import { TelemetryImpressionDirective } from './telemetry-impression.directive';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {eventData} from './telemetry-impression.directive.spec.data';
import { Observable } from 'rxjs/Observable';
describe('TelemetryImpressionDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryImpressionDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should create an instance', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryImpressionDirective(telemetryService);
    expect(directive).toBeTruthy();
  });
  xit('should take input', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryImpressionDirective(telemetryService);
    spyOn(telemetryService, 'impression').and.callFake(() => Observable.of(eventData.inputData));
    directive.appTelemetryImpression = eventData.inputData;
    directive.ngOnInit();
    expect(directive.appTelemetryImpression).toBeDefined();
    expect(directive.appTelemetryImpression).toBe(eventData.inputData);
    expect(telemetryService.impression).toHaveBeenCalled();
  });
});

