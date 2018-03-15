export const mockRes = {
  successData: {
    'id': 'api.sunbird.dashboard.course.consumption',
    'ver': 'v1',
    'responseCode': 'OK',
    'result': {
      'course': {
        'courseId': 'do_2123250076616048641482'
      },
      'period': '7d',
      'snapshot': {
        'course.consumption.time_spent.count': {
          'name': 'Total time of Content consumption',
          'time_unit': 'seconds',
          'value': 0
        },
        'course.consumption.time_per_user': {
          'name': 'User access course over time',
          'value': 0
        },
        'course.consumption.users_completed': {
          'name': 'Total users completed the course',
          'value': 0
        },
        'course.consumption.time_spent_completion_count': {
          'name': 'Average time per user for course completion',
          'value': 0,
          'time_unit': 'seconds'
        }
      },
      'series': {
        'course.consumption.time_spent': {
          'name': 'Timespent for content consumption',
          'split': 'content.sum(time_spent)',
          'time_unit': 'seconds',
          'group_id': 'course.timespent.sum',
          'buckets': [{
            'key': 1517203102887,
            'key_name': '2018-01-29',
            'value': 0
          }, {
            'key': 1517289502887,
            'key_name': '2018-01-30',
            'value': 0
          }, {
            'key': 1517375902887,
            'key_name': '2018-01-31',
            'value': 0
          }, {
            'key': 1517462302887,
            'key_name': '2018-02-01',
            'value': 0
          }, {
            'key': 1517548702887,
            'key_name': '2018-02-02',
            'value': 0
          }, {
            'key': 1517635102887,
            'key_name': '2018-02-03',
            'value': 0
          }, {
            'key': 1517721502887,
            'key_name': '2018-02-04',
            'value': 0
          }]
        },
        'course.consumption.content.users.count': {
          'name': 'Number of users by day',
          'split': 'content.users.count',
          'group_id': 'course.users.count',
          'buckets': [{
            'key': 1517203102887,
            'key_name': '2018-01-29',
            'value': 0
          }, {
            'key': 1517289502887,
            'key_name': '2018-01-30',
            'value': 0
          }, {
            'key': 1517375902887,
            'key_name': '2018-01-31',
            'value': 0
          }, {
            'key': 1517462302887,
            'key_name': '2018-02-01',
            'value': 0
          }, {
            'key': 1517548702887,
            'key_name': '2018-02-02',
            'value': 0
          }, {
            'key': 1517635102887,
            'key_name': '2018-02-03',
            'value': 0
          }, {
            'key': 1517721502887,
            'key_name': '2018-02-04',
            'value': 0
          }]
        }
      }
    }
  },
  parsedSuccessData: {
    'id': 'api.sunbird.dashboard.course.consumption',
    'ver': 'v1',
    'responseCode': 'OK',
    'result': {
      'course': {
        'courseId': 'do_2123250076616048641482'
      },
      'period': '7d',
      'snapshot': {
        'course.consumption.time_spent.count': {
          'name': 'Total time of Content consumption',
          'time_unit': 'seconds',
          'value': 0
        },
        'course.consumption.time_per_user': {
          'name': 'User access course over time',
          'value': 0
        },
        'course.consumption.users_completed': {
          'name': 'Total users completed the course',
          'value': 0
        },
        'course.consumption.time_spent_completion_count': {
          'name': 'Average time per user for course completion',
          'value': 0,
          'time_unit': 'seconds'
        }
      },
      'series': {
        'course.consumption.time_spent': {
          'name': 'Timespent for content consumption',
          'split': 'content.sum(time_spent)',
          'time_unit': 'seconds',
          'group_id': 'course.timespent.sum',
          'buckets': [{
            'key': 1517203102887,
            'key_name': '2018-01-29',
            'value': 0
          }, {
            'key': 1517289502887,
            'key_name': '2018-01-30',
            'value': 0
          }, {
            'key': 1517375902887,
            'key_name': '2018-01-31',
            'value': 0
          }, {
            'key': 1517462302887,
            'key_name': '2018-02-01',
            'value': 0
          }, {
            'key': 1517548702887,
            'key_name': '2018-02-02',
            'value': 0
          }, {
            'key': 1517635102887,
            'key_name': '2018-02-03',
            'value': 0
          }, {
            'key': 1517721502887,
            'key_name': '2018-02-04',
            'value': 0
          }]
        },
        'course.consumption.content.users.count': {
          'name': 'Number of users by day',
          'split': 'content.users.count',
          'group_id': 'course.users.count',
          'buckets': [{
            'key': 1517203102887,
            'key_name': '2018-01-29',
            'value': 0
          },
          {
            'key': 1517289502887,
            'key_name': '2018-01-30',
            'value': 0
          }, {
            'key': 1517375902887,
            'key_name': '2018-01-31',
            'value': 0
          }, {
            'key': 1517462302887,
            'key_name': '2018-02-01',
            'value': 0
          }, {
            'key': 1517548702887,
            'key_name': '2018-02-02',
            'value': 0
          }, {
            'key': 1517635102887,
            'key_name': '2018-02-03',
            'value': 0
          }, {
            'key': 1517721502887,
            'key_name': '2018-02-04',
            'value': 0
          }
          ]
        }
      }
    }
  }
};
