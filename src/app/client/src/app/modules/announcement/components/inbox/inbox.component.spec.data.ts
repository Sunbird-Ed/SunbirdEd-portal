export const mockRes = {
    inBoxSuccess: {
        'id': 'api.plugin.announcement.user.inbox', 'ver': '1.0', 'ts': '2018-03-08 09:08:49:088+0000',
        'params': {
            'resmsgid': '5041d400-22b0-11e8-b23c-a9370277a444', 'msgid': null, 'status': 'successful', 'err': '',
            'errmsg': ''
        }, 'responseCode': 'OK', 'result': {
            'count': 1173, 'announcements': [{
                'id': '6f6932b0-db3e-11e7-b902-bf7fe7f2023a',
                'from': 'test user', 'type': 'Circular', 'title': 'NOTIF 1 Test title for announcement 90',
                'description': 'Test description for announcement 90', 'links': ['http://yahoo.com'],
                'attachments': [
                    {
                        'name': 'alarm.png', 'mimetype': 'image/png', 'size': '67kb',
                        'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0123900729938247680.png'
                    },
                    {
                        'name': 'clock.jpg', 'mimetype': 'image/jpeg', 'size': '9.4kb',
                        'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0123900700072509443.jpg'
                    }],
                'createdDate': '2017-12-07 11:04:46:171+0000', 'status': 'active', 'read': true, 'received': false
            }]
        }
    },
    inboxError: {
        error: {
            'id': 'api.plugin.announcement.user.inbox', 'ver': '1.0', 'ts': '2018-02-26 09:22:46:452+0000',
            'params': {
                'resmsgid': '9b3bef40-1ad6-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'failed', 'err': '',
                'errmsg': 'Cannot set property of undefined'
            }, 'responseCode': 'CLIENT_ERROR', 'result': {}
        }
    },
    inboxData: [{
        'id': '7ffbff00-160c-11e8-b9b4-393f76d4675b',
        'from': 'asdasd', 'type': 'Circular', 'title': 'wsw', 'description': 'asda', 'links': [],
        'attachments': [], 'createdDate': '2018-02-20 07:05:57:744+0000', 'status': 'active',
        'target': { 'geo': { 'ids': ['01236686178285977611'] } }, 'metrics': { 'sent': 0, 'read': 0, 'received': 0 }
    }],
    resourceBundle: {
        'messages': {
            'smsg': {
                'moo41': 'Announcement cancelled successfully...'
            },
            'emsg': {
                'm0005': 'Something went wrong, please try in some time....',
            }
        }
    },
    pager: {
        'totalItems': 1173, 'currentPage': 3, 'pageSize': 25, 'totalPages': 47,
        'startPage': 30, 'endPage': 34, 'startIndex': 725, 'endIndex': 749, 'pages': [30, 31, 32, 33, 34]
    }
};
