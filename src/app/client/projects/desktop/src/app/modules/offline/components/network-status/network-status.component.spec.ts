import { CacheService } from 'ng2-cache-service';
import { HttpClient } from '@angular/common/http';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ConnectionService } from './../../services/connection-service/connection.service';
import { NetworkStatusComponent } from './network-status.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {of as observableOf } from 'rxjs';



 describe('NetworkStatusComponent', () => {
  let component: NetworkStatusComponent;
  let fixture: ComponentFixture<NetworkStatusComponent>;
  let connectionService: ConnectionService;
   beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ NetworkStatusComponent ],
      providers: [ResourceService , ConnectionService , ConfigService, CacheService , BrowserCacheTtlService]
    })
    .compileComponents();
  }));

   beforeEach(() => {
    fixture = TestBed.createComponent(NetworkStatusComponent);
    component = fixture.componentInstance;
    connectionService = TestBed.get(ConnectionService);
    fixture.detectChanges();

  });

  it('To check connection status ', () => {
    expect(component).toBeTruthy();
      expect(component.isConnected).toEqual(true);
      expect(component.status).toEqual('ONLINE');

  });
  it('to make connection status false', () => {
    expect(component).toBeTruthy();
    const mockConnectionStatus = false;
    const mockObservable = observableOf(mockConnectionStatus);
    const spy = spyOn(connectionService, 'monitor').and.returnValue(mockObservable);
    connectionService.monitor().subscribe(connectionMonitor => {
      expect(connectionMonitor).toBe(mockConnectionStatus);
    });
    component.ngOnInit();
    component.isConnected = mockConnectionStatus;
    expect(component.isConnected).toBeFalsy();
    expect(component.status).toBe('OFFLINE');
  });
});
