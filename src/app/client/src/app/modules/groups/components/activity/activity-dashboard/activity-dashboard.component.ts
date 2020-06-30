/* istanbul ignore next */

import { ResourceService } from'@sunbird/shared';
import { Component } from '@angular/core';
@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.scss']
})
export class ActivityDashboardComponent {
  constructor(public resourceService: ResourceService) {
  }
}
