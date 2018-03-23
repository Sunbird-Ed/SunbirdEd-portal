export const mockRes = {
    successResponse: {
        'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:05:31:230+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'cbda6b44-e60f-e0a1-c7b7-0c4ac6ae607f',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'processId': '01246652828212428826',
            'response': 'SUCCESS'
        }
    },
    errorResponse: {
        'id': 'api.user.upload',
        'ver': 'v1',
        'ts': '2018-03-23 08:16:59:649+0000',
        'params': {
            'resmsgid': null,
            'msgid': '55402d80-917f-4f72-9f5b-2e4e7a68ce86',
            'err': 'INVALID_ORGANIZATION_DATA',
            'status': 'INVALID_ORGANIZATION_DATA',
            'errmsg': "Given Organization Data doesn't exist in our records. Please provide a valid one"
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
    }
}