export const mockRes = {
    outBoxSuccess: {
        'id': 'api.plugin.announcement.user.outbox', 'ver': '1.0', 'ts': '2018-03-07 07:32:20:430+0000',
        'params': { 'resmsgid': 'ab88f6e0-21d9-11e8-a68f-697f8fa8c952', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': '' },
        'responseCode': 'OK',
        'result': {
            'count': 1173, 'announcements': [{
                'id': '1f1a50f0-e4a3-11e7-b47d-4ddf97f76f43', 'from': 'test user',
                'type': 'Circular', 'title': 'Test title for announcement 99', 'description': 'Test description for announcement 90',
                'links': ['http://yahoo.com'],
                'attachments': [{
                    'name': 'alarm.png', 'mimetype': 'image/png', 'size': '67kb',
                    'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0123900729938247680.png'
                },
                {
                    'name': 'clock.jpg', 'mimetype': 'image/jpeg', 'size': '9.4kb',
                    'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0123900700072509443.jpg'
                },
                {
                    'name': 'ACBuilder css.png', 'mimetype': 'image/png', 'size': '89 KB',
                    'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-01240004723770982476.png'
                }],
                'createdDate': '2017-12-19 09:58:11:071+0000', 'status': 'cancelled',
                'target': { 'geo': { 'ids': ['0123668622585610242', '0123668627050987529'] } },
                'metrics': { 'sent': 23, 'read': 2, 'received': 9 }
            }]
        }
    },
    requestBody: {
        content: {
            'mimeType': 'application/vnd.ekstep.content-collection',
            'contentType': 'Collection',
            'createdBy': '68777b59-b28b-4aee-88d6-50d46e4c3509',
            'createdFor': ['01232002070124134414', '012315809814749184151'],
            'creator': 'BOSS Name',
            'name': 'Untitled collection',
            'organization': [],
            'organisationIds': ['01232002070124134414', '012315809814749184151'],
            'userRoles': ['public', 'CONTENT_REVIEWER', 'PUBLIC', 'CONTENT_CREATOR']
        }
    }
};
