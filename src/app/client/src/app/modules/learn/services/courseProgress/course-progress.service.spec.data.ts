export const Response = {
    successData: {
    'id': 'api.content.state.read',
    'ver': 'v1',
    'ts': '2018-05-14 07:27:53:850+0000',
    'params': {
        'resmsgid': null,
        'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
        'err': null,
        'status': 'success',
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'contentList': [
            {
                'lastAccessTime': '2018-04-09 13:05:42:193+0530',
                'contentId': 'do_112473631695626240110',
                'batchId': '01247853957897420815',
                'completedCount': 1,
                'result': null,
                'score': null,
                'grade': null,
                'progress': 100,
                'id': 'a96f89f33b0a9a3fbd86e2acd2ce6186e584255c84a8dccac1d0d1dcc0d54b2d',
                'viewCount': 1,
                'contentVersion': null,
                'courseId': 'do_1124785353783377921154',
                'lastCompletedTime': '2018-04-09 07:35:42:571+0000',
                'status': 2
            },
            {
                'lastAccessTime': '2018-04-09 08:33:29:864+0000',
                'contentId': 'do_112474267785674752118',
                'batchId': '01247853957897420815',
                'completedCount': 1,
                'result': null,
                'score': null,
                'grade': null,
                'progress': 100,
                'id': 'c6368e8ba2efbda100d5523f4f84d9ee93bc121daa313cb267b405d575c14351',
                'viewCount': 2,
                'contentVersion': null,
                'courseId': 'do_1124785353783377921154',
                'lastCompletedTime': '2018-04-09 08:33:30:143+0000',
                'status': 2
            }
        ]
    }
},
errorData: {
    'id': 'api.content.state.read',
    'ver': 'v1',
    'ts': '2018-05-15 06:23:25:778+0000',
    'params': {
        'resmsgid': null,
        'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
        'err': 'UNAUTHORIZED_USER',
        'status': 'SERVER_ERROR',
        'errmsg': 'You are not authorized.'
    },
    'responseCode': 'CLIENT_ERROR',
    'result': {}
},
updateData: {
    'id': 'api.content.state.update',
    'ver': 'v1',
    'ts': '2018-05-15 06:30:48:133+0000',
    'params': {
        'resmsgid': null,
        'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
        'err': null,
        'status': 'success',
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'do_2122528233578250241233': 'BATCH NOT STARTED OR BATCH CLOSED'
    }
},
UpdateDataError: {
    'id': 'api.content.state.update',
    'ver': 'v1',
    'ts': '2018-05-15 06:41:59:998+0000',
    'params': {
        'resmsgid': null,
        'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf',
        'err': 'CONTENT_ID_REQUIRED_ERROR',
        'status': 'CONTENT_ID_REQUIRED_ERROR',
        'errmsg': 'Please provide content id.'
    },
    'responseCode': 'CLIENT_ERROR',
    'result': {}
}
};

