import { TestBed } from '@angular/core/testing';

import { ConnectionService } from './connection.service';
import { of as observableOf } from 'rxjs';
import { ToasterService, ResourceService } from '@sunbird/shared';

describe('ConnectionService', () => {
  const resourceMockData = {
    messages: {
      fmsg: { m0097: 'Something went wrong' }
    }
  };
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ToasterService, { provide: ResourceService, useValue: resourceMockData }]
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
