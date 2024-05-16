export const MockData = {
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
        'id': 'api.org.type.list',
        'ver': 'v1',
        'ts': '2018-03-26 05:30:15:498+0000',
        'params': {
            'resmsgid': null,
            'msgid': '860d0404-3087-189c-1153-ca080e3970fc',
            'err': 'error',
            'status': 'success',
            'errmsg': 'error happened'
        },
        'responseCode': 'error',
        'result': {
        
        }
    },
    rootOrgId:'Org_001'
    
}