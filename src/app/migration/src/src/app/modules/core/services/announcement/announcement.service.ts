import { DataService } from './../data/data.service';
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
 import 'rxjs/add/operator/map';
 import 'rxjs/add/observable/throw';
 import { Observable } from 'rxjs/Observable';
 // import { AnnouncementSericeParam } from './../../../announcement/interfaces/announcement.serivce';
 import { ConfigService} from '@sunbird/shared';
 interface AnnouncementSericeParam {
  pageNumber?: number;
     limit?: number;
     announcementId?: string;
     data?: object;
 }
/**
 * Service to provides CRUD methods to make announcement api request by extending DataService.
 *
 */
@Injectable()
export class AnnouncementService extends DataService {

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
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.ANNOUNCEMENT_PREFIX;
  }

  /**
 * Method to make api call to get inbox data.
 * It calls the post method from data service class
 *
 * @param {AnnouncementSericeParam} requestParam Request object needed for inbox API call
 */
public getInboxList(requestParam: AnnouncementSericeParam) {
  const data = {
      'request': {
        'limit': requestParam.limit,
        'offset': (requestParam.pageNumber - 1) * requestParam.limit
      }
  };
  const option = {
   url: this.config.urlConFig.URLS.ANNOUNCEMENT.INBOX_LIST,
    data: data
     };
 return  this.post(option);
}
}
