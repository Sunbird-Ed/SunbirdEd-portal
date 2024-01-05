import { ResourceService } from './resource.service';
import { of } from 'rxjs';

import { of as observableOf, throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import { BrowserCacheTtlService } from './../browser-cache-ttl/browser-cache-ttl.service';
import { HttpOptions, RequestParam, ServerResponse } from './../../interfaces';
import { ConfigService } from './../config/config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as UUID } from 'uuid';
import dayjs from 'dayjs';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import * as _ from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';

describe('ResourceService', () => {
  let resourceService: ResourceService;
  const ObservableData = {
    responseCode: 'OK',
    result: {
      status: 'SUCCESS',
      redirectUrl: '/test'
    }
  };

  const mockConfigService: Partial<ConfigService> = {
    urlConFig: {
      URLS: {
        RESOURCEBUNDLES: {
          ENG: 'mockUrl'
        }
      }
    }
  };

  const mockHttp: Partial<HttpClient> = {
    get: jest.fn().mockReturnValue(of(ObservableData))
  };

  const mockCacheService: Partial<CacheService> = {
    set: jest.fn(),
    get: jest.fn()
  };
  const mockBrowserCacheTtlService: Partial<BrowserCacheTtlService> = {};

  const mockTranslateService: Partial<TranslateService> = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
  };;

 beforeAll(() => {
    resourceService = new ResourceService(
      mockConfigService as ConfigService,
      mockHttp as HttpClient,
      mockCacheService as CacheService,
      mockBrowserCacheTtlService as BrowserCacheTtlService,
      mockTranslateService as TranslateService
    );
  });

  it('should be create a instance of appComponent', () => {
      expect(resourceService).toBeTruthy();
  });

  it('should return the uppercase instance', () => {
    resourceService['_instance'] = 'mockInstance';
    const result = resourceService.instance;
    expect(result).toEqual('MOCK INSTANCE');
  });

  it('should trigger language change with the specified language', () => {
    const mockLanguage = { value: 'fr', label: 'French', dir: 'ltr' };
    resourceService.getLanguageChange(mockLanguage);
    expect(mockTranslateService.use).toHaveBeenCalledWith(mockLanguage.value);
  });

  it('should return the selected language', () => {
    (resourceService as any)._selectedLang = 'mockSelectedLang';
    const selectedLang = resourceService.selectedLang;
    expect(selectedLang).toEqual('mockSelectedLang');
  });

  it('should fetch resource bundle', () => {
    jest.spyOn(resourceService, 'get').mockReturnValue(of({ result: {} } as any));
    jest.spyOn(mockTranslateService, 'use').mockImplementation();
    resourceService.getResource('en', {
      value: 'en',
      label: 'English',
      dir: 'ltr'
    });

    expect(resourceService.get).toHaveBeenCalled();
    expect(mockTranslateService.use).toHaveBeenCalledWith('en');
  });

  it('should initialize with default language', () => {
    jest.spyOn(mockCacheService, 'get').mockReturnValue(undefined);
    jest.spyOn(mockTranslateService, 'setDefaultLang').mockImplementation();
    jest.spyOn(resourceService, 'getResource').mockImplementation();
    resourceService.initialize();
    expect(mockCacheService.get).toHaveBeenCalledWith('portalLanguage');
    expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('en');
    expect(resourceService.getResource).toHaveBeenCalledWith('en', {
      value: 'en',
      label: 'English',
      dir: 'ltr'
    });
  });
});
