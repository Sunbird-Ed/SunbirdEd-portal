import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, of, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CollectionPlayerComponent } from './collection-player.component';
import { CoreModule, CopyContentService, GeneraliseLabelService } from '@sunbird/core';
import { WindowScrollService, SharedModule, ResourceService, NavigationHelperService, ContentUtilsServiceService,
  ConnectionService, OfflineCardService, UtilService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionHierarchyGetMockResponse, collectionTree, requiredProperties, contentHeaderData } from './collection-player.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';
import { PublicPlayerService } from '@sunbird/public';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentManagerService } from '../../../public/module/offline/services';

describe('CollectionPlayerComponent', () => {
  let component: CollectionPlayerComponent;
  let fixture: ComponentFixture<CollectionPlayerComponent>;
  const collectionId = 'do_112270591840509952140';
  const contentId = 'domain_44689';
  let generaliseLabelService;
  const fakeActivatedRoute = {
    params: observableOf({ collectionId: collectionId }),
    queryParams: observableOf({ contentId: contentId }),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      }
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0118': 'No content to play',
        'm0138': 'FAILED',
        'm0140': 'DOWNLOADING',
        'desktop': {
            'deleteTextbookSuccessMessage': 'Textbook deleted successfully'
          }
      },
      'etmsg': {
        'desktop': {
          'deleteTextbookErrorMessage': 'Unable to delete textbook. Please try again..',
        }
      },
      'smsg': {
        'm0042': 'Content successfully copied',
        'm0056': 'You should be online to update the content',
        'm0059': 'Content successfully copied'
      },
      'emsg': {
        'm0008': 'Could not copy content. Try again later'
      },
      'fmsg': {
        'm0096': 'Could not Update. Try again later',
        'm0091': 'Could not copy content. Try again later',
        'm0090': 'Could not download. Try again later'
      },
    },
    'frmelmnts': {
      'btn': {
        'all': 'all',
        'video': 'video',
        'interactive': 'interactive',
        'docs': 'docs'
      }
    },
    languageSelected$: of({})
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionPlayerComponent],
      imports: [SuiModule, HttpClientTestingModule, CoreModule, SharedModule.forRoot(), RouterTestingModule, TelemetryModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [CopyContentService, ResourceService, NavigationHelperService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }, { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPlayerComponent);
    component = fixture.componentInstance;
    component.queryParams = { contentId: 'domain_44689' };
    component.cancelInteractEdata = {
      id: 'cancel-button',
      type: 'click',
      pageid: 'collection-player'
    };
    component.createCourseInteractEdata = {
      id: 'create-course-button',
      type: 'click',
      pageid: 'collection-player'
    };
    generaliseLabelService = TestBed.get(GeneraliseLabelService);
    spyOn(generaliseLabelService, 'initialize').and.returnValue('');
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    expect(component).toBeTruthy();
    expect(component.showPlayer).toBeFalsy();
    expect(component.loaderMessage).toEqual({
      headerMessage: 'Please wait...',
      loaderMessage: 'Fetching content details!'
    });
  });

  it('should get content based on route/query params', () => {
    const playerService = TestBed.get(PublicPlayerService);
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(playerService, 'getCollectionHierarchy').and.returnValue(observableOf(CollectionHierarchyGetMockResponse));
    component.ngOnInit();
    expect(component.collectionTreeNodes).toEqual({ data: CollectionHierarchyGetMockResponse.result.content });
  });

  it('should call closeContentPlayer method', fakeAsync(() => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const router = TestBed.get(Router);
    const route = TestBed.get(ActivatedRoute);
    const navigation = {
      queryParams: {
        dialCode: '61U24C'
      },
      relativeTo: route
    };
    component.queryParams = { dialCode: '61U24C' };
    component.closeContentPlayer();
    tick(200);
    expect(component.showPlayer).toBeFalsy();
  }));

  it('should call closeCollectionPlayer method when you open collections previously from content manager ', () => {
    spyOn(component, 'closeCollectionPlayer');
    const previousUrl = {
      url: '/play/collection/do_11287198635947622412',
    };
    spyOn(component.navigationHelperService, 'getPreviousUrl').and.returnValue(previousUrl);
    const router = TestBed.get(Router);
    expect(router.navigate).toBeDefined(['/']);
  });

  it('should call closeCollectionPlayer method when you open  collection previously from search', () => {
    spyOn(component, 'closeCollectionPlayer');
    const previousUrl = {
      searchUrl: '/search',
      queryParams: { key: 'collection' }
    };
    spyOn(component.navigationHelperService, 'getPreviousUrl').and.returnValue(previousUrl);
    const router = TestBed.get(Router);
    expect(router.navigate).toBeDefined([previousUrl.searchUrl, previousUrl.queryParams]);
  });

  it('should call closeCollectionPlayer method and navigate to previous url ', () => {
    spyOn(component, 'closeCollectionPlayer');
    const previousUrl = {
      otherUrl: '/browse/play/collection/do_3123405048187617282365',
    };
    spyOn(component.navigationHelperService, 'getPreviousUrl').and.returnValue(previousUrl);
    const router = TestBed.get(Router);
    expect(router.navigate).toBeDefined([previousUrl.otherUrl]);
  });

  it('should open the pdfUrl in a new tab', () => {
    spyOn(window, 'open').and.callThrough();
    component.printPdf('www.samplepdf.com');
    expect(window.open).toHaveBeenCalledWith('www.samplepdf.com', '_blank');
  });

  it('should call onShareLink', () => {
    const contentUtilsService = TestBed.get(ContentUtilsServiceService);
    component['collectionId'] = 'do_23242';
    spyOn(contentUtilsService, 'getPublicShareUrl').and.returnValue('someURL');
    spyOn(component, 'setTelemetryShareData');
    component.onShareLink();
    expect(component.shareLink).toEqual('someURL');
    expect(component.setTelemetryShareData).toHaveBeenCalled();
  });

  it('should call setTelemetryShareData', () => {
    component.setTelemetryShareData({ identifier: 'do_1232121', contentType: 'TextBook', pkgVersion: 2 });
    expect(component.telemetryShareData).toBeDefined();
    expect(component.telemetryShareData).toEqual([{ id: 'do_1232121', type: 'TextBook', ver: '2' }]);
  });

  it('should call selectedFilter', () => {
    component.selectedFilter({ data: { value: 'pdf' } });
    expect(component.activeMimeTypeFilter).toEqual('pdf');
  });

  it('should call showNoContent', () => {
    component.showNoContent({ message: 'No Content Available' });
    expect(component.isContentPresent).toBeFalsy();
  });

  it('should call setTelemetryInteractData', () => {
    component.setTelemetryInteractData();
    expect(component.tocTelemetryInteractEdata).toEqual({ id: 'library-toc', type: 'CLICK', pageid: 'get' });
  });

  it('should call tocCardClickHandler', () => {
    spyOn(component, 'setTelemetryInteractData');
    spyOn(component, 'callinitPlayer');
    component.activeContent = { identifier: 'do_1125110622654464001294' };
    component.tocCardClickHandler({});
    expect(component.setTelemetryInteractData).toHaveBeenCalled();
    expect(component.callinitPlayer).toHaveBeenCalled();
  });

  it('should call tocChapterClickHandler', () => {
    spyOn(component, 'callinitPlayer');
    component.isSelectChapter = true;
    component.tocChapterClickHandler({});
    expect(component.callinitPlayer).toHaveBeenCalled();
    expect(component.isSelectChapter).toBe(false);
  });

  it('should get getContentRollUp', () => {
    const response = component.getContentRollUp(['do_123', 'do_456']);
    expect(response).toEqual({ l1: 'do_123', l2: 'do_456' });
  });

  it('should call showChapter', () => {
    component.isSelectChapter = true;
    component.showChapter();
    expect(component.isSelectChapter).toBe(false);
  });

  it('should call showChapter', () => {
    component.isSelectChapter = false;
    component.showChapter();
    expect(component.isSelectChapter).toBe(true);
  });

  it('should call closeCollectionPlayer and navigate backt to previous url', () => {
    component.dialCode = undefined;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'navigateToPreviousUrl');
    component.closeCollectionPlayer();
    expect(navigationHelperService.navigateToPreviousUrl).toHaveBeenCalledWith('/explore');
  });

  it ('should return only required properties', () => {
    component.collectionData = collectionTree;

    spyOn(component.userService, 'userOrgDetails$').and.returnValue(of( {}));
    spyOn(component['utilService'], 'reduceTreeProps').and.returnValue(of(requiredProperties));
    spyOn(component['toasterService'], 'success');
    spyOn(component.copyContentService, 'copyAsCourse').and.returnValue(of(
        {
          'result': {
            'identifier': 'do_2131423481877217281310',
            'versionKey': '1604290550260',
            'course_id': 'do_2131423481877217281310'
          }
        }
    ));
    component.createCourse();

    component.userService.userOrgDetails$.subscribe(data => {
      expect(component.showCopyLoader).toBeTruthy();
      const collection: any = requiredProperties;
      component.copyContentService.copyAsCourse(collection).subscribe((response) => {
        expect(component.showCopyLoader).toBeFalsy();
        expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0042);
      });
    });
  });

  it('should init content manager and connection service for desktop only', () => {
    component.collectionData = contentHeaderData.collectionData.result.content;
    component.contentDownloadStatus =  { [contentHeaderData.collectionData.result.content.identifier]: 'COMPLETED'};
    const utilService = TestBed.get(UtilService);
    utilService._isDesktopApp = true;
    const contentManagerService = TestBed.get(ContentManagerService);
    spyOn(contentManagerService, 'contentDownloadStatus').and.returnValue(of([{}]))
    spyOn(component, 'checkDownloadStatus');
    component.ngOnInit();
    expect(component.checkDownloadStatus).toHaveBeenCalled();
  });

  it('should check collection status', () => {
    component.collectionData = contentHeaderData.collectionData.result.content;
    component.contentDownloadStatus =  { [contentHeaderData.collectionData.result.content.identifier]: 'COMPLETED'};
    spyOn(component, 'checkDownloadStatus').and.callThrough();
    const status = component.checkStatus('DOWNLOADED');
    expect(status).toBeTruthy();
  });
  it('should check checkDownloadStatus', () => {
    const playerService = TestBed.get(PublicPlayerService);
    component.collectionData = contentHeaderData.collectionData.result.content;
    component.contentDownloadStatus =  { [contentHeaderData.collectionData.result.content.identifier]: 'COMPLETED'};
    component.checkDownloadStatus();
    expect(component.collectionData).toEqual(contentHeaderData.collectionData.result.content);
    expect(component.collectionData['downloadStatus']).toEqual('DOWNLOADED');
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
    expect(component.toasterService.error(resourceBundle.messages.fmsg.m0096));
  });
  it('should call exportCollection and successfuly export collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    component.showExportLoader = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(of(contentHeaderData.exportCollection.success));
    component.exportCollection(contentHeaderData.collectionData);
    expect(component.showExportLoader).toBeFalsy();
    expect(component.toasterService.success(resourceBundle.messages.smsg.m0059));
  });

  it('should call exportCollection and error while  exporting collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    component.showExportLoader = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'exportContent').and.returnValue(throwError(contentHeaderData.exportCollection.error));
    component.exportCollection(contentHeaderData.collectionData);
    expect(component.showExportLoader).toBeFalsy();
    expect(component.toasterService.error(resourceBundle.messages.fmsg.m0091));
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
    spyOn(contentService, 'startDownload').and.returnValue(throwError(contentHeaderData.downloadCollection.downloadError));
    component.downloadCollection(contentHeaderData.collectionData);
    expect(component.contentManagerService.downloadContentId).toEqual('');
    expect(component.contentManagerService.failedContentName).toEqual('');
    expect(component.toasterService.error(resourceBundle.messages.fmsg.m0090));
  });
  it('should call delete collection and successfuly delete collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(of(contentHeaderData.deleteCollection.success));
    component.deleteCollection(contentHeaderData.collectionData);
    expect(component.toasterService.success(resourceBundle.messages.stmsg.desktop.deleteTextbookSuccessMessage));
  });
  it('should call delete collection and error while deleting collection ', () => {
    component.collectionData = contentHeaderData.collectionData;
    component.disableDelete = true;
    const contentService = TestBed.get(ContentManagerService);
    spyOn(contentService, 'deleteContent').and.returnValue(throwError(contentHeaderData.deleteCollection.error));
    component.deleteCollection(contentHeaderData.collectionData);
    expect(component.disableDelete).toBeFalsy();
    expect(component.toasterService.error(resourceBundle.messages.etmsg.desktop.deleteTextbookErrorMessage));
  });
});
