import { Inject, Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';


import {
  ConfigService, ServerResponse, ICard, IUserData, NavigationHelperService,
  ResourceService
} from '@sunbird/shared';
import { ContentService } from '@sunbird/core';
import { IDeleteParam } from '../../interfaces/delteparam';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
@Injectable()
export class WorkSpaceService {
  /**
  * reference of config service.
  */
  public config: ConfigService;
  /**
   * Reference of content service.
  */
  public content: ContentService;
  /**
    * To navigate to other pages
  */
  route: Router;

  /**
    * To send activatedRoute.snapshot to router navigation
    * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;
  public listener;
  public showWarning;

  /**
    * Constructor - default method of WorkSpaceService class
    *
    * @param {ConfigService} config ConfigService reference
    * @param {UserService} userService userService reference
    * @param {HttpClient} http HttpClient reference
  */
  constructor(config: ConfigService, content: ContentService,
    activatedRoute: ActivatedRoute,
    route: Router, public navigationHelperService: NavigationHelperService, private resourceService: ResourceService) {
    this.content = content;
    this.config = config;
    this.route = route;
    this.activatedRoute = activatedRoute;
  }
  /**
  * deleteContent
  * delete  content based on contentId
  * @param {contentIds}  contentIds - contentIds
  */
  deleteContent(requestParam: IDeleteParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.RETIRE,
      data: {
        'request': {
          'contentIds': requestParam.contentIds
        }
      }
    };
    return this.content.delete(option);
  }


  /**
 * openContentEditor
 * open content editor based content mime type
 * @param {Object}  content - content
 * @param {string}  state - Present state
 */
  navigateToContent(content, state) {
    this.navigationHelperService.storeWorkSpaceCloseUrl();
    const mimeType = content.mimeType;
    if (mimeType === 'application/vnd.ekstep.content-collection') {
      this.openCollectionEditor(content, state);
    } else if (mimeType === 'application/vnd.ekstep.ecml-archive') {
      this.openContent(content, state);
    } else if ((this.config.appConfig.WORKSPACE.genericMimeType).includes(mimeType)) {
      this.openGenericEditor(content, state);
    }
  }
  /**
  * collectionEditor
  * @param {Object}  content - content
  * @param {string}  state - Present state
*/
  openCollectionEditor(content, state) {
    this.route.navigate(['/workspace/content/edit/collection', content.identifier, content.contentType, state, content.framework]);
  }

  /**
   * contentEditor
   * @param {Object}  content - content
   * @param {string}  state - Present state
  */
  openContent(content, state) {
    if (this.config.appConfig.WORKSPACE.states.includes(state)) {
      this.route.navigate(['/workspace/content/edit/content/', content.identifier, state, content.framework]);
    } else {
      if (state === 'upForReview') {
        this.route.navigate(['workspace/content/upForReview/content', content.identifier]);
      } else if (state === 'flagged') {
        this.route.navigate(['workspace/content/flag/content', content.identifier]);
      } else if (state === 'review') {
        this.route.navigate(['workspace/content/review/content', content.identifier]);
      } else if (state === 'flagreviewer') {
        this.route.navigate(['workspace/content/flagreviewer/content', content.identifier]);
      }
    }
  }
  /**
   * genericEditor
   * State transaction to generic editor
   * @param {Object}  content - content
   * @param {string}  state - Present state
  */
  openGenericEditor(content, state) {
    if (this.config.appConfig.WORKSPACE.states.includes(state)) {
      this.route.navigate(['/workspace/content/edit/generic/', content.identifier, state, content.framework]);
    } else {
      if (state === 'review') {
        this.route.navigate(['workspace/content/review/content', content.identifier]);
      } else if (state === 'upForReview') {
        this.route.navigate(['workspace/content/upForReview/content', content.identifier]);
      } else if (state === 'flagged') {
        this.route.navigate(['workspace/content/flag/content', content.identifier]);
      } else if (state === 'flagreviewer') {
        this.route.navigate(['workspace/content/flagreviewer/content', content.identifier]);
      }
    }
  }

  getDataForCard(data, staticData, dynamicFields, metaData) {
    const list: Array<ICard> = [];
    _.forEach(data, (item, key) => {
      const card = {
        name: item.name,
        image: item.appIcon,
        description: item.description
      };
      _.forIn(staticData, (value, key1) => {
        card[key1] = value;
      });
      _.forIn(metaData, (value, key1) => {
        card[key1] = _.pick(item, value);
      });
      _.forIn(dynamicFields, (fieldData, fieldName) => {
        const value = _.pick(item, fieldData);
        _.forIn(value, (val1, key1) => {
          const name = _.zipObjectDeep([fieldName], [val1]);
          _.forIn(name, (values, index) => {
            card[index] = _.merge(name[index], card[index]);
          });
        });
      });
      list.push(card);
    });
    return <ICard[]>list;
  }
  toggleWarning(type?: string) {
    this.showWarning = sessionStorage.getItem('inEditor');
    if (this.showWarning === 'true') {
      this.listener = (event) => {
        window.location.hash = 'no';
        if (event.state) {
          const alertMsg = type ? this.resourceService.messages.imsg.m0038 + ' ' + type + ', ' + this.resourceService.messages.imsg.m0039
            : this.resourceService.messages.imsg.m0037;
          alert(alertMsg);
          window.location.hash = 'no';
        }
      };
      window.addEventListener('popstate', this.listener, false);
    } else {
      window.location.hash = '';
      window.removeEventListener('popstate', this.listener);
    }
  }
}
