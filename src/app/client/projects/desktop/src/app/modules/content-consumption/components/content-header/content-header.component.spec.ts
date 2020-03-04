import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentHeaderComponent } from './content-header.component';
import { PublicPlayerService } from '@sunbird/public';
import { ContentManagerService, ConnectionService } from '@sunbird/offline';
import { of, throwError } from 'rxjs';
import { ResourceService, OfflineCardService, SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import { contentHeaderData } from './content-header.component.spec.data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavigationHelperService } from 'src/app/modules/shared';
describe('ContentHeaderComponent', () => {
  let component: ContentHeaderComponent;
  let fixture: ComponentFixture<ContentHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentHeaderComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
        { provide: ResourceService, useValue: contentHeaderData.resourceBundle },
        ConnectionService, ContentManagerService, PublicPlayerService,
        OfflineCardService, NavigationHelperService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check checkDownloadStatus', () => {
    const playerService = TestBed.get(PublicPlayerService);
    spyOn(playerService, 'updateDownloadStatus').and.returnValue(contentHeaderData.collectionData);
    component.checkDownloadStatus(contentHeaderData.downloadList);
    expect(component.collectionData).toEqual(contentHeaderData.collectionData);
  });
  it('should call updateCollection and successfuly update collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'updateContent').and.returnValue(of(contentHeaderData.updateCollection.success));
    component.updateCollection(contentHeaderData.collectionData);
    expect(component.showUpdate).toBeFalsy();
  });
  it('should call updateCollection and error while updating collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'updateContent').and.returnValue(throwError(contentHeaderData.updateCollection.error));
    component.updateCollection(contentHeaderData.collectionData);
    expect(component.isConnected).toBeTruthy();
    expect(component.showUpdate).toBeTruthy();
    expect(component.toasterService.error(contentHeaderData.resourceBundle.messages.fmsg.m0096));
  });
  it('should call exportCollection and successfuly export collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    component.showExportLoader = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(of(contentHeaderData.exportCollection.success));
    component.exportCollection(contentHeaderData.collectionData);
    expect(component.showExportLoader).toBeFalsy();
    expect(component.toasterService.success(contentHeaderData.resourceBundle.messages.smsg.m0059));
  });

  it('should call exportCollection and error while  exporting collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    component.showExportLoader = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(throwError(contentHeaderData.exportCollection.error));
    component.exportCollection(contentHeaderData.collectionData);
    expect(component.showExportLoader).toBeFalsy();
    expect(component.toasterService.error(contentHeaderData.resourceBundle.messages.fmsg.m0091));
  });
  it('should check isYoutubeContentPresent', () => {
    const offlineCardService = TestBed.get(OfflineCardService);
    component.collectionData = contentHeaderData.collectionData;
    spyOn(offlineCardService, 'isYoutubeContent').and.returnValue(false);
    spyOn(component, 'downloadCollection').and.returnValue(contentHeaderData.collectionData);
    component.isYoutubeContentPresent(contentHeaderData.collectionData);
    expect(component.showModal).toBeFalsy();
    expect(component.downloadCollection).toHaveBeenCalledWith(contentHeaderData.collectionData);
  });
  it('should call downloadCollection and successfuly collection downloaded', () => {
    component.contentManagerService.downloadContentId = contentHeaderData.collectionData.result.content.identifier;
    component.collectionData = contentHeaderData.collectionData;
    component.disableDelete = false;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'startDownload').and.returnValue(of(contentHeaderData.downloadCollection.success));
    component.downloadCollection(contentHeaderData.collectionData);
    expect(component.contentManagerService.downloadContentId).toEqual('');
  });

  it('should call downloadCollection and error while downloading collection', () => {
    component.contentManagerService.downloadContentId = contentHeaderData.collectionData.result.content.identifier;
    component.collectionData = contentHeaderData.collectionData;
    component.disableDelete = false;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'startDownload').and.returnValue(throwError(contentHeaderData.downloadCollection.error));
    component.downloadCollection(contentHeaderData.collectionData);
    expect(component.contentManagerService.downloadContentId).toEqual('');
    expect(component.disableDelete).toBeTruthy();
    expect(component.toasterService.error(contentHeaderData.resourceBundle.messages.fmsg.m0090));
  });
  it('should call delete collection and successfuly delete collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(of(contentHeaderData.deleteCollection.success));
    component.deleteCollection(contentHeaderData.collectionData);
    expect(component.toasterService.success(contentHeaderData.resourceBundle.messages.stmsg.desktop.deleteTextbookSuccessMessage));
  });
  it('should call delete collection and error while deleting collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    component.disableDelete = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(throwError(contentHeaderData.deleteCollection.error));
    component.deleteCollection(contentHeaderData.collectionData);
    expect(component.disableDelete).toBeFalsy();
    expect(component.toasterService.error(contentHeaderData.resourceBundle.messages.etmsg.desktop.deleteTextbookErrorMessage));
  });

  it('should navigate to previous page', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    component.collectionData = contentHeaderData.collectionData;
    spyOn(navigationHelperService, 'goBack');
    component.goBack();
    expect(navigationHelperService.goBack).toHaveBeenCalled();
  });
});
