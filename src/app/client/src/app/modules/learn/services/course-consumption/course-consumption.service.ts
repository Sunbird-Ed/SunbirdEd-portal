
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PlayerService } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';
import { CourseProgressService } from '../courseProgress/course-progress.service';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class CourseConsumptionService {

  courseHierarchy: any;

  constructor(private playerService: PlayerService, private courseProgressService: CourseProgressService) { }

  getCourseHierarchy(courseId, option: any = { params: {} }) {
    if (this.courseHierarchy && this.courseHierarchy.identifier === courseId) {
      return observableOf(this.courseHierarchy);
    } else {
      return this.playerService.getCollectionHierarchy(courseId, option).pipe(map((response: ServerResponse) => {
        this.courseHierarchy = response.result.content;
        return response.result.content;
      }));
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
