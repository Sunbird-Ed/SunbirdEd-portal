import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, skipWhile } from 'rxjs/operators';
import {
  ConfigService, ServerResponse, ICard, NavigationHelperService, ResourceService, BrowserCacheTtlService
} from '@sunbird/shared';
import { ContentService, PublicDataService, UserService, ActionService } from '@sunbird/core';
import { IDeleteParam, ContentIDParam } from '../../interfaces/delteparam';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
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
  public listener;
  public showWarning;
  public browserBackEvent = new EventEmitter();

  private _questionSetEnabled$ = new BehaviorSubject<any>(false);

  public readonly questionSetEnabled$: Observable<any> = this._questionSetEnabled$.asObservable()
  .pipe(skipWhile(data => data === undefined || data === null));

  /**
    * Constructor - default method of WorkSpaceService class
    *
    * @param {ConfigService} config ConfigService reference
    * @param {UserService} userService userService reference
    * @param {HttpClient} http HttpClient reference
  */
  constructor(config: ConfigService, content: ContentService,
    route: Router, public navigationHelperService: NavigationHelperService,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private resourceService: ResourceService, public publicDataService: PublicDataService,
    public userService: UserService, public actionService: ActionService) {
    this.content = content;
    this.config = config;
    this.route = route;
    this.publicDataService = publicDataService;
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
    } else if (mimeType === 'application/vnd.sunbird.questionset') {
      this.openQuestionSetEditor(content, state);
    } else if ((this.config.appConfig.WORKSPACE.genericMimeType).includes(mimeType)) {
      this.openGenericEditor(content, state);
    }
  }

  openQuestionSetEditor(content, state) {
    const navigationParams = ['/workspace/edit/QuestionSet/', content.identifier, state];
    if (content.status) {
      navigationParams.push(content.status);
    }
    this.route.navigate(navigationParams);
  }

  /**
  * collectionEditor
  * @param {Object}  content - content
  * @param {string}  state - Present state
*/
  openCollectionEditor(content, state) {
    let navigationParams = ['/workspace/content/edit/collection', content.identifier, content.contentType, state, content.framework];
    if ((_.toLower(content.contentType) === 'course' && _.toLower(content.primaryCategory) === 'course'
    ) || _.toLower(content.contentType) === 'collection' || _.toLower(content.contentType) === 'textbook') {
      navigationParams = ['workspace/edit/', content.contentType, content.identifier, state];
    }
    if (content.status) {
      navigationParams.push(content.status);
    }
    this.route.navigate(navigationParams);
  }

  /**
   * contentEditor
   * @param {Object}  content - content
   * @param {string}  state - Present state
  */
  openContent(content, state) {
    if (this.config.appConfig.WORKSPACE.states.includes(state)) {
      const navigationParams = ['/workspace/content/edit/content/', content.identifier, state, content.framework];
      if (content.status) {
        navigationParams.push(content.status);
      }
      this.route.navigate(navigationParams);
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
      const navigationParams = ['/workspace/content/edit/generic/', content.identifier, state, content.framework];
      if (content.status) {
        navigationParams.push(content.status);
      }
      this.route.navigate(navigationParams);
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

  /**
   * skillMapEditor
   * Navigate to skill map editor
   * @param {Object}  content - content
   * @param {string}  state - Present state (edit, view, review)
  */
  openSkillMapEditor(content, state) {
    const contentId = content ? content.identifier : 'new';
    if(state === 'review') {
      // Navigate to skill map review page
      this.route.navigate(['/workspace/content/skillmap-review/edit', contentId], {
      queryParams: { mode: state }
    });
    return
    }
    // Add mode as query parameter to distinguish between edit, view, and review modes
    this.route.navigate(['/workspace/content/skillmap/edit', contentId], {
      queryParams: { mode: state }
    });
  }

  getDataForCard(data, staticData, dynamicFields, metaData) {
    const list: Array<ICard> = [];
    _.forEach(data, (item, key) => {
      const card = {
        name: item.name,
        image: item.appIcon,
        description: item.description,
        lockInfo: item.lockInfo,
        originData : item.originData
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
          this.browserBackEvent.emit();
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

  /**
    * @param {formType} content form type
    * @param {formAction} content form action type
    * @param {selectedContent} content selected content type
    */
  getFormData(formInputParams): Observable<ServerResponse> {
    const pageData: any = this.cacheService.get(formInputParams.formAction + formInputParams.subType);
    if (pageData) {
      return observableOf(pageData);
    } else {
      const channelOptions = {
        url: this.config.urlConFig.URLS.dataDrivenForms.READ,
        data: {
          request: {
            type: formInputParams.formType,
            action: formInputParams.formAction,
            subType: formInputParams.subType,
            rootOrgId: this.userService.hashTagId
          }
        }
      };
      return this.publicDataService.post(channelOptions).pipe(map((data) => {
        this.setData(data, formInputParams.formAction + formInputParams.subType);
        return data;
      }));
    }
  }

  /**
   * getLockList.
   *
   * @param {SearchParam} requestParam api request data
  */
  getContentLockList(requestParam): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.LOCK_LIST,
      data: {
        request: {
          filters: requestParam.filters
        }
      }
    };
    return this.content.post(option);
  }

  lockContent(inputParams): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.LOCK_CREATE,
      data: {
        request: inputParams
      }
    };
    return this.content.post(option);
  }

  retireLock(inputParams): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.CONTENT.LOCK_RETIRE,
      data: {
        request: inputParams
      }
    };
    return this.content.delete(option);
  }

  setData(data, name) {
    this.cacheService.set(name, data, {
      maxAge: this.browserCacheTtlService.browserCacheTtl
    });
  }

