
import { of as observableOf, Observable, throwError as observableThrowError, of } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CollectionHierarchyAPI, ContentService, CoreModule, GeneraliseLabelService } from '@sunbird/core';
import { PublicCollectionPlayerComponent } from './public-collection-player.component';
import { PublicPlayerService } from './../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { WindowScrollService, SharedModule, ResourceService, ToasterService, NavigationHelperService, ContentUtilsServiceService } from '@sunbird/shared';
import {
  CollectionHierarchyGetMockResponse, collectionTree,
  telemetryErrorData
} from './public-collection-player.component.spec.data';
import { configureTestSuite } from '@sunbird/test-util';

describe('PublicCollectionPlayerComponent', () => {
  let component: PublicCollectionPlayerComponent;
  let fixture: ComponentFixture<PublicCollectionPlayerComponent>;
  const collectionId = 'do_112270591840509952140';
  const contentId = 'domain_44689';
  let telemetryService, generaliseLabelService;
  const fakeActivatedRoute = {
    params: observableOf({ collectionId: collectionId }),
    // queryParams: Observable.of({ contentId: contentId }),
    queryParams: observableOf({ language: ['en'] }, { dialCode: '61U24C' }, { contentId: contentId }),
    snapshot: {
      params: {
        collectionId: collectionId
      },
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
        'm0118': 'No content to play'
      },
      'fmsg': {
        'm0090': 'Could not download. Try again later'
      }
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
  class TelemetryServiceStub {
    error = jasmine.createSpy('error').and.returnValue(true);
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicCollectionPlayerComponent],
      imports: [CoreModule, HttpClientTestingModule, RouterTestingModule,
        TelemetryModule.forRoot(), SharedModule.forRoot()],
      providers: [ContentService, PublicPlayerService, ResourceService,
        ToasterService, NavigationHelperService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle },
        { provide: TelemetryService, useValue: new TelemetryServiceStub() }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCollectionPlayerComponent);
    component = fixture.componentInstance;
    telemetryService = TestBed.get(TelemetryService);
    generaliseLabelService = TestBed.get(GeneraliseLabelService);
    spyOn(generaliseLabelService, 'initialize').and.returnValue('');
  });
  it('should create', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    expect(component).toBeTruthy();
    expect(component.showPlayer).toBeFalsy();
    expect(component.loader).toBeTruthy();
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
    expect(component.loader).toBeTruthy();
  });
  it('should call setInteractEventData method', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const edata = {
      id: '',
      type: '',
      pageid: ''
    };
    component.closeCollectionPlayerInteractEdata = edata;
    component.telemetryInteractObject = {
      id: '',
      type: '',
      ver: ''
    };
    expect(component.closeCollectionPlayerInteractEdata).toBeDefined();
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
    expect(router.navigate).toHaveBeenCalledWith([], navigation);
  }));
  it('should call playContent method', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const content = {
      id: 'do_112474267785674752118',
      title: 'Test'
    };
    component.playContent(content);
    expect(component.showPlayer).toBeTruthy();
    expect(component.contentTitle).toEqual(content.title);
  });
  it('should call onPlayContent method', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const content = { id: 'do_112474267785674752118', title: 'Test' };
    component.collectionTreeNodes = collectionTree;
    const playContentDetails = {
      model: {
        mimeType: 'text/x-url',
        channel: '505c7c48ac6dc1edc9b08f21db5a571d'
      }
    };
    spyOn(component, 'OnPlayContent').and.callThrough();
    spyOn(component, 'playContent').and.callThrough();
    component.queryParams = {};
    component.OnPlayContent(content, true);
    expect(component.OnPlayContent).toHaveBeenCalledWith(content, true);
    expect(component.playContent).toHaveBeenCalledWith(content);
  });
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
  it('should call triggerTelemetryErrorEvent', () => {
    spyOn(component, 'triggerTelemetryErrorEvent').and.callThrough();
    component.triggerTelemetryErrorEvent(404, 'contentType field not available');
    expect(component.triggerTelemetryErrorEvent).toHaveBeenCalledWith(404, 'contentType field not available');
    expect(telemetryService.error).toHaveBeenCalled();
    expect(telemetryService.error).toHaveBeenCalledWith(telemetryErrorData);
  });
  it('should call getTelemetryErrorData', () => {
    const stacktrace = {
      message: 'contentType field not available',
      type: 'view'
    };
    const result = component.getTelemetryErrorData(stacktrace);
    expect(result.context.env).toEqual('get');
    expect(result.object.ver).toEqual('1.0');
    expect(result.edata.errtype).toEqual('SYSTEM');
    expect(JSON.parse(result.edata.stacktrace).message).toEqual(stacktrace.message);
    expect(JSON.parse(result.edata.stacktrace).type).toEqual('view');
    expect(result).toBeTruthy();
  });
  it('should call setActiveContent', () => {
    component.collectionData = CollectionHierarchyGetMockResponse.result.content;
    const activeContent = component.setActiveContent('domain_44689');
    expect(activeContent).toBeDefined();
    expect(activeContent.identifier).toBe('domain_44689');
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
    expect(component.telemetryShareData).toEqual([{ id: 'public-do_1232121', type: 'TextBook', ver: '2' }]);
  });

  it('should call setTelemetryData', () => {
    component.dialCode = 'CQPER';
    component.setTelemetryData();
    expect(component.telemetryCdata).toEqual([{ 'type': 'DialCode', 'id': 'CQPER' }]);
  });

  it('should call ngAfterViewInit', (done) => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    component['contentType'] = 'TextBook';
    spyOn(navigationHelperService, 'getPageLoadTime').and.returnValue(232);
    component.ngAfterViewInit();
    expect(navigationHelperService.getPageLoadTime).toHaveBeenCalled();
    setTimeout(() => {
      expect(component.telemetryImpression).toBeDefined();
      done();
    }, 10);
  });

  it('should call ngAfterViewInit without contentType', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'getPageLoadTime').and.returnValue(232);
    spyOn(component, 'triggerTelemetryErrorEvent');
    component.ngAfterViewInit();
    expect(navigationHelperService.getPageLoadTime).toHaveBeenCalled();
    expect(component.triggerTelemetryErrorEvent).toHaveBeenCalledWith(404, 'contentType field unavailable');
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
    component.pageId = 'library';
    component.setTelemetryInteractData();
    expect(component.tocTelemetryInteractEdata).toEqual({ id: 'library-toc', type: 'click', pageid: 'library' });
  });

  it('should call tocCardClickHandler', () => {
    spyOn(component, 'setTelemetryInteractData');
    spyOn(component, 'callinitPlayer');
    component.activeContent = { identifier: 'do_1125110622654464001294' };
    component.tocCardClickHandler({});
    expect(component.setTelemetryInteractData).toHaveBeenCalled();
    expect(component.callinitPlayer).toHaveBeenCalled();
    expect(component.isMobile).toBe(true);
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

  it('should call closeCollectionPlayer, if played in mobile', () => {
    component.isMobile = true;
    component.closeCollectionPlayer();
    expect(component.isMobile).toBe(false);
    expect(component.activeContent).toBe(null);
  });

  it('should call closeCollectionPlayer, for dialcode', () => {
    component.isMobile = false;
    component.dialCode = '61U24C';
    spyOn(sessionStorage, 'setItem');
    const router = TestBed.get(Router);
    component.closeCollectionPlayer();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('singleContentRedirect', 'singleContentRedirect');
    expect(router.navigate).toHaveBeenCalledWith(['/get/dial/', '61U24C']);
  });

  it('should call closeCollectionPlayer and navigate backt to previous url', () => {
    component.isMobile = false;
    component.dialCode = undefined;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'navigateToPreviousUrl');
    component.closeCollectionPlayer();
    expect(navigationHelperService.navigateToPreviousUrl).toHaveBeenCalledWith('/explore');
  });
});
