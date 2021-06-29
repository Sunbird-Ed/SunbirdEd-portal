import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../../services';
import { ToasterService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute } from '@angular/router';
import { MY_GROUPS, GROUP_DETAILS } from '../../../interfaces/routerLinks';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit {

  hierarchyData: any;
  dashletData: any;
  activity: any;
  memberListUpdatedOn: string;

  constructor(
    private groupService: GroupsService,
    private toasterService: ToasterService,
    public resourceService: ResourceService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    const _routerExtras = this.router.getCurrentNavigation();
    if (_.get(_routerExtras, 'extras.state')) {
      const extras = _.get(_routerExtras, 'extras.state');
      this.hierarchyData = extras.hierarchyData;
      this.activity = extras.activity;
      this.memberListUpdatedOn = extras.memberListUpdatedOn;
    } else {
      const groupId = this.activatedRoute.snapshot.params.groupId;
      this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, groupId]);
    }
  }

  ngOnInit() {
    this.getDashletData();
  }

  /**
   * @description - get dashlet data for dashlet library
   */
  getDashletData() {
    this.groupService.getDashletData(this.hierarchyData.children, this.activity).subscribe((data) => {
      this.dashletData = data;
    }, err => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      this.navigateBack();
    });
  }

  /**
   * @description - it will navigate to the previous page when an error occurs while calling any API's
   */
  navigateBack() {
    this.toasterService.error(this.resourceService.messages.emsg.m0005);
    this.groupService.goBack();
  }

  /**
   * @description - telemetry Intract Event call
   * @param  {} id
   * @param  {} cdata
   * @param  {} extra?
   * @param  {} obj?
   */
  addTelemetry() {
    const object = { id: this.activatedRoute.snapshot.params.activityId, type: 'course' };
    this.groupService.addTelemetry({ id: 'download-csv', extra: {} },
      this.activatedRoute.snapshot, [], this.activatedRoute.snapshot.params.groupId, object);
  }
}
