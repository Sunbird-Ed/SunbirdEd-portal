import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, UtilService, ConfigService } from '@sunbird/shared';
import { SearchService, OrgDetailsService } from '@sunbird/core';
import { CoreModule } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialCodeComponent } from './dial-code.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from './dial-code.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';

describe('DialCodeComponent', () => {
  let component: DialCodeComponent;
  let fixture: ComponentFixture<DialCodeComponent>;
  const resourceBundle = {
    'frmelmnts': {
      'instn': {
        't0015': 'Upload Organization',
        't0016': 'Upload User'
      },
      'lbl' : {
        'medium': 'Medium',
        'class' : 'Class',
        'subject' : 'subject'
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
    'queryParams': observableOf(),
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
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot()],
      declarations: [DialCodeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SearchService, UtilService, ConfigService, OrgDetailsService,
        { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialCodeComponent);
    component = fixture.componentInstance;
  });

  it('should return matching contents for valid dialcode query', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.successData));
    component.searchDialCode();
    fixture.detectChanges();
    expect(component.showLoader).toBeTruthy();
  });
  it('should return appropriate message on no contents', () => {
    const searchService = TestBed.get(SearchService);
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.noData));
    component.searchDialCode();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.searchResults).toEqual([]);
  });
  it('should return appropriate failure message on error throw', () => {
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'contentSearch').and.callFake(() => observableThrowError(new Error('Server error')));
    component.searchDialCode();
    fixture.detectChanges();
    expect(component.showLoader).toBeFalsy();
    expect(component.searchResults).toEqual([]);
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
    spyOn(searchService, 'contentSearch').and.callFake(() => observableOf(Response.successData));
    spyOn(component, 'searchDialCode').and.callThrough();
    spyOn(utilService, 'getDataForCard').and.callThrough();
    component.searchDialCode();
    const searchResults = utilService.getDataForCard(Response.successData.result.content, constantData, dynamicFields, metaData);
    fixture.detectChanges();
    expect(utilService.getDataForCard).toHaveBeenCalled();
    expect(utilService.getDataForCard).toHaveBeenCalledWith(Response.successData.result.content, constantData, dynamicFields, metaData);
    expect(component.searchResults).toEqual([]);
    expect(component.showLoader).toBeTruthy();
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

  it('showDownloadLoader to be true' , () => {
    spyOn(component, 'startDownload');
    component.isOffline = true;
    expect(component.showDownloadLoader).toBeFalsy();
    component.getEvent(Response.download_event);
    expect(component.showDownloadLoader).toBeTruthy();
  });
});
