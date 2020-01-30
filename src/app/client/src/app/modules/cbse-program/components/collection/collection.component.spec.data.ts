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
    'name': 'Filter Check Program',
    'programId': '18cc8a70-2889-11ea-9bc0-fd6cea67ce9f',
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
  'userProfile': {
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
    'promptTnC': false,
    'provider': null,
    'recoveryEmail': 'ab*@yopmail.com',
    'recoveryPhone': '',
    'registryId': null,
    'roles': [
      'public'
    ],
    'rootOrg': {
      'addressId': null,
      'approvedBy': null,
      'approvedDate': null,
      'channel': 'ROOT_ORG',
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
  }
];

export const searchCollectionResponse = {
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
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_1127639026795151361126',
        ],
        'contentType': 'TextBook',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'creator': 'Creation',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'identifier': 'do_1127638981486755841123',
        'language': [
          'English'
        ],
        'license': 'CC BY-NC 4.0',
        // tslint:disable-next-line:max-line-length
        'licenseterms': 'By creating and uploading content on DIKSHA, you consent to publishing this content under the Creative Commons Framework, specifically under the CC-BY-SA 4.0 license.',
        'lockKey': '1dcf80a7-2c0a-4aec-99da-ef3dbce16976',
        'mediaType': 'content',
        'medium': [
          'English'
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
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_1127639026795151361126',
        ],
        'contentType': 'TextBook',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'creator': 'Creation',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'identifier': 'do_1127638981486755841123',
        'language': [
          'English'
        ],
        'license': 'CC BY-NC 4.0',
        // tslint:disable-next-line:max-line-length
        'licenseterms': 'By creating and uploading content on DIKSHA, you consent to publishing this content under the Creative Commons Framework, specifically under the CC-BY-SA 4.0 license.',
        'lockKey': '1dcf80a7-2c0a-4aec-99da-ef3dbce16976',
        'mediaType': 'content',
        'medium': [
          'English'
        ],
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'resourceType': 'Book',
        'status': 'Review',
        'subject': [
          'Math'
        ],
        'version': 2,
        'versionKey': '1578505320318',
        'visibility': 'Default'
      },
      {
        'audience': [
          'Learner'
        ],
        'author': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'board': 'NCERT',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'childNodes': [
          'do_1127639026795151361126',
        ],
        'contentType': 'TextBook',
        'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        'creator': 'Creation',
        'framework': 'NCFCOPY',
        'gradeLevel': [
          'Kindergarten'
        ],
        'identifier': 'do_1127638981486755841121',
        'language': [
          'English'
        ],
        'license': 'CC BY-NC 4.0',
        // tslint:disable-next-line:max-line-length
        'licenseterms': 'By creating and uploading content on DIKSHA, you consent to publishing this content under the Creative Commons Framework, specifically under the CC-BY-SA 4.0 license.',
        'lockKey': '1dcf80a7-2c0a-4aec-99da-ef3dbce16976',
        'mediaType': 'content',
        'medium': [
          'Kannada'
        ],
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'resourceType': 'Book',
        'status': 'Review',
        'subject': [
          'Kannada'
        ],
        'version': 2,
        'versionKey': '1578505320318',
        'visibility': 'Default'
      }
    ],
    'count': 7
  },
  'ts': '2020-01-09T04:40:30.356Z',
  'ver': '1.0'
};

