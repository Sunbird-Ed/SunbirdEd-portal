 import { TestBed } from '@angular/core/testing';

 import { ConnectionService } from './connection.service';
 import {of as observableOf } from 'rxjs';

 describe('ConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({

  }));

   it('to make the connection status true', () => {
    const service: ConnectionService = TestBed.get(ConnectionService);
    expect(service).toBeTruthy();
    const mockConnectionStatus = true;
    const mockObservable = observableOf(mockConnectionStatus);
    spyOn(service, 'monitor').and.returnValue(mockObservable);
    service.monitor().subscribe(connectionMonitor => {
      expect(connectionMonitor).toBe(mockConnectionStatus);
    });
  });
  it('to make the connection status false ', () => {
    const service: ConnectionService = TestBed.get(ConnectionService);
    const mockConnectionStatus = false;
    const mockObservable = observableOf(mockConnectionStatus);
    spyOn(service, 'monitor').and.returnValue(mockObservable);
    service.monitor().subscribe(connectionMonitor => {
      expect(connectionMonitor).toBe(mockConnectionStatus);
    });
  });
});
