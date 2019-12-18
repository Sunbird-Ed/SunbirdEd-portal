export const addParticipentResponseSample = {
    id: "api.add.participants",
    params: {
      msgid: "566581f8-b513-4ac8-9fb0-06dd4affff69",
      resmsgid: "fe02bad9-4a63-4fd9-b25e-128d71da0f15",
      status: "successful"
    },
    responseCode: "OK",
    result: {
      created: "OK",
      programId: "6835f250-1fe1-11ea-93ea-2dffbaedca40"
    },
    ts: "2019-12-17T10:10:16.555Z",
    ver: "1.0"
  }

  export const programSession =  {
    'programId': '217bddc0-df59-11e9-8d82-2b7f2cdfa2fd',
    'description': 'Test Prep program',
    'name': 'Test Prep',
    'creator': 'Rayulu',
    'startDate': '2019-09-25T12:50:30.000Z',
    'endDate': null,
    'status': null,
    'roles': [
      {
        'id': 1,
        'name': 'CONTRIBUTOR',
        'default': true,
        'defaultTab': 1,
        'tabs': [1, 2]
      },
      {
        'id': 2,
        'name': 'REVIEWER',
        'defaultTab': 1,
        'tabs': [2]
      },
      {
        'id': 3,
        'name': 'PUBLISHER',
        'defaultTab': 3,
        'tabs': [1, 3]
      },
      {
        'id': 4,
        'name': 'CERT_ISSUER',
        'defaultTab': 1,
        'tabs': [4]
      }
    ],
    'data': {},
    'config': {
      '_comments': 'These fields are common for any program. Based on program these fields can be removed. Has to define list of mandatory fields & options fields',
      'slug': 'https://api.sunbird.org/',
      'loginReqired': true
    },
    'header': {
      'id': 'ng.sunbird.header',
      'ver': '1.0',
      'compId': 'headerComp',
      'author': 'Venkat',
      'description': '',
      'publishedDate': '',
      'data': '{ }',
      'config': {
        'tabs': [
          {
            'index': 1,
            'label': 'Contribute Questions',
            'onClick': 'collectionComponent'
          },
          {
            'index': 2,
            'label': 'Review',
            'onClick': 'collectionComponent'
          },
          {
            'index': 3,
            'label': 'Dashboard',
            'onClick': 'dashboardComponent'
          }
        ]
      }
    },
    'components': [
      {
        'id': 'ng.sunbird.collection',
        'ver': '1.0',
        'compId': 'collectionComponent',
        'author': 'Venkat',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {
          'filters': {
            'implicit': [
              {
                'code': 'framework',
                'defaultValue': 'NCFCOPY',
                'label': 'Framework',
                'visibility': false
              },
              {
                'code': 'board',
                'defaultValue': 'NCERT',
                'label': 'Board',
                'visibility': false
              },
              {
                'code': 'medium',
                'defaultValue': 'English',
                'label': 'Medium',
                'visibility': false
              }
            ],
            'explicit': [
              {
                'code': 'class',
                'range': [
                  'Class 6',
                  'Class 7',
                  'Class 8'
                ],
                'label': 'Class',
                'multiselect': false,
                'defaultValue': [
                  'Class 6'
                ],
                'visibility': true
              },
              {
                'code': 'subject',
                'range': [
                  'English',
                  'Maths'
                ],
                'label': 'Subject',
                'multiselect': false,
                'defaultValue': [
                  'English'
                ],
                'visibility': true
              }
            ]
          },
          'groupBy': {
            'value': 'Subject',
            'defaultValue': 'Class'
          },
          'collectionType': 'Textbook',
          'collectionList': [],
          'status': ['Draft', 'Live']
        }
      },
      {
        'id': 'ng.sunbird.chapterList',
        'ver': '1.0',
        'compId': 'chapterListComponent',
        'author': 'Kartheek',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {
          'contentTypes': {
            'value': [
              {
                'name': 'Explanation',
                'contentType': 'ExplanationResource',
                'mimeType': [
                  'application/pdf'
                ],
                'thumbnail': '',
                'description': 'description',
                'marks': 5,
                'resourceType': '',
                'Audience': '',
                'formConfiguration': [
                  {
                    'code': 'LearningOutcome',
                    'range': [],
                    'label': 'Learning Outcome',
                    'multiselect': true
                  },
                  {
                    'code': 'bloomslevel',
                    'range': [],
                    'label': 'Learning Level',
                    'multiselect': true
                  }
                ],
                'filesConfig': {
                  'accepted': 'pdf',
                  'size': '50'
                }
              },
              {
                'name': 'Experimental',
                'contentType': 'ExperientialResource',
                'mimeType': [
                  'video/mp4',
                  'video/webm',
                  'video/x-youtube'
                ],
                'thumbnail': '',
                'description': 'description',
                'marks': 5,
                'resourceType': '',
                'Audience': '',
                'formConfiguration': [
                  {
                    'code': 'LearningOutcome',
                    'range': [],
                    'label': 'Learning Outcome',
                    'multiselect': true
                  },
                  {
                    'code': 'bloomslevel',
                    'range': [],
                    'label': 'Learning Level',
                    'multiselect': true
                  }
                ],
                'filesConfig': {
                  'accepted': 'mp4, webm, youtube',
                  'size': '50'
                }
              },
              {
                'name': 'Practice Sets',
                'contentType': 'PracticeQuestionSet',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'questionCategories': [
                  'vsa',
                  'sa',
                  'la',
                  'mcq'
                ],
                'thumbnail': '',
                'description': 'description',
                'marks': 5,
                'resourceType': '',
                'Audience': '',
                'formConfiguration': [
                  {
                    'code': 'LearningOutcome',
                    'range': [],
                    'label': 'Learning Outcome',
                    'multiselect': true
                  },
                  {
                    'code': 'bloomslevel',
                    'range': [],
                    'label': 'Learning Level',
                    'multiselect': true
                  }
                ]
              },
              {
                'name': 'Curiosity',
                'contentType': 'CuriosityQuestionSet',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'questionCategories': [
                  'curiosity'
                ],
                'thumbnail': '',
                'description': 'description',
                'marks': 5,
                'resourceType': '',
                'Audience': '',
                'formConfiguration': [
                  {
                    'code': 'LearningOutcome',
                    'range': [],
                    'label': 'Learning Outcome',
                    'multiselect': true
                  },
                  {
                    'code': 'bloomslevel',
                    'range': [],
                    'label': 'Learning Level',
                    'multiselect': true
                  }
                ]
              }
            ],
            'defaultValue': [
              {
                'name': 'Practice Sets',
                'contentType': 'PracticeQuestionSet',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'questionCategories': [
                  'vsa',
                  'sa',
                  'la',
                  'mcq'
                ],
                'thumbnail': '',
                'description': 'description',
                'marks': 2,
                'resourceType': '',
                'Audience': '',
                'formConfiguration': [
                  {
                    'code': 'LearningOutcome',
                    'range': [],
                    'label': 'Learning Outcome',
                    'multiselect': false
                  },
                  {
                    'code': 'bloomslevel',
                    'range': [],
                    'label': 'Learning Level',
                    'multiselect': true
                  }
                ]
              }
            ]
          }
        }
      },
      {
        'id': 'ng.sunbird.uploadComponent',
        'ver': '1.0',
        'compId': 'uploadContentComponent',
        'author': 'Kartheek',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {
          'filesConfig': {
            'accepted': 'pdf, mp4, webm, youtube',
            'size': '50'
          },
          'formConfiguration': [
            {
              'code': 'LearningOutcome',
              'range': [],
              'label': 'Learning Outcome',
              'multiselect': false
            },
            {
              'code': 'bloomslevel',
              'range': [],
              'label': 'Learning Level',
              'multiselect': true
            }
          ]
        }
      },
      {
        'id': 'ng.sunbird.practiceSetComponent',
        'ver': '1.0',
        'compId': 'practiceSetComponent',
        'author': 'Kartheek',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {
          'No of options': 4,
          'solutionType': [
            'Video',
            'Text & image'
          ],
          'questionCategory': [
            'vsa',
            'sa',
            'ls',
            'mcq',
            'curiosity'
          ],
          'formConfiguration': [
            {
              'code': 'LearningOutcome',
              'range': [],
              'label': 'Learning Outcome',
              'multiselect': false
            },
            {
              'code': 'bloomslevel',
              'range': [],
              'label': 'Learning Level',
              'multiselect': true
            }
          ]
        }
      },
      {
        'id': 'ng.sunbird.dashboard',
        'ver': '1.0',
        'compId': 'dashboardComp',
        'author': 'Venkanna Gouda',
        'description': '',
        'publishedDate': '',
        'data': {},
        'config': {}
      }
    ],
    'actions': {
      'showTotalContribution': {
        'roles': [
          1,
          2
        ]
      },
      'showMyContribution': {
        'roles': [
          1
        ]
      },
      'showRejected': {
        'roles': [
          1
        ]
      },
      'showUnderReview': {
        'roles': [
          1
        ]
      },
      'showTotalUnderReview': {
        'roles': [
          2
        ]
      },
      'showAcceptedByMe': {
        'roles': [
          2
        ]
      },
      'showRejectedByMe': {
        'roles': [
          2
        ]
      },
      'showFilters': {
        'roles': [
          1,
          2,
          3
        ]
      },
      'addresource': {
        'roles': [
          1
        ]
      },
      'showDashboard': {
        'roles': [
          3
        ]
      },
      'showCert': {
        'roles': [
          4
        ]
      }
    },
    'onBoardingForm': {
      'templateName': 'onBoardingForm',
      'action': 'onboard',
      'fields': [
        {
          'code': 'school',
          'dataType': 'text',
          'name': 'School',
          'label': 'School',
          'description': 'School',
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'range': [
            {
              'identifier': 'my_school',
              'code': 'my_school',
              'name': 'My School',
              'description': 'My School',
              'index': 1,
              'category': 'school',
              'status': 'Live'
            }
          ],
          'index': 1
        }
      ]
    }
  };

  export const userDetails =   { userDetails: {
    enrolledOn: "2019-12-18T09:08:33.114Z",
    onBoarded: true,
    onBoardingData: {
      "class": "Class 1"
    },
    programId: "6835f250-1fe1-11ea-93ea-2dffbaedca40",
    roles: [
      "CONTRIBUTOR"
    ],
    "userId": "874ed8a5-782e-4f6c-8f36-e0288455901e"
  }}

  // without user details
  export const programDetailsWithOutUserDetails = {
    "config": {
      "onBoardForm": {
        "action": "onboard",
        "fields": [
          {
            "code": "class",
            "dataType": "text",
            "description": "Class",
            "displayProperty": "Editable",
            "index": 1,
            "inputType": "select",
            "label": "Class",
            "name": "Class",
            "range": [
              {
                "category": "class",
                "code": "class1",
                "description": "Class 1",
                "identifier": "Class 1",
                "index": 1,
                "name": "Class 1",
                "status": "Live"
              },
              {
                "category": "class",
                "code": "class2",
                "description": "Class 2",
                "identifier": "Class 2",
                "index": 2,
                "name": "Class 2",
                "status": "Live"
              },
              {
                "category": "class",
                "code": "class3",
                "description": "Class 3",
                "identifier": "Class 3",
                "index": 3,
                "name": "Class 3",
                "status": "Live"
              }
            ],
            "required": false,
            "visible": true
          }
        ],
        "templateName": "onBoardingForm"
      },
      "roles": [
        {
          "role": "CONTRIBUTOR"
        },
        {
          "role": "REVIEWER"
        }
      ],
      "scope": {
        "board": [
          "NCERT"
        ],
        "channel": "b00bc992ef25f1a9a8d63291e20efc8d",
        "framework": "NCFCOPY",
        "gradeLevel": [
          "Kindergarten",
          "Grade 1",
          "Grade 2",
          "Grade 3",
          "Grade 4"
        ],
        "medium": [
          "English"
        ],
        "subject": [
          "Hindi",
          "Mathematics",
          "English",
          "Telugu"
        ],
        "topics": [
          "Addition"
        ]
      }
    },
    "defaultRoles": [
      "CONTRIBUTOR"
    ],
    "description": "hello program",
    "endDate": null,
    "name": "CBSE",
    "programId": "6835f250-1fe1-11ea-93ea-2dffbaedca40",
    "slug": "sunbird",
    "startDate": "2019-02-03T07:20:30.000Z",
    "status": null,
    "type": "private"
  }

  export const programDetailsWithUserDetails = {
    "config": {
      "onBoardForm": {
        "action": "onboard",
        "fields": [
          {
            "code": "class",
            "dataType": "text",
            "description": "Class",
            "displayProperty": "Editable",
            "index": 1,
            "inputType": "select",
            "label": "Class",
            "name": "Class",
            "range": [
              {
                "category": "class",
                "code": "class1",
                "description": "Class 1",
                "identifier": "Class 1",
                "index": 1,
                "name": "Class 1",
                "status": "Live"
              },
              {
                "category": "class",
                "code": "class2",
                "description": "Class 2",
                "identifier": "Class 2",
                "index": 2,
                "name": "Class 2",
                "status": "Live"
              },
              {
                "category": "class",
                "code": "class3",
                "description": "Class 3",
                "identifier": "Class 3",
                "index": 3,
                "name": "Class 3",
                "status": "Live"
              }
            ],
            "required": false,
            "visible": true
          }
        ],
        "templateName": "onBoardingForm"
      },
      "roles": [
        {
          "role": "CONTRIBUTOR"
        },
        {
          "role": "REVIEWER"
        }
      ],
      "scope": {
        "board": [
          "NCERT"
        ],
        "channel": "b00bc992ef25f1a9a8d63291e20efc8d",
        "framework": "NCFCOPY",
        "gradeLevel": [
          "Kindergarten",
          "Grade 1",
          "Grade 2",
          "Grade 3",
          "Grade 4"
        ],
        "medium": [
          "English"
        ],
        "subject": [
          "Hindi",
          "Mathematics",
          "English",
          "Telugu"
        ],
        "topics": [
          "Addition"
        ]
      }
    },
    "defaultRoles": [
      "CONTRIBUTOR"
    ],
    "description": "hello program",
    "endDate": null,
    "name": "CBSE",
    "programId": "6835f250-1fe1-11ea-93ea-2dffbaedca40",
    "slug": "sunbird",
    "startDate": "2019-02-03T07:20:30.000Z",
    "status": null,
    "type": "private",
    "userDetails": {
      "enrolledOn": "2019-12-18T09:08:33.114Z",
      "onBoarded": true,
      "onBoardingData": {
        "class": "Class 1"
      },
      "programId": "6835f250-1fe1-11ea-93ea-2dffbaedca40",
      "roles": [
        "CONTRIBUTOR"
      ],
      "userId": "874ed8a5-782e-4f6c-8f36-e0288455901e"
    }
  }