import { Injectable, EventEmitter } from '@angular/core';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse,
  CourseStates, CourseProgressData, CourseProgress, ContentList, IUserData, IUserProfile
} from '@sunbird/shared';
import { ContentService, UserService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { CacheService } from 'ng2-cache-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class CourseProgressService {
  /**
 * Reference of content service.
 */
  public contentService: ContentService;

  /**
   * Reference of config service
   */
  public configService: ConfigService;

  public courseProgress: any = {};

  public isCachedDataExists: boolean;

  public completedCount: number;

  public userService: UserService;

  public totalContentCount: number;

  public lastAccessTimeOfContentId: any = [];

  public lastPlayedContentId: any;

   /**
   * An event emitter to emit course progress data from a service.
   */
  courseProgressData: EventEmitter<any> = new EventEmitter();


  constructor(contentService: ContentService, configService: ConfigService,
    private _cacheService: CacheService,
    public toasterService: ToasterService, public resourceService: ResourceService,
    userService: UserService) {
    this.contentService = contentService;
    this.configService = configService;
    this.userService = userService;
  }

  getCourseStateFromAPI(req) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.USER_CONTENT_STATE_READ,
      data: {
        request: req
      }
    };
    return this.contentService.post(channelOptions);
  }

  /**
       * @method updateContentStateInServer
       * @desc Update content state
       * @memberOf Services.contentStateService
       * @param {object}  request - Request object
       * @param {object[]}  request.content - Content details
       * @returns {Promise} Promise object represents response code and message
       * @instance
       */
  updateContentStateInServer(data) {
    const req = {
      contentId: data.contentId,
      batchId: data.batchId,
      status: data.status,
      courseId: data.courseId,
      lastAccessTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ')
    };
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.USER_CONTENT_STATE_UPDATE,
      data: {
        request: {
          userId: this.userService.userid,
          contents: [req]
        }
      }
    };
    return this.contentService.patch(channelOptions).map(
      (updateCourseStatesData: ServerResponse) => {
        return updateCourseStatesData;
      });
  }

  prepareContentObject(res, courseId_batchId) {
    this.courseProgress[courseId_batchId] = {};
    this.courseProgress[courseId_batchId].content = [];
    this.courseProgress[courseId_batchId].content = res;
    this.courseProgress[courseId_batchId].progress = 0;
    this.courseProgress[courseId_batchId].totalCount = this.totalContentCount;
    this.courseProgress[courseId_batchId].completedCount = 0;
    _.forEach(res, (contentList) => {
      if (contentList.status === 2) {
        this.courseProgress[courseId_batchId].completedCount += 1;
      }
    });
    const progress = ((this.courseProgress[courseId_batchId].completedCount /
      this.courseProgress[courseId_batchId].totalCount) * 100);
    this.courseProgress[courseId_batchId].progress = progress > 100 ? 100 : progress;
    _.forEach(res, (e) => {
      this.lastAccessTimeOfContentId.push(e.lastAccessTime);
    });
    const i = _.findIndex(res, { lastAccessTime: this.lastAccessTimeOfContentId.sort().reverse()[0] });
    this.lastPlayedContentId = res[i].contentId;
    this.courseProgress[courseId_batchId].lastPlayedContentId = this.lastPlayedContentId;
  }
  /**
* @method getContentsState
* @desc Get content state
* @memberOf Services.contentStateService
* @param {object}  request - Request object
* @param {string}  request.userId - userIdentifier of user
* @param {object[]}  request.courseIds - course details
* @param {object[]}  request.contentIds - Content details
* @returns {Promise} Callback object represents response code and message
* @instance
*/
  public getContentsState(req) {
    const reqData = {
      userId: req.userId,
      courseId: req.courseId,
      contentIds: req.contentIds
    };
    this.totalContentCount = req.contentIds.length;
    const courseId_batchId = req.courseId + '_' + req.batchId;
    const courseProgress = this.courseProgress[courseId_batchId];
    const reqContentIds = [];
    _.forEach(req.contentIds, (contentId) => {
      reqContentIds.push({ 'contentId': contentId });
    });
    if (courseProgress !== undefined) {
      this.courseProgressData.emit(courseProgress);
      return Observable.of(courseProgress);
    } else {
      return this.getCourseStateFromAPI(reqData).map(
        (res: ServerResponse) => {
          if (res.result.contentList.length > 0) {
            this.prepareContentObject(res.result.contentList, courseId_batchId);
            const resContentIds = [];
            _.forEach(res.result.contentList, (contentList) => {
              resContentIds.push({ 'contentId': contentList.contentId });
            });
            this.getEmptyContentStatus(reqContentIds, resContentIds, req.courseId, req.batchId);
          } else {
            this.courseProgress[courseId_batchId] = {
              progress: 0,
              completedCount: 0,
              totalCount: this.totalContentCount,
              lastPlayedContentId : reqData.contentIds[0]
            };
            this.courseProgress[courseId_batchId].content = [];
            _.forEach(_.differenceBy(reqContentIds, [], 'contentId'), (value, key) => {
              this.courseProgress[courseId_batchId].content.push({
                'contentId': value['contentId'],
                'status': 0,
                'courseId': req.courseId,
                'batchId:': req.batchId,
                'lastAccessTime': null
              });
            });
          }
          this.courseProgressData.emit(this.courseProgress[courseId_batchId]);
          return this.courseProgress[courseId_batchId];
        }).catch((err) => {
          this.courseProgressData.emit({lastPlayedContentId: reqData.contentIds[0]});
            return err;
        });
    }
  }

  public updateContentsState(req) {
    const courseId_batchId = req.courseId + '_' + req.batchId;
    const courseProgress = this.courseProgress[courseId_batchId];
    if (courseProgress !== undefined && req.contentId !== undefined && req.status !== undefined) {
      const index = _.findIndex(courseProgress.content, { contentId: req.contentId, courseId: req.courseId });
      if ( index !== -1 && req.status >= courseProgress.content[index].status && courseProgress.content[index].status !== 2) {
        courseProgress.content[index].status = req.status;
        this.prepareContentObject(courseProgress.content, courseId_batchId);
        return this.updateContentStateInServer(courseProgress.content[index]).map(
          (res: ServerResponse) => {
            this.courseProgressData.emit(this.courseProgress[courseId_batchId]);
            return this.courseProgress[courseId_batchId];
          });
      } else {
        console.log('contentId/courseId not matched', req, this.courseProgress[courseId_batchId]);
        return Observable.of(this.courseProgress[courseId_batchId]);
      }
    } else {
      return Observable.of(this.courseProgress[courseId_batchId]);
    }
  }

  getEmptyContentStatus(reqContentIds, resContentIds, courseId, batchId) {
    const courseId_batchId = courseId + '_' + batchId;
    _.forEach(_.differenceBy(reqContentIds, resContentIds, 'contentId'), (value, key) => {
      this.courseProgress[courseId_batchId].content.push({
          'contentId': value['contentId'],
          'status': 0,
          'courseId': courseId,
          'batchId:': batchId,
          'lastAccessTime': null
        });
    });
  }
}
