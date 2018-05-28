import { TelemetryShareDirective } from './telemetry-share.directive';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {eventData} from './telemetry-share.directive.spec.data';
import { Observable } from 'rxjs/Observable';
describe('TelemetryShareDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryShareDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should take input and  generate the telemetry  share  event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryShareDirective(telemetryService);
    spyOn(telemetryService, 'share').and.callFake(() => Observable.of(eventData.inputData));
    directive.appTelemetryShare = eventData.inputData;
    directive.ngOnInit();
    expect(directive.appTelemetryShare).toBeDefined();
    expect(directive.appTelemetryShare).toBe(eventData.inputData);
    expect(telemetryService.share).toHaveBeenCalled();
  });
});
