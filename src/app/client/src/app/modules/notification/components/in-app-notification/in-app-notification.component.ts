import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceImpl } from '../../services/notification/notification-service-impl';
import * as _ from 'lodash-es';
import { UserFeedStatus } from '@project-fmps/client-services/models';
import { NotificationViewConfig } from '@project-sunbird/common-consumption';
import { ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { takeUntil, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConnectionService } from '../../../shared/services/connection-service/connection.service';

@Component({
  selector: 'app-in-app-notification',
  templateUrl: './in-app-notification.component.html',
  styleUrls: ['./in-app-notification.component.scss']
})
export class InAppNotificationComponent implements OnInit, OnDestroy {

  @Input() layoutConfiguration: any;

  showNotificationModel = false;
  notificationList = [];
  notificationCount = 0;
  inAppNotificationConfig: NotificationViewConfig;
  isConnected = false;
  unsubscribe$ = new Subject<void>();

  constructor(
    @Inject('SB_NOTIFICATION_SERVICE') private notificationService: NotificationServiceImpl,
    private router: Router,
    public resourceService: ResourceService,
    private telemetryService: TelemetryService,
    private activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService
  ) {
    this.inAppNotificationConfig = {
      title: _.get(this.resourceService, 'frmelmnts.lbl.notification'),
      subTitle: _.get(this.resourceService, 'frmelmnts.lbl.newNotification'),
      clearText: _.get(this.resourceService, 'frmelmnts.btn.clear'),
      moreText: _.get(this.resourceService, 'frmelmnts.btn.seeMore'),
      lessText: _.get(this.resourceService, 'frmelmnts.btn.seeLess'),
      minNotificationViewCount: 5
    };
  }

  ngOnInit() {
    this.connectionService.monitor()
    .pipe(takeUntil(this.unsubscribe$), delay(2000)).subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.notificationService.fetchNotificationList();
      }
    });

    this.fetchNotificationList();
  }

  async fetchNotificationList() {
    this.notificationService.showNotificationModel$.subscribe(data => {
      this.showNotificationModel = data;
    });
    this.notificationService.notificationList$
      .subscribe(notificationListData => {
        this.notificationCount = 0;
        this.notificationList = notificationListData.map((notification) => {
          return {...notification, action : { ...notification.action, template: {...notification.action.template, data: JSON.stringify({title : JSON.parse(notification.action.template.data).description})}}}
        });
        this.notificationList.forEach(e => this.notificationCount += (e.status === UserFeedStatus.UNREAD) ? 1 : 0);
        this.inAppNotificationConfig['subTitle'] = `${this.notificationCount} ${_.get(this.resourceService, 'frmelmnts.lbl.newNotification')}`;
      });
  }

  toggleInAppNotifications() {
    if (!this.showNotificationModel && !this.notificationList.length) {
      return;
    }
    this.generateInteractEvent('show-in-app-notifications');
    this.showNotificationModel = !this.showNotificationModel;
  }

  generateInteractEvent(id) {
    const data = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env') || 'main-header',
        cdata: []
      },
      edata: {
        id,
        type: 'click',
        pageid: 'in-app-notification',
      }
    };
    this.telemetryService.interact(data);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleShowMore(event) {
    if (event) {
      this.generateInteractEvent('see-more');
    }
  }

  handleShowLess(event) {
    if (event) {
      this.generateInteractEvent('see-less');
    }
  }
}
