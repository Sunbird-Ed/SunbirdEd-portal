import { ConnectionService, ContentManagerService } from './../../services';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopExploreContentComponent } from './desktop-explore-content.component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ResourceService, ToasterService, SharedModule, UtilService } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  response, hoverActionEvent, downloadList,
  contentList, appTelemetryInteractData
} from './desktop-explore-content.component.spec.data';
import { of as observableOf, throwError } from 'rxjs';
import { PublicPlayerService } from '@sunbird/public';
import { TelemetryService } from 'src/app/modules/telemetry';

describe('DesktopExploreContentComponent', () => {
  let component: DesktopExploreContentComponent;
  let fixture: ComponentFixture<DesktopExploreContentComponent>;
  const resourceBundle = {
    messages: {
      fmsg: {
        m0004: 'Fetching data failed, please try again later...',
        m0090: 'Could not download. Try again later',
        m0091: 'Enter a valid phone number'
      },
      smsg: {
        m0059: 'Content successfully copied'
      },
      stmsg: {
        m0138: 'FAILED'
      }
    }
  };
  class FakeActivatedRoute {
    snapshot = {
      data: {
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        telemetry: { env: 'browse', pageid: 'browse', type: 'view', subtype: 'paginate' }
      },
      params: { slug: 'ABC' },
      queryParams: { channel: '12345' }
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesktopExploreContentComponent],
      imports: [
        CommonConsumptionModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), HttpClientTestingModule,
        CoreModule, SharedModule.forRoot(),
      ],
      providers: [
        ContentManagerService, UtilService, PublicPlayerService, ConnectionService,
        TelemetryService, ToasterService,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopExploreContentComponent);
    component = fixture.componentInstance;
    const router = TestBed.get(Router);
    spyOn(router.events, 'pipe').and.returnValue(observableOf());
    fixture.detectChanges();
  });

  it('should call ngOnInit', () => {
    const connectionService = TestBed.get(ConnectionService);
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(connectionService, 'monitor').and.returnValue(observableOf(true));
    spyOn(component, 'updateCardData');
    component.ngOnInit();
    expect(component.isConnected).toBe(true);
  });

  it('should play content and log telemetry', () => {
    spyOn(component, 'playContent');
    spyOn(component, 'logTelemetry');

    const event = hoverActionEvent;
    event.hover.type = 'open';
    component.hoverActionClicked(event);

    expect(component.contentName).toEqual(event.content.name);
    expect(component.playContent).toHaveBeenCalledWith(event);
    expect(component.logTelemetry).toHaveBeenCalledWith(event.content, 'play-content');
  });

  it('should download content and log telemetry', () => {
    spyOn(component, 'downloadContent');
    spyOn(component, 'logTelemetry');

    const event = hoverActionEvent;
    event.hover.type = 'download';
    component.hoverActionClicked(event);

    expect(component.showDownloadLoader).toBeTruthy();
    expect(component.downloadContent).toHaveBeenCalledWith('do_31288771643112652813019');
    expect(component.logTelemetry).toHaveBeenCalledWith(event.content, 'download-content');
  });

  it('should play content and log telemetry', () => {
    spyOn(component, 'exportContent');
    spyOn(component, 'logTelemetry');

    const event = hoverActionEvent;
    event.hover.type = 'save';
    component.hoverActionClicked(event);

    expect(component.contentName).toEqual(event.content.name);
    expect(component.exportContent).toHaveBeenCalledWith('do_31288771643112652813019');
    expect(component.logTelemetry).toHaveBeenCalledWith(event.content, 'export-content');
  });

  it('should call playContent when offline', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    spyOn(publicPlayerService, 'playContent');
    component.playContent('test');
    expect(publicPlayerService.playContent).toHaveBeenCalledWith('test');
  });

  it('should call playContent when online', () => {
    component.isBrowse = true;
    const publicPlayerService = TestBed.get(PublicPlayerService);
    spyOn(publicPlayerService, 'playContentForOfflineBrowse');
    component.playContent('test');
    expect(publicPlayerService.playContentForOfflineBrowse).toHaveBeenCalledWith('test');
  });

  it('should download content', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'startDownload').and.returnValue(observableOf({}));

    component.downloadContent('do_31288771643112652813019');
    expect(contentManagerService.downloadContentId).toEqual('');
    expect(contentManagerService.startDownload).toHaveBeenCalledWith({});
    expect(component.showDownloadLoader).toBeFalsy();
  });

  it('should appropriate error message on download failure', () => {
    component.contentList = contentList;
    const contentManagerService = TestBed.get(ContentManagerService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(contentManagerService, 'startDownload').and.returnValue(throwError(''));
    spyOn(toasterService, 'error');

    component.downloadContent('do_31288771643112652813019');
    expect(contentManagerService.downloadContentId).toEqual('');
    expect(contentManagerService.startDownload).toHaveBeenCalledWith({});
    expect(component.showDownloadLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith('Could not download. Try again later');

  });

  it('should export a content for given content ID', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const toasterService = TestBed.get(ToasterService);

    spyOn(contentManagerService, 'exportContent').and.returnValue(observableOf({}));
    spyOn(toasterService, 'success');

    component.exportContent('do_31288771643112652813019');
    expect(contentManagerService.exportContent).toHaveBeenCalledWith('do_31288771643112652813019');
    expect(component.showExportLoader).toBeFalsy();
    expect(toasterService.success).toHaveBeenCalledWith('Content successfully copied');
  });

  it('should show appropriate error message on export fail', () => {
    const contentManagerService = TestBed.get(ContentManagerService);
    const toasterService = TestBed.get(ToasterService);

    spyOn(contentManagerService, 'exportContent').and.returnValue(throwError({ error: { responseCode: 'SERVER_ERROR' } }));
    spyOn(toasterService, 'error');

    component.exportContent('do_31288771643112652813019');

    expect(contentManagerService.exportContent).toHaveBeenCalledWith('do_31288771643112652813019');
    expect(component.showExportLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith('Enter a valid phone number');
  });

  it('should update data for the current content list', () => {
    component.isBrowse = true;
    component.isOnlineContents = true;
    component.contentList = contentList;
    const utilService = TestBed.get(UtilService);
    const publicPlayerService = TestBed.get(PublicPlayerService);

    spyOn(publicPlayerService, 'updateDownloadStatus');
    spyOn(utilService, 'addHoverData');

    component.updateCardData(downloadList);

    expect(publicPlayerService.updateDownloadStatus).toHaveBeenCalledTimes(4);
    expect(utilService.addHoverData).toHaveBeenCalled();
  });

  it('should log Telemetry', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.logTelemetry(contentList[0], 'play-content');
    expect(telemetryService.interact).toHaveBeenCalledWith(appTelemetryInteractData);
  });
});
