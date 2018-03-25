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
                            'me_averageRating': 3,
                            'resourceType': 'story',
                            'leafNodesCount': 10,
                            'progress': 3,
                            'identifier': 'do_2123412199319552001265',
                            'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/monologue_1463065145952.thumb.png',
                            'action': { 'right': {'displayType': 'button' ,
                            'classes': 'ui blue basic button' ,
                            'text': 'Resume' },
                            'left': { 'displayType': 'rating' }
                           }
                    }]
                }]
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
errorCourse: {'id': 'api.course.getbyuser', 'params': {
    'resmsgid': 'UnAutorized', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
    'status': 'UnAutorized', 'err': 'UnAutorized', 'errmsg': 'UnAutorized'
}, 'responseCode': 'Err',
'result': {'courses': [
]
}
},
resourceBundle : {
    'messages': {
      'fmsg': {
          'm0001': 'Fetching enrolled course is failed, please try again later...'
      }
   }
   }
};
