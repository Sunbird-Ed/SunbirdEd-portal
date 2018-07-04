import { DataService } from '../../../core/services/data/data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {  IAnnouncementSericeParam } from '@sunbird/announcement';
import { ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash';

@Injectable()
export class HomeAnnouncementService  extends DataService {
  /**
   * base Url for announcement api
   */
  baseUrl: string;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of lerner service.
   */
  public http: HttpClient;
  /**
   * Constructor - default method of AnnouncementService class
   *
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */

  constructor(config: ConfigService, http: HttpClient, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.ANNOUNCEMENT_PREFIX;
   }
/**
  * Method to make api call to get inbox data.
  * It calls the post method from data service class
  *
  * @param {IAnnouncementSericeParam} requestParam Request object needed for inbox API call
  */
  getInboxData(requestParam: IAnnouncementSericeParam) {
    const InboxData: any = this.cacheService.get('HomeAnnouncementInboxData');
   if (InboxData) {
     return Observable.of(InboxData);
   } else {
     const option = {
       url: this.config.urlConFig.URLS.ANNOUNCEMENT.INBOX_LIST,
       data: {
         'request': {
           'limit': requestParam.limit,
           'offset': (requestParam.pageNumber - 1) * requestParam.limit
         }
       }
     };
     return this.post(option).map((data) => {
        this.setData(data, requestParam);
       return { announcements: data.result.announcements };
     });
   }
 }

 setData(data, requestParam) {
     this.cacheService.set('HomeAnnouncementInboxData', { announcements: data.result.announcements }, {
       maxAge: this.browserCacheTtlService.browserCacheTtl
   });
 }
}
