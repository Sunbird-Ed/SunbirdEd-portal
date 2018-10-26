export const mockRes = {
    successResult: {
        'id': 'api.content.read',
        'ver': '1.0',
        'ts': '2018-04-10T13:02:45.415Z',
        'params': {
            'resmsgid': '76311b70-3cbf-11e8-8758-7f5b4fe67033',
            'msgid': '762582b0-3cbf-11e8-bfb0-2527c99bf99d',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': {
                'identifier': 'do_21247940906829414411032',
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'mimeType': 'application/vnd.ekstep.content-collection',
                'languageCode': 'en',
                'status': 'Draft'
            }
        }
    },
    errorResult: {
        'responseCode': 'ERROR',
        'result': {
            'content': {
                'identifier': 'do_21247940906829414411032',
                'createdBy': '68777b59-b28b-4aee-88d6-50d46e4c3509',
                'mimeType': 'application/vnd.ekstep.content-collections',
                'languageCode': 'en',
                'status': 'listed'
            }
        }
    },
    tenantMockData: {
            'titleName': 'Sunbird',
            'logo': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'poster': 'http://localhost:3000/assets/images/sunbird_logo.png',
            'favicon': 'http://localhost:3000/assets/images/favicon.ico',
            'appLogo': 'http://localhost:3000/assets/images/sunbird_logo.png'
        }
};
