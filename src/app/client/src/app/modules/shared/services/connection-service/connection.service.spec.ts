import { TestBed } from '@angular/core/testing';
import { ConnectionService } from './connection.service';
import { of as observableOf, of } from 'rxjs';
import { ToasterService, ResourceService, UtilService } from '@sunbird/shared';
import { Router } from '@angular/router';

describe('ConnectionService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = 'explore-course/course/do_213129030425993216112';
  }
  const resourceMockData = {
    messages: {
      fmsg: { m0097: 'Something went wrong' },
      stmsg: { desktop: { onlineStatus: 'You are online' } },
      emsg: { desktop: { onlineStatus: 'You are offline' } }
    }
  };
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: ResourceService, useValue: resourceMockData },
      { provide: Router, useClass: RouterStub }, UtilService]
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

  it('should call monitor', () => {
    const service: ConnectionService = TestBed.get(ConnectionService);
    service['connectionMonitor'] = of(true);
    const monitor = service.monitor();
    monitor.subscribe((data) => {
      expect(data).toBe(true);
    });
  });
});
