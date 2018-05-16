import { Injectable } from '@angular/core';
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
  /**
   * BehaviorSubject Containing framework data.
   */
  private _courseStatesData: CourseProgress;
  /**
   * BehaviorSubject Containing framework data.
   */
  private _courseStatesData$ = new BehaviorSubject<CourseStates>(undefined);
  /**
   * Read only observable Containing framework data.
   */
  public readonly courseStatesData$: Observable<CourseStates> = this._courseStatesData$.asObservable();


  public courseProgress: any = {};

  public isCachedDataExists: boolean;

  public completedCount: number;

  public userService: UserService;

  public totalContentCount: number;

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
    return this.contentService.post(channelOptions).map(
      (courseStates: ServerResponse) => {
        console.log('courseStates api res', courseStates);
        return courseStates;
      });
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
      lastAccessTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
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
    this.courseProgress[courseId_batchId].progress = progress;
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
    console.log('req', req);
    const reqData = {
      userId: req.userId,
      courseId: req.courseId,
      contentIds: req.contentIds
    };
    this.totalContentCount = req.contentIds.length;
    const courseId_batchId = req.courseId + '_' + req.batchId;
    const courseProgress = this.courseProgress[courseId_batchId];
    console.log('courseProgress', courseProgress);
    if (courseProgress !== undefined) {
      return Observable.of(courseProgress);
    } else {
      return this.getCourseStateFromAPI(reqData).map(
        (res: ServerResponse) => {
          if (res.result.contentList.length > 0) {
            this.prepareContentObject(res.result.contentList, courseId_batchId);
          } else {
            this.courseProgress[courseId_batchId] = {
              content: [],
              progress: 0,
              completedCount: 0,
              totalCount: this.totalContentCount
            };
          }
          console.log('this.courseProgress', this.courseProgress);
          return this.courseProgress[courseId_batchId];
        }).catch(
        (err: ServerResponse) => {
          console.log('err', err);
          return Observable.of(err);
        }
        );
    }
  }

  public updateContentsState(req) {
    console.log('req', req);
    const courseId_batchId = req.courseId + '_' + req.batchId;
    const courseProgress = this.courseProgress[courseId_batchId];
    if (courseProgress !== undefined) {
      const i = _.findIndex(courseProgress.content,
        { contentId: req.contentId, courseId: req.courseId });
      console.log('i', i);
      console.log(' courseProgress.content[i].status', courseProgress.content[i].status);
      if (req.status < courseProgress.content[i].status) {
        console.log('update');
        courseProgress.content[i].status = req.status;
        this.prepareContentObject(courseProgress.content, courseId_batchId);
        return this.updateContentStateInServer(courseProgress.content[i]).map(
          (res: ServerResponse) => {
            return this.courseProgress[courseId_batchId];
          }).catch(
          (err: ServerResponse) => {
            console.log('err', err);
            return Observable.of(err);
          }
          );
      } else {
        console.log('no update');
        return Observable.of(this.courseProgress[courseId_batchId]);
      }
    } else {
      return Observable.of(this.courseProgress[courseId_batchId]);
    }
  }
}
