export const mockResponse = {
    successResponse: {
        'id': 'api.issuer.badge.assertion.create',
        'ver': 'v1',
        'ts': '2018 - 05 - 17 06: 58: 01: 836 + 0000',
        'params': {
            'resmsgid': null,
            'msgid': '34a59d04-f380 - c063 - 11ff-9ea86541dcb4',
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'assertionDate': '2018 - 05 - 17T06: 58: 01.445581',
            'assertionImageUrl': 'https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/6d26404179f9605400e5461ef1e04205.png',
            'badgeId': 'something',
            'assertionIdUrl': 'https://dev.open-sunbird.org/badging/public/assertions/e34394e4-f6d0-4557-abcf-04864e6d325b',
            'revoked': false,
            'issuerId': 'swarn-2',
            'createdDate': '2018 - 05 - 17T06: 58: 01.589971Z',
            'assertionId': 'e34394e4 - f6d0 - 4557 - abcf - 04864e6d325b',
            'issuerIdUrl': 'https://dev.open-sunbird.org/badging/public/issuers/swarn-2',
            'recipient': {
                'salt': '1353762f-e149 - 4c95-9444 - 342c1374f72d',
                'type': 'email',
                'hashed': true,
                'identity': 'sha256$7df6586ddc142e9e2658f854617a8e5e47ee46425155507727ed5287b1a80cf6'
            },
            'verify': {
                'url': 'https://dev.open-sunbird.org/badging/public/assertions/e34394e4-f6d0-4557-abcf-04864e6d325b',
                'type': 'hosted'
            },
            'revocationReason': null,
            'recipientEmail': 'support-dev@open-sunbird.org',
            'badgeIdUrl': 'https://dev.open-sunbird.org/badging/public/badges/something'
        }
    }
};
