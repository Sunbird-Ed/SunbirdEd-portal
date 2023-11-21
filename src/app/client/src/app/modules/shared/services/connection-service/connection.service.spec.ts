import { Injectable } from '@angular/core';
import { UtilService } from '../../services/util/util.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConnectionService } from './connection.service';

describe('ConnectionService', () => {
    let connectionService: ConnectionService;
    const mockRouter = {} as any;
    const mockUtilService = {} as any;

    beforeAll(() => {
        connectionService = new ConnectionService(
            mockRouter, mockUtilService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of connectionService', () => {
        expect(connectionService).toBeTruthy();
    });

    it('should have a monitor method that returns an Observable<boolean>', () => {
        expect(connectionService.monitor()).toBeInstanceOf(Observable);
    });
    
    it('should emit true when online event is triggered', (done) => {
        let doneCalled = false;
        connectionService.monitor().subscribe((value) => {
            if (value === true && !doneCalled) {
                expect(value).toBe(true);
                done();
                doneCalled = true;
            }
        });
        window.dispatchEvent(new Event('online'));
    });


    it('should emit true when offline event is triggered', (done) => {
        let doneCalled = false;
        connectionService.monitor().subscribe((value) => {
            if (value === true && !doneCalled) {
                expect(value).toBe(true);
                done();
                doneCalled = true;
            }
        });
        window.dispatchEvent(new Event('offline'));
    });
    
    it('should initially emit the online status', (done) => {
        let doneCalled = false;
        connectionService.monitor().subscribe((value) => {
            if (value === true && !doneCalled) {
              expect(value).toBe(navigator.onLine);
              done();
              doneCalled = true;
            }
        });
    });
});