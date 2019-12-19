
const programOneSession = {
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
              'defaultValue': 'ekstep_ncert_k-12',
              'label': 'Framework',
              'visibility': false
            },
            {
              'code': 'board',
              'defaultValue': 'CBSE',
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

const programTwoSession = {
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
          'onClick': 'dashboardComponent'
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
              'onClick': 'uploadComponent',
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
              'onClick': 'uploadComponent',
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
              'onClick': 'practiceSetComponent',
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


const programThirdSession = {
  'programId': '832321a0-1758-11ea-b76c-a10ab14aaad6',
  'config': {
    '_comments': '',
    'loginReqired': true,
    'roles': [
      {
        'id': 1,
        'name': 'CONTRIBUTOR',
        'default': true,
        'defaultTab': 1,
        'tabs': [
          1
        ]
      },
      {
        'id': 2,
        'name': 'REVIEWER',
        'defaultTab': 2,
        'tabs': [
          2
        ]
      }
    ],
    'header': {
      'id': 'ng.sunbird.header',
      'ver': '1.0',
      'compId': 'headerComp',
      'author': 'Venkat',
      'description': '',
      'publishedDate': '',
      'data': {},
      'config': {
        'tabs': [
          {
            'index': 1,
            'label': 'Contribute',
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
                'label': 'Framework'
              },
              {
                'code': 'board',
                'defaultValue': 'NCERT',
                'label': 'Board'
              },
              {
                'code': 'medium',
                'defaultValue': 'English',
                'label': 'Medium'
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
            'value': 'subject',
            'defaultValue': 'subject'
          },
          'collectionType': 'Textbook',
          'collectionList': [],
          'status': [
            'Draft',
            'Live'
          ]
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
                'label': 'Explanation',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf'
                ],
                'metadata': {
                  'name': 'Explanation Resource',
                  'description': 'ExplanationResource',
                  'resourceType': 'Read',
                  'contentType': 'ExplanationResource',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf',
                  'size': '50'
                }
              },
              {
                'label': 'Experiential',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'video/mp4'
                ],
                'metadata': {
                  'name': 'Experiential Resource',
                  'description': 'ExperientialResource',
                  'resourceType': 'Read',
                  'contentType': 'ExperientialResource',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'mp4',
                  'size': '50'
                }
              },
              {
                'label': 'FocusSpot',
                'onClick': 'uploadComponent',
                'mimeType': [
                  'application/pdf'
                ],
                'metadata': {
                  'name': 'FocusSpot Resoirce',
                  'description': 'FocusSpot',
                  'resourceType': 'Read',
                  'contentType': 'FocusSpot',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553100098764812/artifact/focus-spot_1561727473311.thumb_1576602905573.png',
                  'marks': 5
                },
                'filesConfig': {
                  'accepted': 'pdf',
                  'size': '50'
                }
              },
              {
                'label': 'Practice Sets',
                'onClick': 'questionSetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Practice QuestionSet',
                  'description': 'Practice QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'PracticeQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'vsa'
                ]
              },
              {
                'label': 'Curiosity Sets',
                'onClick': 'curiositySetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Curiosity QuestionSet',
                  'description': 'Curiosity QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'CuriosityQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'Curiosity'
                ]
              }
            ],
            'defaultValue': [
              {
                'label': 'Practice Sets',
                'onClick': 'questionSetComponent',
                'mimeType': [
                  'application/vnd.ekstep.ecml-archive'
                ],
                'metadata': {
                  'name': 'Practice QuestionSet',
                  'description': 'Practice QuestionSet',
                  'resourceType': 'Learn',
                  'contentType': 'PracticeQuestionSet',
                  'audience': [
                    'Learner'
                  ],
                  'appIcon': '',
                  'marks': 5
                },
                'questionCategories': [
                  'vsa'
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
    },
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
  'description': 'Test Prep program',
  'endDate': null,
  'name': 'Test Prep',
  'slug': 'sunbird',
  'startDate': '2019-12-05T00:00:00.000Z',
  'status': null,
  'type': 'private'
};


// export let programSession = programOneSession;
export let programSession = programThirdSession;
