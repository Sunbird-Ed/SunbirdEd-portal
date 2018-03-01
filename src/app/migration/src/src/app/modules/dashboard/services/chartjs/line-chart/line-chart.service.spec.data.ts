export const mockRes = {
  consumptionData: {
    'bucketData': {
      'org.consumption.content.users.count': {
        'name': 'Number of users per day',
        'split': 'content.users.count',
        'group_id': 'org.users.count',
        'buckets': [{
          'key': 1518085938441,
          'key_name': '2018-02-08',
          'value': 0
        }, {
          'key': 1518172338441,
          'key_name': '2018-02-09',
          'value': 0
        }, {
          'key': 1518258738441,
          'key_name': '2018-02-10',
          'value': 0
        }, {
          'key': 1518345138441,
          'key_name': '2018-02-11',
          'value': 0
        }, {
          'key': 1518431538441,
          'key_name': '2018-02-12',
          'value': 0
        }, {
          'key': 1518517938441,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518604338441,
          'key_name': '2018-02-14',
          'value': 0
        }]
      },
      'org.consumption.content.time_spent.sum': {
        'name': 'Time spent by day',
        'split': 'content.time_spent.user.count',
        'time_unit': 'seconds',
        'group_id': 'org.timespent.sum',
        'buckets': [{
          'key': 1518085938442,
          'key_name': '2018-02-08',
          'value': 0
        },
        {
          'key': 1518172338442,
          'key_name': '2018-02-09',
          'value': 0
        }, {
          'key': 1518258738442,
          'key_name': '2018-02-10',
          'value': 0
        },
        {
          'key': 1518345138442,
          'key_name': '2018-02-11',
          'value': 0
        }, {
          'key': 1518431538442,
          'key_name': '2018-02-12',
          'value': 0
        },
        {
          'key': 1518517938442,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518604338442,
          'key_name': '2018-02-14',
          'value': 0
        }
        ]
      }
    },
    'numericData': [{
      'name': 'Number of visits by users',
      'value': 0
    }, {
      'name': 'Content consumption time',
      'value': '0 second(s)',
      'time_unit': 'seconds'
    }, {
      'name': 'Average time spent by user per visit',
      'value': '0 second(s)',
      'time_unit': 'seconds'
    }],
    'series': ''
  },
  creationData: {
    'bucketData': {
      'org.creation.content[@status=draft].count': {
        'name': 'Draft',
        'split': 'content.created_on',
        'group_id': 'org.content.count',
        'buckets': [{
          'key': 1518092433791,
          'key_name': '2018-02-08',
          'value': 0
        }, {
          'key': 1518178833791,
          'key_name': '2018-02-09',
          'value': 0
        }, {
          'key': 1518265233791,
          'key_name': '2018-02-10',
          'value': 0
        }, {
          'key': 1518351633791,
          'key_name': '2018-02-11',
          'value': 0
        }, {
          'key': 1518438033791,
          'key_name': '2018-02-12',
          'value': 0
        }, {
          'key': 1518524433791,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518610833791,
          'key_name': '2018-02-14',
          'value': 0
        }]
      },
      'org.creation.content[@status=review].count': {
        'name': 'Review',
        'split': 'content.reviewed_on',
        'group_id': 'org.content.count',
        'buckets': [{
          'key': 1518092433791,
          'key_name': '2018-02-08',
          'value': 0
        }, {
          'key': 1518178833791,
          'key_name': '2018-02-09',
          'value': 0
        }, {
          'key': 1518265233791,
          'key_name': '2018-02-10',
          'value': 0
        }, {
          'key': 1518351633791,
          'key_name': '2018-02-11',
          'value': 0
        }, {
          'key': 1518438033791,
          'key_name': '2018-02-12',
          'value': 0
        }, {
          'key': 1518524433791,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518610833791,
          'key_name': '2018-02-14',
          'value': 0
        }]
      },
      'org.creation.content[@status=published].count': {
        'name': 'Live',
        'split': 'content.published_on',
        'group_id': 'org.content.count',
        'buckets': [{
          'key': 1518092433791,
          'key_name': '2018-02-08',
          'value': 0
        }, {
          'key': 1518178833791,
          'key_name': '2018-02-09',
          'value': 0
        }, {
          'key': 1518265233791,
          'key_name': '2018-02-10',
          'value': 0
        }, {
          'key': 1518351633791,
          'key_name': '2018-02-11',
          'value': 0
        }, {
          'key': 1518438033791,
          'key_name': '2018-02-12',
          'value': 0
        }, {
          'key': 1518524433791,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518610833791,
          'key_name': '2018-02-14',
          'value': 0
        }]
      }
    },
    'numericData': [{
      'name': 'Number of contents created',
      'value': 0
    }, {
      'name': 'Number of authors',
      'value': 0
    }, {
      'name': 'Number of reviewers',
      'value': 0
    }],
    'series': ['0 Created', '0 IN REVIEW', '0 LIVE'],
    'name': 'Content created per day'
  }
};
