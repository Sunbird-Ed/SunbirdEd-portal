export const Response = {
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
        'name': 'Test1462016-02',
        'description': 'Test',
        'rating': '0',
        'orgDetails': {},
        'gradeLevel': 'Kindergarten,Grade 1,Grade 2,Grade 3,Grade 4,Grade 5,Other',
        'contentType': 'Story',
        'topic': '',
        'subTopic': '',
        'action': {
          'onImage': {
            'eventName': 'onImage'
          }
        },
        'ribbon': {
          'left': {
            'class': 'ui circular label  card-badges-image'
          },
          'right': {
            'class': 'ui black right ribbon label'
          }
        },
        'metaData': {
          'identifier': 'domain_70474',
          'mimeType': 'application/vnd.ekstep.ecml-archive',
          'contentType': 'Story'
        },
        'section': 'Popular Story'
      },
      {
        'name': 'test_ginti',
        'description': 'test_ginti',
        'rating': '0',
        'orgDetails': {},
        'gradeLevel': 'Kindergarten,Grade 1,Grade 2,Grade 3,Grade 4,Grade 5,Other',
        'contentType': 'Story',
        'topic': '',
        'subTopic': '',
        'action': {
          'onImage': {
            'eventName': 'onImage'
          }
        },
        'ribbon': {
          'left': {
            'class': 'ui circular label  card-badges-image'
          },
          'right': {
            'class': 'ui black right ribbon label'
          }
        },
        'metaData': {
          'identifier': 'domain_71549',
          'mimeType': 'application/vnd.ekstep.ecml-archive',
          'contentType': 'Story'
        },
        'section': 'Popular Story'
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
    requestParam: {
      source: 'web',
      name: 'Explore',
      filters: {subject: ['English'], board: undefined, 'channel': '0123166367624478721'},
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 },
      mode: 'soft',
      exists: []
    },
    requestParam2: {
      source: 'web',
      name: 'Explore',
      filters: {subject: ['English'], board: 'CBSE', 'channel': '0123166367624478721'},
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 },
      mode: 'soft',
      exists: []
    },
    requestParam3: {
      source: 'web',
      name: 'Explore',
      filters: {subject: ['English'], board: ['NCERT', 'ICSE'], 'channel': '0123166367624478721'},
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 },
      mode: 'soft',
      exists: []
    },
};
