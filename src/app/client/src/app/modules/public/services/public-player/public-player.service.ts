
import { of as observableOf, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService, CollectionHierarchyAPI, PublicDataService, OrgDetailsService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import {
  ConfigService, ServerResponse, ContentDetails, PlayerConfig, ContentData, NavigationHelperService
} from '@sunbird/shared';
import * as _ from 'lodash';

@Injectable()
export class PublicPlayerService {
  /**
   * stores content details
   */
  contentData: ContentData;
  /**
   * stores collection/course details
   */
  collectionData: ContentData;
  constructor(public userService: UserService, private orgDetailsService: OrgDetailsService,
    public configService: ConfigService, public router: Router,
    public publicDataService: PublicDataService, public navigationHelperService: NavigationHelperService) {
  }

  /**
   *
   *
   * @param {string} id
   * @returns {Observable<{contentId: string, contentData: ContentData }>}
   */
  getConfigByContent(id: string): Observable<PlayerConfig> {
    return this.getContent(id).pipe(
      mergeMap((contentDetails) => {
        return observableOf(this.getConfig({
          contentId: contentDetails.result.content.identifier,
          contentData: contentDetails.result.content
        }));
      }));
  }

  /**
   * Return content details
   * @param {string} contentId
   * @returns {Observable<ServerResponse>}
   */
  getContent(contentId: string): Observable<ServerResponse> {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      param: { fields: this.configService.urlConFig.params.contentGet }
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
  getConfig(contentDetails: ContentDetails): PlayerConfig {
    const configuration: any = this.configService.appConfig.PLAYER_CONFIG.playerConfig;
    configuration.context.contentId = contentDetails.contentId;
    configuration.context.sid = this.userService.anonymousSid;
    configuration.context.uid = 'anonymous';
    configuration.context.channel = _.get(this.orgDetailsService.orgDetails, 'hashTagId');
    configuration.context.pdata.id = this.userService.appId;
    configuration.metadata = contentDetails.contentData;
    configuration.data = contentDetails.contentData.mimeType !== this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent ?
      {} : contentDetails.contentData.body;
    return configuration;
  }
  public getCollectionHierarchy(identifier: string): Observable<CollectionHierarchyAPI.Get> {
    const req = {
      url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`
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
        this.router.navigate(['play/collection', event.data.metaData.identifier]);
      } else {
        this.router.navigate(['play/content', event.data.metaData.identifier]);
      }
    }, 0);
  }
}
