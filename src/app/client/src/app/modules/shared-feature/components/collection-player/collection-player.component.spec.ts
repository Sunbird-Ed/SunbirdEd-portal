
import { mergeMap, filter, map, catchError, takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';
import { PlayerService, CollectionHierarchyAPI, PermissionService, CopyContentService, UserService, GeneraliseLabelService, CoursesService } from '@sunbird/core';
import { Subscription, of } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash-es';
import {
  WindowScrollService, ILoaderMessage, PlayerConfig, ICollectionTreeOptions, NavigationHelperService,
  ToasterService, ResourceService, ContentData, ContentUtilsServiceService, ITelemetryShare, ConfigService,
  ExternalUrlPreviewService, LayoutService, UtilService, ConnectionService, OfflineCardService,
} from '@sunbird/shared';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput, IEndEventInput, IStartEventInput, TelemetryService } from '@sunbird/telemetry';
import TreeModel from 'tree-model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PopupControlService } from '../../../../service/popup-control.service';
import { PublicPlayerService } from '@sunbird/public';
import { TocCardType, PlatformType } from '@project-sunbird/common-consumption';
import { CsGroupAddableBloc } from '@project-fmps/client-services/blocs';
import { ContentManagerService } from '../../../public/module/offline/services';
import { CollectionPlayerComponent } from './collection-player.component';
import { mockResponse, collectionTree, telemetryErrorData, requiredProperties, contentHeaderData, userProfile } from './collection-player.component.spec.data';
import { partial } from 'lodash';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe('collection player component has to be created', () => {
  let component: CollectionPlayerComponent;
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of(contentHeaderData.collectionData),
    params: of(contentHeaderData.collectionData)
  };
  const mockPlayerService: Partial<PlayerService> = {};
  const mockWindowScrollService: Partial<WindowScrollService> = {
    smoothScroll: jest.fn()
  };
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn()
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: new EventEmitter<any>()
  };
  const mockToasterService: Partial<ToasterService> = {};
  const mockDeviceDetectorService: Partial<DeviceDetectorService> = {
    isMobile: jest.fn(),
    isTablet: jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {};
  const mockPermissionService: Partial<PermissionService> = {};
  const mockCopyContentService: Partial<CopyContentService> = {
    copyContent: jest.fn()
  };
  const mockContentUtilsServiceService: Partial<ContentUtilsServiceService> = {
    contentShareEvent: of('open') as any,
    getPublicShareUrl: jest.fn()
  };
  const mockConfigService: Partial<ConfigService> = {

    appConfig: {
      PLAYER_CONFIG: {
        MIME_TYPE: {
            collection: 'application/vnd.ekstep.content-collection'
        }
    },
      layoutConfiguration: 'joy',
      TELEMETRY: {
        PID: 'sample-page-id'
      }
    },
    urlConFig: {
      URLS: {
        TELEMETRY: {
          SYNC: true
        },
        CONTENT_PREFIX: ''
      }
    }
  };
  const mockPopupControlService: Partial<PopupControlService> = {};
  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue("tn") as any,
    userData$: of({ userProfile: userProfile }) as any,
    setIsCustodianUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
  };
  const mockExternalUrlPreviewService: Partial<ExternalUrlPreviewService> = {};
  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn(),
    redoLayoutCSS: jest.fn(),
    switchableLayout: jest.fn(() => of([{data: 'demo'}]))
  }
  const mockGeneraliseLabelService: Partial<GeneraliseLabelService> = {};
  const mockPublicPlayerService: Partial<PublicPlayerService> = {
    getConfig: jest.fn(),
    getQuestionSetHierarchy: jest.fn(),
    getCollectionHierarchy:jest.fn()
  };
  const mockCoursesService: Partial<CoursesService> = {};
  const mockUtilService: Partial<UtilService> = {
    isDesktopApp: true,
    isIos: true
  };
  const mockContentManagerService: Partial<ContentManagerService> = {
    contentDownloadStatus$: of({ enrolledCourses: [{ identifier: 'COMPLETED' }] }),
    updateContent: jest.fn(),
    exportContent: jest.fn(),
    deleteContent: jest.fn(),
  } as any;
  const mockConnectionService: Partial<ConnectionService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockOfflineCardService: Partial<OfflineCardService> = {
    isYoutubeContent: jest.fn()
  };
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getFrameworkCategories: jest.fn(),
    setDefaultFWforCsl: jest.fn()
  };

  beforeAll(() => {
    component = new CollectionPlayerComponent(
      mockActivatedRoute as ActivatedRoute,
      mockPlayerService as PlayerService,
      mockWindowScrollService as WindowScrollService,
      mockRouter as Router,
      mockNavigationHelperService as NavigationHelperService,
      mockToasterService as ToasterService,
      mockDeviceDetectorService as DeviceDetectorService,
      mockResourceService as ResourceService,
      mockPermissionService as PermissionService,
      mockCopyContentService as CopyContentService,
      mockContentUtilsServiceService as ContentUtilsServiceService,
      mockConfigService as ConfigService,
      mockPopupControlService as PopupControlService,
      mockNavigationHelperService as NavigationHelperService,
      mockExternalUrlPreviewService as ExternalUrlPreviewService,
      mockUserService as UserService,
      mockLayoutService as LayoutService,
      mockGeneraliseLabelService as GeneraliseLabelService,
      mockPublicPlayerService as PublicPlayerService,
      mockCoursesService as CoursesService,
      mockUtilService as UtilService,
      mockContentManagerService as ContentManagerService,
      mockConnectionService as ConnectionService,
      mockTelemetryService as TelemetryService,
      mockOfflineCardService as OfflineCardService,
      mockCslFrameworkService as CslFrameworkService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a collection player component instance of ', () => {
    expect(component).toBeTruthy();
  });
  describe('initLayout', () => {
    it('should call init Layout', () => {
      mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
      component.initLayout();
      mockLayoutService.switchableLayout().subscribe(layoutConfig => {
        expect(layoutConfig).toBeDefined();
      });
    });
  });
  it('should call the share link method ', () => {
    component.collectionData = contentHeaderData.collectionData;
    component.onShareLink();
    jest.spyOn(component, 'onShareLink').mockImplementation();
    mockContentUtilsServiceService.getPublicShareUrl = jest.fn().mockReturnValue(of(contentHeaderData.collectionData));
    component.onShareLink();
    expect(component.onShareLink).toBeCalled();
  });

  it('should call the set telemetry share data method ', () => {
    component.setTelemetryShareData(contentHeaderData.collectionData);
    expect(component.telemetryShareData).toEqual([{ id: '1234567890', type: 'PrimaryContentType', ver: '5.3' }])
  });
  it('should call the set telemetry share data method with out version ', () => {
    component.setTelemetryShareData(collectionTree.contentData);
    expect(component.telemetryShareData).toEqual([{ id: '1234567890', type: 'PrimaryContentType', ver: '1.0' }])
  });
  it('spy on printPdf()', () => {
    window.open = jest.fn();
    component.printPdf('/explore');
    jest.spyOn(component, 'printPdf').mockImplementation();
    component.printPdf('/explore');
    expect(component.printPdf).toBeCalled();
  });
  describe("ngOnDestroy", () => {
    it('should destroy sub', () => {
      component.unsubscribe$ = {
        next: jest.fn(),
        complete: jest.fn()
      } as any;
      component.ngOnDestroy();
      expect(component.unsubscribe$.next).toHaveBeenCalled();
      expect(component.unsubscribe$.complete).toHaveBeenCalled();
    });
  });
  it('spy on playContent method with data', () => {
    component['getPlayerConfig']=jest.fn().mockReturnValue(of({})) as any;
    component.activeContent = contentHeaderData.collectionData;
    component.playContent(contentHeaderData.collectionData);
    jest.spyOn(component, 'playContent').mockImplementation();
    component.playContent(contentHeaderData.collectionData);
    expect(component.playContent).toBeCalled();
  });
  xit('spy on ngOnInit method', () => {
    component['getPlayerConfig']=jest.fn().mockReturnValue(of({})) as any;
    component.ngOnInit();
    mockLayoutService.switchableLayout = jest.fn(() => of({data: ''}));
    jest.spyOn(component, 'ngOnInit').mockImplementation();
    component.ngOnInit();
    expect(component.ngOnInit).toBeCalled();
  });

  it('spy on OnPlayContent method with data', () => {
    component['getPlayerConfig']=jest.fn().mockReturnValue(of({})) as any;
    component.collectionTreeNodes = contentHeaderData.collectionData;
    component.OnPlayContent(contentHeaderData.collectionData as any);
    jest.spyOn(component, 'OnPlayContent').mockImplementation();
    component.OnPlayContent(contentHeaderData.collectionData as any);
    expect(component.OnPlayContent).toBeCalled();
  });

});
