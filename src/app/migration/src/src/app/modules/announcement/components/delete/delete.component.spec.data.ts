export const mockRes = {
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
        error: {
            'id': 'api.plugin.announcement.cancel', 'ver': '1.0', 'ts': '2018-02-26 08:29:15:944+0000',
            'params': {
                'resmsgid': '219f4a80-1acf-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'failed', 'err': '',
                'errmsg': 'Unauthorized User'
            }, 'responseCode': 'CLIENT_ERROR', 'result': {}
        }
    },
    resourceBundle: {
        'messages': {
            'smsg': {
                'moo41': 'Announcement cancelled successfully...'
            },
            'emsg': {
                'm0005': 'Something went wrong, please try in some time....',
            }
        }
    }
};
