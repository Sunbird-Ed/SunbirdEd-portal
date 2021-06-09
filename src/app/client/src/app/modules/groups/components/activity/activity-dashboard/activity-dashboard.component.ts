import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupsService } from '../../../services';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { debounceTime, delay, map, takeUntil, tap } from 'rxjs/operators';
import { ToasterService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '@sunbird/shared';
import { CourseConsumptionService } from '@sunbird/learn';
import { combineLatest, Subject } from 'rxjs';
import * as $ from 'jquery';
import 'datatables.net';
import { CsGroup } from '@project-sunbird/client-services/models';
import { IActivity } from '../activity-list/activity-list.component';

export interface IColumnConfig {
  // scrollX: boolean;
  // scrollY: boolean;
  columnConfig: [{
    title: string;
    data: string;
  }];
}

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit {

  @ViewChild('lib', { static: false }) lib: any;
  telemetryImpression: IImpressionEventInput;
  isLoader = true;
  public unsubscribe$ = new Subject<void>();
  Dashletdata: any;
  columnConfig: IColumnConfig;
  loaderMessage = _.get(this.resourceService.messages.fmsg, 'm0087');
  memberListUpdatedOn: string;
  activity: IActivity;
  groupId: string;
  constructor(
    private groupService: GroupsService,
    private toasterService: ToasterService,
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    public configService: ConfigService,
    public courseConsumptionService: CourseConsumptionService) { }

  ngOnInit() {
    $(document).ready(() => {
      // DataTable initialisation
      $('#table').DataTable({
        'paging': true,
        'autoWidth': true,
      });
    });
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
      .subscribe(({ params }) => {
        this.groupId = params.groupId;
        this.fetchActivity(params.groupId, params.activityId);
      });
  }

  /**
   * @description - fetch group activitydata based on groupId
   */
  fetchActivity(groupId, activityId) {
    this.isLoader = true;
    this.groupService.getGroupById(groupId, true, true).pipe(takeUntil(this.unsubscribe$)).subscribe((groupData: CsGroup) => {
      this.isLoader = false;
      this.getHierarchy(activityId, groupData);
    }, err => {
      this.isLoader = false;
      this.groupService.goBack();
      this.toasterService.error(this.resourceService.messages.emsg.m002);
    });
  }

  /**
   * @description - get courseheirarchy data for tracable activities
   */
  getHierarchy(activityId, groupData) {
    this.isLoader = true;
    const inputParams = { params: this.configService.appConfig.CourseConsumption.contentApiQueryParams };
    this.courseConsumptionService.getCourseHierarchy(activityId, inputParams).subscribe(response => {
      this.activity = response;
      const coursehierarchy = response.children;
      this.isLoader = false;
      this.getAggData(activityId, coursehierarchy, groupData, response.leafNodesCount);
    }, err => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0051);
      this.isLoader = false;
      this.navigateBack();
    });
  }

  /**
   * @description - get aggregateData for tracable activities
   */
  getAggData(activityId, coursehierarchy, groupData, leafNodesCount) {
    this.isLoader = true;
    const activityData = { id: activityId, type: 'Course' };
    this.groupService.getActivity(_.get(groupData, 'id'), activityData, groupData, leafNodesCount)
      .subscribe((data) => {
        const aggregateData = data;
        this.memberListUpdatedOn = _.max(_.get(data, 'activity.agg').map(agg => agg.lastUpdatedOn));
        this.isLoader = false;
        this.getDashletData(coursehierarchy, aggregateData);
      }, err => {
        this.isLoader = false;
        this.toasterService.error(this.resourceService.messages.fmsg.m0051);
        this.navigateBack();
      });
  }

  /**
   * @description - get dashlet data for dashlet library
   */
  getDashletData(coursehierarchy, aggregateData) {
    this.isLoader = true;
    this.groupService.getDashletData(coursehierarchy, aggregateData).subscribe(data => {
      this.isLoader = false;
      this.Dashletdata = { values: data.rows };
      this.columnConfig = {
        // scrollX: true,
        // scrollY: true,
        columnConfig: data.columns
      };
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
   * @description - To set the telemetry Intract event data
   * @param  {} id - group identifier
   */
  addTelemetry(id, cdata, extra?, obj?) {
    this.groupService.addTelemetry({ id, extra }, this.activatedRoute.snapshot, cdata, this.groupId, obj);
  }

  downloadCSV() {
    this.addTelemetry('download-csv', [], {},
      {
        id: _.get(this.activity, 'identifier'),
        type: _.get(this.activity, 'primaryCategory')
      });
    const fileName = _.get(this.activity, 'name') + '.csv';
    this.lib.instance.exportCsv({ 'strict': true }).then((csvData) => {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.click();
    }).catch((err) => {
      this.toasterService.error('There is an problem occurs while downloading CSV');
    });
  }
}
