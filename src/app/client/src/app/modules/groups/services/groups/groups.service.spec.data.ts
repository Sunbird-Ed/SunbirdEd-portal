import { GroupEntityStatus, GroupMembershipType, GroupMemberRole } from '@project-fmps/client-services/models/group';
import { of } from 'rxjs';

export const impressionObj = {
  context: {
    env: 'groups'
  },
  edata: {
    type: 'view',
    subtype: 'paginate',
    pageid: 'my-groups',
    uri: '/my-groups',
    duration : 2,
  },
  object: {
    id: '123',
    type: 'group',
    ver: '1.0',
}
};

export const interactObj = {
  context: {
    env: 'groups',
    cdata: [],
  },
  edata: {
    id: '123',
    type: 'view',
    pageid: 'my-groups',
  },
  object: {
    id: '123',
    type: 'group',
    ver: '1.0',
}
};

export const fakeActivatedRoute = {
  'params': of ({}),
  snapshot: {
    params: {groupId: '123'},
      data: {
          telemetry: {
              env: 'groups', pageid: 'my-groups', type: 'view', subtype: 'paginate'
          }
      }
  }
};

export const fakeActivatedRouteWithGroupId = {
  'params': of ({groupId: '123'}),
  snapshot: {
      data: {
          telemetry: {
              env: 'groups', pageid: 'my-groups', type: 'view', subtype: 'paginate'
          }
      }
  }
};

export const groupData = {
  'membershipType': GroupMembershipType.INVITE_ONLY,
  'updatedBy': '97961992-b2ee-4b41-8f85-dc0e6f466697',
  'createdBy': '97961992-b2ee-4b41-8f85-dc0e6f466697',
  'activitiesGrouped': [
    {
      'title': 'ACTIVITY_COURSE_TITLE',
      'count': 4,
      'items': [
        {
          'id': 'do_21271200473210880012152',
          'type': 'Course',
          'activityInfo': {
            'name': '05-03-19-course',
            'identifier': 'do_21271200473210880012152',
            'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21271200473210880012152/artifact/20180817101627-30120_1544767085980.thumb.png',
            'organisation': [
              'Sachin 2808'
            ],
            'subject': 'Political Science',
            'type': 'Course',
            'contentType': 'Course'
          }
        },
      ],
      isEnabled: true,
      objectType: 'content'
    },
    {
      'title': 'ACTIVITY_TEXTBOOK_TITLE',
      'count': 1,
      'items': [
        {
          'id': 'do_2130093660325806081984',
          'type': 'TextBook',
          'activityInfo': {
            'name': '28ShallowCopy-6',
            'identifier': 'do_2130093660325806081984',
            'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2130093660325806081984/artifact/44870761_1067305270146427_8127580563721682944_n_1576750191164.thumb.jpg',
            'organisation': [
              'test'
            ],
            'subject': 'Mathematics',
            'type': 'TextBook',
            'contentType': 'TextBook',

          }
        }
      ],
      isEnabled: true,
      objectType: 'content'
    }
  ],
  'members': [
    {
      'userId': '97961992-b2ee-4b41-8f85-dc0e6f466697',
      'groupId': '4130b072-fb0a-453b-a07b-4c93812c741b',
      'role': GroupMemberRole.ADMIN,
      'status': GroupEntityStatus.ACTIVE,
      'createdOn': '2020-07-13 17:23:15:503+0000',
      'createdBy': '97961992-b2ee-4b41-8f85-dc0e6f466697',
      'updatedOn': null,
      'updatedBy': null,
      'removedOn': null,
      'removedBy': null,
      'name': 'robert'
    }
  ],
  'name': 'Group test edit',
  'description': 'And here is the description',
  'updatedOn': '2020-07-13 18:11:53:022+0000',
  'id': '4130b072-fb0a-453b-a07b-4c93812c741b',
  'createdOn': '2020-07-13 17:23:15:496+0000',
  'status': GroupEntityStatus.ACTIVE,
  active: true,
  isActive () { return true; },
};

export const modifiedActivities = {
  'ACTIVITY_COURSE_TITLE': [
    {
      'name': '05-03-19-course',
      'identifier': 'do_21271200473210880012152',
      'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21271200473210880012152/artifact/20180817101627-30120_1544767085980.thumb.png',
      'organisation': [
        'Sachin 2808'
      ],
      'subject': 'Political Science',
      'type': 'Course',
      'contentType': 'Course',
      'cardImg': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21271200473210880012152/artifact/20180817101627-30120_1544767085980.thumb.png'
    }
  ],
  'ACTIVITY_TEXTBOOK_TITLE': [
    {
      'name': '28ShallowCopy-6',
      'identifier': 'do_2130093660325806081984',
      'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2130093660325806081984/artifact/44870761_1067305270146427_8127580563721682944_n_1576750191164.thumb.jpg',
      'organisation': [
        'test'
      ],
      'subject': 'Mathematics',
      'type': 'TextBook',
      'contentType': 'TextBook',
      'cardImg': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2130093660325806081984/artifact/44870761_1067305270146427_8127580563721682944_n_1576750191164.thumb.jpg'
    }
  ]
};
export const groupsTnc = {
  id: 'groupsTnc',
  field: 'groupsTnc',
  value: '{\"latestVersion\":\"3.4.0\",\"3.4.0\":{\"url\":\"https:/terms-of-use.html#groupGuidelines\"}}'
};
export const modified = {
  field: 'groupsTnc',
  id: 'groupsTnc',
  value: {
    latestVersion: '3.4.0',
    '3.4.0': {
      url: 'https:/terms-of-use.html#groupGuidelines'
    }
  }
};
export const notificationData = {
  data: {
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
        'type': 'member-added',
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
}
};
