export const serverRes = {
    successData: {
        'id': 'api.channel.read',
        'ver': '1.0',
        'ts': '2018-12-20T04:59:00.682Z',
        'params': {
            'resmsgid': 'f706d2a0-0413-11e9-aacc-e1c6fb1097e2',
            'msgid': 'f7043a90-0413-11e9-9e67-2b0d8139a4c4',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'channel': {
                'identifier': '01246944855007232011',
                'code': '01246944855007232011',
                'frameworks': [
                    {
                        'identifier': 'NCF',
                        'name': 'State (Uttar Pradesh)',
                        'objectType': 'Framework',
                        'relation': 'hasSequenceMember',
                        'description': 'NCF ',
                        'index': 1,
                        'status': null,
                        'depth': null,
                        'mimeType': null,
                        'visibility': null,
                        'compatibilityLevel': null
                    },
                    {
                        'identifier': 'NCFCOPY',
                        'name': 'AP Board',
                        'objectType': 'Framework',
                        'relation': 'hasSequenceMember',
                        'description': ' NCF framework..',
                        'index': 2,
                        'status': null,
                        'depth': null,
                        'mimeType': null,
                        'visibility': null,
                        'compatibilityLevel': null
                    }
                ],
                'consumerId': '9393568c-3a56-47dd-a9a3-34da3c821638',
                'channel': 'in.ekstep',
                'description': 'description',
                'createdOn': '2018-03-27T11:08:49.677+0000',
                'versionKey': '1545195284939',
                'appId': 'dev.sunbird.portal',
                'name': 'channel-2',
                'lastUpdatedOn': '2018-12-19T04:54:44.939+0000',
                'status': 'Live',
                'defaultFramework': 'NCF'
            }
        }
    },
    noResultData: {
        'id': 'api.channel.read',
        'ver': '1.0',
        'ts': '2018-12-20T04:59:00.682Z',
        'params': {
            'resmsgid': null, 'msgid': '4eee52ee-8663-4450-b196-44148bdfb69c', 'err': null,
            'status': 'success', 'errmsg': null
        }, 'responseCode': 'OK', 'result': {
            'response': {
                'count': 0,
                'content': []
            }
        }
    },
};
