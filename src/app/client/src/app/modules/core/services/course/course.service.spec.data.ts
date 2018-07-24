export const mockRes = {
    successData: {
        'id': 'api.course.getbyuser', 'params': {
            'resmsgid': 'null', 'msgid': 'c9099093-7305-8258-9781-014df666da36',
            'status': 'success', 'err': 'null', 'errmsg': 'null'
        }, 'responseCode': 'OK',
        'result': {
            'courses': {
                '0': {
                    'active': 'true', 'courseId': 'do_2123412199319552001265', 'courseName': '27-sept',
                    'description': 'test', 'leafNodesCount': '0', 'progress': '0', 'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
                }
            }
        }
    },
    errorData: {
                'id': 'api.course.getbyuser',
              'params': {
                    'resmsgid': 'Unauthorized', 'msgid': null, 'status': 'failed', 'err': 'Unauthorized',
                   'errmsg': 'Cannot set property of undefined'
               }, 'responseCode': 'CLIENT_ERROR', 'result': {}
        },
        apiResonseData: {
            'id': 'api.user.courses.list',
            'ver': 'v1',
            'ts': '2018-07-23 10:07:47:921+0000',
            'params': {
              'resmsgid': null,
              'msgid': '4a94995b-cb58-4e99-8d57-65b9fa0f4d0f',
              'err': null,
              'status': 'success',
              'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
              'courses': [
                {
                  'dateTime': '2018-05-22 07:18:43:055+0000',
                  'identifier': '323794e3e9968d247756712454cd95cd4f730d658713d44e918c83db2a9e3dc8',
                  'enrolledDate': '2018-05-22 07:18:43:055+0000',
                  'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                  'contentId': 'do_1125083286221291521153',
                  'description': 'test',
                  'active': true,
                  'courseLogoUrl': 'https://ekstep-public-153/artifact/c7a7d301f288f1afe24117ad59083b2a_1475430290462.thumb.jpeg',
                  'batchId': '01250836468775321655',
                  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                  'courseName': 'logu-test-may-21',
                  'leafNodesCount': 3,
                  'progress': 0,
                  'id': '323794e3e9968d247756712454cd95cd4f730d658713d44e918c83db2a9e3dc8',
                  'courseId': 'do_1125083286221291521153',
                  'status': 0
                },
                {
                  'dateTime': '2018-05-28 11:53:50:703+0000',
                  'identifier': 'c3020d173c9b9c67fde4d18d737a02b103149659ac1e855ba1ec7a56da982e9c',
                  'enrolledDate': '2018-05-28 11:53:50:703+0000',
                  'addedBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                  'contentId': 'do_1125110672521134081296',
                  'description': null,
                  'active': true,
                  'courseLogoUrl': 'https://_1125110672521134081296/artifact/62f05664348aeff61aa195d0dc3caba5_1527228627157.thumb.jpg',
                  'batchId': '01251108102066995212',
                  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                  'courseName': 'A5 ext course',
                  'leafNodesCount': 1,
                  'progress': 0,
                  'id': 'c3020d173c9b9c67fde4d18d737a02b103149659ac1e855ba1ec7a56da982e9c',
                  'courseId': 'do_1125110672521134081296',
                  'status': 0
                }
              ]
            }
          }
};
