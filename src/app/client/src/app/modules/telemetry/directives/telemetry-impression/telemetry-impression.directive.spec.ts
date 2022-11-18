import { of as observableOf } from 'rxjs';
import { TelemetryImpressionDirective } from './telemetry-impression.directive';
import { TelemetryService } from '../../services';
import { eventData } from './telemetry-impression.directive.spec.data';
describe('TelemetryImpressionDirective', () => {
    let directive: TelemetryImpressionDirective;
    const telemetryService: Partial<TelemetryService> = {
        impression: jest.fn()
    };

    beforeEach(() => {
        directive = new TelemetryImpressionDirective(telemetryService as TelemetryService);
    });

    it('should take input and generate the telemetry impression event', () => {
        directive.ngOnInit()
        jest.spyOn(telemetryService, 'impression').mockImplementation(() => observableOf(eventData.inputData));
        directive.appTelemetryImpression = eventData.inputData;
        directive.ngOnChanges();
        expect(directive.appTelemetryImpression).toBeDefined();
        expect(directive.appTelemetryImpression).toBe(eventData.inputData);
        expect(telemetryService.impression).toHaveBeenCalled();
    });

    it('should call onDestroy method', () => {
        jest.spyOn(telemetryService, 'impression').mockImplementation(() => observableOf(eventData.inputData));
        directive.appTelemetryImpression = eventData.inputData;
        directive.ngOnDestroy();
        expect(directive.appTelemetryImpression).toBeDefined();
        expect(directive.appTelemetryImpression).toBe(eventData.inputData);
        expect(telemetryService.impression).toHaveBeenCalled();
    });
});