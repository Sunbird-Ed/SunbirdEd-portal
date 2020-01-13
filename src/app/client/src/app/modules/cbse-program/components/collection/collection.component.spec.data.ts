export const collectionComponentInput = {
  'config': {
    'author': 'Venkat',
    'compId': 'collectionComponent',
    'config': {
      'collectionList': [],
      'collectionType': 'Textbook',
      'filters': {
        'explicit': [
          {
            'code': 'gradeLevel',
            'defaultValue': [
              'Kindergarten'
            ],
            'label': 'Class',
            'multiselect': false,
            'range': [
              'Kindergarten',
              'Grade 1',
              'Grade 2',
              'Grade 3'
            ],
            'visibility': true
          },
          {
            'code': 'subject',
            'defaultValue': [
              'English'
            ],
            'label': 'Subject',
            'multiselect': false,
            'range': [
              'English',
              'Mathematics',
              'Hindi'
            ],
            'visibility': true
          }
        ],
        'implicit': [
          {
            'code': 'framework',
            'defaultValue': 'NCFCOPY',
            'label': 'Framework'
          },
          {
            'code': 'board',
            'defaultValue': 'NCERT',
            'label': 'Board'
          },
          {
            'code': 'medium',
            'defaultValue': [
              'English'
            ],
            'label': 'Medium'
          }
        ]
      },
      'groupBy': {
        'defaultValue': 'subject',
        'value': 'subject'
      },
      'status': [
        'Draft',
        'Live'
      ]
    },
    'data': {},
    'description': '',
    'id': 'ng.sunbird.collection',
    'publishedDate': '',
    'ver': '1.0'
  },
  'programContext': {
    'config': {
      '_comments': '',
      'actions': {
        'showAcceptedByMe': {
          'roles': [
            2
          ]
        },
        'showAddResource': {
          'roles': [
            1
          ]
        },
        'showCert': {
          'roles': [
            4
          ]
        },
        'showChangeFile': {
          'roles': [
            1
          ]
        },
        'showCreatorView': {
          'roles': [
            1
          ]
        },
        'showDashboard': {
          'roles': [
            3
          ]
        },
        'showDeleteResource': {
          'roles': [
            1
          ]
        },
        'showEdit': {
          'roles': [
            1
          ]
        },
        'showEditResource': {
          'roles': [
            1
          ]
        },
        'showFilters': {
          'roles': [
            1,
            2,
            3
          ]
        },
        'showMoveResource': {
          'roles': [
            1
          ]
        },
        'showMyContribution': {
          'roles': [
            1
          ]
        },
        'showPreviewResource': {
          'roles': [
            2
          ]
        },
        'showPublish': {
          'roles': [
            2
          ]
        },
        'showRejected': {
          'roles': [
            1
          ]
        },
        'showRejectedByMe': {
          'roles': [
            2
          ]
        },
        'showRequestChanges': {
          'roles': [
            2
          ]
        },
        'showReviewerView': {
          'roles': [
            2
          ]
        },
        'showSave': {
          'roles': [
            1
          ]
        },
        'showSubmit': {
          'roles': [
            1
          ]
        },
        'showTotalContribution': {
          'roles': [
            1,
            2
          ]
        },
        'showTotalUnderReview': {
          'roles': [
            2
          ]
        },
        'showUnderReview': {
          'roles': [
            1
          ]
        }
      },
      'components': [
        {
          'author': 'Venkat',
          'compId': 'collectionComponent',
          'config': {
            'collectionList': [],
            'collectionType': 'Textbook',
            'filters': {
              'explicit': [
                {
                  'code': 'gradeLevel',
                  'defaultValue': [
                    'Kindergarten'
                  ],
                  'label': 'Class',
                  'multiselect': false,
                  'range': [
                    'Kindergarten',
                    'Grade 1',
                    'Grade 2',
                    'Grade 3'
                  ],
                  'visibility': true
                },
                {
                  'code': 'subject',
                  'defaultValue': [
                    'English'
                  ],
                  'label': 'Subject',
                  'multiselect': false,
                  'range': [
                    'English',
                    'Mathematics',
                    'Hindi'
                  ],
                  'visibility': true
                }
              ],
              'implicit': [
                {
                  'code': 'framework',
                  'defaultValue': 'NCFCOPY',
                  'label': 'Framework'
                },
                {
                  'code': 'board',
                  'defaultValue': 'NCERT',
                  'label': 'Board'
                },
                {
                  'code': 'medium',
                  'defaultValue': [
                    'English'
                  ],
                  'label': 'Medium'
                }
              ]
            },
            'groupBy': {
              'defaultValue': 'subject',
              'value': 'subject'
            },
            'status': [
              'Draft',
              'Live'
            ]
          },
          'data': {},
          'description': '',
          'id': 'ng.sunbird.collection',
          'publishedDate': '',
          'ver': '1.0'
        },
        {
          'author': 'Kartheek',
          'compId': 'chapterListComponent',
          'config': {
            'contentTypes': {
              'defaultValue': [
                {
                  'id': 'vsaPracticeQuestionContent',
                  'label': 'Practice Sets',
                  'metadata': {
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'marks': 5,
                    'name': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'onClick': 'questionSetComponent',
                  'questionCategories': [
                    'vsa'
                  ]
                }
              ],
              'value': [
                {
                  'filesConfig': {
                    'accepted': 'pdf',
                    'size': '50'
                  },
                  'id': 'explanationContent',
                  'label': 'Explanation',
                  'metadata': {
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'ExplanationResource',
                    'description': 'ExplanationResource',
                    'marks': 5,
                    'name': 'Explanation Resource',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf'
                  ],
                  'onClick': 'uploadComponent'
                },
                {
                  'filesConfig': {
                    'accepted': 'mp4',
                    'size': '50'
                  },
                  'id': 'experientialContent',
                  'label': 'Experiential',
                  'metadata': {
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'ExperientialResource',
                    'description': 'ExperientialResource',
                    'marks': 5,
                    'name': 'Experiential Resource',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'video/mp4'
                  ],
                  'onClick': 'uploadComponent'
                },
                {
                  'filesConfig': {
                    'accepted': 'pdf',
                    'size': '50'
                  },
                  'id': 'focusSpotContent',
                  'label': 'FocusSpot',
                  'metadata': {
                    // tslint:disable-next-line:max-line-length
                    'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'FocusSpot',
                    'description': 'FocusSpot',
                    'marks': 5,
                    'name': 'FocusSpot Resoirce',
                    'resourceType': 'Read'
                  },
                  'mimeType': [
                    'application/pdf'
                  ],
                  'onClick': 'uploadComponent'
                },
                {
                  'id': 'vsaPracticeQuestionContent',
                  'label': 'VSA - Practice Sets',
                  'metadata': {
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'marks': 5,
                    'name': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'onClick': 'questionSetComponent',
                  'questionCategories': [
                    'vsa'
                  ]
                },
                {
                  'id': 'saPracticeQuestionContent',
                  'label': 'SA - Practice Sets',
                  'metadata': {
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'marks': 5,
                    'name': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'onClick': 'questionSetComponent',
                  'questionCategories': [
                    'sa'
                  ]
                },
                {
                  'id': 'laPracticeQuestionContent',
                  'label': 'LA - Practice Sets',
                  'metadata': {
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'marks': 5,
                    'name': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'onClick': 'questionSetComponent',
                  'questionCategories': [
                    'la'
                  ]
                },
                {
                  'id': 'mcqPracticeQuestionContent',
                  'label': 'MCQ - Practice Sets',
                  'metadata': {
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'PracticeQuestionSet',
                    'description': 'Practice QuestionSet',
                    'marks': 5,
                    'name': 'Practice QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'onClick': 'questionSetComponent',
                  'questionCategories': [
                    'mcq'
                  ]
                },
                {
                  'id': 'curiositySetContent',
                  'label': 'Curiosity Sets',
                  'metadata': {
                    'appIcon': '',
                    'audience': [
                      'Learner'
                    ],
                    'contentType': 'CuriosityQuestionSet',
                    'description': 'Curiosity QuestionSet',
                    'marks': 5,
                    'name': 'Curiosity QuestionSet',
                    'resourceType': 'Learn'
                  },
                  'mimeType': [
                    'application/vnd.ekstep.ecml-archive'
                  ],
                  'onClick': 'curiositySetComponent',
                  'questionCategories': [
                    'Curiosity'
                  ]
                }
              ]
            }
          },
          'data': {},
          'description': '',
          'id': 'ng.sunbird.chapterList',
          'publishedDate': '',
          'ver': '1.0'
        },
        {
          'author': 'Kartheek',
          'compId': 'uploadContentComponent',
          'config': {
            'filesConfig': {
              'accepted': 'pdf, mp4, webm, youtube',
              'size': '50'
            },
            'formConfiguration': [
              {
                'code': 'learningOutcome',
                'dataType': 'list',
                'description': 'Learning Outcomes For The Content',
                'editable': true,
                'inputType': 'multiselect',
                'label': 'Learning Outcome',
                'name': 'LearningOutcome',
                'placeholder': 'Select Learning Outcomes',
                'required': false,
                'visible': true
              },
              {
                'code': 'bloomslevel',
                'dataType': 'list',
                'defaultValue': [
                  'remember',
                  'understand',
                  'apply',
                  'analyse',
                  'evaluate',
                  'create'
                ],
                'description': 'Learning Level For The Content',
                'editable': true,
                'inputType': 'select',
                'label': 'Learning Level',
                'name': 'LearningLevel',
                'placeholder': 'Select Learning Levels',
                'required': true,
                'visible': true
              },
              {
                'code': 'creator',
                'dataType': 'text',
                'description': 'Enter The Author Name',
                'editable': true,
                'inputType': 'text',
                'label': 'Author',
                'name': 'Author',
                'placeholder': 'Enter Author Name',
                'required': true,
                'visible': true
              },
              {
                'code': 'license',
                'dataType': 'list',
                'description': 'License For The Content',
                'editable': true,
                'inputType': 'select',
                'label': 'License',
                'name': 'License',
                'placeholder': 'Select License',
                'required': true,
                'visible': true
              }
            ]
          },
          'data': {},
          'description': '',
          'id': 'ng.sunbird.uploadComponent',
          'publishedDate': '',
          'ver': '1.0'
        },
        {
          'author': 'Kartheek',
          'compId': 'practiceSetComponent',
          'config': {
            'No of options': 4,
            'formConfiguration': [
              {
                'code': 'LearningOutcome',
                'label': 'Learning Outcome',
                'multiselect': false,
                'range': []
              },
              {
                'code': 'bloomslevel',
                'label': 'Learning Level',
                'multiselect': true,
                'range': []
              }
            ],
            'questionCategory': [
              'vsa',
              'sa',
              'ls',
              'mcq',
              'curiosity'
            ],
            'solutionType': [
              'Video',
              'Text & image'
            ]
          },
          'data': {},
          'description': '',
          'id': 'ng.sunbird.practiceSetComponent',
          'publishedDate': '',
          'ver': '1.0'
        },
        {
          'author': 'Venkanna Gouda',
          'compId': 'dashboardComp',
          'config': {},
          'data': {},
          'description': '',
          'id': 'ng.sunbird.dashboard',
          'publishedDate': '',
          'ver': '1.0'
        }
      ],
      'framework': 'NCFCOPY',
      'header': {
        'author': 'Venkat',
        'compId': 'headerComp',
        'config': {
          'tabs': [
            {
              'index': 1,
              'label': 'Contribute',
              'onClick': 'collectionComponent',
              'visibility': true
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
        },
        'data': {},
        'description': '',
        'id': 'ng.sunbird.header',
        'publishedDate': '',
        'ver': '1.0'
      },
      'loginReqired': true,
      'onBoardingForm': {
        'action': 'onboard',
        'fields': [
          {
            'code': 'school',
            'dataType': 'text',
            'description': 'School',
            'displayProperty': 'Editable',
            'index': 1,
            'inputType': 'select',
            'label': 'School',
            'name': 'School',
            'range': [
              {
                'category': 'school',
                'code': 'my_school',
                'description': 'My School',
                'identifier': 'my_school',
                'index': 1,
                'name': 'My School',
                'status': 'Live'
              }
            ],
            'required': false,
            'visible': true
          }
        ],
        'templateName': 'onBoardingForm'
      },
      'roles': [
        {
          'default': true,
          'defaultTab': 1,
          'id': 1,
          'name': 'CONTRIBUTOR',
          'tabs': [
            1
          ]
        },
        {
          'defaultTab': 2,
          'id': 2,
          'name': 'REVIEWER',
          'tabs': [
            2
          ]
        }
      ],
      'sharedContext': [
        'channel',
        'framework',
        'board',
        'medium',
        'gradeLevel',
        'subject',
        'topic'
      ]
    },
    'defaultRoles': [
      'CONTRIBUTOR'
    ],
    'description': 'CBSE program',
    'endDate': null,
    'imagePath': null,
    'name': 'Filter Check Program',
    'programId': '18cc8a70-2889-11ea-9bc0-fd6cea67ce9f',
    'rootOrgId': 'ORG_001',
    'rootOrgName': 'testRootorg',
    'slug': 'sunbird',
    'startDate': '2019-12-20T07:20:30.000Z',
    'status': null,
    'type': 'private',
    'userDetails': {
      'enrolledOn': '2019-12-27T09:13:33.742Z',
      'onBoarded': true,
      'onBoardingData': {
        'school': 'My School'
      },
      'programId': '18cc8a70-2889-11ea-9bc0-fd6cea67ce9f',
      'roles': [
        'CONTRIBUTOR'
      ],
      'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
    }
  },
  'sessionContext': {
    'framework': 'NCFCOPY',
    'frameworkData': [
      {
        'code': 'board',
        'description': '',
        'identifier': 'ncfcopy_board',
        'index': 1,
        'name': 'Curriculum',
        'status': 'Live',
        'terms': [
          {
            'associations': [
              {
                'category': 'gradeLevel',
                'code': 'kindergarten',
                'description': '',
                'identifier': 'ncfcopy_gradelevel_kindergarten',
                'name': 'Kindergarten',
                'status': 'Live',
                'translations': '{\'hi\':\'बाल विहार\'}'
              },
              {
                'category': 'gradeLevel',
                'code': 'grade5',
                'description': '',
                'identifier': 'ncfcopy_gradelevel_grade5',
                'name': 'Grade 5',
                'status': 'Live',
                'translations': null
              },
              {
                'category': 'gradeLevel',
                'code': 'grade1',
                'description': '',
                'identifier': 'ncfcopy_gradelevel_grade1',
                'name': 'Grade 1',
                'status': 'Live',
                'translations': null
              },
              {
                'category': 'gradeLevel',
                'code': 'grade2',
                'description': '',
                'identifier': 'ncfcopy_gradelevel_grade2',
                'name': 'Grade 2',
                'status': 'Live',
                'translations': null
              },
              {
                'category': 'gradeLevel',
                'code': 'grade4',
                'description': '',
                'identifier': 'ncfcopy_gradelevel_grade4',
                'name': 'Grade 4',
                'status': 'Live',
                'translations': null
              },
              {
                'category': 'gradeLevel',
                'code': 'grade3',
                'description': '',
                'identifier': 'ncfcopy_gradelevel_grade3',
                'name': 'Grade 3',
                'status': 'Live',
                'translations': null
              }
            ],
            'category': 'board',
            'code': 'ncert',
            'description': '',
            'identifier': 'ncfcopy_board_ncert',
            'index': 1,
            'name': 'NCERT',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'board',
            'code': 'cbse',
            'description': '',
            'identifier': 'ncfcopy_board_cbse',
            'index': 2,
            'name': 'CBSE',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'board',
            'code': 'icse',
            'description': '',
            'identifier': 'ncfcopy_board_icse',
            'index': 3,
            'name': 'ICSE',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'board',
            'code': 'upboard',
            'description': '',
            'identifier': 'ncfcopy_board_upboard',
            'index': 4,
            'name': 'UP Board',
            'status': 'Live',
            'translations': '{\'hi\':\'टेस्ट फ़्रेम्वर्क\',\'ka\':\'ೂಾೇೂ ಿೀೋಸಾೈದೀಕ\'}'
          },
          {
            'category': 'board',
            'code': 'apboard',
            'description': '',
            'identifier': 'ncfcopy_board_apboard',
            'index': 5,
            'name': 'AP Board',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'board',
            'code': 'tnboard',
            'description': '',
            'identifier': 'ncfcopy_board_tnboard',
            'index': 6,
            'name': 'TN Board',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'board',
            'code': 'ncte',
            'description': '',
            'identifier': 'ncfcopy_board_ncte',
            'index': 7,
            'name': 'NCTE',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'board',
            'code': 'mscert',
            'description': '',
            'identifier': 'ncfcopy_board_mscert',
            'index': 8,
            'name': 'MSCERT',
            'status': 'Live',
            'translations': '{\'hi\':\'टेस्ट फ़्रेम्वर्क\',\'ka\':\'ೂಾೇೂ ಿೀೋಸಾೈದೀಕ\'}'
          },
          {
            'category': 'board',
            'code': 'bser',
            'description': '',
            'identifier': 'ncfcopy_board_bser',
            'index': 9,
            'name': 'BSER',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'board',
            'code': 'others',
            'description': '',
            'identifier': 'ncfcopy_board_others',
            'index': 10,
            'name': 'Others',
            'status': 'Live',
            'translations': null
          }
        ],
        'translations': null
      },
      {
        'code': 'medium',
        'description': '',
        'identifier': 'ncfcopy_medium',
        'index': 2,
        'name': 'Medium',
        'status': 'Live',
        'terms': [
          {
            'category': 'medium',
            'code': 'english',
            'description': '',
            'identifier': 'ncfcopy_medium_english',
            'index': 1,
            'name': 'English',
            'status': 'Live',
            'translations': '{\'hi\':\'अंग्रेज़ी\'}'
          },
          {
            'category': 'medium',
            'code': 'hindi',
            'description': '',
            'identifier': 'ncfcopy_medium_hindi',
            'index': 2,
            'name': 'Hindi',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'oriya',
            'description': '',
            'identifier': 'ncfcopy_medium_oriya',
            'index': 3,
            'name': 'Oriya',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'telugu',
            'description': '',
            'identifier': 'ncfcopy_medium_telugu',
            'index': 4,
            'name': 'Telugu',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'kannada',
            'description': '',
            'identifier': 'ncfcopy_medium_kannada',
            'index': 5,
            'name': 'Kannada',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'marathi',
            'description': '',
            'identifier': 'ncfcopy_medium_marathi',
            'index': 6,
            'name': 'Marathi',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'assamese',
            'description': '',
            'identifier': 'ncfcopy_medium_assamese',
            'index': 7,
            'name': 'Assamese',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'bengali',
            'description': '',
            'identifier': 'ncfcopy_medium_bengali',
            'index': 8,
            'name': 'Bengali',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'gujarati',
            'description': '',
            'identifier': 'ncfcopy_medium_gujarati',
            'index': 9,
            'name': 'Gujarati',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'urdu',
            'description': '',
            'identifier': 'ncfcopy_medium_urdu',
            'index': 10,
            'name': 'Urdu',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'medium',
            'code': 'other',
            'description': '',
            'identifier': 'ncfcopy_medium_other',
            'index': 11,
            'name': 'Other',
            'status': 'Live',
            'translations': null
          }
        ],
        'translations': '{\'hi\':\'मध्यम\'}'
      },
      {
        'code': 'gradeLevel',
        'description': 'NCF Gredelevel',
        'identifier': 'ncfcopy_gradelevel',
        'index': 3,
        'name': 'Class',
        'status': 'Live',
        'terms': [
          {
            'category': 'gradeLevel',
            'code': 'grade1',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade1',
            'index': 1,
            'name': 'Grade 1',
            'status': 'Live',
            'translations': null
          },
          {
            'associations': [
              {
                'category': 'subject',
                'code': 'english',
                'description': '',
                'identifier': 'ncfcopy_subject_english',
                'name': 'English',
                'status': 'Live',
                'translations': '{\'hi\':\'अंग्रेज़ीी\',\'pj\':\'ਅੰਗਰੇਜ਼ੀੀ\'}'
              },
              {
                'category': 'subject',
                'code': 'mathematics',
                'description': 'Mathematics',
                'identifier': 'ncfcopy_subject_mathematics',
                'name': 'Math',
                'status': 'Live',
                'translations': null
              }
            ],
            'category': 'gradeLevel',
            'code': 'kindergarten',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_kindergarten',
            'index': 2,
            'name': 'Kindergarten',
            'status': 'Live',
            'translations': '{\'hi\':\'बाल विहार\'}'
          },
          {
            'category': 'gradeLevel',
            'code': 'grade3',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade3',
            'index': 3,
            'name': 'Grade 3',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade4',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade4',
            'index': 4,
            'name': 'Grade 4',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade5',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade5',
            'index': 5,
            'name': 'Grade 5',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade6',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade6',
            'index': 6,
            'name': 'Grade 6',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade7',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade7',
            'index': 7,
            'name': 'Grade 7',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade8',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade8',
            'index': 8,
            'name': 'Grade 8',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade9',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade9',
            'index': 9,
            'name': 'Grade 9',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade10',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade10',
            'index': 10,
            'name': 'Grade 10',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade11',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade11',
            'index': 11,
            'name': 'Grade 11',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'grade12',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_grade12',
            'index': 12,
            'name': 'Grade 12',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'gradeLevel',
            'code': 'others',
            'description': '',
            'identifier': 'ncfcopy_gradelevel_others',
            'index': 14,
            'name': 'Others',
            'status': 'Live',
            'translations': null
          }
        ],
        'translations': '{\'hi\':\'क्रम स्तर\'}'
      },
      {
        'code': 'subject',
        'description': '',
        'identifier': 'ncfcopy_subject',
        'index': 4,
        'name': 'Subject',
        'status': 'Live',
        'terms': [
          {
            'category': 'subject',
            'children': [
              {
                'category': 'subject',
                'code': 'arithmetics',
                'description': 'Arithmetics',
                'identifier': 'ncfcopy_subject_arithmetics',
                'index': 1,
                'name': 'Arithmetics',
                'status': 'Live',
                'translations': null
              }
            ],
            'code': 'mathematics',
            'description': 'Mathematics',
            'identifier': 'ncfcopy_subject_mathematics',
            'index': 1,
            'name': 'Math',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'english',
            'description': '',
            'identifier': 'ncfcopy_subject_english',
            'index': 2,
            'name': 'English',
            'status': 'Live',
            'translations': '{\'hi\':\'अंग्रेज़ीी\',\'pj\':\'ਅੰਗਰੇਜ਼ੀੀ\'}'
          },
          {
            'category': 'subject',
            'code': 'tamil',
            'description': '',
            'identifier': 'ncfcopy_subject_tamil',
            'index': 3,
            'name': 'Tamil',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'telugu',
            'description': '',
            'identifier': 'ncfcopy_subject_telugu',
            'index': 4,
            'name': 'Telugu',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'geography',
            'description': '',
            'identifier': 'ncfcopy_subject_geography',
            'index': 5,
            'name': 'Geography',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'urdu',
            'description': '',
            'identifier': 'ncfcopy_subject_urdu',
            'index': 6,
            'name': 'Urdu',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'kannada',
            'description': '',
            'identifier': 'ncfcopy_subject_kannada',
            'index': 7,
            'name': 'Kannada',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'assamese',
            'description': '',
            'identifier': 'ncfcopy_subject_assamese',
            'index': 8,
            'name': 'Assamese',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'physics',
            'description': '',
            'identifier': 'ncfcopy_subject_physics',
            'index': 9,
            'name': 'Physics',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'chemistry',
            'description': '',
            'identifier': 'ncfcopy_subject_chemistry',
            'index': 10,
            'name': 'Chemistry',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'hindi',
            'description': '',
            'identifier': 'ncfcopy_subject_hindi',
            'index': 11,
            'name': 'Hindi',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'marathi',
            'description': '',
            'identifier': 'ncfcopy_subject_marathi',
            'index': 12,
            'name': 'Marathi',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'environmentalstudies',
            'description': '',
            'identifier': 'ncfcopy_subject_environmentalstudies',
            'index': 13,
            'name': 'Environmental Studies',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'politicalscience',
            'description': '',
            'identifier': 'ncfcopy_subject_politicalscience',
            'index': 14,
            'name': 'Political Science',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'bengali',
            'description': '',
            'identifier': 'ncfcopy_subject_bengali',
            'index': 15,
            'name': 'Bengali',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'history',
            'description': '',
            'identifier': 'ncfcopy_subject_history',
            'index': 16,
            'name': 'History',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'gujarati',
            'description': '',
            'identifier': 'ncfcopy_subject_gujarati',
            'index': 17,
            'name': 'Gujarati',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'biology',
            'description': '',
            'identifier': 'ncfcopy_subject_biology',
            'index': 18,
            'name': 'Biology',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'oriya',
            'description': '',
            'identifier': 'ncfcopy_subject_oriya',
            'index': 19,
            'name': 'Oriya',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'punjabi',
            'description': '',
            'identifier': 'ncfcopy_subject_punjabi',
            'index': 20,
            'name': 'Punjabi',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'nepali',
            'description': '',
            'identifier': 'ncfcopy_subject_nepali',
            'index': 21,
            'name': 'Nepali',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'subject',
            'code': 'malayalam',
            'description': '',
            'identifier': 'ncfcopy_subject_malayalam',
            'index': 22,
            'name': 'Malayalam',
            'status': 'Live',
            'translations': null
          }
        ],
        'translations': '{\'hi\':\'विषय\'}'
      },
      {
        'code': 'topic',
        'description': 'Topic',
        'identifier': 'ncfcopy_topic',
        'index': 5,
        'name': 'Topic',
        'status': 'Live',
        'terms': [
          {
            'category': 'topic',
            'code': 'topic1',
            'description': 'Mathematics',
            'identifier': 'ncfcopy_topic_topic1',
            'index': 1,
            'name': 'Topic, topic 1',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'topic',
            'code': 'topic2',
            'description': 'Topic 2',
            'identifier': 'ncfcopy_topic_topic2',
            'index': 2,
            'name': 'Topic 2',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'topic',
            'code': 'topic 1 child',
            'description': 'Topic 1 child',
            'identifier': 'ncfcopy_topic_topic-1-child',
            'index': 3,
            'name': 'Topic 1 child',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'topic',
            'code': 'topic 2 child',
            'description': 'Topic 2 child',
            'identifier': 'ncfcopy_topic_topic-2-child',
            'index': 4,
            'name': 'Topic 2 child',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'topic',
            'children': [
              {
                'category': 'topic',
                'code': 'topic-3-child',
                'description': 'Topic 3 Child',
                'identifier': 'ncfcopy_topic_topic-3-child',
                'index': 1,
                'name': 'Topic 3 Child',
                'status': 'Live',
                'translations': null
              }
            ],
            'code': 'topic3',
            'description': 'Topic 3',
            'identifier': 'ncfcopy_topic_topic3',
            'index': 5,
            'name': 'Topic 3',
            'status': 'Live',
            'translations': null
          },
          {
            'category': 'topic',
            'children': [
              {
                'category': 'topic',
                'code': 'topic-4-child',
                'description': 'Topic 4 Child',
                'identifier': 'ncfcopy_topic_topic-4-child',
                'index': 1,
                'name': 'Topic 4 Child',
                'status': 'Live',
                'translations': null
              }
            ],
            'code': 'topic4',
            'description': 'Topic 4',
            'identifier': 'ncfcopy_topic_topic4',
            'index': 6,
            'name': 'Topic 4',
            'status': 'Live',
            'translations': null
          }
        ],
        'translations': null
      }
    ]
  },
  'userProfile': {
    'badgeAssertions': [],
    'channel': null,
    'countryCode': null,
    'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45',
    'createdDate': '2017-10-31 10:47:04:723+0000',
    'currentLoginTime': null,
    'defaultProfileFieldVisibility': 'private',
    'dob': '2018-02-13',
    'email': 'te*********@yopmail.com',
    'emailVerified': true,
    'externalIds': [],
    'firstName': 'Creation',
    'flagsValue': 7,
    'framework': {
      'board': [
        'State (Uttar Pradesh)'
      ],
      'gradeLevel': [
        'KG'
      ],
      'id': [
        'NCF'
      ],
      'medium': [
        'English'
      ],
      'subject': [
        'English'
      ]
    },
    'gender': 'Male',
    'grade': [
      'Grade 2'
    ],
    'hashTagIds': [
      'b00bc992ef25f1a9a8d63291e20efc8d'
    ],
    'id': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'isDeleted': null,
    'language': [
      'English'
    ],
    'lastName': '',
    'location': 'bng',
    'maskedEmail': 'te*********@yopmail.com',
    'maskedPhone': '******4412',
    'orgRoleMap': {
      'ORG_001': [
        'BOOK_CREATOR',
        'CONTENT_CREATOR',
        'COURSE_MENTOR',
        'ANNOUNCEMENT_SENDER',
        'PUBLIC'
      ]
    },
    'organisationIds': [
      'ORG_001'
    ],
    'organisationNames': [],
    'organisations': [
      {
        'addedBy': '781c21fc-5054-4ee0-9a02-fbb1006a4fdd',
        'addedByName': null,
        'approvaldate': null,
        'approvedBy': null,
        'channel': 'ROOT_ORG',
        'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'id': '012718476992946176314',
        'isApproved': false,
        'isDeleted': false,
        'isRejected': false,
        'locationIds': [
          '969dd3c1-4e98-4c17-a994-559f2dc70e18'
        ],
        'locations': [
          {
            'code': '29',
            'id': '969dd3c1-4e98-4c17-a994-559f2dc70e18',
            'name': 'Karnataka',
            'type': 'state'
          }
        ],
        'orgLeftDate': null,
        'orgName': 'Sunbird',
        'organisationId': 'ORG_001',
        'orgjoindate': '2019-03-14 07:19:22:427+0000',
        'parentOrgId': null,
        'position': null,
        'roles': [
          'BOOK_CREATOR',
          'CONTENT_CREATOR',
          'COURSE_MENTOR',
          'ANNOUNCEMENT_SENDER',
          'PUBLIC'
        ],
        'updatedBy': '1d7279c1-40ee-465e-b9f6-77335904e9a9',
        'updatedDate': '2019-07-02 15:08:33:588+0000',
        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
      }
    ],
    'phone': '******4412',
    'phoneVerified': true,
    'prevUsedEmail': '',
    'prevUsedPhone': '',
    'profileSummary': '',
    'profileVisibility': {
      'address': 'private',
      'avatar': 'private',
      'badgeAssertions': 'private',
      'countryCode': 'private',
      'dob': 'private',
      'education': 'private',
      'email': 'private',
      'firstName': 'public',
      'gender': 'private',
      'grade': 'private',
      'jobProfile': 'private',
      'language': 'private',
      'lastName': 'public',
      'location': 'private',
      'phone': 'private',
      'profileSummary': 'public',
      'skills': 'private',
      'subject': 'private',
      'userName': 'public',
      'webPages': 'private'
    },
    'promptTnC': false,
    'provider': null,
    'recoveryEmail': 'ab*@yopmail.com',
    'recoveryPhone': '',
    'registryId': null,
    'roleList': [
      {
        'id': 'BOOK_CREATOR',
        'name': 'Book Creator'
      },
      {
        'id': 'COURSE_CREATOR',
        'name': 'Course Creator'
      },
      {
        'id': 'MEMBERSHIP_MANAGEMENT',
        'name': 'Membership Management'
      },
      {
        'id': 'CONTENT_CREATION',
        'name': 'Content Creation'
      },
      {
        'id': 'CONTENT_REVIEW',
        'name': 'Content Review'
      },
      {
        'id': 'REPORT_VIEWER',
        'name': 'Report Viewer'
      },
      {
        'id': 'FLAG_REVIEWER',
        'name': 'Flag Reviewer'
      },
      {
        'id': 'ANNOUNCEMENT_SENDER',
        'name': 'Announcement Sender'
      },
      {
        'id': 'FLAG_REVIEWER ',
        'name': 'Flag Reviewer'
      },
      {
        'id': 'SYSTEM_ADMINISTRATION',
        'name': 'System Administration'
      },
      {
        'id': 'CONTENT_CURATION',
        'name': 'Content Curation'
      },
      {
        'id': 'BOOK_REVIEWER',
        'name': 'Book Reviewer'
      },
      {
        'id': 'CONTENT_CREATOR',
        'name': 'Content Creator'
      },
      {
        'id': 'TEACHER_BADGE_ISSUER',
        'name': 'Teacher Badge Issuer'
      },
      {
        'id': 'ORG_MANAGEMENT',
        'name': 'Org Management'
      },
      {
        'id': 'COURSE_ADMIN',
        'name': 'Course Admin'
      },
      {
        'id': 'ORG_MODERATOR',
        'name': 'Org Moderator'
      },
      {
        'id': 'PUBLIC',
        'name': 'Public'
      },
      {
        'id': 'OFFICIAL_TEXTBOOK_BADGE_ISSUER',
        'name': 'Official TextBook Badge Issuer'
      },
      {
        'id': 'ADMIN',
        'name': 'Admin'
      },
      {
        'id': 'COURSE_MENTOR',
        'name': 'Course Mentor'
      },
      {
        'id': 'CONTENT_REVIEWER',
        'name': 'Content Reviewer'
      },
      {
        'id': 'ORG_ADMIN',
        'name': 'Org Admin'
      }
    ],
    'roleOrgMap': {
      'ANNOUNCEMENT_SENDER': [
        'ORG_001'
      ],
      'BOOK_CREATOR': [
        'ORG_001'
      ],
      'CONTENT_CREATOR': [
        'ORG_001'
      ],
      'COURSE_MENTOR': [
        'ORG_001'
      ],
      'PUBLIC': [
        'ORG_001'
      ],
      'public': [
        'ORG_001'
      ]
    },
    'roles': [
      'public'
    ],
    'rootOrg': {
      'addressId': null,
      'approvedBy': null,
      'approvedDate': null,
      'channel': 'ROOT_ORG',
      'communityId': null,
      // tslint:disable-next-line:max-line-length
      'contactDetail': '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'},{\'phone\':\'+91213124234234\',\'email\':\'test1@test.com\'}]',
      'createdBy': null,
      'createdDate': null,
      'dateTime': null,
      'description': 'Andhra State Boardsssssss',
      'email': 'support_dev@sunbird.org',
      'externalId': null,
      'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
      'homeUrl': null,
      'id': 'ORG_001',
      'identifier': 'ORG_001',
      'imgUrl': null,
      'isApproved': null,
      'isDefault': true,
      'isRootOrg': true,
      'keys': {
        'encKeys': [
          '5766',
          '5767'
        ],
        'signKeys': [
          '5766',
          '5767'
        ]
      },
      'locationId': null,
      'locationIds': [
        '969dd3c1-4e98-4c17-a994-559f2dc70e18'
      ],
      'noOfMembers': 5,
      'orgCode': 'sunbird',
      'orgName': 'Sunbird',
      'orgTypeId': null,
      'parentOrgId': null,
      'preferredLanguage': 'English',
      'provider': null,
      'rootOrgId': 'ORG_001',
      'slug': 'sunbird',
      'status': 1,
      'theme': null,
      'thumbnail': null,
      'updatedBy': '1d7b85b0-3502-4536-a846-d3a51fd0aeea',
      'updatedDate': '2018-11-28 10:00:08:675+0000'
    },
    'rootOrgAdmin': false,
    'rootOrgId': 'ORG_001',
    'rootOrgName': 'Sunbird',
    'skills': [],
    'stateValidated': true,
    'status': 1,
    'subject': [
      'Mathematics'
    ],
    'tcStatus': null,
    'tcUpdatedDate': null,
    'tempPassword': null,
    'thumbnail': null,
    'tncAcceptedOn': '2018-12-18T09:28:23.625Z',
    'tncAcceptedVersion': 'v1',
    'tncLatestVersion': 'v1',
    'tncLatestVersionUrl': 'https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html',
    'updatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'updatedDate': '2019-12-19 13:20:55:010+0000',
    'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'userLocations': [
      {
        'code': 'State-02-fuzzy-1531142697403',
        'id': '0ec59f78-d67f-4cb9-8cf9-2e2834463321',
        'name': 'State-0001-name1',
        'type': 'state'
      },
      {
        'code': 'District-02-fuzzy-1531142697403',
        'id': '22c920b9-23fb-46c6-bb6c-b4ef7ecba768',
        'name': 'District-0001-name1',
        'parentId': '0ec59f78-d67f-4cb9-8cf9-2e2834463321',
        'type': 'district'
      }
    ],
    'userName': 'ntptest102',
    'userRoles': [
      'PUBLIC',
      'BOOK_CREATOR',
      'CONTENT_CREATOR',
      'COURSE_MENTOR',
      'ANNOUNCEMENT_SENDER'
    ],
    'userType': null
  }
};

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
    // tslint:disable-next-line:max-line-length
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

export const collectionWithCard = [
  {
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    'cardImg': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/maths_1467351511252.png',
    'completionPercentage': 0,
    'contentType': 'TextBook',
    'description': 'Enter description for TextBook',
    'gradeLevel': 'Kindergarten',
    'image': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/maths_1467351511252.png',
    'medium': [
      'English'
    ],
    'metaData': {
      'contentType': 'TextBook',
      'framework': 'NCFCOPY',
      'identifier': 'do_1127638981486755841123',
      'mimeType': 'application/vnd.ekstep.content-collection'
    },
    'mimeTypesCount': 0,
    'name': 'Math-Magic',
    'orgDetails': {},
    'organisation': [
      'Sunbird'
    ],
    'rating': '0',
    'resourceType': 'Book',
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Book'
      }
    },
    'subTopic': '',
    'subject': [
      'Mathematics'
    ],
    'topic': ''
  },
  {
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    // tslint:disable-next-line:max-line-length
    'cardImg': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281198579627622415/artifact/download_1560444536376.thumb.jpeg',
    'completionPercentage': 0,
    'contentType': 'TextBook',
    'description': 'Enter description for TextBook',
    'gradeLevel': 'Kindergarten',
    // tslint:disable-next-line:max-line-length
    'image': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281198579627622415/artifact/download_1560444536376.thumb.jpeg',
    'medium': [
      'English'
    ],
    'metaData': {
      'contentType': 'TextBook',
      'framework': 'NCFCOPY',
      'identifier': 'do_11281198579627622415',
      'mimeType': 'application/vnd.ekstep.content-collection'
    },
    'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':2,\'application/vnd.ekstep.ecml-archive\':4}',
    'name': 'Sh CBSE Book',
    'orgDetails': {},
    'organisation': [
      'Sunbird'
    ],
    'rating': '0',
    'resourceType': 'Book',
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Book'
      }
    },
    'subTopic': '',
    'subject': [
      'Hindi'
    ],
    'topic': ''
  },
  {
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    'cardImg': 'assets/images/book.png',
    'completionPercentage': 0,
    'contentType': 'TextBook',
    'description': 'Enter description for TextBook',
    'gradeLevel': 'Kindergarten',
    'medium': [
      'English'
    ],
    'metaData': {
      'contentType': 'TextBook',
      'framework': 'NCFCOPY',
      'identifier': 'do_1127639029040660481129',
      'mimeType': 'application/vnd.ekstep.content-collection'
    },
    'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':5,\'application/vnd.ekstep.ecml-archive\':21}',
    'name': 'दूर्वा १(HINDHI)',
    'orgDetails': {},
    'organisation': [
      'Sunbird'
    ],
    'rating': '0',
    'resourceType': 'Book',
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Book'
      }
    },
    'subTopic': '',
    'subject': [
      'Hindi'
    ],
    'topic': ''
  },
  {
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    // tslint:disable-next-line:max-line-length
    'cardImg': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
    'completionPercentage': 0,
    'contentType': 'TextBook',
    'description': 'Enter description for TextBook',
    'gradeLevel': 'Kindergarten',
    // tslint:disable-next-line:max-line-length
    'image': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
    'medium': [
      'English'
    ],
    'metaData': {
      'contentType': 'TextBook',
      'framework': 'NCFCOPY',
      'identifier': 'do_1127639035982479361130',
      'mimeType': 'application/vnd.ekstep.content-collection'
    },
    'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':31,\'application/vnd.ekstep.ecml-archive\':31}',
    'name': 'बाल रामकथा(HINDHI)',
    'orgDetails': {},
    'organisation': [
      'Sunbird'
    ],
    'rating': '0',
    'resourceType': 'Book',
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Book'
      }
    },
    'subTopic': '',
    'subject': [
      'Hindi'
    ],
    'topic': ''
  }
];

