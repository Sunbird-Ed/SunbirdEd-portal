import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { ContentService, UserService, CoursesService } from '@sunbird/core';
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

  public userService: UserService;

  /**
  * An event emitter to emit course progress data from a service.
  */
  courseProgressData: EventEmitter<any> = new EventEmitter();


  constructor(contentService: ContentService, configService: ConfigService,
    userService: UserService, public coursesService: CoursesService) {
    this.contentService = contentService;
    this.configService = configService;
    this.userService = userService;
  }

  /**
  * method to get content status
  */
  public getContentState(req) {
    const courseId_batchId = req.courseId + '_' + req.batchId;
    const courseProgress = this.courseProgress[courseId_batchId];
    if (courseProgress) {
      this.courseProgressData.emit(courseProgress);
      return observableOf(courseProgress);
    } else {
      const channelOptions = {
        url: this.configService.urlConFig.URLS.COURSE.USER_CONTENT_STATE_READ,
        data: {
          request: {
            userId: req.userId,
            courseId: req.courseId,
            contentIds: req.contentIds,
            batchId: req.batchId
          }
        }
      };
      return this.contentService.post(channelOptions).pipe(map((res: ServerResponse) => {
        this.processContent(req, res, courseId_batchId);
        this.courseProgressData.emit(this.courseProgress[courseId_batchId]);
        return this.courseProgress[courseId_batchId];
      }), catchError((err) => {
        this.courseProgressData.emit({ lastPlayedContentId: req.contentIds[0] });
        return err;
      }), );

    }
  }

  private processContent(req, res, courseId_batchId) {
    this.courseProgress[courseId_batchId] = {
      progress: 0,
      completedCount: 0,
      totalCount: req.contentIds.length,
      content: []
    };
    const resContentIds = [];
    if (res.result.contentList.length > 0) {
      _.forEach(res.result.contentList, (content) => {
        if (content.batchId === req.batchId && content.courseId === req.courseId) {
          this.courseProgress[courseId_batchId].content.push(content);
          resContentIds.push(content.contentId);
        }
      });
      _.forEach(_.difference(req.contentIds, resContentIds), (value, key) => {
        this.courseProgress[courseId_batchId].content.push({
          'contentId': value,
          'status': 0,
          'courseId': req.courseId,
          'batchId': req.batchId,
        });
      });
      this.calculateProgress(courseId_batchId);
    } else {
      _.forEach(req.contentIds, (value, key) => {
        this.courseProgress[courseId_batchId].content.push({
          'contentId': value,
          'status': 0,
          'courseId': req.courseId,
          'batchId': req.batchId,
        });
      });
      this.courseProgress[courseId_batchId].lastPlayedContentId = req.contentIds[0];
    }
  }

  private calculateProgress(courseId_batchId) {
    const lastAccessTimeOfContentId = [];
    let completedCount = 0;
    const contentList = this.courseProgress[courseId_batchId].content;
    _.forEach(contentList, (content) => {
      if (content.status === 2) {
        completedCount += 1;
      }
      if (content.lastAccessTime) {
        lastAccessTimeOfContentId.push(content.lastAccessTime);
      }
    });
    this.courseProgress[courseId_batchId].completedCount = completedCount;
    const progress = ((this.courseProgress[courseId_batchId].completedCount / this.courseProgress[courseId_batchId].totalCount) * 100);
    this.courseProgress[courseId_batchId].progress = progress > 100 ? 100 : progress;
    const index = _.findIndex(contentList, { lastAccessTime: lastAccessTimeOfContentId.sort().reverse()[0] });
    const lastPlayedContent = contentList[index] ? contentList[index] : contentList[0];
    this.courseProgress[courseId_batchId].lastPlayedContentId = lastPlayedContent && lastPlayedContent.contentId;
  }

  public updateContentsState(req) {
    const courseId_batchId = req.courseId + '_' + req.batchId;
    const courseProgress = this.courseProgress[courseId_batchId];
    if (courseProgress && req.contentId && req.status) {
      const index = _.findIndex(courseProgress.content, { 'contentId': req.contentId });
      if (index !== -1 && req.status >= courseProgress.content[index].status
        && courseProgress.content[index].status !== 2) {
        courseProgress.content[index].status = req.status;
        return this.updateContentStateToServer(courseProgress.content[index]).pipe(
          map((res: any) => {
            this.courseProgress[courseId_batchId].content[index].status = req.status;
            this.courseProgress[courseId_batchId].content[index].lastAccessTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ');
            this.calculateProgress(courseId_batchId);
            this.courseProgressData.emit(this.courseProgress[courseId_batchId]);
            this.coursesService.updateCourseProgress(req.courseId, req.batchId, this.courseProgress[courseId_batchId].completedCount);
            return this.courseProgress[courseId_batchId];
          }));
      } else {
        console.log('contentId/courseId not matched or status is 2', req);
        return observableOf(this.courseProgress[courseId_batchId]);
      }
    } else {
      return observableOf(this.courseProgress[courseId_batchId]);
    }
  }
  /**
   * to make api call to server
   */
  private updateContentStateToServer(data) {
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
    return this.contentService.patch(channelOptions)
      .pipe(map((updateCourseStatesData: ServerResponse) => ({ updateCourseStatesData })));
  }
}
