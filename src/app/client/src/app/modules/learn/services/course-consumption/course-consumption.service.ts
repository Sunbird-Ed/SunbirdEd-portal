import { Injectable } from '@angular/core';
import { PlayerService, CollectionHierarchyAPI, ContentService, } from '@sunbird/core';
import {ServerResponse} from '@sunbird/shared';
import { Observable } from 'rxjs/Observable';
import { CourseProgressService } from '../courseProgress/course-progress.service';

@Injectable()
export class CourseConsumptionService {

  courseHierarchy: any;

  constructor(private playerService: PlayerService, private courseProgressService: CourseProgressService) { }

  getCourseHierarchy(courseId) {
    if (this.courseHierarchy && this.courseHierarchy.identifier === courseId) {
      return Observable.of(this.courseHierarchy);
    } else {
      return this.playerService.getCollectionHierarchy(courseId).map((response: ServerResponse) => {
        this.courseHierarchy = response.result.content;
        return response.result.content;
      });
    }
  }

  getConfigByContent(contentId, options) {
    return this.playerService.getConfigByContent(contentId, options);
  }
  getContentState(req) {
    return this.courseProgressService.getContentState(req);
  }
  updateContentsState(req) {
    return this.courseProgressService.updateContentsState(req);
  }
}
