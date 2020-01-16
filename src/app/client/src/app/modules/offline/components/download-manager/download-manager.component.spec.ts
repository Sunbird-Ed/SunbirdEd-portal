import { of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadManagerComponent } from './download-manager.component';
import { DownloadManagerService, ConnectionService } from '../../services';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {FileSizeModule} from 'ngx-filesize';
import { OrderModule } from 'ngx-order-pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { response } from '../../services/download-manager/download-manager.service.spec.data';
import { TelemetryModule, TelemetryService, TELEMETRY_PROVIDER, IInteractEventEdata  } from '@sunbird/telemetry';


describe('DownloadManagerComponent', () => {
  let component: DownloadManagerComponent;
  let fixture: ComponentFixture<DownloadManagerComponent>;
  let connectionService: ConnectionService;
  let downloadManagerService: DownloadManagerService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModalModule, SharedModule.forRoot(), SuiProgressModule, SuiAccordionModule, HttpClientTestingModule,
        RouterTestingModule, FileSizeModule, OrderModule, TelemetryModule ],
      declarations: [DownloadManagerComponent],
      providers: [ DownloadManagerService, ConnectionService, TelemetryService,
        { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry } ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadManagerComponent);
    component = fixture.componentInstance;
    connectionService = TestBed.get(ConnectionService);
    downloadManagerService = TestBed.get(DownloadManagerService);
    fixture.detectChanges();
  });

  it('should return proper progress value', () => {
    const progressData = component.showProgressValue(50, 100);
    expect(progressData).toBe(50);
  });

  it('should call getDownloadList method once', () => {
    spyOn(component, 'getDownloadList');
    component.ngOnInit();
    expect(component.getDownloadList).toHaveBeenCalledTimes(1);
  });

  it('should  call getDownloadList method twice when the connection status changes', () => {
    const mockConnectionStatus = false;
    const mockObservable = observableOf(mockConnectionStatus);
    const spy = spyOn(connectionService, 'monitor').and.returnValue(mockObservable);
    const componentMethod =  spyOn(component, 'getDownloadList').and.callThrough();
    const serviceMethod =  spyOn(downloadManagerService, 'getDownloadList').and.callThrough();
    connectionService.monitor().subscribe(connectionMonitor => {
      expect(connectionMonitor).toBe(mockConnectionStatus);
    });
    component.ngOnInit();
    component.isConnected = mockConnectionStatus;
    expect(serviceMethod).toHaveBeenCalledTimes(2);
    expect(componentMethod).toHaveBeenCalledTimes(2);
    });

  it('should go to downloadManager service and call getDownloadList method', () => {
    downloadManagerService = TestBed.get(DownloadManagerService);
   const componentMethod =  spyOn(component, 'getDownloadList').and.callThrough();
   const serviceMethod =  spyOn(downloadManagerService, 'getDownloadList').and.callThrough();
    component.ngOnInit();
    expect(serviceMethod).toHaveBeenCalledTimes(1);
    expect(componentMethod).toHaveBeenCalledTimes(1);
  });

  it('should go to downloadManager service and call getDownloadList method', () => {
    downloadManagerService = TestBed.get(DownloadManagerService);
   const componentMethod =  spyOn(component, 'getDownloadList').and.callThrough();
   const serviceMethod =  spyOn(downloadManagerService, 'getDownloadList').and.callThrough();
    component.ngOnInit();
    expect(serviceMethod).toHaveBeenCalledTimes(1);
    expect(componentMethod).toHaveBeenCalledTimes(1);
  });

   it('should not route getDownloadListUsingTimer', () => {
    const mockData = response.downloadListStatus;
    const mockObservableData = observableOf(mockData);
    spyOn(downloadManagerService, 'getDownloadList').and.returnValue(mockObservableData);
    downloadManagerService.getDownloadList().subscribe(responseData => {
        expect(responseData).toBe(mockData);
        component.downloadResponse = responseData;
        component.localCount = responseData.result.response.downloads.inprogress.length +
                               responseData.result.response.downloads.submitted.length ;
        expect(component.localCount).toBe(0);
        expect(component.downloadResponse).toBe(mockData);
        const privateMethod = spyOn<any>(component, 'getDownloadListUsingTimer').and.callThrough();
        expect(privateMethod).not.toHaveBeenCalled();
    });
  });
});

