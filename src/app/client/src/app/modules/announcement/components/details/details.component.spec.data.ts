export const mockRes = {
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
    },
    resourceBundle: {
        'messages': {
            'emsg': {
                'm0005': 'Something went wrong, please try in some time....',
            }
        }
    },
    detailsObject: {
        createdDate: '2018-02-25 03:54:26:593+0000',
        description: 'Test description',
        from: 'test',
        id: '92ca4110-19df-11e8-8773-d9334313c305',
        status: 'failed',
        target: '',
        title: 'Test title',
        type: 'Circular'
    }
};
