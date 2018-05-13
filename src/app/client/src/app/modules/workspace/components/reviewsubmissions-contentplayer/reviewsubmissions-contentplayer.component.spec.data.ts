export const mockRes = {
    errorRes: {
        'id': 'api.user.read',
        'ver': 'v1',
        'ts': '2018-05-09 11:52:23:795+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'db3074e6-fd30-4d0c-83ed-006a5a48d452',
            'err': 'UNAUTHORIZE_USER',
            'status': 'SERVER_ERROR',
            'errmsg': 'You are not authorized.'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    sucessRes: {
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
                concepts: ['AI', 'ML']
            }
        }
    }
};
