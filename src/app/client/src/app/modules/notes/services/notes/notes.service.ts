
import {map} from 'rxjs/operators';
import { LearnerService } from '@sunbird/core';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { INoteData } from '@sunbird/notes';

@Injectable()

export class NotesService {
  /**
   * To get url and app config.
   */
  config: ConfigService;
  /**
   * Reference of Learner service.
   */
  learnerService: LearnerService;
  /**
   * The constructor - Constructor for Notes Service
   * @param {LearnerService} learnerService Reference of LearnerService
   * @param {ConfigService} config Reference of ConfigService
   */
  constructor(learnerService: LearnerService, config: ConfigService) {
    this.config = config;
    this.learnerService = learnerService;
  }
  /**
   * API call to gather existing notes.
   */
  public search(request) {
    const option = {
      url: `${this.config.urlConFig.URLS.NOTES.SEARCH}`,
      data: request
    };
    return this.learnerService.post(option);
  }
  /**
   * API call to create a new note.
   */
  public create(request) {
    const option = {
      url: `${this.config.urlConFig.URLS.NOTES.CREATE}`,
      data: request
    };
    return this.learnerService.post(option).pipe(map(data => {
      const returnObj = {
        note: request.request.note,
        userId: request.request.userId,
        id: data.result.id,
        title: request.request.title,
        courseId: request.request.courseId,
        contentId: request.request.contentId,
        createdBy: request.request.createdBy,
        updatedBy: request.request.updatedBy,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };

      return returnObj;
    }));
  }
  /**
   * API call to update an existing note.
   */
  public update(request) {
    const option = {
      url: `${this.config.urlConFig.URLS.NOTES.UPDATE + '/'}${request.noteId}`,
      data: request
    };
    return this.learnerService.patch(option).pipe(map(data => {
      const returnObj = {
        note: request.request.note,
        title: request.request.title,
        updatedDate: new Date().toISOString(),
        id: request.noteId
      };

      return returnObj;
    }));
  }
  /**
   * API call to remove an existing note.
   */
  public remove(request) {
    const option = {
      url: `${this.config.urlConFig.URLS.NOTES.DELETE + '/'}${request.noteId}`,
      data: request
    };
    return this.learnerService.delete(option);
  }
}
