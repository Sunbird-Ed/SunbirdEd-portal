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
                      'name': 'Story',
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
        'section': 'My Courses'
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
        'section': 'My Courses'
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
  download_event:
  {
    'action': 'download',
    'data': {
      'action':
      {
        'onImage': {'eventName': 'onImage'}
      },
    'addedToLibrary': true,
    'completionPercentage': 0,
    'contentType': 'Resource',
    'description': 'Math-Magic_7_Jugs and Mugs_Bunny and Banno celebrate their Wedding Anniversary_Introduction to volume',
    'gradeLevel': 'Class 4',
    // tslint:disable-next-line:max-line-length
    'image': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/do_312579855868370944110877/artifact/1n4jfaogvexvuuff6knjagpzmavlvdxk2.thumb.png',
    'medium': 'English',
    // tslint:disable-next-line:max-line-length
    'metaData': {'identifier': 'do_312579855868370944110877', 'mimeType': 'video/x-youtube', 'framework': 'ekstep_ncert_k-12', 'contentType': 'Resource'},
    'name': 'Jugs and Mugs_Bunny and Banno celebrate their Wedding Anniversary_2',
    'orgDetails': {},
    'rating': 3,
    'ribbon': {
      'left': {
        'class': 'ui circular label  card-badges-image',
        'image': 'https://ntpproduction.blob.core.windows.net/badgr/uploads/badges/739851bf8ecd6203aa5dd2d9de155f31.png'
      },
      'right': {
        'class': 'ui black right ribbon label',
        'name': 'Learn'
      },
    },
    'subTopic': '',
    'subject': 'Mathematics',
    'topic': 'Volumes and Capacity'
  },
    'section': 'Featured Content'
    },
  download_list : {
      id: 'api.content.download.list',
      ver: '1.0',
      ts: '2019-08-22T05:07:39.363Z',
      params: {
        resmsgid: 'f2da2305-75c9-4b54-a454-72cfe6433ebe',
        msgid: '2025a654-e573-4546-b87d-0a293f2f6564',
        status: 'successful',
        err: null,
        errmsg: null,
      },
      responseCode: 'OK',
      result: {
        response: {
          downloads: {
            submitted: [],
            inprogress: [],
            failed: [],
            completed: [],
          },
        },
      },
    },
  download_success : {
      id: 'api.content.download',
      ver: '1.0',
      ts: '2019-08-16T04:54:02.569Z',
      params: {
        resmsgid: 'efe1bb13-a3a4-4458-baf1-234b1a109ea0',
        msgid: 'c1932b9d-2a36-4036-ba57-2b80be4b3355',
        status: 'successful',
        err: null,
        errmsg: null,
      },
      responseCode: 'OK',
      result: { downloadId: '5e1ae60e-ecd8-459e-9e13-fe8ecf7c9487' },
    },
  download_error : {
      id: 'api.content.download',
      ver: '1.0',
      ts: '2019-08-16T12:28:15.856Z',
      params: {
        resmsgid: 'dbbf8bd4-4da8-492b-bc5b-6c73351f1161',
        msgid: '845ee75b-72e9-4d33-a0a2-1b38bf132b83',
        status: 'failed',
        err: 'ERR_INTERNAL_SERVER_ERROR',
        errmsg: 'Error while processing the request',
      },
      responseCode: 'INTERNAL_SERVER_ERROR',
      result: {},
    },
    result: {
      id: 'api.content.read',
      ver: '1.0',
      ts: '2018-05-03T10:51:12.648Z',
      params: 'params',
      responseCode: 'OK',
      result: {
          content: {
              downloadStatus: '',
              mimeType: 'application/vnd.ekstep.ecml-archive',
              body: 'body',
              identifier: 'domain_66675',
              versionKey: '1497028761823',
              status: 'Live',
              me_averageRating: '4',
              description: 'ffgg',
              name: 'ffgh',
              concepts: ['AI', 'ML'],
              contentType: '',
              code: '',
              framework: '',
              userId: '',
              userName: '',
          }
      }
  }
};
