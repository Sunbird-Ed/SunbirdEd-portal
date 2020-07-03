import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-course-completion',
  templateUrl: './course-completion.component.html',
  styleUrls: ['./course-completion.component.scss']
})
export class CourseCompletionComponent implements OnDestroy {

  @ViewChild('modal') modal;
  constructor(public resourceService: ResourceService) { }

  closeModal() {
    /* istanbul ignore else */
    if (_.get(this.modal.deny)) {
      this.modal.deny();
    }
  }

  ngOnDestroy() {
    this.closeModal();
  }
}
