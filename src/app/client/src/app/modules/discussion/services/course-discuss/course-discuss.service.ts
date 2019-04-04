import { of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { ContentService, UserService, CoursesService } from '@sunbird/core';
import { DiscussionService } from '../discussions/discussions.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class CourseDiscussService {
  /**
 * Reference of content service.
 */
  public contentService: ContentService;
  public discussionService: DiscussionService;

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


  constructor(contentService: ContentService, discussionService: DiscussionService, configService: ConfigService,
    userService: UserService, public coursesService: CoursesService) {
    this.contentService = contentService;
    this.discussionService = discussionService;
    this.configService = configService;
    this.userService = userService;
  }

  /**
  * method to post discussion thread
  */
  public postDiscussion(req) {
    const contextId = req.contextId;
    const requestBody = {
      'request': {
        'title': req.title,
        'body': req.body,
        'contextId': contextId,
        'contextType': 'batch',
        'type': 'public',
        'config': {
          'upVote': true,
          'downVote': true,
          'acceptAnswer': true,
          'flag': true
        }
      }
    };
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.COURSE_DISCUSSIONS_POST,
      data: requestBody
    };
    return this.discussionService.post(channelOptions).pipe(map((res: ServerResponse) => {
      return res;
    }), catchError((err) => {
      return err;
    }));

  }


  public retrieveDiscussion(req) {
    const batchId = req;
    const requestBody = {
      'request':
        {
          'contextId': batchId,
          'type': 'public'
        }
    };
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.RETRIEVE_DISCUSSION,
      data: requestBody
    };
    return this.discussionService.post(channelOptions).pipe(map((res: ServerResponse) => {
      return res;
    }), catchError((err) => {
      return err;
    }));

  }

  public replyToThread(req) {
    const threadId = req.threadId;
    const body = req.body;
    const requestBody = {
      'request': {
        'threadId': threadId,
        'body': body
      }
    };
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.REPLY_TO_THREAD,
      data: requestBody
    };
    return this.discussionService.post(channelOptions).pipe(map((res: ServerResponse) => {
      return res;
    }), catchError((err) => {
      return err;
    }));

  }

  public getReplies(id) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.RETRIEVE_REPLIES + id
    };
    return this.discussionService.get(channelOptions).pipe(map((res: ServerResponse) => {
      return res;
    }), catchError((err) => {
      return err;
    }));

  }

  public likeReply(body) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.LIKE_POST,
      data: body
    };
    return this.discussionService.post(channelOptions).pipe(map((res: ServerResponse) => {
      return res;
    }), catchError((err) => {
      return err;
    }));

  }
  public uploadFile(file) {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('type', 'upload');
    // let requestBody =
    // {
    //   "request": {
    //     "threadId": threadId,
    //     "body": body
    //   }
    // }
    console.log('formData', formData);
    const channelOptions = {
      url: this.configService.urlConFig.URLS.COURSE.UPLOAD_FILE,
      data: formData
    };
    return this.discussionService.post(channelOptions).pipe(map((res: ServerResponse) => {
      return res;
    }), catchError((err) => {
      return err;
    }));
  }

}
