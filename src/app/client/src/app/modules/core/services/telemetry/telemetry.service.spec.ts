import { TestBed, inject } from '@angular/core/testing';
import { TelemetryService } from './telemetry.service';
import * as mockData from './telemetry.service.spec.data';

describe('TelemetryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [TelemetryService]
        });
    });

    it('should be created', inject([TelemetryService], (service: TelemetryService) => {
        expect(service).toBeTruthy();
    }));
});
