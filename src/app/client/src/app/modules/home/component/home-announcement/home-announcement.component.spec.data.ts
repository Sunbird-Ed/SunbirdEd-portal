export const mockRes = {
    successData: {
        'id': 'api.plugin.announcement.user.inbox',
        'params': { 'resmsgid': '762edcf0-14bc-11e8-8b1a-61d8476d5e0b', 'msgid': 'null', 'status': 'successful', 'err': '', 'errmsg': '' },
        'responseCode': 'OK', 'result': {
            'count': '842', 'announcements': {
                '0':
                {
                    'attachments': '[]', 'createdDate': '2018-02-06 06:50:11:521+0000',
                    'description': 'test create announcement', 'from': 'ORG_001', 'id': 'fa355310-0b09-11e8-93d1-2970a259a0ba',
                    'links': '[]', 'read': 'true', 'title': 'announcement-6th', 'type': 'Circular'
                }
            }
        }
    },
    inviewData: {
        'inview': [
            {
                'id': 0,
                'data': {
                    'id': 'b9119c20-5ff7-11e8-a84b-979cfc2ceb20',
                    'from': 'ddd',
                    'type': 'Circular',
                    'title': 'ddd',
                    'description': 'ddd',
                    'links': [],
                    'attachments': [],
                    'createdDate': '2018-05-25 08:43:40:130+0000',
                    'status': 'active',
                    'read': false,
                    'received': true
                }
            },
            {
                'id': 1,
                'data': {
                    'id': 'a0c531f0-5f15-11e8-b1a7-c128db8b623b',
                    'from': 'dd',
                    'type': 'Circular',
                    'title': 'dd',
                    'description': 'ddd',
                    'links': [],
                    'attachments': [],
                    'createdDate': '2018-05-24 05:45:13:103+0000',
                    'status': 'active',
                    'read': true,
                    'received': true
                }
            }
        ],
        'direction': 'down'
    }
};

