
import { LearnerService } from '@sunbird/core';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigService } from '@sunbird/shared';

@Injectable()

export class NotesService {

  public config: ConfigService;

  constructor(public learnerService: LearnerService, config: ConfigService) {
    this.config = config;
   }

  updateNotesListData: EventEmitter<any> = new EventEmitter();
  finalNotesListData: EventEmitter<any> = new EventEmitter();
  selectedNote: any = {};

  public search(request) {
    const option = {
      url: `${this.config.urlConFig.URLS.NOTES.SEARCH}`,
      data: request
    };
    return this.learnerService.post(option);
  }

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
        id: request.request.id
      };
      this.updateNotesListData.emit(returnObj);
    });
  }
  public update(request) {
    const option = {
      url: `${this.config.urlConFig.URLS.NOTES.UPDATE}${request.noteId}`,
      data: request
    };
    return this.learnerService.patch(option);
  }
  public remove(request: { noteId: string }) {
    const option = {
      url: `${this.config.urlConFig.URLS.NOTES.DELETE}${request.noteId}`
    };
    return this.learnerService.delete(option).map(data => {
      this.finalNotesListData.emit(request.noteId);
    });
  }
}
