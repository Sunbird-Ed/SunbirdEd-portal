
import {of as observableOf } from 'rxjs';
import { TelemetryShareDirective } from './telemetry-share.directive';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed} from '@angular/core/testing';
import {eventData} from './telemetry-share.directive.spec.data';
import { ActivatedRoute } from '@angular/router';

describe('TelemetryShareDirective', () => {
  const env = 'workspace';
const fakeActivatedRoute = {
       data: {telemetry: {env: env}},
            snapshot: {
              parent: {
                url: [
                  {
                    path: 'workspace',
                  },
                  {
                    path: 'content',
                  },
                  {
                    path: 'limited-publish',
                  },
                ],
              }
            },
          };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryShareDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry},
     {provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    });
  });
  it('should take input and  generate the telemetry  share  event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const activatedRoute = TestBed.get(ActivatedRoute);
    const directive = new TelemetryShareDirective(telemetryService, activatedRoute);
    spyOn(telemetryService, 'share').and.callFake(() => observableOf(eventData.inputData));
    directive.appTelemetryShare = eventData.inputData;
    directive.ngOnInit();
    expect(directive.appTelemetryShare).toBeDefined();
    expect(directive.appTelemetryShare).toBe(eventData.inputData);
  });
});
