// tslint:disable:max-line-length
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
    'programId': 'a5cc51e0-254a-11ea-bc92-117418635631',
    'config': {
      '_comments': '',
      'loginReqired': true,
      'framework': 'NCFCOPY',
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
                  'defaultValue': [
                    'English'
                  ],
                  'label': 'Medium'
                }
              ],
              'explicit': [
                {
                  'code': 'gradeLevel',
                  'range': [
                    'Kindergarten',
                    'Grade 1',
                    'Grade 2',
                    'Grade 3'
                  ],
                  'label': 'Class',
                  'multiselect': false,
                  'defaultValue': [
                    'Kindergarten',
                    'Grade 1'
                  ],
                  'visibility': true
                },
                {
                  'code': 'subject',
                  'range': [
                    'English',
                    'Mathematics',
                    'Hindi'
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
                  'id': 'explanationContent',
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
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31280847585016217619710/artifact/explanation.thumb.png',
                    'marks': 5
                  },
                  'filesConfig': {
                    'accepted': 'pdf',
                    'size': '50'
                  }
                },
                {
                  'id': 'experientialContent',
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
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31280561379920281615017/artifact/experiential.thumb.png',
                    'marks': 5
                  },
                  'filesConfig': {
                    'accepted': 'mp4',
                    'size': '50'
                  }
                },
                {
                  'id': 'focusSpotContent',
                  'label': 'FocusSpot',
                  'onClick': 'uploadComponent',
                  'mimeType': [
                    'application/pdf'
                  ],
                  'metadata': {
                    'name': 'FocusSpot Resource',
                    'description': 'FocusSpot',
                    'resourceType': 'Read',
                    'contentType': 'FocusSpot',
                    'audience': [
                      'Learner'
                    ],
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31291455031832576019477/artifact/3_1535000262441.thumb.png',
                    'marks': 5
                  },
                  'filesConfig': {
                    'accepted': 'pdf',
                    'size': '50'
                  }
                },
                {
                  'id': 'vsaPracticeQuestionContent',
                  'label': 'VSA - Practice Sets',
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
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'vsa'
                  ]
                },
                {
                  'id': 'saPracticeQuestionContent',
                  'label': 'SA - Practice Sets',
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
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'sa'
                  ]
                },
                {
                  'id': 'laPracticeQuestionContent',
                  'label': 'LA - Practice Sets',
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
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'la'
                  ]
                },
                {
                  'id': 'mcqPracticeQuestionContent',
                  'label': 'MCQ - Practice Sets',
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
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'mcq'
                  ]
                },
                {
                  'id': 'curiositySetContent',
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
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
                    'marks': 5
                  },
                  'questionCategories': [
                    'curiosity'
                  ]
                }
              ],
              'defaultValue': [
                {
                  'id': 'vsaPracticeQuestionContent',
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
                    'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
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
                'description': 'Learning Level For The Content',
                'editable': true,
                'inputType': 'select',
                'label': 'Learning Level',
                'name': 'LearningLevel',
                'placeholder': 'Select Learning Levels',
                'required': true,
                'visible': true,
                'defaultValue': [
                  'remember',
                  'understand',
                  'apply',
                  'analyse',
                  'evaluate',
                  'create'
                ]
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
            ],
            'resourceTitleLength': '200',
            'tenantName': 'SunbirdEd'
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
                  'code': 'bloomsLevel',
                  'dataType': 'list',
                  'description': 'Learning Level For The Content',
                  'editable': true,
                  'inputType': 'multiselect',
                  'label': 'Learning Level',
                  'name': 'LearningLevel',
                  'placeholder': 'Select Learning Levels',
                  'required': true,
                  'visible': true,
                  'defaultValue': [
                      'remember',
                      'understand',
                      'apply',
                      'analyse',
                      'evaluate',
                      'create'
                  ]
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
          ],
            'resourceTitleLength': '200',
            'tenantName': '',
            'assetConfig': {
              'image': {
                    'size': '50',
                    'accepted': 'png, jpeg, jpg'
              },
              'video': {
                    'size': '50',
                    'accepted': 'pdf, mp4, webm, youtube'
              }
            }
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
        'showCountPanel': {
          'roles': [
            1,
            2
          ]
        },
        'showContribution': {
            'roles': [
                1
            ]
        },
        'showUpforReview': {
            'roles': [
                2
            ]
        },
        'showTotalContribution': {
          'roles': [
            1
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
        'showAawaitingReview': {
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
        'showAddResource': {
          'roles': [
            1
          ]
        },
        'showEditResource': {
          'roles': [
            1
          ]
        },
        'showMoveResource': {
          'roles': [
            1
          ]
        },
        'showDeleteResource': {
          'roles': [
            1
          ]
        },
        'showPreviewResource': {
          'roles': [
            2
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
        },
        'showSave': {
          'roles': [
            1
          ]
        },
        'showEdit': {
          'roles': [
            1
          ]
        },
        'showChangeFile': {
          'roles': [
            1
          ]
        },
        'showRequestChanges': {
          'roles': [
            2
          ]
        },
        'showPublish': {
          'roles': [
            2
          ]
        },
        'showSubmit': {
          'roles': [
            1
          ]
        },
        'showCreatorView': {
          'roles': [
            1
          ]
        },
        'showReviewerView': {
          'roles': [
            2
          ]
        },
        'showCreateQuestion': {
          'roles': [
              1
          ]
        },
        'showDeleteQuestion': {
            'roles': [
                1
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
    'description': 'CBSE program',
    'name': 'CBSE',
    'rootOrgId': 'ORG_001',
    'rootOrgName': 'test Rootorg',
    'slug': 'sunbird',
    'startDate': '2019-12-20T07:20:30.000Z',
    'type': 'private'
};


// export let programSession = programOneSession;
export let programSession = programThirdSession;
