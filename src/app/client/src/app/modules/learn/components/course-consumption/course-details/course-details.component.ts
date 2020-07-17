import { Component, Input } from '@angular/core';
import {ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent {
  @Input() courseHierarchy: any;
  readMore = false;

  constructor(public resourceService: ResourceService) { }
}
