
import { of as observableOf, Observable, throwError as observableThrowError } from 'rxjs';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CollectionHierarchyAPI, ContentService, CoreModule } from '@sunbird/core';
import { PublicCollectionPlayerComponent } from './public-collection-player.component';
import { PublicPlayerService } from './../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryModule } from '@sunbird/telemetry';
import { WindowScrollService, SharedModule, ResourceService, ToasterService , NavigationHelperService} from '@sunbird/shared';
import { CollectionHierarchyGetMockResponse, collectionTree } from './public-collection-player.component.spec.data';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ContentManagerService } from '@sunbird/offline';

describe('PublicCollectionPlayerComponent', () => {
  let component: PublicCollectionPlayerComponent;
  let fixture: ComponentFixture<PublicCollectionPlayerComponent>;
  const collectionId = 'do_112270591840509952140';
  const contentId = 'domain_44689';
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
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicCollectionPlayerComponent],
      imports: [CoreModule, HttpClientTestingModule, RouterTestingModule,
        TelemetryModule.forRoot(), SharedModule.forRoot()],
      providers: [ContentService, PublicPlayerService, ResourceService,
        ContentManagerService, ToasterService, NavigationHelperService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCollectionPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    expect(component.loader).toBeFalsy();
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
    spyOn(component, 'closeCollectionPlayer' );
    const previousUrl = {
      url: '/play/collection/do_11287198635947622412',
    };
   spyOn(component.navigationHelperService, 'getPreviousUrl').and.returnValue(previousUrl);
    const router = TestBed.get(Router);
    expect(router.navigate).toBeDefined(['/']);
  });

  it('should call closeCollectionPlayer method when you open  collection previously from search', () => {
    spyOn(component, 'closeCollectionPlayer' );
    const previousUrl = {
      searchUrl: '/search',
      queryParams: { key: 'collection' }
    };
    spyOn(component.navigationHelperService, 'getPreviousUrl').and.returnValue(previousUrl);
    const router = TestBed.get(Router);
    expect(router.navigate).toBeDefined([previousUrl.searchUrl, previousUrl.queryParams]);
  });
  it('should call closeCollectionPlayer method and navigate to previous url ', () => {
    spyOn(component, 'closeCollectionPlayer' );
    const previousUrl = {
      otherUrl: '/browse/play/collection/do_3123405048187617282365',
    };
    spyOn(component.navigationHelperService, 'getPreviousUrl').and.returnValue(previousUrl);
    const router = TestBed.get(Router);
    expect(router.navigate).toBeDefined([previousUrl.otherUrl]);
  });
});
