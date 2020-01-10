import { of as observableOf, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentManagerComponent } from './content-manager.component';
import { ContentManagerService, ConnectionService } from '../../services';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileSizeModule } from 'ngx-filesize';
import { OrderModule } from 'ngx-order-pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule, TelemetryService, TELEMETRY_PROVIDER, IInteractEventEdata } from '@sunbird/telemetry';
import { By } from '@angular/platform-browser';
import { response } from './content-manager.component.spec.data';


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
    }, messages: {
      fmsg: { m0097: 'Something went wrong' }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModalModule, SharedModule.forRoot(), SuiProgressModule, SuiAccordionModule, HttpClientTestingModule,
        RouterTestingModule, FileSizeModule, OrderModule, TelemetryModule],
      declarations: [ContentManagerComponent],
      providers: [ContentManagerService, ConnectionService, TelemetryService, ToasterService,
        { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, { provide: ResourceService, useValue: resourceMockData }]
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

  it('should call ngOninit', () => {
    spyOn(contentManagerService, 'downloadEvent').and.returnValue(observableOf('Download started'));
    spyOn(component.apiCallSubject, 'next');
    component.ngOnInit();
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(component.isOpen).toBeTruthy();
  });

  it('should call contentManagerActions and call pause import', () => {
    spyOn(component, 'pauseImportContent');
    component.contentManagerActions('Import', 'Pause', '123');
    expect(component.pauseImportContent).toHaveBeenCalledWith('123');
  });

  it('should call contentManagerActions and call resume import', () => {
    spyOn(component, 'resumeImportContent');
    component.contentManagerActions('Import', 'Resume', '123');
    expect(component.resumeImportContent).toHaveBeenCalledWith('123');
  });

  it('should call contentManagerActions and call cancel import', () => {
    spyOn(component, 'cancelImportContent');
    component.contentManagerActions('Import', 'Cancel', '123');
    expect(component.cancelImportContent).toHaveBeenCalledWith('123');
  });

  it('should call contentManagerActions and call retry import', () => {
    spyOn(component, 'retryImportContent');
    component.contentManagerActions('Import', 'Retry', '123');
    expect(component.retryImportContent).toHaveBeenCalledWith('123');
  });

  it('should call contentManagerActions and call pause download', () => {
    spyOn(component, 'pauseDownloadContent');
    component.contentManagerActions('Download', 'Pause', '123');
    component.pauseDownloadContent('123');
    expect(component.pauseDownloadContent).toHaveBeenCalledWith('123');
  });

  it('should call contentManagerActions and call resume download', () => {
    spyOn(component, 'resumeDownloadContent');
    component.contentManagerActions('Download', 'Resume', '123');
    expect(component.resumeDownloadContent).toHaveBeenCalledWith('123');
  });

  it('should call contentManagerActions and call cancel download', () => {
    spyOn(component, 'cancelDownloadContent');
    component.contentManagerActions('Download', 'Cancel', '123');
    expect(component.cancelDownloadContent).toHaveBeenCalledWith('123');
  });

  it('should call contentManagerActions and call retry download', () => {
    spyOn(component, 'retryDownloadContent');
    component.contentManagerActions('Download', 'Retry', '123');
    expect(component.retryDownloadContent).toHaveBeenCalledWith('123');
  });

  it('should call updateLocalStatus', () => {
    component.contentResponse = response.contentResponse;
    component.updateLocalStatus(response.contentData, 'pausing');
    expect(component.contentStatusObject).toEqual(response.contentStatusObj);
  });

  it('should call getButtonsInteractData', () => {
    const res = component.getButtonsInteractData('123', 10);
    expect(JSON.stringify(res)).toEqual('{"id":"123","type":"click","extra":{"percentage":10}}');
  });

  it('should call deleteLocalContentStatus', () => {
    component.contentStatusObject = response.contentStatusObj;
    component.deleteLocalContentStatus('ceb037f9-226c-4a61-9403-1813c631e9ba');
    expect(component.contentStatusObject).toEqual({});
  });

  it('should call getContentPercentage', () => {
    component.openContent('123', 'application/vnd.ekstep.ecml-archive', 'completed');
    const res = component.getContentPercentage('30270814', '35560658');
    expect(res).toEqual(85.12444848461466);
  });

  it('should call pauseDownloadContent and get success', () => {
    spyOn(contentManagerService, 'pauseDownloadContent').and.returnValue(observableOf('Success'));
    spyOn(component.apiCallSubject, 'next');
    component.pauseDownloadContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });

  it('should call pauseDownloadContent and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.returnValue(throwError(resourceMockData.messages.fmsg.m0097));
    spyOn(contentManagerService, 'pauseDownloadContent').and.returnValue(throwError('Error'));
    spyOn(component.apiCallSubject, 'next');
    component.pauseDownloadContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call resumeDownloadContent and get success', () => {
    spyOn(contentManagerService, 'resumeDownloadContent').and.returnValue(observableOf('Success'));
    spyOn(component.apiCallSubject, 'next');
    component.resumeDownloadContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });

  it('should call resumeDownloadContent and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.returnValue(throwError(resourceMockData.messages.fmsg.m0097));
    spyOn(contentManagerService, 'resumeDownloadContent').and.returnValue(throwError('Error'));
    spyOn(component.apiCallSubject, 'next');
    component.resumeDownloadContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call cancelDownloadContent and get success', () => {
    spyOn(contentManagerService, 'cancelDownloadContent').and.returnValue(observableOf('Success'));
    spyOn(component.apiCallSubject, 'next');
    component.cancelDownloadContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });

  it('should call cancelDownloadContent and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.returnValue(throwError(resourceMockData.messages.fmsg.m0097));
    spyOn(contentManagerService, 'cancelDownloadContent').and.returnValue(throwError('Error'));
    spyOn(component.apiCallSubject, 'next');
    component.cancelDownloadContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call retryDownloadContent and get success', () => {
    spyOn(contentManagerService, 'retryDownloadContent').and.returnValue(observableOf('Success'));
    spyOn(component.apiCallSubject, 'next');
    component.retryDownloadContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });

  it('should call retryDownloadContent and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.returnValue(throwError(resourceMockData.messages.fmsg.m0097));
    spyOn(contentManagerService, 'retryDownloadContent').and.returnValue(throwError('Error'));
    spyOn(component.apiCallSubject, 'next');
    component.retryDownloadContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call pauseImportContent and get success', () => {
    spyOn(contentManagerService, 'pauseImportContent').and.returnValue(observableOf('Success'));
    spyOn(component.apiCallSubject, 'next');
    component.pauseImportContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });

  it('should call pauseImportContent and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.returnValue(throwError(resourceMockData.messages.fmsg.m0097));
    spyOn(contentManagerService, 'pauseImportContent').and.returnValue(throwError('Error'));
    spyOn(component.apiCallSubject, 'next');
    component.pauseImportContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call resumeImportContent and get success', () => {
    spyOn(contentManagerService, 'resumeImportContent').and.returnValue(observableOf('Success'));
    spyOn(component.apiCallSubject, 'next');
    component.resumeImportContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });

  it('should call resumeImportContent and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.returnValue(throwError(resourceMockData.messages.fmsg.m0097));
    spyOn(contentManagerService, 'resumeImportContent').and.returnValue(throwError('Error'));
    spyOn(component.apiCallSubject, 'next');
    component.resumeImportContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call cancelImportContent and get success', () => {
    spyOn(contentManagerService, 'cancelImportContent').and.returnValue(observableOf('Success'));
    spyOn(component.apiCallSubject, 'next');
    component.cancelImportContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });

  it('should call cancelImportContent and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.returnValue(throwError(resourceMockData.messages.fmsg.m0097));
    spyOn(contentManagerService, 'cancelImportContent').and.returnValue(throwError('Error'));
    spyOn(component.apiCallSubject, 'next');
    component.cancelImportContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('should call retryImportContent and get success', () => {
    spyOn(contentManagerService, 'retryImportContent').and.returnValue(observableOf('Success'));
    spyOn(component.apiCallSubject, 'next');
    component.retryImportContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
  });

  it('should call retryImportContent and get error', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.returnValue(throwError(resourceMockData.messages.fmsg.m0097));
    spyOn(contentManagerService, 'retryImportContent').and.returnValue(throwError('Error'));
    spyOn(component.apiCallSubject, 'next');
    component.retryImportContent('123');
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

});

