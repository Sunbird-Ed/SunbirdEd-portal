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
      ]
};
