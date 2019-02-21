export const mockRes = {
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
  },
  courseProgressData: {
    getBatchDetails: {
      'id': 'api.dashboard.progress.course',
      'ver': 'v2',
      'ts': '2019-02-20 09:11:20:700+0000',
      'params': {
       'resmsgid': null,
       'msgid': '9c1ce105-0de5-fad9-945b-4aeaaedcb3cb',
       'err': null,
       'status': 'success',
       'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
       'data': [
        {
         'orgName': null,
         'enrolledOn': '2019-02-14 05:48:01:770+0000',
         'lastAccessedOn': null,
         'phone': '******7418',
         'progress': 0,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'User six'
        },
        {
         'orgName': 'Sunbird',
         'enrolledOn': '2019-02-14 05:48:01:813+0000',
         'lastAccessedOn': null,
         'phone': '******7418',
         'progress': 0,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'User ten'
        },
        {
         'orgName': 'Sunbird',
         'enrolledOn': '2019-02-14 05:48:01:895+0000',
         'lastAccessedOn': null,
         'phone': '******7418',
         'progress': 0,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'User twelve'
        },
        {
         'orgName': 'Sunbird',
         'enrolledOn': '2019-02-14 05:48:01:966+0000',
         'lastAccessedOn': null,
         'phone': '******7418',
         'progress': 0,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'User five'
        },
        {
         'orgName': 'Sunbird',
         'enrolledOn': '2019-02-14 05:48:01:732+0000',
         'lastAccessedOn': null,
         'phone': '******7418',
         'progress': 0,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'User eight'
        },
        {
         'orgName': 'Sunbird',
         'enrolledOn': '2019-02-14 05:48:01:850+0000',
         'lastAccessedOn': null,
         'phone': '******7418',
         'progress': 0,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'User thirteen'
        },
        {
         'orgName': 'Sunbird',
         'enrolledOn': '2019-02-14 05:48:01:931+0000',
         'lastAccessedOn': null,
         'phone': '******7418',
         'progress': 0,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'User seven'
        },
        {
         'orgName': 'Sunbird',
         'enrolledOn': '2019-02-14 07:15:43:468+0000',
         'lastAccessedOn': '2019-02-14 10:22:44:552+0000',
         'phone': '******6453',
         'progress': 100,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'Anuj Gupta'
        },
        {
         'orgName': 'Sunbird',
         'enrolledOn': '2019-02-14 05:48:01:671+0000',
         'lastAccessedOn': '2019-02-14 05:54:35:277+0000',
         'phone': '******7418',
         'progress': 100,
         'batchId': '01269861558192537614',
         'courseId': 'do_1126981011606323201176',
         'username': 'Creator User122'
        }
       ],
       'endDate': null,
       'response': 'SUCCESS',
       'count': 9,
       'completedCount': 2,
       'startDate': '2019-02-14'
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
  getMyBatchesList: {
    'id': null,
    'ver': 'v1',
    'ts': '2018-01-09 08:58:16:666+0000',
    'params': {
      'resmsgid': null,
      'msgid': 'fcbed63b-312d-4c9f-9598-77e2620274f3',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'count': 2,
        'content': [{
          'identifier': '01240505557369651216',
          'createdFor': ['ORG_001'],
          'courseAdditionalInfo': {
            'courseName': '1014 Retest',
            'leafNodesCount': '2',
            'description': 'dsfdsf',
            'status': 'Live'
          },
          'endDate': '2018-01-31',
          'description': 'bangalore days',
          'countIncrementDate': '2017-12-26 12:00:00:949+0000',
          'countDecrementDate': null,
          'updatedDate': '2017-12-26 12:00:00:949+0000',
          'participant': {
            'c6f02b71-4ef6-4450-96f8-0d173f67f33f': true,
            '55fefcb5-c602-4190-863a-40c8c21104a0': true,
            '2a6bde34-0e89-4182-b717-fe6d8faf849f': true,
            'ac918519-f8b8-4150-bd90-56ead42454d0': true
          },
          'countIncrementStatus': true,
          'createdDate': '2017-12-26 11:34:06:783+0000',
          'createdBy': '63b0870c-f370-4f96-842d-f6a7fa2db1df',
          'courseCreator': '4c4530df-0d4f-42a5-bd91-0366716c8c24',
          'hashTagId': '01240505557369651216',
          'mentors': [],
          'name': 'bangalore days',
          'countDecrementStatus': false,
          'id': '01240505557369651216',
          'enrollmentType': 'invite-only',
          'courseId': 'do_212390847580487680138',
          'startDate': '2017-12-26',
          'status': 1
        }, {
          'identifier': '01240504782578483214',
          'createdFor': ['ORG_001'],
          'courseAdditionalInfo': {
            'courseName': '1014 Retest',
            'leafNodesCount': '2',
            'description': 'dsfdsf',
            'status': 'Live'
          },
          'endDate': '2017-12-29',
          'description': 'rajkumar',
          'countIncrementDate': '2017-12-27 00:00:00:385+0000',
          'countDecrementDate': '2017-12-30 00:00:03:532+0000',
          'updatedDate': '2017-12-30 00:00:03:532+0000',
          'participant': {
            'c6f02b71-4ef6-4450-96f8-0d173f67f33f': true,
            '2a6bde34-0e89-4182-b717-fe6d8faf849f': true
          },
          'countIncrementStatus': true,
          'createdDate': '2017-12-26 11:32:39:890+0000',
          'createdBy': '63b0870c-f370-4f96-842d-f6a7fa2db1df',
          'courseCreator': '4c4530df-0d4f-42a5-bd91-0366716c8c24',
          'hashTagId': '01240504782578483214',
          'mentors': [],
          'name': 'rajkumar',
          'countDecrementStatus': true,
          'id': '01240504782578483214',
          'enrollmentType': 'invite-only',
          'courseId': 'do_212390847580487680138',
          'startDate': '2017-12-27',
          'status': 2
        }]
      }
    }
  }
};
