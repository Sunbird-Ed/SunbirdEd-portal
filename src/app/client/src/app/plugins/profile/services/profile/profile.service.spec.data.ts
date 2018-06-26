export const mockRes = {
    successData: {
        'id': 'api.user.update',
        'ver': 'v1',
        'ts': '2018-06-25 06:51:57:253+0000',
        'params': {
            'resmsgid': null,
            'msgid': '20e1edc1-1c40-b9fe-2ec4-cf8ae7168ac5',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS'
        }
    },
    errorData: {
        'id': 'api.user.update',
        'params': {
            'resmsgid': 'Unauthorized', 'msgid': null, 'status': 'failed', 'err': 'Unauthorized',
            'errmsg': 'Cannot set property of undefined'
        }, 'responseCode': 'CLIENT_ERROR',
        'result': {}
    }
};
