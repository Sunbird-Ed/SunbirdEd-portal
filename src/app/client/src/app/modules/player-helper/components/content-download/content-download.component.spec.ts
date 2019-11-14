import { PublicPlayerService } from '@sunbird/public';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { serverRes } from './content-download.component.spec.data';
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { RouterTestingModule,  } from '@angular/router/testing';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ConfigService, BrowserCacheTtlService, UtilService,
  ToasterService, NavigationHelperService, SharedModule, OfflineCardService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentDownloadComponent } from './content-download.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContentDownloadComponent', () => {
  let component: ContentDownloadComponent;
  let fixture: ComponentFixture<ContentDownloadComponent>;

  const RouterStub =  {
    navigate: jasmine.createSpy('navigate')
  };

  const fakeActivatedRoute = {
    snapshot: { data: { telemetry: { pageid: 'browse' } } }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentDownloadComponent ],
      imports: [TelemetryModule, HttpClientModule, RouterTestingModule, HttpClientTestingModule],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, UtilService,
        ToasterService, NavigationHelperService,
        { provide: Router, useValue: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute } ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDownloadComponent);
    component = fixture.componentInstance;
  });

  it('should call setTelemetry() on ngOnInit', () => {
    expect(component).toBeTruthy();
    component.contentData = serverRes.result.result.content;
    const resourceService = TestBed.get(ResourceService);
    resourceService.frmelmnts = serverRes.resourceServiceMockData.frmelmnts;
    spyOn(component, 'setTelemetryData');
    component.ngOnInit();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should Initialize telemetry data on call of setTelemetry()', () => {
    const edata = {
      id: '',
      type: '',
      pageid: ''
    };
    component.downloadContentInteractEdata = edata;
    component.contentData = serverRes.result.result.content;
    component.setTelemetryData();
    expect(component.downloadContentInteractEdata).toBeDefined();
  });

  it('should call content manager service on startDownload()', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = serverRes.resourceServiceMockData.messages;
    spyOn(contentManagerService, 'startDownload').and.returnValue(observableOf(serverRes.download_success));
    component.contentData = serverRes.result.result.content;
    component.startDownload(component.contentData);
    expect(contentManagerService.startDownload).toHaveBeenCalled();
  });

  it('startDownload should fail', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const resourceService = TestBed.get(ResourceService);
    const toasterService = TestBed.get(ToasterService);
    resourceService.messages = serverRes.resourceServiceMockData.messages;
    spyOn(contentManagerService, 'startDownload').and.returnValue(observableThrowError(serverRes.download_error));
    spyOn(toasterService, 'error').and.callThrough();
    component.startDownload(serverRes.result.result.content);
    expect(contentManagerService.startDownload).toHaveBeenCalled();
    expect(component.toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0090);
  });

  it('should call getPlayerDownloadStatus()', () => {
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'getPlayerDownloadStatus').and.returnValue(true);
    component.currentRoute = 'browse';
    component.checkStatus('DOWNLOAD');
    expect(utilService.getPlayerDownloadStatus).toHaveBeenCalled();
  });

  it('should call player updateDownloadStatus()', () => {
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'updateDownloadStatus').and.returnValue(observableOf(serverRes.downloading_content));
    component.checkDownloadStatus(serverRes.download_list);
    expect(playerService.updateDownloadStatus).toHaveBeenCalled();
  });

  it('should call offlinecardservice isyoutubecontent()', () => {
    const offlineCardService = TestBed.get(OfflineCardService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = serverRes.resourceServiceMockData.messages;
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(false);
    component.download(serverRes.result.result.content);
    expect(component.showModal).toBeFalsy();
    expect(offlineCardService.isYoutubeContent).toHaveBeenCalled();
  });

  it('should call updateContent() from contentmanager service', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.frmelmnts = serverRes.resourceServiceMockData.frmelmnts;
    resourceService.messages = serverRes.resourceServiceMockData.messages;
    spyOn(contentManagerService, 'updateContent').and.returnValue(observableOf(serverRes.content_update_success));
    component.contentData = serverRes.result.result.content;
    component.updateContent(component.contentData);
    expect(contentManagerService.updateContent).toHaveBeenCalled();
  });

  it('should throw errror on updateContent()', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.frmelmnts = serverRes.resourceServiceMockData.frmelmnts;
    resourceService.messages = serverRes.resourceServiceMockData.messages;
    component.isConnected = false;
    spyOn(contentManagerService, 'updateContent').and.returnValue(observableThrowError(serverRes.content_update_error));
    component.contentData = serverRes.result.result.content;
    component.updateContent(component.contentData);
    expect(contentManagerService.updateContent).toHaveBeenCalled();
  });

  it('should call getPlayerUpdateStatus()', () => {
    const utilService = TestBed.get(UtilService);
    spyOn(utilService, 'getPlayerUpdateStatus').and.returnValue(true);
    component.contentData = serverRes.result.result.content;
    component.currentRoute = 'library';
    component.showUpdate = true;
    component.checkUpdateStatus('UPDATE');
    expect(utilService.getPlayerUpdateStatus).toHaveBeenCalled();
  });


});