/**
  * Search Content which are used in some other content/collection
  * @param {ContentID} requestParam
  */
  searchContent(requestparam: ContentIDParam): Observable<ServerResponse> {
  const option = {
    url: `${this.config.urlConFig.URLS.COMPOSITE.SEARCH}`,
    'data': {
      'request': {
        'filters': {
            'childNodes': [requestparam]
          }
        }
        }
    };
    return this.content.post(option);
  }

/**
 * To get channel details
 * @param {channelId} id required for read API
 */
  getChannel(channelId): Observable<ServerResponse> {
    const option = {
      url: `${this.config.urlConFig.URLS.CHANNEL.READ}` + '/' + channelId
    };
    return this.publicDataService.get(option);
  }

  createQuestionSet(req): Observable<ServerResponse> {
    const option = {
          url: this.config.urlConFig.URLS.QUESTIONSET.CREATE,
          data: {
              'request': req
          }
      };
    return this.actionService.post(option);
  }

  getQuestion(contentId: string, option: any = { params: {} }): Observable<ServerResponse> {
    const param = { fields: this.config.editorConfig.DEFAULT_PARAMS_FIELDS };
    const req = {
        url: `${this.config.urlConFig.URLS.QUESTIONSET.READ}/${contentId}`,
        param: { ...param, ...option.params }
    };
    return this.actionService.get(req).pipe(map((response: ServerResponse) => {
        return response;
    }));
  }

  getCategoryDefinition(objectType, name, channel?) {
    const req = {
      url: _.get(this.config, 'urlConFig.URLS.OBJECTCATEGORY.READ'),
      param: _.get(this.config, 'urlConFig.params.objectCategory'),
      data: {
        request: {
          objectCategoryDefinition: {
              objectType: objectType,
              name: name,
              ...(channel && {channel})
          }
        }
      }
    };
    return this.actionService.post(req);
  }

  getQuestionSetCreationStatus() {
    const formInputParams = {
      formType: 'questionset',
      subType: 'editor',
      formAction: 'display',
    };
    this.getFormData(formInputParams).subscribe(
      (response) => {
        const formValue = _.first(_.get(response, 'result.form.data.fields'));
        const displayValue = formValue ? formValue.display : false;
        this._questionSetEnabled$.next({err: null, questionSetEnablement: displayValue});
      },
      (error) => {
        this._questionSetEnabled$.next({err: error, questionSetEnablement: false});
        console.log(`Unable to fetch form details - ${error}`);
      }
    );
  }

  newtoggleWarning(type?: string) {
    this.showWarning = sessionStorage.getItem('inEditor');
    if (this.showWarning === 'true') {
      this.listener = (event) => {
        window.location.hash = 'no';
        if (event.state) {
          const alertMsg = type ? this.resourceService?.messages?.imsg?.m0038 + ' ' + type + ', ' + this.resourceService?.messages?.imsg?.m0040
            : this.resourceService?.messages?.imsg?.m0037;
          this.browserBackEvent.emit();
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

  /**
   * To get contents of all objectTypes (content, questionsert etc)
   * @param {ServerResponse} contentData response data from search api call
   *  @param {boolean} contentData response data from search api call
   */
  getAllContent(contentData: ServerResponse, isQuestionSetEnabled: boolean) {
    let contentList= [];
    if(contentData?.result?.count) {
      if(isQuestionSetEnabled) {
        let objectTypes = _.keys(contentData.result);
        objectTypes= _.filter(objectTypes, function(objectType) { return objectType !== 'count'; });
        _.forEach(objectTypes, function(objectType){
          contentList = _.concat(contentList, contentData.result[objectType]);
        });
      } else {
        contentList= contentData.result.content;
      }
    }
    return contentList;
  }
}
