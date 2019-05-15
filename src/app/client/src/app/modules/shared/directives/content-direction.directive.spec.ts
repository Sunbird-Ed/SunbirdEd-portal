import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../services';
import { ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { CacheService } from 'ng2-cache-service';
import { ContentDirectionDirective } from './content-direction.directive';
import {mockRes} from './content-direction.directive.spec.data';
describe('ContentDirectionDirective', () => {
  let contentDirectionDirective: ContentDirectionDirective;
  beforeEach(() => {
    const configServiceStub = { appConfig: { mediumCode: {'english': 'en'} } };
    const elementRefStub = { nativeElement: { 'lang': 'en', 'dir': 'ltr'} };
    const renderer2Stub = { setAttribute: () => ({}) };
    TestBed.configureTestingModule({
      providers: [
        ContentDirectionDirective, CacheService,
        { provide: ConfigService, useValue: configServiceStub },
        { provide: ElementRef, useValue: elementRefStub },
        { provide: Renderer2, useValue: renderer2Stub }
      ]
    });
    contentDirectionDirective = TestBed.get(ContentDirectionDirective);
  });
  it('can load instance', () => {
    expect(contentDirectionDirective).toBeTruthy();
  });
  describe('ngAfterViewInit', () => {
    it('should take input and set  attribute  ', () => {
      const renderer2: Renderer2 = TestBed.get(Renderer2);
      const cacheService: CacheService = TestBed.get(CacheService);
      contentDirectionDirective.data = mockRes.data;
      cacheService.set('resourcebundlesearch', mockRes.cachedResourcebundleSearch.value , { maxAge: 10 * 60});
      spyOn(renderer2, 'setAttribute').and.callThrough();
      contentDirectionDirective.ngAfterViewInit();
      expect(renderer2.setAttribute).toHaveBeenCalled();
    });
  });
});
