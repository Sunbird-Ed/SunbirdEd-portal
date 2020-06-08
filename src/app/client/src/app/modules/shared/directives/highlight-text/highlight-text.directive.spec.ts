import { CacheService } from 'ng2-cache-service';
import { TestBed } from '@angular/core/testing';
import { HighlightTextDirective } from './highlight-text.directive';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { ElementRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserCacheTtlService } from '../../services';
import { configureTestSuite } from '@sunbird/test-util';

describe('HighlightTextDirective', () => {
  let highlightTextDirective: HighlightTextDirective;
  configureTestSuite();
  beforeEach(() => {
    const elementRefStub = { nativeElement: { 'lang': 'en', 'dir': 'ltr' } };
    TestBed.configureTestingModule({
      providers: [HttpClientTestingModule, HttpClient, HttpHandler, CacheService, BrowserCacheTtlService,
        HighlightTextDirective, ConfigService, ResourceService,
        { provide: ElementRef, useValue: elementRefStub }
      ]
    });
    highlightTextDirective = TestBed.get(HighlightTextDirective);
  });

  it('can load instance', () => {
    expect(highlightTextDirective).toBeTruthy();
  });
});
