
export let mockData = {
    programs: {
        result: [
            {
                "_id": "5f34e44681871d939950bca6",
                "externalId": "TN-Program-1597301830708",
                "name": "TN-Program",
                "description": "TN01-Mantra4Change-APSWREIS School Leader Feedback",
                "role": "PM"
            },
            {
                "_id": "5f34ec17585244939f89f90c",
                "externalId": "MH-Program-1597303831605",
                "name": "MH-Program",
                "description": "MH01-Mantra4Change-APSWREIS School Leader Feedback",
                "role": "PM"
            },
            {
                "_id": "5f75b90454670074deacf087",
                "name": "Skilling Teachers -- Google Project",
                "externalId": "PGM-2948-KEF-RTLBS-INDIVIDUAL_ASSESSMENT",
                "description": "This is a type of individual assessment",
                "role": "PM"
            },
            {
                "_id": "5f7f262e54670074deb99bcb",
                "externalId": "PGM_NIQSA_Self_Assessment-Feb2020",
                "name": "NIQSA Self Assessment",
                "description": "This tool is used to assess schools that are part of NISA on five domains of the NIQSA quality charter.",
                "role": "PM"
            }
        ]
    },
    solutions: {
        result: [
            {
                "_id": "5f34ec17585244939f89f90d",
                "isRubricDriven": false,
                "externalId": "cbd074fa-dd11-11ea-a3bf-000d3af02677-OBSERVATION-TEMPLATE-1597303831612",
                "name": "MH01-Mantra4Change-APSWREIS School Leader Feedback",
                "description": "MH01-Mantra4Change-APSWREIS School Leader Feedback",
                "type": "observation",
                "subType": ""
            },
            {
                "_id": "5fbb75537380505718640436",
                "type": "improvementproject",
                "isRubricDriven": false,
                "subType": "",
                "externalId": "7146aa30-2d67-11eb-b70e-55ade5205c81",
                "name": "Health Awareness Project",
                "description": ""
            },
            {
                "_id": "5fbb75537380505718640437",
                "type": "improvementproject",
                "isRubricDriven": false,
                "subType": "",
                "externalId": "71471f60-2d67-11eb-b70e-55ade5205c81",
                "name": "Safe School Project",
                "description": ""
            },
            {
              "_id": "5fbb75537380505718640438",
              "type": "survey",
              "isRubricDriven": false,
              "subType": "",
              "externalId": "71471f60-2d67-11eb-b70e-55ade5205c82",
              "name": "Safe School survey",
              "description": ""
          }
            
            
        ]
    },
    FormData: {
        "improvementproject": [
            {
                "name": "Task Detail Report",
                "encrypt": true,
                "datasetId": "ml-improvementproject-task-detail-report"
            },
            {
                "name": "Status Report",
                "encrypt": false,
                "datasetId": "ml-improvementproject-status-report"
            }
        ],
        "observation": [
            {
                "name": "Question Report",
                "encrypt": true,
                "datasetId": "ml-observation-question-report"
            },
            {
                "name": "Status Report",
                "encrypt": false,
                "datasetId": "ml-observation-status-report"
            }
        ],
        "observation_with_rubric": [
            {
                "name": "Task Detail Report",
                "encrypt": true,
                "datasetId": "ml-observation_with_rubric-task-detail-report"
            },
            {
                "name": "Status Report",
                "encrypt": false,
                "datasetId": "ml-observation_with_rubric-status-report"
            },
            {
                "name": "Domain Criteria Report",
                "encrypt": false,
                "datasetId": "ml-observation_with_rubric-domain-criteria-report"
            }
        ],
        "assessment": [
            {
                "name": "Task Detail Report",
                "encrypt": true,
                "datasetId": "ml-assessment-task-detail-report"
            },
            {
                "name": "Status Report",
                "encrypt": false,
                "datasetId": "ml-assessment-status-report"
            }
        ]
    },
    userProfile: {
        'userId': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
        'lastName': null,
        'tcStatus': null,
        'maskedPhone': null,
        'rootOrgName': 'CustROOTOrg10',
        'roles': [
            'PUBLIC',
            "PROGRAM_MANAGER"
        ],
        'channel': 'custchannel',
        'updatedDate': null,
        'prevUsedPhone': '',
        'stateValidated': false,
        'isDeleted': false,
        'organisations': [
            {
                'updatedBy': null,
                'organisationId': '01285019302823526477',
                'orgName': 'CustROOTOrg10',
                'addedByName': null,
                'addedBy': null,
                'roles': [
                    'PUBLIC'
                ],
                'approvedBy': null,
                'updatedDate': null,
                'userId': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
                'approvaldate': null,
                'isDeleted': false,
                'parentOrgId': null,
                'hashTagId': '01285019302823526477',
                'isRejected': null,
                'position': null,
                'id': '01302569853059072057',
                'orgjoindate': '2020-05-21 08:49:17:549+0000',
                'isApproved': null,
                'orgLeftDate': null
            }
        ],
        'rootOrg': {
            'dateTime': null,
            'preferredLanguage': 'English',
            'approvedBy': null,
            'channel': 'ROOT_ORG',
            'description': 'Sunbird',
            'updatedDate': '2017-08-24 06:02:10:846+0000',
            'addressId': null,
            'orgType': null,
            'provider': null,
            'orgCode': 'sunbird',
            'theme': null,
            'id': 'ORG_001',
            'communityId': null,
            'isApproved': null,
            'slug': 'sunbird',
            'identifier': 'ORG_001',
            'thumbnail': null,
            'orgName': 'Sunbird',
            'updatedBy': 'user1',
            'externalId': null,
            'isRootOrg': true,
            'rootOrgId': null,
            'approvedDate': null,
            'imgUrl': null,
            'homeUrl': null,
            'isDefault': null,
            'contactDetail':
                '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'}]',
            'createdDate': null,
            'createdBy': null,
            'parentOrgId': null,
            'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'noOfMembers': 1,
            'status': null
        },
        'managedBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
        'provider': null,
        'flagsValue': 0,
        'maskedEmail': null,
        'id': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
        'tempPassword': null,
        'recoveryEmail': '',
        'email': '',
        'identifier': 'b2cb1e94-1a35-48d3-96dc-b7dfde252aa2',
        'thumbnail': null,
        'updatedBy': null,
        'accesscode': null,
        'profileSummary': null,
        'phoneVerified': false,
        'tcUpdatedDate': null,
        'locationIds': [],
        'registryId': null,
        'recoveryPhone': '',
        'userName': '9885632_y6nj',
        'rootOrgId': '01285019302823526477',
        'prevUsedEmail': '',
        'firstName': '9885632',
        'lastLoginTime': null,
        'emailVerified': false,
        'tncAcceptedOn': '2020-05-21T08:49:18.211Z',
        'framework': {},
        'createdDate': '2020-05-21 08:49:14:762+0000',
        'phone': '',
        'createdBy': null,
        'currentLoginTime': null,
        'userType': 'OTHER',
        'tncAcceptedVersion': 'v1',
        'status': 1
    },
    reportListResponse: {
        'ver': '1.0',
        'ts': '2020-09-18T02:56:59.910+00:00',
        'params': {
          'resmsgid': '2823343f-65d8-4061-ad3b-53a9eb943724',
          'status': 'successful',
          'client_key': null
        },
        responseCode: 'OK',
        result: {
          count: 2,
          jobs: [
            {
              'request_id': 'A09115FCBEC94CE6ACEB4D9BBFDBCBCF',
              'tag': 'test-tag:in.ekstep',
              'job_id': 'assessment-dashboard-metrics',
              'requested_by': 'client-2',
              'requested_channel': 'in.ekstep',
              'status': 'SUBMITTED',
              'last_updated': 1599661955303,
              'datasetConfig':{
                "title":"report 1",
                'type': 'assessment-dashboard-metrics'
              },
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
              'datasetConfig':{
                "title":"report 2",
                'type': 'assessment-dashboard-metrics',
              },
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
      }
}