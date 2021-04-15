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
      emitData: {
        'forumIds': '[6]',
        'userName': 'cctn1350'
      }
};

