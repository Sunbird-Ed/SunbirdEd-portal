import { throwError as observableThrowError, of as observableOf, Observable, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, UtilService, ConfigService, ToasterService } from '@sunbird/shared';
import { SearchService, OrgDetailsService, UserService } from '@sunbird/core';
import { CoreModule } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialCodeComponent } from './dial-code.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from './dial-code.component.spec.data';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { DialCodeService, mockData } from '../../services';

describe('DialCodeComponent', () => {
  let component: DialCodeComponent;
  let fixture: ComponentFixture<DialCodeComponent>;
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
    'params': observableOf({ dialCode: '61U24C' }),
    'queryParams': observableOf({}),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      },
      params: {
        dialCode: '61U24C'
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = 'browse';
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      declarations: [DialCodeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SearchService, UtilService, ConfigService, OrgDetailsService, UserService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        DialCodeService, TelemetryService, ToasterService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialCodeComponent);
    component = fixture.componentInstance;
  });

  it('should return matching contents for valid dialcode query', () => {
    const dialCodeService = TestBed.get(DialCodeService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact');
    spyOn(telemetryService, 'impression');
    spyOn(dialCodeService, 'searchDialCode').and.callFake(() => observableOf(mockData.dialCodeSearchApiResponse.result));
    spyOn(dialCodeService, 'filterDialSearchResults').and.returnValue(observableOf({
      'collection': mockData.dialCodeSearchApiResponse.result.collections,
      'contents': []
    }));
    component.setTelemetryData();
    component['processDialCode']({ dialCode: '123' }).subscribe(result => {
      expect(dialCodeService.searchDialCode).toHaveBeenCalled();
      expect(dialCodeService.searchDialCode).toHaveBeenCalledWith('123', false);
      expect(dialCodeService.searchDialCode).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(component.showSelectChapter).toBeFalsy();
      expect(telemetryService.interact).toHaveBeenCalled();
      expect(telemetryService.interact).toHaveBeenCalledWith({
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

  it('should init the component when dial scan happens', () => {
    spyOn<any>(component, 'initialize').and.callThrough();
    spyOn<any>(component, 'processDialCode').and.returnValue(observableOf([]));
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.ngOnInit();
    expect(component['initialize']).toHaveBeenCalled();
    expect(component['initialize']).toHaveBeenCalledWith({ dialCode: '61U24C' });
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.showLoader).toBeFalsy();
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.setTelemetryData).toHaveBeenCalled();
    expect(component.searchResults).toEqual([]);
  });

  it('should return appropriate message on no contents', () => {
    spyOn<any>(component, 'initialize').and.callThrough();
    spyOn<any>(component, 'processDialCode').and.returnValue(observableOf([]));
    component.ngOnInit();
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.showLoader).toBeFalsy();
    expect(component.itemsToDisplay).toEqual([]);
    expect(component.searchResults).toEqual([]);
  });
  it('should return appropriate failure message on error throw', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn<any>(component, 'initialize').and.callThrough();
    spyOn<any>(component, 'processDialCode').and.returnValue(throwError([]));
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.fmsg.m0049);
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
  it('should call getDataForCard Method to pass the data in Card ', () => {
    const searchService = TestBed.get(SearchService);
    const utilService = TestBed.get(UtilService);
    const config = TestBed.get(ConfigService);
    const constantData = config.appConfig.GetPage.constantData;
    const metaData = config.appConfig.GetPage.metaData;
    const dynamicFields = config.appConfig.GetPage.dynamicFields;
    const dialCodeService = TestBed.get(DialCodeService);
    spyOn(dialCodeService, 'searchDialCode').and.returnValue(mockData.dialCodeSearchApiResponse);
    spyOn(dialCodeService, 'filterDialSearchResults').and.returnValue(observableOf({
      'collection': mockData.dialCodeSearchApiResponse.result.collections,
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

  it('should fetch more cards on scroll', () => {
    spyOn(component, 'appendItems').and.callThrough();
    component.onScrollDown();
    fixture.detectChanges();
    expect(component.appendItems).toHaveBeenCalledWith(50, 70);
    expect(component.itemsToLoad).toEqual(70);
  });

  xit('should append the items to display list', () => {
    component.searchResults = ['one', 'two'];
    component.appendItems(0, 1);
    fixture.detectChanges();
    expect(component.itemsToDisplay).toEqual(['one']);
  });

  it('showDownloadLoader to be true', () => {
    spyOn(component, 'startDownload');
    component.isOffline = true;
    expect(component.showDownloadLoader).toBeFalsy();
    component.getEvent(Response.download_event);
    expect(component.showDownloadLoader).toBeTruthy();
  });

  it('should redirect to flattened DIAL page with /resource ', () => {
    const userService = TestBed.get(UserService);
    component.dialCode = 'D4R4K4';
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(true);
    component.redirectToDetailsPage('do_21288543692132352012128');
    expect(component.router.navigate).toHaveBeenCalledWith(['/resources/play/collection', 'do_21288543692132352012128'],
      {
        queryParams: { contentType: 'TextBook', 'dialCode': 'D4R4K4' },
        state: { action: 'dialcode' }
      });
  });

  it('should redirect to flattened DIAL page without /resource ', () => {
    component.dialCode = 'D4R4K4';
    const userService = TestBed.get(UserService);
    spyOnProperty(userService, 'loggedIn', 'get').and.returnValue(false);
    component.redirectToDetailsPage('do_21288543692132352012128');
    expect(component.router.navigate).toHaveBeenCalledWith(['/play/collection', 'do_21288543692132352012128'],
      { queryParams: { contentType: 'TextBook', 'dialCode': 'D4R4K4' } });
  });

  describe('processTextBook function', () => {

    it('should be called whenever user clicks on a book', () => {
      const activatedRoute = TestBed.get(ActivatedRoute);
      activatedRoute.queryParams = observableOf({ textbook: 'do_21288543692132352012128' });
      const dialCodeService = TestBed.get(DialCodeService);
      spyOn(dialCodeService, 'getAllPlayableContent').and.returnValue(observableOf([]));
      spyOn<any>(component, 'processTextBook');
      component.ngOnInit();
      expect(component['processTextBook']).toHaveBeenCalled();
      expect(component['processTextBook']).toHaveBeenCalledTimes(1);
      expect(component['processTextBook']).toHaveBeenCalledWith({
        dialCode: '61U24C',
        textbook: 'do_21288543692132352012128'
      });
    });

    it(`should redirect the user to get page if invalid textbook id is entered in the url which is not
      associated with the dialcode`, () => {
      const activatedRoute = TestBed.get(ActivatedRoute);
      const router = TestBed.get(Router);
      activatedRoute.queryParams = observableOf({ textbook: 'do_21288543692132352012129' });
      const dialCodeService = TestBed.get(DialCodeService);
      spyOn<any>(component, 'processTextBook').and.callThrough();
      dialCodeService['dialSearchResults'] = mockData.dialCodeSearchApiResponse.result;
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/get/dial', '61U24C']);
      expect(component.searchResults).toEqual([]);
      expect(component.showLoader).toBeFalsy();
    });

    it(`should call collection hierarchy if user valid textbook is clicked`, () => {
      const activatedRoute = TestBed.get(ActivatedRoute);
      const telemetryService = TestBed.get(TelemetryService);
      spyOn(telemetryService, 'impression');
      activatedRoute.queryParams = observableOf({ textbook: 'do_2124791820965806081846' });
      const dialCodeService = TestBed.get(DialCodeService);
      spyOn(dialCodeService, 'getAllPlayableContent').and.returnValue(observableOf([]));
      spyOn<any>(component, 'processTextBook').and.callThrough();
      dialCodeService['dialSearchResults'] = mockData.dialCodeSearchApiResponse.result;
      fixture.detectChanges();
      component.ngOnInit();
      expect(dialCodeService.getAllPlayableContent).toHaveBeenCalled();
      expect(dialCodeService.getAllPlayableContent).toHaveBeenCalledWith(['do_2124791820965806081846']);
    });
  });

});
