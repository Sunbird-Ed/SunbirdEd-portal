import { ConfigService } from '../services';
import { Directive, ElementRef, Input, AfterViewInit, Renderer2 } from '@angular/core';
import * as _ from 'lodash-es';
import { CacheService } from '../services/cache-service/cache.service';
import { ContentDirectionDirective } from './content-direction.directive';
describe('ContentDirectionDirective', () => {
  let directive: ContentDirectionDirective;
  const mockConfigService: Partial<ConfigService> = {
    appConfig: {
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

  const mockCacheService: Partial<CacheService> = {
    set: jest.fn(),
    get: jest.fn()
  };

  const mockRenderer2: Partial<Renderer2> = {};

  const elRef: Partial<ElementRef> ={};

  beforeEach(() => {
    directive = new ContentDirectionDirective(
      elRef as ElementRef,
      mockRenderer2 as Renderer2,
      mockConfigService as ConfigService,
      mockCacheService as CacheService
    );

  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should set lang and dir attributes based on medium code from configService', () => {
    const data = { medium: 'English' };
    mockRenderer2.setAttribute = jest.fn();

    jest.spyOn(mockCacheService as any, 'get').mockReturnValue([{ range: [{ value: 'en', dir: 'ltr' }] }]);

    directive.data = data;
    directive.ngAfterViewInit();

    expect(mockRenderer2.setAttribute).toHaveBeenCalledWith(elRef.nativeElement, 'lang', 'en');
    expect(mockRenderer2.setAttribute).toHaveBeenCalledWith(elRef.nativeElement, 'dir', 'ltr');
  });

  it('should set lang and dir attributes to default values if medium code not found', () => {
    const data = { medium: 'NonExistentMedium' };
    mockRenderer2.setAttribute = jest.fn();

    jest.spyOn(mockCacheService as any, 'get').mockReturnValue([{ range: [{ value: 'en', dir: 'ltr' }] }]);

    directive.data = data;
    directive.ngAfterViewInit();

    expect(mockRenderer2.setAttribute).toHaveBeenCalledWith(elRef.nativeElement, 'lang', 'en');
    expect(mockRenderer2.setAttribute).toHaveBeenCalledWith(elRef.nativeElement, 'dir', 'ltr');
  });

});
