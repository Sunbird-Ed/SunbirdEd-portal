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
    outboxError: {
        error: {
            'id': 'api.plugin.announcement.user.outbox', 'ver': '1.0', 'ts': '2018-02-26 09:22:46:452+0000',
            'params': {
                'resmsgid': '9b3bef40-1ad6-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'failed', 'err': '',
                'errmsg': 'Cannot set property of undefined'
            }, 'responseCode': 'CLIENT_ERROR', 'result': {}
        }
    },
    outboxData: [{
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