export const collectionList = [
  {
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    'cardImg': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/maths_1467351511252.png',
    'completionPercentage': 0,
    'contentType': 'TextBook',
    'description': 'Enter description for TextBook',
    'gradeLevel': 'Kindergarten',
    'image': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/maths_1467351511252.png',
    'medium': [
      'English'
    ],
    'metaData': {
      'contentType': 'TextBook',
      'framework': 'NCFCOPY',
      'identifier': 'do_1127638981486755841123',
      'mimeType': 'application/vnd.ekstep.content-collection'
    },
    'mimeTypesCount': 0,
    'name': 'Math-Magic',
    'orgDetails': {},
    'organisation': [
      'Sunbird'
    ],
    'rating': '0',
    'resourceType': 'Book',
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Book'
      }
    },
    'subTopic': '',
    'subject': [
      'Math'
    ],
    'topic': ''
  },
  {
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    // tslint:disable-next-line:max-line-length
    'cardImg': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281198579627622415/artifact/download_1560444536376.thumb.jpeg',
    'completionPercentage': 0,
    'contentType': 'TextBook',
    'description': 'Enter description for TextBook',
    'gradeLevel': 'Kindergarten',
    // tslint:disable-next-line:max-line-length
    'image': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281198579627622415/artifact/download_1560444536376.thumb.jpeg',
    'medium': [
      'English'
    ],
    'metaData': {
      'contentType': 'TextBook',
      'framework': 'NCFCOPY',
      'identifier': 'do_11281198579627622415',
      'mimeType': 'application/vnd.ekstep.content-collection'
    },
    'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':2,\'application/vnd.ekstep.ecml-archive\':4}',
    'name': 'Sh CBSE Book',
    'orgDetails': {},
    'organisation': [
      'Sunbird'
    ],
    'rating': '0',
    'resourceType': 'Book',
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Book'
      }
    },
    'subTopic': '',
    'subject': [
      'Hindi'
    ],
    'topic': ''
  },
  {
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    'completionPercentage': 0,
    'contentType': 'TextBook',
    'description': 'Enter description for TextBook',
    'gradeLevel': 'Kindergarten',
    'medium': [
      'English'
    ],
    'metaData': {
      'contentType': 'TextBook',
      'framework': 'NCFCOPY',
      'identifier': 'do_1127639029040660481129',
      'mimeType': 'application/vnd.ekstep.content-collection'
    },
    'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':5,\'application/vnd.ekstep.ecml-archive\':21}',
    'name': 'दूर्वा १(HINDHI)',
    'orgDetails': {},
    'organisation': [
      'Sunbird'
    ],
    'rating': '0',
    'resourceType': 'Book',
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Book'
      }
    },
    'subTopic': '',
    'subject': [
      'Hindi'
    ],
    'topic': ''
  },
  {
    'action': {
      'onImage': {
        'eventName': 'onImage'
      }
    },
    // tslint:disable-next-line:max-line-length
    'cardImg': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
    'completionPercentage': 0,
    'contentType': 'TextBook',
    'description': 'Enter description for TextBook',
    'gradeLevel': 'Kindergarten',
    // tslint:disable-next-line:max-line-length
    'image': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
    'medium': [
      'English'
    ],
    'metaData': {
      'contentType': 'TextBook',
      'framework': 'NCFCOPY',
      'identifier': 'do_1127639035982479361130',
      'mimeType': 'application/vnd.ekstep.content-collection'
    },
    'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':31,\'application/vnd.ekstep.ecml-archive\':31}',
    'name': 'बाल रामकथा(HINDHI)',
    'orgDetails': {},
    'organisation': [
      'Sunbird'
    ],
    'rating': '0',
    'resourceType': 'Book',
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Book'
      }
    },
    'subTopic': '',
    'subject': [
      'Hindi'
    ],
    'topic': ''
  }
];

