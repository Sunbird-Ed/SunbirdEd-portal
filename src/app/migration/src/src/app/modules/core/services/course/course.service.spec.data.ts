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
};
