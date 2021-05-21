import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../../services';
import { IGroupCard } from '../../../interfaces';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CsGroup } from '@project-sunbird/client-services/models';
import { SearchService } from '@sunbird/core';
import { ToasterService, ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { TocCardType } from '@project-sunbird/common-consumption-v8';
import { ConfigService } from '@sunbird/shared';
import { CourseConsumptionService } from '@sunbird/learn';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit {

  selectedActivityType = {};
  groupData: IGroupCard;
  groupId: string;
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
  public coursehierarchy: any;

  constructor(
    private groupService: GroupsService,
    private toasterService: ToasterService,
    public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    public searchService: SearchService,
    public configService: ConfigService,
    public courseConsumptionService: CourseConsumptionService) { }

  ngOnInit() {
    this.filterTypes.push({ label: 'All activities' });
    this.selectedActivity = this.filterTypes[0].label;
    this.groupId = _.get(this.activatedRoute, 'snapshot.params.groupId');
    console.log(this.groupId, 'xxxx');
    this.getGroupData();
  }

  getGroupData() {
    this.isLoader = true;
    this.groupService.getGroupById(this.groupId, true, true, true).pipe(takeUntil(this.unsubscribe$)).subscribe((groupData: CsGroup) => {
      this.groupService.groupData = groupData;
      this.groupData = this.groupService.addGroupFields(groupData);
      this.isLoader = false;
      const activityList = this.groupData.activitiesGrouped;
      activityList.forEach(element => {
        if (element.items.length > 0) {
        this.filterTypes.push({ label: element.title });
        this.activityCardTypes.push(element);
        this.allActivityTypes.push(element);
        }
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
        this.setUniqueIdentifierForCC(type.items[0].activityInfo);
      }
      if (value === 'All activities') {
        this.activityCardTypes = this.allActivityTypes;
        this.setUniqueIdentifierForCC(this.allActivityTypes[0].items[0].activityInfo);
      }
    });
  }

  public navigateToDashboard(event, activities: any): void {
    console.log(activities);
    if (activities.trackable && activities.trackable.enabled === 'Yes') {
      const inputParams = { params: this.configService.appConfig.CourseConsumption.contentApiQueryParams };
      this.courseConsumptionService.getCourseHierarchy(activities.identifier, inputParams).subscribe(response => {
        this.coursehierarchy = response;
        console.log(this.coursehierarchy);
      });
    }
    this.ActivityWiseData = [{
      name: activities.name,
      progress: '',
      Assesment1: ''
    }];
    this.setUniqueIdentifierForCC(activities);
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

  setUniqueIdentifierForCC(activities) {
    this.selectedActivityType = activities;
    this.selectedActivityType['sbUniqueIdentifier'] = activities.identifier;
    activities['sbUniqueIdentifier'] = activities.identifier;
    this.onSelectedActivity = this.isContentTrackable(this.selectedActivityType);
  }
  eventListener(event) {
    console.log('event', event);
  }
}