export const searchCollectionRequest = [{
  'data': {
    'request': {
      'filters': {
        'board': 'NCERT',
        'contentType': 'Textbook',
        'framework': 'NCFCOPY',
        'medium': [
          'English'
        ],
        'objectType': 'content',
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'status': [
          'Draft',
          'Live'
        ]
      }
    }
  },
  'url': 'composite/v1/search'
}];

export const searchCollectionResponse = [{
  'id': 'api.v1.search',
  'params': {
    'err': null,
    'errmsg': null,
    'msgid': '764cd287-352e-2c53-9f55-fa9b2bf49df2',
    'resmsgid': '2a424540-329a-11ea-add3-e5a3842c8035',
    'status': 'successful'
  },
  'responseCode': 'OK',
  'result': {
    'content': [
      {
        'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/maths_1467351511252.png',
        'appId': 'dev.sunbird.portal',
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_1127639026795151361126',
          'do_1127639026795233281128',
          'do_1127639026795151361127',
          'do_1127638985060106241124',
          'do_1127639026795069441125',
          'do_1129252357840240641314',
          'do_11292651409217126413',
          'do_1129272202365009921248',
          'do_11292939212545228811025',
          'do_11292943478132736011029',
          'do_11292943609946931211030',
          'do_11292949233147084811049',
          'do_11293016282361856011856',
          'do_11293018544445030411920',
          'do_11293023955227443211944',
          'do_11293089811107020811',
          'do_11293089938463129612',
          'do_11293090047149670414',
          'do_11293091581322854417',
          'do_11293092209904025618',
          'do_11293093623224729613',
          'do_11293094254030848016',
          'do_11293094309537382418',
          'do_112930943761121280111',
          'do_112930946864488448114',
          'do_112930948581244928116',
          'do_112930949261803520118',
          'do_11293095108743987211',
          'do_11293095190860595213',
          'do_11293095434220339218',
          'do_11293095456595968019',
          'do_112930954960666624110',
          'do_112930955379580928112',
          'do_112930956287418368113',
          'do_112930956787007488115',
          'do_112930956787941376116',
          'do_112930957287473152117',
          'do_112930959940993024119',
          'do_112930960920117248120',
          'do_112930961061781504121',
          'do_112930972647292928126',
          'do_112930974201151488128',
          'do_112930974795415552129',
          'do_112930976008077312130',
          'do_112930976335446016131',
          'do_112930982742917120134',
          'do_112930983366402048135',
          'do_112930983687675904136',
          'do_112930985563635712137',
          'do_112930985967124480138',
          'do_112930986687250432139',
          'do_112930987213963264140',
          'do_112930987749007360141',
          'do_112930988546408448142',
          'do_112930989853204480143',
          'do_112930990681210880144',
          'do_112930994109128704148',
          'do_112930994512617472149',
          'do_112931001004752896152',
          'do_112931001275072512153',
          'do_112931001552068608154',
          'do_112931001876742144155',
          'do_112931002524147712156',
          'do_112931003404476416157',
          'do_112931004047392768158',
          'do_112931005448765440159',
          'do_112931006333042688160',
          'do_112931007491432448161',
          'do_112931007733678080162',
          'do_112931008264437760163',
          'do_112931008660897792164',
          'do_112931009054883840165',
          'do_112931009852456960166',
          'do_112931015213088768167',
          'do_112931017201614848168',
          'do_112931019258462208170',
          'do_112931019893530624171',
          'do_112931020420743168172',
          'do_112931020943671296173',
          'do_112931021628014592174',
          'do_112931023763865600175',
          'do_112931024867540992176',
          'do_112931033133064192177',
          'do_112931034314465280178',
          'do_112931036295503872179',
          'do_112931037916233728180',
          'do_112931039197888512181',
          'do_112931040948002816182',
          'do_112931042463440896183',
          'do_112931043466452992184',
          'do_112931114917068800185',
          'do_112931115331796992186',
          'do_112931115581767680187'
        ],
        'code': 'org.sunbird.aWDcEc',
        'compatibilityLevel': 1,
        'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'copyright': 'Sunbird',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'createdFor': [
          'ORG_001'
        ],
        'createdOn': '2019-05-17T11:37:15.727+0000',
        'creator': 'Creation',
        'depth': 0,
        'description': 'Enter description for TextBook',
        'dialcodeRequired': 'No',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'graph_id': 'domain',
        'idealScreenDensity': 'hdpi',
        'idealScreenSize': 'normal',
        'identifier': 'do_1127638981486755841123',
        'language': [
          'English'
        ],
        'lastStatusChangedOn': '2019-05-17T13:24:38.695+0000',
        'lastUpdatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'lastUpdatedOn': '2020-01-08T17:42:00.318+0000',
        'license': 'CC BY-NC 4.0',
        // tslint:disable-next-line:max-line-length
        'licenseterms': 'By creating and uploading content on DIKSHA, you consent to publishing this content under the Creative Commons Framework, specifically under the CC-BY-SA 4.0 license.',
        'lockKey': '1dcf80a7-2c0a-4aec-99da-ef3dbce16976',
        'mediaType': 'content',
        'medium': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'Math-Magic',
        'nodeType': 'DATA_NODE',
        'node_id': 341437,
        'objectType': 'Content',
        'organisation': [
          'Sunbird'
        ],
        'os': [
          'All'
        ],
        'osId': 'org.ekstep.quiz.app',
        'ownedBy': 'ORG_001',
        'owner': 'Sunbird',
        'ownershipType': [
          'createdFor'
        ],
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'resourceType': 'Book',
        'status': 'Draft',
        'subject': [
          'Math'
        ],
        'version': 2,
        'versionKey': '1578505320318',
        'visibility': 'Default'
      },
      {
        'IL_FUNC_OBJECT_TYPE': 'ContentImage',
        'IL_SYS_NODE_TYPE': 'DATA_NODE',
        'IL_UNIQUE_ID': 'do_11281198579627622415.img',
        'SYS_INTERNAL_LAST_UPDATED_ON': '2019-07-24T12:38:52.798+0000',
        // tslint:disable-next-line:max-line-length
        'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281198579627622415/artifact/download_1560444536376.thumb.jpeg',
        'appId': 'dev.sunbird.portal',
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_11281198634895769617',
          'do_112796494658912256116',
          'do_11281198634897408018',
          'do_11278318847246336018',
          'do_112797906438234112152',
          'do_1129103358426152961424',
          'do_112920470328713216146',
          'do_112920492913139712147',
          'do_11292931703326310411006',
          'do_11292931747615539211007',
          'do_11292932897280000011013',
          'do_11292938399852134411022',
          'do_11292938448374988811023'
        ],
        'children': [
          'do_11278318847246336018',
          'do_112797906438234112152',
          'do_112796494658912256116'
        ],
        'code': 'org.sunbird.Xzc3OJ',
        'compatibilityLevel': 1,
        'consumerId': '02bf5216-c947-492f-929b-af2e61ea78cd',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'contentTypesCount': '{\'TextBookUnit\':2,\'PracticeQuestionSet\':3,\'Resource\':1}',
        'copyright': 'Sunbird',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'createdFor': [
          'ORG_001'
        ],
        'createdOn': '2019-07-24T10:11:49.896+0000',
        'creator': 'Creation',
        'depth': 0,
        'description': 'Enter description for TextBook',
        'dialcodeRequired': 'No',
        // tslint:disable-next-line:max-line-length
        'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11281198579627622415/sh-cbse-book_1563971931660_do_11281198579627622415_3.0_spine.ecar',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'graph_id': 'domain',
        'idealScreenDensity': 'hdpi',
        'idealScreenSize': 'normal',
        'identifier': 'do_11281198579627622415',
        'language': [
          'English'
        ],
        'lastPublishedBy': 'Ekstep',
        'lastPublishedOn': '2019-07-24T12:38:51.369+0000',
        'lastStatusChangedOn': '2019-07-24T10:11:49.896+0000',
        'lastSubmittedOn': '2019-07-24T10:13:43.499+0000',
        'lastUpdatedOn': '2019-07-24T12:45:38.562+0000',
        'leafNodes': [
          'do_112796494658912256116',
          'do_11278318847246336018',
          'do_112797906438234112152'
        ],
        'leafNodesCount': 3,
        'license': 'CC BY-NC 4.0',
        'lockKey': 'ead136a4-dbb4-494b-a662-bf75b6863c5f',
        'mediaType': 'content',
        'medium': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':2,\'application/vnd.ekstep.ecml-archive\':4}',
        'name': 'Sh CBSE Book',
        'nodeType': 'DATA_NODE',
        'node_id': 340169,
        'objectType': 'Content',
        'organisation': [
          'Sunbird'
        ],
        'os': [
          'All'
        ],
        'osId': 'org.ekstep.quiz.app',
        'ownershipType': [
          'createdBy'
        ],
        'pkgVersion': 3,
        // tslint:disable-next-line:max-line-length
        'posterImage': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11278316163941171213/artifact/download_1560444536376.jpeg',
        'prevState': 'Draft',
        'program': 'CBSE',
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'resourceType': 'Book',
        's3Key': 'ecar_files/do_11281198579627622415/sh-cbse-book_1563971931660_do_11281198579627622415_3.0_spine.ecar',
        'size': 34885,
        'status': 'Draft',
        'subject': [
          'Hindi'
        ],
        // tslint:disable-next-line:max-line-length
        'toc_url': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281198579627622415/artifact/do_11281198579627622415_toc.json',
        'totalCompressedSize': 1578422,
        'variants': {
          'online': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11281198579627622415/sh-cbse-book_1563971932321_do_11281198579627622415_3.0_online.ecar',
            'size': 5557
          },
          'spine': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11281198579627622415/sh-cbse-book_1563971931660_do_11281198579627622415_3.0_spine.ecar',
            'size': 34885
          }
        },
        'version': 2,
        'versionKey': '1578294316688',
        'visibility': 'Default'
      },
      {
        'IL_FUNC_OBJECT_TYPE': 'Content',
        'IL_SYS_NODE_TYPE': 'DATA_NODE',
        'IL_UNIQUE_ID': 'do_11281198579627622415',
        'SYS_INTERNAL_LAST_UPDATED_ON': '2019-07-24T12:38:52.798+0000',
        // tslint:disable-next-line:max-line-length
        'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281198579627622415/artifact/download_1560444536376.thumb.jpeg',
        'appId': 'dev.sunbird.portal',
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_11281198634895769617',
          'do_112796494658912256116',
          'do_11281198634897408018',
          'do_11278318847246336018',
          'do_112797906438234112152'
        ],
        'children': [
          'do_112797906438234112152',
          'do_112796494658912256116',
          'do_11278318847246336018'
        ],
        'code': 'org.sunbird.Xzc3OJ',
        'compatibilityLevel': 1,
        'consumerId': '02bf5216-c947-492f-929b-af2e61ea78cd',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'contentTypesCount': '{\'TextBookUnit\':2,\'PracticeQuestionSet\':3,\'Resource\':1}',
        'copyright': 'Sunbird',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'createdFor': [
          'ORG_001'
        ],
        'createdOn': '2019-07-24T10:11:49.896+0000',
        'creator': 'Creation',
        'depth': 0,
        'description': 'Enter description for TextBook',
        'dialcodeRequired': 'No',
        // tslint:disable-next-line:max-line-length
        'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11281198579627622415/sh-cbse-book_1563971931660_do_11281198579627622415_3.0_spine.ecar',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'graph_id': 'domain',
        'idealScreenDensity': 'hdpi',
        'idealScreenSize': 'normal',
        'identifier': 'do_11281198579627622415',
        'language': [
          'English'
        ],
        'lastPublishedBy': 'Ekstep',
        'lastPublishedOn': '2019-07-24T12:38:51.369+0000',
        'lastStatusChangedOn': '2019-07-24T12:38:47.925+0000',
        'lastSubmittedOn': '2019-07-24T10:13:43.499+0000',
        'lastUpdatedOn': '2019-07-24T12:38:47.933+0000',
        'leafNodes': [
          'do_112796494658912256116',
          'do_11278318847246336018',
          'do_112797906438234112152'
        ],
        'leafNodesCount': 3,
        'license': 'CC BY-NC 4.0',
        'lockKey': 'ead136a4-dbb4-494b-a662-bf75b6863c5f',
        'me_hierarchyLevel': 1,
        'me_totalDialcode': [],
        'me_totalDialcodeAttached': 0,
        'me_totalDialcodeLinkedToContent': 0,
        'mediaType': 'content',
        'medium': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':2,\'application/vnd.ekstep.ecml-archive\':4}',
        'name': 'Sh CBSE Book',
        'nodeType': 'DATA_NODE',
        'node_id': 340604,
        'objectType': 'Content',
        'organisation': [
          'Sunbird'
        ],
        'os': [
          'All'
        ],
        'osId': 'org.ekstep.quiz.app',
        'ownershipType': [
          'createdBy'
        ],
        'pkgVersion': 3,
        // tslint:disable-next-line:max-line-length
        'posterImage': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11278316163941171213/artifact/download_1560444536376.jpeg',
        'prevState': 'Draft',
        'program': 'CBSE',
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'resourceType': 'Book',
        's3Key': 'ecar_files/do_11281198579627622415/sh-cbse-book_1563971931660_do_11281198579627622415_3.0_spine.ecar',
        'size': 34885,
        'status': 'Live',
        'subject': [
          'Hindi'
        ],
        // tslint:disable-next-line:max-line-length
        'toc_url': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11281198579627622415/artifact/do_11281198579627622415_toc.json',
        'totalCompressedSize': 1578422,
        'variants': {
          'online': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11281198579627622415/sh-cbse-book_1563971932321_do_11281198579627622415_3.0_online.ecar',
            'size': 5557
          },
          'spine': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11281198579627622415/sh-cbse-book_1563971931660_do_11281198579627622415_3.0_spine.ecar',
            'size': 34885
          }
        },
        'version': 2,
        'versionKey': '1563971930983',
        'visibility': 'Default'
      },
      {
        'IL_FUNC_OBJECT_TYPE': 'ContentImage',
        'IL_SYS_NODE_TYPE': 'DATA_NODE',
        'IL_UNIQUE_ID': 'do_1127639029040660481129.img',
        'SYS_INTERNAL_LAST_UPDATED_ON': '2019-09-05T06:49:43.223+0000',
        'appId': 'local.sunbird.portal',
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_112842321298440192110',
          'do_112876344863522816153',
          'do_1127639049671147521131',
          'do_112885488760750080142',
          'do_1127639049671311361133',
          'do_1127639049671311361134',
          'do_112875721987309568135',
          'do_11282692248983961614',
          'do_112876285334437888145',
          'do_11282692401699225616',
          'do_11284180369415372819',
          'do_112797225134407680178',
          'do_11284177247005081614',
          'do_11282692280039833615',
          'do_1127639049671229441132',
          'do_112876344863531008155',
          'do_112876344863531008154',
          'do_1127639049671393281135',
          'do_11291097622904832011670',
          'do_11291098095932211218',
          'do_11291247885180928011',
          'do_1129174307378626561341',
          'do_1129174332457697281342',
          'do_1129174346837606401344',
          'do_1129174348994969601345',
          'do_1129174372472422401350',
          'do_1129174584505303041362',
          'do_1129174637760512001369',
          'do_1129174648941527041371',
          'do_1129174680860508161375',
          'do_1129175121727406081402',
          'do_1129175131424849921405',
          'do_1129175168130334721407',
          'do_1129175175893811201409',
          'do_1129175193141411841411',
          'do_1129175206633226241414',
          'do_1129175215905832961415',
          'do_1129175365317099521437',
          'do_1129175405840138241438',
          'do_1129175475255296001442',
          'do_112919443826171904110',
          'do_112919449480257536117',
          'do_112919456722075648124',
          'do_112919457871634432126',
          'do_112919458209374208127',
          'do_112919459737640960131',
          'do_112919466507124736136',
          'do_112919472122994688143',
          'do_112919472750485504144',
          'do_1129215750255493121260',
          'do_1129216355260497921271',
          'do_1129217119647006721277',
          'do_1129217257548431361285',
          'do_1129217496636129281293',
          'do_1129217567501107201299',
          'do_1129217578454712321301',
          'do_1129217601580072961303',
          'do_1129217612088279041306',
          'do_1129218941725655041327',
          'do_1129218953177825281328',
          'do_1129252345028526081312',
          'do_11292652818540134415',
          'do_11292653409521664016',
          'do_11293016780395315211859',
          'do_11293016866687385611860',
          'do_11293017071063040011869',
          'do_11293018474324787211915',
          'do_11293018496140902411917',
          'do_11293018514821120011918',
          'do_11293018535984332811919',
          'do_11293023556153344011943',
          'do_11293024150850764811945'
        ],
        'children': [
          'do_112823236916731904167',
          'do_11282824293965824013.img',
          'do_112824662355910656184',
          'do_11282692248983961614',
          'do_11282692401699225616',
          'do_11282692280039833615'
        ],
        'code': 'org.sunbird.L1dreU',
        'compatibilityLevel': 1,
        'consumerId': '02bf5216-c947-492f-929b-af2e61ea78cd',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'contentTypesCount': '{\'TextBookUnit\':5,\'PracticeQuestionSet\':21}',
        'copyright': 'Sunbird',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'createdFor': [
          'ORG_001'
        ],
        'createdOn': '2019-05-17T11:46:56.218+0000',
        'creator': 'Creation',
        'depth': 0,
        'description': 'Enter description for TextBook',
        'dialcodeRequired': 'No',
        // tslint:disable-next-line:max-line-length
        'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639029040660481129/duurvaa-1hindhi_1566306817831_do_1127639029040660481129_2.0_spine.ecar',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'graph_id': 'domain',
        'idealScreenDensity': 'hdpi',
        'idealScreenSize': 'normal',
        'identifier': 'do_1127639029040660481129',
        'language': [
          'English'
        ],
        'lastPublishedBy': 'Ekstep',
        'lastPublishedOn': '2019-08-20T13:13:37.166+0000',
        'lastStatusChangedOn': '2019-05-17T11:46:56.218+0000',
        'lastUpdatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'lastUpdatedOn': '2019-11-05T06:34:01.034+0000',
        'leafNodes': [
          'do_11282824293965824013',
          'do_112824662355910656184',
          'do_11282692280039833615',
          'do_11282692248983961614',
          'do_112823236916731904167',
          'do_11282692401699225616'
        ],
        'leafNodesCount': 6,
        'license': 'CC BY-NC 4.0',
        'lockKey': '52cbdc14-c437-4628-b686-df69b7533ea5',
        'mediaType': 'content',
        'medium': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':5,\'application/vnd.ekstep.ecml-archive\':21}',
        'name': 'दूर्वा १(HINDHI)',
        'nodeType': 'DATA_NODE',
        'node_id': 257314,
        'objectType': 'Content',
        'organisation': [
          'Sunbird'
        ],
        'os': [
          'All'
        ],
        'osId': 'org.ekstep.quiz.app',
        'ownedBy': 'ORG_001',
        'owner': 'Sunbird',
        'ownershipType': [
          'createdFor'
        ],
        'pkgVersion': 2,
        'prevState': 'Retired',
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'reservedDialcodes': '{\'J9M1L7\':0,\'M8S8S6\':1,\'Z5E3H2\':2,\'K7E7U8\':3}',
        'resourceType': 'Book',
        's3Key': 'ecar_files/do_1127639029040660481129/duurvaa-1hindhi_1566306817831_do_1127639029040660481129_2.0_spine.ecar',
        'size': 147385,
        'status': 'Draft',
        'subject': [
          'Hindi'
        ],
        // tslint:disable-next-line:max-line-length
        'toc_url': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639029040660481129/artifact/do_1127639029040660481129_toc.json',
        'totalCompressedSize': 14319606,
        'variants': {
          'online': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639029040660481129/duurvaa-1hindhi_1566306818423_do_1127639029040660481129_2.0_online.ecar',
            'size': 8267
          },
          'spine': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639029040660481129/duurvaa-1hindhi_1566306817831_do_1127639029040660481129_2.0_spine.ecar',
            'size': 147385
          }
        },
        'version': 2,
        'versionKey': '1578490738385',
        'visibility': 'Default'
      },
      {
        'SYS_INTERNAL_LAST_UPDATED_ON': '2019-09-05T06:49:43.158+0000',
        'appId': 'dev.sunbird.portal',
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_11282824293965824013',
          'do_112824662355910656184',
          'do_1127639049671311361133',
          'do_1127639049671311361134',
          'do_11282692280039833615',
          'do_1127639049671229441132',
          'do_11282692248983961614',
          'do_112823236916731904167',
          'do_1127639049671147521131',
          'do_11282692401699225616',
          'do_1127639049671393281135'
        ],
        'children': [
          'do_112823236916731904167',
          'do_112824662355910656184',
          'do_11282824293965824013',
          'do_11282692248983961614',
          'do_11282692280039833615',
          'do_11282692401699225616',
          'do_11282824293965824013.img'
        ],
        'code': 'org.sunbird.L1dreU',
        'compatibilityLevel': 1,
        'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'contentTypesCount': '{\'TextBookUnit\':5,\'PracticeQuestionSet\':21}',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'createdFor': [
          'ORG_001'
        ],
        'createdOn': '2019-05-17T11:46:56.218+0000',
        'creator': 'Creation',
        'depth': 0,
        'description': 'Enter description for TextBook',
        'dialcodeRequired': 'No',
        // tslint:disable-next-line:max-line-length
        'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639029040660481129/duurvaa-1hindhi_1566306817831_do_1127639029040660481129_2.0_spine.ecar',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'graph_id': 'domain',
        'idealScreenDensity': 'hdpi',
        'idealScreenSize': 'normal',
        'identifier': 'do_1127639029040660481129',
        'language': [
          'English'
        ],
        'lastPublishedBy': 'Ekstep',
        'lastPublishedOn': '2019-08-20T13:13:37.166+0000',
        'lastStatusChangedOn': '2019-08-20T13:13:38.782+0000',
        'lastUpdatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'lastUpdatedOn': '2019-08-20T13:13:37.049+0000',
        'leafNodes': [
          'do_11282824293965824013',
          'do_112824662355910656184',
          'do_11282692280039833615',
          'do_11282692248983961614',
          'do_112823236916731904167',
          'do_11282692401699225616'
        ],
        'leafNodesCount': 6,
        'license': 'CC BY-NC 4.0',
        'lockKey': 'b695d9ac-fc36-4a14-a84f-7edfa734b028',
        'me_hierarchyLevel': 1,
        'me_totalDialcode': [],
        'me_totalDialcodeAttached': 0,
        'me_totalDialcodeLinkedToContent': 0,
        'mediaType': 'content',
        'medium': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':5,\'application/vnd.ekstep.ecml-archive\':21}',
        'name': 'दूर्वा १(HINDHI)',
        'nodeType': 'DATA_NODE',
        'node_id': 340251,
        'objectType': 'Content',
        'organisation': [
          'Sunbird'
        ],
        'os': [
          'All'
        ],
        'osId': 'org.ekstep.quiz.app',
        'ownedBy': 'ORG_001',
        'owner': 'Sunbird',
        'ownershipType': [
          'createdFor'
        ],
        'pkgVersion': 2,
        'prevState': 'Retired',
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'reservedDialcodes': '{\'J9M1L7\':0,\'M8S8S6\':1,\'Z5E3H2\':2,\'K7E7U8\':3}',
        'resourceType': 'Book',
        's3Key': 'ecar_files/do_1127639029040660481129/duurvaa-1hindhi_1566306817831_do_1127639029040660481129_2.0_spine.ecar',
        'size': 147385,
        'status': 'Live',
        'subject': [
          'Hindi'
        ],
        // tslint:disable-next-line:max-line-length
        'toc_url': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639029040660481129/artifact/do_1127639029040660481129_toc.json',
        'totalCompressedSize': 14319606,
        'variants': {
          'online': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639029040660481129/duurvaa-1hindhi_1566306818423_do_1127639029040660481129_2.0_online.ecar',
            'size': 8267
          },
          'spine': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639029040660481129/duurvaa-1hindhi_1566306817831_do_1127639029040660481129_2.0_spine.ecar',
            'size': 147385
          }
        },
        'version': 2,
        'versionKey': '1566306817115',
        'visibility': 'Default'
      },
      {
        'IL_FUNC_OBJECT_TYPE': 'ContentImage',
        'IL_SYS_NODE_TYPE': 'DATA_NODE',
        'IL_UNIQUE_ID': 'do_1127639035982479361130.img',
        'SYS_INTERNAL_LAST_UPDATED_ON': '2019-08-26T09:41:20.297+0000',
        // tslint:disable-next-line:max-line-length
        'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
        'appId': 'local.sunbird.portal',
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_112826840689098752111',
          'do_11279556310753280014',
          'do_11279353513366323215',
          'do_112797174230728704170',
          'do_112820491293908992121',
          'do_11279367659199692813',
          'do_11290603355578368016',
          'do_11279635898249216014683',
          'do_112826841100484608124',
          'do_112826840388190208110',
          'do_112826841290416128130',
          'do_1127639059664568321137',
          'do_112797032751767552150',
          'do_1127639059664568321139',
          'do_112826841100476416123',
          'do_1127639059664568321138',
          'do_112826840879243264116',
          'do_11290603551222988817',
          'do_112811873171980288120',
          'do_112826840689131520113',
          'do_112818415558950912110',
          'do_112811874710372352122',
          'do_112826841100468224122',
          'do_112826840879267840119',
          'do_112826841100460032121',
          'do_112826840879259648118',
          'do_112797205316706304173',
          'do_112826840689123328112',
          'do_112826840879251456117',
          'do_112826840689147904114',
          'do_11282693664029900817',
          'do_112826841290342400126',
          'do_11279633668861952013',
          'do_112826841290350592127',
          'do_112826844505620480132',
          'do_11281839665374003214',
          'do_112826841290399744129',
          'do_11282684038818201619',
          'do_11282684038818201618',
          'do_1127639059664486401136',
          'do_112826841290391552128',
          'do_1127639059664650241140',
          'do_1127639059664650241141',
          'do_112826840879276032120',
          'do_112826841100492800125',
          'do_11282684038817382417',
          'do_112797719109984256198',
          'do_112826840689156096115',
          'do_1129104073779118081978',
          'do_1129104075448074241979',
          'do_11291046174869913611313',
          'do_1129144352319897601382',
          'do_112914660209328128144',
          'do_112914664091189248193',
          'do_1129146661309972481114',
          'do_1129146741155840001182',
          'do_1129146753312849921183',
          'do_1129151320090869761475',
          'do_1129151351292805121477',
          'do_11291541287374848012',
          'do_11291548302294220814',
          'do_11291548349731635215',
          'do_11291548447943065616',
          'do_11291548488472166417',
          'do_11291548681656729618',
          'do_1129159022304215041505',
          'do_1129159369778708481511',
          'do_1129159422298849281584',
          'do_1129159428783472641593',
          'do_1129159442250219521604',
          'do_1129159493116968961648',
          'do_1129159518302453761663',
          'do_11291595244307251218',
          'do_1129159525832540161668',
          'do_1129159591811072001700',
          'do_1129159650585559041744',
          'do_1129159662255390721761',
          'do_1129159676961259521782',
          'do_1129159704054251521784',
          'do_1129159874804776961789',
          'do_11291598724622745619',
          'do_1129159880876769281790',
          'do_1129159916293406721792',
          'do_1129160040528855041796',
          'do_1129160043834163201797',
          'do_112916006512353280111',
          'do_1129160112596582401801',
          'do_1129160132426792961803',
          'do_1129160139703500801804',
          'do_1129160150910730241805',
          'do_1129160153717145601806',
          'do_1129160167987445761807',
          'do_1129160180120616961808',
          'do_1129160196729733121810',
          'do_1129160229804769281811',
          'do_1129160231318978561812',
          'do_1129160296728002561814',
          'do_1129160309864448001815',
          'do_1129160311353180161816',
          'do_1129160326905036801818',
          'do_112916032272457728117',
          'do_1129160338446909441819',
          'do_1129160339452968961820',
          'do_1129160341391523841821',
          'do_1129160343124541441822',
          'do_1129160344171642881823',
          'do_1129160358824427521826',
          'do_1129160363187568641827',
          'do_1129160370846760961828',
          'do_112916040320122880120',
          'do_112916042250690560121',
          'do_1129160456852930561836',
          'do_1129160463753216001837',
          'do_1129160465564221441838',
          'do_1129160487850967041840',
          'do_112916048449880064123',
          'do_112916048340615168122',
          'do_1129160543967232001842',
          'do_1129160589222543361846',
          'do_1129160596775731201848',
          'do_1129160620481249281850',
          'do_1129160628683735041852',
          'do_1129160650423418881856',
          'do_1129160652183879681857',
          'do_1129160683244994561859',
          'do_1129160686721515521860',
          'do_1129160699695841281861',
          'do_1129160742515752961863',
          'do_1129160770456125441866',
          'do_1129160813395968001870',
          'do_1129160901319720961872',
          'do_1129160939169546241875',
          'do_11291611961664307212',
          'do_11291621600370688013',
          'do_11291621749135769614',
          'do_1129166189856358401262',
          'do_1129166199171235841263',
          'do_1129166200559616001264',
          'do_1129166242061434881267',
          'do_1129166243894886401268',
          'do_1129166268439265281270',
          'do_1129166279846215681272',
          'do_11291664078186086414',
          'do_11291666735588147215',
          'do_112916695864033280111',
          'do_112916703555026944114',
          'do_112916704491831296115',
          'do_112916704809680896116',
          'do_112916705905336320117',
          'do_1129172859338014721262',
          'do_1129173552332800001277',
          'do_1129173560843386881278',
          'do_1129173571989340161279',
          'do_1129173649284136961288',
          'do_1129173723970191361296',
          'do_1129173825944616961305',
          'do_1129173836462653441309',
          'do_1129173837298810881310',
          'do_1129173838089338881311',
          'do_1129173844014202881312',
          'do_1129173853457776641313',
          'do_1129173911156080641314',
          'do_1129173919327764481315',
          'do_1129173970048532481317',
          'do_1129174091422679041318',
          'do_1129174157449134081324',
          'do_1129174185663365121327',
          'do_1129174216023490561329',
          'do_1129174218423828481330',
          'do_1129174288590520321336',
          'do_1129174608701276161366',
          'do_1129175312146350081431',
          'do_11291841881701580811005',
          'do_11291842112112230411028',
          'do_11291943965573120015',
          'do_11291944125215539216',
          'do_112919459168509952128',
          'do_112919465367633920135',
          'do_112919490041094144147',
          'do_112919513128378368150',
          'do_112919517693476864152',
          'do_112919533263273984162',
          'do_112919518619688960154',
          'do_112919554164596736173',
          'do_112919625582919680189',
          'do_112919628453183488190',
          'do_112920371666075648141',
          'do_11291047154735513611359',
          'do_1129216846547353601274',
          'do_1129252285729095681306',
          'do_11292664221472358417',
          'do_11292664329691136018',
          'do_11292932241693081611008',
          'do_11292932255763660811009',
          'do_11293017362698240011877',
          'do_11293019902063411211926',
          'do_112930973147029504127',
          'do_112930997454864384150',
          'do_112931000412651520151'
        ],
        'code': 'org.sunbird.L9HqTc',
        'compatibilityLevel': 1,
        'consumerId': '02bf5216-c947-492f-929b-af2e61ea78cd',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'contentTypesCount': '{\'TextBookUnit\':31,\'PracticeQuestionSet\':17,\'Resource\':14}',
        'copyright': 'Sunbird',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'createdFor': [
          'ORG_001'
        ],
        'createdOn': '2019-05-17T11:48:20.958+0000',
        'creator': 'Creation',
        'depth': 0,
        'description': 'Enter description for TextBook',
        'dialcodeRequired': 'No',
        // tslint:disable-next-line:max-line-length
        'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639035982479361130/baal-raamkthaahindhi_1566812477786_do_1127639035982479361130_6.0_spine.ecar',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'graph_id': 'domain',
        'idealScreenDensity': 'hdpi',
        'idealScreenSize': 'normal',
        'identifier': 'do_1127639035982479361130',
        'language': [
          'English'
        ],
        'lastPublishedBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
        'lastPublishedOn': '2019-08-26T09:41:15.921+0000',
        'lastStatusChangedOn': '2019-08-26T09:41:12.165+0000',
        'lastSubmittedOn': '2019-08-26T09:40:49.476+0000',
        'lastUpdatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'lastUpdatedOn': '2019-12-04T07:16:29.624+0000',
        'leafNodes': [
          'do_112811875306283008124',
          'do_112797205316706304173',
          'do_11279556310753280014',
          'do_112811873171980288120',
          'do_11279353513366323215',
          'do_112797174230728704170',
          'do_112820491293908992121',
          'do_112796495372263424117',
          'do_11279367659199692813',
          'do_112818415558950912110',
          'do_112811874710372352122',
          'do_11282824293965824013',
          'do_11279635898249216014683',
          'do_11282693664029900817',
          'do_112797666259697664181',
          'do_112797032751767552150',
          'do_11279633668861952013',
          'do_11281839665374003214',
          'do_112797719109984256198'
        ],
        'leafNodesCount': 19,
        'license': 'CC BY-NC 4.0',
        'lockKey': 'b554891e-3441-46ee-8b41-39f1b3b20aca',
        'mediaType': 'content',
        'medium': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':31,\'application/vnd.ekstep.ecml-archive\':31}',
        'name': 'बाल रामकथा(HINDHI)',
        'nodeType': 'DATA_NODE',
        'node_id': 358410,
        'objectType': 'Content',
        'organisation': [
          'Sunbird'
        ],
        'os': [
          'All'
        ],
        'osId': 'org.ekstep.quiz.app',
        'ownedBy': 'ORG_001',
        'owner': 'Sunbird',
        'ownershipType': [
          'createdFor'
        ],
        'pkgVersion': 6,
        // tslint:disable-next-line:max-line-length
        'posterImage': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112713623365697536111/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.jpg',
        'prevState': 'Review',
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'reservedDialcodes': '{\'W3S7T4\':1,\'S9U6L5\':0}',
        'resourceType': 'Book',
        's3Key': 'ecar_files/do_1127639035982479361130/baal-raamkthaahindhi_1566812477786_do_1127639035982479361130_6.0_spine.ecar',
        'size': 387471,
        'status': 'Draft',
        'subject': [
          'Hindi'
        ],
        // tslint:disable-next-line:max-line-length
        'toc_url': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/do_1127639035982479361130_toc.json',
        'totalCompressedSize': 16777713,
        'variants': {
          'online': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639035982479361130/baal-raamkthaahindhi_1566812479755_do_1127639035982479361130_6.0_online.ecar',
            'size': 18461
          },
          'spine': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639035982479361130/baal-raamkthaahindhi_1566812477786_do_1127639035982479361130_6.0_spine.ecar',
            'size': 387471
          }
        },
        'version': 2,
        'versionKey': '1578491301573',
        'visibility': 'Default'
      },
      {
        'SYS_INTERNAL_LAST_UPDATED_ON': '2019-08-26T09:41:20.297+0000',
        // tslint:disable-next-line:max-line-length
        'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.thumb.jpg',
        'appId': 'dev.sunbird.portal',
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_112826840689098752111',
          'do_11279556310753280014',
          'do_11279353513366323215',
          'do_112797174230728704170',
          'do_112820491293908992121',
          'do_11279367659199692813',
          'do_11279635898249216014683',
          'do_112826841100484608124',
          'do_112826840388190208110',
          'do_112826841290416128130',
          'do_1127639059664568321137',
          'do_112797032751767552150',
          'do_1127639059664568321139',
          'do_112826841100476416123',
          'do_1127639059664568321138',
          'do_112826840879243264116',
          'do_112811873171980288120',
          'do_112826840689131520113',
          'do_112818415558950912110',
          'do_112811874710372352122',
          'do_112826841100468224122',
          'do_112826840879267840119',
          'do_112826841100460032121',
          'do_112826840879259648118',
          'do_112797205316706304173',
          'do_112826840689123328112',
          'do_112826840879251456117',
          'do_112826840689147904114',
          'do_11282693664029900817',
          'do_112826841290342400126',
          'do_11279633668861952013',
          'do_112826841290350592127',
          'do_112826844505620480132',
          'do_11281839665374003214',
          'do_112826841290399744129',
          'do_11282684038818201619',
          'do_112811875306283008124',
          'do_11282684038818201618',
          'do_1127639059664486401136',
          'do_112796495372263424117',
          'do_11282824293965824013',
          'do_112826841290391552128',
          'do_1127639059664650241140',
          'do_1127639059664650241141',
          'do_112797666259697664181',
          'do_112826840879276032120',
          'do_112826841100492800125',
          'do_11282684038817382417',
          'do_112797719109984256198',
          'do_112826840689156096115'
        ],
        'children': [
          'do_11282824293965824013',
          'do_11282693664029900817',
          'do_11279633668861952013',
          'do_11279635898249216014683',
          'do_112797205316706304173',
          'do_11279367659199692813',
          'do_11279556310753280014',
          'do_112796495372263424117',
          'do_112811875306283008124',
          'do_112797032751767552150',
          'do_11281839665374003214',
          'do_112811873171980288120',
          'do_112811874710372352122',
          'do_112818415558950912110',
          'do_11279353513366323215',
          'do_112797666259697664181',
          'do_112797174230728704170',
          'do_112820491293908992121',
          'do_112797719109984256198',
          'do_11282824293965824013.img'
        ],
        'code': 'org.sunbird.L9HqTc',
        'compatibilityLevel': 1,
        'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'contentTypesCount': '{\'TextBookUnit\':31,\'PracticeQuestionSet\':17,\'Resource\':14}',
        'copyright': 'Sunbird',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'createdFor': [
          'ORG_001'
        ],
        'createdOn': '2019-05-17T11:48:20.958+0000',
        'creator': 'Creation',
        'depth': 0,
        'description': 'Enter description for TextBook',
        'dialcodeRequired': 'No',
        // tslint:disable-next-line:max-line-length
        'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639035982479361130/baal-raamkthaahindhi_1566812477786_do_1127639035982479361130_6.0_spine.ecar',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'graph_id': 'domain',
        'idealScreenDensity': 'hdpi',
        'idealScreenSize': 'normal',
        'identifier': 'do_1127639035982479361130',
        'language': [
          'English'
        ],
        'lastPublishedBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
        'lastPublishedOn': '2019-08-26T09:41:15.921+0000',
        'lastStatusChangedOn': '2019-08-26T09:41:12.165+0000',
        'lastSubmittedOn': '2019-08-26T09:40:49.476+0000',
        'lastUpdatedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'lastUpdatedOn': '2019-08-26T09:41:12.334+0000',
        'leafNodes': [
          'do_112811875306283008124',
          'do_112797205316706304173',
          'do_11279556310753280014',
          'do_112811873171980288120',
          'do_11279353513366323215',
          'do_112797174230728704170',
          'do_112820491293908992121',
          'do_112796495372263424117',
          'do_11279367659199692813',
          'do_112818415558950912110',
          'do_112811874710372352122',
          'do_11282824293965824013',
          'do_11279635898249216014683',
          'do_11282693664029900817',
          'do_112797666259697664181',
          'do_112797032751767552150',
          'do_11279633668861952013',
          'do_11281839665374003214',
          'do_112797719109984256198'
        ],
        'leafNodesCount': 19,
        'license': 'CC BY-NC 4.0',
        'lockKey': 'b554891e-3441-46ee-8b41-39f1b3b20aca',
        'me_hierarchyLevel': 1,
        'me_totalDialcode': [],
        'me_totalDialcodeAttached': 0,
        'me_totalDialcodeLinkedToContent': 0,
        'mediaType': 'content',
        'medium': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\':31,\'application/vnd.ekstep.ecml-archive\':31}',
        'name': 'बाल रामकथा(HINDHI)',
        'nodeType': 'DATA_NODE',
        'node_id': 339862,
        'objectType': 'Content',
        'organisation': [
          'Sunbird'
        ],
        'os': [
          'All'
        ],
        'osId': 'org.ekstep.quiz.app',
        'ownedBy': 'ORG_001',
        'owner': 'Sunbird',
        'ownershipType': [
          'createdFor'
        ],
        'pkgVersion': 6,
        // tslint:disable-next-line:max-line-length
        'posterImage': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112713623365697536111/artifact/photo-1457383457550-47a5cfdbab17_1551955977794.jpg',
        'prevState': 'Review',
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'reservedDialcodes': '{\'W3S7T4\':1,\'S9U6L5\':0}',
        'resourceType': 'Book',
        's3Key': 'ecar_files/do_1127639035982479361130/baal-raamkthaahindhi_1566812477786_do_1127639035982479361130_6.0_spine.ecar',
        'size': 387471,
        'status': 'Live',
        'subject': [
          'Hindi'
        ],
        // tslint:disable-next-line:max-line-length
        'toc_url': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127639035982479361130/artifact/do_1127639035982479361130_toc.json',
        'totalCompressedSize': 16777713,
        'variants': {
          'online': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639035982479361130/baal-raamkthaahindhi_1566812479755_do_1127639035982479361130_6.0_online.ecar',
            'size': 18461
          },
          'spine': {
            // tslint:disable-next-line:max-line-length
            'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127639035982479361130/baal-raamkthaahindhi_1566812477786_do_1127639035982479361130_6.0_spine.ecar',
            'size': 387471
          }
        },
        'version': 2,
        'versionKey': '1566812473559',
        'visibility': 'Default'
      }
    ],
    'count': 7
  },
  'ts': '2020-01-09T04:40:30.356Z',
  'ver': '1.0'
}
];

