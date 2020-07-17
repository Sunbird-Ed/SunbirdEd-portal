import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { combineLatest, Subject } from 'rxjs';
import { concatMap, debounceTime, delay, map, takeUntil, tap } from 'rxjs/operators';
import { GroupsService } from '../../../services';
import { IActivity } from '../activity-list/activity-list.component';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit {
  unsubscribe$ = new Subject<void>();
  showLoader = false;
  queryParams;
  activityId: string;
  groupId: string;
  groupData;
  activity: IActivity;
  memberListToShow = [];
  showSearchResults = false;
  memberCardConfig = { size: 'small', isBold: false, isSelectable: false, view: 'horizontal' };
  enrolmentCount: number;
  leafNodesCount: number;
  membersCount: number;
  members;
  telemetryImpression: IImpressionEventInput;
  loaderMessage = this.resourceService.messages.fmsg.m0087;

  // temp = { 'activity': { 'agg': [{ 'metric': 'enrolmentCount', 'lastUpdatedOn': 1594898939615, 'value': 2 }, { 'metric': 'leafNodesCount', 'lastUpdatedOn': 1557890515518, 'value': 10 }], 'id': 'do_2125636421522554881918', 'type': 'Course' }, 'groupId': 'ddebb90c-59b5-4e82-9805-0fbeabed9389', 'members': [{ 'role': 'admin', 'createdBy': '1147aef6-ada5-4d27-8d62-937db8afb40b', 'name': 'Tarento Mobility  ', 'userId': '1147aef6-ada5-4d27-8d62-937db8afb40b', 'status': 'active', 'agg': [{ 'metric': 'completedCount', 'lastUpdatedOn': 1594898939617, 'value': 4 }] }, { 'role': 'member', 'createdBy': '0a4300a0-6a7a-4edb-9111-a7c9c6a53693', 'name': 'Qualitrix Book Reviewer', 'userId': '9e74d241-004f-40d9-863e-63947ef10bbd', 'status': 'active', 'agg': [{ 'metric': 'completedCount', 'lastUpdatedOn': 1594898939617, 'value': 5 }] }] };
  constructor(
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private toasterService: ToasterService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchActivityOnParamChange();
    this.telemetryImpression = this.groupService.getImpressionObject(this.activatedRoute.snapshot, this.router.url);
  }

  private fetchActivityOnParamChange() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(debounceTime(5), // to sync params and queryParams events
        delay(10), // to trigger page exit telemetry event
        tap(data => {
          this.showLoader = true;
        }),
        map((result) => ({ params: { groupId: result[0].groupId, activityId: result[0].activityId }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$))
      .subscribe(({ params, queryParams }) => {
        this.queryParams = { ...queryParams };
        this.groupId = params.groupId;
        this.activityId = params.activityId;
        this.fetchActivity();
      });
  }

  validateUser(group) {
    const user = _.find(_.get(group, 'members'), (m) => _.get(m, 'userId') === this.userService.userid);
    /* istanbul ignore else */
    if (!user || _.get(user, 'role') === 'member' || _.get(user, 'status') === 'inactive' || _.get(group, 'status') === 'inactive') {
      this.toasterService.warning(this.resourceService.messages.emsg.noAdminRoleActivity);
      this.groupService.goBack();
    }
  }

  fetchActivity() {
    const activityData = { id: this.activityId, type: 'Course' };
    this.groupService.getGroupById(this.groupId, true, true)
      .pipe(
        tap(res => {
          this.validateUser(res);
        }),
        concatMap(res => {
          this.groupData = res;
          return this.groupService.getActivity(this.groupId, activityData, res);
        }),
        takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.showLoader = false;
        this.processData(data);
      }, error => {
        this.showLoader = false;
        console.error('Error', error);
        // this.processData(this.temp);
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.groupService.goBack();
      });
  }

  search(searchKey: string) {
    if (searchKey.trim().length) {
      this.showSearchResults = true;
      this.memberListToShow = this.members.filter(item => _.toLower(item.title).includes(searchKey));
      this.addTelemetry('activity-dashboard-member-search', [], { query: searchKey });
    } else {
      this.showSearchResults = false;
      this.memberListToShow = _.cloneDeep(this.members);
    }
  }

  processData(aggResponse: any) {
    const enrolmentInfo = _.find(aggResponse.activity.agg, { metric: 'enrolmentCount' });
    const leafNodesInfo = _.find(aggResponse.activity.agg, { metric: 'leafNodesCount' });
    this.enrolmentCount = _.get(enrolmentInfo, 'value');
    this.leafNodesCount = _.get(leafNodesInfo, 'value');
    this.membersCount = _.get(aggResponse, 'members.length');

    this.members = aggResponse.members.map((item) => {
      /* istanbul ignore else */
      if (_.get(item, 'status') === 'active') {
        const completedCount = _.get(_.find(item.agg, { metric: 'completedCount' }), 'value') || 0;
        return {
          title: _.get(item, 'name'),
          identifier: _.get(item, 'userId'),
          progress: Math.round((completedCount / this.leafNodesCount) * 100),
          initial: _.get(item, 'name[0]')
        };
      }
    });

    this.members = _.orderBy(this.members, ['title'], ['asc']);
    this.memberListToShow = _.cloneDeep(this.members);
    this.getActivityInfo();
  }

  getActivityInfo() {
    const activityData = _.find(this.groupData.activities, ['id', this.activityId]);
    this.activity = _.get(activityData, 'activityInfo');
  }

  addTelemetry(id, cdata, extra?) {
    this.groupService.addTelemetry(id, this.activatedRoute.snapshot, cdata, this.groupId, extra);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
