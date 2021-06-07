import { UserFeedCategory, UserFeedEntry, UserFeedStatus } from '@project-sunbird/client-services/models';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CsUserServiceConfig } from '@project-sunbird/client-services';
import { CsUserService } from '@project-sunbird/client-services/services/user/interface';
import { SbNotificationService , Notification, NotificationFeedEntry } from 'sb-notification';
import { ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceImpl implements SbNotificationService {

  private config: CsUserServiceConfig = {
    apiPath: '/learner/user/v1'
  };
  notificationList$ = new BehaviorSubject([]);
  showNotificationModel$ = new Subject<boolean>();

  constructor(
    @Inject('CS_USER_SERVICE') private csUserService: CsUserService,
    private userService: UserService,
    private toasterService: ToasterService,
    private router: Router,
    private telemetryService: TelemetryService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.fetchNotificationList()
  }

  async fetchNotificationList(): Promise<NotificationFeedEntry<Notification>[]> {
    try {
      const notificationData: UserFeedEntry[] = await this.csUserService.getUserFeed(_.get(this.userService, 'userid'), this.config).toPromise();
      if (!Array.isArray(notificationData)) {
        return [];
      }
      notificationData
        .filter(e => e.category === UserFeedCategory.NOTIFICATION)
        .sort(((a, b) => (new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())));
      this.notificationList$.next(notificationData);
      return notificationData as any[];
    } catch (e) {
      console.error(e);
      this.notificationList$.next([]);
      return [];
    }
  }

  async handleNotificationClick(notificationData: any) {
    if (!notificationData || !notificationData.data) {
      return false;
    }
    const navigationDetails = this.getNavigationPath(notificationData);
    const path = navigationDetails.path || '';
    const navigationExtras: NavigationExtras = navigationDetails.navigationExtras || {};

    if (path) {
      this.showNotificationModel$.next(false);
      this.router.navigate([path], navigationExtras);
      await this.markNotificationAsRead(notificationData.data);
      this.fetchNotificationList();
    }
  }

  async deleteNotification(notificationData): Promise<boolean> {
    try {
      const notificationDetails = _.get(notificationData, 'data');
      if (!notificationDetails || !notificationDetails.id) {
        return false;
      }
      this.generateInteractEvent('delete-notification', { id: notificationDetails.id, type: 'notificationId' });
      if (!await this.deleteNotificationData(notificationDetails.id)) {
        return false;
      }
      this.fetchNotificationList();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async clearAllNotifications(notificationListData: any): Promise<boolean> {
    try {
      const notificationArray = _.get(notificationListData, 'data');
      if (!_.get(notificationArray, 'length')) {
        return false;
      }
      this.generateInteractEvent('clear-all-notification');
      if (await this.deleteAllNotifications(notificationArray)) {
        this.showNotificationModel$.next(false);
        setTimeout(() => {
          this.fetchNotificationList();
        }, 1000);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  private getNavigationPath(event) {
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

  private async markNotificationAsRead(notificationDetails) {
    if (notificationDetails.id) {
      this.generateInteractEvent('notification-read', { id: notificationDetails.id, type: 'notificationId' });
      await this.updateNotificationRead(notificationDetails.id);
    }
  }

  private async updateNotificationRead(notificationId) {
    try {
      await this.csUserService.updateUserFeedEntry(
        this.userService.userid, notificationId, UserFeedCategory.NOTIFICATION, { status: UserFeedStatus.READ }, this.config
      ).toPromise();
      return true;
    } catch (e) {
      return false;
    }
  }

  private async deleteNotificationData(notificationId) {
    try {
      await this.csUserService.deleteUserFeedEntry(
        this.userService.userid, notificationId, UserFeedCategory.NOTIFICATION, this.config
      ).toPromise();
      return true;
    } catch (e) {
      return false;
    }
  }

  private async deleteAllNotifications(notificationArray) {
    try {
      await Promise.all(notificationArray.map((n) => this.deleteNotificationData(n.id)));
      return true;
    } catch (e) {
      this.toasterService.error('Something went wrong, please try again later');
      return false;
    }
  }

  private generateInteractEvent(id, notificatioData?) {
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

}