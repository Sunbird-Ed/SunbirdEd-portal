
export let mockData = {
   programs : { 
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
    ]},
    solutions: [
        {
            "_id": "5f34ec17585244939f89f90d",
            "isRubricDriven": false,
            "externalId": "cbd074fa-dd11-11ea-a3bf-000d3af02677-OBSERVATION-TEMPLATE-1597303831612",
            "name": "MH01-Mantra4Change-APSWREIS School Leader Feedback",
            "description": "MH01-Mantra4Change-APSWREIS School Leader Feedback",
            "type": "observation",
            "subType": "school"
        },
        {
            "_id": "5f872d306fbd65239c0830e1",
            "type": "improvementproject",
            "subType": "",
            "externalId": "e03621d0-0e3d-11eb-8ca3-87d258b9a68f",
            "name": "Induction to Energised courses",
            "description": ""
        },
        {
            "_id": "5fbb75537380505718640436",
            "type": "improvementproject",
            "subType": "",
            "externalId": "7146aa30-2d67-11eb-b70e-55ade5205c81",
            "name": "Health Awareness Project",
            "description": ""
        },
        {
            "_id": "5fbb75537380505718640437",
            "type": "improvementproject",
            "subType": "",
            "externalId": "71471f60-2d67-11eb-b70e-55ade5205c81",
            "name": "Safe School Project",
            "description": ""
        }
    ],
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
          'PUBLIC'
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
      }
}