import { TestBed, inject } from '@angular/core/testing';
import { TelemetryService, TELEMETRY_PROVIDER } from './telemetry.service';
import * as mockData from './telemetry.service.spec.data';

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
});
