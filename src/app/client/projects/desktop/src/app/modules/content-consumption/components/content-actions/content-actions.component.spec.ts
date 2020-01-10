import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentActionsComponent } from './content-actions.component';
import { actionsData } from './content-actions.component.spec.data';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService, OfflineCardService, NavigationHelperService, SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
        OfflineCardService
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check OnlineStatus', () => {
    const connectionService = TestBed.get(ConnectionService);
    spyOn(connectionService, 'monitor').and.returnValue(of(true));
    expect(component.isConnected).toBeTruthy();
  });

  it('should check checkDownloadStatus', () => {
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'updateDownloadStatus').and.returnValue(actionsData.contentdata);
    component.checkDownloadStatus(actionsData.downloadList);
    expect(component.contentData).toEqual(actionsData.contentdata);
  });
  it('should check isYoutubeContentPresent', () => {
    const offlineCardService = TestBed.get(OfflineCardService);
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(false);
    spyOn(component, 'downloadContent').and.returnValue(actionsData.contentdata);
    component.isYoutubeContentPresent(actionsData.contentdata);
    expect(component.showModal).toBeFalsy();
    expect(component.downloadContent).toHaveBeenCalledWith(actionsData.contentdata);
  });
  it('should call downloadContent and successfuly content downloaded', () => {
    component.contentManagerService.downloadContentId = actionsData.contentdata.identifier;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'startDownload').and.returnValue(of(actionsData.downloadContent.success));
    component.downloadContent(actionsData.contentdata);
    expect(component.contentManagerService.downloadContentId).toEqual('');
  });

  it('should call downloadContent and error while downloading content', () => {
    component.contentManagerService.downloadContentId = actionsData.contentdata.identifier;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'startDownload').and.returnValue(throwError(actionsData.downloadContent.error));
    component.downloadContent(actionsData.contentdata);
    expect(component.contentManagerService.downloadContentId).toEqual('');
    expect(component.toasterService.error(actionsData.resourceBundle.messages.fmsg.m0090));
  });
  it('should call updateContent and successfuly update content ', () => {
    component.contentData = actionsData.contentdata;
    component.contentManagerService.downloadContentId = actionsData.contentdata.identifier;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'updateContent').and.returnValue(of(actionsData.updateContent.success));
    component.updateContent(actionsData.contentdata);
    expect(component.contentData.desktopAppMetadata.updateAvailable).toBeFalsy();
  });
  it('should call updateContent and error while updating content ', () => {
    component.contentManagerService.downloadContentId = actionsData.contentdata.identifier;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'updateContent').and.returnValue(throwError(actionsData.updateContent.error));
    component.updateContent(actionsData.contentdata);
    expect(component.isConnected).toBeTruthy();
    expect(component.toasterService.error(actionsData.resourceBundle.messages.fmsg.m0096));
  });
  it('should call deleteContent and successfuly delete content ', () => {
    component.contentData = actionsData.contentdata;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(of(actionsData.deleteContent.success));
    component.deleteContent(actionsData.contentdata);
    expect(component.contentData.desktopAppMetadata.updateAvailable).toBeFalsy();
    expect(component.toasterService.success(actionsData.resourceBundle.messages.stmsg.desktop.deleteSuccessMessage));
  });
  it('should call deleteContent and error while deleting content ', () => {
    component.contentData = actionsData.contentdata;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(throwError(actionsData.deleteContent.error));
    component.deleteContent(actionsData.contentdata);
    expect(component.toasterService.error(actionsData.resourceBundle.messages.stmsg.desktop.deleteErrorMessage));
  });
  it('should call exportContent and successfuly export content ', () => {
    component.contentData = actionsData.contentdata;
    component.showExportLoader = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(of(actionsData.exportContent.success));
    component.exportContent(actionsData.contentdata);
    expect(component.showExportLoader).toBeFalsy();
    expect(component.toasterService.success(actionsData.resourceBundle.messages.smsg.m0059));
  });

  it('should call exportContent and error while  exporting content ', () => {
    component.contentData = actionsData.contentdata;
    component.showExportLoader = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(throwError(actionsData.exportContent.error));
    component.exportContent(actionsData.contentdata);
    expect(component.showExportLoader).toBeFalsy();
    expect(component.toasterService.error(actionsData.resourceBundle.messages.fmsg.m0091));
  });
  it('should call onActionButtonClick for UPDATE ', () => {
    spyOn(component, 'updateContent').and.returnValue(actionsData.contentdata);
    component.onActionButtonClick(actionsData.actionButtonEvents.UPDATE, actionsData.contentdata);
    expect(component.updateContent).toHaveBeenCalledWith(actionsData.contentdata);
  });
  it('should call onActionButtonClick for DOWNLOAD ', () => {
    spyOn(component, 'isYoutubeContentPresent').and.returnValue(actionsData.contentdata);
    component.onActionButtonClick(actionsData.actionButtonEvents.DOWNLOAD, actionsData.contentdata);
    expect(component.isYoutubeContentPresent).toHaveBeenCalledWith(actionsData.contentdata);
  });
  it('should call onActionButtonClick for DELETE ', () => {
    component.onActionButtonClick(actionsData.actionButtonEvents.DELETE, actionsData.contentdata);
    expect(component.showDeleteModal).toBeTruthy();
  });
  it('should call onActionButtonClick for RATE ', () => {
    component.onActionButtonClick(actionsData.actionButtonEvents.RATE, actionsData.contentdata);
    expect(component.contentRatingModal).toBeTruthy();
  });
  it('should call onActionButtonClick for SHARE ', () => {
    spyOn(component, 'exportContent').and.returnValue(actionsData.contentdata);
    component.onActionButtonClick(actionsData.actionButtonEvents.SHARE, actionsData.contentdata);
    expect(component.exportContent).toHaveBeenCalledWith(actionsData.contentdata);
  });
});
