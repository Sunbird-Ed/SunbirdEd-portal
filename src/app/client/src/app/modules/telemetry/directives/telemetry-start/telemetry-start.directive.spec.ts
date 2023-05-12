import { of as observableOf } from 'rxjs';
import { TelemetryStartDirective } from './telemetry-start.directive';
import { TelemetryService } from '../../services';
import { eventData } from './telemetry-start.directive.spec.data';

describe('TelemetryStartDirective', () => {
    let directive: TelemetryStartDirective;
    const telemetryService: Partial<TelemetryService> = {
        start: jest.fn()
    };

    beforeEach(() => {
        directive = new TelemetryStartDirective(telemetryService as TelemetryService);
    });
    it('should take input and  generate the telemetry start event', () => {
        jest.spyOn(telemetryService, 'start').mockImplementation(() => observableOf(eventData.inputData));
        directive.appTelemetryStart = eventData.inputData;
        directive.ngOnChanges();
        expect(directive.appTelemetryStart).toBeDefined();
        expect(directive.appTelemetryStart).toBe(eventData.inputData);
        expect(telemetryService.start).toHaveBeenCalled();
    });
});