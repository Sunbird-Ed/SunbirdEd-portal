import { TelemetryEventsDirective } from './telemetry-events.directive';
import { TelemetryService } from '@sunbird/telemetry';
import { UtilService, ResourceService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { TestBed } from '@angular/core/testing';
import { ElementRef, Renderer2 } from '@angular/core';
import { of } from 'rxjs';

describe('TelemetryEventsDirective', () => {
  let telDirective: TelemetryEventsDirective;

  configureTestSuite();
  const renderer2Stub = { listen: () => ({}),  setStyle: () => ({}) };

  const telemetryEventMock = {'eid': 'ERROR', 'ets': 1594271968355, 'ver': '3.0', 'mid': 'INTERACT:2bc0d36dcd4721df6639d213a66c5077', 'actor': {'id': 'c1526b161339fe4fc544be6b78f2ae66', 'type': 'User'}, 'context': {'channel': '0123166374296453124', 'pdata': {'id': 'dev.sunbird.portal', 'ver': '3.1.0', 'pid': 'sunbird-portal'}, 'env': 'groups', 'sid': 'ce3e4e47-1041-9ced-27fd-bb7e7f6c6b49', 'did': 'c1526b161339fe4fc544be6b78f2ae66', 'cdata': [{'id': 'Desktop', 'type': 'Device'}], 'rollup': {'l1': '0123166374296453124'}}, 'object': {}, 'tags': ['0123166374296453124'], 'edata': {'err': 'PBK-CRT01', 'errType': 'Invalid data', 'traceid': 'rs3e4e47-1041-9ced-27fd-bb7e7f6c56bc', 'stacktrace': 'Error: Unkknown error at server.js'}};
  const resourceBundleStub = { };

  const elementRefStub = {
    nativeElement: {
      'lang': 'en',
      'dir': 'ltr',
      style: {
        display: 'none'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ],
      providers: [
        TelemetryEventsDirective,
        TelemetryService,
        UtilService,
        { provide: Renderer2, useValue: renderer2Stub },
        { provide: ResourceService, useValue: resourceBundleStub },
        { provide: ElementRef, useValue: elementRefStub }
      ]
    });
    telDirective = TestBed.get(TelemetryEventsDirective);
  });

  it('should create an instance', () => {
    expect(telDirective).toBeTruthy();
  });

  it('should hide button by default on load', () => {
    spyOn(telDirective, 'showOrHideElement').and.callThrough();
    telDirective.ngOnInit();
    expect(telDirective.showOrHideElement).toHaveBeenCalledWith(false);
    // expect(telDirective.unlistenTelemetryEventShow).not.toBeUndefined();
  });

  it('should handle document event to show/hide button', () => {
    spyOn(telDirective, 'showOrHideElement').and.callThrough();
    telDirective.showTelemetryOption({'detail': {'show': true}});
    // document.dispatchEvent(new CustomEvent('TelemetryEvent:show', {detail: {show: true}}));
    expect(telDirective.showOrHideElement).toHaveBeenCalledWith(true);

    telDirective.showTelemetryOption({'detail': {'show': false}});
    // document.dispatchEvent(new CustomEvent('TelemetryEvent:show', {detail: {show: true}}));
    expect(telDirective.showOrHideElement).toHaveBeenCalledWith(false);

  });

  it('should add the ERROR telemetry event to the telemetry events array', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'telemetryEvents');
    telemetryService.telemetryEvents = [];
    telDirective.telemetryEventHandler({'detail': telemetryEventMock});
    expect(telemetryService.telemetryEvents.length).toEqual(1);
  });

  it('should avoid duplicate telemetry events to the telemetry events array', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'telemetryEvents');
    telemetryService.telemetryEvents = [];

    // Adding 2 error events with same mid
    telDirective.telemetryEventHandler({'detail': telemetryEventMock});
    telDirective.telemetryEventHandler({'detail': telemetryEventMock});

    expect(telemetryService.telemetryEvents.length).toEqual(1);
  });

  it('should append ERROR telemetry events to the telemetry events array', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'telemetryEvents');
    telemetryService.telemetryEvents = [];

    const errorEvent = telemetryEventMock;
    // Adding 1st error event
    telDirective.telemetryEventHandler({'detail': errorEvent});

    // Adding 2nd error event
    errorEvent.mid = 'changed-mid';
    telDirective.telemetryEventHandler({'detail': errorEvent});

    expect(telemetryService.telemetryEvents.length).toEqual(2);
  });

  it('should ignore any other telemetry events other than ERROR event', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'telemetryEvents');
    telemetryService.telemetryEvents = [];
    const interactEvent = telemetryEventMock;

    // Changing the eid, it should not add
    interactEvent.eid = 'LOG';
    telDirective.telemetryEventHandler({'detail': telemetryEventMock});
    expect(telemetryService.telemetryEvents.length).toEqual(0);
  });

  it('should destroy all listeners component close',  () => {
    telDirective.unlistenTelemetryEvent = function() {};
    telDirective.unlistenTelemetryEventShow = function() {};
    spyOn(telDirective, 'unlistenTelemetryEvent').and.callThrough();
    spyOn(telDirective, 'unlistenTelemetryEventShow').and.callThrough();

    telDirective.ngOnDestroy();
    expect(telDirective.unlistenTelemetryEvent).toHaveBeenCalled();
    expect(telDirective.unlistenTelemetryEventShow).toHaveBeenCalled();
  });
});
