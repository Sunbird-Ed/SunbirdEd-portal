export const Response = {
    successData: {
       ' id': 'api.page.assemble',
       ' params': {
            'err': null,
            'errmsg' : null,
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
      ],
    mockFrameworkData: {
        framework: {
          'gradeLevel': [
            'Class 4'
          ],
          'subject': [],
          'id': [
            'NCF'
          ],
          'medium': [
            'Hindi'
          ],
          'board': [
            'State (Andhra Pradesh)'
          ]
        }
    },
  userServiceMockData: {
    'response': {
      'id': 'custodianOrgId',
      'field': 'custodianOrgId',
      'value': '0126632859575746566'
    }
  },
  selectedFilters: {
    'board': [
      'State (Assam)'
    ],
    'medium': [
      'English'
    ],
    'gradeLevel': [
      'Class 5'
    ]
  },
  searchResult: {
    'id': 'api.content.search',
    'ver': '1.0',
    'ts': '2020-03-05T05:11:37.162Z',
    'params': {
      'resmsgid': 'ca1842a0-5e9f-11ea-9c40-61a751c55653',
      'msgid': '97f24610-32e5-2aff-1dd7-30a586680455',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 2,
      'content': [
        {
          'mediaType': 'content',
          'osId': 'org.ekstep.quiz.app',
          'ageGroup': [
            '<5',
            '>10'
          ],
          'pkgVersion': 1,
          'versionKey': '1576731343369',
          'idealScreenDensity': 'hdpi',
          'framework': 'NCF',
          'depth': 0,
          'dialcodes': [
            'K8D3T7'
          ]
        },
        {
          'ownershipType': [
            'createdBy'
          ],
          'pkgVersion': 1,
          'versionKey': '1569489359202',
        }
      ]
    }
  },
  playContentEvent: {
    'event': {
      'isTrusted': true
    },
    'data': {
      'ownershipType': [
        'createdBy'
      ],
      'mediaType': 'content',
      'osId': 'org.ekstep.quiz.app',
      'ageGroup': [
        '<5',
        '>10'
      ],
      'name': 'Assam text book',
      'status': 'Live',
      'lastStatusChangedOn': '2019-12-19T04:55:44.308+0000',
      'IL_SYS_NODE_TYPE': 'DATA_NODE',
      'os': [
        'All'
      ],
      's3Key': 'ecar_files/do_212916581536096256131/assam-text-book_1576731343811_do_212916581536096256131_1.0_spine.ecar',
      'lastSubmittedOn': '2019-12-19T04:54:20.014+0000',
      'createdBy': '5936c4ee-7e44-4a1b-9211-1c17fc8601e7',
      'compatibilityLevel': 1,
      'leafNodesCount': 6,
      'IL_UNIQUE_ID': 'do_212916581536096256131',
      'board': 'State (Assam)',
      'resourceType': 'Book',
      'node_id': 521312,
      'orgDetails': {
        'email': null,
        'orgName': 'SAP'
      },
      // tslint:disable-next-line:max-line-length
      'cardImg': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_212916581536096256131/artifact/api2_1530687542792.thumb.png'
    }
  },
  eventForSection: {
    data: {
      identifier: 'do_123456',
      contentType: 'textbook',
      pkgVersion: 1.0
    }
  }
};
