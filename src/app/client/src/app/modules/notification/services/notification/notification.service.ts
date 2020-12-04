import { Inject, Injectable } from '@angular/core';
import { CsUserServiceConfig } from '@project-sunbird/client-services';
import { UserFeedCategory, UserFeedStatus } from '@project-sunbird/client-services/models';
import { CsUserService } from '@project-sunbird/client-services/services/user/interface';
import { ToasterService } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';

@Injectable()
export class NotificationService {

  private config: CsUserServiceConfig = {
    apiPath: '/learner/user/v1'
  };
  refreshNotification$ = new Subject();

  constructor(
    @Inject('CS_USER_SERVICE') private csUserService: CsUserService,
    private userService: UserService,
    private toasterService: ToasterService
  ) { }

  async fetchInAppNotifications() {
    try {
      const notificationData = await this.csUserService.getUserFeed(this.userService.userid, this.config).toPromise();
      return notificationData
        .filter(e => e.category === UserFeedCategory.NOTIFICATION)
        .sort(((a, b) => (new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())));
    } catch (e) {
      return [];
    }
  }

  async updateNotificationRead(notificationId) {
    try {
      await this.csUserService.updateUserFeedEntry(
        this.userService.userid, notificationId, UserFeedCategory.NOTIFICATION, { status: UserFeedStatus.READ }, this.config
      ).toPromise();
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteNotification(notificationId) {
    try {
      await this.csUserService.deleteUserFeedEntry(
        this.userService.userid, notificationId, UserFeedCategory.NOTIFICATION, this.config
      ).toPromise();
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteAllNotifications(notificationArray) {
    try {
      await Promise.all(notificationArray.map((n) => this.deleteNotification(n.id)));
      return true;
    } catch (e) {
      this.toasterService.error('Something went wrong, please try again later');
      return false;
    }
  }
}
