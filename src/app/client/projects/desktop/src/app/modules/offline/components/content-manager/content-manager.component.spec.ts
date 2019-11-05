import { of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentManagerComponent } from './content-manager.component';
import { ContentManagerService, ConnectionService } from '../../services';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {FileSizeModule} from 'ngx-filesize';
import { OrderModule } from 'ngx-order-pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { response } from '../../services/content-manager/content-manager.service.spec.data';
import { TelemetryModule, TelemetryService, TELEMETRY_PROVIDER, IInteractEventEdata  } from '@sunbird/telemetry';
import { By } from '@angular/platform-browser';



describe('ContentManagerComponent', () => {
  let component: ContentManagerComponent;
  let fixture: ComponentFixture<ContentManagerComponent>;
  let connectionService: ConnectionService;
  let contentManagerService: ContentManagerService;

  const resourceMockData = {
    frmelmnts: {
      lbl: {
        noDownloads: 'No Downloads Available'
      }
  }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModalModule, SharedModule.forRoot(), SuiProgressModule, SuiAccordionModule, HttpClientTestingModule,
        RouterTestingModule, FileSizeModule, OrderModule, TelemetryModule ],
      declarations: [ContentManagerComponent],
      providers: [ ContentManagerService, ConnectionService, TelemetryService,
        { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, {provide: ResourceService, useValue: resourceMockData} ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentManagerComponent);
    component = fixture.componentInstance;
    connectionService = TestBed.get(ConnectionService);
    contentManagerService = TestBed.get(ContentManagerService);
    fixture.detectChanges();
  });

  it('should return proper progress value', () => {
    const progressData = component.showProgressValue(50, 100);
    expect(progressData).toBe(50);
  });

  it('should call getContentList method once', () => {
    spyOn(component, 'getContentList');
    component.ngOnInit();
    expect(component.getContentList).toHaveBeenCalledTimes(1);
  });

  it('should  call getContentList method twice when the connection status changes', () => {
    const mockConnectionStatus = false;
    const mockObservable = observableOf(mockConnectionStatus);
    const spy = spyOn(connectionService, 'monitor').and.returnValue(mockObservable);
    const componentMethod =  spyOn(component, 'getContentList').and.callThrough();
    const serviceMethod =  spyOn(contentManagerService, 'getContentList').and.callThrough();
    connectionService.monitor().subscribe(connectionMonitor => {
      expect(connectionMonitor).toBe(mockConnectionStatus);
    });
    component.ngOnInit();
    component.isConnected = mockConnectionStatus;
    expect(serviceMethod).toHaveBeenCalledTimes(2);
    expect(componentMethod).toHaveBeenCalledTimes(2);
    });

  it('should go to contentManager service and call getContentList method', () => {
    contentManagerService = TestBed.get(ContentManagerService);
   const componentMethod =  spyOn(component, 'getContentList').and.callThrough();
   const serviceMethod =  spyOn(contentManagerService, 'getContentList').and.callThrough();
    component.ngOnInit();
    expect(serviceMethod).toHaveBeenCalledTimes(1);
    expect(componentMethod).toHaveBeenCalledTimes(1);
  });

  it('should go to contentManager service and call getContentList method', () => {
    contentManagerService = TestBed.get(ContentManagerService);
   const componentMethod =  spyOn(component, 'getContentList').and.callThrough();
   const serviceMethod =  spyOn(contentManagerService, 'getContentList').and.callThrough();
    component.ngOnInit();
    expect(serviceMethod).toHaveBeenCalledTimes(1);
    expect(componentMethod).toHaveBeenCalledTimes(1);
  });

   it('should not route getContentListUsingTimer', () => {
    const mockData = response.downloadListStatus;
    const mockObservableData = observableOf(mockData);
    spyOn(contentManagerService, 'getContentList').and.returnValue(mockObservableData);
    contentManagerService.getContentList().subscribe(responseData => {
        expect(responseData).toBe(mockData);
        component.contentResponse = responseData;
        component.localCount = responseData.result.response.downloads.inprogress.length +
                               responseData.result.response.downloads.submitted.length ;
        expect(component.localCount).toBe(0);
        expect(component.contentResponse).toBe(mockData);
        const privateMethod = spyOn<any>(component, 'getContentListUsingTimer').and.callThrough();
        expect(privateMethod).not.toHaveBeenCalled();
    });
  });

  it('should show No Downloads available label', () => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.frmelmnts = resourceMockData.frmelmnts;
    component.contentResponse = { inprogress : [], submitted: [], failed: [], completed: []};
    fixture.detectChanges();
    const compiled = fixture.debugElement.query(By.css('.no-downloads'));
    expect(compiled.nativeElement.textContent).toBe(resourceMockData.frmelmnts.lbl.noDownloads);
  });
});

