import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../../services';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { debounceTime, delay, map, takeUntil, tap } from 'rxjs/operators';
import { CsGroup } from '@project-sunbird/client-services/models';
import { ToasterService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '@sunbird/shared';
import { CourseConsumptionService } from '@sunbird/learn';
import { combineLatest, Subject } from 'rxjs';
import { IActivity } from '../activity-list/activity-list.component';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit {
  queryParams: any;
  activityId: any;
  activityType: string;
  groupData: any;
  groupId: string;
  telemetryImpression: IImpressionEventInput;
  isLoader = true;
  public unsubscribe$ = new Subject<void>();
  public coursehierarchy: any;
  aggregateData: any;
  activity: IActivity;
  dashletData: any;
  data = { values: [] };
  config = { columnConfig: [] };
  loaderMessage = this.resourceService.messages.fmsg.m0087;

  constructor(
    private groupService: GroupsService,
    private toasterService: ToasterService,
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    public configService: ConfigService,
    public courseConsumptionService: CourseConsumptionService) { }

  ngOnInit() {
    this.fetchActivityOnParamChange();
  }

  /**
   * @description - To fetch the data from activatedRoute
   */
  private fetchActivityOnParamChange() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(debounceTime(5), // to sync params and queryParams events
        delay(10), // to trigger page exit telemetry event
        tap(data => {
          this.isLoader = true;
        }),
        map((result) => ({ params: { groupId: result[0].groupId, activityId: result[0].activityId }, queryParams: result[1] })),
        takeUntil(this.unsubscribe$))
      .subscribe(({ params, queryParams }) => {
        this.queryParams = { ...queryParams };
        this.groupId = params.groupId;
        this.activityId = params.activityId;
        this.activityType = _.get(this.queryParams, 'primaryCategory') || 'Course';
        this.fetchActivity();
      });
  }

  /**
   * @description - get activity data based activityId
   */
  getActivityInfo() {
    const activityData = _.find(this.groupData.activities, ['id', this.activityId]);
    this.activity = _.get(activityData, 'activityInfo');
  }

  /**
   * @description - fetch group activitydata based on groupId
   */
  fetchActivity() {
    this.isLoader = true;
    this.groupService.getGroupById(this.groupId, true, true).pipe(takeUntil(this.unsubscribe$)).subscribe((groupData: CsGroup) => {
      this.groupData = groupData;
      this.isLoader = false;
      this.getActivityInfo();
      this.getHierarchy();
    }, err => {
      this.isLoader = false;
      this.groupService.goBack();
      this.toasterService.error(this.resourceService.messages.emsg.m002);
    });
  }

  /**
   * @description - get courseheirarchy data for tracable activities
   */
  getHierarchy() {
    this.isLoader = true;
    const inputParams = { params: this.configService.appConfig.CourseConsumption.contentApiQueryParams };
    this.courseConsumptionService.getCourseHierarchy(this.activityId, inputParams).subscribe(response => {
      this.coursehierarchy = response.children;
      this.isLoader = false;
      this.getAggData();
    }, err => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      this.isLoader = false;
      this.navigateBack();
    });
  }

  /**
   * @description - get aggregateData for tracable activities
   */
  getAggData() {
    this.isLoader = true;
    const activityData = { id: this.activityId, type: 'Course' };
    this.groupService.getActivity(this.groupId, activityData, this.groupData)
      .subscribe((data) => {
        this.aggregateData = data;
        this.isLoader = false;
        this.getDashletData();
      }, err => {
        this.isLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        this.navigateBack();
      });
  }

   /**
   * @description - get dashlet data for dashlet library
   */
  getDashletData() {
    this.isLoader = true;
    this.dashletData = this.groupService.getDashletData(this.coursehierarchy, this.aggregateData);
    if (this.dashletData) {
      this.isLoader = false;
      this.data.values = this.dashletData.rows;
      this.config.columnConfig = this.dashletData.columns;
    }
  }
  /**
   * @description - it will navigate to the previous page when an error occurs while calling any API's
   */
  navigateBack() {
    this.toasterService.error(this.resourceService.messages.emsg.m0005);
    this.groupService.goBack();
  }

}
