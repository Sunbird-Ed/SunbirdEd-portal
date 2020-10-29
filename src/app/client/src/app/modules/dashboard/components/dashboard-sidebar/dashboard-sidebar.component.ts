import { PermissionService } from '@sunbird/core';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent implements OnInit {

  courseStatsEdata: IInteractEventEdata;
  courseBatchesEdata: IInteractEventEdata;
  courseCertificatesEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;

  constructor(public resourceService: ResourceService, public router: Router,
    private activatedRoute: ActivatedRoute, public permissionService: PermissionService) {
    }

    ngOnInit() {
      this.setTelemetryData();
    }

    canReissueCert() {
      return this.permissionService.checkRolesPermissions(['CONTENT_CREATOR']);
    }

    setTelemetryData() {
      this.courseStatsEdata = {
        id: 'course-dashboard',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
      };
      this.courseBatchesEdata = {
        id: 'course-batches',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
      };
      this.courseCertificatesEdata = {
        id: 'course-reissue-cert',
        type: 'click',
        pageid: _.get(this.activatedRoute.snapshot, 'data.telemetry.pageid'),
      };
      this.telemetryInteractObject = {
        id: _.get(this.activatedRoute.snapshot, 'params.courseId'),
        type: _.get(this.activatedRoute.snapshot, 'data.telemetry.object.type'),
        ver: _.get(this.activatedRoute.snapshot, 'data.telemetry.object.ver'),
      };
    }
}
