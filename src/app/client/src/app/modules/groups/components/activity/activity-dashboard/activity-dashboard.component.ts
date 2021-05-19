import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { GroupsService } from '../../../services';
import { IGroupCard } from '../../../interfaces';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CsGroup } from '@project-sunbird/client-services/models';
import { UserService, SearchService } from '@sunbird/core';
import { ToasterService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { TocCardType } from '@project-sunbird/common-consumption-v8';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit {

  selectedActivityType = {};
  groupData: IGroupCard;
  private groupId: string;
  showActivityList = false;
  telemetryImpression: IImpressionEventInput;
  isLoader = true;
  filterTypes = [];
  activityCardTypes = [];
  allActivityTypes = [];
  noActivity = { name: 'Data is not Available' };
  public unsubscribe$ = new Subject<void>();
  cardType: TocCardType = TocCardType.COURSE;
  selectedActivity: string;
  onSelectedActivity = false;
  fileName = 'Activity Dashboard';
  public message = 'There is no data available';
  ActivityWiseData = [];
  isDownloadReport = false;
  columns = [
    { name: 'Name', isSortable: true, prop: 'name', placeholder: 'Filter name' },
    { name: 'Progress', isSortable: true, prop: 'progress', placeholder: 'Filter progress' },
    { name: 'Assesment1', isSortable: false, prop: 'assesment', placeholder: 'Filter assesment1' }];

  constructor(private groupService: GroupsService,
    private userService: UserService,
    private toasterService: ToasterService,
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    public searchService: SearchService) { }

  ngOnInit() {
    this.filterTypes.push({ label: 'All activities' });
    this.selectedActivity = this.filterTypes[0].label;
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    this.getGroupData();
  }

  getGroupData() {
    this.isLoader = true;
    this.groupService.getGroupById(this.groupId, true, true, true).pipe(takeUntil(this.unsubscribe$)).subscribe((groupData: CsGroup) => {
      const user = _.find(_.get(groupData, 'members'), (m) => _.get(m, 'userId') === this.userService.userid);
      if (!user || _.get(groupData, 'status') === 'inactive') {
        this.groupService.goBack();
      }
      this.groupService.groupData = groupData;
      this.groupData = this.groupService.addGroupFields(groupData);
      this.isLoader = false;
      const activityList = this.groupData.activitiesGrouped;
      activityList.forEach(element => {
        this.filterTypes.push({ label: element.title });
        this.activityCardTypes.push(element);
        this.allActivityTypes.push(element);
      });
    }, err => {
      this.isLoader = false;
      this.groupService.goBack();
      this.toasterService.error(this.resourceService.messages.emsg.m002);
    });
  }

  onActivitySelection(value) {
    this.allActivityTypes.forEach(type => {
      if (type['title'] === value.toString()) {
        this.activityCardTypes = [type];
      }
      if (value === 'All activities') {
        this.activityCardTypes = this.allActivityTypes;
      }
    });
  }

  public navigateToContent(event, activities: any): void {
    this.ActivityWiseData = [{
      name: activities.name,
      progress: '',
      Assesment1: ''
    }];
    this.selectedActivityType = activities;
    this.selectedActivityType['sbUniqueIdentifier'] = activities.identifier;
    activities['sbUniqueIdentifier'] = activities.identifier;
    this.onSelectedActivity = this.isContentTrackable(this.selectedActivityType);
  }

  isContentTrackable(content) {
    if (content.trackable && content.trackable.enabled === 'Yes') {
      return true;
    }
    return false;
  }

  showActivityType(type) {
    return _.lowerCase(type);
  }
}
