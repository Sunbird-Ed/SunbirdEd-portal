import { TelemetryModule } from '@sunbird/telemetry';
import { of as observableOf, of } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CollectionPlayerComponent } from './collection-player.component';
import { CoreModule, CopyContentService, GeneraliseLabelService } from '@sunbird/core';
import { WindowScrollService, SharedModule, ResourceService, NavigationHelperService, ContentUtilsServiceService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionHierarchyGetMockResponse, collectionTree } from './collection-player.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';
import { PublicPlayerService } from '@sunbird/public';
import { ActivatedRoute, Router } from '@angular/router';

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
        'm0118': 'No content to play'
      },
      'smsg': {
        'm0042': 'Content successfully copied'
      },
      'emsg': {
        'm0008': 'Could not copy content. Try again later'
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
    expect(component.tocTelemetryInteractEdata).toEqual({ id: 'library-toc', type: 'click', pageid: 'get' });
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
});
