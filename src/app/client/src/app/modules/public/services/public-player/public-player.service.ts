
import { of as observableOf, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService, CollectionHierarchyAPI, PublicDataService, OrgDetailsService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import {
  ConfigService, ServerResponse, ContentDetails, PlayerConfig, ContentData, NavigationHelperService, ResourceService
} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { environment } from '@sunbird/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicPlayerService {
  /**
   * stores content details
   */
  contentData: ContentData;
  /**
   * stores collection/course details
  */
  collectionData: ContentData;
  previewCdnUrl: string;
  sessionId;
  private _libraryFilters: any = {};

  constructor(public userService: UserService, private orgDetailsService: OrgDetailsService,
    public configService: ConfigService, public router: Router,
    public publicDataService: PublicDataService, public navigationHelperService: NavigationHelperService,
    public resourceService: ResourceService) {
      this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
      ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
      this.sessionId = (<HTMLInputElement>document.getElementById('sessionId'))
      ? (<HTMLInputElement>document.getElementById('sessionId')).value : undefined;
  }

  /**
   *
   *
   * @param {string} id
   * @returns {Observable<{contentId: string, contentData: ContentData }>}
   */
  getConfigByContent(id: string, option: any = {}): Observable<PlayerConfig> {
    return this.getContent(id).pipe(
      mergeMap((contentDetails) => {
        return observableOf(this.getConfig({
          contentId: contentDetails.result.content.identifier,
          contentData: contentDetails.result.content
        }, option));
      }));
  }

  /**
   * Return content details
   * @param {string} contentId
   * @returns {Observable<ServerResponse>}
   */
  getContent(contentId: string, option: any = { params: {} }): Observable<ServerResponse> {
    const licenseParam = {
      licenseDetails: 'name,description,url'
    };
    let param = { fields: this.configService.urlConFig.params.contentGet };
    param = { ...param, ...option.params, ...licenseParam};
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      param: param
    };
    return this.publicDataService.get(req).pipe(map((response: ServerResponse) => {
      this.contentData = response.result.content;
      return response;
    }));
  }
  private getRollUpData(data: Array<string> = []) {
    const rollUp = {};
    data.forEach((element, index) => rollUp['l' + (index + 1)] = element);
    return rollUp;
  }
  /**
   * returns player config details.
   * @param {ContentDetails} contentDetails
   * @memberof PlayerService
   */
  getConfig(contentDetails: ContentDetails, option: any = {}): PlayerConfig {
    const configuration: any = _.cloneDeep(this.configService.appConfig.PLAYER_CONFIG.playerConfig);
    configuration.context.contentId = contentDetails.contentId;
    configuration.context.sid = (environment.isOffline && !_.isEmpty(this.sessionId)) ? this.sessionId : this.userService.anonymousSid;
    configuration.context.uid = 'anonymous';
    configuration.context.timeDiff = this.orgDetailsService.getServerTimeDiff;
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    configuration.context.pdata.ver = buildNumber && buildNumber.value ?
      buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    configuration.context.channel = _.get(this.orgDetailsService.orgDetails, 'hashTagId');
    configuration.context.pdata.id = this.userService.appId;
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    configuration.context.did = deviceId ? deviceId.value : '';
    configuration.metadata = contentDetails.contentData;
    configuration.context.contextRollup = this.getRollUpData([_.get(this.orgDetailsService.orgDetails, 'hashTagId')]);
    configuration.data = contentDetails.contentData.mimeType !== this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent ?
      {} : contentDetails.contentData.body;
    if (!_.includes(this.router.url, 'browse') && environment.isOffline) {
      configuration.data = '';
    }

    if (environment.isOffline) {
      configuration.metadata = _.omit(configuration.metadata, ['streamingUrl']);
    }
    if (option.dialCode) {
      configuration.context.cdata = [{
        id: option.dialCode,
        type: 'DialCode'
      }];
    }
    configuration.config.previewCdnUrl = this.previewCdnUrl;
    return configuration;
  }
  public getCollectionHierarchy(identifier: string, option: any = { params: {} }): Observable<CollectionHierarchyAPI.Get> {
    const req = {
      url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`,
      param: option.params
    };
    return this.publicDataService.get(req).pipe(map((response: ServerResponse) => {
      this.collectionData = response.result.content;
      return response;
    }));
  }

  /**
   * This method accepts content details and help to play the content player in offline desktop app browse page
   *
   * @param {object} event
   */
  public playContentForOfflineBrowse(event) {
    this.navigationHelperService.storeResourceCloseUrl();
    setTimeout(() => {
      if (event.data.metaData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
        if (event.data.contentType === 'Course') {
          this.router.navigate(['browse/play/learn/course', event.data.metaData.identifier]);
        } else {
          this.router.navigate(['browse/play/collection', event.data.metaData.identifier],
            { queryParams: { contentType: event.data.metaData.contentType } });
        }
      } else {
        this.router.navigate(['browse/play/content', event.data.metaData.identifier],
          { queryParams: { contentType: event.data.metaData.contentType } });
      }
    }, 0);
  }

  public playContent(event) {
    this.navigationHelperService.storeResourceCloseUrl();
    setTimeout(() => {
      if (event.data.metaData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
        if (event.data.contentType === 'Course') {
          this.router.navigate(['learn/course', event.data.metaData.identifier]);
        } else {
          this.router.navigate(['play/collection', event.data.metaData.identifier],
          {queryParams: {contentType: event.data.metaData.contentType}});
        }
      } else {
        this.router.navigate(['play/content', event.data.metaData.identifier],
        {queryParams: {contentType: event.data.metaData.contentType}});
      }
    }, 0);
  }

  public playExploreCourse(courseId) {
    this.navigationHelperService.storeResourceCloseUrl();
    setTimeout(() => {
      if (this.userService.loggedIn) {
        this.router.navigate(['learn/course', courseId]);
      } else {
        this.router.navigate(['explore-course/course', courseId]);
      }
    }, 0);
  }
  updateDownloadStatus(downloadListdata, content) {
    const status = {
      inProgress: this.resourceService.messages.stmsg.m0140,
      inQueue: this.resourceService.messages.stmsg.m0140,
      failed: this.resourceService.messages.stmsg.m0143,
      completed: this.resourceService.messages.stmsg.m0139,
      paused: this.resourceService.messages.stmsg.m0142,
      canceled: this.resourceService.messages.stmsg.m0143
    };
    const identifier = _.get(content, 'metaData.identifier') || _.get(content, 'identifier');
    const downloadData = _.find(downloadListdata, { contentId: identifier});
    content['downloadStatus'] = status[_.get(downloadData, 'status')] || this.resourceService.messages.stmsg.m0143;
    return content;
  }

    get libraryFilters() {
        return this._libraryFilters;
    }

    set libraryFilters(filters) {
        this._libraryFilters = filters;
    }

}
