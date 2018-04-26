import { TestBed, inject } from '@angular/core/testing';
import { TelemetryService, TELEMETRY_PROVIDER } from './telemetry.service';
import { mockData } from './telemetry.service.spec.data';

describe('TelemetryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
        });
    });

    it('should be created', inject([TelemetryService], (service: TelemetryService) => {
        expect(service).toBeTruthy();
    }));

    it('should initialize the service', inject([TelemetryService], (service: TelemetryService) => {
        spyOn(EkTelemetry, 'initialize');
        service.initialize(mockData.telemetry);
        expect(EkTelemetry.initialize).toHaveBeenCalledWith(mockData.telemetry.config);
    }));

    describe('start event', () => {
        it('should send "start" event if service is initialised', inject([TelemetryService], (service: TelemetryService) => {
            service.initialize(mockData.telemetry);
            spyOn(EkTelemetry, 'start');
            service.start(mockData.startInputData);
            expect(EkTelemetry.start).toHaveBeenCalledTimes(1);
        }));

        it('should not send "start" event if service is not initialised', inject([TelemetryService], (service: TelemetryService) => {
            spyOn(EkTelemetry, 'start');
            service.start(mockData.startInputData);
            expect(EkTelemetry.start).not.toHaveBeenCalled();
        }));
    });

    describe('impression event', () => {
        it('should send "impression" event if service is initialised', inject([TelemetryService], (service: TelemetryService) => {
            service.initialize(mockData.telemetry);
            spyOn(EkTelemetry, 'impression');
            service.impression(mockData.impressionInputData);
            expect(EkTelemetry.impression).toHaveBeenCalledTimes(1);
        }));

        it('should not send "impression" event if service is not initialised', inject([TelemetryService], (service: TelemetryService) => {
            spyOn(EkTelemetry, 'impression');
            service.impression(mockData.impressionInputData);
            expect(EkTelemetry.impression).not.toHaveBeenCalled();
        }));
    });

    describe('interact event', () => {
        it('should send "interact" event if service is initialised', inject([TelemetryService], (service: TelemetryService) => {
            service.initialize(mockData.telemetry);
            spyOn(EkTelemetry, 'interact');
            service.interact(mockData.interactEventData);
            expect(EkTelemetry.interact).toHaveBeenCalledTimes(1);
        }));

        it('should not send "interact" event if service is not initialised', inject([TelemetryService], (service: TelemetryService) => {
            spyOn(EkTelemetry, 'interact');
            service.interact(mockData.interactEventData);
            expect(EkTelemetry.interact).not.toHaveBeenCalled();
        }));
    });

    describe('share event', () => {
        it('should send "share" event if service is initialised', inject([TelemetryService], (service: TelemetryService) => {
            service.initialize(mockData.telemetry);
            spyOn(EkTelemetry, 'share');
            service.share(mockData.shareEventData);
            expect(EkTelemetry.share).toHaveBeenCalledTimes(1);
        }));

        it('should not send "share" event if service is not initialised', inject([TelemetryService], (service: TelemetryService) => {
            spyOn(EkTelemetry, 'share');
            service.share(mockData.shareEventData);
            expect(EkTelemetry.share).not.toHaveBeenCalled();
        }));
    });

    describe('error event', () => {
        it('should send "error" event if service is initialised', inject([TelemetryService], (service: TelemetryService) => {
            service.initialize(mockData.telemetry);
            spyOn(EkTelemetry, 'error');
            service.error(mockData.errorEventData);
            expect(EkTelemetry.error).toHaveBeenCalledTimes(1);
        }));

        it('should not send "error" event if service is not initialised', inject([TelemetryService], (service: TelemetryService) => {
            spyOn(EkTelemetry, 'error');
            service.error(mockData.errorEventData);
            expect(EkTelemetry.error).not.toHaveBeenCalled();
        }));
    });

    describe('end event', () => {
        it('should send "end" event if service is initialised', inject([TelemetryService], (service: TelemetryService) => {
            service.initialize(mockData.telemetry);
            spyOn(EkTelemetry, 'end');
            service.end(mockData.endEventData);
            expect(EkTelemetry.end).toHaveBeenCalledTimes(1);
        }));

        it('should not send "end" event if service is not initialised', inject([TelemetryService], (service: TelemetryService) => {
            spyOn(EkTelemetry, 'end');
            service.end(mockData.endEventData);
            expect(EkTelemetry.end).not.toHaveBeenCalled();
        }));
    });

    describe('log event', () => {
        it('should send "log" event if service is initialised', inject([TelemetryService], (service: TelemetryService) => {
            service.initialize(mockData.telemetry);
            spyOn(EkTelemetry, 'log');
            service.log(mockData.logEventData);
            expect(EkTelemetry.log).toHaveBeenCalledTimes(1);
        }));

        it('should not send "log" event if service is not initialised', inject([TelemetryService], (service: TelemetryService) => {
            spyOn(EkTelemetry, 'log');
            service.log(mockData.logEventData);
            expect(EkTelemetry.log).not.toHaveBeenCalled();
        }));
    });
});
