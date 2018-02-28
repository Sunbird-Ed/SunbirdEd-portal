import { Injectable, Input } from '@angular/core';
import { UserService } from './../user/user.service';
import { ContentService } from './../content/content.service';
import { ConfigService } from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

/**
 * Interface
 */
interface RequestParam {
  status?: any;
  contentType?: any;
  params?: any;
  orgid?: any;
}

/**
 * Service to search content
 */
@Injectable()

/**
 * @class SearchService
 */
export class SearchService {
  /**
   * Contains searched content list
   */
  searchedContentList: any;

  /**
   * Contains searched organization list
   */
  searchedOrganisationList: any;

  /**
   * Reference of user service.
   */
  public user: UserService;

  /**
   * Reference of content service.
   */
  public content: ContentService;

  /**
   * Reference of config service
   */
  public config: ConfigService;

  /**
   * Default method of OrganisationService class
   *
   * @param {UserService} user user service reference
   * @param {ContentService} content content service reference
   * @param {ConfigService} config config service reference
   */
  constructor(user: UserService, content: ContentService, config: ConfigService) {
    this.user = user;
    this.content = content;
    this.config = config;
  }

  /**
   * Search content by user id.
   *
   * @param {RequestParam} requestParam api request data
   */
  searchContentByUserId(requestParam: RequestParam) {
    const option = {
      url: this.config.urlConFig.URLS.COMPOSITE.SEARCH,
      data: {
        request: {
          filters: {
            status: requestParam.status || ['Live'],
            createdBy: requestParam.params.userId ? requestParam.params.userId : this.user.userid,
            contentType: requestParam.contentType || ['Course']
          },
          sort_by: {
            lastUpdatedOn: requestParam.params.lastUpdatedOn || 'desc'
          }
        }
      }
    };

    return this.content.post(option);
  }

  /**
   * Set result of searchContentByUserId()
   *
   * @param {any} data api response
   */
  public setSearchedContent(data: any): void {
    this.searchedContentList = data;
  }

  /**
   * Get searched content list
   */
  public getSearchedContent(): any {
    return this.searchedContentList;
  }

  /**
   * Get organization details.
   *
   * @param {requestParam} requestParam api request data
   */
  getOrganisationDetails(requestParam: RequestParam) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: {
            id: requestParam.orgid,
          }
        }
      }
    };

    return this.content.post(option);
  }

  /**
   * Set serched organization(s) list
   *
   * @param {data} data api response
   */
  public setOrganisation(data: any): void {
    this.searchedOrganisationList = data;
  }

  /**
   * Get searched organization list
   */
  public getOrganisation(): any {
    return this.searchedOrganisationList;
  }
}
