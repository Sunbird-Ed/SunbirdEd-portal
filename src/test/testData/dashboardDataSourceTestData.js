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
  },
  orgConsumptionData: {
    getSuccessData: {
      'id': 'api.sunbird.dashboard.org.consumption',
      'ver': 'v1',
      'ts': '2018-01-02 06:36:17:343+0000',
      'params': {
        'resmsgid': null,
        'msgid': '6d6d77a6-00d4-44cd-bfa7-56fe7ac5f888',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'period': '7d',
        'org': {
          'orgName': 'Sunbird',
          'orgId': 'ORG_001'
        },
        'snapshot': {
          'org.consumption.content.session.count': {
            'name': 'Number of visits by users',
            'value': 0
          },
          'org.consumption.content.time_spent.sum': {
            'name': 'Content consumption time',
            'value': 0.0,
            'time_unit': 'seconds'
          },
          'org.consumption.content.time_spent.average': {
            'name': 'Average time spent by user per visit',
            'value': 0.0,
            'time_unit': 'seconds'
          }
        },
        'series': {
          'org.consumption.content.users.count': {
            'name': 'Number of users per day',
            'split': 'content.users.count',
            'group_id': 'org.users.count',
            'buckets': [{
              'key': 1514270177342,
              'key_name': '2017-12-26',
              'value': 0
            }, {
              'key': 1514356577342,
              'key_name': '2017-12-27',
              'value': 0
            }, {
              'key': 1514442977342,
              'key_name': '2017-12-28',
              'value': 0
            }, {
              'key': 1514529377342,
              'key_name': '2017-12-29',
              'value': 0
            }, {
              'key': 1514615777342,
              'key_name': '2017-12-30',
              'value': 0
            }, {
              'key': 1514702177342,
              'key_name': '2017-12-31',
              'value': 0
            }, {
              'key': 1514788577342,
              'key_name': '2018-01-01',
              'value': 0
            }]
          },
          'org.consumption.content.time_spent.sum': {
            'name': 'Time spent by day',
            'split': 'content.time_spent.user.count',
            'time_unit': 'seconds',
            'group_id': 'org.timespent.sum',
            'buckets': [{
              'key': 1514270177342,
              'key_name': '2017-12-26',
              'value': 0.0
            }, {
              'key': 1514356577342,
              'key_name': '2017-12-27',
              'value': 0.0
            }, {
              'key': 1514442977342,
              'key_name': '2017-12-28',
              'value': 0.0
            }, {
              'key': 1514529377342,
              'key_name': '2017-12-29',
              'value': 0.0
            }, {
              'key': 1514615777342,
              'key_name': '2017-12-30',
              'value': 0.0
            }, {
              'key': 1514702177342,
              'key_name': '2017-12-31',
              'value': 0.0
            }, {
              'key': 1514788577342,
              'key_name': '2018-01-01',
              'value': 0.0
            }]
          }
        }
      }
    },
    clientError: {
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
  orgCreationData: {
    getSuccessData: {
      'id': 'api.sunbird.dashboard.org.creation',
      'ver': 'v1',
      'ts': '2018-01-02 11:44:56:717+0000',
      'params': {
        'resmsgid': null,
        'msgid': 'b4e3c7a0-4004-4010-a36c-41a1617c10cc',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'period': '14d',
        'org': {
          'orgName': 'NTP Content Create Testing',
          'orgId': '0123150108807004166'
        },
        'snapshot': {
          'org.creation.content.count': {
            'name': 'Number of contents created',
            'value': 1.0
          },
          'org.creation.authors.count': {
            'name': 'Number of authors',
            'value': 1
          },
          'org.creation.reviewers.count': {
            'name': 'Number of reviewers',
            'value': 0
          },
          'org.creation.content[@status=draft].count': {
            'name': 'Number of content items created',
            'value': 1
          },
          'org.creation.content[@status=review].count': {
            'name': 'Number of content items reviewed',
            'value': 0
          },
          'org.creation.content[@status=published].count': {
            'name': 'Number of content items published',
            'value': 0
          }
        },
        'series': {
          'org.creation.content[@status=draft].count': {
            'name': 'Draft',
            'split': 'content.created_on',
            'group_id': 'org.content.count',
            'buckets': [{
              'key': 1513621800000,
              'key_name': '2017-12-19',
              'value': 1
            }, {
              'key': 1513708200000,
              'key_name': '2017-12-20',
              'value': 0
            }, {
              'key': 1513794600000,
              'key_name': '2017-12-21',
              'value': 0
            }, {
              'key': 1513881000000,
              'key_name': '2017-12-22',
              'value': 0
            }, {
              'key': 1513967400000,
              'key_name': '2017-12-23',
              'value': 0
            }, {
              'key': 1514053800000,
              'key_name': '2017-12-24',
              'value': 0
            }, {
              'key': 1514140200000,
              'key_name': '2017-12-25',
              'value': 0
            }, {
              'key': 1514226600000,
              'key_name': '2017-12-26',
              'value': 0
            }, {
              'key': 1514313000000,
              'key_name': '2017-12-27',
              'value': 0
            }, {
              'key': 1514399400000,
              'key_name': '2017-12-28',
              'value': 0
            }, {
              'key': 1514485800000,
              'key_name': '2017-12-29',
              'value': 0
            }, {
              'key': 1514572200000,
              'key_name': '2017-12-30',
              'value': 0
            }, {
              'key': 1514658600000,
              'key_name': '2017-12-31',
              'value': 0
            }, {
              'key': 1514745000000,
              'key_name': '2018-01-01',
              'value': 0
            }]
          },
          'org.creation.content[@status=review].count': {
            'name': 'Review',
            'split': 'content.reviewed_on',
            'group_id': 'org.content.count',
            'buckets': [{
              'key': 1513683896716,
              'key_name': '2017-12-19',
              'value': 0
            }, {
              'key': 1513770296716,
              'key_name': '2017-12-20',
              'value': 0
            }, {
              'key': 1513856696716,
              'key_name': '2017-12-21',
              'value': 0
            }, {
              'key': 1513943096716,
              'key_name': '2017-12-22',
              'value': 0
            }, {
              'key': 1514029496716,
              'key_name': '2017-12-23',
              'value': 0
            }, {
              'key': 1514115896716,
              'key_name': '2017-12-24',
              'value': 0
            }, {
              'key': 1514202296716,
              'key_name': '2017-12-25',
              'value': 0
            }, {
              'key': 1514288696716,
              'key_name': '2017-12-26',
              'value': 0
            }, {
              'key': 1514375096716,
              'key_name': '2017-12-27',
              'value': 0
            }, {
              'key': 1514461496716,
              'key_name': '2017-12-28',
              'value': 0
            }, {
              'key': 1514547896716,
              'key_name': '2017-12-29',
              'value': 0
            }, {
              'key': 1514634296716,
              'key_name': '2017-12-30',
              'value': 0
            }, {
              'key': 1514720696716,
              'key_name': '2017-12-31',
              'value': 0
            }, {
              'key': 1514807096716,
              'key_name': '2018-01-01',
              'value': 0
            }]
          },
          'org.creation.content[@status=published].count': {
            'name': 'Live',
            'split': 'content.published_on',
            'group_id': 'org.content.count',
            'buckets': [{
              'key': 1513683896716,
              'key_name': '2017-12-19',
              'value': 0
            }, {
              'key': 1513770296716,
              'key_name': '2017-12-20',
              'value': 0
            }, {
              'key': 1513856696716,
              'key_name': '2017-12-21',
              'value': 0
            }, {
              'key': 1513943096716,
              'key_name': '2017-12-22',
              'value': 0
            }, {
              'key': 1514029496716,
              'key_name': '2017-12-23',
              'value': 0
            }, {
              'key': 1514115896716,
              'key_name': '2017-12-24',
              'value': 0
            }, {
              'key': 1514202296716,
              'key_name': '2017-12-25',
              'value': 0
            }, {
              'key': 1514288696716,
              'key_name': '2017-12-26',
              'value': 0
            }, {
              'key': 1514375096716,
              'key_name': '2017-12-27',
              'value': 0
            }, {
              'key': 1514461496716,
              'key_name': '2017-12-28',
              'value': 0
            }, {
              'key': 1514547896716,
              'key_name': '2017-12-29',
              'value': 0
            }, {
              'key': 1514634296716,
              'key_name': '2017-12-30',
              'value': 0
            }, {
              'key': 1514720696716,
              'key_name': '2017-12-31',
              'value': 0
            }, {
              'key': 1514807096716,
              'key_name': '2018-01-01',
              'value': 0
            }]
          }
        }
      }
    },
    clientError: {
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  },
  downloadDashboardReport: {
    getSuccessData: {
      'responseCode': 'OK',
      'result': {
        'requestId': '01241050605165772817'
      }
    },
    clientError: {
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  }
}
