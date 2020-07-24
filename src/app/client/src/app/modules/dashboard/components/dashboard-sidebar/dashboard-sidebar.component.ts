import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component } from '@angular/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent {

  courseStatsEdata: IInteractEventEdata;
  courseBatchesEdata: IInteractEventEdata;
  courseCertificatesEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  state: {};

  constructor(public resourceService: ResourceService, public router: Router,
    private activatedRoute: ActivatedRoute) {
      this.state = history.state;
      this.courseStatsEdata = {
        id: 'stats',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
      };
      this.courseBatchesEdata = {
        id: 'course-batches',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
      };
      this.courseCertificatesEdata = {
        id: 'course-certificates',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
      };
      this.telemetryInteractObject = {
        id: _.get(this.activatedRoute.snapshot, 'params.courseId') || _.get(this.state, 'id'),
        type: _.get(this.state, 'type'),
        ver: `${_.get(this.state, 'ver')}` || '1.0',
      };
    }

}
