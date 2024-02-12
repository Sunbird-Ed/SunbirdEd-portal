
import { of as observableOf, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from './../content/content.service';
import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import {
  ConfigService, ServerResponse, UtilService,
  ContentDetails, PlayerConfig, ContentData, NavigationHelperService
} from '@sunbird/shared';
import { CollectionHierarchyAPI } from '../../interfaces';
import * as _ from 'lodash-es';
import { environment } from '@sunbird/environment';
import { PublicDataService } from './../public-data/public-data.service';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
/**
 * helper services to fetch content details and preparing content player config
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  /**
   * stores content details
   */
  contentData: ContentData;
  /**
   * stores collection/course details
   */
  collectionData: ContentData;
  previewCdnUrl: string;
  frameworkCategoriesList;
  constructor(public userService: UserService, public contentService: ContentService,
    public configService: ConfigService, public router: Router, public navigationHelperService: NavigationHelperService,
    public publicDataService: PublicDataService, private utilService: UtilService, private activatedRoute: ActivatedRoute, public cslFrameworkService: CslFrameworkService) {
      this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
      ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
  }

  /**
   *
   *
   * @param {string} id
   * @returns {Observable<{contentId: string, contentData: ContentData }>}
   */
  getConfigByContent(id: string, option: any = { params: {} }): Observable<PlayerConfig> {
    return this.getContent(id, option).pipe(
      mergeMap((content) => {
        const contentDetails: ContentDetails = {
          contentId: content.result.content.identifier,
          contentData: content.result.content
        };
        if (option.courseId) {
          contentDetails.courseId = option.courseId;
        }
        if (option.courseId && option.batchId) {
          contentDetails.batchId = option.batchId;
        }
        return observableOf(this.getConfig(contentDetails));
      }));
  }

  /**
   * Return content details
   * @param {string} contentId
   * @returns {Observable<ServerResponse>}
   */
  getContent(contentId: string, option: any = { params: {} }): Observable<ServerResponse> {
    this.frameworkCategoriesList = this.cslFrameworkService.getAllFwCatName();
    let contentGetConfig = [...this.configService.urlConFig.params.contentGet.split(','), ...this.frameworkCategoriesList];
    const licenseParam = {
      licenseDetails: 'name,description,url'
    };
    let param = { fields: contentGetConfig.join(',') };
    if (this.userService.isDesktopApp) {
      param.fields = `${param.fields},downloadUrl`;
    }
    param = { ...param, ...option.params, ...licenseParam};
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
      param: { ...param, ...option.params }
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
    const configuration: any = _.cloneDeep(this.configService.appConfig.PLAYER_CONFIG.playerConfig);
    configuration.context.contentId = contentDetails.contentId;
    configuration.context.sid = this.userService.sessionId;
    configuration.context.uid = this.userService.userid;
    configuration.context.timeDiff = this.userService.getServerTimeDiff;
    configuration.context.contextRollup = this.getRollUpData(_.get(this.userService, 'userProfile.hashTagIds'));
    configuration.context.channel = this.userService.channel;
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    configuration.context.did = deviceId ? deviceId.value : '';
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    configuration.context.pdata.ver = buildNumber && buildNumber.value ?
    buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    if (_.isUndefined(contentDetails.courseId)) {
      configuration.context.dims = this.userService.dims;
    } else {
      const cloneDims = _.cloneDeep(this.userService.dims) || [];
      cloneDims.push(contentDetails.courseId);
      if (contentDetails.batchId) {
        cloneDims.push(contentDetails.batchId);
      }
      configuration.context.dims = cloneDims;
    }
    const tags = [];
    _.forEach(_.get(this.userService, 'userProfile.organisations'), (org) => {
      if (org.hashTagId) {
        tags.push(org.hashTagId);
      }
    });
    configuration.context.tags = tags;
    configuration.context.app = [this.userService.channel];
    if (contentDetails.courseId) {
      configuration.context.cdata = [{
        id: contentDetails.courseId,
        type: 'course'
      }];
      if (contentDetails.batchId) {
        configuration.context.cdata.push({ type: 'batch',
        id: contentDetails.batchId} );
      }
    }
    configuration.context.pdata.id = this.userService.appId;
    configuration.metadata = contentDetails.contentData;
    configuration.data = contentDetails.contentData.mimeType !== this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent ?
      {} : contentDetails.contentData.body;
    configuration.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
    configuration.config.previewCdnUrl = this.previewCdnUrl;
    return configuration;
  }

  /**
   *
   *
   * @private
   * @param {Array<string>} [data=[]]
   * @returns
   * @memberof TelemetryService
   */
  private getRollUpData(data: Array<string> = []) {
    const rollUp = {};
    data.forEach((element, index) => rollUp['l' + (index + 1)] = element);
    return rollUp;
  }

  public getCollectionHierarchy(identifier: string, option: any = { params: {} }): Observable<CollectionHierarchyAPI.Get> {
    const req = {
      url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`,
      param: option.params
    };
    // add the content id to the tag array here
    // window['TagManger'].SBTagService.pushTag(identifier, 'CONTENT_', false);
    return this.publicDataService.get(req).pipe(map((response: ServerResponse) => {
      if (response.result.content) {
        response.result.content = this.utilService.sortChildrenWithIndex(response.result.content);
      }
      this.collectionData = response.result.content;
      return response;
    }));
  }
  updateContentBodyForReviewer(data) {
    // data object is body of the content after JSON.parse()
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = null;
    }
    if (!parsedData) {
      return data;
    }
    const questionSetPluginId = 'org.ekstep.questionset';
    const questionPluginId = 'org.ekstep.question';
    // checking content has questionset plugin dependency
    const isQuestionSetPluginExist = parsedData.theme['plugin-manifest']['plugin'].filter((plugin) => {
        return plugin.id !== questionSetPluginId;
    });

    if (isQuestionSetPluginExist) {
        // checking each stage for questionset plugin
        parsedData.theme['stage'].forEach((stage) =>  {
            if (stage[questionSetPluginId]) {
                // checking each questionset plugin inside a stage
                stage[questionSetPluginId].forEach( (questionSetData) => {
                    const questionSetConfigData = JSON.parse(questionSetData.config.__cdata);
                    const actualNumberOfQuestions = questionSetData[questionPluginId].length;
                    // ensuring total items (display items ) always equval to number of questions inside question set
                    questionSetConfigData.total_items = actualNumberOfQuestions;
                    // ensuring shuffle is always off for the reviewer
                    questionSetConfigData.shuffle_questions = false;
                    questionSetData.config.__cdata = JSON.stringify(questionSetConfigData);
                });
            }
        });
    }
    return JSON.stringify(parsedData);
  }

  playContent(content, queryParams?) {
    this.navigationHelperService.storeResourceCloseUrl();
    setTimeout(() => { // setTimeOut is used to trigger telemetry interact event as changeDetectorRef.detectChanges() not working.
      if (content.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection ||
        _.get(content, 'metaData.mimeType') === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.collection) {
          if (!content.trackable && content.primaryCategory !== 'Course') {
            this.handleNavigation(content, false, queryParams);
          } else {
            const isTrackable = content.trackable && content.trackable.enabled === 'No' ? false : true;
            this.handleNavigation(content, isTrackable, queryParams);
          }
      } else if (content.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent) {
        this.router.navigate(['/resources/play/content', content.identifier]);
      } else if (content.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.questionset) {
        this.router.navigate(['/resources/play/questionset', content.identifier]);
      } else {
        this.router.navigate(['/resources/play/content', content.identifier]);
      }
    }, 0);
  }

  handleNavigation(content, isTrackable, queryParams?) {
    if (!isTrackable) {
      this.router.navigate(['/resources/play/collection', content.courseId || content.identifier],
      {queryParams: {contentType: content.contentType}});
    } else if (content.batchId) {
      this.router.navigate(['/learn/course', content.courseId || content.identifier, 'batch', content.batchId],
        { queryParams });
    } else {
      this.router.navigate(['/learn/course', content.identifier], { queryParams });
    }
  }
}
