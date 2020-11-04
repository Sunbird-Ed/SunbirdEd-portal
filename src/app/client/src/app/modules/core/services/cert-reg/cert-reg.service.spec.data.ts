export const mockResponseData = {
    addCertificateMockResponse: {
        'id': 'api.course.batch.cert.template.add',
        'ver': 'v1',
        'ts': '2020-08-20 18:17:35:570+0000',
        'params': {
            'resmsgid': null,
            'msgid': '9cb18925-c8a9-787e-2fb3-e013735ee88d',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS'
        }
    },
    batches: [{
        batchId: '1',
        status: 2
    }],
    batchesInProgress: [{
        batchId: '1',
        status: 1
    }],
    certificatesData: {
        'id': 'api.v1.search',
        'ver': '1.0',
        'ts': '2020-11-04T19:05:21.336Z',
        'params': {
            'resmsgid': 'af9e7380-1ed0-11eb-8e78-7d2936f03553',
            'msgid': 'af9bdb70-1ed0-11eb-8e78-7d2936f03553',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'count': 15,
            'content': [
                {
                    'identifier': 'do_1131440131644129281405',
                    'certType': 'cert template layout',
                    'code': 'AWS',
                    'primaryCategory': 'Certificate Template',
                    'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
                    'name': 'AWS',
                    'artifactUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1131440131644129281405/artifact/certificate_2020-11-04_18_12.svg',
                    'issuer': '{"name":"Gov of TG","url":"https://gcert.gujarat.gov.in/gcert/"}',
                    'objectType': 'Content',
                    'signatoryList': '[{"image":"https://cdn.pixabay.com/photo/2014/11/09/08/06/signature-523237__340.jpg","id":"CEO","designation":"CEO"}]'
                }
            ]
        }
    }
};
