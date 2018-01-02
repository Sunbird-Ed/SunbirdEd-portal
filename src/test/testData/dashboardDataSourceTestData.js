var dashboardDataSourceTestData = { // eslint-disable-line
  courseConsumptionData: {
    getCourseData: {
      'id': 'api.sunbird.dashboard.course.consumption',
      'ver': 'v1',
      'ts': '2017-12-29 05:11:08:763+0000',
      'params': {
        'resmsgid': null,
        'msgid': '1d0ca29d-21f4-412f-860f-026e63f0dbd7',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'course': {
          'courseId': 'do_2124000017636802561576'
        },
        'period': '7d',
        'snapshot': {
          'course.consumption.time_spent.count': {
            'name': 'Total time of Content consumption',
            'time_unit': 'seconds',
            'value': 0.0
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
              'key': 1513919468756,
              'key_name': '2017-12-22',
              'value': 0.0
            }, {
              'key': 1514005868756,
              'key_name': '2017-12-23',
              'value': 0.0
            }, {
              'key': 1514092268756,
              'key_name': '2017-12-24',
              'value': 0.0
            }, {
              'key': 1514178668756,
              'key_name': '2017-12-25',
              'value': 0.0
            }, {
              'key': 1514265068756,
              'key_name': '2017-12-26',
              'value': 0.0
            }, {
              'key': 1514351468756,
              'key_name': '2017-12-27',
              'value': 0.0
            }, {
              'key': 1514437868756,
              'key_name': '2017-12-28',
              'value': 0.0
            }]
          },
          'course.consumption.content.users.count': {
            'name': 'Number of users by day',
            'split': 'content.users.count',
            'group_id': 'course.users.count',
            'buckets': [{
              'key': 1513919468756,
              'key_name': '2017-12-22',
              'value': 0
            }, {
              'key': 1514005868756,
              'key_name': '2017-12-23',
              'value': 0
            }, {
              'key': 1514092268756,
              'key_name': '2017-12-24',
              'value': 0
            }, {
              'key': 1514178668756,
              'key_name': '2017-12-25',
              'value': 0
            }, {
              'key': 1514265068756,
              'key_name': '2017-12-26',
              'value': 0
            }, {
              'key': 1514351468756,
              'key_name': '2017-12-27',
              'value': 0
            }, {
              'key': 1514437868756,
              'key_name': '2017-12-28',
              'value': 0
            }]
          }
        }
      }
    },
    errorResponse: {
      'id': 'api.sunbird.dashboard.course.admin',
      'ver': 'v1',
      'ts': '2017-12-29 11:04:44:879+0000',
      'params': {
        'resmsgid': null,
        'msgid': '71dde962-6d3b-4971-81af-eb0df754ee7a',
        'err': 'INVALID_PERIOD',
        'status': 'INVALID_PERIOD',
        'errmsg': 'Time Period is invalid'
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  },
  courseProgressData: {
    getBatchDetails: {
      'id': 'api.sunbird.dashboard.course.admin',
      'ver': 'v1',
      'ts': '2017-12-29 09:50:32:125+0000',
      'params': {
        'resmsgid': null,
        'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'period': '7d',
        'series': {
          'course.progress.users_enrolled.count': {
            'name': 'List of users enrolled for the course',
            'split': 'content.sum(time_spent)',
            'buckets': [{
              'userName': 'sanvijna9',
              'user': '2a6bde34-0e89-4182-b717-fe6d8faf849f'
            }, {
              'userName': 'arvind12745.yadav127',
              'user': 'c6f02b71-4ef6-4450-96f8-0d173f67f33f'
            }]
          },
          'course.progress.course_progress_per_user.count': {
            'name': 'List of users enrolled for the course',
            'split': 'content.sum(time_spent)',
            'buckets': [{
              'enrolledOn': '2017-12-26 11:32:41:484+0000',
              'lastAccessTime': '2017-12-26 11:32:41:484+0000',
              'org': 'Sunbird',
              'progress': 0,
              'batchEndsOn': '2017-12-29',
              'userName': 'sanvijna9',
              'user': '2a6bde34-0e89-4182-b717-fe6d8faf849f'
            }, {
              'enrolledOn': '2017-12-26 11:32:40:878+0000',
              'lastAccessTime': '2017-12-26 11:32:40:877+0000',
              'org': 'Sunbird',
              'progress': 0,
              'batchEndsOn': '2017-12-29',
              'userName': 'arvind12745.yadav127',
              'user': 'c6f02b71-4ef6-4450-96f8-0d173f67f33f'
            }]
          }
        }
      }
    },
    errorResponse: {
      'id': 'api.sunbird.dashboard.course.admin',
      'ver': 'v1',
      'ts': '2017-12-29 11:04:44:879+0000',
      'params': {
        'resmsgid': null,
        'msgid': '71dde962-6d3b-4971-81af-eb0df754ee7a',
        'err': 'INVALID_PERIOD',
        'status': 'INVALID_PERIOD',
        'errmsg': 'Time Period is invalid'
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  }
}
