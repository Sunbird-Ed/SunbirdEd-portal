import { TelemetryInteractDirective } from './telemetry-interact.directive';
import { IStartEventInput } from '../../interfaces';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../services';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {  ElementRef } from '@angular/core';
import {eventData} from './telemetry-interact.directive.spec.data';
import { Observable } from 'rxjs/Observable';
describe('TelemetryStartDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelemetryInteractDirective],
      providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}]
    });
  });
  it('should create an instance', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryInteractDirective(telemetryService);
    expect(directive).toBeTruthy();
  });
  it('should take input', () => {
    const telemetryService = TestBed.get(TelemetryService);
    const directive = new TelemetryInteractDirective(telemetryService);
    spyOn(telemetryService, 'interact').and.callFake(() => Observable.of(eventData.inputData));
    directive.ngOnChanges();
    directive.appTelemetryInteract = eventData.inputData;
    expect(directive.appTelemetryInteract).toBeDefined();
    expect(directive.appTelemetryInteract).toBe(eventData.inputData);
    expect(telemetryService.interact).toHaveBeenCalled();
  });
});
