import { DataService } from './../data/data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IAnnouncementDetails, IAnnouncementSericeParam } from '@sunbird/announcement';
import { ConfigService } from '@sunbird/shared';
import { ILogEventInput} from '@sunbird/telemetry';
/**
 * Service for all announcement API calls
 *
 * It responsible to make http call
 */
@Injectable()

/**
 * AnnouncementService extends dataservice where
 * get, post, delete etc methods are written
 */
export class AnnouncementService extends DataService {
  /**
   * To set announcement details of specific announcement
   */
  announcementDetailsObject: IAnnouncementDetails;
  /**
   * To listen event
   */
  announcementDeleteEvent = new EventEmitter();
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
  constructor(config: ConfigService, http: HttpClient) {
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
  getInboxData(requestParam: IAnnouncementSericeParam, logParams?: ILogEventInput) {
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.INBOX_LIST,
      data: {
        'request': {
          'limit': requestParam.limit,
          'offset': (requestParam.pageNumber - 1) * requestParam.limit
        },
      },
      logParams: {
        context: {
          env: logParams
        },
        edata: this.config.appConfig.Telemetry.Announcement.services.getInboxdata.log.edata
      }
    };
    return this.post(option);
  }

  /**
  * Method to make api call to get outbox data
  * It calls the post method from data service class
  *
  * @param {IAnnouncementSericeParam} requestParam Request object needed for outbox API call
  */
  getOutboxData(requestParam: IAnnouncementSericeParam, logParams?: ILogEventInput) {
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.OUTBOX_LIST,
      data: {
        'request': {
          'limit': requestParam.limit,
          'offset': (requestParam.pageNumber - 1) * requestParam.limit
        }
      },
      logParams: logParams
    };
    return this.post(option);
  }

  /**
  * Method to make received api call
  * It calls the post method from data service class
  *
  * @param {IAnnouncementSericeParam} requestParam Request object needed for received API call
  */
  receivedAnnouncement(requestParam: IAnnouncementSericeParam, logParams?: ILogEventInput) {
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.RECEIVED,
      data: {
        'request': {
          'announcementId': requestParam.announcementId,
          'channel': 'web'
        }
      },
      logParams: logParams
    };
    return this.post(option);
  }

  /**
  * Method to make read api call
  * It calls the post method from data service class
  *
  * @param {IAnnouncementSericeParam} requestParam Request object needed for read API call
  */
  readAnnouncement(requestParam: IAnnouncementSericeParam, logParams?: ILogEventInput) {
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.READ,
      data: {
        'request': {
          'announcementId': requestParam.announcementId,
          'channel': 'web'
        }
      },
      logParams: logParams
    };
    return this.post(option);
  }

  /**
  * Method to make delete api call
  * It calls the delete method from data service class
  *
  * @param {IAnnouncementSericeParam} requestParam Request object needed for delete API call
  */
  deleteAnnouncement(requestParam: IAnnouncementSericeParam, logParams?: ILogEventInput) {
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.CANCEL,
      data: {
        'request': {
          'announcementId': requestParam.announcementId
        }
      },
      logParams: logParams
    };
    return this.delete(option).map(data => {
      this.announcementDeleteEvent.emit(requestParam.announcementId);
      return data;
    });
  }

  /**
  * Method to get announcement details
  * It calls the get method from data service class
  *
  * @param {IAnnouncementSericeParam} requestParam Request object needed for delete API call
  */
 getAnnouncementById(requestParam: IAnnouncementSericeParam, logParams?: ILogEventInput) {
    const option = {
      url: this.config.urlConFig.URLS.ANNOUNCEMENT.GET_BY_ID + '/' + requestParam.announcementId,
      logParams: logParams
    };
    return this.get(option);
  }
}
