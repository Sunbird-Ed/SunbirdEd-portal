export const Response = {
  formData: [
    {
      'index': 1,
      'title': 'frmelmnts.tab.courses',
      'desc': 'frmelmnts.tab.courses',
      'menuType': 'Content',
      'contentType': 'course',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': '',
        'className': 'courses',
        'imageName': 'courses-banner-img.svg'
      },
      'anonumousUserRoute': {
        'route': '/explore-course',
        'queryParam': 'course'
      },
      'loggedInUserRoute': {
        'route': '/learn',
        'queryParam': 'course'
      },
      'search': {
        'facets': [
          'topic',
          'purpose',
          'medium',
          'gradeLevel',
          'subject',
          'channel'
        ],
        'fields': [
          
        ],
        'filters': {
          'contentType': [
            'Course'
          ]
        }
      }
    },
    {
      'index': 0,
      'title': 'frmelmnts.lbl.textbooks',
      'desc': 'frmelmnts.lbl.textbooks',
      'menuType': 'Content',
      'contentType': 'textbook',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': '',
        'className': 'textbooks',
        'imageName': 'textbooks-banner-img.svg'
      },
      'anonumousUserRoute': {
        'route': '/explore',
        'queryParam': 'textbook'
      },
      'loggedInUserRoute': {
        'route': '/resources',
        'queryParam': 'textbook'
      },
      'search': {
        'facets': [
          'board',
          'gradeLevel',
          'subject',
          'medium',
          'contentType',
          'concepts'
        ],
        'fields': [
          'name',
          'appIcon',
          'mimeType',
          'gradeLevel',
          'identifier',
          'medium',
          'pkgVersion',
          'board',
          'subject',
          'resourceType',
          'contentType',
          'channel',
          'organisation'
        ],
        'filters': {
          'contentType': [
            'TextBook'
          ]
        }
      }
    },
    {
      'index': 2,
      'title': 'frmelmnts.lbl.tvProgram',
      'desc': 'frmelmnts.lbl.tvProgram',
      'menuType': 'Content',
      'contentType': 'tvProgram',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': '',
        'className': 'tv',
        'imageName': 'tv-banner-img.svg'
      },
      'anonumousUserRoute': {
        'route': '/explore',
        'queryParam': 'tvProgram'
      },
      'loggedInUserRoute': {
        'route': '/resources',
        'queryParam': 'tvProgram'
      },
      'search': {
        'facets': [
          'board',
          'gradeLevel',
          'medium',
          'subject'
        ],
        'fields': [
          'name',
          'appIcon',
          'mimeType',
          'gradeLevel',
          'identifier',
          'medium',
          'pkgVersion',
          'board',
          'subject',
          'resourceType',
          'contentType',
          'channel',
          'organisation'
        ],
        'filters': {
          'contentType': [
            'TVEpisode'
          ]
        }
      }
    },
    {
      'index': 3,
      'title': 'frmelmnts.tab.all',
      'desc': 'frmelmnts.tab.all',
      'menuType': 'Content',
      'contentType': 'all',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': '',
        'className': 'all',
        'imageName': 'all-banner-img.svg'
      },
      'anonumousUserRoute': {
        'route': '/explore',
        'queryParam': 'all'
      },
      'loggedInUserRoute': {
        'route': '/resources',
        'queryParam': 'all'
      },
      'search': {
        'facets': [
          'board',
          'gradeLevel',
          'subject',
          'medium',
          'contentType'
        ],
        'fields': [
          'name',
          'appIcon',
          'mimeType',
          'gradeLevel',
          'identifier',
          'medium',
          'pkgVersion',
          'board',
          'subject',
          'resourceType',
          'contentType',
          'channel',
          'organisation'
        ],
        'filters': {
          'contentType': [
            'Collection',
            'TextBook',
            'LessonPlan',
            'Resource',
            'SelfAssess',
            'PracticeResource',
            'LearningOutcomeDefinition',
            'ExplanationResource',
            'CurriculumCourse',
            'Course'
          ]
        }
      }
    }
  ],
  mockCurrentPageData: {
    'index': 0,
    'title': 'frmelmnts.lbl.textbooks',
    'desc': 'frmelmnts.lbl.textbooks',
    'menuType': 'Content',
    'contentType': 'textbook',
    'isEnabled': true,
    'theme': {
      'baseColor': '',
      'textColor': '',
      'supportingColor': ''
    },
    'search': {
      'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType', 'concepts'],
      'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier', 'medium',
        'pkgVersion', 'board',
        'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
      'filters': {
        'contentType': [
          'TextBook'
        ]
      }
    },
    anonumousUserRoute: {
      route: '/explore',
      queryParam: 'textbook'
    },
    loggedInUserRoute: {
      route: '/resources',
      queryParam: 'textbook'
    }
  },
  mockCustodianOrgApiResponse: {
    'id': 'api.system.settings.get.custodianOrgId',
    'ver': 'v1',
    'ts': '2019-12-17 06:36:24:161+0000',
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
        'value': 'ORG_001'
      }
    }
  },
  searchSuccessData: {
    'id': 'api.content.search',
    'responseCode': 'OK',
    'result': {
      'count': 2,
      'content': [
        {
          'identifier': 'do_31276382509332070415396',
          'subject': [
            'Mathematics',
            'Kannada',
            'English'
          ],
          'channel': '01248978648941363234',
          'organisation': [
            'Karnataka'
          ],
          'mimeType': 'application/vnd.ekstep.content-collection',
          'medium': [
            'Kannada'
          ],
          'pkgVersion': 2,
          'objectType': 'Content',
          'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31276382509332070415396/artifact/dsert-econtent-logo_priority-1_1525849772226.thumb.png',
          'gradeLevel': [
            'Class 9'
          ],
          'name': '9 ಗಣಿತ ಭಾಗ 1',
          'contentType': 'TextBook',
          'board': 'State (Karnataka)',
          'resourceType': 'Book',
          'orgDetails': {}
        },
        {
          'identifier': 'do_31276382859401625615400',
          'subject': [
            'Mathematics'
          ],
          'channel': '01248978648941363234',
          'organisation': [
            'Karnataka'
          ],
          'mimeType': 'application/vnd.ekstep.content-collection',
          'medium': [
            'Kannada'
          ],
          'pkgVersion': 3,
          'objectType': 'Content',
          'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31276382859401625615400/artifact/dsert-econtent-logo_priority-1_1525846239148.thumb.png',
          'gradeLevel': [
            'Class 9'
          ],
          'name': '9 ಗಣಿತ ಭಾಗ 2',
          'contentType': 'TextBook',
          'board': 'State (Karnataka)',
          'resourceType': 'Book',
          'orgDetails': {}
        }
      ]
    }
  },
  successData: {
       ' id': 'api.page.assemble',
       ' params': {
            'err': null,
            'errmsg' : null,
            'msgid' : '31df557d-ce56-e489-9cf3-27b74c90a920',
            'resmsgid' : null,
            'status' : 'success'},
       'responseCode': 'OK',
       'result': {
           'response': {
                'id': '0122838911932661768',
                'name': 'Resources',
                'sections': [
                     {
                        'name': 'Multiple Data',
                        'length': 1,
                        'contents': [
                            { 'name': 'Test1182016-02',
                            'description': 'Test',
                            'me_averageRating': 3,
                            'resourceType': 'story',
                            'leafNodesCount': 10,
                            'progress': 3,
                            'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/monologue_1463065145952.thumb.png',
                            'action': { 'right': {'displayType': 'button' ,
                            'classes': 'ui blue basic button' ,
                            'text': 'Resume' },
                            'left': { 'displayType': 'rating' }
                           }}
                        ]
                     }
                    ]
            }
        }
    },
    secondData: {
        'id': 'api.page.assemble',
        'ver': 'v1',
        'ts': '2018-06-18 12:21:09:081+0000',
        'params': {
          'resmsgid': null,
          'msgid': 'a18cba71-1334-3439-47a2-ba03901d8119',
          'err': null,
          'status': 'success',
          'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
          'response': {
            'name': 'Resource',
            'id': '0122838909618585607',
            'sections': [
              {
                'display': '{\'name\':{\'en\':\'Popular Worksheet\',\'hi\':\'लोकप्रिय वर्कशीट\'}}',
                'alt': null,
                'count': 0,
                'description': null,
                'index': 1,
                'sectionDataType': 'content',
                'imgUrl': null,
                'resmsgId': '14bd6a10-72f2-11e8-92f3-b11fa246a9f9',
                'contents': null,
                'name': 'Popular Worksheet',
                'id': '01228383082462412826',
                'apiId': 'api.v1.search',
                'group': 1
              },
              {
                'display': '{\'name\':{\'en\':\'Popular Story\',\'hi\':\'लोकप्रिय कहानी\'}}',
                'alt': null,
                'count': 0,
                'description': null,
                'index': 1,
                'sectionDataType': 'content',
                'imgUrl': null,
                'resmsgId': '14c30f60-72f2-11e8-81ab-411a3b021e96',
                'contents': null,
                'name': 'Popular Story',
                'id': '01228383384379392023',
                'apiId': 'api.v1.search',
                'group': 2
              }
            ]
          }
        }
      },
      thirdData: {
        ' id': 'api.page.assemble',
        ' params': {
             'err': null,
             'errmsg' : null,
             'msgid' : '31df557d-ce56-e489-9cf3-27b74c90a920',
             'resmsgid' : null,
             'status' : 'success'},
        'responseCode': 'OK',
        'result': {
            'response': {
                 'id': '0122838911932661768',
                 'name': 'Resources',
                 'sections': [
                      {
                         'name': 'Multiple Data',
                         'length': 1,
                      }
                     ]
             }
         }
     },
     error: {'id':  'api.page.assemble', 'params': {
        'resmsgid': 'UnAutorized', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
        'status': 'UnAutorized', 'err': 'UnAutorized', 'errmsg': 'UnAutorized'
    }, 'responseCode': 'Err',
    'result': { }
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
    filters: [
        {
          'code': 'board',
          'dataType': 'text',
          'name': 'Board',
          'label': 'Board',
          'description': 'Education Board (Like MP Board, NCERT, etc)',
          'editable': true,
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'renderingHints': {
            'semanticColumnWidth': 'three'
          },
          'index': 1,
          'range': [
            {
              'identifier': 'ncf_board_ncert',
              'code': 'ncert',
              'name': 'NCERT',
              'description': '',
              'index': 2,
              'category': 'board',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_board_cbse',
              'code': 'cbse',
              'name': 'CBSE',
              'description': '',
              'index': 1,
              'category': 'board',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_board_icse',
              'code': 'icse',
              'name': 'ICSE',
              'description': '',
              'index': 3,
              'category': 'board',
              'status': 'Live'
            }
          ]
        },
        {
          'code': 'medium',
          'dataType': 'text',
          'name': 'Medium',
          'label': 'Medium',
          'description': 'Medium of instruction',
          'editable': true,
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'renderingHints': {
            'semanticColumnWidth': 'three'
          },
          'index': 2,
          'range': [
            {
              'identifier': 'ncf_medium_english',
              'code': 'english',
              'name': 'English',
              'description': '',
              'index': 1,
              'category': 'medium',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_medium_hindi',
              'code': 'hindi',
              'name': 'Hindi',
              'description': '',
              'index': 2,
              'category': 'medium',
              'status': 'Live'
            }
          ]
        },
        {
          'code': 'subject',
          'dataType': 'text',
          'name': 'Subject',
          'label': 'Subject',
          'description': 'Subject of the Content to use to teach',
          'editable': true,
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'renderingHints': {
            'semanticColumnWidth': 'three'
          },
          'index': 3,
          'range': [
            {
              'identifier': 'ncf_subject_mathematics',
              'code': 'mathematics',
              'name': 'Mathematics',
              'description': '',
              'index': 1,
              'category': 'subject',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_subject_english',
              'code': 'english',
              'name': 'English',
              'description': '',
              'index': 2,
              'category': 'subject',
              'status': 'Live'
            }
          ]
        },
        {
          'code': 'gradeLevel',
          'dataType': 'text',
          'name': 'Grade',
          'label': 'Grade',
          'description': 'Grade',
          'editable': true,
          'inputType': 'select',
          'required': false,
          'displayProperty': 'Editable',
          'visible': true,
          'renderingHints': {
            'semanticColumnWidth': 'three'
          },
          'index': 4,
          'range': [
            {
              'identifier': 'ncf_gradelevel_kindergarten',
              'code': 'kindergarten',
              'name': 'KG',
              'description': 'KG',
              'index': 1,
              'category': 'gradelevel',
              'status': 'Live'
            },
            {
              'identifier': 'ncf_gradelevel_grade1',
              'code': 'grade1',
              'name': 'Class 1',
              'description': 'Class 1',
              'index': 2,
              'category': 'gradelevel',
              'status': 'Live'
            }
          ]
        }
      ]
};
