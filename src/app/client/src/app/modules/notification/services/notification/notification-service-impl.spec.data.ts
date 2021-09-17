export const notificationData = {
  "expireOn": null,
  "createdBy": "8454cb21-3ce9-4e30-85b5-fade097880d8",
  "action": {
      "template": {
          "ver": "4.3.0",
          "data": "{\"title\": \"you have been added to dev group by ntptest104\"}",
          "type": "JSON"
      },
      "createdBy": {
          "id": "8454cb21-3ce9-4e30-85b5-fade097880d8",
          "name": "ntptest104",
          "type": "User"
      },
      "additionalInfo": {
          "group": {
              "id": "dfb38dd6-2200-4622-ac07-0a0e3740e948",
              "name": "dev group"
          },
          "groupRole": "admin"
      },
      "type": "member-added"
  },
  "id": "8736208f-1b23-465a-bbd4-4492e5180a5b",
  "updatedOn": null,
  "category": "groups",
  "priority": 1,
  "createdOn": 1631080910003,
  "userId": "8454cb21-3ce9-4e30-85b5-fade097880d8",
  "version": null,
  "status": "unread"
};

export const notificationList = [
  {
    data: {
      actionData: {
        actionType: 'contentURL',
        contentURL: 'https://url/resources/play/content/do_00000',
        description: 'Notfication description 1',
        openPlayer: true,
        title: 'InApp Notification 1',
        thumbnail: ''
      },
      type: 1
    },
    id: 'id1',
    category: 'Notification',
    priority: 1,
    userId: 'user-id',
    createdOn: 1605589382634,
    status: 'unread'
  },
  {
    data: {
      actionData: {
        actionType: 'contentURL',
        contentURL: 'https://url/resources/play/content/do_00000',
        description: 'Notfication description 2',
        openPlayer: true,
        title: 'InApp Notification 2',
        thumbnail: ''
      },
      type: 1
    },
    id: 'id2',
    category: 'Notification',
    priority: 1,
    userId: 'user-id',
    createdOn: 1605589382634,
    status: 'read'
  }
];
