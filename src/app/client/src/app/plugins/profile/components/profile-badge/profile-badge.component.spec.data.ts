export const mockRes = {
    request: {
        filters: {
            'badgeList': ['TOPPPER'],
            'type': 'user',
            'rootOrgId': 'ORG_001'
        }
    },
    data: {
        userProfile: {
            'badgeAssertions': [{
                'assertionId': 'ca7cf851-ee72-452c-89cb-cf095a33b2e0',
                'badgeClassImage': 'http://localhost:8000/public/badges/topper',
                'badgeClassName': 'TOPPER',
                'badgeId': 'topper',
                'createdTs': '2018-03-21T12:21:12.116Z',
                'id': 'ca7cf851-ee72-452c-89cb-cf095a33b2e0',
                'issuerId': 'swarn-2',
                'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e'
            }]
        }
    },
    badgeList: {
        'id': 'api.issuer.badge.search',
        'ver': 'v1',
        'ts': '2018 - 04 - 17 15: 04: 20: 973 + 0000',
        'params': {
            'resmsgid': null,
            'msgid': '1a49778c-057c-0590-891f-6f7567ae9a4c',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'badges': [{
                'image':
                    'https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/issuer_badgeclass_8a7c45da-7408-4eac-900d-3b3ce293c7da',
                'badgeId': 'topper',
                'criteria': 'http://localhost:8000/public/badges/topper/criteria',
                'roles': ['COURSE_MENTOR'],
                'description': 'something',
                'type': 'user',
                'rootOrgId': 'ORG_001',
                'issuerId': 'swarn - 2',
                'createdDate': '2018 - 03 - 21T10: 18: 09.161188Z',
                'recipientCount': 3,
                'subtype': 'award',
                'issuerIdUrl': 'http://localhost:8000/public/issuers/swarn-2',
                'name': 'TOPPER',
                'badgeIdUrl': 'http://localhost:8000/public/badges/topper'
            }]
        }
    }
};
