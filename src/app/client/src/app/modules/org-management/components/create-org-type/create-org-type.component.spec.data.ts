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
        'headers': {
            'normalizedNames': {},
            'lazyUpdate': null
        },
        'status': 400,
        'statusText': 'Bad Request',
        'url': 'http://localhost:4200/learner/org/v1/type/create',
        'ok': false,
        'name': 'HttpErrorResponse',
        'message': 'Http failure response for http://localhost:4200/learner/org/v1/type/create: 400 Bad Request',
        'error': {
            'id': 'api.org.type.create',
            'ver': 'v1',
            'ts': '2018-03-26 12:23:55:865+0000',
            'params': {
                'resmsgid': null,
                'msgid': 'eee8af06-32bc-d302-4aee-bc9cbcb99ab9',
                'err': 'ORG_TYPE_ALREADY_EXIST',
                'status': 'ORG_TYPE_ALREADY_EXIST',
                'errmsg': 'Org type with this name already exist.Please provide some other name.'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
        }
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
        'error': {
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
        }
    },
    resourceBundle: {
        'messages': {
            'smsg': {
                'm0035': 'Org type added successfully',
                'm0037': 'updated successfully',
            }
        }
    },
    getOrgType: {
        'id': 'api.org.type.list', 'ver': 'v1', 'ts': '2018-07-03 09:46:16:716+0000',
        'params': {
            'resmsgid': null, 'msgid': 'ddcd491b-449e-4183-a2d4-90064cef886f',
            'err': null, 'status': 'success', 'errmsg': null
        }, 'responseCode': 'OK',
        'result': {
            'response': [
                { 'name': 'afsdfsdfsdfsfsdf234213414fsdfsdfs s fdsfsdfdsfa', 'id': '0123702215064698881' },
                { 'name': 'tete', 'id': '01250975059541196818' },
                { 'name': 'hg23', 'id': '0123503695639674880' }]
        }
    }
};
