
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { of, throwError, Observable, BehaviorSubject } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { BrowserCacheTtlService } from '../browser-cache-ttl/browser-cache-ttl.service';
import { HttpOptions, RequestParam, ServerResponse } from '../../interfaces';
import { ConfigService } from '../config/config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { _ } from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';
import { FormService } from '../../../core/services/form/form.service';
import { GenericResourceService } from './genericResource.service';
import { MockData } from './genericResource.service.spec.data';

describe('GenericResourceService', () => {
    let component: GenericResourceService;

    const config: Partial<ConfigService> = {
        urlConFig: {
            URLS: {
                CUSTOM_RESOURCE_BUNDLE:'/api/data/v1/form/read'
            }
          }
    };
    const http: Partial<HttpClient> = {
        post:jest.fn().mockReturnValue(of(MockData.orgTypeSuccess))
    };
    const cacheService: Partial<CacheService> = {
        get: jest.fn()
    };
    const browserCacheTtlService: Partial<BrowserCacheTtlService> = {};
    const translateService: Partial<TranslateService> = {
        setDefaultLang: jest.fn(),
        use: jest.fn()
    };
    const formService: Partial<FormService> = {
        getHashTagID: jest.fn().mockReturnValue(of({} as any) as any) as any
    };

    beforeAll(() => {
        component = new GenericResourceService(
            config as ConfigService,
            http as HttpClient,
            cacheService as CacheService,
            browserCacheTtlService as BrowserCacheTtlService,
            translateService as TranslateService,
            formService as FormService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call initialize', () => {
        component['formService'].getHashTagID = jest.fn().mockReturnValue(of(MockData.rootOrgId as any) as any) as any
        component.initialize()
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call getResource method', () => {
        component['formService'].getHashTagID = jest.fn().mockReturnValue(of(MockData.rootOrgId as any) as any) as any
        component['http'].post = jest.fn().mockReturnValue(of(MockData.orgTypeSuccess as any) as any) as any
        jest.spyOn(component,'getLanguageChange');
        component.getResource();
        expect(component).toBeTruthy();
        expect(component.getLanguageChange).toBeCalled();
    });
    it('should create a instance of component and call getResource method with error', () => {
        component['formService'].getHashTagID = jest.fn().mockReturnValue(of(MockData.rootOrgId as any) as any) as any
        component['http'].post = jest.fn().mockReturnValue(of(MockData.orgTypeError as any) as any) as any
        jest.spyOn(component['translateService'],'use');
        component.getResource();
        expect(component).toBeTruthy();
        expect(component['translateService'].use).toBeCalled();
    });
});