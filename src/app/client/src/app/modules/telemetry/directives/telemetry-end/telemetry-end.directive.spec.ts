import { of as observableOf } from 'rxjs';
import { TelemetryEndDirective } from './telemetry-end.directive';
import { TelemetryService } from '../../services';
import { eventData } from './telemetry-end.directive.spec.data';
import { DebugElement } from '@angular/core';
import { data } from 'jquery';
describe('TelemetryEndDirective', () => {
    let directive: TelemetryEndDirective;

    const telemetryService: Partial<TelemetryService> = {
        end: jest.fn()
    };

    beforeEach(() => {
        directive = new TelemetryEndDirective(telemetryService as TelemetryService);
    });

    it('should take input and generate the telemetry end event ', () => {
        jest.spyOn(telemetryService, 'end').mockImplementation(() => observableOf(eventData.inputData));
        directive.appTelemetryEnd = eventData.inputData;
        window.dispatchEvent(new Event('unload'));
        directive.unloadHandler(data);
        directive.ngOnDestroy();
        expect(directive.appTelemetryEnd).toBeDefined();
        expect(directive.appTelemetryEnd).toBe(eventData.inputData);
        expect(telemetryService.end).toHaveBeenCalled();
    });
});
