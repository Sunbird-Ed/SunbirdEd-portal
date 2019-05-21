
import { of as observableOf, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService, CollectionHierarchyAPI, PublicDataService, OrgDetailsService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import {
  ConfigService, ServerResponse, ContentDetails, PlayerConfig, ContentData, NavigationHelperService
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
  constructor(public userService: UserService, private orgDetailsService: OrgDetailsService,
    public configService: ConfigService, public router: Router,
    public publicDataService: PublicDataService, public navigationHelperService: NavigationHelperService) {
      this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
      ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
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
    let param = { fields: this.configService.urlConFig.params.contentGet };
    param = { ...param, ...option.params };
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      param: param
    };
    return this.publicDataService.get(req).pipe(map((response: ServerResponse) => {
      this.contentData = response.result.content;
      return response;
    }));
  }
  /**
   * returns player config details.
   * @param {ContentDetails} contentDetails
   * @memberof PlayerService
   */
  getConfig(contentDetails: ContentDetails, option: any = {}): PlayerConfig {
    const configuration: any = this.configService.appConfig.PLAYER_CONFIG.playerConfig;
    configuration.context.contentId = contentDetails.contentId;
    configuration.context.sid = this.userService.anonymousSid;
    configuration.context.uid = 'anonymous';
    configuration.context.timeDiff = this.orgDetailsService.getServerTimeDiff;
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    configuration.context.pdata.ver = buildNumber && buildNumber.value ?
      buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    configuration.context.channel = _.get(this.orgDetailsService.orgDetails, 'hashTagId');
    configuration.context.pdata.id = this.userService.appId;
    configuration.metadata = contentDetails.contentData;
    configuration.data = contentDetails.contentData.mimeType !== this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent ?
      {} : contentDetails.contentData.body;
    if (environment.isOffline) {
      configuration.data = '';
    }
    if (environment.isOffline && !navigator.onLine) {
      configuration.metadata = _.omit(configuration.metadata, ['streamingUrl']);
    }
    if (option.dialCode) {
      configuration.context.cdata = [{
        id: option.dialCode,
        type: 'dialCode'
      }];
    }
    configuration.config.previewCdnUrl = this.previewCdnUrl;
    console.log('player config', configuration.config);
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

  public playContent(event) {
    this.navigationHelperService.storeResourceCloseUrl();
    setTimeout(() => {
      if (event.data.metaData.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
        if (event.data.contentType === 'Course') {
          this.router.navigate(['learn/course', event.data.metaData.identifier]);
        } else {
          this.router.navigate(['play/collection', event.data.metaData.identifier]);
        }
      } else {
        this.router.navigate(['play/content', event.data.metaData.identifier]);
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
}
