import { Component, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html'
})
export class CourseInfoComponent {

  @Input() courseHierarchy;
  showContentCreditsModal = false;

  constructor(public resourceService: ResourceService) { }

}
