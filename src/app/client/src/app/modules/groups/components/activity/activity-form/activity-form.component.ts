/* istanbul ignore next */

import { Component, Output, EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent {

  @Output() nextClick = new EventEmitter<any>();
  constructor(public resourceService: ResourceService) {

  }

  next() {
    this.nextClick.emit({});
  }
}
