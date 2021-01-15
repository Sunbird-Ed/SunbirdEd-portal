import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ResourceService, ToasterService, UtilService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { of as observableOf, of } from 'rxjs';
import { ConnectionService } from './connection.service';

describe('ConnectionService', () => {
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = 'explore-course/course/do_213129030425993216112'
  }
  const resourceMockData = {
    messages: {
      fmsg: { m0097: 'Something went wrong' },
      stmsg: { desktop: { onlineStatus: 'You are online' } },
      emsg: { desktop: { onlineStatus: 'You are offline' } }
    }
  };

  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ToasterService, { provide: ResourceService, useValue: resourceMockData },
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

  it('should call notifyNetworkChange', () => {
    const service: ConnectionService = TestBed.get(ConnectionService);
    const toasterService = TestBed.get(ToasterService);
    const utilService = TestBed.get(UtilService);
    utilService._isDesktopApp = true;
    spyOn(toasterService, 'info');
    service['connectionMonitor'] = of(true);
    service.notifyNetworkChange();
    expect(toasterService.info).toHaveBeenCalledWith('You are online');
  });

  it('should navigate to my download page if network is not available', () => {
    const service: ConnectionService = TestBed.get(ConnectionService);
    const router = TestBed.get(Router);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'info');
    service['connectionMonitor'] = of(false);
    service.notifyNetworkChange();
    expect(router.navigate).toHaveBeenCalledWith(['mydownloads'], {queryParams: { selectedTab: 'mydownloads' }});
  });

});