export const mockUserData = {
    feedSuccessResponse: {
        'id': null,
        'ver': null,
        'ts': null,
        'params': null,
        'responseCode': 'OK',
        'result': {
            'response': {
                'userFeed': [
                    {
                        'expireOn': 1574611273492,
                        'feedData': {
                            'channel': [
                                'TN',
                                'RJ',
                                'AP'
                            ],
                            'order': 1
                        },
                        'createdBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
                        'closable': false,
                        'channel': 'TN',
                        'feedAction': 'unRead',
                        'id': '01289921810742476874',
                        'category': 'orgMigrationAction',
                        'priority': 1,
                        'userId': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
                        'createdOn': 1574611273492
                    }
                ]
            }
        }
    },
    migrateErrorResponseWithAttemptCount: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:02:21:599+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'invalidUserExternalId',
        'result': {
            'maxAttempt': 2,
            'remainingAttempt': 2,
            'error': true,
            'message': 'provided ext user id bt240 is incorrect'
        }
    },
    migrateErrorResponseWithNoAttemptCount: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:02:21:599+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'invalidUserExternalId',
        'result': {
            'maxAttempt': 2,
            'remainingAttempt': 0,
            'error': true,
            'message': 'provided ext user id bt240 is incorrect'
        }
    },
    migrateSuccessResponse: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:02:28:841+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'errors': []
        }
    },
    migrateErrorResponse: {
        'id': 'api.user.migrate',
        'ver': 'v1',
        'ts': '2019-11-18 18:01:13:308+0530',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': 'USER_MIGRATION_FAILED',
            'status': 'USER_MIGRATION_FAILED',
            'errmsg': 'user is failed to migrate'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    }
};
