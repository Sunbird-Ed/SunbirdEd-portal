export const Response = {
    successData: {
       'id': 'api.page.assemble',
       'params': {
            'err': null,
            'errmsg' : null,
            'msgid' : '31df557d-ce56-e489-9cf3-27b74c90a920',
            'resmsgid' : null,
            'status' : 'success'},
       'responseCode': 'OK',
       'result': {
           'response': {
                'id': '0122838911932661768',
                'name': 'Course',
                'sections': [
                    {
                        'name': 'Multiple Data',
                        'length': 1,
                        'contents': [{
                             'name': 'Test1182016-02',
                            'description': 'Test',
                            'rating': 3,
                            'identifier': 'do_2123412199319552001265'
                    }]
                }]
            }
        }
    },
    noData: {
        'id': 'api.page.assemble',
        'params': {
             'err': null,
             'errmsg' : null,
             'msgid' : '31df557d-ce56-e489-9cf3-27b74c90a920',
             'resmsgid' : null,
             'status' : 'success'},
        'responseCode': 'OK',
        'result': {
            'response': {
                 'id': '0122838911932661768',
                 'name': 'Course',
                 'sections': []
             }
         }
     },
    courseSuccess: {
        'id': 'api.course.getbyuser', 'params': {
            'resmsgid': 'null', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
            'status': 'success', 'err': 'null', 'errmsg': 'null'
        }, 'responseCode': 'OK',
        'result': {
            'courses': [
                 {
                    'active': 'true', 'courseId': 'do_2123412199319552001265', 'courseName': '27-sept',
                    'description': 'test', 'leafNodesCount': '0', 'progress': '0', 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }]
        }
    },
    enrolledCourses: [
          {
            'dateTime': null,
            'lastReadContentStatus': null,
            'enrolledDate': '2019-03-05 11:06:54:750+0000',
            'addedBy': null,
            'contentId': 'do_21270640678434406411819',
            'batch': {
              'identifier': '0127122190812528640',
              'endDate': '2019-04-30',
              'createdBy': '5a850e24-fc96-4bab-9248-bda165efae80',
              'name': 'upcoming ',
              'batchId': '0127122190812528640',
              'enrollmentType': 'invite-only',
              'startDate': '2019-04-01',
              'status': 2
            },
            'active': true,
            'description': 'Sample Slate',
            'courseLogoUrl': 'https://preprodall.blob.core.windows.net/ntp-content-preprod/content/do_21270640678434406411819/artifact/book-image_1549031828330.thumb.jpg',
            'batchId': '0127122190812528640',
            'userId': '0b96635f-fe2b-4ab0-a511-05cfce8faa3f',
            'content': {
              'identifier': 'do_21270640678434406411819',
              'orgDetails': {
                'orgName': 'First Org',
                'email': null
              },
              'subject': [
                'Chemistry'
              ],
              'channel': '0126825293972439041',
              'description': 'Sample Slate',
              'mimeType': 'application/vnd.ekstep.content-collection',
              'medium': [
                'English'
              ],
              'pkgVersion': 1,
              'objectType': 'Content',
              'gradeLevel': [
                'Class 1'
              ],
              'appIcon': 'https://preprodall.blob.core.windows.net/ntp-content-preprod/content/do_21270640678434406411819/artifact/book-image_1549031828330.thumb.jpg',
              'leafNodesCount': 1,
              'name': 'Neurology ',
              'topic': [
                'Science'
              ],
              'contentType': 'Course',
              'resourceType': 'Course'
            },
            'contentStatus': {
            },
            'completionPercentage': null,
            'courseName': 'Neurology ',
            'certificates': [
            ],
            'completedOn': null,
            'leafNodesCount': 1,
            'progress': 0,
            'lastReadContentId': null,
            'courseId': 'do_21270640678434406411819',
            'status': 1
          }
        ],
    noCourses: {'id': 'api.course.getbyuser', 'params': {
        'resmsgid': 'null', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
        'status': 'success', 'err': 'null', 'errmsg': 'null'
    }, 'responseCode': 'OK',
    'result': {
        'courses': [
             ]
    }
},
sameIdentifier: {
    'enrolledCourses': [
        {
            'courseId': 'do_2123412199319552001265', 'courseName': '27-sept',
            'description': 'test', 'leafNodesCount': 0, 'progress': 0, 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
        }
    ]
},
errorCourse: {'id': 'api.course.getbyuser', 'params': {
    'resmsgid': 'UnAutorized', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
    'status': 'UnAutorized', 'err': 'UnAutorized', 'errmsg': 'UnAutorized'
}, 'responseCode': 'Err',
'result': {'courses': [
]
}
},
event: [
    {
      'name': 'flag test',
      'image': 'https://ekstep-public-dev.s32.thumb.jpeg',
      'description': '',
      'rating': '0',
      'action': {
        'right': {
          'class': 'ui blue basic button',
          'eventName': 'Resume',
          'displayType': 'button',
          'text': 'Resume'
        },
        'onImage': {
          'eventName': 'onImage'
        }
      },
      'metaData': {
        'batchId': '01250987188871168027',
        'courseId': 'do_112499049696583680148'
      },
      'maxCount': 0,
      'progress': 0,
      'section': 'My Trainings'
    },
    {
      'name': 'AAAA',
      'image': 'https://ekstep-publit/short_stories_lionandmouse3_1467102846349.thumb.jpg',
      'description': 'Untitled Collection',
      'rating': '0',
      'action': {
        'right': {
          'class': 'ui blue basic button',
          'eventName': 'Resume',
          'displayType': 'button',
          'text': 'Resume'
        },
        'onImage': {
          'eventName': 'onImage'
        }
      },
      'metaData': {
        'batchId': '01251320263126220811',
        'courseId': 'do_1125131909441945601309'
      },
      'maxCount': 4,
      'progress': 0,
      'section': 'My Trainings'
    }
  ],
  event1: [
    {
      'name': 'flag test',
      'image': 'https://ekstep-public-dev.s32.thumb.jpeg',
      'description': '',
      'rating': '0',
      'action': {
        'right': {
          'class': 'ui blue basic button',
          'eventName': 'Resume',
          'displayType': 'button',
          'text': 'Resume'
        },
        'onImage': {
          'eventName': 'onImage'
        }
      },
      'metaData': {
        'identifier': 'do_112499049696583680148'
      },
      'maxCount': 0,
      'progress': 0,
      'section': 'My Trainings'
    },
    {
      'name': 'AAAA',
      'image': 'https://ekstep-publit/short_stories_lionandmouse3_1467102846349.thumb.jpg',
      'description': 'Untitled Collection',
      'rating': '0',
      'action': {
        'right': {
          'class': 'ui blue basic button',
          'eventName': 'Resume',
          'displayType': 'button',
          'text': 'Resume'
        },
        'onImage': {
          'eventName': 'onImage'
        }
      },
      'metaData': {
        'identifier': 'do_1125131909441945601309'
      },
      'maxCount': 4,
      'progress': 0,
      'section': 'My Courses'
    }
  ],
resourceBundle : {
    'messages': {
      'fmsg': {
          'm0001': 'Fetching enrolled course is failed, please try again later...'
      }
   }
   },
  viewAllEventData: {
    'name': 'My courses',
    'length': 0,
    'count': 2,
    'contents': [
      {
        'name': 'Swetha-physics(nested course test)-20-jul-2020',
        'gradeLevel': '',
        'contentType': 'Course',
        'topic': '',
        'subTopic': '',
        'metaData': {
          'batchId': '01306892379524300849',
          'courseId': 'do_213068136968904704184',
          'mimeType': 'application/vnd.ekstep.content-collection',
          'contentType': 'Course'
        },
        'completionPercentage': 0,
        'mimeTypesCount': 0,
        'board': '',
      },
      {
        'name': 'Copy of Book testing 1 - 0708',
        'gradeLevel': '',
        'contentType': 'Course',
        'topic': '',
        'subTopic': '',
        'metaData': {
          'batchId': '01306904167088128055',
          'courseId': 'do_2130595997829611521527',
          'mimeType': 'application/vnd.ekstep.content-collection',
          'contentType': 'Course'
        },
        'completionPercentage': 0,
        'mimeTypesCount': 0,
        'board': ''
      }
    ]
  },
  userData: {
    'firstName': 'Sourav',
    'organisationIds' : ['ORG_001'],
  },
  facets: [
    {
      'index': '3',
      'label': 'Class',
      'placeholder': 'Select class',
      'values': [{
        'name': 'class 9',
        'count': 180
      }],
      'name': 'gradeLevel'
    },
    {
      'index': '4',
      'label': 'Subject',
      'placeholder': 'Select subject',
      'values': [{
        'name': 'chemistry',
        'count': 165
      }],
      'name': 'subject'
    },
    {
      'index': '1',
      'label': 'Organization Name',
      'placeholder': 'Organization Name',
      'values': [{
        'identifier': '012530141516660736208',
        'orgName': 'SAP',
        'slug': 's123',
        'name': 'SAP'
      }],
      'name': 'channel'
    },
    {
      'index': '2',
      'label': 'Medium',
      'placeholder': 'Select medium',
      'values': [{
        'name': 'english',
        'count': 187
      }],
      'name': 'medium'
    }
  ],
  orgSearch: {
    'count': 1,
    'content': [
      {
        'identifier': '0128325322816552960',
        'orgName': 'CBSE',
        'slug': 'cbse'
      }
    ]
  },
  facetsList: {
    'gradeLevel': [
      {
        'name': 'class 9',
        'count': 4
      }
    ],
    'publisher': [
      {
        'name': 'concepts understanding',
        'count': 1
      }
    ],
    'subject': [
      {
        'name': 'skills',
        'count': 1
      }
    ],
    'channel': [
      {
        'identifier': '01272777697873100812',
        'orgName': 'diksha_ntptest_org',
        'slug': 'disha_ntptest'
      }
    ],
    'contentType': [
      {
        'name': 'practicals',
        'count': 1
      }
    ],
    'medium': [
      {
        'name': 'tamil',
        'count': 1
      }
    ],
    'board': [
      {
        'name': 'mock board',
        'count': 4
      }
    ],
  },
  updatedFacetsList: [
    {
      index: '3',
      label: 'class',
      placeholder: 'selectClass',
      name: 'gradeLevel',
      values: [
        {
          'name': 'class 9',
          'count': 4
        }
      ]
    },
    {
      index: '5',
      label: 'publisher',
      placeholder: 'selectPublisher',
      name: 'publisher',
      values: [
        {
          'name': 'concepts understanding',
          'count': 1
        }
      ]
    },
    {
      index: '4',
      label: 'subject',
      placeholder: 'selectSubject',
      name: 'subject',
      values: [
        {
          'name': 'skills',
          'count': 1
        }
      ]
    },
    {
      index: '1',
      label: 'orgname',
      placeholder: 'orgname',
      name: 'channel',
      values: [
        {
          'identifier': '01272777697873100812',
          'orgName': 'diksha_ntptest_org',
          'name': 'diksha_ntptest_org',
          'slug': 'disha_ntptest'
        }
      ]
    },
    {
      index: '6',
      label: 'contentType',
      placeholder: 'selectContentType',
      name: 'contentType',
      values: [
        {
          'name': 'practicals',
          'count': 1
        }
      ]
    },
    {
      index: '2',
      label: 'medium',
      placeholder: 'selectMedium',
      name: 'medium',
      values: [
        {
          'name': 'tamil',
          'count': 1
        }
      ]
    },
    {
      index: '1',
      label: 'boards',
      placeholder: 'selectBoard',
      name: 'board',
      values: [
        {
          'name': 'mock board',
          'count': 4
        }
      ]
    }
  ],
  getFiltersInput: {
    'status': 'FETCHED',
    'filters': {
      'selectedTab': 'course',
      'channel': [
        'CBSE'
      ]
    }
  },
  getFiltersFacets: [
    {
      'index': '1',
      'label': 'Organization Name',
      'placeholder': 'Organization Name',
      'values': [
        {
          'identifier': '0128325322816552960',
          'orgName': 'CBSE',
          'slug': 'cbse',
          'name': 'CBSE'
        },

      ],
      'name': 'channel'
    }
  ],
  getFiltersOutput: {
    "selectedTab": "course",
    "channel": [
      "CBSE"
    ]
  }

};

export const custOrgDetails = {
  'id': 'api.system.settings.get.custodianOrgId',
  'ver': 'v1',
  'ts': '2020-04-28 09:31:46:467+0000',
  'params': {
    'resmsgid': null,
    'msgid': null,
    'err': null,
    'status': 'success',
    'errmsg': null
  },
  'responseCode': 'OK',
  'result': {
    'response': {
      'id': 'custodianOrgId',
      'field': 'custodianOrgId',
      'value': '0126684405014528002'
    }
  }
};

