export const mockResponse = {
    badgeSuccessResponse: {
        'result': {
            'badges': [
                {
                    'image': `https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/
                    issuer_badgeclass_ba684c5c-5490-4c16-a091-759f1e689723`,
                    'badgeId': 'official',
                    'criteria': 'http://localhost:8000/public/badges/official/criteria',
                    'roles': ['COURSE_MENTOR'],
                    'description': 'something',
                    'type': 'content',
                    'rootOrgId': 'ORG_001',
                    'issuerId': 'swarn - 2',
                    'createdDate': '2018 - 03 - 21T10: 16: 33.631893Z',
                    'recipientCount': '52',
                    'subtype': 'award',
                    'issuerIdUrl': 'http://localhost:8000/public/issuers/swarn-2',
                    'name': 'OFFICIAL',
                    'badgeIdUrl': 'http://localhost:8000/public/badges/official'
                },
                {
                    'image': `https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/
                    issuer_badgeclass_b99b07be-f1b3-464d-bfbd-0cb7f19b0e8c`,
                    'badgeId': 'something',
                    'criteria': 'http://localhost:8000/public/badges/something/criteria',
                    'roles': ['COURSE_MENTOR'],
                    'description': 'something',
                    'type': 'content',
                    'rootOrgId': 'ORG_001',
                    'issuerId': 'swarn - 2',
                    'createdDate': '2018 - 03 - 20T10: 11: 18.447140Z',
                    'recipientCount': '27',
                    'subtype': 'award',
                    'issuerIdUrl': 'http://localhost:8000/public/issuers/swarn-2',
                    'name': 'something',
                    'badgeIdUrl': 'http://localhost:8000/public/badges/something'
                }
            ]
        }
    },
    resourceBundle: {
        'messages': {
            'fmsg': {
                'm0079': 'Assigning badge failed, please try again later...',
                'm0078': 'Fetching badge failed, please try again later...'
            },
            'smsg': {
                'm0044': 'Badge assigned successfully'
            }
        }
    },
    req: {
        'issuerId': 'swarn-2',
        'badgeId': 'official',
        'recipientId': 'Test_Textbook2_8907797',
        'recipientType': 'content'
    },
    returnValue: {
        'result': {
            'assertionDate': '2018 - 05 - 16T16: 46: 49.418448',
            'assertionImageUrl': `https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/af650741fff290e8e6521c8e97db58b7.png`,
            'badgeId': 'official',
            'assertionIdUrl': 'https://dev.open-sunbird.org/badging/public/assertions/333a17c2-b4b5-4940-af54-a2c32a0634d0',
            'revoked': false,
            'issuerId': 'swarn-2',
            'createdDate': '2018 - 05 - 16T16: 46: 49.750767Z',
            'assertionId': '333a17c2-b4b5 - 4940 - af54 - a2c32a0634d0',
            'issuerIdUrl': 'https://dev.open-sunbird.org/badging/public/issuers/swarn-2',
            'recipient': {
                'salt': 'f56a58ae - 5563 - 4889 - aa9c - 27cf6baa0e8f',
                'type': 'email',
                'hashed': true,
                'identity': 'sha256$a18b185da1b19d63d63d3b8dc6517a2f3681faf809a0de08a30b3e03a67c0857'
            },
            'verify': {
                'url': 'https://dev.open-sunbird.org/badging/public/assertions/333a17c2-b4b5-4940-af54-a2c32a0634d0',
                'type': 'hosted'
            },
            'revocationReason': null,
            'recipientEmail': 'support - dev@open-sunbird.org',
            'badgeIdUrl': 'https://dev.open-sunbird.org/badging/public/badges/official'
        }
    },
    badgeData: [
        {
            'assertionId': 'd56e6d23-70cb-49dc-9c04-0050ae9067da',
            'badgeClassImage': 'https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/b0fcde73f1fd81491235e3cfddd15b1c.png',
            'badgeClassName': 'Official Textbook - MH',
            'badgeId': 'badgeslug-2',
            'createdTS': '1526552568280',
            'issuerId': 'issuerslug-2',
            'status': 'active'
        }
    ]
};
