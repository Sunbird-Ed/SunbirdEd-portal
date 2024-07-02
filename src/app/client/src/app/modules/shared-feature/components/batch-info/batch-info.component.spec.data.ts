export const batchInfoMockResponse = {
    enrolledBatchInfoSuccessResponse: {
        'onGoingBatchCount': 5,
        'expiredBatchCount': 1,
        'openBatch': {
          'ongoing': [],
          'expired': [
            {
              'dateTime': '2019-05-18 17:11:53:560+0000',
              'identifier': '4d9fa64de9d9f831df5252561bed8bd60f2a96c2c054bc9ecaea29284db0863e',
              'lastReadContentStatus': 1,
              'enrolledDate': '2019-05-18 17:11:02:308+0000',
              'addedBy': null,
              'contentId': 'do_2127644219762278401149',
              'batch': {
                'identifier': '0127644280892047364',
                'endDate': '2019-05-30',
                'createdBy': '87cb1e5b-16cf-4160-9a2c-7384da0ae97f',
                'name': 'Second Batch',
                'enrollmentType': 'open',
                'startDate': '2019-05-18',
                'status': 2
              },
              'active': true,
              'description': 'Test',
              'batchId': '0127644280892047364',
              'userId': 'cd0b5972-a27c-4003-b557-b64efeff9777',
              'content': {
                'identifier': 'do_2127644219762278401149',
                'orgDetails': {
                  'orgName': 'Sunbird QA Tenant',
                  'email': 'qa_ekstep@qualitrix.com'
                },
                'channel': '0124511394914140160',
                'name': 'R2.0.0 Batch 2',
                'topic': [
                  'Science',
                  'Social Science',
                  'Language',
                  'Other Curriculum Subjects'
                ],
                'contentType': 'Course',
                'objectType': 'Content'
              },
              'processingStatus': 'COMPLETED',
              'courseName': 'R2.0.0 Batch 2',
              'leafNodesCount': 3,
              'progress': 1,
              'id': '4d9fa64de9d9f831df5252561bed8bd60f2a96c2c054bc9ecaea29284db0863e',
              'lastReadContentId': 'do_2127637291577425921328',
              'courseId': 'do_2127644219762278401149',
              'status': 1
            }
          ]
        },
        'inviteOnlyBatch': {
          'ongoing': [],
          'expired': []
        },
        'courseId': 'do_2127644219762278401149'
      },
      enrolledBatchInfoErrorResponse: {
        'onGoingBatchCount': 0,
        'expiredBatchCount': 1,
        'openBatch': {
          'ongoing': [],
          'expired': [
            {
              'dateTime': '2019-05-18 17:11:53:560+0000',
              'identifier': '4d9fa64de9d9f831df5252561bed8bd60f2a96c2c054bc9ecaea29284db0863e',
              'lastReadContentStatus': 1,
              'enrolledDate': '2019-05-18 17:11:02:308+0000',
              'addedBy': null,
              'contentId': 'do_2127644219762278401149',
              'batch': {
                'identifier': '0127644280892047364',
                'endDate': '2019-05-30',
                'createdBy': '87cb1e5b-16cf-4160-9a2c-7384da0ae97f',
                'name': 'Second Batch',
                'enrollmentType': 'open',
                'startDate': '2019-05-18',
                'status': 2
              },
              'active': true,
              'description': 'Test',
              'batchId': '0127644280892047364',
              'userId': 'cd0b5972-a27c-4003-b557-b64efeff9777',
              'content': {
                'identifier': 'do_2127644219762278401149',
                'orgDetails': {
                  'orgName': 'Sunbird QA Tenant',
                  'email': 'qa_ekstep@qualitrix.com'
                },
                'channel': '0124511394914140160',
                'name': 'R2.0.0 Batch 2',
                'topic': [
                  'Science',
                  'Social Science',
                  'Language',
                  'Other Curriculum Subjects'
                ],
                'contentType': 'Course',
                'objectType': 'Content'
              },
              'processingStatus': 'COMPLETED',
              'courseName': 'R2.0.0 Batch 2',
              'leafNodesCount': 3,
              'progress': 1,
              'id': '4d9fa64de9d9f831df5252561bed8bd60f2a96c2c054bc9ecaea29284db0863e',
              'lastReadContentId': 'do_2127637291577425921328',
              'courseId': 'do_2127644219762278401149',
              'status': 1
            }
          ]
        },
        'inviteOnlyBatch': {
          'ongoing': [],
          'expired': []
        },
        'courseId': 'do_2127644219762278401149'
      },
      ServerResponse: {
        'id': 'org.search',
        'ver': 'v2',
        'ts': '',
        params: {
          resmsgid: 'msg_id',
          status: 'success'
        },
        'responseCode': 'OK',
        'result': {
          'response': {
            'count': 1,
            'content': [
              {
                'keys': {},
                'channel': 'ntp',
                'description': 'NTP Pre-prod Organization',
                'updatedDate': null,
                'organisationType': 5,
                'isTenant': true,
                'provider': null,
                'id': '01268904781886259221',
                'hashTagId': '01268904781886259221',
                'status': 1
              }
            ]
          }
        }
      },
    batchList: [
      {
        'dateTime': '2019-05-18 17:11:53:560+0000',
        'identifier': '4d9fa64de9d9f831df5252561bed8bd60f2a96c2c054bc9ecaea29284db0863e',
        'lastReadContentStatus': 1,
        'enrolledDate': '2019-05-18 17:11:02:308+0000',
        'addedBy': null,
        'contentId': 'do_2127644219762278401149',
        'batch': {
          'identifier': '0127644280892047364',
          'endDate': '2020-12-26',
          'createdBy': '87cb1e5b-16cf-4160-9a2c-7384da0ae97f',
          'name': 'Second Batch',
          'enrollmentType': 'open',
          'startDate': '2019-05-18',
          'status': 2
        },
        'active': true,
        'description': 'Test',
        'batchId': '0127644280892047364',
        'userId': 'cd0b5972-a27c-4003-b557-b64efeff9777',
        'processingStatus': 'COMPLETED',
        'courseName': 'R2.0.0 Batch 2',
        'leafNodesCount': 3,
        'progress': 1,
        'id': '4d9fa64de9d9f831df5252561bed8bd60f2a96c2c054bc9ecaea29284db0863e',
        'lastReadContentId': 'do_2127637291577425921328',
        'courseId': 'do_2127644219762278401149',
        'status': 1
      }
    ]
};
