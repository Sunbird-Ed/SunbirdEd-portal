export const mockResponse = {
    resourceBundle: {
        'messages': {
            'fmsg': {
                'm0079': 'Assigning badge failed, please try again later...',
                'm0078': 'Fetching badge failed, please try again later...'
            },
            'smsg': {
                'm0044': 'Badge assigned successfully'
            }
        }
    },
    createBatchInputData : {
      orgIds : ['01230654510633779230', 'ORG_001'],
      userId: '8036594d-c0cf-4869-a29c-7ffd0ee2bc90',
      courseId: 'do_112470675618004992181',
      users: ['e7592ce3-4605-4a3c-82cb-158951b0903c'],
      mentors : ['8557fa44-6b3a-4a4a-bb99-7907e635b2f7'],
      createBatchUserForm: {value:
         {
            description: 'about test',
            endDate: 'Fri Jun 29 2018 00:00:00 GMT+0530 (IST)',
            startDate: 'Wed Jun 27 2018 00:00:00 GMT+0530 (IST)',
            name: 'test name',
            enrollmentType: 'invite-only'
         }
      }
    },
    req: {
      'request': {
         'courseId': 'do_112470675618004992181',
         'name': 'raghavendra 1',
         'description': 'about this batch',
         'enrollmentType': 'invite-only',
         'startDate': '2018-06-06T18:30:00.000Z',
         'endDate': '2018-06-19T18:30:00.000Z',
         'createdBy': '8036594d-c0cf-4869-a29c-7ffd0ee2bc90',
         'createdFor': [
            '01230654510633779230',
            'ORG_001'
         ],
         'mentors': [
            '44c3a14c-d9b3-4269-ab28-946418de4030'
         ]
      }
    },
    returnValue: {
      'id': 'api.course.batch.create',
      'ver': 'v1',
      'ts': '2018-06-06 11:12:35:315+0000',
      'params': {
         'resmsgid': null,
         'msgid': 'acad8b25-ccae-4732-b84f-2ca76a0e9076',
         'err': null,
         'status': 'success',
         'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
         'response': 'SUCCESS',
         'batchId': '01251970679178035216'
      }
    },
    errorResponse: {
      'id': 'api.course.batch.create',
      'ver': 'v1',
      'ts': '2018-06-06 13:13:06:208+0000',
      'params': {
      'resmsgid': null,
      'msgid': null,
      'err': 'INVALID_USER_ID',
      'status': 'INVALID_USER_ID',
      'errmsg': 'INVALID_USER_ID'
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
};
