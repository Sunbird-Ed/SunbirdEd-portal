export const serverRes = {
    result: {
        id: 'api.content.read',
        ver: '1.0',
        ts: '2018-05-03T10:51:12.648Z',
        params: 'params',
        responseCode: 'OK',
        result: {
            content: {
                mimeType: 'application/vnd.ekstep.ecml-archive',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                status: 'Live',
                me_averageRating: '4',
                description: 'ffgg',
                name: 'ffgh',
                concepts: ['AI', 'ML'],
                contentType: '',
                code: '',
                framework: '',
                userId: '',
                userName: '',
                badgeAssertions: [
                    {
                     'issuerId': 'issuerslug-93',
                     'assertionId': 'b0a33a07-7b06-4faf-a0a4-e0cbba009227',
                     'badgeClassImage': `https://sunbirddev.blob.core.windows.net/badgr/uploads/badges/
                     issuer_badgeclass_ba684c5c-5490-4c16-a091-759f1e689723`,
                     'badgeId': 'badgeslug-8',
                     'badgeClassName': 'something',
                     'createdTS': 1531907304511,
                     'status': 'active'
                    }
                   ]
            }
        }
    },
    failureResult: {
        id: 'api.content.read',
        ver: '1.0',
        ts: '2018-05-03T10:51:12.648Z',
        error: 'SERVER_ERROR',
        params: 'params',
        responseCode: 'OK',
        result: {
            content: {
                mimeType: 'abc',
                body: 'body',
                identifier: 'domain_66675',
                versionKey: '1497028761823',
                status: 'Live',
                me_averageRating: '4',
                description: 'ffgg',
                name: 'ffgh',
                concepts: ['AI', 'ML']
            }
        }
    },
    resourceServiceMockData: {
        messages: {
            imsg: {
                m0027: 'Something went wrong'
            },
            stmsg: {
                m0009: 'error'
            }
        },
        frmelmnts: {
            btn: {
                tryagain: 'tryagain',
                close: 'close'
            },
            lbl: {
                description: 'description'
            }
        }
    }
};
