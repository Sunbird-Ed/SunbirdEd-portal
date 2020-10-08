export const MockData = {
  telemetryObj: {
    context: {
      env: 'reports',
      cdata: [{id: 'courseId', type: 'Course'}, {id: 'batchId', type: 'Batch'}]
    },
    edata: {
      id: 'response-exhaust',
      type: 'click',
      pageid: 'on-demand-reports'
    }
  },
  mockSubmitReqData: {
    result: {
      2: 'b',
      dataset: 'response-exhaust',
      status: 'FAILED',
      statusMessage: 'statusMessage'
    }
  },
  onDemandModifiedData: {},
  data: {data: 'testData'},
  reportListResponse: {
    'ver': '1.0',
    'ts': '2020-09-18T02:56:59.910+00:00',
    'params': {
      'resmsgid': '2823343f-65d8-4061-ad3b-53a9eb943724',
      'status': 'successful',
      'client_key': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 2,
      'jobs': [
        {
          'request_id': 'A09115FCBEC94CE6ACEB4D9BBFDBCBCF',
          'tag': 'test-tag:in.ekstep',
          'job_id': 'assessment-dashboard-metrics',
          'requested_by': 'client-2',
          'requested_channel': 'in.ekstep',
          'status': 'SUBMITTED',
          'last_updated': 1599661955303,
          'request_data': {
            'batchFilters': [
              'TPD',
              'NCFCOPY'
            ],
            'contentFilters': {
              'request': {
                'filters': {
                  'identifier': [
                    'do_11305960936384921612216',
                    'do_1130934466492252161819'
                  ],
                  'prevState': 'Draft'
                },
                'sort_by': {
                  'createdOn': 'desc'
                },
                'limit': 10000,
                'fields': [
                  'framework',
                  'identifier',
                  'name',
                  'channel',
                  'prevState'
                ]
              }
            },
            'reportPath': 'course-progress-v2/'
          },
          'attempts': 0,
          'job_stats': {
            'dt_job_submitted': 1599661955303,
            'dt_job_completed': 1599661955303,
            'execution_time': null
          },
          'downloadUrls': [],
          'expires_at': 1600399619
        },
        {
          'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
          'tag': 'test-tag:in.ekstep',
          'job_id': 'assessment-dashboard-metrics',
          'requested_by': 'client-1',
          'requested_channel': 'in.ekstep',
          'status': 'SUBMITTED',
          'last_updated': 1599728944037,
          'request_data': {
            'batchFilters': [
              'TPD',
              'NCFCOPY'
            ],
            'contentFilters': {
              'request': {
                'filters': {
                  'identifier': [
                    'do_11305960936384921612216',
                    'do_1130934466492252161819'
                  ],
                  'prevState': 'Draft'
                },
                'sort_by': {
                  'createdOn': 'desc'
                },
                'limit': 10000,
                'fields': [
                  'framework',
                  'identifier',
                  'name',
                  'channel',
                  'prevState'
                ]
              }
            },
            'reportPath': 'course-progress-v2/'
          },
          'attempts': 0,
          'job_stats': {
            'dt_job_submitted': 1599728944037,
            'dt_job_completed': null,
            'execution_time': null
          },
          'downloadUrls': [],
          'expires_at': 1600399619
        }
      ]
    }
  },
  submitRequestResponse: {
    'params': {
      'resmsgid': '4a32a0a5-5144-4d9b-97d2-e4d1217ed176',
      'status': 'successful',
      'client_key': null
    },
    'responseCode': 'OK',
    'result': {
      'job_stats': {
        'dt_job_submitted': 1600160849298,
        'dt_job_completed': null,
        'execution_time': null
      },
      'attempts': 0,
      'tag': 'test-tag:ROOT_ORG',
      'downloadUrls': [],
      'job_id': 'assessment-dashboard-metrics',
      'expires_at': 1600400653,
      'last_updated': 1600160849298,
      'status': 'SUBMITTED',
      'request_id': 'E61492EA29D2B4E6E2A39D47AF202433',
      'requested_by': 'client-1',
      'requested_channel': 'ROOT_ORG',
      'request_data': {
        'batchFilters': [
          'TPD',
          'NCFCOPY'
        ],
        'contentFilters': {
          'request': {
            'filters': {
              'identifier': [
                'do_11305960936384921612216',
                'do_1130934466492252161819'
              ],
              'prevState': 'Draft'
            },
            'sort_by': {
              'createdOn': 'desc'
            },
            'limit': 10000,
            'fields': [
              'framework',
              'identifier',
              'name',
              'channel',
              'prevState'
            ]
          }
        },
        'reportPath': 'course-progress-v2/'
      }
    }
  },
  processingRequest: {
    'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
    'tag': 'test-tag:in.ekstep',
    'job_id': 'progress-exhaust',
    'requested_by': 'client-1',
    'requested_channel': 'in.ekstep',
    'status': 'SUBMITTED',
    'last_updated': 1599728944037,
    'request_data': {
      'batchFilters': [
        'TPD',
        'NCFCOPY'
      ],
      'contentFilters': {
        'request': {
          'filters': {
            'identifier': [
              'do_11305960936384921612216',
              'do_1130934466492252161819'
            ],
            'prevState': 'Draft'
          },
          'sort_by': {
            'createdOn': 'desc'
          },
          'limit': 10000,
          'fields': [
            'framework',
            'identifier',
            'name',
            'channel',
            'prevState'
          ]
        }
      },
      'reportPath': 'course-progress-v2/'
    },
    'attempts': 0,
    'job_stats': {
      'dt_job_submitted': 1599728944037,
      'dt_job_completed': null,
      'execution_time': null
    },
    'downloadUrls': [
      'https://www.google.com', 'https://www.google.com',
    ],
    'expires_at': '2020-08-20'
  },
  selectedReport: {
    "title": " Course progress exhaust",
    "dataset": "progress-exhaust",
    "lang_key": "frmelmnts.lbl.progressExhaustReport",
    "encrypt": "false"
  },
  responseData: {
    result: {
      jobs: [
        {
          'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
          'tag': 'test-tag:in.ekstep',
          'dataset': 'progress-exhaust',
          'requested_by': 'client-1',
          'requested_channel': 'in.ekstep',
          'status': 'SUBMITTED',
          'last_updated': 1599728944037,
          'request_data': {
            'batchFilters': [
              'TPD',
              'NCFCOPY'
            ],
            'contentFilters': {
              'request': {
                'filters': {
                  'identifier': [
                    'do_11305960936384921612216',
                    'do_1130934466492252161819'
                  ],
                  'prevState': 'Draft'
                },
                'sort_by': {
                  'createdOn': 'desc'
                },
                'limit': 10000,
                'fields': [
                  'framework',
                  'identifier',
                  'name',
                  'channel',
                  'prevState'
                ]
              }
            },
            'reportPath': 'course-progress-v2/'
          },
          'attempts': 0,
          'jobStats': {
            'dtJobSubmitted': 1599728944037,
            'dt_job_completed': null,
            'execution_time': null
          },
          'downloadUrls': [
            'https://www.google.com', 'https://www.google.com',
          ],
          'expires_at': '2020-08-20'
        },
        {
          'request_id': 'AE3DDC23B3F189ED2A57B567D6434BE7',
          'tag': 'test-tag:in.ekstep',
          'dataset': 'assessment-dashboard-metrics',
          'requested_by': 'client-1',
          'requested_channel': 'in.ekstep',
          'status': 'Processing success',
          'last_updated': 1599728944037,
          'request_data': {
            'batchFilters': [
              'TPD',
              'NCFCOPY'
            ],
            'contentFilters': {
              'request': {
                'filters': {
                  'identifier': [
                    'do_11305960936384921612216',
                    'do_1130934466492252161819'
                  ],
                  'prevState': 'Draft'
                },
                'sort_by': {
                  'createdOn': 'desc'
                },
                'limit': 10000,
                'fields': [
                  'framework',
                  'identifier',
                  'name',
                  'channel',
                  'prevState'
                ]
              }
            },
            'reportPath': 'course-progress-v2/'
          },
          'attempts': 0,
          'jobStats': {
            'dtJobSubmitted': 1599728944037,
            'dt_job_completed': null,
            'execution_time': null
          },
          'downloadUrls': [
            'https://www.google.com',
          ],
          'expires_at': '2020-09-20'
        }
      ]
    }
  },
  reportTypes: [
    {
      "title": "Course progress exhaust",
      "dataset": "progress-exhaust",
      "lang_key": "frmelmnts.lbl.progressExhaustReport",
      "encrypt": "false"
    },
    {
      "title": "User profile exhaust",
      "dataset": "userinfo-exhaust",
      "lang_key": "frmelmnts.lbl.userExhaustReport",
      "encrypt": "true"
    },
    {
      "title": "Question set report",
      "dataset": "response-exhaust",
      "lang_key": "frmelmnts.lbl.qsResponseReport",
      "encrypt": "false"
    }
  ]
};
