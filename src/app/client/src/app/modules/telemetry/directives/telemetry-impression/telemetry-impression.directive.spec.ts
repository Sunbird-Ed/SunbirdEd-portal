
import {of as observableOf } from 'rxjs';
import { TelemetryImpressionDirective } from './telemetry-impression.directive';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed} from '@angular/core/testing';
import {eventData} from './telemetry-impression.directive.spec.data';
import { configureTestSuite } from '@sunbird/test-util';
describe('TelemetryImpressionDirective', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryImpressionDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should take input and generate the telemetry impression event', () => {
    const telemetryService = TestBed.inject(TelemetryService);
    const directive = new TelemetryImpressionDirective(telemetryService);
    spyOn(telemetryService, 'impression').and.callFake(() => observableOf(eventData.inputData));
    directive.appTelemetryImpression = eventData.inputData;
    directive.ngOnChanges();
    expect(directive.appTelemetryImpression).toBeDefined();
    expect(directive.appTelemetryImpression).toBe(eventData.inputData);
    expect(telemetryService.impression).toHaveBeenCalled();
  });
});
