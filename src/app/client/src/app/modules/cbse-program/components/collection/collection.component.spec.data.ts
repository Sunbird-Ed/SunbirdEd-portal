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
      'actions': {},
      'components': [],
      'framework': 'NCFCOPY',
      'header': {
      },
      'loginReqired': true,
      'onBoardingForm': {
        'action': 'onboard',
        'fields': [
        ],
        'templateName': 'onBoardingForm'
      },
      'roles': [],
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
    }
  },
  'sessionContext': {
    'framework': 'NCFCOPY',
    'frameworkData': []
  },
  'userProfile': {}
};
export const programSession =  {
  'programId': '217bddc0-df59-11e9-8d82-2b7f2cdfa2fd',
  'description': 'Test Prep program',
  'name': 'Test Prep',
  'creator': 'Rayulu',
  'startDate': '2019-09-25T12:50:30.000Z',
  'endDate': null,
  'status': null,
  'roles': [],
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
  'components': [],
  'actions': {},
  'onBoardingForm': { }
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
  }
];

