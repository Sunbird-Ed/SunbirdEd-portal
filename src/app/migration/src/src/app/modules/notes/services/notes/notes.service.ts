
import { LearnerService } from '@sunbird/core';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { INotesListData } from '@sunbird/notes';

@Injectable()

export class NotesService {
  /**
   * To get url and app config.
   */
  public config: ConfigService;

  /**
   * The constructor
   * @param {LearnerService} learnerService Reference of LearnerService
   * @param {ConfigService} config Reference of ConfigService
   */

  constructor(public learnerService: LearnerService, config: ConfigService) {
    this.config = config;
  }
  /**
   * An event emitter to update notesList after creating a note.
   */
  updateNotesListData: EventEmitter<any> = new EventEmitter();
  /**
   * An event emitter to update notesList after removing a note.
   */
  finalNotesListData: EventEmitter<any> = new EventEmitter();
  /**
   * To save 'selectedNote' value from NotesList Component.
   */
  selectedNote: INotesListData;

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
    return this.learnerService.post(option).map(data => {
      const returnObj = {
        note: request.request.note,
        userId: request.request.userId,
        title: request.request.title,
        courseId: request.request.courseId,
        contentId: request.request.contentId,
        createdBy: request.request.createdBy,
        updatedBy: request.request.updatedBy,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        id: data.result.id
      };
      this.updateNotesListData.emit(returnObj);
      return data;
    });
  }

  /**
   * API call to update an existing note.
   */
  public update(request) {
    const option = {
      url: `${this.config.urlConFig.URLS.NOTES.UPDATE + '/'}${request.noteId}`,
      data: request
    };
    return this.learnerService.patch(option).map( data => {
    this.updateNotesListData.emit(0);
    return data;
  });
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
