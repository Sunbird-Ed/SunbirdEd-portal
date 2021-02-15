export const MockResponseData = {

  fetchForumResponse: {
    'id': 'api.discussions.category.forum',
    'ver': '1.0',
    'ets': 1609740965261,
    'params': {
      'resmsgid': 'e07ec8a7-d961-42f6-a551-1d013906f5fb',
      'msgid': '',
      'status': 'successful'
    },
    'responseCode': 'OK',
    'result': [
      {
        '_id': '6023db5453aafa0279927370',
        'sbType': 'group',
        'sbIdentifier': '361a672f-cb77-4dd8-9cdf-9eb7c12ee8c7',
        'cid': 9,
        '__v': 0
      },
    ]
  },

  registerUserSuccess: {
    'id': 'api.discussions.user.create',
    'ver': '1.0',
    'params': {
      'resmsgid': '',
      'msgid': '',
      'status': 'successful',
      'msg': 'User created successful'
    },
    'responseCode': 'OK',
    'result': {
      'uid': 18,
      'username': 'cctn1350',
      'userSlug': 'cctn1350'
    }
  },

  disableDiscussionForum: {
    'id': 'api.discussions.category.forum',
    'ver': '1.0',
    'ets': 1613118781732,
    'params': {
      'resmsgid': '7461ebf3-dec0-4500-8eca-8a4ef92103eb',
      'msgid': '',
      'status': 'successful'
    },
    'responseCode': 'OK',
    'result': null
  },

  enableDiscussionForum: {
    'id': 'api.discussions.category.forum',
    'ver': '1.0',
    'ets': 1613118934398,
    'params': {
      'resmsgid': '6cebb9e4-1929-431a-92da-d4a76b33ef72',
      'msgid': '',
      'status': 'successful'
    },
    'responseCode': 'OK',
    'result': [
      {
        '_id': '60263dd6d16d3e0045d6fecd',
        'sbType': 'group',
        'sbIdentifier': 'a7e84908-1d22-4da1-95dc-63dae890353c',
        'cid': 13,
        '__v': 0
      }
    ]
  },
  forumConfig: [{
    'category': {
      'name': 'General Discussion',
      'pid': '15',
      'uid': '1',
      'description': '',
      'context': [
        {
          'type': 'group',
          'identifier': 'SOME_GROUP_ID'
        }
      ]
    }
  }]
};
