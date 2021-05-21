import { of as observableOf, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentManagerComponent } from './content-manager.component';
import { ContentManagerService, ElectronDialogService } from '../../services';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileSizeModule } from 'ngx-filesize';
import { OrderModule } from 'ngx-order-pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule, TelemetryService, TELEMETRY_PROVIDER, IInteractEventEdata } from '@sunbird/telemetry';
import { response } from './content-manager.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../../core/services/user/user.service';


describe('ContentManagerComponent', () => {
  let component: ContentManagerComponent;
  let fixture: ComponentFixture<ContentManagerComponent>;
  let contentManagerService: ContentManagerService;

  const resourceMockData = {
    frmelmnts: {
      lbl: {
        noDownloads: 'No Downloads Available'
      }
    },
    messages: {
      fmsg: { m0097: 'Something went wrong' },
      stmsg: { contentLocationChanged: 'Content location changed successfully, try to download content now.' }
    }
  };

  class FakeActivatedRoute {
    snapshot = {
      data: {
        telemetry: { env: 'browse', pageid: 'browse' }
      }
    };
  }

  class FakeUserService {
    loggedIn: true;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModalModule, SharedModule.forRoot(), SuiProgressModule, SuiAccordionModule, HttpClientTestingModule,
        RouterTestingModule, FileSizeModule, OrderModule, TelemetryModule],
      declarations: [ContentManagerComponent],
      providers: [
        ContentManagerService, TelemetryService, ToasterService, ElectronDialogService,
        { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },
        { provide: ResourceService, useValue: resourceMockData },
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        {provide: UserService, useClass: FakeUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentManagerComponent);
    component = fixture.componentInstance;
    contentManagerService = TestBed.get(ContentManagerService);
    fixture.detectChanges();
  });

  it('should call ngOnInit', () => {
    const windowsDrives = [
      { fs: 'C:', size: 1212121212121, used: 1212121212120 },
      { fs: 'D:', size: 1212121212121, used: 1212121212120 },
      { fs: 'E:', size: 4592323023202, used: 1212121212120 }];

    // To test event emitter subscribe
    const contentService = fixture.debugElement.injector.get(ContentManagerService);
    contentService.downloadFailEvent.emit({
      failedContentName: 'testContentName',
      isWindows: true,
      drives: windowsDrives
    });
    spyOn(contentService, 'downloadEvent').and.returnValue(observableOf('Download started'));
    spyOn(component.apiCallSubject, 'next');
    component.unHandledFailedList = [];
    component.ngOnInit();
    expect(component.apiCallSubject.next).toHaveBeenCalled();
    expect(component.isOpen).toBeTruthy();
    expect(component.isWindows).toBeDefined();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isWindows).toBe(true);
      expect(component.unHandledFailedList).toEqual([{ name: 'testContentName' }]);
    });
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
    expect(component.contentStatusObject['ceb037f9-226c-4a61-9403-1813c631e9ba'].currentStatus).toEqual('pausing');
  });

  it('should call getButtonsInteractData', () => {
    const res = component.getButtonsInteractData('123', 10);
    expect(JSON.stringify(res)).toEqual('{"id":"123","type":"click","pageid":"browse","extra":{"percentage":10}}');
  });

  it('should call deleteLocalContentStatus', () => {
    component.contentStatusObject = response.contentStatusObj;
    component.deleteLocalContentStatus('ceb037f9-226c-4a61-9403-1813c631e9ba');
    expect(component.contentStatusObject).toEqual({});
  });

  it('should call getContentPercentage', () => {
    const data = {
      contentId: '123',
      mimeType: 'application/vnd.ekstep.ecml-archive',
      status: 'completed'
    };
    component.openContent(data);
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
  it('should call handleInsufficientMemoryError show failed contents in popup', async () => {
    const popupInfo = {
      failedContentName: response.listToShow,
      isWindows: true
    };
    contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'getSuggestedDrive').and.returnValue(popupInfo);
    component.handledFailedList = [];
    await component.handleInsufficientMemoryError(response.allContentList);
    expect(component.unHandledFailedList).toBeTruthy();
  });
  it('should call handleInsufficientMemoryError show failed contents in popup when difference is not empty', () => {
    spyOn(contentManagerService, 'getSuggestedDrive').and.returnValue(response.popupInfo);
    component.handledFailedList = response.previousList;
    component.handleInsufficientMemoryError(response.allContentList);
    expect(component.unHandledFailedList).toBeTruthy();
  });
  it('should call handleInsufficientMemoryError and no contents to show in pop up when difference is empty ', () => {
    component.unHandledFailedList = [];
    component.handledFailedList = response.failedList;
    component.handleInsufficientMemoryError(response.allContentList);
    expect(component.unHandledFailedList).toEqual([]);
  });
  it('should call handleInsufficientMemoryError and no contents to show in pop up when all contents list is empty', () => {
    component.handledFailedList = [];
    component.handleInsufficientMemoryError([]);
    expect(component.unHandledFailedList).toEqual([]);
  });
  it('should call close modal ', () => {
    component.handledFailedList = response.failedList;
    contentManagerService = TestBed.get(ContentManagerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    component.isWindows = true;
    spyOn(contentManagerService, 'changeContentLocation').and.returnValue(observableOf({}));
    spyOn(toasterService, 'success').and.returnValue(resourceMockData.messages.stmsg.contentLocationChanged);
    const event = {
      selectedDrive: {
        name: 'D:',
        label: 'D: (Recommended)',
        isRecommended: true,
        isCurrentContentLocation: false
      }
    };

    const req = {
      request: {
        path: event.selectedDrive.name
      }
    };
    component.closeModal(event);
    expect(component.unHandledFailedList).toEqual([]);
    expect(component.isWindows).toBe(false);
    expect(contentManagerService.changeContentLocation).toHaveBeenCalledWith(req);
    expect(resourceService.messages.stmsg.contentLocationChanged)
      .toEqual('Content location changed successfully, try to download content now.');
    expect(toasterService.success).toHaveBeenCalledWith('Content location changed successfully, try to download content now.');
  });

  it('should call close modal, should handle error ', () => {
    component.handledFailedList = response.failedList;
    contentManagerService = TestBed.get(ContentManagerService);
    const toasterService = TestBed.get(ToasterService);
    component.isWindows = true;
    spyOn(contentManagerService, 'changeContentLocation').and.returnValue(throwError({}));
    spyOn(toasterService, 'error').and.returnValue(resourceMockData.messages.stmsg.contentLocationChanged);
    const event = {
      selectedDrive: {
        name: 'D:',
        label: 'D: (Recommended)',
        isRecommended: true,
        isCurrentContentLocation: false
      }
    };

    const req = {
      request: {
        path: event.selectedDrive.name
      }
    };
    component.closeModal(event);
    expect(component.unHandledFailedList).toEqual([]);
    expect(component.isWindows).toBe(false);
    expect(toasterService.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('getContentStatus should return extract', () => {
    const data = component.getContentStatus(response.contentResponse2[3].contentDownloadList);
    expect(data).toBe('extract');
  });

  it('getContentStatus should return undefined', () => {
    const data = component.getContentStatus(response.contentResponse2[0].contentDownloadList);
    expect(data).toBeUndefined();
  });

  it('getContentStatus should return undefined', () => {
    const data = component.getContentStatus(response.contentResponse2[1].contentDownloadList);
    expect(data).toBeUndefined();
  });

  it('getContentStatus should return undefined', () => {
    const data = component.getContentStatus(response.contentResponse2[2].contentDownloadList);
    expect(data).toBeUndefined();
  });

  it('should call logTelemetry', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'log');
    component.logTelemetry(response.logInputData);
    expect(telemetryService.log).toHaveBeenCalled();
  });

  it('should hide content manger when player is fullscreen mode for desktop', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    component.ngOnInit();
    navigationHelperService.handleCMvisibility.emit(true);
    expect(component.visibility).toBeFalsy();
  });

  it('should show content manger when player exit from fullscreen mode for desktop', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    component.ngOnInit();
    navigationHelperService.handleCMvisibility.emit(false);
    expect(component.visibility).toBeTruthy();
  });
});

