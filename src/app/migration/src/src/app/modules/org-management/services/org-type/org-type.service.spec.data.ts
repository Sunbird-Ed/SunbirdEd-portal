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
                'name': 'orgtest2',
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
    orgTypeAddSuccess: {
        'id': 'api.org.type.create',
        'ver': 'v1',
        'ts': '2018-03-26 11:38:08:629+0000',
        'params': {
            'resmsgid': null,
            'msgid': '92e1999d-7cf8-fbfb-97d0-da643653e52e',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS'
        }
    },
    orgTypeAddError: {
        'id': 'api.org.type.create',
        'ver': 'v1',
        'ts': '2018-03-26 11:39:29:411+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'aff7cbdd-761b-3d75-6581-b2a8b9ea0f57',
            'err': 'ORG_TYPE_ALREADY_EXIST',
            'status': 'ORG_TYPE_ALREADY_EXIST',
            'errmsg': 'Org type with this name already exist.Please provide some other name.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    orgTypeUpdateSuccess: {
        'id': 'api.org.type.update',
        'ver': 'v1',
        'ts': '2018-03-26 11:42:42:143+0000',
        'params': {
            'resmsgid': null,
            'msgid': '342f8c70-5bb2-6f46-aff1-ae00ee018f1d',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS'
        }
    },
    orgTypeUpdateError: {
        'id': 'api.org.type.update',
        'ver': 'v1',
        'ts': '2018-03-26 11:41:56:854+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'd57f267b-065d-19d4-a46b-54e85fe78e4f',
            'err': 'ORG_TYPE_MANDATORY',
            'status': 'ORG_TYPE_MANDATORY',
            'errmsg': 'Org Type name is mandatory.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    resourceBundle: {
        'messages': {
            'emsg': {
                'm0005': 'Something went wrong, please try in some time....',
            }
        }
    }
};
