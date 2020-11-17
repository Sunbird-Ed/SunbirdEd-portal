import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { csUserServiceFactory } from '../../notification.module';
import { NotificationService } from '../../services/notification.service';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-in-app-notification',
  templateUrl: './in-app-notification.component.html',
  styleUrls: ['./in-app-notification.component.scss']
})
export class InAppNotificationComponent implements OnInit {

  showNotificationModel = false;
  notificationList$: any;
  @Input() layoutConfiguration: any;
  constructor(private notificationService: NotificationService, private router: Router) {
    // this.notificationList$ = this.notificationService.fetchInAppNotifications();
    this.notificationList$ = [
      {
        "identifier": "03ae8b70-e6ea-4615-9545-bf9e5ee2f30b",
        "data": {
          "actionType": "contentURL",
          "contentURL": "https://staging.ntp.net.in/resources/play/content/do_212669767503060992174",
          "description": "Notfication description",
          "openPlayer": true,
          "title": "InApp Notification 7"
        },
        "id": "03ae8b70-e6ea-4615-9545-bf9e5ee2f30b",
        "category": "Notification",
        "priority": 1,
        "userId": "555caa55-8dc8-4d8f-a8c5-159ade057f90",
        "createdOn": 1605589397767,
        "status": "unread",
        "isRead": false
      },
      {
        "identifier": "c2d72c04-3010-45d7-bc13-29a3105dca26",
        "data": {
          "actionType": "contentURL",
          "contentURL": "https://staging.ntp.net.in/resources/play/content/do_212669767503060992174",
          "description": "",
          "openPlayer": true,
          "title": "InApp Notification 4"
        },
        "id": "c2d72c04-3010-45d7-bc13-29a3105dca26",
        "category": "Notification",
        "priority": 1,
        "userId": "555caa55-8dc8-4d8f-a8c5-159ade057f90",
        "createdOn": 1605589382634,
        "status": "unread",
        "isRead": false
      },
      {
        "identifier": "c14734c8-52fb-4e11-a089-3f52126d945d",
        "data": {
          "actionType": "contentURL",
          "contentURL": "https://staging.ntp.net.in/resources/play/content/do_212669767503060992174",
          "description": "Notfication description",
          "openPlayer": true,
          "title": "InApp Notification 2"
        },
        "id": "c14734c8-52fb-4e11-a089-3f52126d945d",
        "category": "Notification",
        "priority": 1,
        "userId": "555caa55-8dc8-4d8f-a8c5-159ade057f90",
        "createdOn": 1605589374119,
        "status": "unread",
        "isRead": false
      },
      {
        "identifier": "09ecf4ec-9ded-40bc-a602-887fdf03313e",
        "data": {
          "actionType": "contentURL",
          "contentURL": "https://staging.ntp.net.in/resources/play/content/do_212669767503060992174",
          "description": "Notfication description",
          "openPlayer": true,
          "title": "InApp Notification 3"
        },
        "id": "09ecf4ec-9ded-40bc-a602-887fdf03313e",
        "category": "Notification",
        "priority": 1,
        "userId": "555caa55-8dc8-4d8f-a8c5-159ade057f90",
        "createdOn": 1605589378851,
        "status": "read",
        "isRead": true
      },
      {
        "identifier": "efa77ba5-77dd-4e08-a054-86016492911b",
        "data": {
          "actionType": "contentURL",
          "contentURL": "https://staging.ntp.net.in/resources/play/content/do_212669767503060992174",
          "description": "",
          "openPlayer": true,
          "title": "InApp Notification 6"
        },
        "id": "efa77ba5-77dd-4e08-a054-86016492911b",
        "category": "Notification",
        "priority": 1,
        "userId": "555caa55-8dc8-4d8f-a8c5-159ade057f90",
        "createdOn": 1605589393654,
        "status": "unread",
        "isRead": false
      },
      {
        "identifier": "250ff464-a84e-4297-9d1e-a98efd2558b6",
        "data": {
          "actionType": "contentURL",
          "contentURL": "https://staging.ntp.net.in/resources/play/content/do_212669767503060992174",
          "description": "Notfication description",
          "openPlayer": true,
          "title": "InApp Notification 7"
        },
        "id": "250ff464-a84e-4297-9d1e-a98efd2558b6",
        "category": "Notification",
        "priority": 1,
        "userId": "555caa55-8dc8-4d8f-a8c5-159ade057f90",
        "createdOn": 1605589397454,
        "status": "unread",
        "isRead": false
      }
    ] as any;
  }

  ngOnInit() {
  }

  toggleInAppNotifications() {
    this.showNotificationModel = !this.showNotificationModel;
  }

  notificationHandler(event) {
    if (!event || !event.data) {
      return false;
    }
    const notificationDetails = event.data;
    this.markNotificationAsRead(notificationDetails);
    if (_.get(event, 'data.data.contentURL')) {
      this.router.navigate([event.data.data.contentURL]);
    }
  }

  markNotificationAsRead(notificationDetails) {
    if (notificationDetails.id) {
      this.notificationService.updateNotificationRead(notificationDetails.id);
    }
  }

  deleteNotificationHandler(event) {
    if (!event || !event.data) {
      return false;
    }
    const notificationDetails = event.data;
    if (notificationDetails.id) {
      this.notificationService.deleteNotification(notificationDetails.id);
    }
  }

  clearAllNotifationsHandler(event) {
    const notificationArray = _.get(event, 'data.length');
    if (notificationArray) {
      notificationArray.forEach(notification => {
        if (notification.id) {
          this.notificationService.deleteNotification(notification.id);
        }
      });
    }
  }

}
