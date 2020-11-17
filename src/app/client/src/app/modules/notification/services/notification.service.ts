import { Inject, Injectable } from '@angular/core';
import { CsUserServiceConfig } from '@project-sunbird/client-services';
import { UserFeedCategory, UserFeedStatus } from '@project-sunbird/client-services/models';
import { CsUserService } from '@project-sunbird/client-services/services/user/interface';
import { UserService } from '../../core/services/user/user.service';
import { ToasterService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private config: CsUserServiceConfig = {
    apiPath: '/learner/user/v1'
  };
  constructor(
    @Inject('CS_USER_SERVICE') private csUserService: CsUserService,
    public userService: UserService,
    private toasterService: ToasterService
  ) { }

  fetchInAppNotifications() {
    return this.csUserService.getUserFeed(this.userService.userid, this.config);
  }

  updateNotificationRead(notificationId) {
    this.csUserService.updateUserFeedEntry(
      this.userService.userid, notificationId, UserFeedCategory.NOTIFICATION, { status: UserFeedStatus.READ }, this.config
    ).toPromise().then();
  }

  deleteNotification(notificationId) {
    this.csUserService.deleteUserFeedEntry(
      this.userService.userid, notificationId, UserFeedCategory.NOTIFICATION, this.config
    ).toPromise()
      .then()
      .catch(e => {
        this.toasterService.error('Something went wrong, please try again later');
      });
  }
}
