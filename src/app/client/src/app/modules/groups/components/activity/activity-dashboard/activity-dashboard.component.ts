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
  showLoader = true;
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
  memberListUpdatedOn: string;

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
        const type = _.get(this.queryParams, 'contentType') || 'Course';
        this.fetchActivity(type);
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

  fetchActivity(type: string) {
    const activityData = { id: this.activityId, type };
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
    searchKey = _.toLower(searchKey);
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
    this.memberListUpdatedOn = _.get(_.find(aggResponse.members[0].agg, { metric: 'completedCount' }), 'lastUpdatedOn');

    this.members = aggResponse.members.map((item, index) => {
      /* istanbul ignore else */
      if (_.get(item, 'status') === 'active') {
        const completedCount = _.get(_.find(item.agg, { metric: 'completedCount' }), 'value') || 0;
        return {
          title: _.get(item, 'userId') === this.userService.userid ?
          `${_.get(item, 'name')}(${this.resourceService.frmelmnts.lbl.you})` : _.get(item, 'name'),
          identifier: _.get(item, 'userId'),
          progress: _.toString(Math.round((completedCount / this.leafNodesCount) * 100)),
          initial: _.get(item, 'name[0]'),
          indexOfMember: index
        };
      }
    });

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
