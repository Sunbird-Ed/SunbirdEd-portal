import { Component,OnInit,OnDestroy } from '@angular/core';
import { ResourceService,ConnectionService } from '../../services';
import { takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { NetworkStatusComponent } from './network-status.component';

describe('NetworkStatusComponent', () => {
    let component: NetworkStatusComponent;

    const resourceService :Partial<ResourceService> ={};
    const isConnectedSubject = new Subject<boolean>();
	const connectionService :Partial<ConnectionService> ={
        monitor: jest.fn().mockReturnValue(isConnectedSubject.asObservable())
    } as any;

    beforeAll(() => {
        component = new NetworkStatusComponent(
            resourceService as ResourceService,
			connectionService as ConnectionService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should create a instance of component and call the ngOnInit', () => {
        connectionService.monitor = jest.fn(() => of(true))
        component.ngOnInit();
        console.log(component.isConnected);
        expect(component.isConnected).toBeTruthy();
    });
    it('should unsubscribe from observables on ngOnDestroy', () => {
        const unsubscribeSpy = jest.spyOn(component.unsubscribe$, 'next');
        const unsubscribeCompleteSpy = jest.spyOn(component.unsubscribe$, 'complete');
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
        expect(unsubscribeCompleteSpy).toHaveBeenCalled();
    });
});