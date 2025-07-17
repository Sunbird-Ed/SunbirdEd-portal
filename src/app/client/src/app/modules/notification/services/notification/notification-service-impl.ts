import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SbNotificationService } from '@project-sunbird/sb-notification';
import { ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import * as _ from 'lodash-es';
import { GroupNotificationWrapperService } from '../group-notification-wrapper/group-notification-wrapper.service';
import { CsNotificationService } from '@project-fmps/client-services/services/notification/interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceImpl implements SbNotificationService {

  notificationList$ = new BehaviorSubject([]);
  showNotificationModel$ = new Subject<boolean>();

  constructor(
    @Inject('CS_NOTIFICATION_SERVICE') private NotificationCsService: CsNotificationService,
    private userService: UserService,
    private toasterService: ToasterService,
    private router: Router,
    private telemetryService: TelemetryService,
    private activatedRoute: ActivatedRoute,
    private groupsNotificationWrapperSvc: GroupNotificationWrapperService,
  ) {
    this.fetchNotificationList();
  }

  /**
   * @description - fetch notification list for the current user
   * @returns Promise
   */
   async fetchNotificationList(): Promise<any> {
    try {
      let notificationData: any = await this.NotificationCsService.notificationRead(_.get(this.userService, 'userid')).toPromise();
      notificationData = notificationData.feeds;
      if (!Array.isArray(notificationData)) {
        return [];
      }
      this.notificationList$.next(notificationData);
      return notificationData as any[];
    } catch (e) {
      console.error(e);
      this.notificationList$.next([]);
      return [];
    }
  }

 /**
   * @description - To update the status of the notification and if it is trackable then redirection will happen
   * @param  {any} notificationData
   */
  async handleNotificationClick(notificationData: any) {
    // update the status of the notification to read
    this.markNotificationAsRead(notificationData.data);

    if (!notificationData || !notificationData.data) {
      return false;
    }

    const navigationDetails = await this.getNavigationPath(notificationData);

    if (navigationDetails) {
      const path = navigationDetails['path'] || '';
      const navigationExtras: NavigationExtras = navigationDetails['navigationExtras'] || {};
      if (path) {
        this.showNotificationModel$.next(false);
        this.router.navigate([path], navigationExtras);
        this.fetchNotificationList();
      }
    }
  }

  /**
   * @description -To update the notification Status to read onclick of the notification
   */
  markNotificationAsRead(notificationData) {
    if (_.get(notificationData, 'status') === 'unread') {
      const req = {
        ids: [notificationData.id],
        userId: _.get(this.userService, 'userid')
      };
      this.generateInteractEvent('notification-read', { id: notificationData.id, type: 'notificationId' });
      this.NotificationCsService.notificationUpdate(req).subscribe(() => {
        this.fetchNotificationList();
      },
        e => this.toasterService.error('Something went wrong, please try again later'));
    }
  }

  /**
   * @description - delete the particular notification
   * @param  {} notificationData
   * @returns Promise
   */
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

  /**
   * @description - delete all the notification from the user list
   * @param  {any} notificationListData
   * @returns Promise
   */
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

  /**
   * @description - generating the router path for redirection based on the category type
   * @param  {} event
   */
  async getNavigationPath(event) {
    const category = _.get(event, 'data.category');
    const additionalInfo = _.get(event, 'data.action.additionalInfo');
    if (category === 'group') {
      return this.groupsNotificationWrapperSvc.navigateNotification(event, additionalInfo);
    } else {
      if (_.get(event, 'data.action.type') === 'certificateUpdate') {
        return {
          path: '/profile',
          navigationExtras: { state: { scrollToId: 'learner-passbook' } }
        };
      }
      const navigationLink = additionalInfo.contentURL || additionalInfo.deepLink;
      if (navigationLink) {
        return { path: navigationLink.replace((new URL(navigationLink)).origin, '') };
      }
      return {};
    }
  }

  private async deleteNotificationData(notificationId) {
    try {
      const req = {
        ids: [notificationId],
        userId: this.userService.userid,
        category: 'group-feed'
      };
      await this.NotificationCsService.notificationDelete(req).toPromise();
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
