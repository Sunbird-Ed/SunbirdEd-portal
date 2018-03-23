export const mockRes = {
    successResponse: {
        'id': 'api.org.upload',
        'ver': 'v1',
        'ts': '2018-03-22 07:24:16:379+0000',
        'params': {
            'resmsgid': null,
            'msgid': '7f0dcd10-4ec1-1595-7651-9a606f3596df',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'processId': '012465801157754880647',
            'response': 'SUCCESS'
        }
    },
    errorResponse: {
        'id': 'api.org.upload',
        'ver': 'v1',
        'ts': '2018-03-23 10:05:16:003+0000',
        'params': {
            'resmsgid': null,
            'msgid': '340c2ea1-76e5-d639-0383-81688227f64c',
            'err': 'INVALID_COLUMN_NAME',
            'status': 'INVALID_COLUMN_NAME',
            'errmsg': 'Invalid column name.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {
        }
    }
}