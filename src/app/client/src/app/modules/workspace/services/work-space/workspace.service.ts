import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { ContentService } from '@sunbird/core';
import { IDeleteParam } from '../../interfaces/delteparam';
import { ActivatedRoute, Router } from '@angular/router';
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
  /**
    * Constructor - default method of WorkSpaceService class
    *
    * @param {ConfigService} config ConfigService reference
    * @param {HttpClient} http HttpClient reference
  */
  constructor(config: ConfigService, content: ContentService,
    activatedRoute: ActivatedRoute,
    route: Router) {
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
      this.route.navigate(['/workspace/content/edit/contentEditor/', content.identifier, state, content.framework]);
    } else {
      console.log('open content player');
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
      this.route.navigate(['/workspace/content/edit/generic/', content.identifier, state , content.framework]);
    } else {
      console.log('open content player ');
    }
  }
}
