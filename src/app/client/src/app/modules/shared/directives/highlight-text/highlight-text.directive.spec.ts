import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { CacheService } from 'ng2-cache-service';
import { BehaviorSubject } from 'rxjs';
import { BrowserCacheTtlService } from '../../services';
import { HighlightTextDirective } from './highlight-text.directive';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('HighlightTextDirective', () => {
  let highlightTextDirective: HighlightTextDirective;
  configureTestSuite();
  class ResourceServiceStub {
    private _languageSelected = new BehaviorSubject<any>({});
    languageSelected$ = this._languageSelected.asObservable();
    frmelmnts = { lbl: { forSearch: 'this is demo text' } };
  }
  beforeEach(() => {
    const elementRefStub = { nativeElement: { 'lang': 'en', 'dir': 'ltr' } };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
                  loader: {
                    provide: TranslateLoader,
                    useClass: TranslateFakeLoader
                  }
                })],
      providers: [HttpClientTestingModule, HttpClient, HttpHandler, CacheService, BrowserCacheTtlService,
        HighlightTextDirective, ConfigService,
        { provide: ElementRef, useValue: elementRefStub },
        { provide: ResourceService, useClass: ResourceServiceStub }
      ]
    });
    highlightTextDirective = TestBed.get(HighlightTextDirective);
  });

  it('can load instance', () => {
    expect(highlightTextDirective).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    highlightTextDirective.config = { resourcePath: 'frmelmnts.lbl.forSearch', key: 'demo', value: 'sample' };
    spyOn(highlightTextDirective, 'highlightText');
    spyOn(highlightTextDirective, 'detectLanguageChange');
    highlightTextDirective.ngOnInit();
    expect(highlightTextDirective.highlightText).toHaveBeenCalled();
    expect(highlightTextDirective.detectLanguageChange).toHaveBeenCalled();
  });

  it('should call highlightText', () => {
    highlightTextDirective.highlightText('this is demo text', 'demo', 'sample');
    expect(highlightTextDirective['elRef'].nativeElement.innerHTML).toBeDefined();
    expect(highlightTextDirective['elRef'].nativeElement.innerHTML).toEqual('this is <span class="sb-pageSection-count sb-label sb-label-xs sb-label-error mr-5">sample</span> text');
  });

  it('should call detectLanguageChange', () => {
    const resourceService = TestBed.get(ResourceService);
    highlightTextDirective.config = { resourcePath: 'frmelmnts.lbl.forSearch', key: 'demo', value: 'sample' };
    resourceService._languageSelected.next({ 'value': 'en', 'name': 'English', 'dir': 'ltr' });
    spyOn(highlightTextDirective, 'highlightText');
    highlightTextDirective.detectLanguageChange();
    expect(highlightTextDirective.highlightText).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    highlightTextDirective.resourceDataSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
    highlightTextDirective.ngOnDestroy();
    expect(highlightTextDirective.resourceDataSubscription.unsubscribe).toHaveBeenCalled();
  });
});
