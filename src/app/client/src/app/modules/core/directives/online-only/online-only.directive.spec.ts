import { Directive,ElementRef,HostListener,Input,OnDestroy,OnInit,Renderer2 } from '@angular/core';
import { ConnectionService,ResourceService,ToasterService } from '@sunbird/shared';
import { _ } from 'lodash-es';
import { of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnlineOnlyDirective } from './online-only.directive';

describe('OnlineOnlyDirective', () => {
    let component: OnlineOnlyDirective;

    const el :Partial<ElementRef> ={};
	const connectionService :Partial<ConnectionService> ={
        monitor: jest.fn(() => of(true))
    };
	const renderer :Partial<Renderer2> ={};
	const toastService :Partial<ToasterService> ={
        error: jest.fn()
    };
	const resourceService :Partial<ResourceService> ={
        frmelmnts:{
            lbl: {
                offline:'You are offline'
            }
        }
    };

    beforeAll(() => {
        component = new OnlineOnlyDirective(
            el as ElementRef,
			connectionService as ConnectionService,
			renderer as Renderer2,
			toastService as ToasterService,
			resourceService as ResourceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should call the method enableElement to be called', () => {
        renderer.removeAttribute = jest.fn();
        renderer.removeClass = jest.fn();
        component['enableElement']();
        expect(renderer.removeAttribute).toBeCalled();
        expect(renderer.removeClass).toBeCalled();
    });
    it('should call the method disableElement to be called', () => {
        renderer.setAttribute = jest.fn();
        renderer.addClass = jest.fn();
        component['disableElement']();
        expect(renderer.setAttribute).toBeCalled();
        expect(renderer.addClass).toBeCalled();
    });
    it('should call the method showAlertMessage to be called', () => {
        component['showAlertMessage']();
        expect(toastService.error).toBeCalledWith(resourceService.frmelmnts.lbl.offline);
    });
    it('should call the method ngOnInit to be called', () => {
        connectionService.monitor = jest.fn().mockReturnValue(of(true));
        component.ngOnInit();
        expect(component['isConnected']).toBeTruthy();
    });
    it('should call the method ngOnInit to be called with false', () => {
        connectionService.monitor = jest.fn().mockReturnValue(of(false));
        component.ngOnInit();
        expect(component['isConnected']).toBeFalsy();
    });
    it('should call the method onClick to be called', () => {
        let ev = {
            preventDefault:jest.fn(),
            stopPropagation:jest.fn()
        }
        component.showWarningMessage = true;
        component.onClick(ev);
        expect(toastService.error).toBeCalledWith(resourceService.frmelmnts.lbl.offline);
    });
    describe("ngOnDestroy", () => {
        it('should destroy sub', () => {
            component.unsubscribe$ = {
                next: jest.fn(),
                complete: jest.fn()
            } as any;
            component.ngOnDestroy();
            expect(component.unsubscribe$.next).toHaveBeenCalled();
            expect(component.unsubscribe$.complete).toHaveBeenCalled();
        });
    });
});