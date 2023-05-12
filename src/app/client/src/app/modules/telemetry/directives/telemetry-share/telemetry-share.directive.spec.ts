import { of as observableOf } from 'rxjs';
import { TelemetryShareDirective } from './telemetry-share.directive';
import { TelemetryService } from '../../services';
import { eventData } from './telemetry-share.directive.spec.data';
import { ActivatedRoute } from '@angular/router';
describe('TelemetryShareDirective', () => {
    const env = 'workspace';

    let directive: TelemetryShareDirective;
    const telemetryService: Partial<TelemetryService> = {
        share: jest.fn()
    };
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            data: {
                telemetry: {
                    env: 'course', pageid: 'signup', uri: '/signup',
                    type: 'view', mode: 'self', uuid: 'hadfisgefkjsdvv'
                }
            }
        } as any,
    };

    beforeEach(() => {
        directive = new TelemetryShareDirective(
            telemetryService as TelemetryService,
            mockActivatedRoute as ActivatedRoute
        )
    });

    it('should take input and  generate the telemetry  share  event', () => {
        jest.spyOn(telemetryService, 'share').mockImplementation(() => observableOf(eventData.inputData));
        directive.TelemetryShareEdata = eventData.inputData.edata;
        directive.appTelemetryShare = eventData.inputData;
        directive.ngOnInit();
        expect(directive.appTelemetryShare).toBeDefined();
    });
});