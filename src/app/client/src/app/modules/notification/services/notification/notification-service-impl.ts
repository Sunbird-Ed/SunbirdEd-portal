import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SbNotificationService } from '@project-sunbird/sb-notification';
import { ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import * as _ from 'lodash-es';
import { GroupNotificationWrapperService } from '../group-notification-wrapper/group-notification-wrapper.service';
import { CsNotificationService } from '@project-sunbird/client-services/services/notification/interface';

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
      notificationData = [
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\" 4.8 RC merit cert course with new cert template\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2134964951750819841670",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "d121bee2-ed0e-4244-85be-0587bb293b5f",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1649764762952,
          "version": null,
          "status": "unread"
        },
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"Test Certificate Course1\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2134955710613913601281",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "85a2d6b2-9610-4e87-9226-02cbd61b008f",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1649764762648,
          "version": null,
          "status": "unread"
        },
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"Copy of New Merit Course\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_21350982822155878411652",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "57317c12-bcaa-40b8-ae62-63aa6b7dbb9a",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1649155381832,
          "version": null,
          "status": "unread"
        },
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\" 4.8 merit cert course verification \"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_21350426787753984011164",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "83afd931-7119-4aa3-9204-f05406cdddb3",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648533890267,
          "version": null,
          "status": "unread"
        },
        {
          "expireOn": null,
          "updatedBy": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"4.8 course with 4.8 question set reverted\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2135020887677419521526",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "c2cf8374-69b4-4bd0-96cd-70bda4e3e247",
          "updatedOn": 1648447115995,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648209278988,
          "version": null,
          "status": "read"
        },
        {
          "expireOn": null,
          "updatedBy": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\" 4.8 course with merit cert reverted \"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2135020880856678401518",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "e1e44831-e32f-4e1e-bb6d-04224b17fdb4",
          "updatedOn": 1648272582941,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648209277281,
          "version": null,
          "status": "read"
        },
        {
          "expireOn": null,
          "updatedBy": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"4.8 RC TRACKABLE COLLECTION WITH OLD CERT \"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2134964973933281281681",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "9c69c8cb-95ee-4997-885c-b804dcd9a794",
          "updatedOn": 1648195417733,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648125203656,
          "version": null,
          "status": "read"
        },
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"4.8 RC TRACKABLE COLLECTION WITH OLD CERT \"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2134964973933281281681",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "67113c02-8e5b-4d3d-aa48-6cb5bc7059b5",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648125199084,
          "version": null,
          "status": "unread"
        },
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\" 4.8 NF Course new RC cert download\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2135012676207738881768",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "fe10bb3e-6937-45cd-af01-c3251cb075bf",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648104343646,
          "version": null,
          "status": "unread"
        },
        {
          "expireOn": null,
          "updatedBy": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\" 4.7 Reg Cert Course 1\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_213482328847261696196",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "691f5e4c-be37-466e-9984-372c418e5a4a",
          "updatedOn": 1648039353740,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648025308721,
          "version": null,
          "status": "read"
        },
        {
          "expireOn": null,
          "updatedBy": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"4.8 New Course New Certificate\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2135006063099248641381",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "a1a5c43a-7062-45df-b383-5c98b8813f45",
          "updatedOn": 1648039361088,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648023475434,
          "version": null,
          "status": "read"
        },
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"4.8 course with question set NB\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2134949620968980481167",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "fb3583d3-919b-4b2f-a9de-4cf3dd87eaca",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648018250997,
          "version": null,
          "status": "unread"
        },
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"4.8 course with question set NB\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2134949620968980481167",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "159fb839-a176-4181-bb93-c22d887cbddb",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648018250395,
          "version": null,
          "status": "unread"
        },
        {
          "expireOn": null,
          "updatedBy": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"Test Certificate Course3\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2134955890315182081341",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "f8751866-e4ee-4293-bd71-a7922478429b",
          "updatedOn": 1648034998856,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1648016889622,
          "version": null,
          "status": "read"
        },
        {
          "expireOn": null,
          "updatedBy": null,
          "createdBy": null,
          "action": {
            "template": {
              "ver": "4.5.0",
              "data": "{\"description\":\"You have earned a certificate! Download it from your profile page.\",\"title\":\"4.8 NF Course new RC cert\"}",
              "type": "JSON"
            },
            "createdBy": {
              "id": null,
              "type": "system"
            },
            "additionalInfo": {
              "actionType": "certificateUpdate",
              "identifier": "do_2134999350758195201144",
              "type": 1
            },
            "type": "certificateUpdate",
            "category": "Notification"
          },
          "id": "470b441f-b3cd-4536-b32d-8b5cbb6d475f",
          "updatedOn": null,
          "category": "Notification",
          "priority": 1,
          "userId": "702b0d5e-f264-4b1b-9b12-de745ec4c52d",
          "createdOn": 1647954925212,
          "version": null,
          "status": "unread"
        }
      ];
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
