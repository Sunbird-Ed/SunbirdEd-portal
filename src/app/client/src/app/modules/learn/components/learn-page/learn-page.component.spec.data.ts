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
    enrolledCourses: {
        'enrolledCourses': [
             {
              'courseId': 'do_2123412199319552001265', 'courseName': '27-sept',
                'description': 'test', 'leafNodesCount': 0, 'progress': 0, 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }
        ]
    },
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
   }
};
