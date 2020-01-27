import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentActionsComponent } from './content-actions.component';
import { actionsData } from './content-actions.component.spec.data';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService, OfflineCardService, NavigationHelperService,
  SharedModule, ServerResponse } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { PublicPlayerService } from '@sunbird/public';

describe('ContentActionsComponent', () => {
  let component: ContentActionsComponent;
  let fixture: ComponentFixture<ContentActionsComponent>;
  const ActivatedRouteStub = {
    'params': of({ 'collectionId': actionsData.collectionId }),
    snapshot: {
      params: {
        'collectionId': actionsData.collectionId
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentActionsComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: ResourceService, useValue: actionsData.resourceBundle },
        ConnectionService, ContentManagerService, PublicPlayerService,
        OfflineCardService, TelemetryService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should check OnlineStatus', () => {
    expect(component).toBeTruthy();
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    spyOn(component, 'changeContentStatus').and.callFake(() => {});
    component.contentData = actionsData.contentData;
    component.ngOnInit();
    component['connectionService'].monitor().subscribe(data => {
      expect(data).toBeTruthy();
      expect(component.changeContentStatus).toHaveBeenCalledWith(actionsData.contentData);
    });
  });

  it('should initialize contentData on ngOnchanges', () => {
    component.contentData = actionsData.contentData;
    spyOn(component, 'changeContentStatus');
    component.ngOnChanges({
      contentData: new SimpleChange(null, component.contentData, false)
    });
    fixture.detectChanges();
    expect(component.changeContentStatus).toHaveBeenCalledWith(actionsData.contentData);
  });

  it('should check checkDownloadStatus', () => {
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'updateDownloadStatus').and.returnValue(actionsData.contentData);
    component.checkDownloadStatus(actionsData.downloadList);
    expect(component.contentData).toEqual(actionsData.contentData);
    expect(component.contentData['downloadStatus']).toEqual('DOWNLOADED');
  });

  it('should check isYoutubeContentPresent', () => {
    const offlineCardService = TestBed.get(OfflineCardService);
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(false);
    spyOn(component, 'downloadContent').and.returnValue(actionsData.contentData);
    component.isYoutubeContentPresent(actionsData.contentData);
    expect(component.showModal).toBeFalsy();
    expect(component.downloadContent).toHaveBeenCalledWith(actionsData.contentData);
  });

  it('should call onActionButtonClick for UPDATE ', () => {
    spyOn(component, 'updateContent');
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.UPDATE, actionsData.contentData);
    expect(component.updateContent).toHaveBeenCalledWith(actionsData.contentData);
    expect(component.logTelemetry).toHaveBeenCalledWith('update-content');
  });

  it('should call onActionButtonClick for DOWNLOAD ', () => {
    spyOn(component, 'isYoutubeContentPresent');
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.DOWNLOAD, actionsData.contentData);
    expect(component.isYoutubeContentPresent).toHaveBeenCalledWith(actionsData.contentData);
    expect(component.logTelemetry).toHaveBeenCalledWith('is-youtube-content');
  });

  it('should call onActionButtonClick for DELETE ', () => {
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.DELETE, actionsData.contentData);
    expect(component.showDeleteModal).toBeTruthy();
    expect(component.logTelemetry).toHaveBeenCalledWith('confirm-delete-content');
  });

  it('should call onActionButtonClick for RATE ', () => {
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.RATE, actionsData.contentData);
    expect(component.contentRatingModal).toBeTruthy();
    expect(component.logTelemetry).toHaveBeenCalledWith('rate-content');
  });

  it('should call onActionButtonClick for SHARE ', () => {
    spyOn(component, 'logTelemetry');
    spyOn(component, 'exportContent');
    component.onActionButtonClick(actionsData.actionButtonEvents.SHARE, actionsData.contentData);
    expect(component.exportContent).toHaveBeenCalledWith(actionsData.contentData);
    expect(component.logTelemetry).toHaveBeenCalledWith('share-content');
  });

  it('should call downloadContent and successfuly content downloaded', () => {
    spyOn(component['contentManagerService'], 'startDownload').and.returnValue(of(actionsData.downloadContent.success));
    spyOn(component, 'logTelemetry');
    spyOn(component, 'changeContentStatus');
    component.contentData = actionsData.contentData;
    component.downloadContent(actionsData.contentData);
    component['contentManagerService'].startDownload({}).subscribe(data => {
      expect(data).toEqual(actionsData.downloadContent.success);
      expect(component.contentManagerService.downloadContentId).toEqual('');
    });
    expect(component.logTelemetry).toHaveBeenCalledWith('download-content');
  });

  it('should call downloadContent and error while downloading content', () => {
    spyOn(component['contentManagerService'], 'startDownload').and.returnValue(throwError(actionsData.downloadContent.error));
    spyOn(component, 'logTelemetry');
    component.contentData = actionsData.contentData;
    component.downloadContent(actionsData.contentData);
    component['contentManagerService'].startDownload({}).subscribe(data => {}, err => {
      expect(err).toEqual(actionsData.downloadContent.error);
      expect(component.contentManagerService.downloadContentId).toEqual('');
      expect(component.toasterService.error(actionsData.resourceBundle.messages.fmsg.m0090));
    });
    expect(component.logTelemetry).toHaveBeenCalledWith('download-content');
  });

  it('should call updateContent and successfuly update content ', () => {
    spyOn(component['contentManagerService'], 'updateContent').and.returnValue(of(actionsData.updateContent.success));
    spyOn(component, 'changeContentStatus');
    component.contentData = actionsData.contentData;
    component.updateContent(actionsData.contentData);
    const request = { contentId: actionsData.contentData.identifier };
    component['contentManagerService'].updateContent(request).subscribe(data => {
      expect(data).toEqual(actionsData.updateContent.success);
      expect(component.changeContentStatus).toHaveBeenCalledWith(component.contentData);
    });
    expect(component.contentData.desktopAppMetadata['updateAvailable']).toBeFalsy();
  });

  it('should call updateContent and error while updating content ', () => {
    spyOn(component['contentManagerService'], 'updateContent').and.returnValue(throwError(actionsData.updateContent.error));
    spyOn(component, 'changeContentStatus');
    component.contentData = actionsData.contentData;
    component.updateContent(actionsData.contentData);
    const request = { contentId: actionsData.contentData.identifier };
    component['contentManagerService'].updateContent(request).subscribe(data => {}, err => {
      expect(err).toEqual(actionsData.updateContent.error);
      expect(component.contentData['desktopAppMetadata']['updateAvailable']).toBeTruthy();
      expect(component.changeContentStatus).toHaveBeenCalledWith(component.contentData);
      expect(component.toasterService.error(actionsData.resourceBundle.messages.fmsg.m0096));
    });
  });

  it('should call deleteContent and successfuly delete content ', () => {
    spyOn(component['contentManagerService'], 'deleteContent').and.returnValue(of(actionsData.deleteContent.success));
    spyOn(component, 'logTelemetry');
    component.contentData = actionsData.contentData;
    component.deleteContent(actionsData.contentData);
    const request = {request: {contents: [actionsData.contentData.identifier], visibility: 'Parent'}};
    component['contentManagerService'].deleteContent(request).subscribe(data => {
      expect(data).toEqual(actionsData.deleteContent.success);
      expect(component.contentData.desktopAppMetadata.isAvailable).toBeFalsy();
      expect(Object.keys(component.contentData)).not.toContain('downloadStatus');
      expect(component.toasterService.success(actionsData.resourceBundle.messages.stmsg.desktop.deleteContentSuccessMessage));
    });
    expect(component.logTelemetry).toHaveBeenCalledWith('delete-content');
  });

  it('should call deleteContent and error while deleting content ', () => {
    spyOn(component['contentManagerService'], 'deleteContent').and.returnValue(throwError(actionsData.deleteContent.error));
    spyOn(component, 'logTelemetry');
    component.contentData = actionsData.contentData;
    component.deleteContent(actionsData.contentData);
    const request = {request: {contents: [actionsData.contentData.identifier], visibility: 'Parent'}};
    component['contentManagerService'].deleteContent(request).subscribe(data => {}, err => {
      expect(err).toEqual(actionsData.deleteContent.error);
      expect(component.toasterService.success(actionsData.resourceBundle.messages.etmsg.deleteContentErrorMessage));
    });
  });

  it('should call exportContent and successfuly export content ', () => {
    spyOn(component['contentManagerService'], 'exportContent').and.returnValue(of(actionsData.exportContent.success));
    component.contentData = actionsData.contentData;
    component.exportContent(actionsData.contentData);
    component['contentManagerService'].exportContent(actionsData.contentData.identifier).subscribe((data) => {
      expect(component.showExportLoader).toBeFalsy();
      expect(component.toasterService.success(actionsData.resourceBundle.messages.smsg.m0059));
    });
  });

  it('should call exportContent and error while  exporting content ', () => {
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(throwError(actionsData.exportContent.error));
    component.contentData = actionsData.contentData;
    component.exportContent(actionsData.contentData);
    component['contentManagerService'].exportContent(actionsData.contentData.identifier).subscribe(data => {}, err => {
      expect(component.showExportLoader).toBeFalsy();
      expect(component.toasterService.error(actionsData.resourceBundle.messages.fmsg.m0091));
    });
  });

});
