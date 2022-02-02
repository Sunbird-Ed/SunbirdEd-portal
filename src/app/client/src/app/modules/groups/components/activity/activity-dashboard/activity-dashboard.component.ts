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
  groupData: any;
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
    } else {
      // if we refresh the page, the router data will be undefined so its redirect to group detail page
      this.navigateBack();
    }
  }

  ngOnInit() {
    // if we refresh the page, the groupdata will be undefined so its redirect to group detail page
    this.groupData = this.groupService.groupData ? this.groupService.groupData : this.navigateBack();
    this.getAggData();
  }

  getAggData() {
    const leafNodesCount = _.get(this.hierarchyData, 'leafNodesCount') || 0;
    const activityData = { id: _.get(this.hierarchyData, 'identifier'), type: 'Course' };
    const groupId = this.activatedRoute.snapshot.params.groupId;
    this.groupService.getActivity(groupId, activityData, this.groupData, leafNodesCount)
      .subscribe((data) => {
        this.activity = data;
        this.memberListUpdatedOn = _.max(_.get(data, 'activity.agg').map(agg => agg.lastUpdatedOn));
        this.getDashletData();
      }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        this.navigateBack();
      });
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
    const groupId = this.activatedRoute.snapshot.params.groupId;
    this.router.navigate([`${MY_GROUPS}/${GROUP_DETAILS}`, groupId]);
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
