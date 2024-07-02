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
  reportListResult1:{
    "id": "ekstep.analytics.dataset.request.list",
    "ver": "1.0",
    "ts": "2023-04-13T07:05:03.365+00:00",
    "params": {
        "resmsgid": "716b2dcd-1abc-443d-ab86-cacb4d1af095",
        "status": "successful",
        "client_key": null
    },
    "responseCode": "OK",
    "result": {
        "count": 1,
        "jobs": [
            {
                "requestId": "41F2DA441C1A6CF50312EF165E424403",
                "tag": "aa29867d8be67713aee439184f663887:01269934121990553633",
                "dataset": "druid-dataset",
                "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
                "requestedChannel": "01269934121990553633",
                "status": "SUBMITTED",
                "lastUpdated": 1681367278218,
                "datasetConfig": {
                    "type": "ml-project-status-exhaust",
                    "params": {
                        "filters": [
                            {
                                "type": "in",
                                "dimension": "status_of_project",
                                "values": [
                                    "started",
                                    "submitted",
                                    "inProgress"
                                ]
                            },
                            {
                                "type": "equals",
                                "dimension": "private_program",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "sub_task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "project_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "program_id",
                                "value": "62034f90841a270008e82e46"
                            },
                            {
                                "type": "equals",
                                "dimension": "solution_id",
                                "value": "620351e0841a270008e82e9e"
                            },
                            {
                                "type": "equals",
                                "dimension": "district_externalId",
                                "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                            }
                        ]
                    },
                    "title": "Status Report"
                },
                "attempts": 0,
                "jobStats": {
                    "dtJobSubmitted": 1681367278218,
                    "dtJobCompleted": null,
                    "executionTime": null
                },
                "downloadUrls": [],
                "expiresAt": 1681371303365,
                "statusMessage": null,
                "title": "Status Report"
            }
        ]
    }
},
  reportListResult2:{
    "id": "ekstep.analytics.dataset.request.list",
    "ver": "1.0",
    "ts": "2023-04-13T07:05:03.421+00:00",
    "params": {
        "resmsgid": "5fc69ba0-fef3-40cd-a505-e1ad366cb3d3",
        "status": "successful",
        "client_key": null
    },
    "responseCode": "OK",
    "result": {
        "count": 2,
        "jobs": [
            {
                "requestId": "EFE2170ECF8C5BC15380B793DD1C2AEA",
                "tag": "620351e0841a270008e82e9e_7b351af1-bb36-4363-bdb9-b7bb7758cae6_kadapa:01269934121990553633",
                "dataset": "druid-dataset",
                "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
                "requestedChannel": "01269934121990553633",
                "status": "FAILED",
                "lastUpdated": 1668581928363,
                "datasetConfig": {
                    "type": "ml-filtered-task-detail-exhaust",
                    "params": {
                        "filters": [
                            {
                                "type": "equals",
                                "dimension": "private_program",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "sub_task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "project_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "program_id",
                                "value": "62034f90841a270008e82e46"
                            },
                            {
                                "type": "equals",
                                "dimension": "solution_id",
                                "value": "620351e0841a270008e82e9e"
                            },
                            {
                                "type": "equals",
                                "dimension": "district_externalId",
                                "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                            },
                            {
                                "type": "greaterthan",
                                "dimension": "task_count",
                                "value": 4
                            },
                            {
                                "type": "greaterthan",
                                "dimension": "task_evidence_count",
                                "value": 1
                            },
                            {
                                "type": "greaterthan",
                                "dimension": "project_evidence_count",
                                "value": 0
                            }
                        ]
                    },
                    "title": "Filtered task detail report"
                },
                "attempts": 3,
                "jobStats": {
                    "dtJobSubmitted": 1668416375628,
                    "dtJobCompleted": 1668581928363,
                    "executionTime": 0
                },
                "downloadUrls": [],
                "expiresAt": 1681371303420,
                "statusMessage": "No data present",
                "title": "Filtered task detail report"
            },
            {
                "requestId": "4FBA324F313FFEF101A0A8D2B5F263F3",
                "tag": "620351e0841a270008e82e9e_7b351af1-bb36-4363-bdb9-b7bb7758cae6_kadapa:01269934121990553633",
                "dataset": "druid-dataset",
                "requestedBy": "7b351af1-bb36-4363-bdb9-b7bb7758cae6",
                "requestedChannel": "01269934121990553633",
                "status": "SUCCESS",
                "lastUpdated": 1668507341471,
                "datasetConfig": {
                    "type": "ml-project-status-exhaust",
                    "params": {
                        "filters": [
                            {
                                "type": "equals",
                                "dimension": "private_program",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "sub_task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "task_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "project_deleted_flag",
                                "value": "false"
                            },
                            {
                                "type": "equals",
                                "dimension": "program_id",
                                "value": "62034f90841a270008e82e46"
                            },
                            {
                                "type": "equals",
                                "dimension": "solution_id",
                                "value": "620351e0841a270008e82e9e"
                            },
                            {
                                "type": "equals",
                                "dimension": "district_externalId",
                                "value": "732b83e7-cf4f-401c-a374-db1d45644b3b"
                            }
                        ]
                    },
                    "title": "Status Report"
                },
                "attempts": 0,
                "jobStats": {
                    "dtJobSubmitted": 1668416346526,
                    "dtJobCompleted": 1668507341471,
                    "executionTime": 4890
                },
                "downloadUrls": [
                    "https://sunbirdstagingprivate.blob.core.windows.net/reports/ml_reports/ml-project-status-exhaust/4FBA324F313FFEF101A0A8D2B5F263F3_20221115.zip?sv=2017-04-17&se=2023-04-13T07%3A35%3A03Z&sr=b&sp=r&sig=uBDPfQy0LmcKZkpGVq0rK6BAtYLXXp%2BrScSZPL/0WXQ%3D"
                ],
                "expiresAt": 1681371303420,
                "statusMessage": "",
                "title": "Status Report"
            }
        ],
        "downloadUrls": [
          "https://sunbirdstagingprivate.blob.core.windows.net/reports/ml_reports/ml-project-status-exhaust/4FBA324F313FFEF101A0A8D2B5F263F3_20221115.zip?sv=2017-04-17&se=2023-04-13T07%3A35%3A03Z&sr=b&sp=r&sig=uBDPfQy0LmcKZkpGVq0rK6BAtYLXXp%2BrScSZPL/0WXQ%3D"
      ],
    }
},
  batchDetails:{
    "identifier": "01355879219098419215",
    "createdFor": [
      "01264500484714496098"
    ],
    "endDate": null,
    "description": "",
    "updatedDate": null,
    "batchId": "01355879219098419215",
    "cert_templates": null,
    "createdDate": "2022-06-13 18:30:34:970+0530",
    "createdBy": "c511c2b2-c0c5-4004-9e9d-875a514c34e8",
    "mentors": [
      
    ],
    "name": "Matter - Test Batch",
    "id": "01355879219098419215",
    "enrollmentType": "open",
    "courseId": "do_31349157970036326411459",
    "enrollmentEndDate": null,
    "collectionId": "do_31349157970036326411459",
    "startDate": "2022-06-13",
    "status": 1
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
    'title': ' Course progress exhaust',
    'dataset': 'progress-exhaust',
    'lang_key': 'frmelmnts.lbl.progressExhaustReport',
    'encrypt': 'false'
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
      'title': 'Course progress exhaust',
      'dataset': 'progress-exhaust',
      'lang_key': 'frmelmnts.lbl.progressExhaustReport',
      'encrypt': 'false'
    },
    {
      'title': 'User profile exhaust',
      'dataset': 'userinfo-exhaust',
      'lang_key': 'frmelmnts.lbl.userExhaustReport',
      'encrypt': 'true'
    },
    {
      'title': 'Question set report',
      'dataset': 'response-exhaust',
      'lang_key': 'frmelmnts.lbl.qsResponseReport',
      'encrypt': 'false'
    }
  ]
};
