import { Component, Input, ViewChild } from '@angular/core';
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
}
@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent {
  @ViewChild('modal') modal;
  @Input() groupData;
  @Input() currentMember;
  numberOfSections = new Array(this.configService.appConfig.SEARCH.PAGE_LIMIT);
  showLoader = false;
  activityList = [];
  showMenu = false;
  selectedActivity: IActivity;
  showModal = false;
  unsubscribe$ = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    public resourceService: ResourceService,
    private groupService: GroupsService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.showLoader = true;
    this.getActivities();

    fromEvent(document, 'click')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(item => {
        if (this.showMenu) {
          this.showMenu = false;
        }
      });
  }

  getActivities() {
    this.showLoader = false;
    this.activityList =  this.groupData.activities.map(item => item.activityInfo);
  }

  openActivity(event: any, activity: IActivity) {
    // TODO add telemetry here

    if (_.get(this.groupData, 'isAdmin')) {
      this.router.navigate([`${ACTIVITY_DETAILS}`, activity.identifier], { relativeTo: this.activateRoute });
    } else {
      this.router.navigate(['/learn/course', activity.identifier]);
    }
  }

  getMenuData(event, member) {
    this.showMenu = !this.showMenu;
    this.selectedActivity = member;
  }

  toggleModal(show = false) {
    this.showModal = show;
  }

  removeActivity() {
    const activityIds = [this.selectedActivity.identifier];
    this.groupService.removeActivities(this.groupData.id, { activityIds })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.activityList = this.activityList.filter(item => item.identifier !== this.selectedActivity.identifier);
        this.toasterService.success(this.resourceService.messages.smsg.activityRemove);
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.activityRemove);
      });
    this.toggleModal();

    // TODO: add telemetry here
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.showModal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
