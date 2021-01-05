import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import * as _ from 'lodash-es';
import { UserFeedStatus } from '@project-sunbird/client-services/models';
import { NotificationViewConfig } from '@project-sunbird/common-consumption-v8';
import { ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';

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

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    public resourceService: ResourceService,
    private telemetryService: TelemetryService,
    private activatedRoute: ActivatedRoute
  ) {
    this.inAppNotificationConfig = {
      title: this.resourceService.frmelmnts.lbl.notification,
      subTitle: this.resourceService.frmelmnts.lbl.newNotification,
      clearText: this.resourceService.frmelmnts.btn.clear,
      moreText: this.resourceService.frmelmnts.btn.seeMore,
      lessText: this.resourceService.frmelmnts.btn.seeLess,
      minNotificationViewCount: 5
    };
  }

  ngOnInit() {
    this.fetchNotificationList();
    this.notificationService.refreshNotification$.subscribe(refresh => {
      if (refresh) {
        this.fetchNotificationList();
      }
    });
  }

  async fetchNotificationList() {
    const notificationData = await this.notificationService.fetchInAppNotifications();
    this.notificationCount = 0;
    this.notificationList = notificationData;
    this.notificationList.forEach(e => this.notificationCount += (e.status === UserFeedStatus.UNREAD) ? 1 : 0);
    this.inAppNotificationConfig['subTitle'] = `${this.notificationCount} ${this.resourceService.frmelmnts.lbl.newNotification}`;
  }

  toggleInAppNotifications() {
    if (!this.showNotificationModel && !this.notificationList.length) {
      return;
    }
    this.generateInteractEvent('show-in-app-notifications');
    this.showNotificationModel = !this.showNotificationModel;
  }

  async notificationHandler(event) {
    if (!event || !event.data) {
      return false;
    }
    const navigationDetails = this.getNavigationPath(event);
    const path = navigationDetails.path || '';
    const navigationExtras: NavigationExtras = navigationDetails.navigationExtras || {};

    if (path) {
      this.showNotificationModel = false;
      this.router.navigate([path], navigationExtras);
      await this.markNotificationAsRead(event.data);
      this.fetchNotificationList();
    }
  }

  getNavigationPath(event) {
    if (_.get(event, 'data.data.actionData.actionType') === 'certificateUpdate') {
      return {
        path: '/profile',
        navigationExtras: { state: { scrollToId: 'learner-passbook' } }
      }
    }

    const navigationLink = _.get(event, 'data.data.actionData.contentURL') || _.get(event, 'data.data.actionData.deepLink');
    if (navigationLink) {
      return { path: navigationLink.replace((new URL(navigationLink)).origin, '') };
    }

    return {};
  }

  async markNotificationAsRead(notificationDetails) {
    if (notificationDetails.id) {
      this.generateInteractEvent('notification-read', { id: notificationDetails.id, type: 'notificationId' });
      await this.notificationService.updateNotificationRead(notificationDetails.id);
    }
  }

  async deleteNotificationHandler(event) {
    const notificationDetails = _.get(event, 'data');
    if (notificationDetails.id) {
      this.generateInteractEvent('delete-notification', { id: notificationDetails.id, type: 'notificationId' });
      await this.notificationService.deleteNotification(notificationDetails.id);
    }
    this.fetchNotificationList();
  }

  async clearAllNotifationsHandler(event) {
    this.generateInteractEvent('clear-all-notification');
    const notificationArray = _.get(event, 'data');
    if (_.get(notificationArray, 'length')) {
      if (await this.notificationService.deleteAllNotifications(notificationArray)) {
        this.showNotificationModel = false;
        setTimeout(() => {
          this.fetchNotificationList();
        }, 1000);
      }
    }
  }

  generateInteractEvent(id, notificatioData?) {
    const data = {
      context: {
        env: _.get(this.activatedRoute, 'snapshot.data.telemetry.env') || 'main-header',
        cdata: notificatioData ? [notificatioData] : []
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
    this.notificationService.refreshNotification$.unsubscribe();
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
