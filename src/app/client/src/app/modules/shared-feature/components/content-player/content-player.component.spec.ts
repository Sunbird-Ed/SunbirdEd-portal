import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, PlayerService, CopyContentService, PermissionService } from '@sunbird/core';
import * as _ from 'lodash-es';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, NavigationHelperService,
  ContentUtilsServiceService, LayoutService
} from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { PopupControlService } from '../../../../service/popup-control.service';
import { of } from 'rxjs';
import { PublicPlayerService } from '@sunbird/public';
import { ContentPlayerComponent } from './content-player.component';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe('ContentPlayerComponent', () => {
  let component: ContentPlayerComponent;
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({}),
    params: of({})
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    contentFullScreenEvent: new EventEmitter<any>(),
    getPageLoadTime: jest.fn().mockReturnValue('1ms')
  };
  const mockUserService: Partial<UserService> = {
    loggedIn: true,
    slug: jest.fn().mockReturnValue("tn") as any,
    userData$: of({
      userProfile: {
        userId: 'sample-uid',
        rootOrgId: 'sample-root-id',
        rootOrg: {},
        hashTagIds: ['id']
      } as any
    }) as any,
    setIsCustodianUser: jest.fn(),
    userid: 'sample-uid',
    appId: 'sample-id',
    getServerTimeDiff: '',
  };
  const mockResourceService: Partial<ResourceService> = {
    messages: {
      imsg: { m0027: 'Something went wrong' },
      stmsg: { m0009: 'error' },
      smsg: { m0042: 'content copied successfully', m0067: "Question set successfully copied" },
      emsg: { m0067:' Could not copy question set.Try again later', m0008: 'Could not copy content'}

    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        description: 'description'
      }
    }
  };
  const mockRouter: Partial<Router> = {
    events: of({ id: 1, url: 'sample-url' }) as any,
    navigate: jest.fn()
  };
  const resourceServiceMockData = {
    messages: {
      imsg: { m0027: 'Something went wrong' },
      stmsg: { m0009: 'error' },
      smsg: { m0042: 'content copied successfully', m0067: "Question set successfully copied" },
      emsg: { m0067:' Could not copy question set.Try again later', m0008: 'Could not copy content'}

    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        description: 'description'
      }
    }
  };
  const serverRes = {
    id: 'api.content.read',
    ver: '1.0',
    ts: '2018-05-03T10:51:12.648Z',
    params: 'params',
    responseCode: 'OK',
    result: {
      content: {
        mimeType: 'application/vnd.ekstep.ecml-archive',
        body: 'body',
        identifier: 'domain_66675',
        versionKey: '1497028761823',
        status: 'Live',
        me_averageRating: '4',
        description: 'ffgg',
        name: 'ffgh',
        concepts: ['AI', 'ML']
      }
    }
  };
  const mockToasterService: Partial<ToasterService> = {};
  const mockWindowScrollService: Partial<WindowScrollService> = {
    smoothScroll: jest.fn()
  };
  const mockPlayerService: Partial<PlayerService> = {
    getContent: jest.fn()
  };
  const mockPublicPlayerService: Partial<PublicPlayerService> = {};
  const mockCopyContentService: Partial<CopyContentService> = {
    copyContent: jest.fn()
  };
  const mockPermissionService: Partial<PermissionService> = {};
  const mockContentUtilsServiceService: Partial<ContentUtilsServiceService> = {
    getPublicShareUrl: jest.fn()
  };
  const mockPopupControlService: Partial<PopupControlService> = {};
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      ContentPlayer: {
        contentApiQueryParams: {
          orgdetails: 'orgName,email'
        }
      }
    }
  };
  const mockLayoutService: Partial<LayoutService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {};
  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getAllFwCatName: jest.fn(),
  };

  beforeAll(() => {
    component = new ContentPlayerComponent(
      mockActivatedRoute as ActivatedRoute,
      mockNavigationHelperService as NavigationHelperService,
      mockUserService as UserService,
      mockResourceService as ResourceService,
      mockRouter as Router,
      mockToasterService as ToasterService,
      mockWindowScrollService as WindowScrollService,
      mockPlayerService as PlayerService,
      mockPublicPlayerService as PublicPlayerService,
      mockCopyContentService as CopyContentService,
      mockPermissionService as PermissionService,
      mockContentUtilsServiceService as ContentUtilsServiceService,
      mockPopupControlService as PopupControlService,
      mockConfigService as ConfigService,
      mockLayoutService as LayoutService,
      mockTelemetryService as TelemetryService,
      mockCslFrameworkService as CslFrameworkService,

    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of contentPlayerComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should config content player if content status is "Live"', (() => {
    mockResourceService.messages = resourceServiceMockData.messages;
    mockResourceService.frmelmnts = resourceServiceMockData.frmelmnts;
    jest.spyOn(mockPlayerService, 'getContent').mockReturnValue(of(serverRes) as any);
    mockUserService._userProfile = { 'organisations': ['01229679766115942443'] } as any;
    mockLayoutService.initlayoutConfig = jest.fn(() => { });
    mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
    component.ngOnInit();
    expect(component.showLoader).toBeFalsy();
  }));

  it('it should call copyContent', () => {
    jest.spyOn(mockCopyContentService, 'copyContent').mockReturnValue(of(serverRes as any) as any);
    component.copyContent({} as any);
    expect(mockCopyContentService.copyContent).toBeCalled();
  });

  it('it should call onShareLink', () => {
    jest.spyOn(mockContentUtilsServiceService, 'getPublicShareUrl').mockReturnValue((of({} as any) as any)) as any;
    component.contentData = {} as any;
    component.contentData['mimeType'] = 'mp4';
    component.contentId = 'do_1131446242806251521827';
    component.onShareLink();
    expect(component.shareLink).toBeDefined();
  });

  it('it should call ngAfterViewInit', () => {
    jest.spyOn(mockNavigationHelperService, 'getPageLoadTime').mockReturnValue(1) as any;
    component.ngAfterViewInit();
    expect(mockNavigationHelperService.getPageLoadTime).toBeCalled();
    expect(component.pageLoadDuration).toEqual(1);
  });

  it('should invoked ngOnDestroy', () => {
    component.unsubscribe$ = {
      next: jest.fn(),
      complete: jest.fn()
    } as any;
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should set frameworkCategoriesList correctly', () => {
    const mockFrameworkCategories = ['category1', 'category2'];
    mockLayoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
    const mockSpy=jest.spyOn(mockCslFrameworkService, 'getAllFwCatName')
    mockSpy.mockReturnValue(mockFrameworkCategories);
    component.ngOnInit();
    expect(component.frameworkCategoriesList).toEqual(mockFrameworkCategories);
  });

});
