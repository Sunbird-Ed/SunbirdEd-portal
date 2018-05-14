import { Injectable } from '@angular/core';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse,
  CourseStates, CourseProgressData, CourseProgress, ContentList, IUserData, IUserProfile
} from '@sunbird/shared';
import { ContentService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { CacheService } from 'ng2-cache-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
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

  public courseProgress = [];
  public localContentState: any = {};

  public isCachedDataExists: boolean;

  public completedCount: number;

  constructor(contentService: ContentService, configService: ConfigService,
    private _cacheService: CacheService,
    public toasterService: ToasterService, public resourceService: ResourceService, ) {
    this.contentService = contentService;
    this.configService = configService;
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
  updateCourseStateInServer(req) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.USER_CONTENT_STATE_UPDATE,
      data: {
        request: req
      }
    };
    return this.contentService.post(channelOptions).map(
      (updateCourseStatesData: ServerResponse) => {
        return updateCourseStatesData;
      });
  }

  prepareContentObject(res) {
    console.log('res', res[0].courseId, res[0].batchId);
    const courseId_batchId = res[0].courseId + '_' + res[0].batchId;
    this.localContentState[courseId_batchId] = {};
    this.localContentState[courseId_batchId].content = [];
    this.localContentState[courseId_batchId].content = res;
    this.localContentState[courseId_batchId].progress = 0;
    this.localContentState[courseId_batchId].totalCount = 4;
    this.localContentState[courseId_batchId].completedCount = 0;
    _.forEach(res, (contentList) => {
      if (contentList.status === 2) {
        this.localContentState[courseId_batchId].completedCount += 1;
      }
    });
    const progress = ((this.localContentState[courseId_batchId].completedCount /
      this.localContentState[courseId_batchId].totalCount) * 100);
    this.localContentState[courseId_batchId].progress = progress;
    this.courseProgress.push(this.localContentState);
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
    const courseId_batchId = req.courseId + '_' + req.batchId;
    this.getCourseStateFromAPI(reqData).subscribe(
      (res: ServerResponse) => {
        if (res && res.responseCode === 'OK') {
          console.log('res', res);
          this.prepareContentObject(res.result.contentList);
          console.log('this.courseProgress', this.courseProgress);
          console.log('this.localContentState[courseId_batchId]', this.localContentState[courseId_batchId]);
          // this._courseStatesData$.next({err: null, courseProgressData: this.localContentState});
          this._cacheService.set(courseId_batchId, this.localContentState[courseId_batchId],
            {
              maxAge: this.configService.appConfig.cacheServiceConfig.setTimeInMinutes *
                this.configService.appConfig.cacheServiceConfig.setTimeInSeconds
            });
        }
      },
      (err: ServerResponse) => {
        console.log('err', err);
        // this._courseStatesData$.next({err: null, courseProgressData: this.localContentState});
      }
    );
  }
  public updateCourseState(req) {
    console.log('req', req);
    const courseId_batchId = req.courseId + '_' + req.batchId;
    this.isCachedDataExists = this._cacheService.exists(courseId_batchId);
    if (this.isCachedDataExists) {
      const data: any | null = this._cacheService.get(courseId_batchId);
      const localContentState = data;
         console.log(localContentState.content);
        _.forEach(localContentState.content, (contentList) => {
          if (contentList.contentId === req.contentId && contentList.courseId === req.courseId
            &&  contentList.batchId === req.batchId ) {
              console.log('contentList', contentList);
              if (req.status > contentList.status) {
                console.log('update');
                contentList.status = req.status;
                this.prepareContentObject(contentList);
                this.updateCourseStateInServer(contentList).subscribe(
                  (res: ServerResponse) => {
                    if (res && res.responseCode === 'OK') {
                      this.prepareContentObject(contentList);
                      // this._courseStatesData$.next({err: null, courseProgressData: this.localContentState});
                    }
                  }, (err: ServerResponse) => {
                    console.log('err', err);
                    // this._courseStatesData$.next({err: null, courseProgressData: this.localContentState});
                  }
                );

              } else {
                console.log('no update');
                // this._courseStatesData$.next({err: null, courseProgressData: localContentState});
              }
            }
        });
  }
}
}
