import { Injectable } from '@angular/core';
import { PlayerService, CollectionHierarchyAPI, ContentService } from '@sunbird/core';
import {ServerResponse} from '@sunbird/shared';

@Injectable()
export class CourseConsumptionService {
  courseHierarchy: any;
  constructor(private playerService: PlayerService) { }
  getCourseHierarchy(courseId) {
    return this.playerService.getCollectionHierarchy(courseId).map((response: ServerResponse) => {
      this.courseHierarchy = response.result.content;
      return response;
    });
  }
}
