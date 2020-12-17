import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentActionsComponent } from './content-actions.component';
import { actionsData } from './content-actions.component.spec.data';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ResourceService, ToasterService, NavigationHelperService,
  SharedModule, ServerResponse, UtilService, OfflineCardService
} from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicPlayerService } from '@sunbird/public';
import { configureTestSuite } from '@sunbird/test-util';
import { ContentManagerService } from '../../../public/module/offline/services';
import { APP_BASE_HREF } from '@angular/common';

describe('ContentActionsComponent', () => {
  let component: ContentActionsComponent;
  let fixture: ComponentFixture<ContentActionsComponent>;
  const ActivatedRouteStub = {
    'params': of({ 'collectionId': actionsData.collectionId }),
    snapshot: {
      params: {
        'collectionId': actionsData.collectionId
      },
      data: {
        telemetry: {
          env: 'library', pageid: 'content-action', type: 'contentAction'
        }
      },
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentActionsComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: ResourceService, useValue: actionsData.resourceBundle },
        PublicPlayerService, TelemetryService,{ provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentActionsComponent);
    component = fixture.componentInstance;
    component.contentData = actionsData.contentData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onActionButtonClick for RATE ', () => {
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.RATE, actionsData.contentData);
    expect(component.contentRatingModal).toBeTruthy();
    expect(component.logTelemetry).toHaveBeenCalledWith('rate-content',  actionsData.contentData);
  });

  it('should call onActionButtonClick for SHARE ', () => {
    component.isDesktopApp = false;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'setTelemetryShareData');
    component.onActionButtonClick(actionsData.actionButtonEvents.SHARE, actionsData.contentData);
    expect(component.setTelemetryShareData).toHaveBeenCalledWith(actionsData.param);
    expect(component.logTelemetry).toHaveBeenCalledWith('share-content',  actionsData.contentData);
  });

  it('should initialize contentData on ngOnchanges', () => {
    component.isDesktopApp = true;
    component.contentData = actionsData.contentData;
    spyOn(component, 'changeContentStatus');
    component.ngOnChanges({
      contentData: new SimpleChange(null, component.contentData, false)
    });
    fixture.detectChanges();
    expect(component.changeContentStatus).toHaveBeenCalled();
  });

  it('should check isYoutubeContentPresent', () => {
    component.isDesktopApp = true;
    const offlineCardService = TestBed.get(OfflineCardService);
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(false);
    spyOn(component, 'downloadContent').and.returnValue(actionsData.contentData);
    component.isYoutubeContentPresent(actionsData.contentData);
    expect(component.showModal).toBeFalsy();
    expect(component.downloadContent).toHaveBeenCalledWith(actionsData.contentData);
  });

  it('should call onActionButtonClick for UPDATE ', () => {
    component.isDesktopApp = true;
    spyOn(component, 'updateContent');
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.UPDATE, actionsData.contentData);
    expect(component.updateContent).toHaveBeenCalledWith(actionsData.contentData);
    expect(component.logTelemetry).toHaveBeenCalledWith('update-content', actionsData.contentData);
  });

  it('should call onActionButtonClick for DOWNLOAD ', () => {
    component.isDesktopApp = true;
    spyOn(component, 'isYoutubeContentPresent');
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.DOWNLOAD, actionsData.contentData);
    expect(component.isYoutubeContentPresent).toHaveBeenCalledWith(actionsData.contentData);
    expect(component.logTelemetry).toHaveBeenCalledWith('download-content',  actionsData.contentData);
  });

  it('should call onActionButtonClick for DELETE ', () => {
    component.isDesktopApp = true;
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.DELETE, actionsData.contentData);
    expect(component.showDeleteModal).toBeTruthy();
    expect(component.logTelemetry).toHaveBeenCalledWith('confirm-delete-content',  actionsData.contentData);
  });

  it('should call onActionButtonClick for RATE ', () => {
    component.isDesktopApp = true;
    spyOn(component, 'logTelemetry');
    component.onActionButtonClick(actionsData.actionButtonEvents.RATE, actionsData.contentData);
    expect(component.contentRatingModal).toBeTruthy();
    expect(component.logTelemetry).toHaveBeenCalledWith('rate-content',  actionsData.contentData);
  });

  it('should call onActionButtonClick for SHARE ', () => {
    component.isDesktopApp = true;
    spyOn(component, 'logTelemetry');
    spyOn(component, 'exportContent');
    component.onActionButtonClick(actionsData.actionButtonEvents.SHARE, actionsData.contentData);
    expect(component.exportContent).toHaveBeenCalledWith(actionsData.contentData);
  });

  it('should call downloadContent and successfuly content downloaded', () => {
    component.isDesktopApp = true;
    spyOn(component['contentManagerService'], 'startDownload').and.returnValue(of(actionsData.downloadContent.success));
    spyOn(component, 'changeContentStatus').and.callThrough();;
    component.contentData = actionsData.contentData;
    component.downloadContent(actionsData.contentData);
    component['contentManagerService'].startDownload({}).subscribe(data => {
      expect(data).toEqual(actionsData.downloadContent.success);
      expect(component.contentManagerService.downloadContentId).toEqual('');
    });
  });

  it('should call downloadContent and error while downloading content', () => {
    component.isDesktopApp = true;
    spyOn(component['contentManagerService'], 'startDownload').and.returnValue(throwError(actionsData.downloadContent.downloadError));
    spyOn(component.toasterService, 'error');
    component.contentData = actionsData.contentData;
    component.downloadContent(actionsData.contentData);
    component['contentManagerService'].startDownload({}).subscribe(data => {}, err => {
      expect(err).toEqual(actionsData.downloadContent.downloadError);
      expect(component.contentManagerService.downloadContentId).toEqual('');
      expect(component.contentManagerService.failedContentName).toEqual('');
      expect(component.toasterService.error).toHaveBeenCalledWith(actionsData.resourceBundle.messages.fmsg.m0090);
    });
  });

  it('should call updateContent and successfuly update content ', () => {
    component.isDesktopApp = true;
    spyOn(component['contentManagerService'], 'updateContent').and.returnValue(of(actionsData.updateContent.success));
    spyOn(component, 'changeContentStatus');
    component.contentData = actionsData.contentData;
    component.updateContent(actionsData.contentData);
    const request = { contentId: actionsData.contentData.identifier };
    component['contentManagerService'].updateContent(request).subscribe(data => {
      expect(data).toEqual(actionsData.updateContent.success);
      expect(component.contentData.desktopAppMetadata['updateAvailable']).toBeFalsy();
    });
  });

  it('should call updateContent and error while updating content ', () => {
    component.isDesktopApp = true;
    spyOn(component['contentManagerService'], 'updateContent').and.returnValue(throwError(actionsData.updateContent.error));
    spyOn(component, 'changeContentStatus');
    component.contentData = actionsData.contentData;
    component.updateContent(actionsData.contentData);
    const request = { contentId: actionsData.contentData.identifier };
    component['contentManagerService'].updateContent(request).subscribe(data => {}, err => {
      expect(err).toEqual(actionsData.updateContent.error);
      expect(component.contentData['desktopAppMetadata']['updateAvailable']).toBeTruthy();
    });
  });

  it('should call deleteContent and successfuly delete content ', () => {
    component.isDesktopApp = true;
    spyOn(component['contentManagerService'], 'deleteContent').and.returnValue(of(actionsData.deleteContent.success));
    spyOn(component, 'logTelemetry');
    component.contentData = actionsData.contentData;
    component.deleteContent(actionsData.contentData);
    const request = {request: {contents: [actionsData.contentData.identifier], visibility: 'Parent'}};
    component['contentManagerService'].deleteContent(request).subscribe(data => {
      expect(data).toEqual(actionsData.deleteContent.success);
      expect(component.contentData['desktopAppMetadata.isAvailable']).toBeFalsy();
    });
    expect(component.logTelemetry).toHaveBeenCalledWith('delete-content',  actionsData.contentData);
  });

  it('should call deleteContent and error while deleting content ', () => {
    component.isDesktopApp = true;
    component.resourceService.messages = actionsData.resourceBundle.messages;
    spyOn(component['contentManagerService'], 'deleteContent').and.returnValue(throwError(actionsData.deleteContent.error));
    spyOn(component, 'logTelemetry');
    spyOn(component.toasterService, 'error');
    component.contentData = actionsData.contentData;
    component.deleteContent(actionsData.contentData);
    const request = {request: {contents: [actionsData.contentData.identifier], visibility: 'Parent'}};
    component['contentManagerService'].deleteContent(request).subscribe(data => {}, err => {
      expect(err).toEqual(actionsData.deleteContent.error);
      expect(component.toasterService.error).toHaveBeenCalledWith(
        actionsData.resourceBundle.messages.etmsg.desktop.deleteContentErrorMessage);
    });
  });

  it('should call exportContent and successfuly export content ', () => {
    component.isDesktopApp = true;
    spyOn(component['contentManagerService'], 'exportContent').and.returnValue(of(actionsData.exportContent.success));
    component.contentData = actionsData.contentData;
    component.exportContent(actionsData.contentData);
    component['contentManagerService'].exportContent(actionsData.contentData.identifier).subscribe((data) => {
      expect(component.showExportLoader).toBeFalsy();
    });
  });

  it('should call exportContent and error while  exporting content ', () => {
    component.isDesktopApp = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(throwError(actionsData.exportContent.error));
    spyOn(component.toasterService, 'error');
    component.contentData = actionsData.contentData;
    component.exportContent(actionsData.contentData);
    component['contentManagerService'].exportContent(actionsData.contentData.identifier).subscribe(data => {}, err => {
      expect(component.showExportLoader).toBeFalsy();
      expect(component.toasterService.error).toHaveBeenCalledWith(actionsData.resourceBundle.messages.fmsg.m0091);
    });
  });

  it('should listen for content download status and call changeContentstatus', () => {
    component.isDesktopApp = true;
    const contentManagerService = TestBed.get(ContentManagerService);
    component.contentDownloadStatus =  { ['do_1234']: 'COMPLETED'};
    spyOn(component, 'changeContentStatus');
    const utilService = TestBed.get(UtilService);
    utilService._isDesktopApp = true;
    spyOn(contentManagerService, 'contentDownloadStatus').and.returnValue(of([{}]))
    component.ngOnInit();
    expect(component.changeContentStatus).toHaveBeenCalled();
  });

  it('should call log telemetry ', () => {
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    component.logTelemetry('delete-content',  actionsData.contentData );
    expect(telemetryService.interact).toHaveBeenCalled();
  });



});
