import { Component, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html'
})
export class CourseInfoComponent {

  @Input() courseHierarchy;
  showContentCreditsModal = false;
  showCredits = false;

  constructor(public resourceService: ResourceService) { }

  ngOnChanges() {
    this.checkContentCreditAvailability();
  }

  checkContentCreditAvailability() {
    /* istanbul ignore else */
    if (this.courseHierarchy.copyright || this.courseHierarchy.creators || this.courseHierarchy.attributions ||
      (!_.isEmpty(this.courseHierarchy.originData) && this.courseHierarchy.contentType === 'Course')) {
      this.showCredits = true;
    }
  }
}
