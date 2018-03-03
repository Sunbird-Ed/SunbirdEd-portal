export const mockRes = {
    inboxSuccess: {
        'id': 'api.plugin.announcement.user.inbox', 'ver': '1.0', 'ts': '2018-02-21 07:12:21:117+0000',
        'params': {
            'resmsgid': '8ee7d2d0-16d6-11e8-b881-f9ecfdfe4059', 'msgid': null,
            'status': 'successful', 'err': '', 'errmsg': ''
        },
        'responseCode': 'OK', 'result': {
            'count': 1169, 'announcements': [{
                'id': '7ffbff00-160c-11e8-b9b4-393f76d4675b',
                'from': 'asdasd', 'type': 'Circular', 'title': 'wsw', 'description': 'asda', 'links': [],
                'attachments': [], 'createdDate': '2018-02-20 07:05:57:744+0000', 'status': 'successful',
                'target': { 'geo': { 'ids': ['01236686178285977611'] } }, 'metrics': { 'sent': 0, 'read': 0, 'received': 0 }
            }]
        }
    },
    inboxError: {
        'id': 'api.plugin.announcement.user.inbox', 'ver': '1.0', 'ts': '2018-02-26 09:22:46:452+0000',
        'params': {
            'resmsgid': '9b3bef40-1ad6-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'failed', 'err': '',
            'errmsg': 'Cannot set property of undefined'
        }, 'responseCode': 'CLIENT_ERROR', 'result': {}
    },
    outBoxSuccess: {
        'id': 'api.plugin.announcement.user.outbox', 'ver': '1.0', 'ts': '2018-02-21 07:12:21:117+0000',
        'params': {
            'resmsgid': '8ee7d2d0-16d6-11e8-b881-f9ecfdfe4059', 'msgid': null,
            'status': 'successful', 'err': '', 'errmsg': ''
        },
        'responseCode': 'OK', 'result': {
            'count': 1000, 'announcements': [{
                'id': '7ffbff00-160c-11e8-b9b4-393f76d4675b',
                'from': 'asdasd', 'type': 'Circular', 'title': 'wsw', 'description': 'asda', 'links': [],
                'attachments': [], 'createdDate': '2018-02-20 07:05:57:744+0000', 'status': 'successful',
                'target': { 'geo': { 'ids': ['01236686178285977611'] } }, 'metrics': { 'sent': 0, 'read': 0, 'received': 0 }
            }]
        }
    },
    outboxError: {
        'id': 'api.plugin.announcement.user.outbox', 'ver': '1.0', 'ts': '2018-02-26 09:22:46:452+0000',
        'params': {
            'resmsgid': '9b3bef40-1ad6-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'failed', 'err': '',
            'errmsg': 'Cannot set property of undefined'
        }, 'responseCode': 'CLIENT_ERROR', 'result': {}
    },
    deleteSuccess: {
        'id': 'api.plugin.announcement.cancel', 'ver': '1.0', 'ts': '2018-02-21 09:06:45:999+0000',
        'params': {
            'resmsgid': '8ab1aff0-16e6-11e8-b881-f9ecfdfe4059', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''
        },
        'responseCode': 'OK', 'result': {
            'status': 'cancelled'
        }
    },
    deleteError: {
        'id': 'api.plugin.announcement.cancel', 'ver': '1.0', 'ts': '2018-02-26 08:29:15:944+0000',
        'params': {
            'resmsgid': '219f4a80-1acf-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'failed', 'err': '',
            'errmsg': 'Unauthorized User!22'
        }, 'responseCode': 'CLIENT_ERROR', 'result': {}
    },
    readSuccess: {
        'id': 'api.plugin.announcement.read', 'ver': '1.0', 'ts': '2018-02-26 10:01:40:167+0000',
        'params': { 'resmsgid': '0a3c9570-1adc-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': '' },
        'responseCode': 'OK', 'result': { 'read': { 'id': '0a0b2530-1adc-11e8-98b8-5deaf514b022' } }
    },
    readError: {
        'id': 'api.plugin.announcement.read', 'ver': '1.0', 'ts': '2018-02-26 10:01:40:167+0000',
        'params': {
            'resmsgid': '0a3c9570-1adc-11e8-98b8-5deaf514b087', 'msgid': null, 'status': 'failed', 'err': '',
            'errmsg': 'Unauthorized User'
        }, 'responseCode': 'CLIENT_ERROR', 'result': {}
    },
    receivedSuccess: {
        'id': 'api.plugin.announcement.received', 'ver': '1.0', 'ts': '2018-02-26 10:01:40:167+0000',
        'params': { 'resmsgid': '0a3c9570-1adc-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': '' },
        'responseCode': 'OK', 'result': { 'read': { 'id': '0a0b2530-1adc-11e8-98b8-5deaf514b022' } }
    },
    receivedError: {
        'id': 'api.plugin.announcement.received', 'ver': '1.0', 'ts': '2018-02-26 10:01:40:167+0000',
        'params': {
            'resmsgid': '0a3c9570-1adc-11e8-98b8-5deaf514b087', 'msgid': null, 'status': 'failed', 'err': '',
            'errmsg': 'Unauthorized User'
        }, 'responseCode': 'CLIENT_ERROR', 'result': {}
    },
    getAnnByIdSuccess: {
        'id': 'api.plugin.announcement.get.id', 'ver': '1.0', 'ts': '2018-03-03 19:39:13:474+0000',
        'params': { 'resmsgid': '8d485a20-1f1a-11e8-8dd0-d1fc43717c4f', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': '' },
        'responseCode': 'OK', 'result': {
            'announcement': {
                'id': '92ca4110-19df-11e8-8773-d9334313c305', 'from': 'abc', 'type': 'Circular',
                'title': 'announcement-7th', 'description': 'hello', 'links': [], 'attachments': [],
                'createdDate': '2018-02-25 03:54:26:593+0000', 'status': 'cancelled'
            }
        }
    },
    getAnnByIdError: {
        'id': 'api.plugin.announcement.get.id', 'ver': '1.0', 'ts': '2018-03-03 19:39:13:474+0000',
        'params': {
            'resmsgid': '0a3c9570-1adc-11e8-98b8-5deaf514b087', 'msgid': null, 'status': 'failed', 'err': '',
            'errmsg': 'Unauthorized User'
        }, 'responseCode': 'CLIENT_ERROR', 'result': {}
    }
};
