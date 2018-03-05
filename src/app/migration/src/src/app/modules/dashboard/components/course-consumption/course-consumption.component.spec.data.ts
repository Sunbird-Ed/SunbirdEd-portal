export const mockRes = {
  searchSuccess: {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'count': 65,
      'content': [{
        'identifier': 'do_2124339707713126401772',
        'name': 'course'
      }]
    }
  },
  searchSuccessWithCountTwo: {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'count': 65,
      'content': [{
        'identifier': 'do_2124339707713126401772',
        'name': 'course'
      }, {
        'identifier': 'do_2124339707713126401772',
        'name': 'course'
      }]
    }
  },
  consumptionData: {
    'bucketData': {
      'course.consumption.time_spent': {
        'name': 'Timespent for content consumption',
        'split': 'content.sum(time_spent)',
        'time_unit': 'seconds',
        'group_id': 'course.timespent.sum',
        'buckets': [{
          'key': 1518423367265,
          'key_name': '2018-02-12',
          'value': 0
        }, {
          'key': 1518509767265,
          'key_name': '2018-02-13',
          'value': 0
        },
        {
          'key': 1518596167265,
          'key_name': '2018-02-14',
          'value': 0
        }, {
          'key': 1518682567265,
          'key_name': '2018-02-15',
          'value': 0
        }, {
          'key': 1518768967265,
          'key_name': '2018-02-16',
          'value': 0
        }, {
          'key': 1518855367265,
          'key_name': '2018-02-17',
          'value': 0
        }, {
          'key': 1518941767265,
          'key_name': '2018-02-18',
          'value': 0
        }
        ]
      },
      'course.consumption.content.users.count': {
        'name': 'Number of users by day',
        'split': 'content.users.count',
        'group_id': 'course.users.count',
        'buckets': [{
          'key': 1518423367265,
          'key_name': '2018-02-12',
          'value': 0
        }, {
          'key': 1518509767265,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518596167265,
          'key_name': '2018-02-14',
          'value': 0
        }, {
          'key': 1518682567265,
          'key_name': '2018-02-15',
          'value': 0
        }, {
          'key': 1518768967265,
          'key_name': '2018-02-16',
          'value': 0
        }, {
          'key': 1518855367265,
          'key_name': '2018-02-17',
          'value': 0
        }, {
          'key': 1518941767265,
          'key_name': '2018-02-18',
          'value': 0
        }]
      }
    },
    'numericData': [
      {
        'name': 'Total time of Content consumption',
        'time_unit': 'seconds',
        'value': '0 second(s)'
      }, {
        'name': 'User access course over time',
        'value': 0
      }, {
        'name': 'Total users completed the course',
        'value': 0
      }, {
        'name': 'Average time per user for course completion',
        'value': '0 second(s)',
        'time_unit': 'seconds'
      }
    ],
    'series': ''
  }
};
