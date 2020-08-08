import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreModule, OrgDetailsService, SearchService, UserService, CoursesService, PlayerService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import {
  ConfigService,
  NavigationHelperService,
  ResourceService,
  SharedModule,
  ToasterService,
  UtilService,
  LayoutService
} from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';
import { of as observableOf, throwError, of } from 'rxjs';
import { mockData } from '../../services';
import { DialCodeService } from '../../services/dial-code/dial-code.service';
import { DialCodeComponent } from './dial-code.component';
import { Response } from './dial-code.component.spec.data';

describe('DialCodeComponent', () => {
  let component: DialCodeComponent;
  let fixture: ComponentFixture<DialCodeComponent>;
  let navigationHelperService: any;
  let router: any;
  let toasterService: any;
  let dialCodeService: any;
  let searchService: any;
  let utilService: any;
  let userService: any;
  let telemetryService: any;
  let activatedRoute: any;
  let config: any;
  let constantData: any;
  let metaData: any;
  let dynamicFields: any;

  const resourceBundle = {
    'frmelmnts': {
      'instn': {
        't0015': 'Upload Organization',
        't0016': 'Upload User'
      },
      'lbl': {
        'medium': 'Medium',
        'class': 'Class',
        'subject': 'subject'
      },
    },
    'messages': {
      'stmsg': {
        'm0007': 'Search for something else',
        'm0006': 'No result',
        'm0112': 'Content coming soon'
      },
      'fmsg': {
        'm0049': 'Fetching serach result failed'
      }
    },
    languageSelected$: observableOf({})
  };
  const fakeActivatedRoute = {
    'params': observableOf({ dialCode: 'T4S6T3' }),
    'queryParams': observableOf({}),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      },
      params: {
        dialCode: 'T4S6T3'
      },
      queryParams: {}
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = 'browse';
  }
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      declarations: [DialCodeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SearchService, UtilService, ConfigService, OrgDetailsService, UserService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }, LayoutService,
        DialCodeService, TelemetryService, ToasterService, NavigationHelperService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialCodeComponent);
    component = fixture.componentInstance;
    searchService = TestBed.get(SearchService);
    utilService = TestBed.get(UtilService);
    config = TestBed.get(ConfigService);
    router = TestBed.get(Router);
    constantData = config.appConfig.GetPage.constantData;
    metaData = config.appConfig.GetPage.metaData;
    dynamicFields = config.appConfig.GetPage.dynamicFields;
    navigationHelperService = TestBed.get(NavigationHelperService);
    dialCodeService = TestBed.get(DialCodeService);
    activatedRoute = TestBed.get(ActivatedRoute);
    userService = TestBed.get(UserService);
    toasterService = TestBed.get(ToasterService);
    telemetryService = TestBed.get(TelemetryService);
    spyOn<any>(component, 'processTextBook').and.callThrough();
    spyOn<any>(component, 'initialize').and.callThrough();
    spyOn<any>(component, 'handleMobilePopupBanner').and.callThrough();
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'appendItems').and.callThrough();
    spyOn(component, 'setTelemetryData').and.callThrough();
    spyOn(telemetryService, 'interact');
    spyOn(telemetryService, 'impression');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnInit();
  });

  it('Input data (dial-code) should not be empty', () => {
    expect(component).toBeTruthy();
    expect(component['initialize']).toHaveBeenCalledWith({ dialCode: 'T4S6T3' });
  });

  it('should call component initialization', () => {
    expect(component['initialize']).toHaveBeenCalled();
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.searchResults).toEqual([]);
    expect(component.showLoader).toBeTruthy();
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.handleMobilePopupBanner).toHaveBeenCalled();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });

  it('should call API to get content details for the dial-code', () => {
    component['processDialCode']({ dialCode: '123' }).subscribe(() => {
      expect(dialCodeService.searchDialCodeAssemble).toHaveBeenCalled();
      expect(dialCodeService.searchDialCodeAssemble).toHaveBeenCalledWith('123', false);
      expect(dialCodeService.searchDialCodeAssemble).toHaveBeenCalledTimes(1);
    });
  });

  it('Dial code search API call should generate telemetry interact event', () => {
    component['processDialCode']({ dialCode: '123' }).subscribe(() => {
      expect(component.showSelectChapter).toBeFalsy();
      expect(this.telemetryService.interact).toHaveBeenCalled();
      expect(this.telemetryService.interact).toHaveBeenCalledWith({
        context: { env: 'get', cdata: [] },
        edata: {
          id: 'search-dial-success',
          type: 'view',
          subtype: 'auto',
          pageid: 'get-dial'
        }
      });
    });
  });

  it('should return appropriate message on no contents', () => {
    spyOn<any>(component, 'processDialCode').and.returnValue(observableOf([]));
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.showLoader).toBeTruthy();
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.searchResults).toEqual([]);
    component['processDialCode']({ dialCode: undefined }).subscribe((result) => {
      expect(result).toBeDefined();
    });
  });

  it('should return appropriate failure message on error throw', () => {
    spyOn<any>(component, 'processDialCode').and.returnValue(throwError([]));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0049);
  });

  it('On getting valid response for the dial code, should display contents', () => {
    spyOn(dialCodeService, 'searchDialCodeAssemble').and.callFake(() => observableOf(mockData.dialCodeSearchApiResponse.result));
    spyOn(dialCodeService, 'filterDialSearchResults').and.returnValue(observableOf({
      'collections': mockData.dialCodeSearchApiResponse.result.response.sections[0].collections,
      'contents': []
    }));
    component.setTelemetryData();
    component['processDialCode']({ dialCode: '123' }).subscribe(result => {
      expect(result).toBeDefined();
    });
  });

  it('should call getDataForCard Method to pass the data in Card ', () => {
    spyOn(dialCodeService, 'searchDialCodeAssemble').and.returnValue(mockData.dialCodeSearchApiResponse);
    spyOn(dialCodeService, 'filterDialSearchResults').and.returnValue(observableOf({
      'collections': mockData.dialCodeSearchApiResponse.result.response.sections[0].collections,
      'contents': []
    }));
    spyOn(utilService, 'getDataForCard').and.callThrough();
    component.ngOnInit();
    const searchResults = utilService.getDataForCard(Response.successData.result.content, constantData, dynamicFields, metaData);
    fixture.detectChanges();
    expect(utilService.getDataForCard).toHaveBeenCalled();
    expect(utilService.getDataForCard).toHaveBeenCalledWith(Response.successData.result.content, constantData, dynamicFields, metaData);
    expect(component.searchResults).toEqual([]);
    expect(component.showLoader).toBeFalsy();
  });

  it('should fetch more cards on scroll down', () => {
    component.onScrollDown();
    fixture.detectChanges();
    expect(component.appendItems).toHaveBeenCalledWith(50, 70);
    expect(component.itemsToLoad).toEqual(70);
  });

  it('should append the items to display list', () => {
    component.searchResults = [{ name: 'textbook', contentType: 'textbook' }, { name: 'Course', contentType: 'course' }];
    component.appendItems(0, 1);
    fixture.detectChanges();
    expect(component.itemsToDisplay).toBeDefined();
  });

  it('should be called whenever user clicks on a textbook', () => {
    activatedRoute.queryParams = observableOf({ textbook: '"do_212925261140451328114"' });
    spyOn(dialCodeService, 'getAllPlayableContent').and.returnValue(observableOf([]));
    component.ngOnInit();
    expect(component['processTextBook']).toHaveBeenCalled();
    expect(component['processTextBook']).toHaveBeenCalledTimes(1);
    expect(component['processTextBook']).toHaveBeenCalledWith({
      dialCode: 'T4S6T3',
      textbook: '"do_212925261140451328114"'
    });
  });

  it(`should redirect the user to get page if invalid textbook id is entered in the url which is not
  associated with the dialcode`, () => {
    activatedRoute.queryParams = observableOf({ textbook: '"do_212925261140451328114"' });
    dialCodeService['dialSearchResults'] = mockData.dialCodeSearchApiResponse.result;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/get/dial', 'T4S6T3']);
    expect(component.searchResults).toEqual([]);
    expect(component.showLoader).toBeFalsy();
  });

  it('should call collection hierarchy if user clicks on valid textbook', () => {
    activatedRoute.queryParams = observableOf({ textbook: 'do_212925261140451328114' });
    spyOn(dialCodeService, 'getAllPlayableContent').and.returnValue({
      'collection': [],
      'contents': []
    });
    dialCodeService.getAllPlayableContent(['do_212925261140451328114']);
    dialCodeService.getCollectionHierarchy('do_212925261140451328114', false);
    dialCodeService['dialSearchResults'] = mockData.dialCodeSearchApiResponse.result;
    fixture.detectChanges();
    component.ngOnInit();
    expect(dialCodeService.getAllPlayableContent).toHaveBeenCalled();
    expect(dialCodeService.getAllPlayableContent).toHaveBeenCalledWith(['do_212925261140451328114']);
  });

  it('should redirect to collection page when close button is clicked from flattened page', () => {
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue({ url: '/get' });
    activatedRoute.snapshot.queryParams['textbook'] = '123';
    dialCodeService['dialSearchResults'] = { count: 2 };
    component.handleCloseButton();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/get/dial', fakeActivatedRoute.snapshot.params.dialCode]);
  });

  it('should redirect to previous opened url (not content play page) if close button is clicked from collections page', () => {
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue({ url: '/get' });
    activatedRoute.snapshot.queryParams['textbook'] = '123';
    dialCodeService['dialSearchResults'] = { count: 2 };
    component.handleCloseButton();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/get/dial', 'T4S6T3']);
  });

  it('should redirect to explore page if user is not logged in and previous url was content play page', () => {
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue({ url: '/play/content/do_212925261140451328114' });
    activatedRoute.snapshot.queryParams['textbook'] = '123';
    dialCodeService['dialSearchResults'] = { count: 2 };
    component.handleCloseButton();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/get/dial', 'T4S6T3']);
  });

  it('should redirect to resource page if user is logged in and previous url was content play page', () => {
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue({ url: '/play/content/do_212925261140451328114' });
    activatedRoute.snapshot.queryParams['textbook'] = '123';
    dialCodeService['dialSearchResults'] = { count: 2 };
    component.handleCloseButton();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/get/dial', 'T4S6T3']);
  });

  it('should redirect to flattened DIAL page without /resource ', () => {
    component.dialCode = 'T4S6T3';
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
    component.redirectToDetailsPage('do_212925261140451328114');
    expect(component.router.navigate).toHaveBeenCalledWith(['/play/collection', 'do_212925261140451328114'],
      { queryParams: { contentType: 'TextBook', 'dialCode': 'T4S6T3' } });
  });

  it('should redirect to flattened DIAL page with /resource ', () => {
    component.dialCode = 'T4S6T3';
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    component.redirectToDetailsPage('do_212925261140451328114');
    expect(component.router.navigate).toHaveBeenCalledWith(['/resources/play/collection', 'do_212925261140451328114'],
      {
        queryParams: { contentType: 'TextBook', 'dialCode': 'T4S6T3' },
        state: { action: 'dialcode' }
      });
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should navigate to back page on click of back button', () => {
    spyOn(navigationHelperService, 'getPreviousUrl').and.returnValue({ url: '/get' });
    activatedRoute.snapshot.queryParams['textbook'] = '123';
    dialCodeService['dialSearchResults'] = { count: 2 };
    component.goBack();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/get/dial', fakeActivatedRoute.snapshot.params.dialCode]);
  });
  it('should navigate to back resources page on click of back button', () => {
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    component.goBack();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/resources']);
  });
  it('should navigate to back to explore page on click of back button', () => {
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
    component.goBack();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/explore']);
  });
  it('should play content', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    spyOn(publicPlayerService, 'playExploreCourse');
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
    component.playCourse({ section: {}, data: {} });
    expect(publicPlayerService.playExploreCourse).toHaveBeenCalled();
  });
  it('should play content from explore page, while logged in', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    const coursesService = TestBed.get(CoursesService);
    spyOn(publicPlayerService, 'playExploreCourse');
    spyOn(coursesService, 'getEnrolledCourses').and.returnValue(throwError({}));
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    component.playCourse({ section: {}, data: {} });
    expect(publicPlayerService.playExploreCourse).toHaveBeenCalled();
  });
  it('should play content from explore page, while logged in', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    const coursesService = TestBed.get(CoursesService);
    spyOn(publicPlayerService, 'playExploreCourse');
    spyOn(coursesService, 'getEnrolledCourses').and.returnValue(throwError({}));
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    component.playCourse({ section: {}, data: {} });
    expect(publicPlayerService.playExploreCourse).toHaveBeenCalled();
  });
  it('should play content from explore page, while logged in, for onGoingBatch', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    const coursesService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const returnValue = {
      onGoingBatchCount: 1,
      expiredBatchCount: 0,
      openBatch: {
        ongoing: [{ batchId: 1213421 }]
      },
      inviteOnlyBatch: false
    };
    spyOn(publicPlayerService, 'playExploreCourse');
    spyOn(coursesService, 'getEnrolledCourses').and.returnValue(of({}));
    spyOn(playerService, 'playContent');
    spyOn(coursesService, 'findEnrolledCourses').and.returnValue(returnValue);
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    component.playCourse({ section: {}, data: {} });
    expect(playerService.playContent).toHaveBeenCalled();
  });
  it('should play content from explore page, while logged in, non enrolled user', () => {
    const publicPlayerService = TestBed.get(PublicPlayerService);
    const coursesService = TestBed.get(CoursesService);
    const playerService = TestBed.get(PlayerService);
    const returnValue = {
      onGoingBatchCount: 0,
      expiredBatchCount: 0,
      openBatch: true,
      inviteOnlyBatch: false
    };
    spyOn(publicPlayerService, 'playExploreCourse');
    spyOn(coursesService, 'getEnrolledCourses').and.returnValue(of({}));
    spyOn(playerService, 'playContent');
    spyOn(coursesService, 'findEnrolledCourses').and.returnValue(returnValue);
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    component.playCourse({ section: {}, data: {} });
    expect(playerService.playContent).toHaveBeenCalled();
  });
  it('should log all viewport items', () => {
    const event = {
      inview: Response.inview
    };
    component.inview(event);
    expect(component.telemetryImpression).toBeDefined();
  });
  it('should navigate to player page for non-collection type', () => {
    const event = {
      data: {
        metaData: {
          mimeType: 'application/pdf'
        }
      }
    };
    component.getEvent(event);
    expect(component.redirectCollectionUrl).toEqual('play/collection');
    expect(component.redirectContentUrl).toEqual('play/content');
    expect(router.navigate).toHaveBeenCalled();
  });
  it('should navigate to player page for collection type', () => {
    const event = {
      data: {
        metaData: {
          mimeType: 'application/vnd.ekstep.content-collection'
        }
      }
    };
    component.getEvent(event);
    expect(component.redirectCollectionUrl).toEqual('play/collection');
    expect(component.redirectContentUrl).toEqual('play/content');
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call init layout on component intilization', () => {
    spyOn(component, 'initLayout');
    component.ngOnInit();
    expect(component.initLayout).toHaveBeenCalled();
  });

  it('should call init layout on component intilization for old layout', () => {
    const layoutService = TestBed.get(LayoutService);
    spyOn(layoutService, 'switchableLayout').and.returnValue(of({layout: {data: 'data'}}));
    component.ngOnInit();
    expect(component.layoutConfiguration).toEqual({data: 'data'});
  });
});
