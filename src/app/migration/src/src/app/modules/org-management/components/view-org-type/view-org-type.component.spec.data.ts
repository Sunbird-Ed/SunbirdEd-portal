export const mockRes = {
    orgTypeSuccess: {
        'id': 'api.org.type.list',
        'ver': 'v1',
        'ts': '2018-03-26 05:30:15:498+0000',
        'params': {
            'resmsgid': null,
            'msgid': '860d0404-3087-189c-1153-ca080e3970fc',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': [{
                'name': 'Test org type',
                'id': '0123602925782302725'
            }]
        }
    },
    orgTypeError: {
        error: {
            'id': 'api.org.type.list', 'ver': 'v1', 'ts': '2018-02-26 09:22:46:452+0000',
            'params': {
                'resmsgid': '9b3bef40-1ad6-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'failed', 'err': '',
                'errmsg': 'Something went wrong'
            }, 'responseCode': 'CLIENT_ERROR', 'result': {}
        }
    },
    resourceBundle: {
        'messages': {
            'emsg': {
                'm0005': 'Something went wrong, please try in some time....',
            }
        }
    }
};
