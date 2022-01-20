export const notificationData = {
  'expireOn': null,
  'updatedBy': '4cd4c690-eab6-4938-855a-447c7b1b8ea9',
  'createdBy': 'fbe926ac-a395-40e4-a65b-9b4f711d7642',
  'action': {
      'template': {
          'ver': '4.3.0',
          'data': '{"title": "3.7 Book with Collaborator has been assigned to zen by TNORGADMIN"}',
          'type': 'JSON'
      },
      'createdBy': {
          'name': 'TNORGADMIN',
          'id': 'fbe926ac-a395-40e4-a65b-9b4f711d7642',
          'type': 'user'
      },
      'additionalInfo': {
          'activity': {
              'id': 'do_21322315085421772811333',
              'type': 'Digital Textbook',
              'name': '3.7 Book with Collaborator'
          },
          'groupRole': 'member',
          'group': {
              'name': 'zen',
              'id': '2ae1e555-b9cc-4510-9c1d-2f90e94ded90'
          }
      },
      'type': 'group-activity-added',
      'category': 'group'
  },
  'id': '86972448-dfd6-4877-bdcd-d83c5b886951',
  'updatedOn': 1632118806779,
  'category': 'group',
  'priority': 1,
  'createdOn': 1631870811982,
  'userId': '4cd4c690-eab6-4938-855a-447c7b1b8ea9',
  'version': null,
  'status': 'read'
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
