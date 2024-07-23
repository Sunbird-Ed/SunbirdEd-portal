
import { Directive,OnInit,ElementRef,Renderer2,OnDestroy } from '@angular/core';
import { TelemetryService } from '../../../telemetry/services/telemetry/telemetry.service';
import { UtilService } from '../../services/util/util.service';
import { TelemetryEventsDirective } from './telemetry-events.directive';

describe('TelemetryEventsDirective', () => {
    let component: TelemetryEventsDirective;

    const elementRef :Partial<ElementRef> ={};
	const telemetryService :Partial<TelemetryService> ={};
	const utilService :Partial<UtilService> ={
        flattenObject: jest.fn(),
    };
	const renderer2 :Partial<Renderer2> ={
        listen: jest.fn(),
        setStyle: jest.fn()
    };

    beforeAll(() => {
        component = new TelemetryEventsDirective(
            elementRef as ElementRef,
			telemetryService as TelemetryService,
			utilService as UtilService,
			renderer2 as Renderer2
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should listen for TelemetryEvent:show and TelemetryEvent events and call corresponding methods', () => {
        const showTelemetryOptionSpy = jest.spyOn(component, 'showTelemetryOption');
        const telemetryEventHandlerSpy = jest.spyOn(component, 'telemetryEventHandler');
        component.ngOnInit();

        expect(renderer2.listen).toHaveBeenCalledWith('document', 'TelemetryEvent:show', expect.any(Function));
        expect(renderer2.listen).toHaveBeenCalledWith('document', 'TelemetryEvent', expect.any(Function));
        expect(showTelemetryOptionSpy).not.toHaveBeenCalled();
        expect(telemetryEventHandlerSpy).not.toHaveBeenCalled();

        const showEventCallback = (renderer2.listen as jest.Mock).mock.calls[0][2];
        const telemetryEventCallback = (renderer2.listen as jest.Mock).mock.calls[1][2];

        showEventCallback({} as Event);
        expect(showTelemetryOptionSpy).toHaveBeenCalled();
        telemetryEventCallback({} as Event);
        expect(telemetryEventHandlerSpy).toHaveBeenCalled();
    });

    it('should call unlistenTelemetryEvent and unlistenTelemetryEventShow', () => {
        const unlistenTelemetryEventShowMock = jest.fn();
        const unlistenTelemetryEventMock = jest.fn();
        component.unlistenTelemetryEventShow = unlistenTelemetryEventShowMock;
        component.unlistenTelemetryEvent = unlistenTelemetryEventMock;
        component.ngOnDestroy();
        expect(unlistenTelemetryEventShowMock).toHaveBeenCalled();
        expect(unlistenTelemetryEventMock).toHaveBeenCalled();
    });

});