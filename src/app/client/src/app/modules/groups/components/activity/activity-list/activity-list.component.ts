import { PlayerService } from '@sunbird/core';
import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupsService } from '../../../services/groups/groups.service';
import { ACTIVITY_DETAILS } from './../../../interfaces';
import { ToasterService, ConfigService, ResourceService } from '@sunbird/shared';

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
    private playerService: PlayerService
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


  openActivity(event: any, activityType) {
      if (!this.groupData.active) {
        this.addTelemetry('activity-suspend-card', [], {},
      {id: _.get(event, 'data.identifier'), type: _.get(event, 'data.primaryCategory'),
      ver: _.get(event, 'data.pkgVersion') ? `${_.get(event, 'data.pkgVersion')}` : '1.0'});
        return;
      }
      this.addTelemetry('activity-card', [{id: _.get(event, 'data.identifier'), type: _.get(event, 'data.resourceType')}]);
      const options = { relativeTo: this.activateRoute, queryParams: { contentType: _.get(event, 'data.contentType'),
      title: activityType} };
      if (_.get(this.groupData, 'isAdmin')) {
        this.router.navigate([`${ACTIVITY_DETAILS}`, _.get(event, 'data.identifier')], options);
      } else {
        this.playerService.playContent(_.get(event, 'data'));
      }

  }

  getMenuData(event) {
      this.showMenu = !this.showMenu;
      this.groupService.emitMenuVisibility('activity');
      this.selectedActivity = _.get(event, 'data');
      this.addTelemetry('activity-kebab-menu-open', [], {}, {id: _.get(event, 'data.identifier'), type: _.get(event, 'data.primaryCategory'),
      ver: _.get(event, 'data.pkgVersion') ? `${_.get(event, 'data.pkgVersion')}` : '1.0'});
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

  addTelemetry (id, cdata?, extra?, obj?) {
      if (cdata) {
        cdata.push({id: _.get(this.groupData, 'id'), type : 'group'});
      }
    this.groupService.addTelemetry({id, extra}, this.activateRoute.snapshot, cdata, obj);
  }

  toggleViewAll(visibility: boolean, type?) {
    this.disableViewAllMode = visibility;
    this.selectedTypeContents = _.pick(this.activityList, type) || {};
  }

  isCourse(type) {
    return (_.lowerCase(this.resourceService.frmelmnts.lbl[type]) === _.lowerCase(this.configService.appConfig.contentType.Course) ||
    (_.lowerCase(this.resourceService.frmelmnts.lbl[type]) === _.lowerCase(this.configService.appConfig.contentType.Courses)));
  }

  viewSelectedTypeContents(type, list, index) {
    return (_.isEmpty(this.selectedTypeContents) ? (list.length > 3 ?  index <= 2 : true) :
    !_.isEmpty(_.get(this.selectedTypeContents, type)));
  }

  isSelectedType (type) {
   return _.isEmpty(this.selectedTypeContents) ? true : !_.isEmpty(_.get(this.selectedTypeContents, type));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.showModal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
