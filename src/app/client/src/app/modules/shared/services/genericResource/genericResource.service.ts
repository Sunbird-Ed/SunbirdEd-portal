
import { of as observableOf, throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { BrowserCacheTtlService } from '../browser-cache-ttl/browser-cache-ttl.service';
import { HttpOptions, RequestParam, ServerResponse } from '../../interfaces';
import { ConfigService } from '../config/config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as UUID } from 'uuid';
import dayjs from 'dayjs';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import * as _ from 'lodash-es';
import { TranslateService } from '@ngx-translate/core';
import { FormService } from '../../../core/services/form/form.service';

/**
 * Service to fetch resource bundle
 */
@Injectable()
export class GenericResourceService {
  // Workaround for issue https://github.com/angular/angular/issues/12889
  // Dependency injection creates new instance each time if used in router sub-modules
  static singletonInstance: GenericResourceService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  public http: HttpClient;

  /**
   * Contains instance name
   */
  private _instance: string;
  // Observable navItem source
  _languageSelected = new BehaviorSubject<any>({});
  // Observable navItem stream
  languageSelected$ = this._languageSelected.asObservable();

  terms: any = {};

  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http LearnerService reference
   */
  constructor(config: ConfigService, http: HttpClient,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private translateService: TranslateService, private formService: FormService) {
    if (!GenericResourceService.singletonInstance) {
      this.http = http;
      this.config = config;
      try {
        this._instance = document.getElementById('instance') ? (<HTMLInputElement>document.getElementById('instance')).value : '';
      } catch (error) {
      }
      GenericResourceService.singletonInstance = this;
    }
    return GenericResourceService.singletonInstance;
  }
  public initialize() {
    const range = { value: 'en', label: 'English', dir: 'ltr' };
    this.getResource(this.cacheService.get('portalLanguage') || 'en', range);
    this.translateService.setDefaultLang('en');
  }
  /**
   * method to fetch resource bundle
  */
  public getResource(language = 'en', range: any = {}): void {
    // this.post({ url: this.config.urlConFig.URLS.CUSTOM_RESOURCE_BUNDLE }).subscribe((data: ServerResponse) => {
    //   this.terms = _.get(data, 'result.form.data') || {};
    //   this.getLanguageChange(range);
    // }, (err) => {
    //   console.error('Custom resource form config fetch failed ', err);
    // });
    this.formService.getHashTagID().pipe(
      // @ts-ignore
      mergeMap((rootOrgId: any) => {
        const formServiceInputParams = {
          request: {
            type: 'customResourcebundles',
            action: 'list',
            subType: 'global',
            component: 'portal',
            rootOrgId: rootOrgId,
            framework: localStorage.getItem('selectedFramework') || '*'
          }
        };
        return this.http.post(this.config.urlConFig.URLS.CUSTOM_RESOURCE_BUNDLE, formServiceInputParams).pipe(
          mergeMap((data: ServerResponse) => {
            if (data.responseCode !== 'OK') {
              return observableThrowError(data);
            }
            return observableOf(data);
          }));
      })).subscribe((data: any) => {
        this.terms = _.get(data, 'result.form.data') || {};
        this.getLanguageChange(range);
        // return data;
      });
    this.translateService.use(language);
  }

  // post(requestParam: RequestParam): Observable<any> {
  //   return this.formService.getHashTagID().pipe(
  //     // @ts-ignore
  //     mergeMap((rootOrgId: any) => {
  //       const formServiceInputParams = {
  //         request: {
  //           type: 'customResourcebundles',
  //           action: 'list',
  //           subType: 'global',
  //           component: 'portal',
  //           rootOrgId: rootOrgId
  //         }
  //       };
  //       this.http.post(requestParam.url, formServiceInputParams).pipe(
  //         mergeMap((data: ServerResponse) => {
  //           if (data.responseCode !== 'OK') {
  //             return observableThrowError(data);
  //           }
  //           return observableOf(data);
  //         }));
  //     })).subscribe((data: any) => {
  //       return data;
  //     });
    
  // }
  /**
   * @description - Function to generate HTTP headers for API request
   * @returns HttpOptions
   */
  private getHeader(): HttpOptions['headers'] {
    const _uuid = UUID();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Consumer-ID': 'X-Consumer-ID',
      'X-Device-ID': 'X-Device-ID',
      'X-Org-code': '',
      'X-Source': 'web',
      'ts': dayjs().format(),
      'X-msgid': _uuid,
      'X-Request-ID': _uuid,
      'X-Session-Id': 'X-Session-Id'
    };
  }
  /**
 * get method to fetch instance.
 */
  get instance(): string {
    return _.upperCase(this._instance);
  }

  getLanguageChange(language) {
    this.translateService.use(language.value);
    this._languageSelected.next(language);
  }
}
