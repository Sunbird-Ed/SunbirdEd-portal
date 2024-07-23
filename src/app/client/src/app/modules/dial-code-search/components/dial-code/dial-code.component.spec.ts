import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { combineLatest as observableCombineLatest, of, throwError } from 'rxjs';
import { ResourceService, ToasterService, ConfigService, UtilService, NavigationHelperService, LayoutService} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, PlayerService, CoursesService, UserService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import {mergeMap, tap, retry, catchError, map, finalize, debounceTime, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialCodeService } from '../../services/dial-code/dial-code.service';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
import { DialCodeComponent } from './dial-code.component';

describe('DialCodeComponent', () => {
  let component: DialCodeComponent;

  const mockResourceService: Partial<ResourceService> = {};
  const mockCoursesService: Partial<CoursesService> = {
    getEnrolledCourses: jest.fn(),
    findEnrolledCourses: jest.fn()
  };
  const mockRouter: Partial<Router> = {
    url: '/get/dial',
    navigate: jest.fn(),
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      queryParams: {},
      params: { dialCode: 'testDialCode' },
        data: {
          telemetry: {
            env: 'test-env',
            pageid: 'mockPageId'
          }
        }
    } as any
  };

  const mockSearchService: Partial<SearchService> = {};
  const mockToasterService: Partial<ToasterService> = {
    error: jest.fn(),
  };
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
      DIAL_CODE: { PAGE_LIMIT: 10 },
      GetPage: {
        constantData: {},
        metaData: {},
        dynamicFields: {}
      },
      PLAYER_CONFIG: {
        MIME_TYPE: {
          collection: 'application/vnd.ekstep.content-collection',
          questionset: 'application/vnd.ekstep.qset'
        }
      }
    }
  };

  const mockUtilService: Partial<UtilService> = {
    getDataForCard: jest.fn().mockReturnValue([]),
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    getPageLoadTime: jest.fn(),
  };
  const mockPlayerService: Partial<PlayerService> = {
    playContent: jest.fn(),
  };
  const mockTelemetryService: Partial<TelemetryService> = {
    interact: jest.fn(),
    log: jest.fn(),
  };
  const mockPublicPlayerService: Partial<PublicPlayerService> = {
    updateDownloadStatus: jest.fn(),
    playContent: jest.fn()
  };
  const mockDialCodeService: Partial<DialCodeService> = {
    dialCodeResult: {
        count: 2,
        contents: [
          { identifier: 'textbookIdentifier', contentType: 'Textbook', name: 'TextbookName' },
          { identifier: 'otherIdentifier', contentType: 'Other', name: 'OtherContent' }
        ]
      },

    searchDialCodeAssemble: jest.fn(),
    filterDialSearchResults: jest.fn(),
  };
  const mockUserService: Partial<UserService> = {
    loggedIn: true
  };

  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    transformDataForCC: jest.fn(),
  };
  const mockLayoutService: Partial<LayoutService> = {
    initlayoutConfig: jest.fn(),
    switchableLayout: jest.fn(() => of([{ layout: 'demo' }])),
  };

  beforeEach(() => {
    component = new DialCodeComponent(
    mockResourceService as ResourceService,
    mockUserService as UserService,
    mockCoursesService as CoursesService,
    mockRouter as Router,
    mockActivatedRoute as ActivatedRoute,
    mockSearchService as SearchService,
    mockToasterService as ToasterService,
    mockConfigService as ConfigService,
    mockUtilService as UtilService,
    mockNavigationHelperService as NavigationHelperService,
    mockPlayerService as PlayerService,
    mockTelemetryService as TelemetryService,
    mockPublicPlayerService as PublicPlayerService,
    mockDialCodeService as DialCodeService,
    mockCslFrameworkService as CslFrameworkService,
    mockLayoutService as LayoutService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

   afterEach(() => {
    jest.clearAllTimers();
  });

  it('component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle goBack() correctly', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/resources"]);
  });

  it('should handle goBack() to explore if loggedIn false', () => {
    // @ts-ignore
    mockUserService.loggedIn = false;
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/explore"]);
  });

  it('should call initLayout on ngOnInit', () => {
    jest.spyOn(component, 'initLayout');
    component.ngOnInit();
    expect(component.initLayout).toHaveBeenCalled();
  });

  it("should navigate to '/get/dial' if textbook query param and dialCodeResult count > 1", () => {
    mockActivatedRoute.snapshot.queryParams.textbook = true;
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/get/dial', 'testDialCode']);
  });

  it("should call goBack() method when window popstate event occurs", () => {
    const mockEvent = {
      target: { url: '/get/dial' }
    };
    jest.spyOn(component, 'goBack');
    component.onPopState(mockEvent);
    expect(component.goBack).toHaveBeenCalled();
  });

  it("should navigate to '/resources/play/collection' if user is logged in", () => {
    const contentId = '123';
    component.dialCode = 'testDialCode';
    // @ts-ignore
    mockUserService.loggedIn = true;
    component.redirectToDetailsPage(contentId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/resources/play/collection', contentId], {
      queryParams: { contentType: 'TextBook', dialCode: 'testDialCode' },
      state: { action: 'dialcode' }
    });
  });

  it("should navigate to '/play/collection' if user is not logged in", () => {
    const contentId = '123';
    Object.defineProperty(mockUserService, 'loggedIn', {
        get: jest.fn(() => false)
      });
    component.dialCode = 'testDialCode';
    component.redirectToDetailsPage(contentId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/play/collection', contentId], {
      queryParams: { contentType: 'TextBook', dialCode: 'testDialCode' }
    });
  });

  it("should call logInteractEvent with correct telemetry data", () => {
    const telemetryData = {
      id: 'testId',
      type: 'testType',
      subtype: 'testSubtype'
    };
    component.logInteractEvent(telemetryData);
    expect(mockTelemetryService.interact).toHaveBeenCalledWith({
      context: { env: 'test-env', cdata: component.telemetryCdata },
      edata: {
        id: 'testId',
        type: 'testType',
        pageid: 'get-dial',
        subtype: 'testSubtype'
      }
    });
  });

  it("should navigate to '/get/dial' if queryParams.textbook is true and dialCodeResult.count > 1", () => {
    component['dialCodeService'] = { dialCodeResult: { count: 2 } } as any;
    component.handleCloseButton();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/get/dial', 'testDialCode']);
  });

  it("should navigate to '/resources' if user is logged in and previous URL contains 'play'", () => {
      Object.defineProperty(mockUserService, 'loggedIn', {
          get: jest.fn(() => true)
        });
      component.handleCloseButton();
      expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it("should navigate to '/explore' if user is not logged in and previous URL contains 'play'", () => {
    Object.defineProperty(mockUserService, 'loggedIn', {
          get: jest.fn(() => false)
        });
      component.handleCloseButton();
      expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should remove singleContentRedirect from sessionStorage in ngOnDestroy', () => {
    Object.defineProperty(window, 'EkTelemetry', { value: { config: {} } });
    const removeItemMock = jest.fn();
    Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: removeItemMock,
          clear: jest.fn(),
        },
      });

    component.ngOnDestroy();
    expect(removeItemMock).toHaveBeenCalledWith('singleContentRedirect');
  });

  it('should set showMobilePopup to true after 500ms if showMobilePopUp is not set in localStorage', () => {
    jest.useFakeTimers();
    const localStorageMock = { getItem: jest.fn(), setItem: jest.fn() };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    component.handleMobilePopupBanner();
    jest.advanceTimersByTime(500);
    expect(component.showMobilePopup).toBeTruthy();
  });

  it('should not set showMobilePopup to true if showMobilePopUp is set in localStorage', () => {
    const localStorageMock = { getItem: jest.fn().mockReturnValue('someValue'), setItem: jest.fn() };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    component.handleMobilePopupBanner();
    expect(component.showMobilePopup).toBeFalsy();
  });

  it('should initialize component properties correctly', () => {
    const params = {
      source: 'someSource',
      textbook: true,
      dialCode: 'testDialCode'
    };
    jest.spyOn(component, 'handleMobilePopupBanner')
    jest.spyOn(component, 'setTelemetryData');
    jest.spyOn(component, 'inview');

    component['initialize'](params);
    expect(EkTelemetry.config.batchsize).toEqual(2);
    expect(component.isBrowse).toBeFalsy();
    expect(component.dialSearchSource).toEqual('someSource');
    expect(component.isTextbookDetailsPage).toBeTruthy();
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.searchResults).toEqual([]);
    expect(component.dialCode).toEqual('testDialCode');
    expect(component.showLoader).toBeTruthy();
    expect(component.instance).toEqual(expect.any(String));
    expect(component.handleMobilePopupBanner).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.inview).toHaveBeenCalledWith({ inview: [] });
  });

  describe('logTelemetryEvents', () => {
    it('should log telemetry event with the correct status', () => {
      const status = true;
      jest.spyOn(mockTelemetryService, 'log').mockImplementation();
      component.logTelemetryEvents(status);
      expect(mockTelemetryService.log).toHaveBeenCalled();
    });
  });

  describe('updateCardData', () => {
    it('should update download status for each item in itemsToDisplay', () => {
      const downloadListdata = { };
      const mockItem = { id: '1', title: 'Mock Item', contentType: 'Textbook' };
      component.itemsToDisplay = [mockItem];
      const updateDownloadStatusSpy = jest.spyOn(component.publicPlayerService, 'updateDownloadStatus').mockReturnValue({});
      component.updateCardData(downloadListdata);
      expect(updateDownloadStatusSpy).toHaveBeenCalledWith(downloadListdata, mockItem);
    });
  });

  it('should process dial code successfully', () => {
    const params = { dialCode: 'testDialCode' };
    const responseData = { content: [], collections: [] };

    jest.spyOn(component, 'logInteractEvent');
    jest.spyOn(component, 'logTelemetryEvents');
    jest.spyOn(mockDialCodeService, 'searchDialCodeAssemble').mockReturnValue(of(responseData) as any);

    component['processDialCode'](params).subscribe(() => {
      expect(component.logInteractEvent).toHaveBeenCalledWith({
        id: 'search-dial-success',
        type: 'view',
        subtype: 'auto',
      });
      expect(component.logTelemetryEvents).toHaveBeenCalledWith(true);
      expect(component.showSelectChapter).toBeFalsy();
    });
  });

  it('should process dial code successfully with empty result', () => {
    const params = { dialCode: 'testDialCode' };
    const responseData = { content: [], collections: [] };
    jest.spyOn(mockDialCodeService, 'searchDialCodeAssemble' as any).mockReturnValue(of(responseData));
    jest.spyOn(mockDialCodeService, 'filterDialSearchResults' as any).mockReturnValue(of([]));

    component['processDialCode'](params).subscribe(() => {
      expect(component.showSelectChapter).toBeFalsy();
    });
  });


  it('should handle error during dial code processing', () => {
    const params = { dialCode: 'testDialCode' };
    const error = new Error('Search failed');

    jest.spyOn(component, 'logInteractEvent');
    jest.spyOn(component, 'logTelemetryEvents');
    jest.spyOn(mockDialCodeService, 'searchDialCodeAssemble').mockReturnValue(throwError(error));

    component['processDialCode'](params).subscribe(() => {
      expect(component.logInteractEvent).toHaveBeenCalledWith({
        id: 'search-dial-failed',
        type: 'view',
        subtype: 'auto',
      });
      expect(component.logTelemetryEvents).toHaveBeenCalledWith(false);
      expect(component.showSelectChapter).toBeFalsy();
    });
  });

  it('should append items correctly when scrolling down', () => {
    component.itemsToLoad = 0;
    component.numOfItemsToAddOnScroll = 3;
    component.searchResults = [{ contentType: 'course' }, { contentType: 'textbook' }, { contentType: 'course' }];
    component.onScrollDown();
    expect(component.itemsToLoad).toBe(3);
    expect(component.itemsToDisplay.length).toBe(3);
    expect(component.courseList.length).toBe(2);
    expect(component.textbookList.length).toBe(1);
  });

  it('should initialize component and load data', () => {
    jest.spyOn(component, 'initLayout');
    jest.spyOn(component.cslFrameworkService, 'transformDataForCC').mockReturnValue([]);

    component.ngOnInit();

    expect(component.categoryKeys).toEqual([]);
    expect(mockUtilService.getDataForCard).toHaveBeenCalled();
  });

  it('should set localStorage and hide popup when isRedirectToDikshaApp is false', () => {
    const localStorageMock = {
      setItem: jest.fn()
    };
    component.isRedirectToDikshaApp = false;
    const interactSpy = jest.spyOn(component.telemetryService, 'interact');
    const popupElementMock = document.createElement('div');
    popupElementMock.className = 'mobile-app-popup';
    const dimmerElementMock = document.createElement('div');
    dimmerElementMock.className = 'mobile-popup-dimmer';
    jest.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
      if (selector === '.mobile-app-popup') return popupElementMock;
      if (selector === '.mobile-popup-dimmer') return dimmerElementMock;
      return null;
    });
    component.closeMobileAppPopup();
    expect(localStorage.setItem).toHaveBeenCalledWith('showMobilePopUp', 'true');
    expect(interactSpy).toHaveBeenCalledWith(component.closeMobilePopupInteractData);
    expect(popupElementMock.style.bottom).toBe('-999px');
    expect(dimmerElementMock.style.display).toBe('none');
  });

  it('should handle errors when fetching enrolled courses', () => {
    const metaData = { };
    const error = new Error('Failed to fetch enrolled courses');
    jest.spyOn(mockCoursesService, 'getEnrolledCourses').mockReturnValue(throwError(error));

    component.playCourse({ section: null, data: metaData });
    expect(mockPublicPlayerService.playContent).toHaveBeenCalledWith(metaData);
  });

  it('should navigate to collection page if mimeType is collection and has childTextbookUnit', () => {
    const event = {
      data: {
        metaData: {
          mimeType: 'collection',
          identifier: 'collectionId',
          childTextbookUnit: {
            identifier: 'childTextbookUnitId'
          },
          l1Parent: 'l1ParentId'
        }
      }
    };

    const routerSpy = jest.spyOn(mockRouter, 'navigate').mockReturnValue(Promise.resolve(true));
    component.getEvent(event);
    expect(routerSpy).toHaveBeenCalledWith(['play/content', 'collectionId'], expect.any(Object));
  });

  it('should navigate to collection page if mimeType is collection and does not have childTextbookUnit', () => {
    const event = {
      data: {
        metaData: {
          mimeType: 'collection',
          identifier: 'collectionId',
          l1Parent: 'l1ParentId'
        }
      }
    };
    const routerSpy = jest.spyOn(mockRouter, 'navigate').mockReturnValue(Promise.resolve(true));
    component.getEvent(event);

    expect(routerSpy).toHaveBeenCalledWith(['play/content', event.data.metaData.identifier], expect.any(Object));
  });

  it('should update inviewLogs and telemetryImpression properties', () => {
    const event = {
        inview: [
            {
                id: 1,
                data: {
                    metaData: {
                        identifier: 'contentId1',
                        contentType: 'lesson'
                    }
                }
            },
            {
                id: 2,
                data: {
                    metaData: {
                        identifier: 'contentId2'
                    }
                }
            }
        ]
    };

    component.telemetryImpression = {
        edata: {}
    } as any;
    component.inview(event);

    expect(component.inviewLogs).toEqual([
        { objid: 'contentId1', objtype: 'lesson', index: 1 },
        { objid: 'contentId2', objtype: 'content', index: 2 }
    ]);

    expect(component.telemetryImpression.edata.visits).toEqual([
        { objid: 'contentId1', objtype: 'lesson', index: 1 },
        { objid: 'contentId2', objtype: 'content', index: 2 }
    ]);
    expect(component.telemetryImpression.edata.pageid).toBe('mockPageId');
    expect(component.telemetryImpression.edata.subtype).toBe('pageexit');
  });

  it('should redirect to Diksha app with correct parameters', () => {
    const mockApplink = 'mockApplink';
    const mockUtmSource = 'diksha-mockSlug';
    const mockUtmMedium = 'mockDialSearchSource';
    const mockCampaign = 'dial';
    const mockTerm = 'mockDialCode';

    component.isRedirectToDikshaApp = false;
    const telemetryServiceSpy = jest.spyOn(component.telemetryService, 'interact').mockImplementation();
    component.configService.appConfig = {
        UrlLinks: {
            downloadDikshaApp: mockApplink
        }
    };
    // @ts-ignore
    component.userService.slug = 'mockSlug';
    component.dialSearchSource = 'mockDialSearchSource';
    component.dialCode = mockTerm;
    const originalLocationHref = window.location.href;
    Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true
    });

    component.redirectToDikshaApp();

    expect(component.isRedirectToDikshaApp).toBe(true);
    expect(telemetryServiceSpy).toHaveBeenCalledWith(component.appMobileDownloadInteractData);

    const expectedApplink = `${mockApplink}&utm_source=${mockUtmSource}&utm_medium=${mockUtmMedium}&utm_campaign=${mockCampaign}&utm_term=${mockTerm}`;
    expect(window.location.href).toBe(expectedApplink);
    window.location.href = originalLocationHref;
  });

});

