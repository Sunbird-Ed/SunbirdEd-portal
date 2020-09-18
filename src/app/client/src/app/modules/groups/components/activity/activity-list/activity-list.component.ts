import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../shared/services/config/config.service';
import { ResourceService } from '../../../../shared/services/resource/resource.service';
import { GroupsService } from '../../../services/groups/groups.service';
import { ACTIVITY_DETAILS } from './../../../interfaces';
import { ToasterService } from '@sunbird/shared';

export interface IActivity {
  name: string;
  identifier: string;
  appIcon: string;
  organisation: string[];
  subject: string;
  type: string;
  contentType?: string;
}
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal;
  @Input() groupData;
  @Input() currentMember;
  numberOfSections = new Array(this.configService.appConfig.SEARCH.PAGE_LIMIT);
  showLoader = false;
  @Input() activityList: any;
  showMenu = false;
  selectedActivity: IActivity;
  showModal = false;
  unsubscribe$ = new Subject<void>();
  disableViewAllMode = false;
  selectedTypeContents = {};
  config: any;


  constructor(
    private configService: ConfigService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    public resourceService: ResourceService,
    private groupService: GroupsService,
    private toasterService: ToasterService,
  ) {
    this.config = this.configService.appConfig;
  }

  ngOnInit() {
    this.showLoader = false;
    fromEvent(document, 'click')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(item => {
        if (this.showMenu) {
          this.showMenu = false;
          this.addTelemetry('activity-kebab-menu-close');
        }
      });

    this.groupService.showMenu.subscribe(data => {
      this.showMenu = data === 'activity';
    });
  }


  openActivity(event: any) {
    this.addTelemetry('activity-card', [{id: _.get(event, 'data.identifier'), type: _.get(event, 'data.resourceType')}]);
    const options = { relativeTo: this.activateRoute, queryParams: { contentType: _.get(event, 'data.contentType')} };
    if (_.get(this.groupData, 'isAdmin')) {
      this.router.navigate([`${ACTIVITY_DETAILS}`, _.get(event, 'data.identifier')], options);
    } else {
      this.router.navigate(['/learn/course', _.get(event, 'data.identifier')]);
    }
  }

  getMenuData(event) {
    this.showMenu = !this.showMenu;
    this.groupService.emitMenuVisibility('activity');
    this.selectedActivity = _.get(event, 'data');
    this.addTelemetry('activity-kebab-menu-open');
  }

  toggleModal(show = false) {
    show ? this.addTelemetry('remove-activity-kebab-menu-btn') : this.addTelemetry('close-remove-activity-popup');
    this.showModal = show;
  }

  removeActivity() {
    this.addTelemetry('confirm-remove-activity-button');
    const activityIds = [this.selectedActivity.identifier];
    this.showLoader = true;
    this.groupService.removeActivities(this.groupData.id, { activityIds })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        Object.keys(this.activityList).forEach(key => {
          this.activityList[key] = this.activityList[key].filter(activity => _.get(activity, 'identifier') !== _.get(this.selectedActivity, 'identifier'));
        });
        this.toasterService.success(this.resourceService.messages.smsg.activityRemove);
        this.showLoader = false;
      }, error => {
        this.showLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.activityRemove);
      });
    this.toggleModal();

    // TODO: add telemetry here
  }

  addTelemetry (id, cdata?, extra?) {
    this.groupService.addTelemetry(id, this.activateRoute.snapshot, cdata, _.get(this.groupData.id), extra);
  }

  toggleViewAll(visibility: boolean, list?) {
    this.disableViewAllMode = visibility;
    this.selectedTypeContents = list || {};
  }

  isCourse(type) {
    return (_.lowerCase(type) === _.lowerCase(this.configService.appConfig.contentType.Course) ||
    (_.lowerCase(type) === _.lowerCase(this.configService.appConfig.contentType.Courses)));
  }

  viewSelectedTypeContents(type, list, index) {
    const value = _.lowerCase(_.get(this.selectedTypeContents, 'key')) === _.lowerCase(type);
    return (_.isEmpty(this.selectedTypeContents) ? (list.length > 3 ?  index <= 2 : true) : value);
  }

  isSelectedType (type) {
   return _.isEmpty(this.selectedTypeContents) ? true : _.lowerCase(_.get(this.selectedTypeContents, 'key')) === _.lowerCase(type);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.showModal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
